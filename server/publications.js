Meteor.publish('posts',function(options){
	check(options,{
		sort:Object,
		limit:Number
	});
	return Posts.find({},options);
});

Meteor.publish('singlePost',function(id){
	check(id,String);
	return Posts.find(id);
});

Meteor.publish('comments',function(postId){
	check(postId,String);
	return Comments.find({postId:postId});
});

Meteor.publish('notifications',function(){
	return Notifications.find();
});


/**
* wjb 下面的是“一个发布，拥有多个关联集合的数据的测试
*/
Meteor.publish('topPosts',function(limit){
	var sub=this, commentHandles =[], postHandle=null;
	check(limit,Number);

	//针对一个post，发布它的两条评论
	function publishPostComments(postId){
		var commentsCursor = Comments.find({postId:postId},{limit:2});
		commentHandles[postId] = Mongo.Collection._publishCursor(commentsCursor,sub,'comments');
	}

    postHandle = Posts.find({},{limit:limit}).observeChanges({
    	added:function(id,post){
    		publishPostComments(id);
    		sub.added('posts',id,post);
    	},
    	changed:function(id,fields){
    		sub.changed('posts',id,fields);
    	},
    	removed:function(id){
    		commentHandles[id]&&commentHandles[id].stop();
    		sub.removed('posts',id);
    	}
    });

    sub.ready();

    sub.onStop(function(){postHandle.stop();});

});


/**
* wjb 下面是一个有关将服务器的一个集合，在客户端发不成不同的一个或几个集合（名字与服务端不同）
*/

Meteor.publish('zeros',function(){
	var sub=this;
	var zerosCursor = Posts.find({commentsCount:0});
	Mongo.Collection._publishCursor(zerosCursor,sub,'zeros');

	sub.ready();
});







