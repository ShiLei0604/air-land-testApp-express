var express = require("express");

var self = this;

module.exports = class Controller{
  constructor () {

  }
    
	set(name, req, res, next) {
		var names = String(name).split('@');
		
		const ControllerItem = require('../controller/' + names[0]);
		var item = new ControllerItem();
		var $action = names[1];
		
		item[$action](req, res, next);		
	}
	
}