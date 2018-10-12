var express = require("express");

module.exports = class ControllerItem{
  constructor () {

  }
    	
	detail(req, res, next) {		
		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		
		var data = JSON.parse(req.query.json);

		
		user.auth(data.sid, function(result){
			var resultText = new Object();
			
			if (result[0]){
				resultText.result = 'ok';

				const Land = require('../model/land');
				var land = new Land();
				land.where('land_id', '=', data.id);
				land.get(function(resultLand){
					

	
					const Coordinate = require('../model/lands/coordinate');
					var coordinate = new Coordinate();
					coordinate.select('*');
					coordinate.getDetailLand(data.id, function(result){						
						
						resultText.data = new Object();		
						resultText.data.direction = resultLand[0]['direction'];				
						resultText.data.coordinates = result;
						
						const Road = require('../model/lands/road_connection');
						var road = new Road();

						resultText.data.road = new Array();
						road.where('land_id', '=', data.id);
						road.get(function(result2){
							if ((result2) && (result2[0]) ){
								resultText.data.road = result2;
															
								res.send(JSON.stringify(resultText));					
							}else{
								res.send(JSON.stringify(resultText));								
							}
						});					
					});		
				});
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}

		});
		
	}

	edit(req, res, next) {		
		const User = require('../model/realestate/agencies');
		var user = new User();						
		var data = JSON.parse(req.query.json);		
		
		user.auth(data.sid, function(result){
			var resultText = new Object();
			
		
			if (result[0]){
				resultText.result = 'ng';

				const Coordinate = require('../model/lands/coordinate');
				var coordinate = new Coordinate();
				var coordinateId = 0;
				var coordinates = new Array();
								
				const Land = require('../model/land');
				var land = new Land();
										
				land.where('land_id', '=', data.land_id);
				land.update({direction:data.datas.direction}, function(){
					//方向の更新
					
					coordinate.where('land_id', '=', data.land_id);
					coordinate.destory(function(){	
						//関連データを全て削除したあと
							var async = require('async');
							var syncs = new Array();
							
	
							for (var key in data.datas.coordinates){
								data.datas.coordinates[key].land_id = data.land_id;
	
								syncs.push(
									function(callback) {

										
										if (!data.datas.coordinates[coordinateId]){
											roadId++;
											coordinateId = 0;
										}
	
										var statics = data.datas.coordinates[coordinateId];
										
	
	
										
										delete statics.direction;
										
										coordinate.insert(statics, function(result){
											var id = result.insertId;	

											coordinates[coordinateId]	 = id ;																																								
											coordinateId++;
											callback(null, '');
										});
								});
	
	
						}


						//同期処理
						async.series(syncs, 
							function (err, results) {

								var async = require('async');
								var syncs = new Array();
								
								if (err) {
			        		throw err;
								}

								const Road = require('../model/lands/road_connection');
								var road = new Road();
																	
								road.where('land_id', '=', data.land_id);
								road.destory(function(){	
									
									var count = 1;
									
									
									for (var keyRoad in data.datas.roads){
										data.datas.roads[keyRoad].start_land_coordinate_id = coordinates[data.datas.roads[keyRoad].start_land_coordinate_id];
										data.datas.roads[keyRoad].end_land_coordinate_id = coordinates[data.datas.roads[keyRoad].end_land_coordinate_id];
										data.datas.roads[keyRoad].land_id = data.land_id;
										
										road.insert(data.datas.roads[keyRoad], function(){
											if (count == data.datas.roads.length){
												resultText.result = 'ok';
												res.send(JSON.stringify(resultText));
											}
											count++;

										});																					
									}
								});
					
							});																		
					});						
					
				});
										
									

				
					
				
					
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}

		});
		
	}
	
}