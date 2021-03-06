module.change_code = 1;
'use strict';
/**
 * 
 * Copyright (c) 2017, Avempace Wireless (Daghfous Wejd). All rights reserved.
 * 
 */
var alexa = require('alexa-app');
var app = new alexa.app('Alexa_training_AV');
var req = require('request-promise')

var http = require('bluebird').promisifyAll(require('request'), { multiArgs: true });
var serverUrl = 'https://voiceconnect.ovh/ask'

var http = require('bluebird').promisifyAll(require('request'), { multiArgs: true });

/**
 * testing purpose
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback 
 */
var getlistspeakerperuser = function(req, res, callback) {
    return http.getAsync({ url: serverUrl + '/speakers', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {
        callback(listspeakerConnected)
    })

}

/**
 * this function is called when you ask alexa to start
 */
app.launch(function(request, response) {

    response.say('Welcome to allplay. With this skill ,you can voice control any eligible allplay device with your AMAZON echo,  echo dot or echo show . Account linking is required . For instructions, please refer to your alexa app')
});


/**
 * function that execute every time before any other function 
 * this function verify if the user has a valid access token
 */
app.pre = function(request, response, type) {
    if (!request.sessionDetails.accessToken) {


        response.say('Hi, AllPlay skill  requires account linking with Amazon Alexa. To set up voice control for your AllPlay product, few steps are required. Use AllPlay mobile app to create your user account, then link it to your Amazon by accessing account linking section within Alexa app or web portal. Your AllPlay app is then ready to set which of your devices you want to control with voice. For detailed instructions, visit our online help area.  ')

        response.send()

    }
};

/**
 * function called when an error occure
 */
app.error = function(exception, request, response) {

    response.say('Sorry an error occured ');
};

/**
 * funciton called when the user want to search for the connected speakers
 */
app.intent('search', {
        "utterances": [
            "search speakers",
        ]

    },
    function(request, response) {
        accessToken = request.sessionDetails.accessToken;

        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/speakers', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {






            var i = 0

            var speakerListString = ''
            for (i = 0; i < listspeakerConnected.length; i++) {

                if (i == 0) {


                    speakerListString = listspeakerConnected[0].name
                }
                if (i > 0) {
                    if (i == listspeakerConnected.length - 1) {
                        speakerListString = speakerListString + ' and ' + listspeakerConnected[i].name
                    } else {
                        speakerListString = speakerListString + ',' + listspeakerConnected[i].name
                    }

                }
            }



            if (speakerListString == 0) {
                response.say('I have no allplay device detected. Please try again later !')
                response.send()

            }



            if (listspeakerConnected.length == 1) {
                var session = request.getSession()
                session.set('lastCommande', "search")
                session.set('speaker', listspeakerConnected[0].name)
                session.set('speaker_numSerie', listspeakerConnected[0].num_serie)

                if (listspeakerConnected[0].selected == true) {
                    response.say(' You have  ' + listspeakerConnected.length + ' allplay device available, ' + listspeakerConnected[0].name + ' and it is already connected')
                    response.send()
                } else {
                    response.say('You have  ' + listspeakerConnected.length + ' allplay device available, ' + speakerListString + '. Do you want to select it! ').reprompt('sorry repeat again !').shouldEndSession(false);
                    response.send()
                }


            }

            if (speakerListString.indexOf(',') !== -1 || speakerListString.indexOf(' and ') !== -1) {

                response.say('You have  ' + listspeakerConnected.length + ' allplay devices available ' + speakerListString + ' . please choose one ! ').reprompt('sorry repeat again !').shouldEndSession(false);
                response.send()

            }




        });


    }
)


/**
 * function called when the user want to search for he connected speakers
 */
