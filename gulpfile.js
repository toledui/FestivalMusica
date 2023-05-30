const {src, dest, watch, parallel} = require("gulp");

// dependencias de css
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// dependencias de imagenes
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// javascript

const terser = require('gulp-terser-js');

function css(done){
    //identificar el archivo
    //compilar sass a css
    //guardar en disco duro
    src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css"));

    done();
}

function javascript(done) {
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

function convertirWebp(done) {
        const opciones = {
            quality: 50,

        };
        src('src/img/**/*.{jpg,png}')
        .pipe(webp(opciones))
        .pipe(dest("build/img"));
        done();
}

function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{jpg,png}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'));
    done();
}

function imagenesAvif(done){
    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{jpg,png}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'));
    done();
}
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.convertirWebp = convertirWebp;
exports.imagenesAvif = imagenesAvif;
exports.dev = parallel(javascript, dev, convertirWebp, imagenes, imagenesAvif);
