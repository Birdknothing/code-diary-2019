//get file list data
var data=require("system-core:context/context.js").instanceForSystem.getList().listView.listsData;
//calculate sign
function base64Encode(r){var t,e,a,c,n,o,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(a=r.length,e=0,t="";a>e;){if(c=255&r.charCodeAt(e++),e==a){t+=h.charAt(c>>2),t+=h.charAt((3&c)<<4),t+="==";break}if(n=r.charCodeAt(e++),e==a){t+=h.charAt(c>>2),t+=h.charAt((3&c)<<4|(240&n)>>4),t+=h.charAt((15&n)<<2),t+="=";break}o=r.charCodeAt(e++),t+=h.charAt(c>>2),t+=h.charAt((3&c)<<4|(240&n)>>4),t+=h.charAt((15&n)<<2|(192&o)>>6),t+=h.charAt(63&o)}return t}
function u(j,r){var a=[];var p=[];var o="";var v=j.length;for(var q=0;q<256;q++){a[q]=j.substr((q%v),1).charCodeAt(0);p[q]=q}for(var u=q=0;q<256;q++){u=(u+p[q]+a[q])%256;var t=p[q];p[q]=p[u];p[u]=t}for(var i=u=q=0;q<r.length;q++){i=(i+1)%256;u=(u+p[i])%256;var t=p[i];p[i]=p[u];p[u]=t;k=p[((p[i]+p[u])%256)];o+=String.fromCharCode(r.charCodeAt(q)^k)}return o}
var sign=base64Encode(u(yunData.sign5, yunData.sign1)).replace(/=/g,"%3D").replace(/\+/g,"%2B");
//downloader
function down(index){$.ajax({type:"GET",url:"/api/download?sign="+sign+"×tamp="+yunData.timestamp+"&fidlist=%5B"+data[1].fs_id+"%5D",success:function(d){console.warn(d.dlink
[index-1].dlink);}});}