// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  currentVersion: '0.5.90',
  currentReleaseDate: '2023.12.31',
  loggingLevel: 4, // Debug
  basehref: '/',
  mockdata: false,

  apiRootUrl: 'https://localhost:25325/',

  IDServerUrl: 'https://localhost:44353',
  AppHost: 'https://localhost:16001',
  AppHIH: 'https://localhost:29521',
  AppMathExercise: 'https://localhost:20000',
};
