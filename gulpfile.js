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

gulp.task("clean:build", () => {
    return del(path.join(__dirname, "build"));
});

gulp.task("clean:electron", () => {
    return del(path.join(__dirname, "electron", "app"));
});

gulp.task("clean:android", () => {
    return del(path.join(__dirname, "android", "app", "src", "main", "assets", "public", "**", "*"));
});

gulp.task("clean:ios", () => {
    return del(path.join(__dirname, "ios", "App", "public", "**", "*"));
});

gulp.task("clean:all", gulp.parallel(
    "clean:build",
    "clean:electron",
    "clean:android",
    "clean:ios"
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

gulp.task("prepare:android", () => {
    return gulp.src(path.join(__dirname, "build", "**", "*"))
        .pipe(gulp.dest(path.join(__dirname, "android", "app", "src", "main", "assets")));
});

gulp.task("prepare:ios", () => {
    return gulp.src(path.join(__dirname, "build", "**", "*"))
        .pipe(gulp.dest(path.join(__dirname, "ios", "App", "public")));
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

gulp.task("run:electron:with-build", gulp.series(
    "clean:electron",
    "build:all",
    "prepare:electron",
    "run:electron"
));

gulp.task("run:android", (done) => {
    let extension = "";
    if (os.platform == "win32") {
        extension = ".bat";
    }
    this.process = spawn(path.join(__dirname, "node_modules", ".bin", "cap" + extension), ["open", "android"], {
        windowsHide: true
    });
    done();
});

gulp.task("run:android:with-build", gulp.series(
    "clean:build",
    "build:all",
    "prepare:android",
    "run:android"
));

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

gulp.task("run:ios:with-build", gulp.series(
    "clean:build",
    "build:all",
    "prepare:ios",
    "run:ios"
));