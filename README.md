# acgallery
AC Photo Gallery is an open-source web app, which designed to organize your photos via album and provides powerful authority control for sharing.

***Live application***  hosted in [Azure (will be obseleted soon)](http://acgallery.azurewebsites.net).

## Snapshots
![Initial page](https://github.com/alvachien/acgallery/blob/master/docs/images/indexpage.JPG)


![Album List](https://github.com/alvachien/acgallery/blob/master/docs/images/AlbumPage.JPG)
Album list (Just showing the public shared album and the thumnail is grey meaning the album requires Access Code)


![Photo List](https://github.com/alvachien/acgallery/blob/master/docs/images/PhotoListPage.JPG)
Photo List


## Scenarios
A web app need make its scope and supported scenario very clearly.

I had documenteed all scenarios supported by AC Photo Gallery via this [Wiki page](https://github.com/alvachien/acgallery/wiki/Scenarios-Definition).

Do read it through before reading the codes.


## Deployment and Installation
To deploy or install this web app on a server, please read through this [Wiki page](https://github.com/alvachien/acgallery/wiki/Installation-and-Deployment).


## Architectures

### Overlook
This web app using traditional three-layer architecutre.

Sequence diagram of reading photos
 
![Squence Dialgram](https://github.com/alvachien/acgallery/blob/master/SequenceDrm.PNG)

In case cannot see image above, see diagram via the [Link](http://blog.csdn.net/alvachien/article/details/52430970)

The web app allows end user uploads the image files to public folder (the private image will be uploaded to Azure Storage account which not implemented in this open-source version yet), and update the records in the database.

The web app also provides the authority control over the album and photos. The identification upon user is hosted on another Azure application ACIdServer.


## Relevant API/App
- AC ID Server [Github Project](https://github.com/alvachien/acidserver) : an Identity service hosted in [Azure (will be obseleted soon)](http://acidserver.azurewebsites.net);
- AC Gallery API [Github Project](https://github.com/alvachien/acgalleryapi) : an Web API hosted in [Azure (will be obseleted soon)](http://acgalleryapi.azurewebsites.net).


## Credits
AC Photo Gallery web app built with following UI technologies:
- Angular 6;
- Angular Material 2;
- Bootstrap V4;
- TypeScript 2;


Besides, it also using the following server side libaries:
- EXIF Tool [Link] (http://www.sno.phy.queensu.ca/~phil/exiftool/);
- Magick.NET [Link] (https://www.imagemagick.org/)


## Author
**Alva Chien | 钱红俊**

A programmer, and a certificated Advanced Photographer.  
 
Contact me:

1. Via mail: alvachien@163.com. Or,
2. [Check my flickr](http://www.flickr.com/photos/alvachien).

## Licence
MIT
