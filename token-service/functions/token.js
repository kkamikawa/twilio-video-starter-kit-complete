exports.handler = function(context, event, callback) {
    //環境変数からTwilio認証情報を読み込む
    const {ACCOUNT_SID, API_KEY, API_SECRET} = context;
    
    //呼び出し時に渡されたパラメータ
    const {identity} = event;

    //token発行
    const AccessToken = Twilio.jwt.AccessToken;
    const token = new AccessToken(
        ACCOUNT_SID,
        API_KEY,
        API_SECRET,
        {identity: identity}
    );

    //tokenにProgrammable Videoへのアクセス許可を与える
    const VideoGrant = AccessToken.VideoGrant;
    const videoGrant = new VideoGrant({
        room: 'cool room' // 特定のルームに制限可能、例えばeventとして渡して動的に切り替えも可能
    });
    token.addGrant(videoGrant);

    //レスポンス作成
    const response = new Twilio.Response();
    const headers = {
        "Access-Control-Allow-Origin": "*", // クライアント側のURLに変更してください
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    response.setHeaders(headers);
    response.setBody({
        accessToken: token.toJwt()
    });

    return callback(null, response);
}