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

namespace acgallery
{
    public class FileUploadResult
    {
        public String FileUrl { get; set; }
        public String ThumbnailFileUrl { get; set; }
        public String FileFormat { get; set; }
        public DateTime UploadedTime { get; set; }
        public String OrgFileName { get; set; }

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
        public async Task<IActionResult> Index(ICollection<IFormFile> files)
        {
            var uploads = Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot/uploads");
            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }
            List<FileUploadResult> listResults = new List<FileUploadResult>();

            if (files.Count > 0)
            {
                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        var nid = Guid.NewGuid();
                        String nfilename = nid.ToString() + ".jpg";
                        listResults.Add(new FileUploadResult
                        {
                            FileUrl = "/uploads/" + nfilename,
                            OrgFileName = file.FileName,
                            UploadedTime = DateTime.Now
                        });
                        using (var fileStream = new FileStream(Path.Combine(uploads, nfilename), FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                        }
                    }
                }
            } 
            else if (Request.Form.Files.Count > 0)
            {
                foreach (var file in Request.Form.Files)
                {
                    if (file.Length > 0)
                    {
                        var nid = Guid.NewGuid();
                        String nfilename = nid.ToString() + ".jpg";
                        String nthumbfilename = nid.ToString() + ".thumb.jpg";
                        _logger.LogInformation("Target file: {0}", nfilename);
                        System.Diagnostics.Debug.WriteLine("Target file: {0}", nfilename);
                        var rst = new FileUploadResult
                        {
                            FileUrl = "/uploads/" + nfilename,
                            ThumbnailFileUrl = "/uploads/" + nthumbfilename,
                            OrgFileName = file.FileName,
                            UploadedTime = DateTime.Now
                        };

                        using (var fileStream = new FileStream(Path.Combine(uploads, nfilename), FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);

#if USEMAGIC

                            using (MagickImage image = new MagickImage(Path.Combine(uploads, nfilename)))
                            {
                                // Retrieve the exif information
                                ExifProfile profile = image.GetExifProfile();

                                // Check if image contains an exif profile
                                if (profile == null)
                                    Console.WriteLine("Image does not contain exif information.");
                                else
                                {
                                    // Write all values to the console
                                    foreach (ExifValue value in profile.Values)
                                    {
                                        _logger.LogInformation("{0}({1}): {2}", value.Tag, value.DataType, value.ToString());
                                        System.Diagnostics.Debug.WriteLine("{0}({1}): {2}", value.Tag, value.DataType, value.ToString());
                                    }
                                }

                                using (MagickImage thumbnail = profile.CreateThumbnail())
                                {
                                    // Check if exif profile contains thumbnail and save it
                                    if (thumbnail != null)
                                        thumbnail.Write(Path.Combine(uploads, nthumbfilename));
                                    else
                                    {
                                        MagickGeometry size = new MagickGeometry(300, 300);
                                        // This will resize the image to a fixed size without maintaining the aspect ratio.
                                        // Normally an image will be resized to fit inside the specified size.
                                        size.IgnoreAspectRatio = true;

                                        image.Resize(size);

                                        // Save the result
                                        image.Write(Path.Combine(uploads, nthumbfilename));
                                    }
                                }
                            }
#else
                            ExifToolWrapper wrap = new ExifToolWrapper();
                            wrap.Run(Path.Combine(uploads, nfilename));
                            foreach (var item in wrap)
                            {
                                System.Diagnostics.Debug.WriteLine("{0}, {1}, {2}", item.group, item.name, item.value);
                                rst.ExifTags.Add(item);
                            }
#endif
                            listResults.Add(rst);
                        }
                    }
                }
            }

            return new ObjectResult(listResults);
        }
    }
}
