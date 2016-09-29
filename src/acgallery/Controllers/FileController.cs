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

    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<FileController> _logger;
        private IAuthorizationService _authorizationService;

#if DEBUG
        internal const String connStr = @"Data Source=QIANH-LAPTOP1;Initial Catalog=ACGallery;Integrated Security=SSPI;";
#endif

        public FileController(IHostingEnvironment env, ILogger<FileController> logger, IAuthorizationService authorizationService)
        {
            _hostingEnvironment = env;
            _logger = logger;
            _authorizationService = authorizationService;
        }

        [HttpGet]
        public List<PhotoViewModel> Get()
        {
#if DEBUG
            List<PhotoViewModel> listVMs = new List<PhotoViewModel>();
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();

                String cmdText = @"SELECT [PhotoID]
                          ,[Title]
                          ,[Desp]
                          ,[UploadedAt]
                          ,[UploadedBy]
                          ,[OrgFileName]
                          ,[PhotoUrl]
                          ,[PhotoThumbUrl]
                          ,[IsOrgThumb]
                          ,[ThumbCreatedBy]
                          ,[CameraMaker]
                          ,[CameraModel]
                          ,[LensModel]
                          ,[AVNumber]
                          ,[ShutterSpeed]
                          ,[ISONumber]
                          ,[IsPublic]
                          ,[EXIFInfo]
                      FROM [ACGallery].[dbo].[Photo]
                      WHERE [IsPublic] = 1";
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        PhotoViewModel vm = new PhotoViewModel();
                        vm.PhotoId = reader.GetString(0);
                        vm.Title = reader.GetString(1);
                        if (!reader.IsDBNull(2))
                            vm.Desp = reader.GetString(2);
                        if (!reader.IsDBNull(3))
                            vm.UploadedTime = reader.GetDateTime(3);
                        // UploadedBy
                        if (!reader.IsDBNull(5))
                            vm.OrgFileName = reader.GetString(5);
                        vm.FileUrl = reader.GetString(6);
                        if (!reader.IsDBNull(7))
                            vm.ThumbnailFileUrl = reader.GetString(7);
                        if (!reader.IsDBNull(16))
                            vm.IsPublic = reader.GetBoolean(16);
                        if (!reader.IsDBNull(17))
                            vm.ExifTags = JsonConvert.DeserializeObject<List<ExifTagItem>>(reader.GetString(17));

                        listVMs.Add(vm);
                    }
                }
            }

            return listVMs;
#else
            var client = new HttpClient();
            try
            {
                client.BaseAddress = new Uri("http://achihapi.azurewebsites.net/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                String str = client.GetStringAsync("api/photo").Result;

                return JsonConvert.DeserializeObject<List<PhotoViewModel>>(str);
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
            }

            return new List<PhotoViewModel>();
#endif
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
            List<PhotoViewModel> listResults = new List<PhotoViewModel>();
            Boolean bPreValid = true; ;

            if (files.Count > 0)
            {
                foreach (var file in files)
                {
                    if (await _authorizationService.AuthorizeAsync(User, file, "FileSizeRequirementPolicy"))
                    {
                    }
                    else
                    {
                        bPreValid = false;
                        break;
                    }
                }
                if (!bPreValid)
                    return new ObjectResult(false);

                var usrName = User.FindFirst(c => c.Type == "sub").Value;
                foreach (var file in files)
                {
                     await AnalyzeFile(file, uploads, listResults, usrName);
                }
            }
            else if (Request.Form.Files.Count > 0)
            {
                foreach (var file in Request.Form.Files)
                {
                    if (await _authorizationService.AuthorizeAsync(User, file, "FileSizeRequirementPolicy"))
                    {
                    }
                    else
                    {
                        bPreValid = false;
                        break;
                    }
                }
                if (!bPreValid)
                    return new ObjectResult(false);

                foreach(var clm in User.Claims.AsEnumerable())
                {
                    System.Diagnostics.Debug.WriteLine("Type = " + clm.Type + "; Value = " + clm.Value);
                }
                var usrName = User.FindFirst(c => c.Type == "sub").Value;
                foreach (var file in Request.Form.Files)
                {
                    await AnalyzeFile(file, uploads, listResults, usrName);
                }
            }

            return new ObjectResult(listResults);
        }

        private async Task<IActionResult> AnalyzeFile(IFormFile ffile, String uploads, List<PhotoViewModel> listResults, String usrName)
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
                        if (item.group != "File")
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
            vmobj.UploadedBy = usrName;            
            vmobj.OrgFileName = rst.OrgFileName;
            vmobj.FileUrl = rst.FileUrl;
            vmobj.ThumbnailFileUrl = rst.ThumbnailFileUrl;
            vmobj.IsOrgThumbnail = bThumbnailCreated;
            foreach (var par in rst.ExifTags)
                vmobj.ExifTags.Add(par);

