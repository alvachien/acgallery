using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace acgallery
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class NotFoundMiddleware
    {
        private readonly RequestDelegate _next;

        public NotFoundMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            string path = httpContext.Request.Path;

            await _next(httpContext);

            if (httpContext.Response.StatusCode == 404)
            {
                System.Diagnostics.Debug.WriteLine("Failed: " + httpContext.Request.Path);
            }
            //if (httpContext.Response.StatusCode == 404 && !path.StartsWith("/api") && !path.StartsWith("/index.html") && !path.StartsWith("/libs") && !path.StartsWith("/app"))
            //{
            //    string indexPath = "/index.html";
            //    //string fullPath = httpContext.Request.PathBase +
            //    //                  correctedPath + httpContext.Request.QueryString;
            //    httpContext.Response.Redirect(indexPath, permanent: true);
            //    return;
            //}
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class NotFoundMiddlewareExtensions
    {
        public static IApplicationBuilder UseNotFoundMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<NotFoundMiddleware>();
        }
    }
}
