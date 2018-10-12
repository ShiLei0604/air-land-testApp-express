var express = require("express");
var mysql   = require("mysql");
var self = this;

module.exports = class Model{
  constructor () {
    this.host = 'air-mysql-test-server.mysql.database.azure.com';
    this.user = 'air-db-admin@air-mysql-test-server';
    this.password = 'jibunnhouse-Project-2018';
    this.db = 'air_db';
    this.conn = '';
    this.params = new Array();
    this.joins = new Array();
    this.group ='';
    this.selects = '*';
    this.orders = '';
        
    
  }
    
   
	connectMysql() {		
    this.conn = mysql.createConnection({
      "host": this.host,
      "user": this.user,
      "password": this.password,
      "database": this.db
    });
    
    this.conn.connect(function(err){
        if(err) {
          console.log('接続エラー' + err);
        }
    });
	}
	
	stop(){
		//console.log('接続エラー');		
	}
	
	leftJoin(table, val1, val2, val3){
			this.joins.push(
				'LEFT JOIN ' + table + ' ON ' + val1 + val2 + val3
			);
	}
	
	where(key,type,value,andor){		
		var object = new Object();
		
		if (!andor){andor = 'AND';}
		
		object.key = key;
		object.value = value;
		object.type = type;
		object.andor = andor;
				
		this.params.push(object);		
	}

		
	select(select){
		this.selects = select;
	}
		
	groupBy(group){
		this.group = group;
	}
	orderBy(order){
		this.orders = order;
	}
		
	getWhere(){
		var where = '';
		var params = new Array();
		
		if (this.params){
			where+=' WHERE 1';
		}
		
		for (var key in this.params){
			
			if (this.params[key].value != null){
				where+= ' ' + this.params[key].andor + ' ' + this.params[key].key + ' ' + this.params[key].type + ' ?';
				params.push(this.params[key].value);
			}else{
				where+=this.params[key].key;
			}
			
		}

		return new Array(where, params);		
	}
	
	get(fnc){
		var sql = 'SELECT ' + this.selects + ' FROM `' + this.table + '`';		
		var params = this.getWhere();
		var group = '';
		var join = '';
		var orders = '';
		
		if (this.group){
			group = ' GROUP BY ' + this.group;
		}
		
		if (this.orders){
			orders = ' ORDER BY ' + this.orders;
		}
		
		for (var key in this.joins){
			join += ' ' + this.joins[key];
		}

    this.params = new Array();
    this.joins = new Array();
    this.group ='';
    this.selects = '*';
    this.orders = '';
    
		this.query(sql + join + params[0] + group + orders, params[1], fnc);	
	}

	destory(fnc){
		var sql = 'DELETE FROM ' + this.table + '';		
		var params = this.getWhere();
		
		this.query(sql + params[0], params[1], fnc);	
	}
	
	update(sets,fnc){
		var sql = 'UPDATE ' + this.table + ' SET ';				
		var params = new Array();
		var isFirst = false;
		
		for (var key in sets){
			if (isFirst){
				sql+=',';
			}
			sql+=key + '=?'	
			params.push(sets[key])
			isFirst = true;
		}
		
		var params2 = this.getWhere();
		
		for (var key in params2[1]){
			params.push(params2[1][key]);
		}

		
		if (fnc){
			this.query(sql + params2[0], params, fnc);	
		}else{
			this.query(sql + params2[0], params);				
		}
	}


	insert(datas,fnc){
				
		var sql = 'INSERT INTO ' + this.table + ' ';
		var isFirst = false;
		var colums = '(';
		var values = 'VALUES ('
		var params = new Array();
		
		for (var key in datas){
		
			
			if (isFirst){
				colums+=',';
				values+=',';
			}

			colums+=key;
			values+='?';
			
			params.push(datas[key])
			isFirst = true;
		}

		require('date-utils');
		var dt = new Date();
		var date = dt.toFormat("YYYY-MM-DD HH24:MI:SS");
		
		colums+=',created_at';
		values+=',?';
		params.push(date);
		
		sql+=colums + ') ' + values + ')';
		
		
		
		if (fnc){
			this.query(sql, params, function(rows){			
				fnc(rows);
			});	
		}else{
			this.query(sql, params);				
		}
	}
		
	query(sql, data, func){		
		this.connectMysql();
		
		this.conn.query(sql, data, 
			function (error, rows) {
				if (func){
					if (error){
						console.log(error);
						func([]);						
					}else{						
						func(rows);
					}
				}
			}
		)
		
		this.conn.end();
		this.params = new Array();
		
	}  	
}