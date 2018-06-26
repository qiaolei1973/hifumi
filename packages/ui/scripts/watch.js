const chokidar = require('chokidar');
const process = require('child_process');

const REFRESH_TIME = 8000;

let time = new Date() - 8000;

console.log('\x1b[36m%s\x1b[0m', '-----------you components are watched-----------');
chokidar.watch('./components')
    .on('all', (event, path) => {
        if (event === 'change') {
            const now = new Date();
            if (now - time > REFRESH_TIME) {
                console.log('\x1b[32m', 'file:' + path + ' changed,file will be relink');
                console.log('\x1b[0m');
                process.execSync('tsc -p ./tsconfig.lib.json && cross-env NODE_ENV=lib node scripts/styleTransform.js', (err, stdout, stderr) => {
                    if (err || stderr) {
                        console.log(err || stderr);
                        return;
                    }
                    console.log(stdout);
                });
                time = now;
            }
        }
    })