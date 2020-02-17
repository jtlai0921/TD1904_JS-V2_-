//上傳照片
function upload() {
    if (!$.cookie('userID') || $.cookie('userID') == "null") {
        alert("請先登入會員");
        location.href = '/public/login.html';
        return;
    }
    var img = document.getElementById('u_img_file');
    if (!/.(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(img.value)) {
        alert("圖片類型不正確!");
        return;
    }
    var formData = new FormData();
    formData.append('file', img.files[0]);
    var url = "/album/upload?account=" + $.cookie('userID');
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.status == 0) {
                alert("上傳成功!");
                history.go(0);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//修改預覽圖示
$("#u_img_file").change(function () {
    readURL(this);
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#u_img").attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

//初始化相簿內容
function initAlbum(data) {
    data.photos.forEach(function (img) {
        var comment = `<div style="width:300px;height:300px;float:left;margin:2%">
    	                   <a href="JavaScript:void(0)"  onclick = "selectImg('${img}',this)">
    	                       <img class="u_img" src="/public/photos/${img}" />
    	                   </a>
    	               </div>`;
        $('#albumForm').append(comment);
    });
}

//取得所有相片
function getAlbum() {
    if (!$.cookie('userID') || $.cookie('userID') == "null") {
        alert("請先登入會員");
        location.href = '/public/login.html';
        return;
    }
    $.post("/album/getAlbum", { 'account': $.cookie('userID') },
        function (res) {
            if (res.status == 0) {
                initAlbum(res.data);
            }
        });
}

getAlbum();

//選取圖片
function selectImg(img, a) {
    $('#preview').attr('style', 'display:block');
    $('#previewbg').attr('style', 'display:block');
    $('#image').attr('src', '/public/photos/' + img);
}

//關閉相片視窗
function closeDialog() {
    $('#preview').attr('style', 'display:none');
    $('#previewbg').attr('style', 'display:none');
}

//選取狀態控制
var status = "";
var deleteImg = [];

//進入選取狀態
function onSelect() {
    $('#selBtn').hide();
    $('#delBtn').show();
    $('#cnBtn').show();
    status = "onSelect";
}

//取消選取狀態
function cnSelect() {
    $('#selBtn').show();
    $('#delBtn').hide();
    $('#cnBtn').hide();
    status = "";
    deleteImg = [];
    $('.u_img_file').removeClass('u_img_file');
}

//選取相片
function selectImg(img, a) {
    if (status == "onSelect") {
        $(a).children().toggleClass('u_img_file');
        if (deleteImg.indexOf(img) > -1) {
            deleteImg.splice(deleteImg.indexOf(img), 1);
        } else {
            deleteImg.push(img);
        }
    } else {
        $('#preview').attr('style', 'display:block');
        $('#previewbg').attr('style', 'display:block');
        $('#image').attr('src', '/public/photos/' + img);
    }
}

//刪除圖片
function onDelete() {
    if (!$.cookie('userID') || $.cookie('userID') == "null") {
        alert("請先登入會員");
        location.href = '/public/login.html';
        return;
    }
    if (deleteImg.length < 1) {
        alert('尚未選取圖片!');
        return;
    }
    if (!confirm("確定要刪除嗎?")) {
        return;
    } else {
        var url = "/album/delete";
        var jsondata = JSON.stringify({
            "account": $.cookie('userID'),
            "images": deleteImg
        });
        $.ajax({
            url: url,
            type: "POST",
            data: jsondata,
            contentType: "application/json",
            success: function (res) {
                if (res.status == 0) {
                    alert("刪除成功!");
                    history.go(0);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}
