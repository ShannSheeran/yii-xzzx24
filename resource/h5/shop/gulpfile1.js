var gulp = require('gulp'),
    watch = require('gulp-watch'),
    minjs = require('gulp-uglify'),
    mincss = require('gulp-mini-css'),
    sass = require('gulp-sass'),
    layout = require('gulp-layout'),
    path = require('path'),
    fs = require('fs');
    
var paths = {
    src : path.normalize('../frontent'),
    dist : path.normalize('../web')
},
    srcOptions = {base : paths.src};

layout.config({
    workingPath : paths.src,
    layouts : [
        {
            layoutFile : '',
            files : [
                'login.html'
            ]
        }
    ]
});

//默认任务    
gulp.task('default', ['minjs', 'mincss', 'layout', 'assets', 'mock']);

//同步图片、字体、图标等
gulp.task('assets', function(){
    watch(paths.src + '/**/**.{jpg,jpeg,png,bmp,gif,woff,ttf,map,ico}', function(file){
        gulp.src(file, srcOptions)
            .pipe(gulp.dest(paths.dist));
    })
        .on('add', function(file){
            console.log(file + ' 添加');
            gulp.src(file, srcOptions)
                .pipe(gulp.dest(paths.dist));
        })
        .on('change', function(file){
            console.log(file + ' 修改');
            gulp.src(file, srcOptions)
                .pipe(gulp.dest(paths.dist));
        })
        .on('unlink', unlinkDistFile);
});

//压缩JS
gulp.task('minjs', function(){
    var buildJs = function(file){
        console.log(file + ' 发生变动');
        gulp.src(file, srcOptions)
            .pipe(minjs().on('error', function(error){
                console.error(error.message + '\n出错行号:' + error.lineNumber);
            }))
            .pipe(gulp.dest(paths.dist));
    };

    watch(paths.src + '/**/**.js')
        .on('add', buildJs)
        .on('change', buildJs)
        .on('unlink', unlinkDistFile);
});

//压缩CSS，编译SASS
gulp.task('mincss', function(){
    var buildCss = function(file){
        console.log(file + ' 发生变动');
        var stream = gulp.src(file, srcOptions);
        if(path.extname(file) == '.scss'){
            stream = stream.pipe(sass().on('error', sass.logError));
        }
        
        stream.pipe(mincss())
            .pipe(gulp.dest(paths.dist));
    };
    
    watch(paths.src + '/**/**.{css,scss}')
        .on('add', buildCss)
        .on('change', buildCss)
        .on('unlink', unlinkDistFile);
});

//合并layout
gulp.task('layout', function(){
    var buildHtml = function(file){
        gulp.src(file, srcOptions)
            .pipe(layout.run())
            .pipe(gulp.dest(paths.dist));
    };

    watch(paths.src + '/**/**.html')
        .on('add', buildHtml)
        .on('change', buildHtml)
        .on('unlink', unlinkDistFile);
});

function unlinkDistFile(file){
    console.log(file + ' 删除');
    var distFile = paths.dist + '/' + path.relative(paths.src, file); //计算相对路径
    fs.existsSync(distFile) && fs.unlink(distFile);
}