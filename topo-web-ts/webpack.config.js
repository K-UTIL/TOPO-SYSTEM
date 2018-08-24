var os = require('os');
// var resolve = require('resolve');

var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var webpack = require('webpack');
var path = require('path');

// var mode = 'production';
var mode = 'development';

const config = {
    // entry: {
    //     design: './src/index.ts'
    // },
    entry: ['webpack/hot/dev-server', path.resolve(__dirname, './src/index.ts')],
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js',
        path: 'F:\\zqws\\gitManager\\TOPO-SYSTEM\\topo-web-ts\\webpackOut',
        crossOriginLoading: 'anonymous',
        libraryTarget: 'umd',
        // publicPath: 'src'
    },
    devServer: {
        inline: true,
        port: 8099
    },
    // externals: {
    //     'jquery': 'window.jQuery'
    // },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }, {
                test: /\.js$/,
                //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
                loader: 'happypack/loader?id=happybabel',
                //排除node_modules 目录下的文件
                exclude: /node_modules/
            }, {
                test: /\.(png|jpg|jpeg|gif|woff)$/,
                loader: 'url-loader?limit=8384&name=[path][name].[ext]'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            modules: true,
                            namedExport: true,
                            camelCase: true,
                            minimize: true,
                            localIdentName: '[local]'
                        }
                    }
                }),
                //排除node_modules 目录下的文件
                exclude: /node_modules/
            }
            // }, {
            //     test: /\.(png|svg|jpg|gif)$/,
            //     use: ['file-loader'],
            //     exclude: /node_modules/
            //
            // }
        ]
    },
    optimization: {},
    plugins: [
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool,
            // cache: true,
            verbose: true
        }),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new ExtractTextPlugin("styles.css"),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    // target:''
    mode: mode
};

if (process.env.NODE_ENV === 'production') {
    config.optimization.minimize = [
        new UglifyJsPlugin({
            /* your config */
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            },
            except: ['$super', '$', 'exports', 'require','layui','layer','element']
        })
    ];
}


module.exports = config;