#if DEBUG
            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    String cmdText = @"INSERT INTO [dbo].[Photo]
                       ([PhotoID]
                       ,[Title]
                       ,[Desp]
                       ,[UploadedAt]
                       ,[UploadedBy]
                       ,[OrgFileName]
                       ,[PhotoUrl]
                       ,[PhotoThumbUrl]
                       ,[IsOrgThumb]
                       ,[ThumbCreatedBy]
                       ,[CameraMaker]
                       ,[CameraModel]
                       ,[LensModel]
                       ,[AVNumber]
                       ,[ShutterSpeed]
                       ,[ISONumber]
                       ,[IsPublic]
                       ,[EXIFInfo])
                 VALUES
                       (@PhotoID 
                       ,@Title
                       ,@Desp
                       ,@UploadedAt
                       ,@UploadedBy
                       ,@OrgFileName
                       ,@PhotoUrl
                       ,@PhotoThumbUrl
                       ,@IsOrgThumb
                       ,@ThumbCreatedBy
                       ,@CameraMaker
                       ,@CameraModel
                       ,@LensModel
                       ,@AVNumber
                       ,@ShutterSpeed
                       ,@ISONumber
                       ,@IsPublic
                       ,@EXIF
                        )";

                    conn.Open();
                    SqlCommand cmd = new SqlCommand(cmdText, conn);
                    cmd.Parameters.AddWithValue("@PhotoID", vmobj.PhotoId);
                    cmd.Parameters.AddWithValue("@Title", vmobj.Title);
                    cmd.Parameters.AddWithValue("@Desp", vmobj.Desp);
                    cmd.Parameters.AddWithValue("@UploadedAt", vmobj.UploadedTime);
                    cmd.Parameters.AddWithValue("@UploadedBy", vmobj.UploadedBy);
                    cmd.Parameters.AddWithValue("@OrgFileName", vmobj.OrgFileName);
                    cmd.Parameters.AddWithValue("@PhotoUrl", vmobj.FileUrl);
                    cmd.Parameters.AddWithValue("@PhotoThumbUrl", vmobj.ThumbnailFileUrl);
                    cmd.Parameters.AddWithValue("@IsOrgThumb", vmobj.IsOrgThumbnail);
                    cmd.Parameters.AddWithValue("@ThumbCreatedBy", 2); // 1 for ExifTool, 2 stands for others
                    cmd.Parameters.AddWithValue("@CameraMaker", "To-do");
                    cmd.Parameters.AddWithValue("@CameraModel", "To-do");
                    cmd.Parameters.AddWithValue("@LensModel", "To-do");
                    cmd.Parameters.AddWithValue("@AVNumber", "To-do");
                    cmd.Parameters.AddWithValue("@ShutterSpeed", "To-do");
                    cmd.Parameters.AddWithValue("@IsPublic", true);
                    cmd.Parameters.AddWithValue("@ISONumber", 0);

                    String strJson = Newtonsoft.Json.JsonConvert.SerializeObject(vmobj.ExifTags);
                    cmd.Parameters.AddWithValue("@EXIF", strJson);

                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
            }
#else
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://achihapi.azurewebsites.net/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                await client.PostAsync("api/photo", new StringContent(JsonConvert.SerializeObject(vmobj).ToString(),
                    Encoding.UTF8, "application/json"));
            }
#endif

            return Json(true);
        }

        [HttpPut]
        [Authorize(Policy = "PhotoChangePolicy")]
        public async Task<IActionResult> UpdateMetadata([FromBody]PhotoViewModel vm)
        {
            if (vm == null)
            {
                return BadRequest("No data is inputted");
            }

            vm.Title = vm.Title.Trim();
            if (String.IsNullOrEmpty(vm.Title))
            {
                return BadRequest("Title is a must!");
            }

#if DEBUG
            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    String cmdText = @"UPDATE [Photo]
                               SET [Title] = @Title
                                  ,[Desp] = @Desp
                             WHERE [PhotoID] = @PhotoID
                            ";

                    conn.Open();
                    SqlCommand cmd = new SqlCommand(cmdText, conn);
                    cmd.Parameters.AddWithValue("@PhotoID", vm.PhotoId);
                    cmd.Parameters.AddWithValue("@Title", vm.Title);
                    cmd.Parameters.AddWithValue("@Desp", vm.Desp);

                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
            }
            finally
            {

            }

            return new ObjectResult(true);
#else
            var client = new HttpClient();
            try
            {
                client.BaseAddress = new Uri("http://achihapi.azurewebsites.net/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                await client.PutAsync("api/photo", new StringContent(JsonConvert.SerializeObject(vm).ToString(),
                    Encoding.UTF8, "application/json"));
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
                return new ObjectResult(false);
            }

            return new ObjectResult(true);
#endif

        }
    }
}

