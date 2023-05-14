const path = require('path');

module.exports = {
    entry: {
        main: './index.js'
    },
    output: {
        path: path.join(__dirname, 'dev-build'),
        publicPath: '/',
        filename: '[name].js',
        clean: true
    },
    mode: 'development',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            }
        ]
    },
    externals: {
        bufferutil: "bufferutil",
        "utf-8-validate": "utf-8-validate",
    }
};