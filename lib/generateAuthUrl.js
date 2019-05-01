function generateAuthUrl(client_id, redirect_uri, scope, show_dialog, response_type) {
    var url = "https://accounts.spotify.com/authorize?client_id=" + client_id + "&redirect_uri=" + encodeURIComponent(redirect_uri) + "&scope=" + scope + "&show_dialog=" + show_dialog + "&response_type=" + response_type;
    return url;
}
exports["default"] = generateAuthUrl;
