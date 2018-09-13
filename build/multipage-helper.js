/**
 * 多页面支持
 */
const packageConfig = require('../package.json')
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let moduleList; // 缓存多页面模块列表
const MODULE_ROOT_PATH = './src/modules'; // 模块根目录(这个可以根据自己的需求命名)

/**
 * 获取js入口数组
 */
exports.getEntries = function () {
  // 缓存js入口数组
  const entries = {};
  // 初始化模块列表
  this.getModuleList();
  // 变量模块列表
  moduleList.forEach((module) => {
    if (module.moduleID != '' && module.moduleJS != '') {
      entries[module.moduleID] = module.moduleJS;
    }
  });
  // console.log('*********************************** entries ***********************************');
  // console.log(entries);
  return entries;
};

/**
 * 获取多页面模块列表
 * @returns {模块的信息集合}
 */
exports.getModuleList = function () {
  // 判断是否为空，不为空则直接返回
  if (moduleList) {
    return moduleList;
  }
  // 为空则读取列表
  moduleList = [];
  readDirSync(MODULE_ROOT_PATH, '');
  console.log('*********************************** moduleList ***********************************');
  console.log(moduleList);
  return moduleList;
};

/**
 * 获取dev的Html模板集合
 * @returns {dev的Html模板集合}
 */
exports.getDevHtmlWebpackPluginList = function () {
  console.log('*********************************** devHtmlWebpackPluginList ***********************************');
  // 缓存dev的Html模板集合
  const devHtmlWebpackPluginList = [];
  // 获取多页面模块集合
  const moduleList = this.getModuleList();
  // 遍历生成模块的HTML模板
  moduleList.forEach((mod) => {
    // 生成配置
    const conf = {
      filename: `${mod.moduleID}.html`,
      template: mod.moduleHTML,
      chunks: [mod.moduleID],
      inject: true,
      version: packageConfig.version
    };
    console.log(conf);
    // 添加HtmlWebpackPlugin对象
    devHtmlWebpackPluginList.push(new HtmlWebpackPlugin(conf));
  });
  return devHtmlWebpackPluginList;
};

/**
 * 获取prod的Html模板集合
 * @returns {prod的Html模板集合}
 */
exports.getProdHtmlWebpackPluginList = function () {
  // console.log('*********************************** prodHtmlWebpackPluginList ***********************************');
  // 缓存dev的Html模板集合
  const prodHtmlWebpackPluginList = [];
  // 获取多页面模块集合
  const moduleList = this.getModuleList();
  // 遍历生成模块的HTML模板
  moduleList.forEach((mod) => {
    // 生成配置
    const conf = {
      filename: `${mod.moduleID}.html`,
      template: mod.moduleHTML,
      version: packageConfig.version,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      chunks: ['manifest', 'vendor', mod.moduleID],
    };
    // console.log(conf);
    // 添加HtmlWebpackPlugin对象
    prodHtmlWebpackPluginList.push(new HtmlWebpackPlugin(conf));
  });
  return prodHtmlWebpackPluginList;
};

/**
 * 深度遍历目录，并整理多页面模块
 * @param path 需要变量的路径
 * @param moduleName 模块名称
 */
function readDirSync(path, moduleName) {
  // 缓存模块对象
  const module = { moduleID: '', moduleHTML: '', moduleJS: '' };
  // 获取当前模块ID
  let moduleID = path.replace(`${MODULE_ROOT_PATH}/`, '');
  if (path == MODULE_ROOT_PATH) {
    moduleID = '';
  }
  module.moduleID = moduleID;
  // 获取目录下所有文件及文件夹
  const pa = fs.readdirSync(path);
  pa.forEach((ele) => {
    const info = fs.statSync(`${path}/${ele}`);
    if (info.isDirectory()) {
      readDirSync(`${path}/${ele}`, ele);
    } else {
      // 判断当前模块的html是否存在
      if (`${moduleName}.html` == ele || ele == 'index.html') {
        module.moduleHTML = `${path}/${ele}`;
      }
      // 判断当前模块的js是否存在
      if (`${moduleName}.js` == ele || ele == 'main.js') {
        module.moduleJS = `${path}/${ele}`;
      }
    }
  });
  // 判断模块是否真实(可能只是个分级目录)
  if ((module.moduleID != '' && module.moduleHTML != '') || (module.moduleID != '' && module.moduleJS != '')) {
    moduleList.push(module);
  }
}
