//www_voice_3.js
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

var juice = require('juice');

var toWav = require('audiobuffer-to-wav')
const AudioContext = require('web-audio-api').AudioContext;
var context = new AudioContext();
var HttpClient = require('http-client').createFetch;
//var httpClient = new HttpClient();

var load = require('audio-loader');
const Lame = require("node-lame").Lame;
var readChunk = require('read-chunk'); 
const { BingSpeechClient, VoiceRecognitionResponse } = require('bingspeech-api-client');
var https = require('https');

var decoder = new StringDecoder('utf8');
var java = [];
var jk=0,ans=0;
var answers =[];
var candidateanswer = "",candidatename = "";
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

var MICROSOFT_APP_ID="b23753fe-a695-4f1c-a94a-86fc3a0eb8c8";
var MICROSOFT_APP_PASSWORD="xebERNFFF03;]clxnD982+|";

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

var config =
{
  userName: 'Muthuprasanth', // update me
  password: 'Sirius@25', // update me
  server: 'sendgridserver.database.windows.net', // update me
  options:
  {
    database: 'sendgridDB11', //update me
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
// var inMemoryStorage = new builder.MemoryBotStorage();
 
var question;
var qna=[];
var question_num=[];
var k=0;
let score = 0;
let choiceresponse ="";
let feedbackresponse = "";
var choice = ["Yes","Next"];
var finalchoice = ["Yes","Finish"];
var feedbackchoice = ["Yes","No"];
//getRandomInt();

console.log("dfsfdsf------- csfsdf");
server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector, function (session) {

  var msg = session.message;
              //if (msg.attachments.length) {
                let audiouri = "";
                console.log("msg    ",msg);
                if (msg.attachments.length) {
                  let audiouri = "";
                  console.log("+++++++++++++++++++++++++++++++++++++++++++");
                  console.log("msg    ",msg);
                  console.log("----------------------");
                //  console.log("results    ",results);
                  console.log("url is ",msg.attachments[0].contentUrl+"/"+msg.attachments[0].name);
                  audiouri = msg.attachments[0].contentUrl+"/"+msg.attachments[0].name;
                  console.log("audiouri is",audiouri);
            
                /*  load(audiouri).then(function (buffer) {
                    console.log("Audio Buffer is  ",buffer) // => <AudioBuffer>
                    var wav = toWav(buffer)
                    console.log("my wav format audio is " ,wav);
                  })*/
                  var file = fs.createWriteStream("sss.m4a");
                  var request = https.get("audiouri", function(response) {
                    console.log("response is  ",response);
                    response.pipe(file);
                 // })
                    file.on('finish', function() {
                      console.log();
                      console.log("file downloadsed");
                     // file.close(cb);  // close() is async, call cb after close completes.
                    });
                }).on('error', function(err) { // Handle errors
                    fs.unlink(dest); // Delete the file async. (But we don't check the result)
                   // if (cb) cb(err.message);
                    console.log("Error is", err);
                });
                } else {
    
                //    No attachments were sent
                    var reply = new builder.Message(session)
                        .text('Hi there! This sample is intented to show how can I receive attachments but no attachment was sent to me. Please try again sending a new message with an attachment.');
                    session.send(reply);
                }
   //  builder.Prompts.text(session, "Please send any attachment");

     // console.log("url is ",msg.attachments[0].contentUrl+"/"+msg.attachments[0].name);
     // audiouri = msg.attachments[0].contentUrl+"/"+msg.attachments[0].name;
     // console.log("audiouri is",audiouri);
     //audio1.m4a  audiomp.mp3
   //  let resp = fs.readFileSync('audio1.m4a');
  /* const linear16 = require('linear16');

    linear16('audio1.m4a', 'audio1.wav')
   .then(outPath => console.log(outPath)); */
     /*
     let wav = toWav(resp);
     console.log("my wav format audio is " ,wav);*/

   /*  console.log("Resp content is ",resp);
     context.decodeAudioData(resp, buffer => {
       console.log("Audio Buffer is  ",buffer);
       let wav = toWav(buffer);
       console.log("my wav format audio is " ,wav);
       // do something with the WAV ArrayBuffer ...
     });*/

   /*  let audioStream = fs.createReadStream("audiowav.wav"); // create audio stream from any source

     // Bing Speech Key (https://www.microsoft.com/cognitive-services/en-us/subscriptions)
     let subscriptionKey = 'c9a70ce52aae4bb592fcb80099cd2b8b';
     
     let client = new BingSpeechClient(subscriptionKey);
   //  client.recognizeStream(audioStream).then(response => console.log(response.results[0].name));
    client.recognizeStream(audioStream).then(function(response)
    {
      console.log("response is ",response);
      console.log("-------------------------------------------------");
      console.log("response is ",response.results[0]);
    }).catch(function(error)
    {
      console.log("error occured is ",error);
    });*/
  
     // var attachmentData = await HttpClient.GetByteArrayAsync(audiouri);
   // await httpClient.GetByteArrayAsync(audiouri);
    //console.log("attacheddata from url ",attachmentData);
    /*  xhr1({
        uri: audiouri,
        responseType: 'arraybuffer'
      }, function (err, body, resp) {
        if (err) throw err
        // decode the MP3 into an AudioBuffer
        audioContext.decodeAudioData(resp, function (buffer) {
          // encode AudioBuffer to WAV
          var wav = toWav(buffer)
          console.log("my audio is " ,wav);
          // do something with the WAV ArrayBuffer ...
        })
      })*/
    /*  var options3 = {
     //   method: 'post',
        headers: {
         // 'Authorization':'EndpointKey 316818ad-d8b1-4918-82b8-f0d7b02b91af',
          //'Content-Type':'application/json',
          //'Ocp-Apim-Subscription-Key': '2437ab2f3fc04c65a3a2322e3463fca8',
        //  Accept: new ArrayBuffer()
        responseType: 'arraybuffer'
        },
     //   body: JSON.stringify(documents),
        // body: documents,
        url: audiouri,
        
      }
      //let promiseTOTextAnalytics = 
      return new Promise(function (resolve, reject) {
        request(options3, function (err, body,result) {
          if (err) {
            console.log("error is ", err);
            // res.json({ message: 'Error occurred in Reading a file'+ err });
          }
          else {
            context.decodeAudioData(body, function (buffer) {
              // encode AudioBuffer to WAV
              console.log("my audio is " ,buffer);
              var wav = toWav(buffer)
              console.log("my audio is " ,wav);
              // do something with the WAV ArrayBuffer ...
            });
          }
    
        });
      });*/

        // Message with attachment, proceed to download it.
        // Skype & MS Teams attachment URLs are secured by a JwtToken, so we need to pass the token from our bot.
      /*  var attachment = msg.attachments[0];
        var fileDownload = checkRequiresToken(msg)
            ? requestWithToken(attachment.contentUrl)
            : request(attachment.contentUrl);

        fileDownload.then(
            function (response) {

                // Send reply with attachment type & size
                var reply = new builder.Message(session)
                    .text('Attachment of %s type and size of %s bytes received.', attachment.contentType, response.length);
                session.send(reply);

            }).catch(function (err) {
                console.log('Error downloading attachment:', { statusCode: err.statusCode, message: err.response.statusMessage });
            });*/
           },

).set('storage', inMemoryStorage); // Register in memory storage

var requestWithToken = function (url) {
    return obtainToken().then(function (token) {
        return request({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/octet-stream'
            }
        });
    });
};

