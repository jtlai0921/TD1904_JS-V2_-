function register() {
    var _account = $('#account').val();
    var _password = $('#password').val();
    var _confirmpsd = $('#confirmpsd').val();
    var _name = $('#name').val();


    if (!_account || !_password || !_confirmpsd || !_name) {
        $('#errormsg').text('請輸入未填欄位!');
    }
    else if (_password != _confirmpsd) {
        $('#errormsg').text('確認密碼不相同!');
    }
    else {
        $.post("/member/register", {
            'name': _name, 'account': _account, 'password': _password
        }, function (res) {
            if (res.status == 0) {
                location.href = '/public/login.html';
                alert('註冊成功!');
            }
        });
    }
}
