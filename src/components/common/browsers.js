// 移动端兼容

const exports = {
  deviceSize: '',
};

const winW = document.body.clientWidth;
if (winW < 590) {
  exports.deviceSize = 'screen-xs';
} else if (winW < 768) {
  exports.deviceSize = 'screen-sm';
} else if (winW < 1008) {
  exports.deviceSize = 'screen-md';
}
exports.deviceWidth = winW;

export default exports;
