//first m4a is converted to wav and then it is send to bing speech and got text
var app = require('../app');
var debug = require('debug')('bot-framework-and-express-1:server');
var builder = require('botbuilder');
var restify = require('restify');
var Promise = require('bluebird');
var request = require('request-promise').defaults({ encoding: null });
var toWav = require('audiobuffer-to-wav')
var audiobuffer = require('audio-buffer')
const fs = require('fs');
const AudioContext = require('web-audio-api').AudioContext;
const audioContext = new AudioContext;
const { BingSpeechClient, VoiceRecognitionResponse } = require('bingspeech-api-client');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 4990, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: "b23753fe-a695-4f1c-a94a-86fc3a0eb8c8",
    appPassword: "xebERNFFF03;]clxnD982+|"
});


server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();


var bot = new builder.UniversalBot(connector, [
  
  function (session) {
    builder.Prompts.attachment(session, "please send anything");
  },
  function (session,response) {
    console.log("session ",session);
  //builder.Prompts.text(session, "please send anything");
  var msg = session.message;
    console.log("msg ", msg);  
    if (msg.attachments.length) {
        var attachment = msg.attachments[0];
        console.log("attachment contentUrl  ",attachment.contentUrl,attachment.name);
        var fileDownload = checkRequiresToken(msg)
            ? requestWithToken(attachment.contentUrl)
            : request(attachment.contentUrl);

        fileDownload.then(function (resp) {
            // Send reply with attachment type & size
            console.log("Response is  ",resp);
            var reply = new builder.Message(session)
                .text('Attachment of %s type and size of %s bytes received.', attachment.contentType, resp.length);
            session.send(reply);
            audioContext.decodeAudioData(resp, buffer => {
                let wav = toWav(buffer); 
                var chunk = new Uint8Array(wav);
                console.log(chunk); 
                fs.appendFile('wavoutput.wav', new Buffer(chunk), function (err) {
                    let audioStream = fs.createReadStream("wavoutput.wav"); // create audio stream from any source
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
                    });
                });             
            });

        }).catch(function (err) {
            console.log("Error thing is  ",err);
        });
              // var file = fs.createWriteStream("sss.m4a");
              // response.pipe(file)
             /*  file.on('finish', function() {
                console.log();
                console.log("file downloadsed");
               // file.close(cb);  // close() is async, call cb after close completes.
              });*/
    } else {
        var reply = new builder.Message(session)
            .text('Hi there! This sample is intented to show how can I receive attachments but no attachment was sent to me. Please try again sending a new message with an attachment.');
        session.send(reply);
    }

  },
/**/
]).set('storage', inMemoryStorage); // Register in memory storage

// Request file with Authentication Header
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

var obtainToken = Promise.promisify(connector.getAccessToken.bind(connector));

var checkRequiresToken = function (message) {
    return message.source === 'skype' || message.source === 'msteams';
};