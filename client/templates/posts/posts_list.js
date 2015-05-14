/*
var postsData = [
 {
   title:'Introducing Telescope',
   url:'http://sachagreif.com/introducing-telescope/'
 },
 {
   title:'Meteor',
   url:'http://meteor.com'
 },
 {
   title:'The Meteor Book',
   url:'http://themeteorbook.com'
 }
];
*/
/* 在router里已经导出posts对象了
Template.postsList.helpers({
	//posts:postsData
	
	posts:function(){
		return Posts.find({},{sort:{submitted:-1}});
	}
	
	
});
*/

Template.postsList.onRendered(function(){
	this.find('.wrapper')._uihooks = {
		insertElement:function(node,next){
			$(node)
			  .hide()
			  .insertBefore(next)
			  .fadeIn();

		},


		moveElement:function(node,next){
			var $node = $(node),$next=$(next);
			var oldTop=$node.offset().top;
			var height = $node.outerHeight(true);
            
            //找出next 和node 之间所有的元素
			var $inBetween = $next.nextUntil(node);
			if($inBetween.length === 0)
				$inBetween = $node.nextUntil(next);

			//把node放在预订位置
			$node.insertBefore(next);

			//测量新top的偏移坐标
			var newTop = $node.offset().top;

			//将node 移回至原始所在位置
			$node
			  .removeClass('animate')
			  .css('top',oldTop-newTop);

			$inBetween
			  .removeClass('animate')
			  .css('top',oldTop<newTop ? height:-1*height);

			$node.offset();

			$node.addClass('animate').css('top',0);
			$inBetween.addClass('animate').css('top',0);




		},

		removeElement:function(node){
			$(node).fadeOut(function(){
				$(this).remove();
			});
		}
	}
});


