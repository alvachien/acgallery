using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using ImageMagick;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Text;

namespace acgallery
{
    public class PhotoViewModelBase
    {
        public String PhotoId { get; set; }
        public String Title { get; set; }
        public String Desp { get; set;  }
        public String FileUrl { get; set; }
        public String ThumbnailFileUrl { get; set; }
        public String FileFormat { get; set; }
        public DateTime UploadedTime { get; set; }
        public String OrgFileName { get; set; }
        public Boolean IsOrgThumbnail { get; set; }
    }

    public class PhotoViewModel : PhotoViewModelBase
    {
        public List<ExifTagItem> ExifTags = new List<ExifTagItem>();
    }

    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<FileController> _logger;

        public FileController(IHostingEnvironment env, ILogger<FileController> logger)
        {
            _hostingEnvironment = env;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> UploadPhotos(ICollection<IFormFile> files)
        {
            var uploads = Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot/uploads");
            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }
            List<PhotoViewModel> listResults = new List<PhotoViewModel>();

            if (files.Count > 0)
            {
                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        await AnalyzeFile(file, uploads, listResults);
                    }
                }
            }
            else if (Request.Form.Files.Count > 0)
            {
                foreach (var file in Request.Form.Files)
                {
                    if (file.Length > 0)
                    {
                        await AnalyzeFile(file, uploads, listResults);
                    }
                }
            }

            return new ObjectResult(listResults);
        }

        private async Task<IActionResult> AnalyzeFile(IFormFile ffile, String uploads, List<PhotoViewModel> listResults)
        {
            var nid = Guid.NewGuid();
            String nfilename = nid.ToString("N") + ".jpg";
            String nthumbfilename = nid.ToString("N") + ".thumb.jpg";
            System.Diagnostics.Debug.WriteLine("Target file: {0}", nfilename);
            Boolean bThumbnailCreated = false;

            var rst = new PhotoViewModel
            {
                FileUrl = "/uploads/" + nfilename,
                ThumbnailFileUrl = "/uploads/" + nthumbfilename,
                OrgFileName = ffile.FileName,
                UploadedTime = DateTime.Now
            };

            using (var fileStream = new FileStream(Path.Combine(uploads, nfilename), FileMode.Create))
            {
                await ffile.CopyToAsync(fileStream);

                try
                {
                    ExifToolWrapper wrap = new ExifToolWrapper();
                    wrap.Run(Path.Combine(uploads, nfilename));

                    foreach (var item in wrap)
                    {
                        System.Diagnostics.Debug.WriteLine("{0}, {1}, {2}", item.group, item.name, item.value);
                        rst.ExifTags.Add(item);
                    }
                    listResults.Add(rst);
                }
                catch (Exception exp)
                {
                    System.Diagnostics.Debug.WriteLine(exp.Message);
                    _logger.LogError(exp.Message);
                }

                try
                {
                    using (MagickImage image = new MagickImage(Path.Combine(uploads, nfilename)))
                    {
                        // Retrieve the exif information
                        ExifProfile profile = image.GetExifProfile();
                        if (profile != null)
                        {
                            using (MagickImage thumbnail = profile.CreateThumbnail())
                            {
                                // Check if exif profile contains thumbnail and save it
                                if (thumbnail != null)
                                {
                                    thumbnail.Write(Path.Combine(uploads, nthumbfilename));
                                    bThumbnailCreated = true;
                                }
                            }
                        }

                        if (!bThumbnailCreated)
                        {
                            MagickGeometry size = new MagickGeometry(256, 256);
                            // This will resize the image to a fixed size without maintaining the aspect ratio.
                            // Normally an image will be resized to fit inside the specified size.
                            size.IgnoreAspectRatio = false;

                            image.Resize(size);

                            // Save the result
                            image.Write(Path.Combine(uploads, nthumbfilename));
                        }
                    }
                }
                catch (Exception exp)
                {
                    System.Diagnostics.Debug.WriteLine(exp.Message);
                    _logger.LogError(exp.Message);
                }
            }

            PhotoViewModel vmobj = new PhotoViewModel();
            vmobj.PhotoId = nid.ToString("N");
            vmobj.Title = vmobj.PhotoId;
            vmobj.Desp = vmobj.PhotoId;
            vmobj.UploadedTime = DateTime.Now;
            vmobj.OrgFileName = rst.OrgFileName;
            vmobj.FileUrl = rst.FileUrl;
            vmobj.ThumbnailFileUrl = rst.ThumbnailFileUrl;
            vmobj.IsOrgThumbnail = bThumbnailCreated;
            foreach (var par in rst.ExifTags)
                vmobj.ExifTags.Add(par);

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://achihapi.azurewebsites.net/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                await client.PostAsync("api/photo", new StringContent(JsonConvert.SerializeObject(vmobj).ToString(),
                    Encoding.UTF8, "application/json"));
            }

            return Json(true);
        }
    }
}
