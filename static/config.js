/* eslint-disable */

// Rest接口地址
window.localStorage.setItem('REST_BASE_URL', 'http://img.goalwisdom.net');
window.localStorage.setItem('SOCKET_URL', 'https://socket.goalwisdom.net');
window.localStorage.setItem('DOMAIN', 'http://kj.goalwisdom.net');

/*window.localStorage.setItem('REST_BASE_URL', 'http://img.bihuyihu.com');
window.localStorage.setItem('SOCKET_URL', 'https://socket.bihuyihu.com');*/

// 百度统计
var _hmt = _hmt || [];
(function () {
  if (location.host.toLowerCase().indexOf('bihuyihu.com') > -1) {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?a7df7a670556f34f8770c3300d64f206";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  }
})();
