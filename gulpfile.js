"use strict";

const gulp = require("gulp"),
    del = require("del"),
    merge = require("merge-stream"),
    path = require("path"),
    rename = require("gulp-rename"),
    resolve = require("rollup-plugin-node-resolve"),
    rollup = require("rollup-stream"),
    sass = require("gulp-sass"),
    source = require("vinyl-source-stream"),
    {spawn} = require("child_process"),
    os = require("os"),
    alias = require("rollup-plugin-alias"),
    replace = require("rollup-plugin-replace");

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
    return gulp.src([path.join(__dirname, "frontend", "**", "*"), `!${path.join(__dirname, "frontend", "scripts", "**")}`, `!${path.join(__dirname, "frontend", "styles", "**")}`])
        .pipe(gulp.dest(path.join(__dirname, "build")));
});

gulp.task("build:sass", () => {
    return gulp.src(path.join(__dirname, "frontend", "styles", "*.scss"))
        .pipe(sass({
            includePaths: [
                path.join(__dirname, "frontend", "styles"),
                path.join(__dirname, "node_modules")
            ]
        }).on("error", sass.logError))
        .pipe(gulp.dest(path.join(__dirname, "build", "styles")));
});

gulp.task("build:js-capacitor", () => {
    return rollup({
            input: path.join(__dirname, "frontend", "scripts", "main.js"),
            format: "es",
            plugins: [
                alias({
                    platform: path.join(__dirname, "frontend", "scripts", "capacitor.platform.js"),
                    Vue: path.join(__dirname, "node_modules", "vue", "dist", "vue.esm.js")
                }),
                replace({
                    "process.env.NODE_ENV": JSON.stringify("development")
                }),
                resolve({
                    main: false,
                    jsnext: true
                })
            ]
        })
        .pipe(source("capacitor.main.js"))
        .pipe(gulp.dest(path.join(__dirname, "build", "scripts")));
});

gulp.task("build:js-electron", () => {
    return rollup({
            input: path.join(__dirname, "frontend", "scripts", "main.js"),
            format: "es",
            plugins: [
                alias({
                    platform: path.join(__dirname, "frontend", "scripts", "electron.platform.js"),
                    Vue: path.join(__dirname, "node_modules", "vue", "dist", "vue.esm.js")
                }),
                resolve({
                    main: false,
                    jsnext: true
                })
            ]
        })
        .pipe(source("electron.main.js"))
        .pipe(gulp.dest(path.join(__dirname, "build", "scripts")));
});

gulp.task("build:all", gulp.parallel(
    "build:copy",
    "build:sass",
    "build:js-capacitor",
    "build:js-electron"
));

/*****************
*** PREPARE TASKS
******************/

gulp.task("prepare:electron", () => {
    let appFiles = gulp.src([path.join(__dirname, "build", "**", "*"), `!${path.join(__dirname, "build", "scripts", "*.main.js")}`])
        .pipe(gulp.dest(path.join(__dirname, "electron", "app")));

    let platformFile = gulp.src(path.join(__dirname, "build", "scripts", "electron.main.js"))
        .pipe(rename("main.js"))
        .pipe(gulp.dest(path.join(__dirname, "electron", "app", "scripts")));

    return merge(appFiles, platformFile);
});

gulp.task("prepare:android", () => {
    let appFiles = gulp.src([path.join(__dirname, "build", "**", "*"), `!${path.join(__dirname, "build", "scripts", "*.main.js")}`])
        .pipe(gulp.dest(path.join(__dirname, "android", "app", "src", "main", "assets", "public")));
    
    let platformFile = gulp.src(path.join(__dirname, "build", "scripts", "capacitor.main.js"))
        .pipe(rename("main.js"))
        .pipe(gulp.dest(path.join(__dirname, "android", "app", "src", "main", "assets", "public", "scripts")));

    let nativeBridge = gulp.src(path.join(__dirname, "node_modules", "@capacitor", "core", "native-bridge.js"))
        .pipe(gulp.dest(path.join(__dirname, "android", "app", "src", "main", "assets", "public")));

    return merge(appFiles, platformFile, nativeBridge);
});

gulp.task("prepare:ios", () => {
    let appFiles = gulp.src([path.join(__dirname, "build", "**", "*"), `!${path.join(__dirname, "build", "scripts", "*.main.js")}`])
        .pipe(gulp.dest(path.join(__dirname, "ios", "App", "public")));

    let platformFile = gulp.src(path.join(__dirname, "build", "scripts", "capacitor.main.js"))
        .pipe(rename("main.js"))
        .pipe(gulp.dest(path.join(__dirname, "ios", "App", "public", "scripts")));

    let nativeBridge = gulp.src(path.join(__dirname, "node_modules", "@capacitor", "core", "native-bridge.js"))
        .pipe(gulp.dest(path.join(__dirname, "ios", "App", "public")));

    return merge(appFiles, platformFile, nativeBridge);
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
    "clean:build",
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
    "clean:android",
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
    "clean:ios",
    "build:all",
    "prepare:ios",
    "run:ios"
));