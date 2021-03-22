// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  currentVersion: '0.5.9',
  currentReleaseDate: '2021.7.9',
  loggingLevel: 4, // Debug
  basehref: '/',
  mockdata: false,

  apiRootUrl: 'https://localhost:25325/',

  IDServerUrl: 'http://localhost:41016',
  AppLoginCallbackUrl: 'http://localhost:16001/logincallback.html',
  AppLogoutCallbackUrl: 'http://localhost:16001',
  AppHost: 'http://localhost:16001',
  AppHIH: 'http://localhost:29521',
  AppMathExercise: 'http://localhost:20000',
};
