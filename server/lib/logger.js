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
const LEVELS = {
    'info': { priority: 2 },
    'log': { priority: 1, color: 'Dim' },
    'debug': { priority: 0, color: 'Bright' },
    'error': { priority: 4, color: 'FgRed' },
    'warn': { priority: 3, color: 'FgYellow' },
};

const moment = require('moment');
function write({ stream, level }, ...args) {
    const timestamp = (new moment()).format('\\[YYYY-MM-DD@HH:mm:ss:SSS\\]');
    if (process.env.NODE_ENV === 'production') {
        stream.write([
            timestamp,
            `[${level}]`,
            ...args,
        ].join(' ') + '\n');
    } else if (level in LEVELS) {
        let color = LEVELS[level].color;
        stream.write([
            `\x1b[90m${timestamp}\x1b[0m `,
            COLOR[color],
            ...args.join(' '),
            COLOR.Reset,
            '\n',
        ].join(''));
    } else {
        stream.write([
            `\x1b[90m${timestamp}\x1b[0m `,
            COLOR.Dim,
            `[${level}] `,
            ...args.join(' '),
            COLOR.Reset,
            '\n',
        ].join(''));
    }
}

const { Writable } = require('stream');
const morgan = require('morgan');
class Logger {
    constructor({ stream = process.stdout, level = 0 } = {}) {
        this.stream = stream;
        this.levels = Object.keys(LEVELS);

        this.levels.forEach((level) => {
            this[level] = (...args) => write({ stream: this.stream, level }, ...args);
        });
    }

    wrap(app) {
        const morganStream = new Writable({
            write: (chunk, encoding, cb) => {
                write({ stream: this.stream, level: 'res' }, chunk.toString().replace(/\n$/, ''));
                cb();
            },
        });
        app.use((req, res, next) => {
            write({ stream: this.stream, level: 'req' }, req.method, req.originalUrl);
            next();
        });
        app.use(morgan('tiny', { stream: morganStream }));
    }
}

module.exports = new Logger();
