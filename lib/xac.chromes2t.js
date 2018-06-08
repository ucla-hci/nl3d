//	........................................................................................................
//
//	speech to text wrapper based on google chrome's api
//
//  by xiangchen@acm.org, v1.0f 06/2018
//
//  ref: https://www.google.com/intl/en/chrome/demos/speech.html
//
//	........................................................................................................

var XAC = XAC || {};

XAC.recognition = new webkitSpeechRecognition();
XAC.recognition.lang = "en-US";
XAC.recognizing = false;
XAC.recognition.continuous = true;
XAC.recognition.interimResults = true;

XAC.onStartCallback = undefined;
XAC.onEndCallback = undefined;
XAC.onResultCallback = undefined;

XAC.startListening = function () {
    if (XAC.recognizing) {
        XAC.recognition.stop();
        return;
    }

    XAC.recognition.start();
    ignore_onend = false;
}

XAC.recognition.onstart = function () {
    console.info('recognition started')
    XAC.recognizing = true;
    final_transcript = '';
}

XAC.recognition.onerror = function (event) {
    console.error(event.error);

    if (event.error == 'no-speech') {
        ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
        ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
        ignore_onend = true;
    }
}

XAC.recognition.onend = function () {
    console.info('recognition ended')
    XAC.recognizing = false;
    if (ignore_onend) {
        return;
    }
    if (!final_transcript) {
        return;
    }
}

XAC.recognition.onresult = function (event) {
    var interim_transcript = '';
    if (typeof (event.results) == 'undefined') {
        XAC.recognition.onend = null;
        XAC.recognition.stop();
        return;
    }

    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }

    if (final_transcript || interim_transcript) {
        //   showButtons('inline-block');
        console.log(interim_transcript);
    }
};