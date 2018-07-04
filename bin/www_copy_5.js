#!/usr/bin/env node
var app = require('../app');
var debug = require('debug')('bot-framework-and-express-1:server');
var http = require('http');

const fs = require('fs');

var restify = require('restify');
var builder = require('botbuilder');
var Sendgrid = require("sendgrid-web");

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var DelimiterStream = require('delimiter-stream');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var java = [];
var jk=0;

console.log("updated");
var linestream = new DelimiterStream(); 
var input = fs.createReadStream('somefile.txt');
linestream.on('data', function(chunk) {
  //console.log(decoder.write(chunk));
  java[jk]=decoder.write(chunk);
  jk++;
 // console.log("----------------------");
});
input.pipe(linestream);

console.log("hiihihihd",java)

var MICROSOFT_APP_ID="9c011e01-a307-4aa5-b9a6-13b3b5df47d1";
var MICROSOFT_APP_PASSWORD="qmebxjYOX413uQBIP53#[);";

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 4990, function () {
 console.log('%s listening to %s', server.name, server.url);
});
// Create chat bot
var connector = new builder.ChatConnector({
  //uses CnG18 app
 appId: MICROSOFT_APP_ID,
 appPassword: MICROSOFT_APP_PASSWORD
});

/*var config = 
{
 userName: 'Muthuprasanth', // update me
 password: 'Sirius@25', // update me
 server: 'sendgridazure.database.windows.net', // update me
 options: 
  {
     database: 'Sendgrid_DB', //update me
     encrypt: true
  }
}*/
var config =
{
  userName: 'Muthuprasanth', // update me
  password: 'Sirius@25', // update me
  server: 'textanalsisapi.database.windows.net', // update me
  options:
  {
    database: 'textanalayserapi', //update me
    encrypt: true
  }
}

function getRandomInt() {
  console.log("I am in random");
  for(let i=0;i<5;i++)
  {
    question_num[i]= Math.floor(Math.random() * Math.floor(10));
  }
  console.log("randommm",question_num);
  }

/*var java = [ 'What is difference between JDK,JRE and JVM?', 
'What is JIT compiler?', 
'What is the main difference between Java platform and other platforms?',
 'What is classloader?',
 'What if I write static public void instead of public static void?',
 'What is the default value of the local variables?',
 'What is constructor?',
 'Can you make a constructor final?',
 'What is static variable?',
 'What is static block?'];*/
var question;
var qna=[];
var question_num=[];
var k=0;

//getRandomInt();

console.log("dfsfdsf------- csfsdf");
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector, [
    function (session) {
    //  getRandomInt();
        session.send("Your Interview starts now");
      /*  session.send("Hi " + session.message.user.name);
        session.send(session.message.user.id);
        session.send(session.message.address.user.name);*/
        builder.Prompts.text(session, java[0]);
    },
    function (session, results) {
      // qna[java[question_num[k]]]=results.response;
       //k++;
        qna[java[0]]=results.response;
        // k++;
        builder.Prompts.text(session, java[1]);
    },
    function (session, results) {
       qna[java[1]]=results.response;
     // k++;
        builder.Prompts.text(session, java[2]);
    },

    function (session, results) {
        qna[java[2]]=results.response;
        session.send("thank you");
        session.beginDialog("/print");
      //  k=0;
    }
]);

bot.dialog('/print', function (session) {
//session.send("printed");
  var sendgridCredentials = [];
  var next=0;
  var answer="";
  for (var key in qna) {
    answer += "Question : "+key+"\n\tanswer : "+qna[key]+"\n";
    // console.log(qna[key]);
    }
  console.log("send mail");
   console.log("send mail");
  let promiseTOGetSendgridCredential =  new Promise(function(resolve,reject){
    var connection = new Connection(config);
    connection.on('connect', function(err) {
       if (err) 
       {
          console.log(err)
       }
      else
       {
        let  tediousRequest = new Request(
          "SELECT  username,password FROM dbo.userdetails",
          function(err, rowCount, rows) 
            {
                resolve();
            }
          );
          tediousRequest.on('row', function(columns) {
             columns.forEach(function(column) {
             sendgridCredentials[next]=column.value;
             next++;
           });
          });
          connection.execSql(tediousRequest);
       }
    });
  });

  promiseTOGetSendgridCredential.then(function(){

  console.log("sendgridCredentials---------",sendgridCredentials);
    var sendgrid = new Sendgrid({
      user: sendgridCredentials[0],//provide the login credentials
      key:sendgridCredentials[1]
    });
    sendgrid.send({
      to: 'mprasanth113@gmail.com',
      from: 'mprasanth113@gmail.com',
      subject: 'Interview Report',
      html: answer
    }, function (err) {
      if (err) {
        console.log("Mail error",err);
      } else {
        console.log("Success Mail sended From Azure ");
        session.endDialog("Your Interview Report is send to our HR");
        //session.send("Your Interview Report is send to our HR");
        answer="";
      }
    });
  });

});

// This is called the root dialog. It is the first point of entry for any message the bot receives
/*
var bot = new builder.UniversalBot(connector);
bot.dialog('/', function (session) {
// Send 'hello world' to the user
//session.send(session.message.user);
//session.send(MICROSOFT_APP_ID);

session.send("Your Interview strats now");
session.beginDialog("/questions");
});

bot.dialog("/questions", [
    //question = java[getRandomInt()];
    function (session) {
      console.log("I am first");
        builder.Prompts.text(session,java[question_num[k]]);
    },
    // Step 2
    function (session, results) {
       console.log("I am second");
      qna[java[question_num[k]]]=results.response;
      k++;
      builder.Prompts.text(session,java[question_num[k]]);
    },
     function (session, results) {
       console.log("I am third");
        qna[java[question_num[k]]]=results.response;
      k++;
      builder.Prompts.text(session,java[question_num[k]]);
    },
     function (session, results) {
       console.log("I am fourth");
       qna[java[question_num[k]]]=results.response;
      k++;
      builder.Prompts.text(session,java[question_num[k]]);
    },

    function (session, results) {
       console.log("I am fifth");
     qna[java[question_num[k]]]=results.response;
      console.log("final array",qna);
      session.endDialog("thank you");
    }
   
]);
*/

