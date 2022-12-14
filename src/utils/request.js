import 'whatwg-fetch'; // 解决fetch兼容性问题
import intl from './intl';

export const request = ({ url, method = 'GET', params }) => {
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

// 这里根据实际项目完善路径
const ajaxSecureUrl = '/BuName/AjaxSecureUnlockHandler.aspx';
const ajaxUrl = '/BuName/AjaxHandler.aspx';

export const ajaxMethod = ({ method, params, secure = true }) => {
  const dataParameter = { MethodAlias: method, Parameter: params };
  let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (intl.options.currentLocale) {
    headers['wind-language'] = intl.options.currentLocale;
  }
  const checkStatus = (response) => {
    if (response.ok) {
      return response.json();
    }
    const error1 = new Error(response.status);
    error1.response = response;
    throw error1;
  };
  return fetch(secure ? ajaxSecureUrl : ajaxUrl, {
    headers,
    method: 'POST',
    body: `data=${encodeURIComponent(JSON.stringify(dataParameter))}`,
    credentials: 'include',
  }).then(checkStatus).then((result) => {
    if (result.State === 0) {
      return result;
    }
    // 可以做统一错误处理
    const error2 = new Error(result.ErrorMessage);
    error2.ResponseInfo = result;
    throw error2;
  }).catch(err => Promise.reject(err));
};
