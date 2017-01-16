var commands = require('./commands');

// Output a prompt
process.stdout.write('$ ');

// The stdin 'data' event fires after a user types in a line
process.stdin.on('data', function (data) {

    var input = data.toString();

    var cmds = input.split('|').map(function (segment) {
        return segment.trim();
    });

    var runCommand = function (prevOutput) {

        var cmdParts = cmds.shift().split(' ');

        commands[cmdParts[0]](prevOutput, cmdParts[1], function (err, output) {

            if (err) return console.error(err);

            if (cmds.length) {
                runCommand(output);
            } else {
                process.stdout.write(output);
                process.stdout.write('\n$ ');
            }

        });

    };

    runCommand();

});