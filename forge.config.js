module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    { name: '@electron-forge/maker-zip', platforms: ['darwin', 'linux', 'win32'] }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: { entry: './src/index.js' },
        renderer: {
          entryPoints: [
            {
              name: 'main_window',
              html: './src/index.html',
              js: './src/renderer.js',
              preload: { js: './src/preload.js' }
            }
          ]
        }
      }
    }
  ]
};
