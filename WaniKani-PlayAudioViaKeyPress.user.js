// ==UserScript==
// @name           WaniKani Play Audio Via Key Press
// @namespace      https://github.com/ThePieMonster
// @version        1.0.0
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

var audioKeyPressKyoko = 49; // 1
var audioKeyPressKenichi = 50; // 2

// --------------- Code ---------------

console.log("WK Audio Play: Starting Script with Kyoto key binding '" + audioKeyPressKyoko + "' and Kenichi key binding '" + audioKeyPressKenichi + "'.");

var kyoko;
var kenichi;
var audioKyoko;
var audioKenichi;

whenLoadingIndicatorIsHidden(function () {
    getAudio();
    onReviewItemChange(getAudio);
});



// Functions

function getAudio() {
    console.log("WK Audio Play: Waiting for answer to be submitted...");
    // Confirm <li>option-item-info is not disabled
    // if (itemInfo.className == "disabled") than answer has not been submitted yet

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
                // Get Kyoko Audio String
                window.kyoko = document.querySelector("#item-info-reading > div > div > div > ul > li:nth-child(1) > span.audio-player > audio > source:nth-child(1)"); // audio/mpeg
                // window.kyoko = document.querySelector("#item-info-reading > div > div > div > ul > li:nth-child(1) > span.audio-player > audio > source:nth-child(2)"); // audio/ogg

                // Get Kenichi Audio String
                window.kenichi = document.querySelector("#item-info-reading > div > div > div > ul > li:nth-child(2) > span.audio-player > audio > source:nth-child(1)"); // audio/mpeg
                // window.kenichi = document.querySelector("#item-info-reading > div > div > div > ul > li:nth-child(2) > span.audio-player > audio > source:nth-child(2)"); // audio/ogg

                // Setup Audio String
                window.audioKyoko = new Audio(window.kyoko.src);
                window.audioKenichi = new Audio(window.kenichi.src);
            }
            catch(err) {
                console.log(err.message);
            }
        }
    }, 1000);

    // Listen For Key Press
    document.addEventListener('keydown', function(event){
        if (!event.repeat) {
            if (event.keyCode === audioKeyPressKyoko) {
                console.log("WK Audio Play: Playing Audio Kyoko");
                window.audioKyoko.play();
            }
            if (event.keyCode === audioKeyPressKenichi) {
                console.log("WK Audio Play: Playing Audio Kenichi");
                window.audioKenichi.play();
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
