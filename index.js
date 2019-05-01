var express = require('express');
var generateAuthUrl_1 = require('./lib/generateAuthUrl');
var fs = require('fs');
var axios = require('axios');
var PORT = process.env.PORT || 4000;
var app = express();
// Root page
app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://spotify-auth-renabil.herokuapp.com/');
    var send = {
        'msg': 'go to /token/new to get started',
        'path': req.url,
        'error': false
    };
    res.send(send);
});
// Redirected to here after requesting for new token
app.get('/token', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://spotify-auth-renabil.herokuapp.com/');
    var error = req.query.error;
    if (error) {
        var send = {
            'msg': 'error! access is denied by user',
            'path': req.url,
            'error': true
        };
        res.send(send);
    }
    else {
        var code = req.query.code;
        axios({
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': "Basic M2E4OWIyMmI3MDk1NDQ1NzgyMDc4YzIzNzQ1NGRhZmQ6ZjA5NmM0ZjcwMjI0NGExN2E3MzE3MjVkN2E0ODQ0NDA="
            },
            params: {
                'grant_type': "authorization_code",
                'code': code,
                'redirect_uri': 'https://spotify-auth-renabil.herokuapp.com/'
            }
        })
            .then(function (r) {
            console.log(r);
            var response_data = r.data;
            fs.writeFileSync('auth.json', JSON.stringify(response_data), { flag: 'w' });
            res.redirect("/token/done?response_data=" + JSON.stringify(response_data));
        })
            .catch(function (err) {
            console.log(err);
        });
    }
});
// Refreshes the token (Not used as of now)
app.get('/token/refresh', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://spotify-auth-renabil.herokuapp.com/');
    // READ FROM FILE
    // let AUTH = JSON.parse(fs.readFileSync('./auth.json'))
    // console.log(AUTH.refresh_token)
    // TEMP
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
        console.log(r);
        var response_data = r.data;
        fs.writeFileSync('auth.json', JSON.stringify(response_data), { flag: 'w' });
        res.send(response_data);
    })
        .catch(function (err) {
        console.log(err);
    });
});
// Redirected to here from /token
app.get('/token/done', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://spotify-auth-renabil.herokuapp.com/');
    var send = JSON.parse(req.query.response_data);
    res.send({ data: send });
});
app.get('/token/new', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://spotify-auth-renabil.herokuapp.com/');
    var redirect_url = generateAuthUrl_1["default"]('3a89b22b7095445782078c237454dafd', 'https://spotify-auth-renabil.herokuapp.com/', 'user-read-currently-playing', false, 'code');
    res.redirect(redirect_url);
});
app.listen(PORT, function () {
    console.log('running');
});
