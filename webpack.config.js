const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

if (!process.env.OPENAI_API_KEY) {
  throw new Error('The OPENAI_API_KEY environment variable is not defined');
}

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NEXT_PUBLIC_OPENAI_API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_OPENAI_API_KEY),
      'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
    }),
  ],
};