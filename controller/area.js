var express = require("express");

module.exports = class ControllerItem{
  constructor () {

  }
    
	prefectures(req, res, next) {		
		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);
		
		user.auth(data.sid, function(result){
			var resultText = new Object();
			
			if (result[0]){
				const Prefecture = require('../model/prefecture');
				var prefecture = new Prefecture();						
				
				prefecture.get(function(result){
					resultText.result = 'ok';
					resultText.data = result;
					res.send(JSON.stringify(resultText));					
					
				})
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}
		  	  			
		});			
	}

	cities(req, res, next) {		
		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);
		
		user.auth(data.sid, function(result){
			var resultText = new Object();
			
			if (result[0]){
				const City = require('../model/city');
				var city = new City();						
				
				city.where('prefecture_id', '=', data.id);
				city.get(function(result){
					resultText.result = 'ok';
					resultText.data = result;
					res.send(JSON.stringify(resultText));					
					
				})
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}
		  	  			
		});			
	}

	lines(req, res, next) {		
		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);
		
		user.auth(data.sid, function(result){
			var resultText = new Object();
			
			if (result[0]){
				const Line = require('../model/line');
				var line = new Line();						
				
				line.getPref(data.id, function(result){
					resultText.result = 'ok';
					resultText.data = result;
					res.send(JSON.stringify(resultText));					
					
				})
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}
		  	  			
		});			
	}

	stations(req, res, next) {		
		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);
		
		user.auth(data.sid, function(result){
			var resultText = new Object();
			
			if (result[0]){
				const Station = require('../model/station');
				var station = new Station(data.pref_id);						
				
				station.where('line_cd', '=', data.id);
				station.where('prefecture_id', '=', data.pref_id);
				station.get(function(result){
					resultText.result = 'ok';
					resultText.data = result;
					res.send(JSON.stringify(resultText));			
				});	
			}
		});
		
	}
}