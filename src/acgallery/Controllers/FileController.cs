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
        [StringLength(100)]
        public String OrgFileName { get; set; }
        public Boolean IsOrgThumbnail { get; set; }
        public Boolean IsPublic { get; set; }
    }

    public class PhotoViewModel : PhotoViewModelBase
    {
        public List<ExifTagItem> ExifTags = new List<ExifTagItem>();
    }

#if DEBUG
    public class AlbumViewModel
    {
        public Int32 Id { get; set; }
        [Required]
        [StringLength(50)]
        public String Title { get; set; }
        [StringLength(100)]
        public String Desp { get; set; }
        [StringLength(50)]
        public String CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public Boolean IsPublic { get; set; }
        [StringLength(50)]
        public String AccessCode { get; set; }

        public Int32 PhotoCount { get; set; }
        // First photo
        public String FirstPhotoThumnailUrl { get; set; }
    }
    public class AlbumWithPhotoViewModel : AlbumViewModel
    {
        public List<PhotoViewModel> PhotoList = new List<PhotoViewModel>();
    }
    public class AlbumPhotoLinkViewModel
    {
        [Required]
        public Int32 AlbumID { get; set; }
        [Required]
        [StringLength(40)]
        public String PhotoID { get; set; }
    }

    public class AlbumPhotoByAlbumViewModel
    {
        [Required]
        public Int32 AlbumID { get; set; }
        public List<String> PhotoIDList = new List<string>();
    }

    public class AlbumPhotoByPhotoViewModel
    {
        [Required]
        [StringLength(40)]
        public String PhotoID { get; set; }
        public List<Int32> AlbumIDList = new List<Int32>();
    }

    [Route("api/album")]
    public class AlbumController : Controller
    {
        //internal const String connStr = @"Data Source=QIANH-PC2A;Initial Catalog=ACGallery;Integrated Security=SSPI;";
        internal const String connStr = @"Data Source=QIANH-LAPTOP1;Initial Catalog=ACGallery;Integrated Security=SSPI;";

        // GET: api/album
        [HttpGet]
        public IEnumerable<AlbumViewModel> Get([FromQuery] String photoid = null)
        {
            List<AlbumViewModel> listVm = new List<AlbumViewModel>();
            SqlConnection conn = new SqlConnection(connStr);
            String queryString = "";

            try
            {
                if (String.IsNullOrEmpty(photoid))
                {
                    queryString = @"With albumfirstphoto as (select tabb.AlbumID, count(tabb.PhotoID) as PhotoCount, min(tabc.PhotoThumbUrl) as ThumbUrl from dbo.AlbumPhoto as tabb
	                    join dbo.Photo as tabc
	                    on tabb.PhotoID = tabc.PhotoID
	                    group by tabb.AlbumID)
                    select taba.AlbumID, taba.Title, taba.Desp, taba.IsPublic, taba.AccessCode, taba.CreateAt, taba.CreatedBy,
	                    tabb.PhotoCount, tabb.ThumbUrl
	                    from dbo.Album as taba
	                    left outer join albumfirstphoto as tabb
		                    on taba.AlbumID = tabb.AlbumID";
                }
                else
                {
                    queryString = @"With albumfirstphoto as (
	                        select tabb.AlbumID, count(tabb.PhotoID) as PhotoCount, min(tabc.PhotoThumbUrl) as ThumbUrl from dbo.AlbumPhoto as tabb
	                        join dbo.Photo as tabc
	                        on tabb.PhotoID = tabc.PhotoID
	                        group by tabb.AlbumID)
                        select taba.AlbumID, taba.Title, taba.Desp, taba.IsPublic, taba.AccessCode, taba.CreateAt, taba.CreatedBy,
	                        tabb.PhotoCount, tabb.ThumbUrl
	                        from dbo.AlbumPhoto as tabc
	                        inner join dbo.Album as taba
		                        on tabc.AlbumID = taba.AlbumID
	                        left outer join albumfirstphoto as tabb
		                        on taba.AlbumID = tabb.AlbumID
                            where tabc.PhotoID = N'";
                    queryString += photoid;
                    queryString += @"'";
                }

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
                            PhotoViewModel pvm = new PhotoViewModel();
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
                            if (!reader.IsDBNull(16))
                                pvm.IsPublic = reader.GetBoolean(16);
                            if (!reader.IsDBNull(17))
                                pvm.ExifTags = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ExifTagItem>>(reader.GetString(17));

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

        // POST api/album
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]AlbumViewModel vm)
        {
            if (vm == null)
            {
                return BadRequest("No data is inputted");
            }

            if (TryValidateModel(vm))
            {
                // Check existence
                //Boolean bExists = _dbContext.KnowledgeType.Any(x => x.Id == vm.ID);
                //if (bExists)
                //{
                //    return BadRequest("ID exists already");
                //}
            }
            else
            {
                return BadRequest();
            }

            // Create it into DB            
            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    String cmdText = @"INSERT INTO [dbo].[Album]
                               ([Title]
                               ,[Desp]
                               ,[CreatedBy]
                               ,[CreateAt]
                               ,[IsPublic]
                               ,[AccessCode])
                         VALUES
                               (@Title
                               ,@Desp
                               ,@CreatedBy
                               ,@CreatedAt
                               ,@IsPublic
                               ,@AccessCode
                                )";
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand(cmdText, conn);
                    cmd.Parameters.AddWithValue("@Title", vm.Title);
                    cmd.Parameters.AddWithValue("@Desp", String.IsNullOrEmpty(vm.Desp) ? String.Empty : vm.Desp);
                    cmd.Parameters.AddWithValue("@CreatedBy", vm.CreatedBy);
                    cmd.Parameters.AddWithValue("@CreatedAt", vm.CreatedAt);
                    cmd.Parameters.AddWithValue("@IsPublic", vm.IsPublic);
                    cmd.Parameters.AddWithValue("@AccessCode", String.IsNullOrEmpty(vm.AccessCode) ? String.Empty : vm.AccessCode);

                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
            }

            return Json(true);
        }

        // PUT api/album/5
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] AlbumViewModel vm)
        {
            if (vm == null)
            {
                return BadRequest("No data is inputted");
            }

            if (vm.Title != null)
                vm.Title = vm.Title.Trim();
            if (String.IsNullOrEmpty(vm.Title))
            {
                return BadRequest("Title is a must!");
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    String cmdText = @"UPDATE [Album]
                               SET [Title] = @Title
                                  ,[Desp] = @Desp
                                  ,[IsPublic] = @IsPublic
                                  ,[AccessCode] = @AccessCode
                             WHERE [AlbumID] = @Id
                            ";

                    conn.Open();
                    SqlCommand cmd = new SqlCommand(cmdText, conn);
                    cmd.Parameters.AddWithValue("@Id", vm.Id);
                    cmd.Parameters.AddWithValue("@Title", vm.Title);
                    if (String.IsNullOrEmpty(vm.Desp))
                        cmd.Parameters.AddWithValue("@Desp", DBNull.Value);
                    else
                        cmd.Parameters.AddWithValue("@Desp", vm.Desp);
                    cmd.Parameters.AddWithValue("@IsPublic", vm.IsPublic);
                    if (vm.AccessCode == null)
                        cmd.Parameters.AddWithValue("@AccessCode", DBNull.Value);
                    else
                        cmd.Parameters.AddWithValue("@AccessCode", vm.AccessCode);

                    await cmd.ExecuteNonQueryAsync();
                    return new ObjectResult(true);
                }
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
            }
            finally
            {
            }

            return new ObjectResult(false);
        }

        // DELETE api/album/5
    }

    [Route("api/albumphotobyalbum")]
    public class AlbumPhotoByAlbumController : Controller
    {
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]AlbumPhotoByAlbumViewModel vm)
        {
            if (vm == null)
            {
                return BadRequest("No data is inputted");
            }

            if (TryValidateModel(vm))
            {
            }
            else
            {
                return BadRequest();
            }

            // Create it into DB            
            try
            {
                using (SqlConnection conn = new SqlConnection(AlbumController.connStr))
                {
                    List<String> listCmds = new List<string>();
                    // Delete the records from album                    
                    String cmdText = @"DELETE FROM [dbo].[AlbumPhoto] WHERE [AlbumID] = " + vm.AlbumID.ToString();
                    listCmds.Add(cmdText);

                    foreach(String pid in vm.PhotoIDList)
                    {
                        cmdText = @"INSERT INTO [dbo].[AlbumPhoto]
                               ([AlbumID]
                               ,[PhotoID])
                         VALUES(" + vm.AlbumID.ToString()
                         + @", N'" + pid
                         + @"')";
                        listCmds.Add(cmdText);
                    }
                    String allQueries = String.Join(";", listCmds);
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand(allQueries, conn);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
                return Json(false);
            }

            return Json(true);
        }
    }

    [Route("api/albumphotobyphoto")]
    public class AlbumPhotoByPhotoController : Controller
    {
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]AlbumPhotoByPhotoViewModel vm)
        {
            if (vm == null)
            {
                return BadRequest("No data is inputted");
            }

            if (TryValidateModel(vm))
            {
            }
            else
            {
                return BadRequest();
            }

            // Create it into DB            
            try
            {
                using (SqlConnection conn = new SqlConnection(AlbumController.connStr))
                {
                    List<String> listCmds = new List<string>();
                    // Delete the records from album                    
                    String cmdText = @"DELETE FROM [dbo].[AlbumPhoto] WHERE [PhotoID] = N'" + vm.PhotoID + "'";
                    listCmds.Add(cmdText);

                    foreach (Int32 aid in vm.AlbumIDList)
                    {
                        cmdText = @"INSERT INTO [dbo].[AlbumPhoto]
                               ([AlbumID]
                               ,[PhotoID])
                         VALUES(" + aid.ToString()
                        + @", N'" + vm.PhotoID
                         + @"')";
                        listCmds.Add(cmdText);
                    }
                    String allQueries = String.Join(";", listCmds);
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand(allQueries, conn);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
                return Json(false);
            }

            return Json(true);
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
                    if (file.Length < 409600 || file.Length > 3145728)
                    {
                        bPreValid = false;
                        break;
                    }
                }
                if (!bPreValid)
                    return new ObjectResult(false);

                foreach (var file in files)
                {
                     await AnalyzeFile(file, uploads, listResults);
                }
            }
            else if (Request.Form.Files.Count > 0)
            {
                foreach (var file in Request.Form.Files)
                {
                    if (file.Length < 409600 || file.Length > 3145728)
                    {
                        bPreValid = false;
                        break;
                    }
                }
                if (!bPreValid)
                    return new ObjectResult(false);

                foreach (var file in Request.Form.Files)
                {
                    await AnalyzeFile(file, uploads, listResults);
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
                    cmd.Parameters.AddWithValue("@UploadedAt", DateTime.Now);
                    cmd.Parameters.AddWithValue("@UploadedBy", "Tester");
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

