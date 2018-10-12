var express = require("express");
const Model = require('../../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'land_coordinate';
		
		this.result = new Object();
  }
  
  
  getDetailLand(id, fnc){
	  console.log(id);
	  
	  this.where('land_id', '=', id);
		
	  this.getView(function(result){
			const Land = require('../land');
			var land = new Land();		  
			var result2 = land.getDetail(id, function(result2){
				if (result2[0]){
					//result[0]['land_image'] = result2[0]['land_image'];		
					//result[0]['direction'] = result2[0]['direction'];		
				}
									
				fnc(result);
			});
					 
			 
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
	
	add(datas, fnc){
		this.insert(datas, function(result){
			fnc(result);
		});
	}
}