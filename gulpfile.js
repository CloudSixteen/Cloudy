const gulp = require("gulp")
const gulpTS = require("gulp-typescript")
const gulpSourcemaps = require("gulp-sourcemaps")
const gulpNodemon = require("gulp-nodemon")
const del = require("del")
const path = require("path")

const project = gulpTS.createProject("tsconfig.json")

gulp.task("build", () => {
	del.sync(["./build/**/*.*"]);

	gulp.src([
		"./src/**/*.yml",
		"./src/**/*.json"]
	).pipe(gulp.dest("build/"));

	const builder = gulp.src("./src/**/*.ts")
		.pipe(gulpSourcemaps.init())
		.pipe(project());
		
	return builder.js.pipe(gulpSourcemaps.write({
		sourceRoot: file => path.relative(path.join(file.cwd, file.path), file.base)
	})).pipe(gulp.dest("build/"));
});

gulp.task("watch", ["build"], function() {
	gulp.watch("./src/**/*.ts", ["build"])
});

gulp.task("start", ["build"], function() {
	return gulpNodemon({
		script: "./build/index.js",
		watch: "./build/index.js"
	})
});

gulp.task("serve", ["watch"], function() {
	return gulpNodemon({
		script: "./build/index.js",
		watch: "./build/"
	})
});