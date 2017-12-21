
'use strict';
var storage = require('./storage'),
    textHelper = require('./textHelper');

var registerEventHandlers = function (eventHandlers, skillContext) {
    eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
        //if user said a one shot command that triggered an intent event,
        //it will start a new session, and then we should avoid speaking too many words.
        skillContext.needMoreHelp = false;
    };

    eventHandlers.onLaunch = function (launchRequest, session, response) {
        //Speak welcome message and ask user questions
        //based on whether there are players or not.
        storage.loadGame(session, function (currentGame) {
            var speechOutput = '',
                reprompt;
            if (currentGame.data.players.length === 0) {
                speechOutput += 'MedicineMinder, I am going to record number of times you take medicine today. Which medicine do you want to add first?';
                reprompt = "Please tell me which medicine do you want to add first?";
            } else if (currentGame.isEmptyScore()) {
                speechOutput += 'MedicineMinder, '
                    + 'you have ' + currentGame.data.players.length + ' medicine';
                if (currentGame.data.players.length > 1) {
                    speechOutput += 's';
                }
                speechOutput += ' in your list. You can set number of times you need to take today to a medicine, add another medicine, reset medicine list or exit. Which would you like?';
                reprompt = textHelper.completeHelp;
            } else {
                speechOutput += 'MedicineMinder, What can I do for you?';
                reprompt = textHelper.nextHelp;
            }
            response.ask(speechOutput, reprompt);
        });
    };
};

// export the register variable to score keeper, score keeper can call register
exports.register = registerEventHandlers;
