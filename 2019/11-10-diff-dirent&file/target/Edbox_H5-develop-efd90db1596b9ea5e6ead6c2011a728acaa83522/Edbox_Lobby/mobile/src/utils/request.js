import fetch from 'dva/fetch';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    
    const error = new Error(response.statusText);
    error.name = response.status;
    error.response = response;
    // throw error;
}

export default async function request(url, options) {
    const defaultOptions = {
        credentials: 'include'
      };
      const newOptions = { ...defaultOptions, ...options };
      if (
        newOptions.method === 'POST' ||
        newOptions.method === 'PUT' ||
        newOptions.method === 'PATCH' ||
        newOptions.method === 'DELETE'
      ) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.headers
        };
      }
      newOptions.headers = {
        ...newOptions.headers
      };
    
      return fetch(url, newOptions)
      .then(response => {
        checkStatus(response);
        return response.json();
      })
      .then(data => {
        const ret = {
          data,
          headers: {}
        };
        return ret;
      }).catch(e => {
        console.log('接口错误：',e)
      });
}