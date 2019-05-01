function y(x) {
  return x > this.age
}
const m = {age:2}
const arr = [1,2,3]
console.log(arr.find(y,m))
console.log(arr.entries())
const n = arr.entries()
console.log(n.next().value)
console.log(n.next().value)
console.log(n.next().value)
function getlocation() {
  var u = navigator.userAgent;
  var ua = navigator.userAgent.toLowerCase();
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端





  //GPS定位

  function locationForGPS() {

  /*********跟踪标记**********/   console.log('GPS定位开始+++');

      var map, geolocation;

      //加载地图，调用浏览器定位服务

      map = new AMap.Map('iCenter');

      map.plugin('AMap.Geolocation', function() {

          geolocation = new AMap.Geolocation({

              enableHighAccuracy: false,//是否使用高精度定位，默认:true

              timeout: 10000,          //超过10秒后停止定位，默认：无穷大

          });

          map.addControl(geolocation);

          geolocation.getCurrentPosition();

           

          //getCityInfo是高德GPS定位里面的一个方法，先返回ip定位数据，由于IP定位有可能不准确，所以后面用GPS数据修正

          //

          geolocation.getCityInfo(function(status,result){

          /*********跟踪标记**********/    console.log('与GPS同步IP定位开始，进行数据写入+++');

              if (status === 'complete' && result.info === 'SUCCESS') {

          /*********跟踪标记**********/    console.log('同步IP定位成功，进行数据写入+++');

                  if(isNull(sessionStorage.getItem('autouserchooselocationct'))){

                      /*********跟踪标记**********/     console.log('未检测检查有上一次定位数据，进行数据写入+++');

                      let cityAdcode=result.adcode;

                      let cityName=result.city;

                       

                      sessionStorage.setItem('autouserchooselocationct', cityName);

                      sessionStorage.setItem('autouserchooselocationcode', cityAdcode);



                  

                       /*********跟踪标记**********/    console.log('同步IP定位结束，进行数据写入完成+++');

                  }

              }

          });





          AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息

          AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息









      });



      //GPS定位成功

      function onComplete(data) {

          console.log(data)

           /*********跟踪标记**********/  console.log('GPS定位启动+++');

           //gsp定位精确到区，返回的adcode精确到了城市下属的区域，

           //想要获取城市的abcode还需要使用高德的另一个API，城市区域查询

          

          let cityName=data.addressComponent.city;



          let geocoder = new AMap.Geocoder({});

          //地理编码,返回地理编码结果，

           

          geocoder.getLocation(cityName, function(status, result) {

              if (status === 'complete' && result.info === 'OK') {

              /*********跟踪标记**********/       console.log('GPS定位成功，处理定位数据+++');



              /*********跟踪标记**********/     console.log('进行数据写入，覆盖同步IP的数据+++');

                      let cityAdcode=result.geocodes[0].adcode;

                      sessionStorage.setItem('autouserchooselocationct', cityName);

                      sessionStorage.setItem('autouserchooselocationcode', cityAdcode);

            

                     /*********跟踪标记**********/    console.log('GPS定位结束，进行数据写入完成+++');

                  }





          });



      }



      //GPS定位失败

      function onError() {

          /*********跟踪标记**********/ console.log('GPS定位失败开始启用ip定位+++');

          locationForIp(true);

           /*********跟踪标记**********/  console.log('gps-ip++...')

      }



  }



  //IP定位

  function locationForIp(tap) {

       /*********跟踪标记**********/if(tap){ console.log('GPS定位失败开始启用ip定位+++');}

           /*********跟踪标记**********/ console.log('ip定位开始+++');

      var citysearch = new AMap.CitySearch();

      //自动获取用户IP，返回当前城市

      citysearch.getLocalCity(function (status, result) {

          if (status === 'complete' && result.info === 'OK') {

              if (result && result.city && result.bounds) {

                  let GetUserLocation = result.city,

                      GetUserLocationcode = result.adcode;

                      /*********跟踪标记**********/console.log('ip定位成功，开始检查是否有上一次定位数据+++');

                  if(isNull(sessionStorage.getItem('autouserchooselocationct'))){

                   /*********跟踪标记**********/console.log('ip定位成功，未检测检查有上一次定位数据，进行数据写入+++');

                      sessionStorage.setItem('autouserchooselocationct', GetUserLocation);

                      sessionStorage.setItem('autouserchooselocationcode', GetUserLocationcode);



            

                   /*********跟踪标记**********/console.log('ip定位成功，进行数据写入结束+++');

                  }

              }

          } else {



          

       /*********跟踪标记**********/console.log('ip定位失败，进行数据写入结束+++');

          }



      })



  }



  if(isiOS){

      /*********跟踪标记**********/console.log('ios设备启用IP定位');

      locationForIp(false);



  }else {

      /*********跟踪标记**********/console.log('非ios设备启用GPS定位');

      locationForGPS()

  }



}





}