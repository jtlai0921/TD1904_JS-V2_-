var express = require('express');
var router = express.Router();
var memberModel = require('../models/memberModel.js');
//在最上方引入articleModel
var articleModel = require('../models/articleModel.js');

//新增文章功能
router.post('/addArticle', function (req, res) {
    var newarticle = new articleModel({
        account: req.body.account,
        name: req.body.name,
        type: req.body.type,
        title: req.body.title,
        content: req.body.content,
        like: [],
        comment: [],
        postdate: new Date()
    });
    newarticle.save(function (err, data) {
        if (err) {
            res.json({ "status": 1, "msg": "error" });
        }
        else {
            res.json({
                "status": 0, "msg": "success", "data": data
            });
        }
    });
});

//瀏覽文章功能
router.get('/getArticle', function (req, res) {
    var type = (req.query.type != undefined) ? req.query.type : "";
    var account = (req.query.account != undefined) ? req.query.account : "";
    var title = (req.query.title != undefined) ? req.query.title : "";

    articleModel.find({
        "account": account != "" ? account : { $regex: '.*' },
        "type": { $regex: '.*' + type + '.*' },
        "title": { $regex: '.*' + title + '.*' }
    }, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.json({ "type": type, "data": data });
    })
});

//取得文章內容
router.get('/getArticleById', function (req, res) {
    articleModel.find({ _id: req.query._id }, function (err,
        data) {
        if (data == undefined) {
            res.json({ "status": 1, "msg": "查無此文章!" });
        }
        else {
            if (err) {
                res.json({ "status": 1, "msg": "error" });
            }
            else {
                memberModel.find({ account: data[0].account },
                    function (err, mem) {
                        res.json({
                            "status": 0, "msg": "success", "data": {
                                account: data[0].account,
                                type: data[0].type,
                                title: data[0].title,
                                content: data[0].content,
                                like: data[0].like,
                                comment: data[0].comment,
                                postdate: data[0].postdate,
                                name: mem[0].name
                            }
                        });
                    });
            }
        }
    });
});

//修改文章功能
router.post('/editArticle', function (req, res) {
    articleModel.findById(req.body._id, function (err, data) {
        data.content = req.body.content;
        data.save(function (err) {
            if (err) {
                res.json({ "status": 1, "msg": "error" });
            }
            else {
                res.json({ "status": 0, "msg": "success" });
            }
        });
    });
});

//刪除文章功能
router.post('/delArticle', function (req, res) {
    articleModel.findByIdAndRemove(req.body._id, function (err, data) {
        if (err) {
            console.log(err);
            res.json({ "status": 1, "msg": "error" });
        }
        else {
            res.json({ "status": 0, "msg": "success" });
        }
    });
});

//喜歡文章功能
router.post('/pushlike', function (req, res) {
    articleModel.findById(req.body._id, function (err, data) {
        if (data.like.indexOf(req.body.account) < 0) {
            data.like.push(req.body.account);
        }
        else {
            data.like.splice(data.like.indexOf(req.body.account), 1)
        }
        data.save(function (err) {
            if (err) {
                res.json({ "status": 1, "msg": "error" });
            }
            else {
                res.json({
                    "status": 0, "msg": "success", "like": data.like.length
                });
            }
        });
    }
    );
});

//回應文章功能
router.post('/addComment', function (req, res) {
    articleModel.findById(req.body._id, function (err, data) {
        var newID = 1;
        if (data.comment.length > 0) {
            newID = Math.max(...data.comment.map(p => p.id))
        }
        var newcomment = {
            id: newID + 1,
            account: req.body.account,
            name: req.body.name,
            message: req.body.message,
            like: [],
            date: new Date()
        };
        data.comment.push(newcomment);
        data.save(function (err) {
            if (err) {
                res.json({ "status": 1, "msg": "error" });
            }
            else {
                res.json({ "status": 0, "msg": "success" });
            }
        });
    });
});

//修改回應功能
router.post('/editComment', function (req, res) {
    articleModel.findById(req.body._id, function (err, data) {
        data.comment.forEach(function (com) {
            if (com.id == parseInt(req.body.c_id)) {
                var key = data.comment.indexOf(com);
                data.comment[key].message = req.body.message;
                data.markModified('comment');
                data.save(function (err) {
                    if (err) {
                        res.json({ "status": 1, "msg": "error" });
                    }
                    else {
                        res.json({
                            "status": 0,
                            "msg": "success"
                        });
                    }
                });
            }
        });
    });
});

//刪除回應功能
router.post('/delComment', function (req, res) {
    articleModel.findById(req.body._id, function (err, data) {
        data.comment.forEach(function (com) {
            if (com.id == parseInt(req.body.c_id)) {
                var key = data.comment.indexOf(com);
                data.comment.splice(data.comment[key], 1)
                data.markModified('comment');
                data.save(function (err) {
                    if (err) {
                        res.json({ "status": 1, "msg": "error" });
                    }
                    else {
                        res.json({
                            "status": 0,
                            "msg": "success"
                        });
                    }
                });
            }
        });
    });
});

//喜歡回應功能
router.post('/commentlike', function (req, res) {
    var length = 0;
    articleModel.findById(req.body._id, function (err, data) {
        data.comment.forEach(function (com) {
            if (com.id == parseInt(req.body.c_id)) {
                var key = data.comment.indexOf(com);
                if (data.comment[key].
                    like.indexOf(req.body.account) < 0) {
                    data.comment[key].like.push(req.body.account);
                    console.log(data);
                }
                else {
                    data.comment[key].like.splice(
                        data.comment[key].like.indexOf(req.body.account), 1);
                }
                length = data.comment[key].like.length;
                data.markModified('comment');
                data.save(function (err) {
                    if (err) {
                        res.json({
                            "status": 1, "msg": "error"
                        });
                    }
                    else {
                        res.json({
                            "status": 0, "msg": "success", "like": length
                        });
                    }
                });
            }
        });
    });
});


module.exports = router;
