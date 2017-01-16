var fs = require('fs');
var request = require('request');
var async = require('async');
var flatten = require('lodash/array/flatten');

var createFileReadingCommand = function (generateOutput) {

    return function (stdin, fileName, done) {
        if (stdin) {
            done(null, generateOutput(stdin));
        } else {
            fs.readFile(__dirname + '/' + fileName, function (err, contents) {
                if (err) return done(err);
                done(null, generateOutput(contents.toString()));
            });
        }
    };

};

module.exports = {
    pwd: function (stdin, file, done) {
        done(null, process.cwd());
    },
    date: function (stdin, file, done) {
        done(null, new Date().toString());
    },
    ls: function (stdin, file, done) {
        fs.readdir(__dirname, function (err, files) {
            if (err) return done(err);
            done(null, files.join('\n'));
        });
    },
    echo: function (stdin, value, done) {
        done(null, stdin ? stdin : value);
    },
    cat: createFileReadingCommand(function (contents) {
        return contents;
    }),
    head: createFileReadingCommand(function (contents) {
        return contents.split('\n').slice(0, 5).join('\n');
    }),
    tail: createFileReadingCommand(function (contents) {
        return contents.split('\n').slice(-5).join('\n');
    }),
    sort: createFileReadingCommand(function (contents) {

        var lines = contents.split('\n');

        var sortedLines = lines.sort(function (lineA, lineB) {
            return lineA > lineB ? 1 : -1;
        });

        return sortedLines.join('\n');

    }),
    wc: createFileReadingCommand(function (contents) {
        var lines = contents.split('\n');
        return lines.length.toString();
    }),
    uniq: createFileReadingCommand(function (contents) {

        var lines = contents.split('\n');

        var uniqueLines = lines.reduce(function (lines, currentLine) {
            if (currentLine !== lines[lines.length - 1]) {
                lines = lines.concat([currentLine]);
            }
            return lines;
        }, []);

        return uniqueLines.join('\n');

    }),
    curl: function (stdin, url, done) {
        request.get(stdin ? stdin : url, function (err, response) {
            if (err) return done(err);
            done(null, response.body);
        });
    },
    grep: function (stdin, term, done) {

        if (!stdin) return done(null, '');

        var lines = stdin.split('\n');

        var matchingLines = lines.filter(function (line) {
            return line.indexOf(term) !== -1;
        });

        done(null, matchingLines.join('\n'));

    },
    find: function (stdin, path, done) {

        var readDirRecursive = function (dirName, readDone) {
            fs.readdir(dirName, function (err, files) {
                if (err) return readDone(err);
                async.map(files, function (file, done) {
                    var foundFiles = [dirName + '/' + file];
                    fs.stat(dirName + '/' + file, function (err, stat) {
                        if (err) return readDone(err);
                        if (stat.isDirectory()) {
                            readDirRecursive(dirName + '/' + file, function (err, moreFiles) {
                                if (err) return readDone(err);
                                foundFiles = foundFiles.concat(moreFiles);
                                done(null, foundFiles);
                            });
                        } else {
                            done(null, foundFiles);
                        }
                    });
                }, function (err, mappedFiles) {
                    if (err) return readDone(err);
                    readDone(null, mappedFiles);
                });
            });

        };

        readDirRecursive(path, function (err, files) {
            if (err) return done(err);
            var files = flatten(files, true);
            done(null, [path].concat(files).join('\n'));
        });

    }
};
