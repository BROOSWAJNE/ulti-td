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
    const timestamp = `\x1b[90m[${new moment().format('YYYY-MM-DD@HH:mm:ss:SSS')}]\x1b[0m`;
    process.stdout.write([
        timestamp,
        COLOR[color],
        ...args,
        COLOR.Reset,
        '\n',
    ].join(''));
}

module.exports = {
    // general purpose
    info: (...args) => output(args),
    // for unimportant logging
    log: (...args) => output(args, 'Dim'),
    // for debugging
    debug: (...args) => output(args, 'Bright'),
    // for errors
    error: (...args) => output(args, 'FgRed'),
    // for warnings
    warn: (...args) => output(args, 'FgYellow'),
};
