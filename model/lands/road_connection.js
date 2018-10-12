var express = require("express");
const Model = require('../../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'road_connection';
		
		this.result = new Object();
  }
  
  	
	add(datas, fnc){
		this.insert(datas, function(result){
			fnc(result);
		});
	}
}