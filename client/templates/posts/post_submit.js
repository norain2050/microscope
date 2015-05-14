Template.postSubmit.events({
	'submit form':function(e){
	e.preventDefault();
	var post={
	  url:$(e.target).find('[name=url]').val(),
	  title:$(e.target).find('[name=title]').val()
	};
	//post._id=Posts.insert(post);
	var errors=validatePost(post);
	if(errors.title || errors.url)
		return Session.set('postSubmitErrors',errors);

	Meteor.call('postInsert',post,function(error,result){
		if(error)
			//return alert(error.reason);
		    return throwError(error.reason);

		if(result.postExists)
			//alert('This link has already been posted(该链接已经存在)');
		    throwError('This link has already been posted(该链接已经存在)');


		Router.go('postPage',{_id:result._id});
	});
	
	}
});

Template.postSubmit.onCreated(function(){
	Session.set('postSubmitErrors',{});
});

Template.postSubmit.helpers({
	errorMessage:function(field){
		return Session.get('postSubmitErrors')[field];
	},
	errorClass:function(field){
		return !!Session.get('postSubmitErrors')[field]?'has-error':'';
	}
});




