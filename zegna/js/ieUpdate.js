$(document).ready(function () {
    var html = '<div id="ieUpdateDiv" style="position:absolute;top:-42px;left:50%;margin-left:-410px;width:820px;height:42px;z-index:2;">'
        + '<a href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie" target="_blank"><img alt="" src="img/warning_bar_0027_Simplified Chinese.jpg" style="border:0;" /></a>'
        + '</div>';
    document.body.innerHTML += html;
    $("#ieUpdateDiv").delay(1000).animate({ top: 0 }, "slow").delay(10000).animate({ top: -42 }, "slow", function () { $(this).remove(); });
});
