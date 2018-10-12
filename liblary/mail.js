var express = require("express");
var mailer = require('nodemailer');

module.exports = class Mail{
  constructor () {
	  this.config = require('../config/mail');
	  
		//SMTPの接続
		this.smtp = mailer.createTransport(this.config);

  }
    
   
	send(id, subject, to, fnc) {		
		var self = this;
		
		var fs = require('fs');
		fs.readFile('./mail/' + id + '.ini', 'utf8', function (err, text) {
			for (var key in self.datas){
				
				var reg = new RegExp('--' + key + '--', 'g');
				console.log(reg);
				text = text.replace(reg, self.datas[key]);
			}
			
			console.log(text);

			//メールの内容
			var mailOptions = {
			    from: self.config.from,
			    to: to,
			    subject: subject,
			    text: text
			};
			
			console.log('送信前');
			//メールの送信
			var res = self.smtp.sendMail(mailOptions, function(err, res){
				console.log('送信中');
			    //送信に失敗したとき
			    if(err){
			        console.log(err);
			    //送信に成功したとき
			    }else{
			        console.log('Message sent: ' + res.message);
			    }
			    //SMTPの切断
			    self.smtp.close();
			    
			    fnc();
			});

		});
		
		
		

	}
	
}