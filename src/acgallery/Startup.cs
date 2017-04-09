#define USE_MICROSOFTAZURE
// define USE_ALIYUN

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace acgallery
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvcCore()
                .AddJsonFormatters()
                .AddAuthorization(options =>
                {
                    options.AddPolicy("PhotoChangePolicy",
                                      policy =>
                                      {
                                          policy.RequireClaim("GalleryPhotoChange");
                                      });
                    options.AddPolicy("FileUploadPolicy",
                                      policy =>
                                      {
                                          policy.AuthenticationSchemes.Add("Bearer");
                                          policy.RequireAuthenticatedUser();
                                          policy.RequireClaim("GalleryPhotoUpload");
                                      });
                    options.AddPolicy("FileSizeRequirementPolicy",
                                      policy =>
                                      {
                                          policy.AuthenticationSchemes.Add("Bearer");
                                          policy.RequireAuthenticatedUser();
                                          policy.Requirements.Add(new FileUploadSizeRequirement());
                                      });
                });

            services.AddSingleton<IAuthorizationHandler, FileUploadSizeHandler>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            var angularRoutes = new[] {
                "/photo",
                "/album",
                "/credits",
                "/unauthorized",
                "/forbidden",
                "/logout",
                "/about",
                "/home"
            };

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            app.UseIdentityServerAuthentication(new IdentityServerAuthenticationOptions
            {
#if DEBUG
                Authority = "http://localhost:41016",
#else
#if USE_MICROSOFTAZURE
                Authority = "http://acidserver.azurewebsites.net",
#elif USE_ALIYUN
                Authority = "http://118.178.58.187:5100",
#endif
#endif
                RequireHttpsMetadata = false,

                ApiName = "api.acgallery",
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                AuthenticationScheme = "Bearer"
            });

            app.Use(async (context, next) =>
            {
                if (context.Request.Path.HasValue && null != angularRoutes.FirstOrDefault(
                    (ar) => context.Request.Path.Value.StartsWith(ar, StringComparison.OrdinalIgnoreCase)))
                {
                    context.Request.Path = new PathString("/");
                }

                await next();
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseMvc();
        }
    }
}
