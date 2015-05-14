Posts = new Mongo.Collection('posts');
/*
Posts.allow({
	insert:function(userId,doc){
		return !!userId;
	}
});
*/
Posts.allow({
	/*
	update:function(userId,post){
		return ownsDocument(userId,post);
	},
	*/
	remove:function(userId,post){
		return ownsDocument(userId,post);
	}
});

/*
Posts.deny({
	update:function(userId,post,fieldNames){
		return (_.without(fieldNames,'url','title').length>0);
	}
});
*/

Meteor.methods({
	postInsert:function(postAttributes){
		check(Meteor.userId(),String);
		check(postAttributes,{
			title:String,
			url:String
		});

		var errors=validatePost(postAttributes);
		if(errors.title || errors.url)
			throw new Meteor.Error('invalid-post',"你必须为你的帖子填写标题和URL");


		var postWithSameLink = Posts.findOne({url:postAttributes.url});
		if(postWithSameLink){
			return {
				postExists:true,
				_id:postWithSameLink._id
			}
		}

		var user = Meteor.user();
		var post = _.extend(postAttributes,{
			userId:user._id,
			author:user.username,
			submitted: new Date(),
			commentsCount:0,
			upvoters:[],
		    votes:0
		});

		var postId = Posts.insert(post);

		return {
			_id:postId
		};
	},

	postUpdate:function(updateParams){
		
		
		check(Meteor.userId(),String);
		check(updateParams,{
			postId:String,
			postSet:{
				title:String,
				url:String
			}
		});

		
                
		//var postWithSameLink = Posts.findOne({"$and":[{url:updateParams.postSet.url},{"$not":{_id:updateParams.postId}}]});
		var postWithSameLink = Posts.findOne({url:updateParams.postSet.url,_id:{"$nin":[updateParams.postId]}});
		if(postWithSameLink){
			return {
				postExists:true,
				_id:updateParams.postId
			};
		}else{
			Posts.update(updateParams.postId,{"$set":updateParams.postSet});
		    return 	{_id:updateParams.postId};
		
		}
			


	},
	upvote:function(postId){
		check(this.userId,String);
		check(postId,String);

		/*
		var post=Posts.findOne(postId);
		if(!post)
			throw new Meteor.Error('invalid','Post not found');

		if(_.include(post.upvoters,this.userId))
			throw new Meteor.Error('invalid','Already upvoted this post');

		Posts.update(post._id,{
			$addToSet:{upvoters:this.userId},
			$inc:{votes:1}
		});
*/
        var affected = Posts.update({
        	_id:postId,
        	upvoters:{$ne :this.userId}
        },{
        	$addToSet:{upvoters:this.userId},
        	$inc:{votes:1}
        });

        if(!affected)
        	throw new Meteor.Error('invalid',"You weren't able to upvote that post");


	}

});


validatePost = function(post){
	var errors={};
	if(!post.title)
		errors.title="请填写标题";
	if(!post.url)
		errors.url="请填写URL";
	return errors;
};





