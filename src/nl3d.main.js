var NL3D = NL3D || {};

$(document).ready(function() {
  YAML.load("config.yml", function(result) {
    Object.assign(NL3D, result);
    NL3D.initUI();
  });
  NL3D.sandbox();
});

NL3D.initUI = function() {
  var mainTable = $("<table></table>");
  mainTable.css("height", "100%");
  $(document.body).append(mainTable);
  mainTable.load(NL3D.mainTablePath, function(e) {
    $(this).prop("width", "100%");

    $("#btnSpeak").button();
    $("#btnSpeak").click(function(e) {
      NL3D.initWatson([], function(keywords) {
        var input = nlp(keywords);
        // log("verb: " + input.verbs().out("text"));
        // log("number: " + input.values().out("text"));
        log(input.out("terms"));
      });
    });
  });
};

//
//  initialize watson speech to text
//
NL3D.initWatson = function(keywords, callback) {
  // required for waston to display recognized text
  var idOutput = "#pTextBuffer";
  NL3D.keywords = keywords;
  callback =
    callback ||
    function(keyword) {
      log(keyword);
    };

  XAC.readTextFile(NL3D.tokenPath, function(token) {
    var options = {
      token: token,
      outputElement: idOutput // CSS selector or DOM Element
    };

    if (NL3D.keywords != undefined && NL3D.keywords.length > 0) {
      options.keywords = NL3D.keywords;
      options.keywords_threshold = 0.001;
    }

    NL3D.stream = WatsonSpeech.SpeechToText.recognizeMicrophone(options);

    NL3D.stream.on("error", function(err) {
      log(err);
    });

    NL3D.stream.on("data", function(data) {
      if (data.results[0] == undefined) return;

      if (data.results[0].keywords_result == undefined) {
        // log(data);
        // if didn't provide a keyword set, return the transcript as it is
        if (NL3D.keywords == undefined || NL3D.keywords.length == 0) {
          callback(data.results[0].alternatives[0].transcript);
        } else {
          // otherwise do nothing and indicate not hearing any keyword
          $(idOutput).html("...");
        }
        return;
      }
      for (var keyword in data.results[0].keywords_result) {
        // log(keyword);
        $(idOutput).html(keyword);
        callback(keyword);
        break;
      }

      // 1line debugger
      var p = $(idOutput);
      var str = p.html();
      var idx0 = Math.max(0, str.length - NL3D.outputCharLimit);
      p.html(str.substring(idx0));
    });

    $(".dot").css("background-color", "#ff0000");
  });
};
