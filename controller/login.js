var express = require("express");

module.exports = class ControllerItem{
  constructor () {

  }
 
 	test(req, res, next) {		
		res.send(req.query.test);
	}
	
	index(req, res, next) {		
		const Agencies = require('../model/realestate/agencies');
		var agencies = new Agencies();		
		var data = JSON.parse(req.query.json);
		

		
		agencies.login(data.email, data.password, function(result){
			var resultText = new Object();
			
			if (agencies.result){
				resultText.result = 'ok';
				resultText.sid = agencies.sid;
			}else{
				resultText.result = 'ng';
			}
		  res.send(JSON.stringify(resultText));		  			
		});
	}
	
	reminder(req, res, next) {
		const Agencies = require('../model/realestate/agencies');
		var agencies = new Agencies();
		var data = JSON.parse(req.query.json);	
		
		agencies.where('email', '=', data.email);
		agencies.get(function(result){			
			var resultText = new Object();
			
			if (result){
				const Mail = require('../liblary/mail');
				var mail = new Mail();
				mail.datas = result[0];
				mail.send('reminder', 'パスワード再発行', data.email, function(){
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