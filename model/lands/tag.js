var express = require("express");
const Model = require('../../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'land_tag';
		
		this.result = new Object();
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