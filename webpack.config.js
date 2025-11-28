const path = require('path');

module.exports = {
  devtool: 'source-map', // 'source-map' is the more secure for webviews VS Code, because it doesn't use eval()

  entry: './src/WorkflowView.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
