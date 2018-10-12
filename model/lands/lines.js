var express = require("express");
const Model = require('../../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'land_lines';
		
		this.result = new Object();
  }
  
  getDetail(land, fnc){
		const Station = require('../station');
		var station = new Station();			
	  var pstring = station.getTableName(land.prefecture_id);
	  
	  this.where('land_id', '=', land.land_id);
	  this.leftJoin('`lines`', 'lines.line_id', '=', 'land_lines.line_id');
	  this.leftJoin('`stationsp' + pstring + '`', '`stationsp' + pstring + '`.`station_id`', '=', 'land_lines.station_id');

	  this.get(function(result){
		  fnc(result);
	  });
  }  
  
  reflash(lid, lines){
	  var self = this;
	  this.where('land_id', '=', lid);
	  this.destory(function(){
			for (var key in lines){
				lines[key].land_id = lid;
				self.insert(lines[key]);						
			}	  		  
	  });
  }
}