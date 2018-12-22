const moment = require('moment');

const COLOR = {
    undefined: '',
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',
    FgBlack: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',
    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m',
};

function output(args, color) {
    let arg_array = Array.prototype.slice.call(args);

    let timestamp = '\x1b[90m[' + new moment().format('YYYY-MM-DD@HH:mm:ss:SSS') + ']\x1b[0m';

    // eslint-disable-next-line
    console.log.apply(this, [timestamp + COLOR[color]].concat(arg_array).concat(['\x1b[0m']));
}

module.exports = {
    // general purpose
    info: function() {
        output(arguments);
    },
    // for unimportant logging
    log: function() {
        output(arguments, 'Dim');
    },
    // for debugging
    debug: function() {
        output(arguments, 'Bright');
    },
    // for errors
    error: function() {
        output(arguments, 'FgRed');
    },
    // for warnings
    warn: function() {
        output(arguments, 'FgYellow');
    }
};
