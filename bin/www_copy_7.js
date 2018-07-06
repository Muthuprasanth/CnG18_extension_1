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

var request = require('request');

var decoder = new StringDecoder('utf8');

var java = [];
var jk=0,ans=0;
var answers =[];
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
console.log("hiihihihd",java);

var answerlinestream = new DelimiterStream(); 
var answerinput = fs.createReadStream('answer.txt');
answerlinestream.on('data', function(chunk) {
  //console.log(decoder.write(chunk));
  answers[ans]=decoder.write(chunk);
  ans++;
 // console.log("----------------------");
});
answerinput.pipe(answerlinestream);
console.log("Answer file",answers);


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

/*

   async function (session, results) {
       qna[java[1]]=results.response;
       candidateresponsekeyphrases = await textanalyics(results.response);
       console.log("candidateresponsekeyphrases",candidateresponsekeyphrases);
     // k++;
     
        builder.Prompts.text(session, java[2]);
    },

*/


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
let score = 0;
var choice = ["Yes","Wait"];
//getRandomInt();

console.log("dfsfdsf------- csfsdf");
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector, [
  async  function (session) {
      let candidateresponsekeyphrases,qnakeyphrases,qnaresponse;
      let subtotal;
    //  getRandomInt();
      session.sendTyping();
      session.send("Your Interview starts now");   
      builder.Prompts.text(session, java[0]);
      //builder.Prompts.choice(session, "Shall we proceed to Next Question", choice,{listStyle: 3});
           
      // session.send(card1);
      session.send("Hi " + session.user.userName);
      session.send("Hi " + session.user.username);
      /*  session.send("Hi " + session.message.user.name);
        session.send(session.message.user.id);
        session.send(session.message.address.user.name);*/
       // builder.Prompts.confirm(session, "Are you sure you wish to cancel your order?","yes|no");
       // builder.Prompts.text(session, java[0]);
    },
    async function (session, results) {
      //console.log("Yes or No value is ",results.response.entity);
        score = 0;
      // qna[java[question_num[k]]]=results.response;
       //k++;
        qna[java[0]]=results.response;
        session.sendTyping();
        confirmMessage(session, results);
        candidateresponsekeyphrases = await textanalyics(results.response);
        console.log("candidateresponsekeyphrases",candidateresponsekeyphrases);
        // k++;
        console.log("gotkeyphrases");
       // qnaresponse = await qnaMaker(java[0]);
        //console.log("qnaresponse ",qnaresponse);
        qnakeyphrases = await textanalyics(answers[0]);
        console.log("qnakeyphrases",qnakeyphrases);
        subtotal =  comparepheases(candidateresponsekeyphrases,qnakeyphrases);
        console.log("score1 "+score+" subtotal1 "+subtotal);
        score = score+subtotal;
        console.log("score2 "+score+" subtotal2 "+subtotal);
        builder.Prompts.text(session, java[1]);
    },
    async function (session, results) {
       qna[java[1]]=results.response;
       session.sendTyping();
       candidateresponsekeyphrases = await textanalyics(results.response);
       console.log("candidateresponsekeyphrases",candidateresponsekeyphrases);
     // k++;    
        console.log("gotkeyphrases");
      //  qnaresponse = await qnaMaker(java[1]);
      //  console.log("qnaresponse ",qnaresponse);
        qnakeyphrases = await textanalyics(answers[1]);
        console.log("qnakeyphrases",qnakeyphrases);
        subtotal =  comparepheases(candidateresponsekeyphrases,qnakeyphrases);
        console.log("score1 "+score+" subtotal1 "+subtotal);
        score = score+subtotal;
        console.log("score2 "+score+" subtotal2 "+subtotal);
        builder.Prompts.text(session, java[2]);
    },
    async function (session, results) {
      qna[java[2]]=results.response;
      candidateresponsekeyphrases = await textanalyics(results.response);
      console.log("candidateresponsekeyphrases",candidateresponsekeyphrases);
    // k++;
      console.log("gotkeyphrases");
    //  qnaresponse = await qnaMaker(java[2]);
    //  console.log("qnaresponse ",qnaresponse);
      qnakeyphrases = await textanalyics(answers[2]);
      console.log("qnakeyphrases",qnakeyphrases);
      subtotal =  comparepheases(candidateresponsekeyphrases,qnakeyphrases);
      console.log("score1 "+score+" subtotal1 "+subtotal);
      score = score+subtotal;
      console.log("score2 "+score+" subtotal2 "+subtotal);
      builder.Prompts.text(session, java[3]);
   },

    async function (session, results) {
        qna[java[3]]=results.response;
        session.sendTyping();
        candidateresponsekeyphrases = await textanalyics(results.response);
        console.log("candidateresponsekeyphrases",candidateresponsekeyphrases);
        console.log("gotkeyphrases");
      //  qnaresponse = await qnaMaker(java[3]);
      //  console.log("qnaresponse ",qnaresponse);
        qnakeyphrases = await textanalyics(answers[3]);
        console.log("qnakeyphrases",qnakeyphrases);
        subtotal =  comparepheases(candidateresponsekeyphrases,qnakeyphrases);
        console.log("score1 "+score+" subtotal1 "+subtotal);
        score = score+subtotal;
        console.log("score2 "+score+" subtotal2 "+subtotal);
        builder.Prompts.text(session, java[4]);
      //  session.send("thank you");
      //  session.beginDialog("/print");
      //  k=0;
    },
    async function (session, results) {
      qna[java[4]]=results.response;
      session.sendTyping();
      candidateresponsekeyphrases = await textanalyics(results.response);
      console.log("candidateresponsekeyphrases",candidateresponsekeyphrases);
      console.log("gotkeyphrases");
     // qnaresponse = await qnaMaker(java[4]);
     // console.log("qnaresponse ",qnaresponse);
      qnakeyphrases = await textanalyics(answers[4]);
      console.log("qnakeyphrases",qnakeyphrases);
      subtotal =  comparepheases(candidateresponsekeyphrases,qnakeyphrases);
      console.log("score1 "+score+" subtotal1 "+subtotal);
      score = score+subtotal;
      console.log("score2 "+score+" subtotal2 "+subtotal);
      session.send("thank you");
     // session.send("Your score is "+score);
      session.beginDialog("/print");

    //  k=0;
    },
]);

