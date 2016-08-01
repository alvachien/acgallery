using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace acgallery
{
    public class FileUploadResult
    {
        public String FileUrl { get; set; }
        public String FileFormat { get; set; }
        public DateTime UploadedTime { get; set; }
        public String OrgFileName { get; set; }
    }

    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;

        public FileController(IHostingEnvironment env)
        {
            this._hostingEnvironment = env;
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

            return new ObjectResult(listResults);
        }
    }
}
