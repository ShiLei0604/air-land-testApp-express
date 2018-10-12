var express = require("express");
const Model = require('../liblary/model');


module.exports = class ModelItem extends Model {
  constructor () {
		super();
		
		this.table = 'prefectures';
		
		this.result = new Object();
  }
  
  
}