var config = exports; // Vanity

config['Browser unit tests'] = {
  environment: 'browser',
  rootPath: '../',
  libs: [
    'test/lib/jquery.min.js'
  ],
  sources: [
    'lib/core.js',
    'lib/localstorage.js'
  ],
  tests: [
    'test/unit/**/*.js'
  ]
};

//config['e2e tests'] = {
//  extends: 'Browser tests',
//  tests: [
//  ]
//};

