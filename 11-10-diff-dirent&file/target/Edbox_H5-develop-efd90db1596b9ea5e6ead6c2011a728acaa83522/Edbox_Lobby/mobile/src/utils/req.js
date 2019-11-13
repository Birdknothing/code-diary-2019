/**
 * 函数promise化
 * @param {function} func 
 */
var promisify = (func) => {
  // 返回一个新的function
  return function(...args) {
      // 新方法返回的promise
      return new Promise((resolve, reject) => {
          func( 
            ...args, 
            function(data) {//成功回调
              resolve(data);
            },
            function(error){//失败回调
              reject(error);
            }
          );
      })
  };
};


/**
 * 同步获取接口数据
 * @param {function} func 获取接口的方法
 * @param {object} options 获取接口的参数
 */
export default async function request(func, options) {
  const promiseFun = promisify(func);
  return promiseFun(options)
  .then(data => {
    return data;
  }).catch(e => {
    return {data:{error: 'data error', content: e}};
  })

}