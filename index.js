"use strict";

var ejs       = require('ejs'),
    fs        = require('fs'),
    through   = require('through'),
    gutil     = require('gulp-util'),
    path      = require('path'),
    minimatch = require('minimatch'),
    slash     = require('slash'),
    crypto    = require('crypto');


function sw(options) {
  var filename,
      versionPrefix,
      version,
      include,
      exclude,
      files = [],
      cwd;

  options = options || {};

  versionPrefix = options.versionPrefix || 'sw-';
  version = versionPrefix + crypto.createHash('sha256').digest("hex");

  filename = options.filename || 'sw.js';
  include = Array.prototype.concat(options.include || []);
  exclude = Array.prototype.concat(options.exclude || []).concat(include);
  cwd = process.cwd();

  function shouldExcludeFile(filePath) {
    return exclude.some(minimatch.bind(null, filePath));
  }

  function append(file) {
    var filepath;

    if (file.isNull())  return;
    if (file.isStream()) return this.emit('error', new gutil.PluginError('gulp-manifest',  'Streaming not supported'));

    filepath = slash(file.relative);

    if (shouldExcludeFile(filepath)) {
      return;
    }

    console.log('cache file: ' + filepath);

    files.push(filepath);
  }

  function end() {
    var template = fs.readFileSync(__dirname + '/template/sw.js', 'utf8');
    var content = ejs.render(template, {version: version, versionPrefix: versionPrefix, files: files});

    var swFile = new gutil.File({
      cwd: cwd,
      base: cwd,
      path: path.join(cwd, filename),
      contents: new Buffer(content)
    });

    template = fs.readFileSync(__dirname + '/template/sw.controller.js', 'utf8');
    content = ejs.render(template, {filename: filename});;

    var ctrlFile = new gutil.File({
      cwd: cwd,
      base: cwd,
      path: path.join(cwd, 'sw.controller.js'),
      contents: new Buffer(content)
    });

    this.emit('data', swFile);
    this.emit('data', ctrlFile);
    this.emit('end');
  }

  return through(append, end);
}

module.exports = sw;