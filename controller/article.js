var express = require("express");

module.exports = class ControllerItem{
  constructor () {

  }
    
	index(req, res, next) {		

		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);
		
		user.auth(data.sid, function(result){
			var resultText = new Object();
			
			if (result[0]){
				resultText.result = 'ok';

				const Article = require('../model/land');
				var article = new Article();
				
				var max = 0;
				var ok = 0;
				var totals = new Object();
				

				//全て個数の取得
				article.whereSearch(data.keyword);
				article.selects+=',COUNT(*) as total';
				article.get(function(result){
					if (result[0]){
						totals[0] = result[0].total; 
					}
					
				
					//公開済みの取得
					article.whereSearch(data.keyword);
					article.selects+=',COUNT(*) as total';
					article.where('status', '=', 1);
					
					article.get(function(result){
						if (result[0]){
							totals[1] = result[0].total; 
						}
						
						//非公開の取得
						article.whereSearch(data.keyword);
						article.selects+=',COUNT(*) as total';
						article.where('status', '=', 0);
						article.get(function(result){
							if (result[0]){
								totals[2] = result[0].total; 
							}

							//未入力の取得
							article.whereSearch(data.keyword);
							article.whereNotInput();
							article.selects+=',COUNT(*) as total';
							article.get(function(result){
								if (result[0]){
									totals[3] = result[0].total; 
									console.log(totals[3]);
								}
								
								//全体の取得				


								if (data.target != null){
									if (data.target == 2){
										article.whereNotInput();
									}else{
										article.where('status', '=',  data.target);					
									}
								}

								article.whereSearch(data.keyword,data.sort);
								article.selectCount();		
								
								article.getView(function(result){
									if ((result) && (result[0])){

										//接道などの読み込み
										const Coordinate = require('../model/lands/coordinate');
										var coordinate = new Coordinate();
										const Road = require('../model/lands/road_connection');
										var road = new Road();
										var async = require('async');
										var syncs = new Array();
										var count = 0;
										
										for (var keyResult in result){
											syncs.push(
												function(callback) {
													
													coordinate.where('land_id', '=', result[count].land_id);
													coordinate.get(function(resultCoor){
														result[count].coordinates = resultCoor;
														
														road.where('land_id', '=', result[count].land_id);
														road.get(function(resultRoad){														
															result[count].roads = resultRoad;
															count++;
															callback(null, '');
														});
													});
											});
										}
										
										async.series(syncs, function (err, results) {		
											resultText.countAll = totals[0];	
											resultText.countOpen = totals[1];
											resultText.countNotOpen = totals[2];																
											resultText.countNotInput = totals[3];																
											
											resultText.data = result;
					
					
											res.send(JSON.stringify(resultText));
										});
									}else{
										resultText.result = 'empty';
										res.send(JSON.stringify(resultText));							
									}
								});		
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
	
	detail(req, res, next) {		
		const User = require('../model/realestate/agencies');
		var user = new User();						
		
		var data = JSON.parse(req.query.json);

		user.auth(data.sid, function(result){
			var resultText = new Object();
		
			if (result[0]){
				resultText.result = 'ok';

				const Article = require('../model/land');
				var article = new Article();

				article.select('*,land.land_id as land_id');									
				article.selectCount();	
				article.getDetail(data.id, function(result){

					//沿線など
					const Lines = require('../model/lands/lines');
					var lines = new Lines();
					
					if (result[0]){																			
						lines.getDetail(result[0], function(resultLine){
							result[0].lines = resultLine;
							
							//形状のイメージ取得
							const Coordinate = require('../model/lands/coordinate');
							var coordinate = new Coordinate();
						
							
							coordinate.where('land_id', '=', data.id);
							coordinate.get(function(resultConor){
								if (resultConor){
									if (resultConor[0]){
										result[0].shape_image = resultConor[0].shape_image;
									}else{
										result[0].shape_image = '';										
									}
									
									result[0].coordinates = resultConor;
								}
								
								//住所の取得
								result[0].address = article.getAddress(result[0], 0,function(result2, key2){
									const Road = require('../model/lands/road_connection');
									var road = new Road();									

									road.where('land_id', '=', result[0].land_id);
									road.get(function(resultRoad){	
										result[0].roads = resultRoad;
										result[0].address = result2;
										resultText.data = result[0];
										res.send(JSON.stringify(resultText));	
									});
								});									
						
							});
						});
							
						
					}else{
						resultText.result = 'ng';
						res.send(JSON.stringify(resultText));	
					}
					
				});		
				
			}else{
				resultText.result = 'ng';
				res.send(JSON.stringify(resultText));	
			}

		});
		
	}
	
}