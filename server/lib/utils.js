const fs = require('fs');

function injectFile(filepath, values) {
    if (!values) throw new Error('No values to inject');
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, { encoding: 'utf8' }, (err, file) => {
            if (err) return void reject(err);

            const injected = file.replace(/<script type="inject">(.+?)<\/script>/gs, (match, contents) => {
                const injectedContents = Object.keys(values).reduce((inj, key) => {
                    return inj.replace(new RegExp(`{{ *${key} *}}`, 'g'), JSON.stringify(values[key]));
                }, contents);
                return `<script type="text/javascript">${injectedContents}</script>`;
            });
            resolve(injected);
        });
    });
}

module.exports = {
    inject: injectFile,
};
