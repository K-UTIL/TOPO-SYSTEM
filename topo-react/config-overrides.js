const {injectBabelPlugin} = require('react-app-rewired');


module.export = function override(config, env) {
    config = injectBabelPlugin(
        ['import', {libraryName: 'antd', libraryDirectory: 'es', style: 'css'}],
        config,
    );

    return config;
}