module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          electron: "2.0.0"
        }
      }
    ]
  ]
};
