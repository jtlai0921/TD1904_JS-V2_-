if (!$.cookie('userID') || $.cookie('userID') == "null") {
    $('#login').show();
    $('#changePass').hide();
    $('#username').hide();
    $('#logout').hide();
}
else {
    $('#login').hide();
    $('#changePass').show();
    $('#username').show();
    $('#username').text("UserName : " + $.cookie('userName'));
    $('#logout').show();
}

//登出功能
function logout() {
    $.removeCookie("userID");
    $.removeCookie("userName");
    history.go(0);
}
