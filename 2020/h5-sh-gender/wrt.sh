mkdir dist node_modules src template src/components src/config
cd ../src

echo '* {
  padding: 0;
  margin: 0;
}
* {
  box-sizing: border-box;
}
%flex_column {
  display: flex;
  flex-direction: column;
}
%flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
%flex_center {
  display: flex;
  justify-content: center;
  align-items: center;
}
%abs_center {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: (-50%, -50%);
}
body {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #2c3e50;
}
a {
  text-decoration: none;
}' > common.scss

echo '@import "common.scss";' > index.scss

echo 'import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import "@babel/polyfill";
import { BrowserRouter, Route } from "react-router-dom";

const W = () => (
  <BrowserRouter>
    <div
      className="test"
    >
      <Route path="/" exact component={() => "home"} />
      <Route path="/test" exact component={() => "test"} />
    </div>
  </BrowserRouter>
);
ReactDOM.render(<W />,document.getElementById("app"));
' > index.tsx

cd ../

echo '<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
' > template/template.html

echo '{
  "name": "webpack_ts_react",
  "version": "1.0.0",
  "private": true,
  "description": "",
  "sideEffects": [
    "*.scss"
  ],
  "main": "index.ts",
  "scripts": {
    "dev": "concurrently \"cross-env mode=development webpack --config webpack.config.js\" \"webpack-dev-server --open\"",
    "build": "cross-env mode=production webpack --config webpack.config.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.7.5",
    "@babel/polyfill": "^7.8.3",
    "@babel/preset-env": "^7.8.4",
    "@babel/preset-react": "^7.8.3",
    "autoprefixer": "^9.7.3",
    "awesome-typescript-loader": "^5.2.1",
    "babel-loader": "^8.0.6",
    "clean-webpack-plugin": "^3.0.0",
    "concurrently": "^5.1.0",
    "cross-env": "^7.0.0",
    "css-loader": "^3.4.2",
    "eslint": "^6.8.0",
    "file-loader": "^5.0.2",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.9.0",
    "node-sass": "^4.13.0",
    "postcss-loader": "^3.0.0",
    "prettier": "^1.19.1",
    "sass-loader": "^8.0.0",
    "source-map-loader": "^0.2.4",
    "terser-webpack-plugin": "^2.3.5",
    "ts-loader": "^6.2.1",
    "typescript": "^3.8.2",
    "url-loader": "^3.0.0",
    "webpack": "^4.41.5",
    "webpack-bundle-analyzer": "^3.6.0",
    "webpack-cli": "^3.3.10",
    "webpack-dev-server": "^3.10.3"
  },
  "dependencies": {
    "@types/node": "^13.7.4",
    "@types/react": "^16.9.22",
    "@types/react-dom": "^16.9.5",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "react-router-dom": "^5.1.2"
  }
}' > package.json

echo '{
  "compilerOptions": {
      /* Basic Options */
      // "incremental": true,                   /* Enable incremental compilation */
      "target": "ESNEXT" /* Specify ECMAScript target version: "ES3" (default), "ES5", "ES2015", "ES2016", "ES2017", "ES2018", "ES2019" or "ESNEXT". */,
      // "module": "commonjs" /* Specify module code generation: "none", "commonjs", "amd", "system", "umd", "es2015", or "ESNext". */,
      // "lib": [],                             /* Specify library files to be included in the compilation. */
      // "allowJs": true,                       /* Allow javascript files to be compiled. */
      // "checkJs": true,                       /* Report errors in .js files. */
      "jsx": "react" /* Specify JSX code generation: "preserve", "react-native", or "react". */,
      // "declaration": true,                   /* Generates corresponding ".d.ts" file. */
      // "declarationMap": true,                /* Generates a sourcemap for each corresponding ".d.ts" file. */
      // "sourceMap": true /* Generates corresponding ".map" file. */,
      // "outFile": "./",                       /* Concatenate and emit output to single file. */
      "outDir": "./dist/" /* Redirect output structure to the directory. */,
      "rootDir": "./" /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */,
      // "composite": true,                     /* Enable project compilation */
      // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
      // "removeComments": true,                /* Do not emit comments to output. */
      // "noEmit": true,                        /* Do not emit outputs. */
      // "importHelpers": true,                 /* Import emit helpers from "tslib". */
      // "downlevelIteration": true,            /* Provide full support for iterables in "for-of", spread, and destructuring when targeting "ES5" or "ES3". */
      // "isolatedModules": true,               /* Transpile each file as a separate module (similar to "ts.transpileModule"). */

      /* Strict Type-Checking Options */
      "strict": true /* Enable all strict type-checking options. */,
      "noImplicitAny": false /* Raise error on expressions and declarations with an implied "any" type. */,
      "strictNullChecks": false /* Enable strict null checks. */,
      // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
      // "strictBindCallApply": true,           /* Enable strict "bind", "call", and "apply" methods on functions. */
      // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
      "noImplicitThis": false,                /* Raise error on "this" expressions with an implied "any" type. */
      // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

      /* Additional Checks */
      // "noUnusedLocals": true,                /* Report errors on unused locals. */
      // "noUnusedParameters": true,            /* Report errors on unused parameters. */
      // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
      // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

      /* Module Resolution Options */
      "moduleResolution": "node" /* Specify module resolution strategy: "node" (Node.js) or "classic" (TypeScript pre-1.6). */,
      "baseUrl": "." /* Base directory to resolve non-absolute module names. */,
      "paths": {
          "@/*": ["src/*"]
      } /* A series of entries which re-map imports to lookup locations relative to the "baseUrl". */,
      // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
      // "typeRoots": [],                       /* List of folders to include type definitions from. */
      "types": ["node"] /* Type declaration files to be included in compilation. */,
      // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
      "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies "allowSyntheticDefaultImports". */,
      // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
      // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

      /* Source Map Options */
      // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
      // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
      // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
      // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires "--inlineSourceMap" or "--sourceMap" to be set. */

      /* Experimental Options */
      "experimentalDecorators": true /* Enables experimental support for ES7 decorators. */
      // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
  }
}' > tsconfig.json

echo 'declare module "*.scss";
declare module "*.jpg";
declare module "*.png";
' > typings.d.ts

echo 'const path = require("path");
const { ProvidePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");

const WorkboxPlugin = require("workbox-webpack-plugin");
const isProduction = process.env.mode === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: {
    main: "./src/index.tsx"
  },
  devServer: {
    host: "127.0.0.1",
    contentBase: "./dist",
    historyApiFallback: true,
    port: 8686
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(jpeg|png|jpg)$/,
        use: [
          {
            loader: "url-loader",
            options: { name: "[name].[ext]", outputPath: "src", limit: 20480 }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")()]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { useBuiltIns: "usage" }]]
            }
          },
          "ts-loader"
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          ouput: {
            comments: false
          }
        }
      })
    ],
    usedExports: true,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\/]node_modules[\/]/,
          priority: -10,
          name: "vendor"
        },
        default: {
          priority: -20,
          name: "main"
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "h5_dev",
      template: "./template/template.html"
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    // new BundleAnalyzerPlugin(),
    new ProvidePlugin({
      $: path.resolve(path.join(__dirname, "src/jq.js"))
    })
  ],
  output: {
    filename: isProduction ? "[name].[contenthash].js" : "[name].dev.js",
    path: path.resolve(__dirname, "dist")
  }
};' > webpack.config.js

yarn

npm run dev