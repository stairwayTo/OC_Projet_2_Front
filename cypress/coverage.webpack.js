// Ajoute un compteur (istanbul) sur chaque fichier .ts de src/, sauf les specs
module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: '@jsdevtools/coverage-istanbul-loader',
        options: { esModules: true },
        enforce: 'post',
        include: require('path').join(__dirname, '..', 'src'),
        exclude: [/\.spec\.ts$/, /node_modules/],
      },
    ],
  },
};
