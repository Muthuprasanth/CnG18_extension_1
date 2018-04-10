#!/usr/bin/env node

/**
 * Module dependencies.
 */
var builder = require('botbuilder');
var app = require('../app');
var debug = require('debug')('bot-framework-and-express-1:server');
var http = require('http');
var restify = require('restify');

const fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');



 var Sendgrid = require("sendgrid-web");

var MICROSOFT_APP_ID="3935f689-309f-4bea-a782-dd4fdce254b4";
var MICROSOFT_APP_PASSWORD="lxhzsAWN636!@igSVVO89|*";

var restify = require('restify');
var builder = require('botbuilder');
/**
 * Get port from environment and store in Express.
 */


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

function getRandomInt() {
  console.log("I am in random function");
  for(let i=0;i<5;i++)
  {
    question_num[i]= Math.floor(Math.random() * Math.floor(10));
  }
  console.log("randommm",question_num);
  }



var java = [ 'What is difference between JDK,JRE and JVM?', 
'What is JIT compiler?', 
'What is the main difference between Java platform and other platforms?',
 'What is classloader?',
 'What if I write static public void instead of public static void?',
 'What is the default value of the local variables?',
 'What is constructor?',
 'Can you make a constructor final?',
 'What is static variable?',
 'What is static block?'];
var question;
var qna=[];
var question_num=[];
var k=0;
var answer="";
//getRandomInt();

console.log("dfsfdsf------- csfsdf");

//bot.use(Middleware.dialogVersion({version: 1.0, resetCommand: /^reset/i}));

// If a Post request is made to /api/messages on port 3978 of our local server, then we pass it to the bot connector to handle
server.post('/api/messages', connector.listen());
//var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector, [
    function (session) {
      getRandomInt();
        session.send("Your Interview starts now");
        session.send("Hi " + session.message.user.name);
        session.send(session.message.user.id);
        session.send(session.message.address.user.name);
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


//help dialog starts
bot.dialog('help', function (session, args, next) {
    //Send a help message
    session.endDialog("Global help menu.");
})
// Once triggered, will start a new dialog as specified by
// the 'onSelectAction' option.
.triggerAction({
    matches: /^help$/i,
   // onSelectAction: (session, args, next) => {
        // Add the help dialog to the top of the dialog stack 
        // (override the default behavior of replacing the stack)
     //   session.beginDialog(args.action, args);
   // }
});
//help dialog ends



bot.dialog('/print', function (session) {
//session.send("printed");
      for (var key in qna) {
        answer += "Question : "+key+"\n\tanswer : "+qna[key]+"\n";
        // console.log(qna[key]);
        }
//session.send(answer);
//session.send("printed2");
console.log("send mail");








     var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
     // user: 'example1@gmail.com',
      user: 'example1@gmail.com',
      pass: 'example1'
      }
      });

      var mailOptions = {
    //  from: 'example1@gmail.com',
    //  to: 'example1@yahoo.com',
      from: 'example1@gmail.com',
      to: 'example1@gmail.com',
      subject: 'Candidate assessment results',
      text: 'Please Find the attached document for the candidate assessment'+answer,
       /* attachments: [{
        filename: 'message1.docx',
        content:answer
        }]*/
     };

      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        session.send(" ERROR Mail is not send");
      console.log(error);
      } else {
      //  session.send("corrected");
   //   console.log('nt: ' + info.response);
      session.send("Your report is send to our Team");
      }
      }); 

      /*  fs.appendFile('message1.docx', answer, function (err) {
        if (err) 
          {
            session.send(err);
            throw err;

          };
        console.log('Saved!');
        sendEmail();
        });*/
       

});


/*function sendEmail(){
  console.log("send mail");
      var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
      user: 'example1@gmail.com',
      pass: 'example1'
      }
      }));

      var mailOptions = {
      from: 'example1@gmail.com',
      to: 'example1@yahoo.com',
      subject: 'Congratulations! You are selected for the first level of interview with us',
      text: 'Please Find the attached document for the candidate assessment'+answer,
       /* attachments: [{
        filename: 'message1.docx',
        content:answer
        }]
      };

      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
      console.log(error);
      } else {
      console.log('Email sent: ' + info.response);
      }
      }); 
      }*/


//.set('storage', inMemoryStorage); 

// =========================================================
// Bots Dialogs 
// =========================================================
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

