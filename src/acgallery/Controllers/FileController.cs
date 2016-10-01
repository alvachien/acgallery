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
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace acgallery
{
    public class PhotoViewModelBase
    {
        [Required]
        [StringLength(40)]
        public String PhotoId { get; set; }
        [StringLength(50)]
        public String Title { get; set; }
        [StringLength(100)]
        public String Desp { get; set; }
        [StringLength(100)]
        public String FileUrl { get; set; }
        [StringLength(100)]
        public String ThumbnailFileUrl { get; set; }
        public String FileFormat { get; set; }
        public DateTime UploadedTime { get; set; }
        [StringLength(50)]
        public String UploadedBy { get; set;}
        [StringLength(100)]
        public String OrgFileName { get; set; }
        public Boolean IsOrgThumbnail { get; set; }
        public Boolean IsPublic { get; set; }
    }

    public class PhotoViewModel : PhotoViewModelBase
    {
        public List<ExifTagItem> ExifTags = new List<ExifTagItem>();
    }

    public class PhotoViewModelEx : PhotoViewModel
    {
        public PhotoViewModelEx(Boolean bSuc, String strErr = "")
        {
            success = bSuc;
            error = strErr;
        }
        public Boolean success;
        public String error;
    }

    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<FileController> _logger;
        private IAuthorizationService _authorizationService;

        public FileController(IHostingEnvironment env, ILogger<FileController> logger, IAuthorizationService authorizationService)
        {
            _hostingEnvironment = env;
            _logger = logger;
            _authorizationService = authorizationService;
        }

        [HttpPost]
        [Authorize(Policy = "FileUploadPolicy")]
        public async Task<IActionResult> UploadPhotos(ICollection<IFormFile> files)
        {
            var uploads = Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot/uploads");
            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }

            if (Request.Form.Files.Count <= 0)
                return new ObjectResult(new PhotoViewModelEx(false, String.Empty));

            // Only care about the first file
            var file = Request.Form.Files[0];
            if (await _authorizationService.AuthorizeAsync(User, file, "FileSizeRequirementPolicy"))
            {
            }
            else
            {
                return new ObjectResult(new PhotoViewModelEx(false, String.Empty));
            }
#if DEBUG
            foreach (var clm in User.Claims.AsEnumerable())
            {
                System.Diagnostics.Debug.WriteLine("Type = " + clm.Type + "; Value = " + clm.Value);
            }
#endif
            var usrName = User.FindFirst(c => c.Type == "sub").Value;

            var rst = new PhotoViewModelEx(true, String.Empty);
            var filename1 = file.FileName;
            var idx1 = filename1.LastIndexOf('.');
            var fileext = filename1.Substring(idx1);

            rst.PhotoId = Guid.NewGuid().ToString("N");
            rst.FileUrl = "/uploads/" + rst.PhotoId + fileext;
            rst.ThumbnailFileUrl = "/uploads/" + rst.PhotoId + ".thumb" + fileext;
            await AnalyzeFile(file, Path.Combine(uploads, rst.PhotoId + fileext), Path.Combine(uploads, rst.PhotoId + ".thumb" + fileext), rst, usrName);
            rst.UploadedBy = usrName;

            return new ObjectResult(rst);
        }

        [HttpDelete]
        public IActionResult DeleteUploadedFile(String strFile)
        {
            var uploads = Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot/uploads");
            var fileFullPath = Path.Combine(uploads, strFile);
            var filename = Path.GetFileNameWithoutExtension(fileFullPath);
            var fileext = Path.GetExtension(fileFullPath);
            var fileThumbFullPath = Path.Combine(uploads, filename + ".thumb" + fileext);

            // File
            if (System.IO.File.Exists(fileFullPath))
            {
                System.IO.File.Delete(fileFullPath);
            }

            // Thumbnail file
            if (System.IO.File.Exists(fileThumbFullPath))
            {                
                System.IO.File.Delete(fileThumbFullPath);
            }

            return new ObjectResult(new PhotoViewModelEx(true, String.Empty));
        }

        private async Task<IActionResult> AnalyzeFile(IFormFile ffile, String filePath, String thmFilePath, PhotoViewModelEx updrst, String usrName)
        {
            Boolean bThumbnailCreated = false;

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await ffile.CopyToAsync(fileStream);

                try
                {
                    ExifToolWrapper wrap = new ExifToolWrapper();
                    wrap.Run(filePath);

                    foreach (var item in wrap)
                    {
                        System.Diagnostics.Debug.WriteLine("{0}, {1}, {2}", item.group, item.name, item.value);
                        if (item.group != "File")
                            updrst.ExifTags.Add(item);
                    }
                }
                catch (Exception exp)
                {
                    System.Diagnostics.Debug.WriteLine(exp.Message);
                    _logger.LogError(exp.Message);
                }

                try
                {
                    using (MagickImage image = new MagickImage(filePath))
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
                                    thumbnail.Write(thmFilePath);
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
                            image.Write(thmFilePath);
                        }
                    }
                }
                catch (Exception exp)
                {
                    System.Diagnostics.Debug.WriteLine(exp.Message);
                    _logger.LogError(exp.Message);
                }
            }

            updrst.UploadedTime = DateTime.Now;
            updrst.IsOrgThumbnail = bThumbnailCreated;

            return Json(true);
        }
    }
}

