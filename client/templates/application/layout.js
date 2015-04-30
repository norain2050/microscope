Template.layout.helpers({
	pageTitle:function(){

		//return Session.get('pageTitle');
		var sObj= Session.get('pageTitle');
		if(sObj===null | sObj==="" | sObj===undefined | sObj===NaN){
			return "Microscope";
		}else{
			return sObj;
		}
	}
});