const path = require('path');
const { WebpackForemanVendorPlugin, Manifest } = require('@theforeman/vendor');

const getFilenamesWithExt = (files, ext) =>
  files.filter((f) => f.endsWith(ext)).map((f) => path.basename(f));

module.exports = ({ config, mode }) => {
  const vendorManifest = new Manifest(mode);

  const vendorJsFiles = getFilenamesWithExt(vendorManifest.files, '.js');
  const vendorCssFiles = getFilenamesWithExt(vendorManifest.files, '.css');

  const htmlWebpackPlugin = config.plugins.find(
    (p) => p.constructor.name === 'HtmlWebpackPlugin'
  );

  const { templateParameters } = htmlWebpackPlugin.options;

  htmlWebpackPlugin.options.templateParameters = (...args) => {
    const htmlConfig = templateParameters(...args);

    htmlConfig.files.js = [...vendorJsFiles, ...htmlConfig.files.js];
    htmlConfig.files.css = [...vendorCssFiles, ...htmlConfig.files.css];

    return htmlConfig;
  };

  config.plugins.push(new WebpackForemanVendorPlugin({ mode }));

  return config;
};
