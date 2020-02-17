//將新增的投票資料頁面元素輸出到畫面，供getVote()呼叫
function newVote(data) {
    var content = document.createElement('tr');
    content.className = "row100 body";

    var date = new Date(data.postdate);
    var crt_date = (date.getMonth() + 1) + '/' + date.getDate() + '    ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var addHtml = `<td class="cell100 column1"></td>
    	           <td class="cell100 column2">
                        <a href="/public/voteDetail.html?_id=${data._id}">${data.title}</a>
                   </td>
    	           <td class="cell100 column5">
                        <a href="/public/vote.html? account=${data.account}">${data.account}</a>
                   </td>
    	           <td class="cell100 column6">
                        <a href="/public/vote.html?postdate=${crt_date}">${crt_date}</a>
                   </td>`;

    content.insertAdjacentHTML('beforeend', addHtml);

    $('#vote').append(content);
}

//取得網址列上的搜尋條件
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

//取得投票資料
function getVote() {
    var search = '';
    if (getUrlVal("account")) {
        search += "account=" + getUrlVal("account") + '&';
    }
    if (getUrlVal("title")) {
        search += "title=" + getUrlVal("title") + '&';
    }

    $.get("/vote/getVote?" + search, function (data, status) {
        for (var i = 0; i < data.length; i++) {
            newVote(data[i]); //自定義function
        }
    });
}

//搜尋投票關鍵字
function search() {
    location.href = '/public/vote.html?title=' + $('#title').val();
}

getVote();