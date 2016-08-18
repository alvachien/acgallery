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

#if DEBUG
    public class AlbumViewModel
    {
        public Int32 Id { get; set; }
        public String Title { get; set; }
        public String Desp { get; set; }
        public String CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public Boolean IsPublic { get; set; }
        public String AccessCode { get; set; }

        public Int32 PhotoCount { get; set; }
        // First photo
        public String FirstPhotoThumnailUrl { get; set; }
    }
    public class AlbumWithPhotoViewModel : AlbumViewModel
    {
        public List<PhotoViewModelBase> PhotoList = new List<PhotoViewModelBase>();
    }

    [Route("api/album")]
    public class AlbumController : Controller
    {
        internal const String connStr = @"Data Source=QIANH-PC2A;Initial Catalog=ACGallery;Integrated Security=SSPI;";

        // GET: api/album
        [HttpGet]
        public IEnumerable<AlbumViewModel> Get()
        {
            List<AlbumViewModel> listVm = new List<AlbumViewModel>();
            SqlConnection conn = new SqlConnection(connStr);
            try
            {
                String queryString = @"With albumfirstphoto as (select tabb.AlbumID, count(tabb.PhotoID) as PhotoCount, min(tabc.PhotoThumbUrl) as ThumbUrl from dbo.AlbumPhoto as tabb
	                    join dbo.Photo as tabc
	                    on tabb.PhotoID = tabc.PhotoID
	                    group by tabb.AlbumID)
                    select taba.AlbumID, taba.Title, taba.Desp, taba.IsPublic, taba.AccessCode, taba.CreateAt, taba.CreatedBy,
	                    tabb.PhotoCount, tabb.ThumbUrl
	                    from dbo.Album as taba
	                    left outer join albumfirstphoto as tabb
		                    on taba.AlbumID = tabb.AlbumID";

                conn.Open();
                SqlCommand cmd = new SqlCommand(queryString, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        AlbumViewModel avm = new AlbumViewModel();
                        avm.Id = reader.GetInt32(0);
                        avm.Title = reader.GetString(1);
                        if (!reader.IsDBNull(2))
                            avm.Desp = reader.GetString(2);
                        if (!reader.IsDBNull(3))
                            avm.IsPublic = reader.GetBoolean(3);
                        if (!reader.IsDBNull(4))
                            avm.AccessCode = reader.GetString(4);
                        if (!reader.IsDBNull(5))
                            avm.CreatedAt = reader.GetDateTime(5);
                        if (!reader.IsDBNull(6))
                            avm.CreatedBy = reader.GetString(6);
                        if (!reader.IsDBNull(7))
                            avm.PhotoCount = (Int32)reader.GetInt32(7);
                        if (!reader.IsDBNull(8))
                            avm.FirstPhotoThumnailUrl = reader.GetString(8);

                        listVm.Add(avm);
                    }
                }
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
            }
            finally
            {
                conn.Close();
                conn.Dispose();
            }

            return listVm;
        }

        // GET api/album/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            SqlConnection conn = new SqlConnection(connStr);
            AlbumWithPhotoViewModel avm = null;

            try
            {
                String queryString = @"SELECT [AlbumID]
                          ,[Title]
                          ,[Desp]
                          ,[CreatedBy]
                          ,[CreateAt]
                          ,[IsPublic]
                          ,[AccessCode]
                      FROM [dbo].[Album]
                        where [AlbumID] = " + id.ToString();

                conn.Open();
                SqlCommand cmd = new SqlCommand(queryString, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    avm = new AlbumWithPhotoViewModel();
                    while (reader.Read())
                    {
                        avm.Id = reader.GetInt32(0);
                        avm.Title = reader.GetString(1);
                        if (!reader.IsDBNull(2))
                            avm.Desp = reader.GetString(2);
                        if (!reader.IsDBNull(3))
                            avm.CreatedBy = reader.GetString(3);
                        if (!reader.IsDBNull(4))
                            avm.CreatedAt = reader.GetDateTime(4);
                        if (!reader.IsDBNull(5))
                            avm.IsPublic = reader.GetBoolean(5);
                        if (!reader.IsDBNull(6))
                            avm.AccessCode = reader.GetString(6);
                    }
                    reader.Dispose();
                    cmd.Dispose();
                    reader = null;
                    cmd = null;

                    queryString = @"select tabb.[PhotoID]
                       ,tabb.[Title]
                       ,tabb.[Desp]
                       ,tabb.[UploadedAt]
                       ,tabb.[UploadedBy]
                       ,tabb.[OrgFileName]
                       ,tabb.[PhotoUrl]
                       ,tabb.[PhotoThumbUrl]
                       ,tabb.[IsOrgThumb]
                       ,tabb.[ThumbCreatedBy]
                       ,tabb.[CameraMaker]
                       ,tabb.[CameraModel]
                       ,tabb.[LensModel]
                       ,tabb.[AVNumber]
                       ,tabb.[ShutterSpeed]
                       ,tabb.[ISONumber]
                       ,tabb.[IsPublic]
                       ,tabb.[EXIFInfo]
	                 from dbo.AlbumPhoto as taba
	                left outer join dbo.Photo as tabb
		                on taba.PhotoID = tabb.PhotoID
	                where taba.AlbumID = " + id.ToString();

                    cmd = new SqlCommand(queryString, conn);
                    reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            PhotoViewModelBase pvm = new PhotoViewModelBase();
                            //cmd.Parameters.AddWithValue("@PhotoID", nid.ToString("N"));   // 1
                            pvm.PhotoId = reader.GetString(0);
                            //cmd.Parameters.AddWithValue("@Title", nid.ToString("N"));     // 2
                            pvm.Title = reader.GetString(1);
                            //cmd.Parameters.AddWithValue("@Desp", nid.ToString("N"));      // 3
                            if (!reader.IsDBNull(2))
                                pvm.Desp = reader.GetString(2);
                            //cmd.Parameters.AddWithValue("@UploadedAt", DateTime.Now);     // 4
                            if (!reader.IsDBNull(3))
                                pvm.UploadedTime = reader.GetDateTime(3);
                            //cmd.Parameters.AddWithValue("@UploadedBy", "Tester");         // 5
                            //cmd.Parameters.AddWithValue("@OrgFileName", rst.OrgFileName); // 6
                            if (!reader.IsDBNull(5))
                                pvm.OrgFileName = reader.GetString(5);
                            //cmd.Parameters.AddWithValue("@PhotoUrl", rst.FileUrl);        // 7
                            pvm.FileUrl = reader.GetString(6); // 7 - 1
                            //cmd.Parameters.AddWithValue("@PhotoThumbUrl", rst.ThumbnailFileUrl); // 8
                            if (!reader.IsDBNull(7)) // 8 - 1
                                pvm.ThumbnailFileUrl = reader.GetString(7);

                            avm.PhotoList.Add(pvm);
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
            }
            finally
            {
                conn.Close();
                conn.Dispose();
            }

            if (avm != null)
                return new ObjectResult(avm);

            return NotFound();
        }
    }
