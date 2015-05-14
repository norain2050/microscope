Template.header.helpers({
	pageTitle1:function(){

		//return Session.get('pageTitle');
		var sObj= Session.get('pageTitle');
		if(sObj===null | sObj==="" | sObj===undefined | sObj===NaN){
			return "Microscope";
		}else{
			return sObj;
		}
	},
	activeRouteClass:function(){
		//console.log('arguments[0]='+arguments[0]+' ; arguments[1]='+arguments[1]);
		var args=Array.prototype.slice.call(arguments,0);
		//console.log('args='+args);
		args.pop();

		var active = _.any(args,function(name){
			return Router.current() && Router.current().route.getName()===name;
		});

		return active && 'active';
	}
});