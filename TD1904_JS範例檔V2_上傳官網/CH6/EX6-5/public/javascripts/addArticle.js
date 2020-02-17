if (!$.cookie('userID') || $.cookie('userID') == "null") {
    alert("請先登入會員");
    location.href = '/public/login.html';
};
//新增文章
function addArticle() {
    if ($('#title').val() == '' || $('#title').val() == null) {
        alert('請輸入標題!');
        return;
    }
    if ($('#content').val() == '' || $('#content').val() == null) {
        alert('請輸入內文!');
        return;
    }
    var postdata = {
        title: $('#title').val(),
        type: $('#type').val(),
        content: $('#content').val().replace(/ /g, '&nbsp;').replace(/\n/g, "<br />"),
        account: $.cookie('userID'),
        name: $.cookie('userName')
    };
    $.post("/blog/addArticle", postdata, function (res) {
        if (res.status == 0) {
            alert('發文成功');
            location.href = '/public/blog.html';
        }
    });
}
