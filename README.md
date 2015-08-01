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

This will generate a site in the `dest` folder. Then you can browse it using
a static site server, for example with [http-server](https://www.npmjs.com/package/http-server) :

    $ npm install http-server -g
    $ cd doc
    $ hs

The documentation for the moment is a simple angular app

# TODO

* Handle comments
* Handle executable options
* Make help
* Improve documentation
