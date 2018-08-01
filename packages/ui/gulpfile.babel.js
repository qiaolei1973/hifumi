import gulp from 'gulp';
import path from 'path';
import rimraf from 'rimraf';
import merge2 from 'merge2';
import through2 from 'through2';
import process from 'process';
import minimist from 'minimist';
// import tsConfig from './tsconfig.json';
import transformLess from './scripts/transformLess';
console.log('transformLess: ', transformLess);

const argv = minimist(process.argv.slice(2));
// const tsDefaultReporter = ts.reporter.defaultReporter();
const cwd = process.cwd();
const libDir = path.join(cwd, 'lib');
const esDir = path.join(cwd, 'es');

const compile = (modules) => {
    rimraf.sync(modules !== false ? esDir : libDir);
    const less = gulp.src(['components/**/*.less'])
        .pipe(through2.obj(function (file, encoding, next) {
            this.push(file.clone());
            if (file.path.match(/\.less$/)) {
                transformLess(file.path)
                    .then((css) => {
                        file.contents = Buffer.from(css);
                        file.path = file.path.replace(/\.less$/, '.css');
                        this.push(file);
                        next();
                    })
                    .catch((e) => {
                        console.error(e);
                    })
            } else {
                next();
            }
        }))
        .pipe(gulp.dest(modules === false ? esDir : libDir));

    const assets = gulp.src(['components/**/*.@(png|svg)']).pipe(gulp.dest(modules === false ? esDir : libDir));
    let error = 0;
    const source = [
        'components/**/*.tsx',
        'components/**/*.ts',
        'typings/**/*.d.ts',
    ];

    // const tsResult = gulp.src(source)
    //     .pipe(ts(tsConfig, {
    //         error: (e) => {
    //             tsDefaultReporter.error(e);
    //             error = 1;
    //         },
    //         finish: tsDefaultReporter.finish,
    //     }));

    const check = () => {
        if (error && argv['ignore-error']) {
            process.exit(1);
        }
    }

    // tsResult.on('finish', check);
    // tsResult.on('end', check);
    // const tsFileStream = babelify(tsResult.js, modules);
    // const tsFileStream = babel(tsResult.js, modules);
    // const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? esDir : lib));
    return merge2([less, assets]);
}

gulp.task('compile-with-es', () => {
    compile(false);
});

gulp.task('compile', ['compile-with-es'], () => {
    compile();
});

gulp.task('default', ['compile']);
