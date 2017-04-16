define('app/index/test11',["jQuery",'juicer','app/common/Request','app/common/Tips'],function(require,exports,module) {
    var Request = require('app/common/Request');
    var Tips = require('app/common/Tips');
	
    var juicer = require('juicer');
    return function(){
        return Tips.showLayer('内容',function(o){
            console.log(o);
            //o.close();
        });
        Tips.askIips('确定删除吗？',{
            rFn:function(cc,obj){
                Tips.showTips('this is test');
                console.log(cc);
            },
            rPramater:{id:100},//可选
           });
           var tpl = require('./tpl.tpl');
		   console.log(tpl);
			var data = {
				list: [
					{name:' guokai', show: true},
					{name:' benben', show: false},
					{name:' dierbaby', show: true}
				],
				blah: [
					{num: 1},
					{num: 2},
					{num: 3, inner:[
						{'time': '15:00'},
						{'time': '16:00'},
						{'time': '17:00'},
						{'time': '18:00'}
					]},
					{num: 4}
				]
			};

			//var tpl = document.getElementById('tpl').innerHTML;
			//var html = juicer(tpl, data);
		}
});