// Promise for obtaining JWT Token (requested once)
var obtainToken = new Promise(function(resolve) {
  connector.getAccessToken.bind(connector)
});

var checkRequiresToken = function (message) {
    return message.source === 'skype' || message.source === 'msteams';
};

bot.dialog('feedback', [
  function (session,args) {
  //  console.log("color is "+args.candidateanswer);
  //  builder.Prompts.choice(session, "Shall we proceed to Next Question", choice,{listStyle: 3});
  builder.Prompts.choice(session, "We are interested to get your feedback about the interview. Are you interested in giving feedback?", feedbackchoice,{listStyle: 3});
  },
  function (session, results) {
      //session.endDialogWithResult(results);
      let feedbackres = results.response.entity.toUpperCase();
      if(feedbackres === "NO")
      {
        results.feedbackres = feedbackres;
        session.endDialogWithResult(results);
       //session.endDialog();
      }
      else{
        builder.Prompts.text(session, 'Please share your feedback here');
      }
  },
  function (session , results) {
    feedbackres = results.response;
    results.feedbackres = feedbackres;
   // session.beginDialog('finish',{candidateanswer:candidateanswer});
   session.endDialogWithResult(results);
  }

]);

bot.dialog('finish', [
  function (session,args) {
  //  console.log("color is "+args.candidateanswer);
  //  builder.Prompts.choice(session, "Shall we proceed to Next Question", choice,{listStyle: 3});
  builder.Prompts.choice(session, "Do you want to continue your answer for this question?", finalchoice,{listStyle: 3});
  },
  function (session, results) {
      //session.endDialogWithResult(results);
      if(results.response.entity.toUpperCase() === "FINISH")
      {
        results.candidateanswer = candidateanswer;
        session.endDialogWithResult(results);
       //session.endDialog();
      }
      else{
        builder.Prompts.text(session, 'Please Continue your answer');
      }
  },
  function (session , results) {
    
    candidateanswer += results.response;
    console.log("candidateanswer is ",candidateanswer);
    session.beginDialog('finish',{candidateanswer:candidateanswer});
  }
]);

