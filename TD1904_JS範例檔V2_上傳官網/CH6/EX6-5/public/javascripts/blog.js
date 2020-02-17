//判斷會員是否登入
if (!$.cookie('userID') || $.cookie('userID') == "null") {
    alert("請先登入會員");
    location.href = '/public/login.html';
}

//將文章輸出到頁面上，供getArticle()呼叫
function newArticle(data) {
    var content = document.createElement('tr');
    content.className = "row100 body";

    var dat = new Date(data.postdate);
    var crt_date = (dat.getMonth() + 1) + '/' + dat.getDate() + '    ' + (dat.getHours() < 10 ? '0' + dat.getHours() : dat.getHours()) + ':' + (dat.getMinutes() < 10 ? '0' + dat.getMinutes() : dat.getMinutes());

    var addHtml = `<td class="cell100 column1">
    	               <a href="/public/blog.html?type=${data.type}">${data.type}</a>
    	           </td>
    	           <td class="cell100 column2">
    	               <a href="/public/article.html?_id=${data._id}">${data.title}</a>
    	           </td>
    	           <td class="cell100 column3">
    	               ${data.like.length}
    	           </td>
    	           <td class="cell100 column4">
    	               ${data.comment.length}
    	           </td>
    	           <td class="cell100 column5">
    	               <a href="/public/blog.html?account=${data.account}">
                           ${data.account}
                       </a>
    	           </td>
    	           <td class="cell100 column6">
    	               <a href="/public/blog.html?postdate=${crt_date}">
                           ${crt_date}
                       </a>
    	           </td>`;

    content.insertAdjacentHTML('beforeend', addHtml);
    $('#article').append(content);
}

//取得瀏覽器URL內搜尋字串
function getUrlVal(val) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == val) {
            return pair[1];
        }
    }
    return (false);
}

//以關鍵字搜尋文章
function search() {
    location.href = '/public/blog.html?title=' + $('#title').val();
}

//以分類搜尋文章
function changetype() {
    if ($('#type').val() != '' || $('#type').val() != null) {
        location.href = '/public/blog.html?type=' + $('#type').val();
    }
    else {
        location.href = '/public/blog.html';
    }
}

//取得所有文章
function getArticle() {
    var search = '';
    if (getUrlVal("type")) {
        search += "type=" + getUrlVal("type") + '&';
    }
    if (getUrlVal("account")) {
        search += "account=" + getUrlVal("account") + '&';
    }
    if (getUrlVal("title")) {
        search += "title=" + getUrlVal("title") + '&';
    }

    $.get("/blog/getArticle?" + search, function (res, status) {
        $('#type').val(res.type);
        for (var i = 0; i < res.data.length; i++) {
            newArticle(res.data[i]);
        }
    });
}

getArticle();
