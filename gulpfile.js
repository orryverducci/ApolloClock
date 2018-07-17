"use strict";

const gulp = require("gulp"),
    del = require("del"),
    path = require("path"),
    sass = require("gulp-sass"),
    {spawn} = require("child_process"),
    os = require("os"),
    vinylPaths = require("vinyl-paths");

/***************
*** CLEAN TASKS
****************/

gulp.task("clean:build", (done) => {
    del.sync(path.join(__dirname, "build"));
    done();
});

gulp.task("clean:electron", (done) => {
    del.sync(path.join(__dirname, "electron", "app"));
    done();
});

gulp.task("clean:all", gulp.parallel(
    "clean:build",
    "clean:electron"
));

/***************
*** BUILD TASKS
****************/

gulp.task("build:copy", () => {
    return gulp.src(path.join(__dirname, "src", "**", "*"))
        .pipe(gulp.dest(path.join(__dirname, "build")));
});

gulp.task("build:sass", () => {
    return gulp.src(path.join(__dirname, "build", "**", "*.scss"))
        .pipe(vinylPaths(del))
        .pipe(sass({
            includePaths: [
                path.join(__dirname, "build")
            ]
        }).on("error", sass.logError))
        .pipe(gulp.dest((file) => {
            return file.base;
        }));
});

gulp.task("build:vue", () => {
    return gulp.src(path.join(__dirname, "node_modules", "vue", "dist", "vue.esm.browser.js"))
        .pipe(gulp.dest(path.join(__dirname, "build", "scripts")));
});

gulp.task("build:all", gulp.series(
    "build:copy",
    "build:vue",
    "build:sass"
));

/*****************
*** PREPARE TASKS
******************/

gulp.task("prepare:electron", () => {
    return gulp.src(path.join(__dirname, "build", "**", "*"))
        .pipe(gulp.dest(path.join(__dirname, "electron", "app")));
});

gulp.task("prepare:ios", (done) => {
    let extension = "";
    if (os.platform == "win32") {
        extension = ".bat";
    }
    this.process = spawn(path.join(__dirname, "node_modules", ".bin", "cap" + extension), ["copy", "ios"], {
        windowsHide: true
    });
    done();
});

/*************
*** RUN TASKS
**************/

gulp.task("run:electron", (done) => {
    let extension = "";
    if (os.platform == "win32") {
        extension = ".bat";
    }
    this.process = spawn(path.join(__dirname, "node_modules", ".bin", "electron" + extension), [path.join(__dirname, "electron", "main.js")], {
        windowsHide: true
    });
    done();
});

gulp.task("run:ios", (done) => {
    let extension = "";
    if (os.platform == "win32") {
        extension = ".bat";
    }
    this.process = spawn(path.join(__dirname, "node_modules", ".bin", "cap" + extension), ["open", "ios"], {
        windowsHide: true
    });
    done();
});