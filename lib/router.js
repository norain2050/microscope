Router.configure({
	layoutTemplate:'layout',
	loadingTemplate:'loading',
	notFoundTemplate:'notFound',
	waitOn:function(){return [Meteor.subscribe('notifications'),Meteor.subscribe('zeros')]}
});

PostsListController = RouteController.extend({
	template:'postsList',
	increment:5,
	postsLimit:function(){
		return parseInt(this.params.postsLimit)||this.increment;
	},
	findOptions:function(){
		//return {sort:{submitted:-1},limit:this.postsLimit()};
		return {sort:this.sort,limit:this.postsLimit()};
	},
	/* wjb 用subscriptions代替，防止等待刷新
	waitOn:function(){
		return Meteor.subscribe('posts',this.findOptions());
	},
	*/
	subscriptions:function(){
		this.postsSub = Meteor.subscribe('posts',this.findOptions());
		//this.postsSub = Meteor.subscribe('topPosts',20);//wjb 测试“单一订阅中的多个集合”_---测试成功，确实可以一次发布多个集合数据

	},
	posts:function(){
		return Posts.find({},this.findOptions());
	},
	data:function(){
		var hasMore=this.posts().count()===this.postsLimit();
		//var nextPath=this.route.path({postsLimit:this.postsLimit()+this.increment});
		return {
			posts:this.posts(),
			ready:this.postsSub.ready,
			nextPath:hasMore?this.nextPath():null
		};
		
	}
});


NewPostsController = PostsListController.extend({
  sort:{submitted:-1,_id:-1},
  nextPath:function(){
  	return Router.routes.newPosts.path({postsLimit:this.postsLimit() + this.increment});
  }
});

BestPostsController=PostsListController.extend({
	sort:{votes:-1,submitted:-1,_id:-1},
	nextPath:function(){
		return Router.routes.bestPosts.path({postsLimit:this.postsLimit() + this.increment});
	}
});


Router.route('/submit',{
	name:'postSubmit'
});

/*
Router.route('/:postsLimit?',{
	name:'postsList'
});
*/

Router.route('/',{
	name:'home',
	controller:NewPostsController
});

Router.route('/new/:postsLimit?',{
	name:'newPosts',
	controller:NewPostsController
});

Router.route('/best/:postsLimit?',{
	name:'bestPosts'
});

Router.route('/posts/:_id',{
	name:'postPage',
	waitOn:function(){
		return [
		Meteor.subscribe('comments',this.params._id),
		Meteor.subscribe('singlePost',this.params._id)
		];
	},
	data:function(){return Posts.findOne(this.params._id);}
});

Router.route('/posts/:_id/edit',{
	name:'postEdit',
	waitOn:function(){
		return Meteor.subscribe('singlePost',this.params._id);
	},
	data: function(){return Posts.findOne(this.params._id);}
});



var requireLogin = function(){
	if(!Meteor.user()){
		if(Meteor.loggingIn()){
			this.render(this.loadingTemplate);
		}else{
			this.render('accessDenied');
		}
		
	}else{
		this.next();
	}
}


Router.onBeforeAction('dataNotFound',{only:'postPage'});
Router.onBeforeAction(requireLogin,{only:'postSubmit'});



