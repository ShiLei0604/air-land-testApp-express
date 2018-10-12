var express = require("express");

module.exports = class ControllerItem{
  constructor () {

  }
    
	insert(req, res, next) {		

		const User = require('../model/realestate/agencies');
		var user = new User();								
		var data = JSON.parse(req.query.json);
		
		user.auth(data.sid, function(result){
			var resultText = new Object();
			
			if (result[0]){
				const Land = require('../model/land');
				var land = new Land();
				
				console.log(result[0]);
				
				land.add(data.datas, result[0].id, function(result){
					resultText.result = 'ok';
					resultText.lid = result;
					
					res.send(JSON.stringify(resultText));										
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
				const Land = require('../model/land');
				var land = new Land();
				
				land.where('land_id', '=', data.id);
				land.where('agency_id', '=', result[0].id);
				land.get(function(result2){
					//沿線情報編集
					const Lines = require('../model/lands/lines');
					var lines = new Lines();
					
					if (data.datas.lines){
						lines.reflash(data.id, data.datas.lines);					
					}
					
					//土地情報編集
					delete data.datas.lines;
					land.where('land_id', '=', data.id);
					land.update(data.datas, function(){
						resultText.result = 'ok';
						res.send(JSON.stringify(resultText));												
					});
					
				});				
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}
		  	  			
		});			
		
	}
		
	delete(req, res, next) {	
		const User = require('../model/realestate/agencies');
		var user = new User();								
		var data = JSON.parse(req.query.json);
			
		user.auth(data.sid, function(result){		
			var resultText = new Object();
			
			if (result[0]){
				const Land = require('../model/land');
				var land = new Land();
				
				land.delete(data.id, result[0].id, function(result){
					resultText.result = 'ok';
					
					res.send(JSON.stringify(resultText));										
				});
								
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}
		  	  			
		});				
	}
}