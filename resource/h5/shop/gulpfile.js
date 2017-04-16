var gulp = require('gulp');
var concat = require('gulp-concat');
var cmdPack = require('gulp-cmd-pack');
var combo = require('gulp-seajs-combo');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var path = require('path');
var fs = require('fs');

var paths = {
    src : path.normalize('./base'),
    dist : path.normalize('./dist'),
	appPath : path.normalize('./base/app')
};
var srcOptions = {base : paths.src};

//获取插件
gulp.task('getBase', function(){
	//全部提取
	explorer(paths.appPath);
	//提取基本信息
    gulp.src('./base/{external,libs,modules}/**')
	.pipe(gulp.dest(paths.dist));    
});

//压缩layer
gulp.task('miniLayer', function(){	
    gulp.src('./base/external/layer_mobile/layer.js')
	.pipe(uglify({
		 //mangle: true,//类型：Boolean 默认：true 是否修改变量名
		 mangle: { except: ['require', 'exports', 'module', '$', 'modules'] }//排除混淆关键字
	 }))
	.pipe(gulp.dest('./base/external/layer_mobile/layer.min.js'));    
});

//处理首页
gulp.task('handleAll', function () {
	var aConfig = {
		mainId: null,
		base: paths.src,
		 alias: {
			jQuery: "libs/jQuery/jQuery.js",
			artDialog: "external/artDialog/src/dialog-plus.js",
			sitebase: "app/common/base.js",
			Tips: "app/common/Tips.js"
		},
		ignore: ['jQuery','http://res.wx.qq.com/open/js/jweixin-1.0.0.js'] //这里的模块将不会打包进去
	};
	
	var aIgnore = {
		 //mangle: true,//类型：Boolean 默认：true 是否修改变量名
		 mangle: { except: ['require', 'exports', 'module', '$', 'modules'] }//排除混淆关键字
	 };
	 
	//首页提取
	aConfig.mainId = 'app/index/test11';
    gulp.src(['./base/app/index/test11.js'])
	.pipe(cmdPack(aConfig))
    //.pipe(concat())
    .pipe(uglify(aIgnore))
    .pipe(gulp.dest('dist/app/index'));
	
});

//监听提取
gulp.task('mini-combo',function(){	
	 var buildJs = function(file){
		 console.log(paths.src, file);
		 var aConfig = {
			mainId: path.relative(paths.src, file).replace('.js','').replace(/\\/g,'/'),
			base: paths.src,
			 alias: {
				jQuery: "libs/jQuery/jQuery.js",
				artDialog: "external/artDialog/src/dialog-plus.js",
				sitebase: "app/common/base.js",
				Tips: "app/common/Tips.js"
			},
			ignore: ['jQuery','http://res.wx.qq.com/open/js/jweixin-1.0.0.js'] //这里的模块将不会打包进去
		};
		
		var aIgnore = {
			 //mangle: true,//类型：Boolean 默认：true 是否修改变量名
			 mangle: { except: ['require', 'exports', 'module', '$', 'modules'] }//排除混淆关键字
		 };
	 
        console.log(file + ' 发生变动');
		
        gulp.src(file, srcOptions)
            .pipe(cmdPack(aConfig)
			.on('error', function(error){
                console.error(error.message + '\n出错行号:' + error.lineNumber);
            }))
			.pipe(uglify(aIgnore))
            .pipe(gulp.dest(paths.dist));
    };
	
	watch(paths.src + '/**/**.js')
        .on('add', buildJs)
        .on('change', buildJs)
        .on('unlink', unlinkDistFile);
	
});

//删除文件
function unlinkDistFile(file){
    console.log(file + ' 删除');
    var distFile = paths.dist + '/' + path.relative(paths.src, file); //计算相对路径
    fs.existsSync(distFile) && fs.unlink(distFile);
}

//遍历指定路劲下的所有文件
function explorer(pathDir){
	fs.readdir(pathDir, function(err, files){
		//err 为错误 , files 文件名列表包含文件夹与文件
		if(err){
			console.log('error:\n' + err);
			return;
		}
		files.forEach(function(file){
			fs.stat(pathDir + '/' + file, function(err, stat){
				if(err){console.log(err); return;}
				if(stat.isDirectory()){					
					// 如果是文件夹遍历
					explorer(pathDir + '/' + file);
				}else{
					// 读出所有的文件
					//console.log('文件名:' +path.resolve(pathDir + '/' + file));
					outputFile(path.resolve(pathDir + '/' + file));
				}				
			});
			
		});

	});
}

//全部提取输出
function outputFile(file){	
	var aIgnore = {
		 //mangle: true,//类型：Boolean 默认：true 是否修改变量名
		 mangle: { except: ['require', 'exports', 'module', '$', 'modules'] }//排除混淆关键字
	 };
	 
	 //排除微信
	if(-1 != file.indexOf('weixin.js')){
		gulp.src(file, srcOptions)
		.on('error', function(error){
			console.error(error.message + '\n出错行号:' + error.lineNumber);
		})
		.pipe(uglify(aIgnore))
		.pipe(gulp.dest(paths.dist));
		return;
	}
	 var aConfig = {
		mainId: path.relative(paths.src, file).replace('.js','').replace(/\\/g,'/'),
		base: paths.src,
		 alias: {
			jQuery: "libs/jQuery/jQuery.js",
			artDialog: "external/artDialog/src/dialog-plus.js",
			sitebase: "app/common/base.js",
			Tips: "app/common/Tips.js"
		},
		ignore: ['jQuery','http://res.wx.qq.com/open/js/jweixin-1.0.0.js'] //这里的模块将不会打包进去
	};
	

	gulp.src(file, srcOptions)
		.pipe(cmdPack(aConfig)
		.on('error', function(error){
			console.error(error.message + '\n出错行号:' + error.lineNumber);
		}))
		.pipe(uglify(aIgnore))
		.pipe(gulp.dest(paths.dist));
}

//默认任务    
gulp.task('default', ['getBase']);