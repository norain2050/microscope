if(Posts.find().count()===0){
	
	var now=new Date().getTime();

	//create two users
	var wjbId=Meteor.users.insert({
		profile:{name:'WangJingBo'}
		});
	var wjb=Meteor.users.findOne(wjbId);

	var lgqId=Meteor.users.insert({
		profile:{name:'LiuGuoQiang'}
	});
	var lgq=Meteor.users.findOne(lgqId);

	var telescopeId=Posts.insert({
		title:'搜狐',
		userId:lgq._id,
		author:lgq.profile.name,
		url:'http://wwww.sohu.com',
		submitted:new Date(now-7*3600*1000),
		commentsCount:3,
		upvoters:[],
		votes:0
	});

	Comments.insert({
		postId:telescopeId,
		userId:wjb._id,
		author:wjb.profile.name,
		submitted:new Date(now-5*3600*1000),
		body:'这是一个新闻网站，good'
	});

	Comments.insert({
		postId:telescopeId,
		userId:lgq._id,
		author:lgq.profile.name,
		submitted:new Date(now-3*3600*1000),
		body:'是的，它是中国三大门户之一'
	});

	Comments.insert({
		postId:telescopeId,
		userId:lgq._id,
		author:lgq.profile.name,
		submitted:new Date(now-2*3600*1000),
		body:'very good'
	});

	Posts.insert({
		title:'Meteor',
		userId:wjb._id,
		author:wjb.profile.name,
		url:'http://meteor.com',
		submitted:new Date(now-10*3600*1000),
		commentsCount:0,
		upvoters:[],
		votes:0
	});

	Posts.insert({
		title:'The Meteor Book',
		userId:wjb._id,
		author:wjb.profile.name,
		url:'http://themeteorbook.com',
		submitted:new Date(now-12*3600*1000),
		commentsCount:0,
		upvoters:[],
		votes:0
	});

	for(var i=0;i<10;i++){
		Posts.insert({
			title:'Test post #'+i,
			author:wjb.profile.name,
			userId:wjb._id,
			url:'http://baidu.com/?q=test-'+i,
			submitted:new Date(now-i*3600*1000),
			commentsCount:0,
			upvoters:[],
		    votes:0
		});
	}






}