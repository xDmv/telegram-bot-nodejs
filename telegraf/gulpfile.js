const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');

const tsProject = ts.createProject('tsconfig.json');
const outputDir = './dist';
const sourceMask = './src/**/*';
const sourceMaskTS = `${sourceMask}.ts` 

clear = () => {
	return del(outputDir);
}

build = () => {
	return gulp.src(sourceMaskTS)
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(tsProject()).js
	// .pipe(gulp.addListener(outputDir))
	.pipe(sourcemaps.write('./', {
		includeContent: false,
		sourceRoot: '.'
	}))
	.pipe(gulp.dest(outputDir))
}

const defaultTask = gulp.series(clear, build);

watchTask = () => {
	gulp.watch(sourceMaskTS, build);
};

botTestTask = (done) => {
	return nodemon({
		script: `${outputDir}/bot/bot.js`,
		watch: outputDir,
		delay: '1500',
		done,
	})
}

devTask = (done) => {
	watchTask();
	gulp.series(defaultTask, botTestTask)(done);
}

exports.default = defaultTask;
exports.clear = clear;
exports.watch = watchTask;
exports.botTest = botTestTask;
exports.dev = devTask;

