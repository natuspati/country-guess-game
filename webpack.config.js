const path = require('path');

module.exports = {
    entry: {
        prod: './fe/index.js',
        dev: './fe/index.dev.js'
    },
    output: {
        path: path.resolve(__dirname, './static'),
        filename: '[name].js'
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
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ]
            }
        ]
    },
    resolve:
        {
            extensions: ['.tsx', '.ts', '.js', 'scss'],
        }
};