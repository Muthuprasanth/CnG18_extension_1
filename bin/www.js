// this contains the updated waterfall for asking question bot asking question in a single recursive dialog
// this also supports multiple languages(Spanish, German) using translator text api
var app = require('../app');
var debug = require('debug')('bot-framework-and-express-1:server');

var fs = require('fs');

var restify = require('restify');
var builder = require('botbuilder');
var Sendgrid = require("sendgrid-web");

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var DelimiterStream = require('delimiter-stream');
var StringDecoder = require('string_decoder').StringDecoder;

var request = require('request');
var juice = require('juice');
var parseString = require('xml2js').parseString;

var decoder = new StringDecoder('utf8');

var Promise = require('bluebird');
var request = require('request-promise').defaults({ encoding: null });
var toWav = require('audiobuffer-to-wav')
var audiobuffer = require('audio-buffer')
const AudioContext = require('web-audio-api').AudioContext;
const audioContext = new AudioContext;
const { BingSpeechClient, VoiceRecognitionResponse } = require('bingspeech-api-client');

var querystring = require('querystring');
var java = [];
var jk=0,ans=0;
var answers =[];
var plagiarismuri = [];
var candidateanswer = "",candidatename = "";
console.log("updated");
var linestream = new DelimiterStream(); 
var input = fs.createReadStream('somefile.txt');
linestream.on('data', function(chunk) {
  //console.log(decoder.write(chunk));
  java[jk]=decoder.write(chunk);
  jk++;
});
input.pipe(linestream);
console.log("hiihihihd",java);

