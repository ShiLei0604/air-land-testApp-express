var express = require('express');
var router = express.Router();



const Controller = require('../liblary/controller');
var controller = new Controller();

router.get('/test', function(req, res, next) {	
	controller.set('login@test', req, res, next);
});

router.get('/login/reminder', function(req, res, next) {	
	controller.set('login@reminder', req, res, next);
});

router.get('/login', function(req, res, next) {	
	controller.set('login@index', req, res, next);
});

router.get('/articleedit/insert', function(req, res, next) {	
	controller.set('articleedit@insert', req, res, next);
});
router.get('/articleedit/delete', function(req, res, next) {	
	controller.set('articleedit@delete', req, res, next);
});
router.get('/articleedit/update', function(req, res, next) {	
	controller.set('articleedit@update', req, res, next);
});

router.get('/article/detail', function(req, res, next) {	
	controller.set('article@detail', req, res, next);
});

router.get('/article', function(req, res, next) {	
	controller.set('article@index', req, res, next);
});

router.get('/coordinate/detail', function(req, res, next) {	
	controller.set('coordinate@detail', req, res, next);
});

router.get('/coordinate/edit', function(req, res, next) {	
	controller.set('coordinate@edit', req, res, next);
});

router.get('/tag', function(req, res, next) {	
	controller.set('tag@index', req, res, next);
});

router.get('/tag/update', function(req, res, next) {	
	controller.set('tag@update', req, res, next);
});

router.get('/agencies', function(req, res, next) {	
	controller.set('agencies@index', req, res, next);
});

router.get('/agencies/update', function(req, res, next) {	
	controller.set('agencies@update', req, res, next);
});

router.get('/agencies/password', function(req, res, next) {	
	controller.set('agencies@password', req, res, next);
});

router.get('/agencies/password/update/', function(req, res, next) {	
	controller.set('agencies@passwordUpdate', req, res, next);
});

router.get('/area/prefectures/', function(req, res, next) {	
	controller.set('area@prefectures', req, res, next);
});
router.get('/area/cities/', function(req, res, next) {	
	controller.set('area@cities', req, res, next);
});
router.get('/area/lines/', function(req, res, next) {	
	controller.set('area@lines', req, res, next);
});
router.get('/area/stations/', function(req, res, next) {	
	controller.set('area@stations', req, res, next);
});

//cron処理
var CronJob = require("cron").CronJob;
var cronTime = '* * * * * *';

new CronJob({
  cronTime: cronTime,
  onTick: function () {
    controller.set('cron@date', null, null, null);
  },
  start: true
});


module.exports = router;