app.intent('listspeaker', {
        "utterances": [
            "list devices",
        ]

    },
    function(request, response) {
        accessToken = request.sessionDetails.accessToken;

        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/speakers', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {





            var session = request.getSession()
            session.set('listspeakerConnected', listspeakerConnected)
            var i = 0

            var speakerListString = ''
            for (i = 0; i < listspeakerConnected.length; i++) {

                if (i == 0) {


                    speakerListString = listspeakerConnected[0].name
                }
                if (i > 0) {
                    if (i == listspeakerConnected.length - 1) {
                        speakerListString = speakerListString + ' and ' + listspeakerConnected[i].name
                    } else {
                        speakerListString = speakerListString + ',' + listspeakerConnected[i].name
                    }

                }
            }



            if (speakerListString == 0) {
                response.say('I have no allplay device detected. Please try again later !')
                response.send()

            }



            if (listspeakerConnected.length == 1) {
                var session = request.getSession()
                session.set('lastCommande', "search")
                session.set('speaker', listspeakerConnected[0].name)
                session.set('speaker_numSerie', listspeakerConnected[0].num_serie)

                if (listspeakerConnected[0].selected == true) {
                    response.say(' You have  ' + listspeakerConnected.length + ' allplay device available, ' + listspeakerConnected[0].name + ' and it is already connected')
                    response.send()
                } else {
                    response.say('You have  ' + listspeakerConnected.length + ' allplay device available, ' + speakerListString + '. Do you want to select it! ').reprompt('sorry repeat again !').shouldEndSession(false);
                    response.send()
                }


            }

            if (speakerListString.indexOf(',') !== -1 || speakerListString.indexOf(' and ') !== -1) {

                response.say('You have  ' + listspeakerConnected.length + ' allplay devices available ' + speakerListString + ' . please choose one ! ').reprompt('sorry repeat again !').shouldEndSession(false);
                response.send()

            }




        });
    }


);

/**
 * function called when the user want to know the current selected speaker
 */
app.intent('which', {
        "utterances": [
            "which device is connected",
        ]

    },

    function(request, response) {
        accessToken = request.sessionDetails.accessToken;

        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/speakers', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            i = 0
            listspeakerConnected.forEach(function(speaker) {
                if (speaker.selected == true) {

                    i++
                    response.say('the Device ' + speaker.name + ' is selected')
                    response.send()
                }

            })
            if (i == 0) {
                response.say('No allplay device have been selected!')
                response.send()
            }

        })



    }
)


/***
 * function called when the user ask alexa to select any speaker connected
 */
app.intent('anyone', {
        "utterances": [
            "any one",
        ]

    },
    function(request, response) {
        accessToken = request.sessionDetails.accessToken;

        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/linktoanyone', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            if (listspeakerConnected.result == 'found') {
                var session = request.getSession()
                session.set('speaker_numSerie', listspeakerConnected)
                response.say(listspeakerConnected.name + ' has been selected ')

                response.send()
            } else {
                response.say('I was unable to select ' + listspeakerConnected.name + ' . Please try again later')
                response.send()
            }

        })

    }
);


/**
 * function called when the user say yes 
 * it can search for devices or link to device
 */
app.intent('yes', {
        "utterances": [
            "play next",
        ]

    },
    function(request, response) {
        if (request.hasSession()) {
            var session = request.getSession()
            var lastCommande = session.get('lastCommande')
            var val = session.get('speaker')
            var numSerie = session.get('speaker_numSerie')
        }
        if (lastCommande == 'search') {


            return http.postAsync({ url: 'http://vps341573.ovh.net:5151', form: { key: numSerie } },
                function(error, res, body) {
                    if (!error && res.statusCode == 200) {

                        if (body == 'found') {

                            session.set('speaker_numSerie', numSerie)
                            response.say(val + ' has been selected ')
                            response.send()

                        } else {

                            response.say('I was unable to select ' + val + ' . Please try again later')
                            response.send()

                        }

                    }

                });



        }

        if (lastCommande == 'control') {
            accessToken = request.sessionDetails.accessToken;

            reqheader = 'Bearer ' + accessToken;
            return http.getAsync({ url: serverUrl + '/speakers', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {





                var session = request.getSession()
                session.set('listspeakerConnected', listspeakerConnected)
                var i = 0

                var speakerListString = ''
                for (i = 0; i < listspeakerConnected.length; i++) {

                    if (i == 0) {


                        speakerListString = listspeakerConnected[0].name
                    }
                    if (i > 0) {
                        if (i == listspeakerConnected.length - 1) {
                            speakerListString = speakerListString + ' and ' + listspeakerConnected[i].name
                        } else {
                            speakerListString = speakerListString + ',' + listspeakerConnected[i].name
                        }

                    }
                }



                if (speakerListString == 0) {
                    response.say('I have no allplay device detected. Please try again later !')
                    response.send()

                }



                if (listspeakerConnected.length == 1) {
                    var session = request.getSession()
                    session.set('lastCommande', "search")
                    session.set('speaker', listspeakerConnected[0].name)
                    session.set('speaker_numSerie', listspeakerConnected[0].num_serie)

                    if (listspeakerConnected[0].selected == true) {
                        response.say(' You have  ' + listspeakerConnected.length + ' allplay device available, ' + listspeakerConnected[0].name + ' and it is already connected')
                        response.send()
                    } else {
                        response.say('You have  ' + listspeakerConnected.length + ' allplay device available, ' + speakerListString + '. Do you want to select it! ').reprompt('sorry repeat again !').shouldEndSession(false);
                        response.send()
                    }


                }

                if (speakerListString.indexOf(',') !== -1 || speakerListString.indexOf(' and ') !== -1) {

                    response.say('You have  ' + listspeakerConnected.length + ' allplay devices available ' + speakerListString + ' . please choose one ! ').reprompt('sorry repeat again !').shouldEndSession(false);
                    response.send()

                }





            });





        }



    }
);

/**
 * function called when the user want to play the next song
 */
app.intent('next', {
        "utterances": [
            "play next",
        ]

    },
    function(request, response) {

        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/playnext', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            if (listspeakerConnected.result == 'found') {

                response.say("ok , play next!!! ");
                response.send();
            } else {
                var session = request.getSession()
                session.set('lastCommande', "control")

                response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                response.send();


            }

        })






    }
);

