var express = require("express");

module.exports = class ControllerItem{
  constructor () {

  }
    
	date(req, res, next) {		
		const Article = require('../model/land');
		var article = new Article();

		require('date-utils');
		var dt = new Date();
		var date = dt.toFormat("YYYY-MM-DD");
				
		article.where('due_date', '<', date);
		article.update({status:0});
	}

	
}