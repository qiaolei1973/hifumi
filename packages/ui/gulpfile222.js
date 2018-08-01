const gulp = require('gulp');
const less = require('gulp-less');
// const babel = require('gulp-babel');
// const concat = require('gulp-concat');
// const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
// const cleanCSS = require('gulp-clean-css');
const NpmImportPlugin = require('less-plugin-npm-import');
const del = require('del');

const paths = {
    styles: {
        src: 'components/**/*.less',
        dest: 'es'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'assets/scripts/'
    }
};

const clean = () => del(['es']);

const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(less({
            sourceMap: true,
            outputSourceFiles: true,
            plugins: [
                new NpmImportPlugin({ prefix: '~' }),
            ],
            exclude: ['node_modules']
        }))
        // .pipe(cleanCSS())
        // .pipe(rename({
        //     basename: 'main',
        //     suffix: '.min'
        // }))
        .pipe(gulp.dest(paths.styles.dest));
}

// export const scripts = () => {
//     return gulp.src(paths.scripts.src, { sourcemaps: true })
//         .pipe(babel())
//         .pipe(uglify())
//         .pipe(concat('main.min.js'))
//         .pipe(gulp.dest(path.scripts.dest));
// }

// const watchFiles = () => {
//     gulp.watch(paths.scripts.src, scripts);
//     gulp.watch(paths.styles.src, styles);
// }

// export { watchFiles as watch };

// const build = gulp.series(clean, gulp.parallel(styles, scripts));
// gulp.task('build', build);

// export default build;

gulp.task('lessTransform', styles);
gulp.task('default', ['lessTransform']);