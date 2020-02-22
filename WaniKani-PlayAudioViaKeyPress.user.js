// ==UserScript==
// @name           WaniKani Play Audio Via Key Press
// @namespace      https://github.com/ThePieMonster
// @version        1.1.1
// @description    Play the audio file for the active review item via a key press
// @author         ThePieMonster
// @include        https://www.wanikani.com/review/session
// @include        https://www.wanikani.com/lesson/session
// @updateURL      https://github.com/ThePieMonster/WaniKani-PlayAudioViaKeyPress/raw/master/WaniKani-PlayAudioViaKeyPress.user.js
// @downloadURL    https://github.com/ThePieMonster/WaniKani-PlayAudioViaKeyPress/raw/master/WaniKani-PlayAudioViaKeyPress.user.js
// @license        GNU; https://www.gnu.org/licenses/gpl-3.0.en.html
// @grant          none
// ==/UserScript==


// ----------- User Setting -----------

var audioKeyPressKyoko1 = 49; // 1
var audioKeyPressKenichi1 = 50; // 2
var audioKeyPressKyoko2 = 51; // 3
var audioKeyPressKenichi2 = 52; // 4

// --------------- Code ---------------

console.log("WK Audio Play: Starting Script with Kyoko 1 key binding '" + audioKeyPressKyoko1 + "' and Kenichi 1 key binding '" + audioKeyPressKenichi1 +
            "' and Kyoko 2 key binding '" + audioKeyPressKyoko2 + "' and Kenichi 2 key binding '" + audioKeyPressKenichi2 + "'.");

var kyoko1;
var kenichi1;
var kyoko2;
var kenichi2;
var audioKyoko1;
var audioKenichi1;
var audioKyoko2;
var audioKenichi2;

whenLoadingIndicatorIsHidden(function () {
    getAudio();
    onReviewItemChange(getAudio);
});



// Functions

function getAudio() {
    console.log("WK Audio Play: Waiting for answer to be submitted...");
    // Confirm <li>option-item-info is not disabled
    // if (itemInfo.className == "disabled") than answer has not been submitted yet

    // Reset audio variables
    window.kyoko1 = null;
    window.kenichi1 = null;
    window.kyoko2 = null;
    window.kenichi2 = null;

    if (isReadingQuestion()) {
        //console.log("WK Audio Play: Is Reading Question");
        getOptionItemInfo();
    }
    else {
        //console.log("WK Audio Play: Is Not Reading Question");
    }
}

function getOptionItemInfo() {
    setTimeout(function() {
        console.log("WK Audio Play: Checking for submission...");
        var itemInfo = document.getElementById('option-item-info');
        if (itemInfo.className == "disabled") {
            getOptionItemInfo();
        } else {
            console.log("WK Audio Play: Answer submitted");
            try {
                // Get Audio Strings
                window.kyoko1 = $('.pronunciation-group audio')[0];
                window.kenichi1 = $('.pronunciation-group audio')[1];
                window.kyoko2 = $('.pronunciation-group audio')[2];
                window.kenichi2 = $('.pronunciation-group audio')[3];
            }
            catch(err) {
                console.log(err.message);
            }
        }
    }, 1000);

    // Listen For Key Press
    document.addEventListener('keydown', function(event){
        if (!event.repeat) {
            if (event.keyCode === audioKeyPressKyoko1) {
                console.log("WK Audio Play: Playing Audio Kyoko 1");
                try {window.kyoko1.play();} catch(err) {console.log(err.message);}
            }
            if (event.keyCode === audioKeyPressKenichi1) {
                console.log("WK Audio Play: Playing Audio Kenichi 1");
                try {window.kenichi1.play();} catch(err) {console.log(err.message);}
            }
            if (event.keyCode === audioKeyPressKyoko2) {
                console.log("WK Audio Play: Playing Audio Kyoko 2");
                try {window.kyoko2.play();} catch(err) {console.log(err.message);}
            }
            if (event.keyCode === audioKeyPressKenichi2) {
                console.log("WK Audio Play: Playing Audio Kenichi 2");
                try {window.kenichi2.play();} catch(err) {console.log(err.message);}
            }
        }
    });
}

function whenLoadingIndicatorIsHidden(callback) {
    var target = document.getElementById('loading');
    // Mutation observer will watch for change to visibilty.
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // We assume that the loading indicator is hidden
            // when its style attribute is modified.
            if (mutation.attributeName === 'style') {
                callback();
                return false;
            }
        });
    });
    observer.observe(target, { attributes: true });
}

function onReviewItemChange(callback) {
	// currentItem seems to be updated even when switching
    // between reading and meaning for the same item.
    $.jStorage.listenKeyChange('currentItem', callback);
}

function isReadingQuestion() {
	return $('#question-type').hasClass('reading');
}
