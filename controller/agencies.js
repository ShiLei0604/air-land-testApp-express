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
				resultText.data = result[0];
				res.send(JSON.stringify(resultText));	

				
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
				console.log(data.datas);
				user.where('id', '=', result[0].id);
				user.update(data.datas, function(){
					resultText.result = 'ok';
					res.send(JSON.stringify(resultText));						
				});
				

				
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}
		  	  			
		});			
	}
	
	password(req, res, next) {		

		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);
		
		user.auth(data.sid, function(result){
			var resultText = new Object();
			
			if (result[0]){
				resultText.result = 'ok';
				resultText.data = result[0];
				res.send(JSON.stringify(resultText));	

				
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}
		  	  			
		});			
	}

	passwordUpdate(req, res, next) {		

		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);
			
		
		
		user.auth(data.sid, function(result){
			user.where('email', '=', data.email);
			user.where('password', '=', data.password);
			user.where('sid', '=', data.sid);
			user.get(function(){
				var resultText = new Object();

				if (result[0]){
					user.where('email', '=', data.email);
					user.where('password', '=', data.password);					
					user.update({password:data.passwordNew}, function(result){
						resultText.result = 'ok';
						res.send(JSON.stringify(resultText));							
					});
					
	
					
				}else{
					resultText.result = 'ng';
					res.send(JSON.stringify(resultText));	
				}				
			})

			
		  	  			
		});			
	}	
	
}