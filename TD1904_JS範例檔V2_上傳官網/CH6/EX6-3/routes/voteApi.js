var express = require('express');
var router = express.Router();
//在最上方引入voteModel
var voteModel = require('../models/voteModel.js');

//新增投票功能
router.post('/addVote', function (req, res) {
    var optionAry = [];
    for (var i = 0; i < req.body.optionAry.length; i++) {
        var option = { name: req.body.optionAry[i], account: [] }
        optionAry.push(option);
    }

    var newvote = new voteModel({
        account: req.body.account,
        name: req.body.name,
        title: req.body.title,
        option: optionAry,
        postdate: new Date()
    });
    newvote.save(function (err, data) {
        if (err) {
            res.json({ "status": 1, "msg": "error" });
        }
        else {
            res.json({
                "status": 0, "msg": "success",
                "data": newvote
            });
        }
    });
});

//取得投票資料
router.get('/getVote', function (req, res) {

    var account = (req.query.account != undefined) ? req.query.account : "";
    var title = (req.query.title != undefined) ?
        req.query.title : "";

    voteModel.find({
        "account": account != "" ? account : { $regex: '.*' },
        "title": { $regex: '.*' + title + '.*' }
    }, function (err, data) {
        if (err) { return console.log(err) }
        res.json(data);
    })
});

//取得投票內容
router.get('/getVoteById', function (req, res) {
    voteModel.find({ _id: req.query._id }, function (err, data) {
        if (data == undefined) {
            res.json({ "status": 1, "msg": "查無此投票!" });
        }
        else {
            if (err) {
                res.json({ "status": 1, "msg": "error" });
                console.log("error");
            }
            else {
                res.json({
                    "status": 0, "msg": "success", "data": data[0]
                });
            }
        }
    });
});

//投票功能
router.post('/pushVote', function (req, res) {
    voteModel.findById(req.body._id, function (err, data) {
        for (var i = 0; i < data.option.length; i++) {
            if (data.option[i].account.indexOf(
                req.body.account) > -1) {
                data.option[i].account.splice(data.option[i].account.indexOf(req.body.account), 1);
            }
        }
        data.option[parseInt(req.body.cnt)].account.push(req.body.account);
        data.markModified('option');
        data.save(function (err) {
            if (err) {
                res.json({ "status": 1, "msg": "error" });
            }
            else {
                res.json({ "status": 0, "msg": "success" });
            }
        });
    }
    );
});

//取消投票
router.post('/cancel', function (req, res) {
    voteModel.findById(req.body._id, function (err, data) {
        for (var i = 0; i < data.option.length; i++) {
            if (data.option[i].account.indexOf(
                req.body.account) > -1) {
                data.option[i].account.splice(data.option[i].account.indexOf(req.body.account), 1);
            }
        }
        data.markModified('option');
        data.save(function (err) {
            if (err) {
                res.json({ "status": 1, "msg": "error" });
            }
            else {
                res.json({ "status": 0, "msg": "success" });
            }
        });
    }
    );
});


module.exports = router;
