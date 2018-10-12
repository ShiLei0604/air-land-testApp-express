var express = require("express");
const Model = require('../../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'realestate_agencies';
		
		this.result = new Object();
  }
  
  
	login(email, password, fnc) {		
		this.where('email', '=', email);
		this.where('password','=',  password);

		var self = this;
		
		
		var res = this.get(function(result){
			if (result[0]){
				self.result = result;
				
				const Tool = require('../../liblary/tool');
				var tool = new Tool();
				
				self.where('email', '=', email);
				self.where('password','=',  password);
				self.sid = tool.getRandom(32);
	
				const Sid = require('./sid');
				var sid = new Sid();
				
				sid.insert({sid:self.sid, realestate_agencies_id:result[0].id}, fnc);					
			}else{
				self.result = null;
				return fnc([null]);
			}
		});
	}
	
	auth(sid, fnc) {
		var self = this;
		const Sid = require('./sid');
		var sidC = new Sid();
							
		sidC.where('sid', '=', sid);

		
		var res = sidC.get(function(resultSid){
			if (resultSid){
				if (resultSid[0]){
					self.where('id', '=', resultSid[0].realestate_agencies_id);
					self.get(function(result){
						result.sid = sid;
						fnc(result);				
					});
				}else{
					fnc([null]);
				}
			}else{
				fnc([null]);
			}
		});
					
	}
	
}