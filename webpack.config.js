const path = require('path');

module.exports = {
    entry: './fe/index.js',  // path to our input file
    output: {
        filename: 'index-test.js',  // output bundle file name
        path: path.resolve(__dirname, './static'),  // path to our Django static directory
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {presets: ["@babel/preset-env", "@babel/preset-react"]}
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve:
        {
            extensions: ['.tsx', '.ts', '.js'],
        }
};