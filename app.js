'use strict';
/**
 * 
 * Copyright (c) 2017, Avempace Wireless (Daghfous Wejd). All rights reserved.
 * 
 */
var AlexaAppServer = require('alexa-app-server');

var server = new AlexaAppServer({

    httpsEnabled: false,

    port: process.env.PORT || 3000,


});

server.start();