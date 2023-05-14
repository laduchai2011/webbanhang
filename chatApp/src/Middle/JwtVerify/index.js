const jwt = require('jsonwebtoken');
const { TOKENENCODESTRING, TOKENKEY } = require('../../Constant/index');

const JwtVerify = (token, next) => {
    try {
        const token1 = token && token.split(" ");
        if (token1[0] === TOKENENCODESTRING) {
            jwt.verify(token1[1], TOKENKEY, function(err, decoded) {
                if (err) {
                    console.error(err);
                } else {
                    decoded && next();
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = { JwtVerify }