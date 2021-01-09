const path = require('path');

module.exports = {
    mode: "development",
    devtool: 'inline-source-map',
    entry: [
        './src/app/App.ts',
        './src/app/plugins/builtin/Markdown/Markdown.ts',
        './src/app/plugins/builtin/Python/Python.ts'
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: './dist',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.svg$/,
                loader: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
};