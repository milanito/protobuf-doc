# Protocol Buffer Documentation Generator

# Introduction

This project is a node module and executable that can be used to generator
[Protocol Buffer](https://developers.google.com/protocol-buffers/?hl=en).

This will generate an [AngularJS](https://angularjs.org) application which
will display the documentation for your schemas.

I made this project because I could not find any tools that would do what I
needed. Thus this project is built following my needs. There are many flows
and enhanced I can make, and I’ll try to do as much as I can along the way

## Summary

* [Installation](#installation)
* [Usage](#usage)
* [Build](#build)
* [Theme](#theme)
* [TODO](#todo)

# Installation

**WARNING : The module has not been pushed yet, this part is not to be followed yet**

## Executable

To install the executable simply do :

    $ npm install -g protobuf-doc

The executable will be available as the `protobuf-doc` command.

## Module

To add the module to your project, do the following in your project directory :

    $ npm install protobuf-doc --save

The module will be available as follow :

    var protobufdoc = require(‘protobuf-doc’);

# Usage

## Executable

You have several options to use the `protobuf-doc` with. To display all available, use :

    $ protobuf-doc -h // --help

By default the `protobuf-app` will use the `protobuf-doc.yaml` in the directory from where
you launch the executable, and the `default` theme.

To change that you can use the `-f (--config)` and `-t (--theme)` options to change this behavior :

    $ protobuf-doc -f /path/to/my/config.yaml // Use another config
    $ protobuf-doc -t mytheme // Use another theme
    $ protobuf-doc -f /another/config.yaml -t anothertheme // All at once

To browse the application, you can use the `-c (--connect)` option. This will launch a
web server on the `8080` port, for you to use.

    $ protobuf -c // Use the default protobuf-doc.yaml file and launch the web server

The website will be available at http://0.0.0.0:8080

### Config File

The configuration file is a `YAML` file which contains only two options :

* `src`: Path from where to fetch the schemas
* `dest`: Path to where copy the documentation

Of course, if you use the module, you need to provide a Javascript Object with at least
those two parameters.

## Module

To use the module in your project, you can use the `withConfigObject` function, providing
it the configuration as a JavaScript Object :

    var protobufdoc = require(‘protobuf-doc’);

    protobufdoc.withConfigObject({
        src: ‘./src’,
        dest: ‘./doc’
    });

This will generate the AngularJS application in the `doc` folder from the schemas it has
found in the `src` folder.

# Build

After you clone the project, you can simply do :

    $ npm install

To download the project’s dependencies.

After you made some changes, you can link the executable

    $ npm link

This will make available the `protobuf-doc` executable.

# Theme

Creating a theme is fairly easy: Theme are angularjs js with the current structure

    theme_name
    +-- index.html
    +-- scripts
    |   +-- app.js
    |   +-- [All other javscript scripts]
    +-- styles
    |   +-- [All css]
    +-- views
    |   +-- [All templates in html]

You need to have a string `{%data%}` in your `app.js` file, it will be replace by the parsed data.
The easiest way to manipulate it is to use a factory like in the default theme.

    .factory(‘data’, [function() {
        return JSON.parse(‘{%data%}’)
    }])

Check the default theme for more detail, it is a very simple application.

After that, put your theme in the `templates` directory and use it like this :

    $ protobuf-doc -t <your_theme_name>

# TODO

* Handle comments
* Display other params
* Enhance default theme
