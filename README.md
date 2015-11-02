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
* `cordova restore plugins` (Download all cordova plugins)
* `cordova platform add PLATFORM_NAME` (Add device platform)

## Development
* `ionic serve` (Serves to localhost)

## Testing
* `$ ionic run PLATFORM_NAME` (Deploys to device/simulator)

## Deployment
* `ionic build PLATFORM_NAME --release` (Applies minification/obfuscation)