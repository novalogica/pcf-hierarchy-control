module.exports = {
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 'current',
        },
      }],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    ignore: [
      /node_modules\/(?!(@fluentui\/react-icons)\/).*/,
    ],
    generatorOpts: {
      maxLineLength: 1000000,
    },
    compact: true,
    comments: false
};