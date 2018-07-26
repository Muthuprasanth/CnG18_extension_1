var app = require('../app');
var debug = require('debug')('bot-framework-and-express-1:server');
var builder = require('botbuilder');
var restify = require('restify');
var Promise = require('bluebird');
var request = require('request-promise').defaults({ encoding: null });
var toWav = require('audiobuffer-to-wav')
var audiobuffer = require('audio-buffer')
const fs = require('fs');
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

// Listen for messages
server.post('/api/messages', connector.listen());

// Bot Storage: Here we register the state storage for your bot. 
// Default store: volatile in-memory store - Only for prototyping!
// We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
// For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
var inMemoryStorage = new builder.MemoryBotStorage();


var bot = new builder.UniversalBot(connector, function (session) {

    var msg = session.message;
    if (msg.attachments.length) {

        // Message with attachment, proceed to download it.
        // Skype & MS Teams attachment URLs are secured by a JwtToken, so we need to pass the token from our bot.
        var attachment = msg.attachments[0];
        console.log("attachment contentUrl  ",attachment.contentUrl);
        var fileDownload = checkRequiresToken(msg)
            ? requestWithToken(attachment.contentUrl)
            : request(attachment.contentUrl);

        fileDownload.then(
            function (response) {

                // Send reply with attachment type & size
                console.log("Response is  ",response);
                var reply = new builder.Message(session)
                    .text('Attachment of %s type and size of %s bytes received.', attachment.contentType, response.length);
                session.send(reply);
                
                var wav = audiobuffer(response);

                 // var wav = toWav(response)
               console.log("my wav format audio is " ,wav);
               var chunk = new Uint8Array(wav);
               console.log(chunk); 
                fs.appendFile('bb.wav', new Buffer(response), function (err) {
                  console.log("Error in append file is",chunk);
                });
              // var file = fs.createWriteStream("sss.m4a");
              // response.pipe(file)
             /*  file.on('finish', function() {
                console.log();
                console.log("file downloadsed");
               // file.close(cb);  // close() is async, call cb after close completes.
              });*/


            }).catch(function (err) {
              console.log("Error thing is  ",err);
                //console.log('Error downloading attachment:', { statusCode: err.statusCode, message: err.response.statusMessage });
            });

    } else {

        // No attachments were sent
        var reply = new builder.Message(session)
            .text('Hi there! This sample is intented to show how can I receive attachments but no attachment was sent to me. Please try again sending a new message with an attachment.');
        session.send(reply);
    }

}).set('storage', inMemoryStorage); // Register in memory storage

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

// Promise for obtaining JWT Token (requested once)
var obtainToken = Promise.promisify(connector.getAccessToken.bind(connector));

var checkRequiresToken = function (message) {
    return message.source === 'skype' || message.source === 'msteams';
};