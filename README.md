# acgallery
AC Photo Gallery is an open-source web app, which designed to organize photos/albums.

***Live application*** hosted in [Azure] (http://acgallery.azurewebsites.net).

## Scenarios
A web app need make its scope and supported scenario very clearly.

I had documenteed all scenarios supported by AC Photo Gallery via this [Wiki page] (https://github.com/alvachien/acgallery/wiki/Scenarios-Definition).

Do read it through before reading the codes.


## Deployment and Installation
To deploy or install this web app on a server, please read through this [Wiki page] (https://github.com/alvachien/acgallery/wiki/Installation-and-Deployment).


## Architectures
This web app using traditional three-layer architecutre.

Sequence diagram of reading photos
 
![Squence Dialgram](https://github.com/alvachien/acgallery/blob/master/SequenceDrm.PNG)

In case cannot see image above, see diagram via the [Link] (http://blog.csdn.net/alvachien/article/details/52430970)

The web app allows end user uploads the image files to public folder (the private image will be uploaded to Azure Storage account which not implemented in this open-source version yet), and update the records in the database.

The web app also provides the authority control over the album and photos. The identification upon user is hosted on another Azure application ACIdServer.


## Relevant API/App
- AC ID Server: an Identity service hosted in [Azure] (http://acidserver.azurewebsites.net);
- AC HIH API: an Web API hosted in [Azure] (http://achihapi.azurewebsites.net).


## Credits
AC Photo Gallery web app built with following technologies:
- ASP.NET Core 1.0 RTM;
- Angular 2 RC5;
- BootStrap V4 Alpha;
- TypeScript 2.0.2 RC;

Besides, it also using the following libaries:
- EXIF Tool [Link] (http://www.sno.phy.queensu.ca/~phil/exiftool/);
- FancyBox 3.0 Beta 1 [Link] (http://fancyapps.com/fancybox/beta/);
- Alertjs 1.0.12 [Link] (https://alertifyjs.org/); 


## Author
**Alva Chien | 钱红俊**

A programmer, and a certificated Advanced Photographer.  
 
Contact me:

1. Via mail: alvachien@163.com. Or,
2. [Check my flickr] (http://www.flickr.com/photos/alvachien). Or,
3. [Visit my website] (http://www.alvachien.com)

## Licence
MIT
