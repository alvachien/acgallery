# acgallery
AC Photo Gallery is an open-source web app which used to organize photos/albums.
The live application hosted in [Azure] (http://acgallery.azurewebsites.net).

## Architectures
AC Photo Gallery web app built with following technologies:
- ASP.NET Core 1.0 RTM;
- Angular 2 RC5;
- BootStrap V4 Alpha;
- TypeScript 2.0.2;
Besides, it also using the following libaries:
- EXIF Tool;
- FancyBox 3.0 Beta;

The web app allows end user uploads the image files to public folder (the private image will be uploaded to Azure Storage account which not implemented in this open-source version yet), and update the records in the database.
The web app also provides the authority control over the album and photos. The authority part is hosted on another Azure application.

## Relevant API/App
- AC ID Server: an Identity service hosted in [Azure] (http://acidserver.azurewebsites.net);
- AC HIH API: an Web API hosted in [Azure] (http://achihapi.azurewebsites.net).

## Author
Alva Chien
1. Via mail: alvachien@163.com. Or,
2. [Check my flickr] (http://www.flickr.com/photos/alvachien). Or,
3. [Leave comments on my website] (http://www.alvachien.com)

