using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Routing;

namespace acgallery
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddMvcCore()
            //    .AddJsonFormatters();

            //services.AddRouting();

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseMvc();

            //var trackPackageRouteHandler = new RouteHandler(context =>
            //{
            //    var routeValues = context.GetRouteData().Values;
            //    return context.Response.WriteAsync(
            //        $"Hello! Route values: {string.Join(", ", routeValues)}");
            //});

            //var routeBuilder = new RouteBuilder(app, trackPackageRouteHandler);

            //routeBuilder.MapRoute(
            //    "Track Package Route",
            //    "package/{operation:regex(^track|create|detonate$)}/{id:int}");

            //routeBuilder.MapGet("hello/{name}", context =>
            //{
            //    var name = context.GetRouteValue("name");
            //    // This is the route handler when HTTP GET "hello/<anything>"  matches
            //    // To match HTTP GET "hello/<anything>/<anything>, 
            //    // use routeBuilder.MapGet("hello/{*name}"
            //    return context.Response.WriteAsync($"Hi, {name}!");
            //});

            //var routes = routeBuilder.Build();
            //app.UseRouter(routes);

            app.UseMvc(routes =>
            {
                //routes.MapRoute(
                //    name: "default",
                //    template: "{controller=Home}/{action=Index}");

                routes.MapRoute("AngularDeepLinkingRoute", "{*url}",
                    new { controller = "Home", action = "Index" });
            });
            //app.UseNotFoundMiddleware();
        }
    }
}
