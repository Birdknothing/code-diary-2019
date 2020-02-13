/**
 * config 中的proxy是必须参数为要代理的域名或ip，其余参数自定
 * get，post方法返回一个promise对象
 * new Proxy({proxy:'192.168.7.198:3000',param1:1,param2:2}).post('/api/abc).then(data=>{})
 */
class Proxy {
  constructor(config){
    if(typeof config !== 'object' || !('proxy' in config)) {
      console.error('not an object including proxy address!')
      return
    }
    this.data = this.formify(config)
  }
  formify(obj){
    const param = []
    for(let [key,value] of Object.entries(obj))
    param.push(key+'='+value);
    return param.join('&')
  }
  request(url,method,data,cb) {
    const xhr = new XMLHttpRequest()
    xhr.open(method,url)
    xhr.onreadystatechange=function(){
      if(xhr.readyState === 4 && xhr.status === 200){
        const type = xhr.getResponseHeader('Content-Type')
          cb(type.indexOf('xml') !== -1 ? xhr.responseXML : type === "application/json" ? JSON.parse(xhr.responseText) : xhr.responseText)
      }
      if(xhr.status !== 200) {
        throw new Error(xhr.statusText)
      }
    }
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    xhr.send(data)
  }
  get(url) {
    return new Promise((res,rej)=>{
      this.request(url+"?"+this.data,"GET",null,res)
   })
  }
  post(url) {
    return new Promise((res,rej)=>{
      this.request(url,"POST",this.data,res)
    })
  }
}
export {Proxy}