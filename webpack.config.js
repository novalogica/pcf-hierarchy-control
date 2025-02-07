const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      maxSize: 200000,
    },
  }
};