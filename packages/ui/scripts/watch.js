const chokidar = require('chokidar');
const process = require('child_process');

const REFRESH_TIME = 8000;
let time = new Date() - REFRESH_TIME;

// One-liner for current directory, ignores .dotfiles
chokidar.watch('./components').on('all', (event, path) => {
    const now = new Date();
    if (event === 'change' && now - time > REFRESH_TIME) {
        console.log('\x1b[36m%s\x1b[0m', `the file ${path} changed,component lib will be updated`);
        console.log('\x1b[0m');
        process.exec('npm run build-lib', (err, stdout, stderr) => {
            if (err || stderr) {
                console.log(err || stderr);
                return;
            }
            console.log(stdout);
            console.log("\x1b[32m","update ok!");
            console.log('\x1b[0m');
        });
        time = now;
    }
});