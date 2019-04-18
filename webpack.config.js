var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'thrusta-subscriber.js',
        library: 'ThrustaSubscriber',
        libraryTarget: 'var',
        libraryExport: 'default'
    }
};