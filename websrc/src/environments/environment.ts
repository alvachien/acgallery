// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  DebugLogging: true,
  
  AlbumAPIUrl: 'http://localhost:25325/api/album',
  PhotoAPIUrl: 'http://localhost:25325/api/photo',
  AlbumPhotoByAlbumAPIUrl: 'http://localhost:25325/api/albumphotobyalbum',
  AlbumPhotoByPhotoAPIUrl: 'http://localhost:25325/api/albumphotobyphoto',
  IDServerUrl: 'http://localhost:41016/',
  ACGalleryCallback: 'http://localhost:1601/logincallback.html',
  ACGalleryLogoutCallback: 'http://localhost:1601/index.html',
  ACGalleryHost: 'http://localhost:1601',
};
