Comments=new Mongo.Collection('comments');

Meteor.methods({
	commentInsert:function(commentAttributes){
		check(this.userId,String);
		check(commentAttributes,{
			postId:String,
			body:String
		});

		var user = Meteor.user();
		var post = Posts.findOne(commentAttributes.postId);
		if(!post)
			throw new Meteor.Error('invalid-comment','You must comment on a post');



        var errors=validateComment(commentAttributes);
		    if(errors.body)
			     throw new Meteor.Error('invalid-comment',"你必须为你的评论填写内容");

		comment = _.extend(commentAttributes,{
			userId:user._id,
			author:user.username,
			submitted:new Date()
		});
		//更新帖子的评论数
		Posts.update(comment.postId,{$inc:{commentsCount:1}});

		comment._id=Comments.insert(comment);

		createCommentNotification(comment);
		return comment._id;
	}
});

validateComment = function(commentAttributes){
	var errors={};
	if(!commentAttributes.body)
		errors.body="请填写评论内容";
	
	return errors;
};