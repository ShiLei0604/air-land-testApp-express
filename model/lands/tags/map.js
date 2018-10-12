var express = require("express");
const Model = require('../../../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'land_tag_map';
		
		this.result = new Object();
  }
  
  
  getLand(id, fnc){
	  this.where('land_id', '=', id);
		
	  this.getView(function(result){			
			fnc(result);					 			 
		});
  }
  
	getView(fnc) {		
		var res = this.get(function(result){
			fnc(result);	
		});
			
	}
	
	getFavoriteCount(id){
		return 1;
	}
}