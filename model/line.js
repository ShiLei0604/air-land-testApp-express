var express = require("express");
const Model = require('../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'lines';
		
		this.result = new Object();
  }
  
  getPref(pid, fnc){
		const Station = require('./station');
		var station = new Station(pid);		
		var self = this;
		
		station.leftJoin('`lines`', '`lines`.`line_id`', '=`', station.table + '`.`line_cd`');
		station.where('prefecture_id', '=', pid);
		station.groupBy('line_cd');
				
		station.get(function(result){
	  	fnc(result);
		});
  }
  
  
}