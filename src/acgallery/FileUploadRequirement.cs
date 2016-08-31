using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace acgallery
{
    public class FileUploadSizeRequirement : IAuthorizationRequirement
    {
        //public FileUploadSizeRequirement(int minSize, int maxSize)
        public FileUploadSizeRequirement()
        {
            MinimumFileSize = 0;
            MaximumFileSize = 0;
        }

        public int MinimumFileSize { get; set; }
        public int MaximumFileSize { get; set; }
    }

    public class FileUploadSizeHandler : AuthorizationHandler<FileUploadSizeRequirement, IFormFile>
    {
        //protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, FileUploadSizeRequirement requirement)
        //{
        //    if (!context.User.HasClaim(c => c.Type == "GalleryPhotoUploadSize"))
        //    {
        //        return Task.FromResult(0);
        //    }

        //    var sizeStr = context.User.FindFirst(c => c.Type == "GalleryPhotoUploadSize").Value;
        //    if (String.IsNullOrEmpty(sizeStr))
        //        return Task.FromResult(0);

        //    var charIdx = sizeStr.IndexOf('-');
        //    if (charIdx == -1)
        //        return Task.FromResult(0);
        //    var minSize = Convert.ToInt32(sizeStr.Substring(0, charIdx));
        //    var maxSize = Convert.ToInt32(sizeStr.Substring(charIdx + 1));

        //    if (maxSize >= requirement.MaximumFileSize && minSize <= requirement.MinimumFileSize)
        //    {
        //        context.Succeed(requirement);
        //    }

        //    return Task.FromResult(0);
        //}

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, FileUploadSizeRequirement requirement, IFormFile resource)
        {
            if (!context.User.HasClaim(c => c.Type == "GalleryPhotoUploadSize"))
            {
                context.Fail();
                return Task.CompletedTask;
            }

            var sizeStr = context.User.FindFirst(c => c.Type == "GalleryPhotoUploadSize").Value;
            if (String.IsNullOrEmpty(sizeStr))
            {
                context.Fail();
                return Task.CompletedTask;
            }

            var charIdx = sizeStr.IndexOf('-');
            if (charIdx == -1)
            {
                context.Fail();
                return Task.CompletedTask;
            }

            var minSize = Convert.ToInt32(sizeStr.Substring(0, charIdx));
            var maxSize = Convert.ToInt32(sizeStr.Substring(charIdx + 1));

            var fileSize = resource.Length / 1024;
            if (maxSize >= fileSize && minSize <= fileSize)
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}
