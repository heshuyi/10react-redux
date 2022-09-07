const fetch = require('node-fetch');// fetch polyfill


module.exports.request = ({ url, method = 'GET', params }) => {
  let opt = {
    method,
  };
  if (params) {
    opt = {
      ...opt,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    };
  }

  return fetch(url, opt).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.status);
    }
    return response.json();
  });
};


/**
 * method：方法别名；
 * params：参数列表数组；
 * secure：安全属性,默认为 true (AjaxSecureUnlockHandler.aspx);
 * success:成功回调；
 * error:失败回调；
 *
 * 调用方式：
 * //以提交数据为 FromData 为例
 * ajaxMethod({
 *  method: 'HELP_GetLongTime',
    params: [123],
    secure: true,
    success: function (data) {
        //...
    },
    error:function(err){
        //...
    }
 * })
 */
const wsid = '';
const ajaxSecureUrl = `http://10.200.2.8//WindEIP/IML/AjaxHandlerForIml.aspx${wsid}`;// /DataReport/AjaxSecureUnlockHandler.aspx
const ajaxUrl = `http://10.200.2.8//WindEIP/IML/AjaxHandlerForIml.aspx${wsid}`;// /DataReport/AjaxHandler.aspx

module.exports.ajaxMethod = ({ method, params, secure = true }) => {
  // const formData = new FormData();
  const dataParameter = { MethodAlias: method, Parameter: params };
  // console.log('ajaxMethod',encodeURIComponent(JSON.stringify(dataParameter)));
  // formData.append('data', JSON.stringify(dataParameter));
  const checkStatus = (response) => {
    // console.log('ajaxMethod',response);
    if (response.ok) {
      return response.json();
    }
    // console.error('ajaxMethod response is not ok:', response);
    return Promise.reject(response);
  };
  return fetch(secure ? ajaxSecureUrl : ajaxUrl, {// 这里根据实际项目完善路径
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
    method: 'POST',
    body: 'data='+encodeURIComponent(JSON.stringify(dataParameter)),
  }).then(checkStatus).then((result) => {
    if (result.State === 0) {
      return result;
    }

    // console.error('ajaxMethod state 不为 0:', result);
    return Promise.reject(result);
  });
};
