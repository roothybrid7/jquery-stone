var config = exports; // Vanity

//config['Browser unit tests'] = {
//  environment: 'browser',
//  rootPath: '../',
//  libs: [
//    'test/lib/jquery.min.js'
//  ],
//  sources: [
//    'lib/core.js',
//    'lib/formats/**/*.js',
//    'lib/*.js'
//  ],
//  tests: [
//    'test/unit/**/*_test.js'
//  ]
//};

config['Concat unit tests'] = {
  environment: 'browser',
  rootPath: '../',
  libs: [
    'test/lib/jquery.min.js'
  ],
  sources: [
    'dist/jquery-stone.js'
  ],
  tests: [
    'test/unit/**/*_test.js'
  ]
}

//config['e2e tests'] = {
//  extends: 'Browser tests',
//  tests: [
//  ]
//};