/**
 * function called when the user want to play the previous song
 */
app.intent('prev', {
        "utterances": [
            "play previous",
        ]

    },
    function(request, response) {


        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/playprevious', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            if (listspeakerConnected.result == 'found') {

                response.say("ok , play previous!!! ");
                response.send();
            } else {
                var session = request.getSession()
                session.set('lastCommande', "control")
                response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                response.send();
            }

        })



    }
);

/**
 * function called when the user want to play a song
 */
app.intent('play', {
        "utterances": [
            "play",
        ]

    },
    function(request, response) {

        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/playtrack', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            if (listspeakerConnected.result == 'found') {

                response.say("ok , play!!! ");
                response.send();
            } else {
                var session = request.getSession()
                session.set('lastCommande', "control")
                response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                response.send();
            }

        })


    }
);

/**
 * function called when the user want to increase the volume by the default step
 */
app.intent('incr', {
        "utterances": [
            "increase volume ",
        ]

    },
    function(request, response) {

        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/incrvolume', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            if (listspeakerConnected.result == 'found') {

                response.say("ok , increase!!! ");
                response.send();
            } else {
                var session = request.getSession()
                session.set('lastCommande', "control")
                response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                response.send();
            }

        })


    }
);

/**
 * function called when the user want to decrease the volume by the default step
 */
app.intent('decr', {
        "utterances": [
            "decrease volume ",
        ]

    },
    function(request, response) {
        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/decrevolume', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            if (listspeakerConnected.result == 'found') {

                response.say("ok , decrease!!! ");
                response.send();
            } else {
                var session = request.getSession()
                session.set('lastCommande', "control")
                response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                response.send();
            }

        })


    }
);

/**
 * function called when the user want to increase the volume by the sayed number as parameter
 */
app.intent('increase', {
        "slots": {
            "number": "AMAZON.NUMBER",

        },
        "utterances": [
            "increase volume by  {number}",
        ]

    },
    function(request, response) {
        var valueToIncrease = request.slot('number')


        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;
        if (valueToIncrease != '?') {


            return http.getAsync({ url: serverUrl + '/increasevolume', headers: { 'Authorization': reqheader }, form: { key: valueToIncrease }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

                if (listspeakerConnected.result == 'found') {

                    response.say("ok , increase by  " + valueToIncrease);
                    response.send();
                } else {
                    var session = request.getSession()
                    session.set('lastCommande', "control")
                    response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                    response.send();
                }

            })

        } else {
            response.say(" Sorry, could you repeat again !").shouldEndSession(true);;
            response.send();
        }


    }
);


/**
 * function called when the user want to decrease the volume by the sayed number as parameter
 */
app.intent('decrease', {
        "slots": {
            "number": "AMAZON.NUMBER",

        },
        "utterances": [
            "decrease volume by {number}",
        ]

    },
    function(request, response) {
        var valueToDecrease = request.slot('number')

        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;
        if (valueToDecrease != '?') {
            return http.getAsync({ url: serverUrl + '/decreasevolume', headers: { 'Authorization': reqheader }, form: { key: valueToDecrease }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

                if (listspeakerConnected.result == 'found') {

                    response.say("ok , decrease by  " + valueToDecrease);
                    response.send();
                } else {
                    var session = request.getSession()
                    session.set('lastCommande', "control")

                    response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                    response.send();
                }

            })
        } else {
            response.say(" Sorry, could you repeat again !").shouldEndSession(true);;
            response.send();
        }
    }
);

/**
 * function called when the user want to pause the song
 */
