module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      config: {
        // Configuration options here
        appDirectory: './out/neoport-win32-x64', // Replace with your app's output directory
        authors: 'Mowzli Sre',
        exe: 'neoport.exe',
        description: 'Your App Description',
        language: 1033, // English - United States
        name: 'neoport',
        shortName: 'Neo',
        version: '1.0.0', // Your app version
        // Other configuration options...
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