bot.dialog('confirm', [
  function (session,args) {
  //  console.log("color is "+args.candidateanswer);
  //  builder.Prompts.choice(session, "Shall we proceed to Next Question", choice,{listStyle: 3});
  builder.Prompts.choice(session, "Do you want to continue your answer for this question?", choice,{listStyle: 3});
  },
  function (session, results) {
      //session.endDialogWithResult(results);
      if(results.response.entity.toUpperCase() === "NEXT")
      {
        results.candidateanswer = candidateanswer;
        session.endDialogWithResult(results);
       //session.endDialog();
      }
      else{
        builder.Prompts.text(session, 'Please Continue your answer');
      }
  },
  function (session , results) {
    
    candidateanswer += results.response;
    console.log("candidateanswer is ",candidateanswer);
    session.beginDialog('confirm',{candidateanswer:candidateanswer});
  }
]);

bot.dialog('/print', function (session) {
//session.send("printed");
  //session.send("The candidate score is "+score);
  var sendgridCredentials = [];
  var next=0;
  let answer="";
  var htmlstart="<!DOCTYPE html> <html><head><style> body { border:2px solid grey; padding:10px; }"
  + ".head{ text-align:center; margin:0 0 20px 0;}</style></head><body>";
  var htmlend  = "</body></html>";
  let qno =1;
  for (var key in qna) {
    answer += "<b>"+qno+". Question:</b> "+key+"<br> <b>Answer:</b> "+qna[key]+"<br><br>";
    qno++;
    // console.log(qna[key]);
    }
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
  //  let response = htmlstart+" The Candidate got <b>"+score+" </b> in the interview <br>"+ answer + htmlend;
  let response ="<p style='color:red'>"+"Candidate "+ candidatename +" got <b>"+score+" </b> in the interview <br>"+ answer +"</p>";
  let response1 = htmlstart+"<h2 class='head'>Interview Report</h2><h4>Candidate Name: "+candidatename+"</h4><h4>Candidate Score: "+score +"</h4>"+ answer +"<br><br><p><b>Feedback: </b>"+feedbackresponse +"</p><br><br>" + htmlend;
  let response2 =  juice(response1);
  console.log(" response2 = ",response2);
    sendgrid.send({
      to: 'mprasanth113@gmail.com',
      from: 'mprasanth113@gmail.com',
      subject: 'Interview Report',
      html: response2,
    }, function (err) {
      if (err) {
        console.log("Mail error",err);
      } else {
        console.log("Success Mail sended From Azure ");
        session.send("We appreciate your interest and patience in going through the entire interview process. We will keep you posted earliest more on the details about the other rounds of interview.");
        session.endDialog("For any queries reach out our HR @ sirius.indiahr@siriuscom.com");
        //session.send("Your Interview Report is send to our HR");
        answer="";
      }
    });
  });

});

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
        resolve(answer);
      }

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
      'Ocp-Apim-Subscription-Key': '5675f88386734d2a9779bb5eaf48ffea',
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
        resolve(keyphrasesarray);
      }
    });
  });

}