app.intent('pause', {
        "utterances": [
            "pause",
        ]

    },
    function(request, response) {
        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/pause', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            if (listspeakerConnected.result == 'found') {

                response.say("ok , pause!!! ");
                response.send();
            } else {
                var session = request.getSession()
                session.set('lastCommande', "control")
                response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                response.send();
            }

        })

    }
);


/**
 * function called when the user want to know then name of the connected user
 */
app.intent('userconnected', {
        "utterances": [
            "which user account is actif?",
        ]

    },
    function(request, response) {
        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;


        return http.getAsync({ url: serverUrl + '/getusernamelinked', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            username = listspeakerConnected
            response.say("Your active account is " + username);
            response.send();


        })

    }
);

/**
 * function called when the user want to stop the song
 */
app.intent('stop', {
        "utterances": [
            "stop",
        ]

    },
    function(request, response) {
        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/stop', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            if (listspeakerConnected.result == 'found') {

                response.say("ok ,stop!!! ");
                response.send();
            } else {
                var session = request.getSession()
                session.set('lastCommande', "control")
                response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                response.send();
            }

        })

    }
);

/**
 * function called when the user want help
 */
app.intent('help', {
        "utterances": [
            "help",
        ]

    },

    function(request, response) {
        response.say(' with Allplay skill, use Alexa to control music on compatible wireless speakers using AllPlay technology. Load some music into your product and start playing songs by saying Alexa, ask AllPlay to Play, then navigate inside your playlist by saying Alexa, Ask AllPlay to play next or Alexa, Ask AllPlay to play previous. You can also adjust product volume by saying  ,Alexa, Ask AllPlay to increase or decrease the volume. ')
        response.send()

    }
);


/**
 * function called when the user want to start the skill
 */
app.intent('start', {
        "utterances": [
            "start",
        ]

    },

    function(request, response) {
        response.say('Welcome to allplay. With this skill ,you can voice control any  allplay device with your AMAZON echo or echo dot . Account linking is required . For instructions, please refer to your alexa app')

        response.send()


    }
);


/**
 * function called when the user want to ignore what alexa asked for
 */
app.intent('nothing', {
        "utterances": [
            "nothing",
        ]

    },

    function(request, response) {
        response.say('')
        response.send()

    }
);

/**
 * function called when the user want to ignore what alexa asked for
 */
app.intent('none', {
        "utterances": [
            "none",
        ]

    },

    function(request, response) {
        response.say('')
        response.send()

    }
);

/**
 * function called when the user want to ignore what alexa asked for
 */
app.intent('no', {
        "utterances": [
            "no",
        ]

    },

    function(request, response) {
        response.say('')
        response.send()

    }
);

/**
 * function called when the user want to ignore what alexa asked for
 */
app.intent('noone', {
        "utterances": [
            "no one",
        ]

    },

    function(request, response) {
        response.say('')
        response.send()

    }
);


/**
 * test purpose function
 */
app.intent('whatisplaying', {
        "utterances": [
            "what is playing",
        ]

    },
    function(request, response) {
        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;

        return http.getAsync({ url: serverUrl + '/playtrack', headers: { 'Authorization': reqheader }, json: true }).spread(function(statusCodesError, listspeakerConnected) {

            if (listspeakerConnected.result == 'found') {

                response.say("ok , play!!! ");
                response.send();
            } else {
                var session = request.getSession()
                session.set('lastCommande', "control")
                response.say(" Your device  Is  offline. please check if it is powered on and connected to internet").shouldEndSession(true);;
                response.send();
            }

        })

    }
);


/**
 * function called when the user want to link to speaker
 */
app.intent("link", {
        "slots": {
            "NAMED": "AMAZON.LITERAL",

        },
        "utterances": [
            "select {NAMED} "
        ]
    },
    function(request, response) {



        var namespeakerfromalexa = request.slot('NAMED');


        accessToken = request.sessionDetails.accessToken;
        reqheader = 'Bearer ' + accessToken;
        i = 0
        str = ''
        speakerName = ''
        return http.getAsync({ url: serverUrl + '/linkspeaker', headers: { 'Authorization': reqheader }, json: true, form: { key: namespeakerfromalexa } }).spread(function(statusCodesError, listspeakerConnected) {





            if (listspeakerConnected.result == 'found') {
                var session = request.getSession()
                session.set('speaker_numSerie', listspeakerConnected)
                response.say(namespeakerfromalexa + ' has been selected ')

                response.send()
            } else {
                response.say('I was unable to select ' + namespeakerfromalexa + ' . Please try again later')
                response.send()
            }




        });


    }

);





module.exports = app;