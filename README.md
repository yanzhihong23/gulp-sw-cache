# gulp-sw-cache

> Add Offline Cache for WebApp. Submitted by [Hom Yan](https://github.com/yanzhihong23)

## Usage

First, install `gulp-sw-cache` as a dev dependency

~~~shell
npm install gulp-sw-cache --save-dev
~~~

Then, include `sw.controller.js` in html, and add below to register serviceWorker.

~~~javascript
if(condition) new SwController()
~~~

## API

### Parameters

### sw(options)

This controls how this task (and its helpers) operate and should contain key:value pairs, see options below.

#### options.versionPrefix
Type: `String`  
Default: `sw`

Add a cache version prefix.

#### options.exclude
Type: `String` `Array`  
Default: `undefined`

Exclude specific files from the Cache file list.

### Usage Example

~~~javascript
  gulp.task('offline', function() {
    gulp.src(path.join('src', '/**/*'))
      .pipe(sw({
        exclude: ['index.html'],
        versionPrefix: 'test'
      }))
      .pipe(gulp.dest('dist'))
  });
~~~
