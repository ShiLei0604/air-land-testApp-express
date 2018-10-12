var express = require("express");
const Model = require('../../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'realestate_agencies_sid';
		
		this.result = new Object();
  }
  
  	

	
}