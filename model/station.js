var express = require("express");
const Model = require('../liblary/model');


module.exports = class ModelItem extends Model {
  constructor (pid) {
		super();
		

		
		this.table = 'stationsp' + this.getTableName(pid);
		
		this.result = new Object();
  }
  
  getTableName(pid){
		var pstring = '1-10';
		
		if (pid > 10){
			pstring = '11-20';
		}
		if (pid > 20){
			pstring = '21-30';
		}
		if (pid > 30){
			pstring = '31-40';
		}
		if (pid > 40){
			pstring = '41-47';
		}
		
		return pstring; 
  }
  
  
  
}