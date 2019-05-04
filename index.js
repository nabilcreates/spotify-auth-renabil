var express = require('express');
var axios = require('axios');
var PORT = process.env.PORT || 4000;
var app = express();
// This is the middleware to allow any requests from all server (*)
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', 'https://renabil.github.io/currentlyplaying/');
    console.log(req.headers);
    // Calls next in the stack
    next();
});
// Root page
app.get('/', function (req, res) {
    var send = {
        'msg': 'Request for a token at /token/refresh',
        'path': req.url,
        'error': false
    };
    res.send(send);
});
app.get('/token/refresh', function (req, res) {
    var AUTH = 'AQD3CUnmSmC6pjsKRjW8nI4Zb7NDtaOluywmWr9lnb4lD-fwjWXqw4Byj8ftxB5e6Mo27cdhTiXHTAG79er4FHoB9vnY2ZeLGgm2n6cUpoo9Z15gdbZ61j5E2dm7BvxoXh6JSA';
    axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': "Basic M2E4OWIyMmI3MDk1NDQ1NzgyMDc4YzIzNzQ1NGRhZmQ6ZjA5NmM0ZjcwMjI0NGExN2E3MzE3MjVkN2E0ODQ0NDA="
        },
        params: {
            'grant_type': "refresh_token",
            'refresh_token': AUTH
        }
    })
        .then(function (r) {
        var response_data = r.data;
        var send = {
            'msg': 'Got a token!',
            'path': req.url,
            'error': false,
            'access_token': response_data.access_token
        };
        res.send(send);
    })
        .catch(function (err) {
        console.log(err);
    });
});
app.listen(PORT, function () {
    console.log("Running at port " + PORT);
});
