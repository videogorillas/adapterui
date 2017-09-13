module.exports = {

    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/static/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },

            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            sourceMap: true,
                            importLoaders: 1,
                            localIdentName: "[name]--[local]--[hash:base64:8]"
                        }
                    },
                    "postcss-loader" // has separate config, see postcss.config.js nearby
                ]
            },
            // {
            //     test: /\.(css)$/,
            //     loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[local]!postcss'),
            // },
            // {
            //     test: /\.(scss)$/,
            //     loader: multi(extractWhite.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?data=@import"config_ksi.scss";&sourceMap'),
            //         extractBlack.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?data=@import"config_black.scss";&sourceMap'))
            // },
            {
                include: /\.json$/,
                loaders: ["json-loader"]
            }
        ]
        // rules: [
        //     // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        //     {test: /\.tsx?$/, loader: "awesome-typescript-loader"},
        //
        //     // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        //     {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
        //     {
        //         test: /\.css$/,
        //         use: ['style-loader', 'css-loader']
        //     }
        // ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
};