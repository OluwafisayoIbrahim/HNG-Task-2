module.exports = {
    module: {
      ignoreWarnings: [/Failed to parse source map/],
      rules: [
        {
          test: /lucide-react\.js$/,
          use: 'ignore-loader'
        }
      ]
    }
  }