#endif

    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<FileController> _logger;

#if DEBUG
        internal const String connStr = @"Data Source=QIANH-PC2A;Initial Catalog=ACGallery;Integrated Security=SSPI;";
#endif

        public FileController(IHostingEnvironment env, ILogger<FileController> logger)
        {
            _hostingEnvironment = env;
            _logger = logger;
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
                      FROM [ACGallery].[dbo].[Photo]";
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while(reader.Read())
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

#if DEBUG
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
                       (@PhotoID, 
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
                       ,@EXIFInfo
                        )";

                conn.Open();
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.Parameters.AddWithValue("@PhotoID", vmobj.PhotoId);
                cmd.Parameters.AddWithValue("@Title", vmobj.Title);
                cmd.Parameters.AddWithValue("@Desp", vmobj.Desp);
                cmd.Parameters.AddWithValue("@UploadedAt", vmobj.UploadedTime);
                cmd.Parameters.AddWithValue("@UploadedBy", "Tester");
                cmd.Parameters.AddWithValue("@OrgFileName", vmobj.OrgFileName);
                cmd.Parameters.AddWithValue("PhotoUrl", vmobj.FileUrl);
                cmd.Parameters.AddWithValue("@PhotoThumbUrl", vmobj.ThumbnailFileUrl);
                cmd.Parameters.AddWithValue("@IsOrgThumb", vmobj.IsOrgThumbnail);
                cmd.Parameters.AddWithValue("@ThumbCreatedBy", 2);
                cmd.Parameters.AddWithValue("@CameraMaker", DBNull.Value);
                cmd.Parameters.AddWithValue("@CameraModel", DBNull.Value);
                cmd.Parameters.AddWithValue("@LensModel", DBNull.Value);
                cmd.Parameters.AddWithValue("@AVNumber", DBNull.Value);
                cmd.Parameters.AddWithValue("@ShutterSpeed", DBNull.Value);
                cmd.Parameters.AddWithValue("@ISONumber", DBNull.Value);
                cmd.Parameters.AddWithValue("@IsPublic", 1);
                cmd.Parameters.AddWithValue("@EXIFInfo", DBNull.Value);

                cmd.ExecuteNonQuery();
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
    }
}
