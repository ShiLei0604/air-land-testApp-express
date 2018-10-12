var express = require("express");

module.exports = class ControllerItem{
  constructor () {

  }
    	
	index(req, res, next) {		
		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);

		user.auth(data.sid, function(result){
			var resultText = new Object();
		
			if (result[0]){
				resultText.result = 'ok';

				const Tag = require('../model/lands/tag');
				var tag = new Tag();
				
				//tag.where('land_id', '=', data.id);
				tag.getView(function(result){	
					if ((result) && (result[0])){
						resultText.tags = result;				
						
						const TagMap= require('../model/lands/tags/map');
						var tagmap = new TagMap();	
						
						
						tagmap.getLand(data.id, function(result){	
							resultText.tagSelects = result;
							
							res.send(JSON.stringify(resultText));	
						});
											
					}else{
						resultText.result = 'ng';
						res.send(JSON.stringify(resultText));							
					}
					
				});		
				
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}

		});
		
	}

	update(req, res, next) {		

						
		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);


		user.auth(data.sid, function(result){
			var resultText = new Object();
			
			if (result[0]){
				resultText.result = 'ok';

				const Land = require('../model/land');
				var land = new Land();
				land.where('land_id', '=', data.land_id);
				//land.where('agency_id', '=', result[0].id);
				
				land.get(function(resultLand){
					if (resultLand[0]){
						const TagMap = require('../model/lands/tags/map');
						var tagmap = new TagMap();					

						//タグの選択肢の洗い直し
						tagmap.where('land_id', '=', data.land_id);
						tagmap.destory(function(){
							for (var key in data.data){
								tagmap.insert(data.data[key]);
							}
							
							const Tag = require('../model/lands/tag');
							var tag = new Tag();					
							
							for (var key in data.newdata){
								var datas = new Object();
								datas['tag_name'] = data.newdata[key].name;
								datas['land_id'] = data.land_id;
								
								tag.insert(datas);
							}
							
							var sleep = require('sleep-async')();
			
							sleep.sleep(3000, function(){							
								res.send(JSON.stringify(resultText));				
							});
							
						})
										
					}else{
						resultText.result = 'ng';
						res.send(JSON.stringify(resultText));							
					}
				});
				
				

			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}

		});
		
	}	
}