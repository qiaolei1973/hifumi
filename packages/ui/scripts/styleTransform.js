const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

const BUILD_ROOT = '../es';
const SRC_DIR = '../components';

const loop = (filePath) => {
    const absolutePath = absolute(filePath)
    const stats = fs.statSync(absolutePath);
    if (stats.isFile()) {
        isCssFile(filePath) && transform(filePath);
        return;
    }
    const files = fs.readdirSync(absolutePath);
    files.forEach((filename) => {
        loop(path.join(filePath, filename));
    })
}

const transform = (filePath) => {
    fs.readFile(absolute(filePath), (err, css) => {
        if (err) {
            console.log(err);
            return;
        } else {
            const buildPath = rePath(filePath);
            const processor = postcss([precss, autoprefixer({
                browsers: [
                    "iOS >= 7",
                    "Android > 4.1",
                    "Firefox > 20",
                    "last 2 versions"
                ]
            })
            ]);
            processor.process(css, {
                from: filePath,
                to: buildPath,
                map: { inline: false },
            })
                .then((result) => {
                    fs.writeFile(absolute(buildPath), result.css, err => {
                        if (err) console.log(err);
                    });
                    console.log('result: ', result);
                    if (result.map) {
                        fs.writeFile((`${absolute(buildPath)}.map`), result.map, err => {
                            if (err) console.log(err);
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    });
}

const rePath = (filePath) => filePath.replace(SRC_DIR, BUILD_ROOT);

const absolute = (filePath) => path.join(__dirname, filePath);

const isCssFile = (filename) => /^css$/.test(filename.split('.').pop());

const excu = () => {
    loop(SRC_DIR);
}

excu();