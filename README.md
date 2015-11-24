[![Build Status](https://travis-ci.org/CookieCookson/ionic-template.svg)](https://travis-ci.org/CookieCookson/ionic-template)

# Ionic Template
Starting block for creating production-ready Ionic Apps. This template comes with pre-made build routines:
* SASS
* JSCS
* JSHint
* Template Caching
* Dependency Injection
* JS/CSS concatenation
* Minification/Obfuscation Hooks

All editable files are located in the www/app folder and are organised using a modular by-feature structure.

## Project setup
* `npm install -g ionic cordova` (Install pre-requisites)
* `npm update` (Download all node packages)
* `bower install` (Download all bower packages)
* `cordova prepare` (Download all cordova plugins in config)
* `cordova platform add PLATFORM_NAME --save` (Add device platform and save to config)
* `gulp config --appId="com.new.id"` (Set reverse domain style id)
* `gulp config --appName="newApp"` (Set app display name)
  
## Development
* `ionic serve` (Serves to localhost:8100)

## Testing
* `$ ionic run PLATFORM_NAME` (Deploys to device/simulator)

## Versioning
Bump updates package.json, bower.json and config.xml
* `gulp bump --patch` (non-breaking bug fixes)
* `gulp bump --minor` (non-breaking features)
* `gulp bump --major` (breaking changes)
* `gulp bump --setversion=1.2.3` (force version)

## Deployment
* `ionic build PLATFORM_NAME --release` (Applies minification/obfuscation)
