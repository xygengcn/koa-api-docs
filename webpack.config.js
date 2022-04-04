const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//webpack中所有的配置信息都应该写在module.exports中
module.exports = {
    mode: 'development', //development为开发环境 production为生产环境变量 none
    target: 'node',
    //指定入口文件
    entry: './src/core/index.ts',
    //指定打包文件所在目录
    output: {
        //指定打包文件的目录
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        //告诉webpack不使用箭头函数
        environment: {
            arrowFunction: false
        },
        library: {
            name: 'libraryName',
            type: 'umd',
            // 不添加的话引用的时候需要 libraryName.default
            export: 'default'
        }
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    //指定webpack打包时要使用模块
    module: {
        //指定要加载的规则
        rules: [
            {
                //test指定的是规则生效的文件
                test: /\.ts$/,
                use: 'ts-loader', //使用的loader去处理ts文件
                exclude: /node-modules/ //不需要编译的文件
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'dist/core/index.d.ts'),
                    to: path.join(__dirname, 'build')
                },
                {
                    from: path.join(__dirname, 'src/docsify'),
                    to: path.join(__dirname, 'build/docsify')
                }
            ]
        })
    ]
};
