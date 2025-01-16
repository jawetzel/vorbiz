module.exports = {
    presets: ['babel-preset-expo'], // Use babel-preset-expo which includes expo-router
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
};
