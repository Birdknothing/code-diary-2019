this.addEventListener("fetch", function(e) {
  console.log(e.request);
  
  e.respondWith(
    caches.match(e.request).then(function(res) {
      return (
        res || fetch(e.request).then(function(respon) {
          return caches.open("v1").then(function(cache) {
            cache.put(e.request, respon.clone());
            return respon;
          });
        })
      );
    })
  );
});

this.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open("v1").then(function(cache) {
      return cache.addAll(["1.css"]);
    })
  );
});
// 清除缓存
this.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v2'];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
