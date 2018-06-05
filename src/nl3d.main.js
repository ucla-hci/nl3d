var NL3D = NL3D || {};

$(document).ready(function () {
    YAML.load("config.yml", function (result) {
        Object.assign(NL3D, result);
        NL3D.initUI();
    });
    NL3D.sandbox();
});

NL3D.initUI = function () {
    var mainTable = $("<table></table>");
    mainTable.css("height", "100%");
    $(document.body).append(mainTable);
    mainTable.load(NL3D.mainTablePath, function (e) {
        $(this).prop("width", "100%");
    });
}