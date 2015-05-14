Template.postEdit.events({
	'submit form':function(e){
		e.preventDefault();

		var currentPostId=this._id;

		var postProperties={
			url:$(e.target).find('[name=url]').val(),
			title:$(e.target).find('[name=title]').val()
		};

		var errors=validatePost(postProperties);
	if(errors.title || errors.url)
		return Session.set('postEditErrors',errors);

    var updateParams={postId:currentPostId,postSet:postProperties};

     Meteor.call('postUpdate',updateParams,function(error,result){
		if(error)
			//return alert(error.reason);
		    return throwError(error.reason);

		if(result.postExists)
			//alert('This link has already been posted(该链接已经存在)');
		    throwError('This link has already been posted(该链接已经存在)');


		//Router.go('postEdit',{_id:result._id});
		Router.go('postsList');
	});

	},

	'click .delete':function(e){
		e.preventDefault();

		if(confirm("Delete this post?")){
			var currentPostId=this._id;
			Posts.remove(currentPostId);
			Router.go('home');
		}
	}
});

Template.postEdit.onCreated(function(){
	Session.set('postEditErrors',{});
});

Template.postEdit.helpers({
	errorMessage:function(field){
		return Session.get('postEditErrors')[field];
	},
	errorClass:function(field){
		return !!Session.get('postEditErrors')[field]?'has-error':'';
	}
});





