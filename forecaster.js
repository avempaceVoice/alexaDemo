'use strict';

let request = require('request');

const VERSION = '1.0';


module.exports = function(req, res) {

    console.log('New request for the forecaster:\n', req.body);

    if (req.body.request.type === 'LaunchRequest') {
        console.log('process started')

    } else if (req.body.request.type === 'SessionEndedRequest') {

       if (req.body.request.reason === 'ERROR') {
           console.error('Alexa ended the session due to an error');
       }
       /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        Per Alexa docs, we shouldn't send ANY response here... weird, I know.
        * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    } else if (req.body.request.type === 'IntentRequest' &&
               req.body.request.intent.name === 'avempace') {
        res.json(
            buildResponse(
                { dateRequested: true },
                '<speak>We are at home , No i was kidding we are at work',
                {},
                false
            )
        );
      

    } else {
        console.error('Intent not implemented: ', req.body);
        res.status(504).json({ message: 'Intent Not Implemented' });
    }






};


function buildResponse(session, speech, card, end) {
    return {
        version: VERSION,
        sessionAttributes: session,
        response: {
            outputSpeech: {
                type: 'SSML',
                ssml: speech
            },
            card: card,
            shouldEndSession: !!end
        }
    };
}