var answerlinestream = new DelimiterStream(); 
var answerinput = fs.createReadStream('answer.txt');
answerlinestream.on('data', function(chunk) {
  //console.log(decoder.write(chunk));
  answers[ans]=decoder.write(chunk);
  ans++;
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
var lang = ["English","Spanish","German"];
var userlang = "";
var langexpansion = [];
langexpansion["English"] = "en";
langexpansion["Spanish"] = "es";
langexpansion["German"] = "de";
let globallang = "en";
let tolang = "";
let token ="";
let usertext = "";
let convertedtext = ""
//getRandomInt();
function issueToken()
{
  console.log("inside issue token ");
  var options3 = {
    method: 'post',
    headers: {
      //'Authorization':'EndpointKey 316818ad-d8b1-4918-82b8-f0d7b02b91af',
      'Content-Type':'application/json',
      'Ocp-Apim-Subscription-Key': 'aec47c1b9b24436792b151c743bd4b10',
    },

    url: ' https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
  }
  //let promiseTOTextAnalytics = 
  return new Promise(function (resolve, reject) {
    request(options3, function (err, result, body) {
      if (err) {
        console.log("error is ", err);
      }
      else {
        resolve(body);
      }
    });
  });
}

function convertToLang(token,text,lang)
{
  let uri = "https://api.microsofttranslator.com/v2/http.svc/Translate?text="+text+"&to="+lang;
  console.log("inside convertToLang");
  var options3 = {
    method: 'get',
    headers: {
      'Authorization':'Bearer '+token,
      'Content-Type':'application/json',
    },

    url: uri,
  }
  return new Promise(function (resolve, reject) {
    request(options3, function (err, result, body) {
      if (err) {
        console.log("error is ", err);
      }
      else {
        console.log("body content is",body);
        var xml = "<root>Hello xml2js!</root>"
        parseString(body, function (err, result) {
         // console.log("after parsing",result.string._);
          resolve(result.string._);
        });
      }
    });
  });
}

console.log("------Bot is going to respond you-----");
var inMemoryStorage = new builder.MemoryBotStorage();

server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector, [
  async  function (session) {
      let candidateresponsekeyphrases,qnakeyphrases,qnaresponse;
    //  getRandomInt();
        session.sendTyping();    
        session.send("Hi");
        builder.Prompts.choice(session, "Please choose your preferred language for Interview", lang,{listStyle: 3});
       // candidatename = session.message.address.user.name; 
       //----   builder.Prompts.text(session, java[0]);
      //      session.beginDialog('questions',{ questionno: 0,score:0});
  },
  async function (session, results) {
    candidatename = session.message.address.user.name; 
    userlang = results.response.entity;
    if(userlang.toUpperCase() != "ENGLISH")
    {
      console.log("Not english");
     // session.endDialog("Thank you");
     text = "Welcome "+candidatename;
     console.log("candidate welcome text ",text,userlang,langexpansion[userlang]);

     tolang = langexpansion[userlang];
     token = await issueToken();
     convertedtext  = await convertToLang(token,text,tolang);
     session.send(convertedtext);
     text = "Thanks for showing interest in Sirius computer solution. I am Mr.Nick the hiring bot to take over technical discussion";
     convertedtext  = await convertToLang(token,text,tolang);
     session.send(convertedtext);
    // session.beginDialog('voiceortext');
     session.beginDialog('lang_questions',{ questionno: 0,score:0});   
    //console.log("Not english --------------------------");
    }
    else{
      tolang = langexpansion[userlang];
      session.send("Welcome "+candidatename);
      session.send("Thanks for showing interest in Sirius computer solution. I am Mr.Nick the hiring bot to take over technical discussion");     
      //session.beginDialog('questions',{ questionno: 0,score:0});
      session.beginDialog('voiceortext');
    }

  },
 function (session, results) {
    //session.beginDialog("/print");
    if( results.feedbackres  === "NO")
    {
      feedbackresponse = "The candidate is not interested in giving feedback";
      console.log("feedback ",feedbackresponse);
    }
    else{
      feedbackresponse = results.feedbackres;
      console.log("feedback ",feedbackresponse);
    }
  //  session.send("Thank you");
    session.beginDialog("/print");
  }
]).set('storage', inMemoryStorage); ;

bot.dialog('voiceortext',[ 
  function (session, args) {
    let voice_or_text = ["Voice","Text"];
    builder.Prompts.choice(session, "Do you want Speech or Text for the discussion?", voice_or_text,{listStyle: 3});
  },
  function (session, results) {
    let feedbackres = results.response.entity.toUpperCase();
    if(feedbackres != "VOICE")
    {
      session.send("You can send only Text  messages");
      session.beginDialog('questions',{ questionno: 0,score:0}); 
    }
    else{
      session.send("You can send only Voice messages");
      session.beginDialog('voice_questions',{ questionno: 0,score:0}); 
    }
  },
]);

bot.dialog('voice_questions',[ 
   function (session, args) {
   console.log("---------------  Enter into voice_questions --------------- ");
    session.dialogData.questionno = args.questionno;
    console.log("questionno ",session.dialogData.questionno );
    session.dialogData.score = args.score;
    console.log("score ",  session.dialogData.score);
    builder.Prompts.attachment(session, java[args.questionno]);
  },
  async function (session) {
    candidateanswer = "";
    var msg = session.message;
   // console.log("msg ", msg);     
   
    candidateanswer = await voicetotext(msg);
    session.sendTyping();
   // candidateanswer += results.response;
    console.log("candidateanswer is ",candidateanswer);
    console.log("question number ------------------------------ ",session.dialogData.questionno);

   // console.log("question number ",session.dialogData.questionno);
    qna[java[session.dialogData.questionno]] = candidateanswer;

    let bodyparse = await checkPlagiarism(candidateanswer);
    let querycount = bodyparse.totalQueries;
    console.log("count ",querycount);
    let url = "";
    for(let q=0; q<querycount; q++){
       console.log("Total matches found ",bodyparse.details[q].totalMatches);
       if(bodyparse.details[q].totalMatches > 0 || bodyparse.details[q].totalMatches === "10+")
       {
         url = bodyparse.details[q].matched_urls[0];
         console.log("  ++++++++++++++++++++++++  Matching URL is ",bodyparse.details[q].matched_urls[0]);
         break;
       }
       else{
         console.log("++++++++++++++++++++++++ No plagiarism detected ");
       }

    }
    console.log("First matching url is ", url);
    plagiarismuri[session.dialogData.questionno] = url;

    candidateresponsekeyphrases = await textanalyics(candidateanswer);
    console.log("candidateresponsekeyphrases",candidateresponsekeyphrases);
    //console.log("answer phrase is ",answers[session.dialogData.questionno]);
    qnakeyphrases = await textanalyics(answers[session.dialogData.questionno]);
    console.log("qnakeyphrases",qnakeyphrases);
    let subtotal =  comparepheases(candidateresponsekeyphrases,qnakeyphrases);
    score = session.dialogData.score + subtotal;
    console.log("CURRENT SCORE ",subtotal);
    console.log("TOTAL SCORE ",score);
    if(session.dialogData.questionno < 4)
    {
      session.beginDialog('voice_questions',{ questionno: session.dialogData.questionno+1 ,score:score});
    }
    else{
      session.beginDialog("feedback");
    }
  },
]);
  
function voicetotext(msg)
{
  return new Promise(function (resolve, reject) {
    if (msg.attachments.length) {
        var attachment = msg.attachments[0];
      //  console.log("attachment contentUrl  ",attachment.contentUrl,attachment.name);
        var fileDownload = checkRequiresToken(msg)
            ? requestWithToken(attachment.contentUrl)
            : request(attachment.contentUrl);

        fileDownload.then(function (text) {
            // Send reply with attachment type & size
         console.log("Response is  ",text);
         resolve(text);
        }).catch(function (err) {
            console.log("Error thing is  ",err);
            reject(error);
        });
    } else {
      console.log("--------------- DONT SEND TEXT MESSAGES--------------- ");
    }
  });
}

var requestWithToken = function (url) {
  return obtainToken().then(function (token) {

        /*return request({
          url: url,
          headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/octet-stream'
          }
      });*/
  //  console.log("Connector token is ",token);
    let uri = "https://speechtotext-service-1.azurewebsites.net/speechtotext?url="+url+"&token="+token ;
    var options3 = {
      headers: {
        'Accept':'application/json'
        },
      method: 'get',
      url: uri,
    }
    return new Promise(function (resolve, reject) {
      request(options3, function (err, result, body) {
        if (err) {
          console.log("error is ", err);
          resolve(err)
        }
        else {
          let str = body.toString();
          console.log("text format",str);
          resolve(str);
        }
      });
    });
  });
};

var obtainToken = Promise.promisify(connector.getAccessToken.bind(connector));

var checkRequiresToken = function (message) {
  return message.source === 'skype' || message.source === 'msteams';
};

function checkPlagiarism(sentence)
{
  console.log("inside checkPlagiarism   sententce is ",sentence);
  let bodydata = {
    "key":"cb26de274c5feee55f16d6dfd65f8951",
    "data":sentence,
  }
  var formData = querystring.stringify(bodydata);
  var contentLength = formData.length;
  console.log("length ",contentLength, bodydata.length);
  var options3 = {
    method: 'post',
    headers: {
       'Content-Length': contentLength,
        'Content-Type':'application/x-www-form-urlencoded',
    },
    body: formData,
    url: 'https://www.check-plagiarism.com/apis/checkPlag',
  }

  return new Promise(function (resolve, reject) {
    request(options3, function (err, result, body) {
      if(err) console.log("Error is ", err);
      console.log("Response is  ",body);
      let bodyparse = JSON.parse(body);
      console.log("Response after parsing is  ",bodyparse);
      resolve(bodyparse);
     // console.log("Response after parsing is  ",bodyparse.details[0].totalMatches, bodyparse.details[0].matched_urls );
     // console.log("Response after parsing is  ",bodyparse.details[1].totalMatches, bodyparse.details[1].matched_urls );
   //   console.log("Response after parsing is  ",bodyparse.details[1].totalMatches ,bodyparse.details[1].matched_urls[0]);
    });
  });
}

bot.dialog('questions',[ 
  function (session, args) {
  // questionno
   session.dialogData.questionno = args.questionno;
   session.dialogData.score = args.score;
   builder.Prompts.text(session, java[args.questionno]);
 },
 function (session , results) {
   candidateanswer = "";
   candidateanswer += results.response;
   console.log("candidateanswer is ",candidateanswer);
   console.log("question number ------------------------------ ",session.dialogData.questionno);
   if(session.dialogData.questionno == 4)
   {
     session.beginDialog('finish');
   }
   else{
     session.beginDialog('confirm');
   }
 },
 async function (session, results) {
  // console.log("question number ",session.dialogData.questionno);
   qna[java[session.dialogData.questionno]] = results.candidateanswer;
   session.sendTyping();
   let bodyparse = await checkPlagiarism(results.candidateanswer);
   let querycount = bodyparse.totalQueries;
   console.log("count ",querycount);
   let url = "";
   for(let q=0; q<querycount; q++)
   {
    console.log("Total matches found ",bodyparse.details[q].totalMatches);
    if(bodyparse.details[q].totalMatches > 0 || bodyparse.details[q].totalMatches === "10+")
    {
      url = bodyparse.details[q].matched_urls[0];
      console.log("  ++++++++++++++++++++++++  Matching URL is ",bodyparse.details[q].matched_urls[0]);
      break;
    }
    else{
      console.log("++++++++++++++++++++++++ No plagiarism detected ");
    }

   }
   console.log("First matching url is ", url);
   plagiarismuri[session.dialogData.questionno] = url;
   //plagiarismuri
   candidateresponsekeyphrases = await textanalyics(results.candidateanswer);
   console.log("candidateresponsekeyphrases",candidateresponsekeyphrases);
   //console.log("answer phrase is ",answers[session.dialogData.questionno]);
   qnakeyphrases = await textanalyics(answers[session.dialogData.questionno]);
   console.log("qnakeyphrases",qnakeyphrases);
   let subtotal =  comparepheases(candidateresponsekeyphrases,qnakeyphrases);
   score = session.dialogData.score + subtotal;
   console.log("CURRENT SCORE ",subtotal);
   console.log("TOTAL SCORE ",score);
   if(session.dialogData.questionno < 4)
   {
     session.beginDialog('questions',{ questionno: session.dialogData.questionno+1 ,score:score});
   }
   else{
     session.beginDialog("feedback");
   }
 },
]);

bot.dialog('feedback', [
  function (session,args) {
  builder.Prompts.choice(session, "We are interested to get your feedback about the interview. Are you interested in giving feedback?", feedbackchoice,{listStyle: 3});
  },
  function (session, results) {
      let feedbackres = results.response.entity.toUpperCase();
      if(feedbackres === "NO")
      {
        results.feedbackres = feedbackres;
        session.endDialogWithResult(results);
      }
      else{
        builder.Prompts.text(session, 'Please share your feedback here');
      }
  },
  function (session , results) {
    
    feedbackres = results.response;
    //console.log("candidateanswer is ",candidateanswer);
    results.feedbackres = feedbackres;
   // session.beginDialog('finish',{candidateanswer:candidateanswer});
   session.endDialogWithResult(results);
  }
]);

bot.dialog('finish', [
  function (session,args) {
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

bot.dialog('lang_questions',[ 
  async function (session, args) {
    // questionno
     session.dialogData.questionno = args.questionno;
     session.dialogData.score = args.score;
     convertedtext  = await convertToLang(token,java[args.questionno],tolang);
     builder.Prompts.text(session, convertedtext);
   },
   async function (session , results) {
     candidateanswer = "";
     candidateanswer += results.response;
     console.log("candidateanswer is ",candidateanswer);
     console.log("question number ------------------------------ ",session.dialogData.questionno);
     if(session.dialogData.questionno == 4)
     {
       session.beginDialog('lang_finish');
     }
     else{
       session.beginDialog('lang_confirm');
     }
 
    // session.beginDialog('finish',{candidateanswer:candidateanswer});
   },
   async function (session, results) {
    // console.log("question number ",session.dialogData.questionno);
    // qna[java[session.dialogData.questionno]] = results.candidateanswer;
     session.sendTyping();
     usertext = results.candidateanswer;
     console.log("usertext  ",usertext);
     //token = await issueToken();
     convertedtext = await convertToLang(token,usertext,globallang);
     console.log("convertedtext  ",convertedtext);
     qna[java[session.dialogData.questionno]] = convertedtext;
     let bodyparse = await checkPlagiarism(convertedtext);
     let querycount = bodyparse.totalQueries;
     console.log("count ",querycount);
     let url = "";
     for(let q=0; q<querycount; q++){
        console.log("Total matches found ",bodyparse.details[q].totalMatches);
        if(bodyparse.details[q].totalMatches > 0 || bodyparse.details[q].totalMatches === "10+")
        {
          url = bodyparse.details[q].matched_urls[0];
          console.log("  ++++++++++++++++++++++++  Matching URL is ",bodyparse.details[q].matched_urls[0]);
          break;
        }
        else{
          console.log("++++++++++++++++++++++++ No plagiarism detected ");
        }

     }
     console.log("First matching url is ", url);
     plagiarismuri[session.dialogData.questionno] = url;

     candidateresponsekeyphrases = await textanalyics(convertedtext);
     console.log("candidateresponsekeyphrases",candidateresponsekeyphrases);
     //console.log("answer phrase is ",answers[session.dialogData.questionno]);
     qnakeyphrases = await textanalyics(answers[session.dialogData.questionno]);
     console.log("qnakeyphrases",qnakeyphrases);
     let subtotal =  comparepheases(candidateresponsekeyphrases,qnakeyphrases);
     score = session.dialogData.score + subtotal;
     console.log("CURRENT SCORE ",subtotal);
     console.log("TOTAL SCORE ",score);
     if(session.dialogData.questionno < 4)
     {
       session.beginDialog('lang_questions',{ questionno: session.dialogData.questionno+1 ,score:score});
     }
     else{
       session.beginDialog("lang_feedback");
     }
   },
]);
bot.dialog('lang_confirm', [
  async function (session,args) {
  text = "Do you want to continue your answer for this question?";
  convertedtext  = await convertToLang(token,text,tolang);
  builder.Prompts.choice(session, convertedtext, choice,{listStyle: 3});
  },
  async function (session, results) {
      //session.endDialogWithResult(results);
      if(results.response.entity.toUpperCase() === "NEXT")
      {
        results.candidateanswer = candidateanswer;
        session.endDialogWithResult(results);
       //session.endDialog();
      }
      else{
        text = "Please Continue your answer";
        convertedtext  = await convertToLang(token,text,tolang);
        builder.Prompts.text(session, convertedtext);
      }
  },
  function (session , results) {
    
    candidateanswer += results.response;
    console.log("candidateanswer is ",candidateanswer);
    session.beginDialog('lang_confirm',{candidateanswer:candidateanswer});
  }

]);

bot.dialog('lang_finish', [
  async function (session,args) {
  text = "Do you want to continue your answer for this question?";
  convertedtext  = await convertToLang(token,text,tolang);
  builder.Prompts.choice(session, convertedtext, finalchoice,{listStyle: 3});
  },
  async function (session, results) {
      //session.endDialogWithResult(results);
      if(results.response.entity.toUpperCase() === "FINISH")
      {
        results.candidateanswer = candidateanswer;
        session.endDialogWithResult(results);
       //session.endDialog();
      }
      else{
        text = "Please Continue your answer";
        convertedtext  = await convertToLang(token,text,tolang);
        builder.Prompts.text(session, convertedtext);
      }
  },
  function (session , results) {
    
    candidateanswer += results.response;
    console.log("candidateanswer is ",candidateanswer);
    session.beginDialog('lang_finish',{candidateanswer:candidateanswer});
  }

]);

bot.dialog('lang_feedback', [
  async  function (session,args) {
  text = "We are interested to get your feedback about the interview. Are you interested in giving feedback?";
  convertedtext  = await convertToLang(token,text,tolang);
  builder.Prompts.choice(session, convertedtext, feedbackchoice,{listStyle: 3});
  },
  async function (session, results) {
      let feedbackres = results.response.entity.toUpperCase();
      if(feedbackres === "NO")
      {
        results.feedbackres = feedbackres;
        session.endDialogWithResult(results);
       //session.endDialog();
      }
      else{
        text = "Please share your feedback here";
        convertedtext  = await convertToLang(token,text,tolang);
        builder.Prompts.text(session, convertedtext);
      }
  },
  async function (session , results) {
    feedbackres = results.response;
    convertedtext  = await convertToLang(token,feedbackres,globallang);
    //console.log("candidateanswer is ",candidateanswer);
    results.feedbackres = convertedtext;
   // session.beginDialog('finish',{candidateanswer:candidateanswer});
   session.endDialogWithResult(results);
  }

]);


bot.dialog('/print', function (session) {
//session.send("printed");
  //session.send("The candidate score is "+score);
  console.log("plagiarism array is ", plagiarismuri);
  var sendgridCredentials = [];
  var next=0;
  let answer="";
  var htmlstart="<!DOCTYPE html> <html><head><style> body { border:2px solid grey; padding:10px; }"
  + ".head{ text-align:center; margin:0 0 20px 0;} .dec{text-decoration:none;} </style></head><body>";
  var htmlend  = "</body></html>";
  let qno =1;
  for (var key in qna) {
    //answer += "<b>"+qno+". Question:</b> "+key+"<br> <b>Answer:</b> "+qna[key]+"<br><br>";
    answer += "<b>"+qno+". Question:</b> "+key+"<br> <b>Answer:</b> "+qna[key];
    if(plagiarismuri[qno-1] === "" || plagiarismuri[qno-1].length == 0) {
      answer += "<br><br>";
    }
    else{
      answer += "<br><b>Plagiarism Detected:</b> <a href = "+plagiarismuri[qno-1]+ " class = 'dec' "+">Click Here</a><br><br>";
    }
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
    let text = "";
    let convertedtext = "";
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
    }, async function (err) {
      if (err) {
        console.log("Mail error",err);
      } else {
        console.log("Success Mail sended From Azure ");
        if(tolang === "en")
        {
          session.send("Thank you");
          session.send("We appreciate your interest and patience in going through the entire interview process. We will keep you posted earliest more on the details about the other rounds of interview.");
          session.endDialog("For any queries reach out our HR @ sirius.indiahr@siriuscom.com");
        }
        else{
          let token  = await issueToken();
          text = "Thank you";
          convertedtext  = await convertToLang(token,text,tolang);
          session.send(convertedtext);
          text = "We appreciate your interest and patience in going through the entire interview process. We will keep you posted earliest more on the details about the other rounds of interview.";
          convertedtext  = await convertToLang(token,text,tolang);
          session.send(convertedtext);
          text = "For any queries reach out our HR @ sirius.indiahr@siriuscom.com";
          convertedtext  = await convertToLang(token,text,tolang);
          session.endDialog(convertedtext);
        }

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
    },
    body: JSON.stringify(documents),
    url: 'https://hiring-bot-2.azurewebsites.net/qnamaker/knowledgebases/50bc5e2a-da5b-4401-bc75-a73f9dd7e4e2/generateAnswer',
  }
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
    //  'Ocp-Apim-Subscription-Key': 'b23f17068a734d43a9227ed368771909',
    'Ocp-Apim-Subscription-Key':  '4ae44c8b362648a9b96be72491dc1302',
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

