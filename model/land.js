var express = require("express");
const Model = require('../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'land';
		
		this.result = new Object();
  }
  
  leftAddress(){
		this.leftJoin('prefectures', 'prefectures.prefecture_id', '=', 'land.prefecture_id');  
		this.leftJoin('cities', 'cities.city_id', '=', 'land.city_id'); 
  }
  
  getDetail(id, fnc){
	  this.where('land.land_id', '=', id);
	  this.getView(fnc);
  }
  
	getView(fnc) {		
		require('date-utils');
		var dt = new Date();
		var date = dt.toFormat("YYYY-MM-DD");

		
		//this.where('due_date', '>=', date);
		
		var res = this.get(function(result){
			fnc(result);	
		});
			
	}
	
	whereSearch(keyword,sort){
		this.select('land.*,CONCAT(prefecture_name,city_name,detail_address) as address,0');
		this.leftAddress();

		if (keyword){
			this.where('CONCAT(prefecture_name,city_name,detail_address)', 'LIKE', '%' + keyword + '%');
		}
		if (sort){
			this.orderBy(sort);
		}	
	}
	
	whereNotInput(){		
		this.where(' AND (0');
		
		this.where(' OR land.title IS NULL');
		this.where(' OR land.detail_address IS NULL');		
		this.where(' OR land.prefecture_id IS NULL');
		this.where(' OR land.city_id IS NULL');
		this.where(' OR land.size IS NULL');
		this.where(' OR land.amount IS NULL');
		this.where(' OR land.text IS NULL');
		this.where(' OR land.floor_area_ratio IS NULL');
		this.where(' OR land.coverage IS NULL');
		this.where(' OR land.due_date IS NULL');
		
		this.where(')');

	}
	
	selectCount(){
		this.selects+=',COUNT((SELECT COUNT(*) FROM match_pair WHERE land.land_id = match_pair.land_id)) as count_match,';
		this.selects+='SUM((SELECT COUNT(*) FROM favorite_history WHERE favorite_history.match_id = match_pair.match_id)) as count_favorite,';
		this.selects+='SUM((SELECT SUM(hit_volume) FROM land_search_hit WHERE land_search_hit.match_id = match_pair.match_id)) as count_search,';
		this.selects+='SUM((SELECT COUNT(*) FROM view_history WHERE view_history.match_id = match_pair.match_id)) as count_view';
		this.leftJoin('match_pair', 'land.land_id', '=',  'match_pair.land_id');
		this.groupBy('land.land_id');
		
		console.log(this.selects);
	}
	
	getFavoriteCount(id, fnc){
		fnc(1);
	}
	
	getAddress(article, key, fnc){
		const Prefecture = require('./prefecture');
		var prefecture = new Prefecture();
		var address = '';
				
		prefecture.where('prefecture_id', '=', parseInt(article.prefecture_id));		  		
		prefecture.get(function(result){

			address+=result[0].prefecture_name;

			const City = require('./city');
			var city = new City();
			city.where('city_id', '=', parseInt(article.city_id));		  		

			city.get(function(result){
				address+= result[0]['city_name'];
				address+= article.detail_address;
				
				fnc(address, key);
			});
		});
	}
	
	add(datas, aid, fnc){
		datas.agency_id = aid;
		this.insert(datas, function(result){
			//他のテーブルにも空を挿入しておく
			var lid = result.insertId;				
			const Coordinate = require('./lands/coordinate');
			var coordinate = new Coordinate();
			var datas = {land_id:lid};

			coordinate.add(datas, function(result){
				const Road = require('./lands/road_connection');
				var road = new Road();
				var datas = {land_id:lid};

				
				
				road.add(datas, function(){
					fnc(lid);
				});
				
			});			
		});
	}
	
	delete(lid, aid, fnc){
		var self = this;
		
		const Road = require('./lands/road_connection');
		var road = new Road();
		road.where('land_id', '=', lid);				
		
		road.destory(function(result){
			const Coordinate = require('./lands/coordinate');
			var coordinate = new Coordinate();		
			
			coordinate.where('land_id', '=', lid);	

			coordinate.destory(function(result){				
				self.where('land_id', '=', lid);	
				self.destory(fnc);
			});
			
		});
	}
	
}