bot.dialog('/print', function (session) {
//session.send("printed");
  //session.send("The candidate score is "+score);
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
      html: "The Candidate got <b>"+score+" </b> in the interview \n"+answer,
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

function confirmMessage(session, results)
{

}

function comparepheases(candidateresponsekeyphrases,qnakeyphrases)
{
  console.log("inside compariosion");
  let total = 0;
  for(let a=0;a<qnakeyphrases.length;a++)
  {
    for(let b=0;b<candidateresponsekeyphrases.length;b++)
    {
      //console.log("qnakeyphrases "+qnakeyphrases[a]+" candidateresponsekeyphrases"+candidateresponsekeyphrases[b]);
      if(qnakeyphrases[a].toUpperCase().trim() === candidateresponsekeyphrases[b].toUpperCase().trim())
      {
        console.log("Matched phrase is",qnakeyphrases[a]);
        total++;
      }
    }
  }
  console.log("Total match is",total/qnakeyphrases.length);
  return total/qnakeyphrases.length;
}

function qnaMaker(question) {
  let body_,answer;
  console.log("inside qnaMaker");
  let documents = {
   'question':"Explain IL",
  };
  var options3 = {
    method: 'post',
    headers: {
      'Authorization':'EndpointKey 316818ad-d8b1-4918-82b8-f0d7b02b91af',
      'Content-Type':'application/json',
      //'Ocp-Apim-Subscription-Key': '2437ab2f3fc04c65a3a2322e3463fca8',
      // 'Content-Type':'application/json',
      // 'Accept':'application/json',
    },
    body: JSON.stringify(documents),
    // body: documents,
    url: 'https://hiring-bot-2.azurewebsites.net/qnamaker/knowledgebases/50bc5e2a-da5b-4401-bc75-a73f9dd7e4e2/generateAnswer',
  }
  //let promiseTOTextAnalytics = 
  return new Promise(function (resolve, reject) {
    request(options3, function (err, result, body) {
      if (err) {
        console.log("error is ", err);
        // res.json({ message: 'Error occurred in Reading a file'+ err });
      }
      else {
        // console.log("body content is",body);
        body_ = JSON.parse(body);
        //console.log("qnamake response",body_.answers[0].answer);
        answer = body_.answers[0].answer;
        // let body__ = JSON.stringify (body_, null, '  ');
       // let keyphrases = body_.documents[0].keyPhrases;
       // let keyphrasesarray =[];
       // keyphrasesarray = keyphrases;
        // console.log ("output type is", typeof keyphrases,Object.keys(keyphrases).length);  
        // console.log ("output is",body_.documents[0].keyPhrases[146]);  
        // console.log ("output keyphrases is",body_.documents[0].keyPhrases);   
        resolve(answer);
      }
      // var thesaurus = require("thesaurus");
      // console.log(thesaurus.find("java"));

    });
  });

}

function textanalyics(question) {
  let body_;
  console.log("inside textanalytics",question);

  let documents = {
    'documents': [
      { "language": "en", 'id': '1', 'text': question },
    ]
  };
  var options3 = {
    method: 'post',
    headers: {
      'Ocp-Apim-Subscription-Key': 'ad883f4fcd994bc190b723810ac525c5',
      // 'Content-Type':'application/json',
      // 'Accept':'application/json',
    },
    body: JSON.stringify(documents),
    // body: documents,
    url: 'https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases',
  }
  //let promiseTOTextAnalytics = 
  return new Promise(function (resolve, reject) {
    request(options3, function (err, result, body) {
      if (err) {
        console.log("error is ", err);
        // res.json({ message: 'Error occurred in Reading a file'+ err });
      }
      else {
        // console.log("body content is",body);
        body_ = JSON.parse(body);
        // let body__ = JSON.stringify (body_, null, '  ');
        let keyphrases = body_.documents[0].keyPhrases;
        let keyphrasesarray =[];
        keyphrasesarray = keyphrases;
        // console.log ("output type is", typeof keyphrases,Object.keys(keyphrases).length);  
        // console.log ("output is",body_.documents[0].keyPhrases[146]);  
        // console.log ("output keyphrases is",body_.documents[0].keyPhrases);   
        resolve(keyphrasesarray);
      }
      // var thesaurus = require("thesaurus");
      // console.log(thesaurus.find("java"));

    });
  });

}


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
