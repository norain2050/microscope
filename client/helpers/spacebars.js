UI.registerHelper('pluralize',function(n,thing){
	if(n===1){
		return '1'+thing;
	}else{
		return n+' '+thing+'s';
	}
});

Zeros = new Mongo.Collection('zeros');//wjb  测试将一个集合发不成不同的客户端子集合（名称不同）