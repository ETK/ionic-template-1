#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');
var ngAnnotate = require('ng-annotate');
var cssMinifier = new CleanCSS({
    noAdvanced: true, // disable advanced optimizations - selector & property merging, reduction, etc.
    keepSpecialComments: 0 // remove all css comments ('*' to keep all, 1 to keep first comment only)
});

var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platform = process.env.CORDOVA_PLATFORMS;
var cliCommand = process.env.CORDOVA_CMDLINE;

// hook configuration
var isRelease = (cliCommand.indexOf('--release') > -1);
var recursiveFolderSearch = true; // set this to false to manually indicate the folders to process
var foldersToProcess = [ // add other www folders in here if needed (ex. js/controllers)
    'dist_js',
    'dist_css'
];

if (!isRelease) {
    return;
}

switch (platform) {
    case 'android':
        platformPath = path.join(platformPath, platform, 'assets', 'www');
        break;
   case 'ios':
   case 'wp8':
        platformPath = path.join(platformPath, platform, 'www');
        break;
    default:
        console.log('this hook currently does not supports '+platform+' platform');
        return;
}

foldersToProcess.forEach(function(folder) {
    processFiles(path.join(platformPath, folder));
});

function processFiles(dir) {
    fs.readdir(dir, function (err, list) {
        if (err) {
            console.log('processFiles err: ' + err);
            return;
        }
        list.forEach(function(file) {
            file = path.join(dir, file);
            fs.stat(file, function(err, stat) {
                if (recursiveFolderSearch && stat.isDirectory()) {
                    processFiles(file);
                } else{
                    compress(file);
                }
            });
        });
    });
}

function compress(file) {
    var ext = path.extname(file);
    switch(ext) {
        case '.js':
            console.log('uglifying js file ' + file);
            var res = ngAnnotate(String(fs.readFileSync(file)), { add: true });
            var result = UglifyJS.minify(res.src, {
                mangle: true,
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true
                },
                fromString: true
            });
            fs.writeFileSync(file, result.code, 'utf8'); // overwrite the original unminified file
            break;
        case '.css':
            console.log('minifying css file ' + file);
            var source = fs.readFileSync(file, 'utf8');
            var result = cssMinifier.minify(source);
            fs.writeFileSync(file, result, 'utf8'); // overwrite the original unminified file
            break;
        default:
            console.log('encountered a ' + ext + ' file, not compressing it');
            break;
    }
}