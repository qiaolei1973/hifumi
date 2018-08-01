// const fs = require('fs');
// const path = require('path');
// const less = require('less');
// const postcss = require('postcss');
// const lessSyntax = require('postcss-less');
// const precss = require('precss');
// const autoprefixer = require('autoprefixer');
// const atImport = require('postcss-import');
// const NpmImportPlugin = require('less-plugin-npm-import');

// const { NODE_ENV } = process.env;

// const ES_DIR = '../es';
// const LIB_DIR = '../lib';
// const SRC_DIR = '../components';

// const loop = (filePath) => {
//     const absolutePath = absolute(filePath)
//     const stats = fs.statSync(absolutePath);
//     if (stats.isFile()) {
//         if (isLessFile(absolutePath)) {
//             transform(filePath);
//         }
//     } else {
//         const files = fs.readdirSync(absolutePath);
//         files.forEach((filename) => {
//             loop(path.join(filePath, filename));
//         })
//     }
// }

// const transform = (filePath) => {
//     let data = fs.readFileSync(absolute(filePath), 'utf-8');
//     // data = data.replace(/^\uFEFF/, '');
//     // console.log('data: ', data);
//     // const resolvedLessFile = path.resolve(process.cwd(), filePath);
//     // console.log('path.dirname(resolvedLessFile): ', path.dirname(resolvedLessFile));
//     // const lessOpts = {
//     //     paths: [path.dirname(resolvedLessFile)],
//     //     filename: resolvedLessFile,
//     //     plugins: [
//     //         new NpmImportPlugin({ prefix: '~' }),
//     //     ],
//     // };
//     //     const data = `
//     // @hifumi-prefix: hifumi;
//     // @matrix-prefix-cls:~"@{hifumi-prefix}";

//     // .@{matrix-prefix-cls} {
//     //     min-width: 350px;
//     //     &>div{
//     //         margin:10px;
//     //     }
//     // }`
//     return less.render(data)
//         .then(result => {
//             const source = result.css;
//             debugger
//             console.log('source: ', source);
//             return postcss([
//                 precss,
//                 autoprefixer({
//                     browsers: [
//                         "iOS >= 7",
//                         "Android > 4.1",
//                         "Firefox > 20",
//                         "last 2 versions"
//                     ]
//                 })
//             ])
//                 .process(source)
//         })
//         .then(r => r.css)
//         .catch(err => {
//             console.log('err: ', err);
//         })
//     // const buildPath = rePath(filePath);
//     // const processor = postcss()
//     // processor.process(css, {
//     //     from: filePath,
//     //     to: buildPath,
//     //     map: { inline: false },
//     //     // 当文件为less文件时，使用postcss-less来解析词法
//     //     syntax: type === 'less' ? lessSyntax : null
//     // })
//     //     .then((result) => {
//     //         fs.writeFile(absolute(buildPath), result.css, err => {
//     //             if (err) console.log(err);
//     //         });
//     //         if (result.map && NODE_ENV === 'es') {
//     //             fs.writeFile((`${absolute(buildPath)}.map`), result.map, err => {
//     //                 if (err) console.log(err);
//     //             });
//     //         }
//     //     })
//     //     .catch(err => {
//     //         console.log(err);
//     //     })
// }

// const rePath = (filePath) => filePath.replace(SRC_DIR, NODE_ENV === 'es' ? ES_DIR : LIB_DIR);

// const absolute = (filePath) => path.join(__dirname, filePath);

// const isCssFile = (filename) => /^css$/.test(filename.split('.').pop());
// const isLessFile = (filename) => /^less$/.test(filename.split('.').pop());

// const excu = () => {
//     loop(SRC_DIR);
// }

// excu();

const less = require('less');
const { readFileSync } = require('fs');
const path = require('path');
const postcss = require('postcss');
const NpmImportPlugin = require('less-plugin-npm-import');
const postcssConfig = require('./postcssConfig');

export default (lessFile, config = {}) => {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);

  let data = readFileSync(resolvedLessFile, 'utf-8');
  data = data.replace(/^\uFEFF/, '');

  // Do less compile
  const lessOpts = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    plugins: [
      new NpmImportPlugin({ prefix: '~' }),
    ],
  };
  return less.render(data, lessOpts)
    .then((result) => {
      const source = result.css;
      return postcss(postcssConfig.plugins).process(source);
    })
    .then((r) => {
      return r.css;
    });
}