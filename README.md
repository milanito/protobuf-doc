# protobuf-doc

Protobuf Documentation Generator in NodeJS

# Install

Simply do :

    $ npm install

Then link the executable

    $ npm link

# Use it

In your folder, you need a `protobuf-doc.yaml` file, with the following params :

    src: ‘.’ // Where to find the files
    dest: ‘./doc’ // Where to put the doc

Then enter the command

    $ protobuf-doc

You can also use by providing a custome file :

    $ protobuf-doc -c <config-file>

This will generate a site in the `dest` folder. Then you can browse it using
a static site server, for example with [http-server](https://www.npmjs.com/package/http-server) :

    $ npm install http-server -g
    $ cd doc
    $ hs

The documentation for the moment is a simple angular app

See the `protobuf-doc -h` command for help

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
* Improve documentation
