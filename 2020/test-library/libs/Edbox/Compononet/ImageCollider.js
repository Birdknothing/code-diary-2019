// Edbox 图片包围盒
(function (namespace, className) {
    /**
     * Edbox 图片包围盒
     * @author 余晓(871129)
     * @see 
     * */
     
    var canvas = null;
    
    var module = {
        /**
         * 获取线性Colider顶点列表
         * @param {string} url 图片地址
         * @param {int} width 图片宽度
         * @param {int} height 图片高度
         * @param {int} count 精细度，越大越精细， 为0时默认30 
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
         */
        GetChainColiderPoints: function (url, width, height, count, success, error) {
            if(!url || url === '' || width <= 0 || height <= 0){
                if(error)error('参数有误');
                return;
            }
            
            if(!count || count <= 0){
                count = 50;
            }
            
            //width：图片宽度，count: 网格数量， sw：每个网格的宽度
            var sw = width/count;
            //width：图片高度，count: 网格数量， sw：每个网格的高度
            var sh = height/count;
            
            if(sw === 0 || sh === 0){
                if(error)error('参数有误');
                return;
            }
            
            //获取两点之间的距离
            function getDist(p1, p2){
                var dx=p1.x-p2.x;
                var dy=p1.y-p2.y;
                return Math.sqrt(dx*dx+dy*dy);
            }
            
            //对数组进行排序
            function sort(arr){
                for(var j=0;j<arr.length-1;j++){
                //两两比较，如果前一个比后一个大，则交换位置。
                   for(var i=0;i<arr.length-1-j;i++){
                        if(arr[i]>arr[i+1]){
                            var temp = arr[i];
                            arr[i] = arr[i+1];
                            arr[i+1] = temp;
                        }
                    } 
                }
            }
            
            function contact(xPointMap, xArray, index, tempPoints){
                var array = xPointMap.Get(xArray[index]);
                if(array){
                    for (var i = 0; i < array.length; i++) {
                        tempPoints.push(array[i]);
                    }
                }
            }
            
            /**
             * 创建线性顶点的递归方法， 基于prevPoint查找下一个距离最近的顶点
             * @param {Array} xArray 当前需要计算的顶点的x数据集合， 由小到大进行排序
             * @param {Map} xPointMap 所有需要计算的顶点的字典集合， key为顶点的x, value为顶点数据
             * @param {int} sNum 当前计算的x位置
             * @param {Object} prevPoint 前一个被加入线性队列的顶点
             * @param {Array} nPoints 线性顶点的数组集合
             */
            function buildPoint(xArray, xPointMap, sNum, prevPoint, nPoints){
                //将上一个符合条件的顶点加入线性顶点队列
                nPoints.push(prevPoint);
                
                //将上一个符合条件的顶点移除出xPointMap集合对象
                var ps = xPointMap.Get(prevPoint.x);
                var nps = new Array();
                for (var i = 0; i < ps.length; i++) {
                    if(ps[i].x === prevPoint.x && ps[i].y === prevPoint.y){
                        continue;
                    }
                    nps.push(ps[i]);
                }
                xPointMap.Set(prevPoint.x, nps);
                
                //以上一个顶点所在x轴为准线，查找x-1、x和x+1三条线上的顶点组合，如果顶点数量为空，则表示完成查找，退出递归
                var tempPoints = new Array();
                contact(xPointMap, xArray, sNum, tempPoints);
                contact(xPointMap, xArray, sNum - 1, tempPoints);
                contact(xPointMap, xArray, sNum - 2, tempPoints);
                contact(xPointMap, xArray, sNum - 3, tempPoints);
                contact(xPointMap, xArray, sNum + 1, tempPoints);
                contact(xPointMap, xArray, sNum + 2, tempPoints);
                contact(xPointMap, xArray, sNum + 3, tempPoints);
                
                if(tempPoints.length === 0){
                    return;
                }
                
                //以上一个顶点所在x轴为准线，查找x-1、x和x+1三条线上的顶点组合中与上一个顶点距离最近的顶点，将此顶点加入队列， 并设置为上一个顶点，递归执行buildPoint方法
                var minDist = 9999999;
                var recentPoint = tempPoints[0];
                for (var i = 0; i < tempPoints.length; i++) {
                    var p = tempPoints[i];
                    if(p.x === prevPoint.x && p.y === prevPoint.y){
                        continue;
                    }
                    
                    var dist = getDist(p, prevPoint);
                    // console.log("x : " + p.x + ", y : " + p.y + ", dist : " + dist)
                    if(dist < minDist){
                        minDist = dist;
                        recentPoint = p;
                    }
                }
                
                sNum = xArray.indexOf(recentPoint.x);
                buildPoint(xArray, xPointMap, sNum, recentPoint, nPoints);
            }
            
            //加载图片
            var img = new Image();
            img.setAttribute('crossorigin', 'anonymous');
            img.onload = function () {
                //将加载后的图片描绘到画布上
                if(!canvas){
                    canvas = document.createElement("canvas");
                }
                canvas.setAttribute("width",width);
                canvas.setAttribute("height",height);
                var context = canvas.getContext("2d");
                context.drawImage(this, 0, 0, width, height);
                //xPointMap：Map类型，边缘顶点集合，key为顶点的x值，value为顶点
                var xPointMap = new Dictionary();
                //xArray：Array类型，所有顶点的x值数组集合（无重复），从小到大排序
                var xArray = new Array();
                //从左到右进行扫描， 取出图片的左右边缘顶点
                for (var i = 0; i < count + 1; i++) {
                    var isFirst = true;
                    for (var j = 0; j < count + 1; j++) {
                        var pointY = sh*i;
                        var pointX = sw*j;
                        var imageData = context.getImageData(pointX, pointY, 1, 1);
                        //图片像素颜色值
                        var pixel = imageData.data;
                        //图片顶点颜色的透明度是否大于0，只有大于0的才会被进行计算
                        if(pixel[3] > 0){
                            
                            //isNextEmpty: 如果下一个顶点是透明顶点且当前顶点非透明，则当前顶点为边缘顶点，需要加入计算队列
                            var isNextEmpty = false;
                            if(j < count){
                                var nPointX = sw*(j+1);
                                var nImageData = context.getImageData(nPointX, pointY, 1, 1);
                                var nPixel = nImageData.data;
                                if(nPixel[3] === 0){
                                    isNextEmpty = true;
                                }
                            }
                            if(i=== 0 || i === count || j === count || isFirst || isNextEmpty){
                                isFirst = false;
                                
                                var point = new Object();
                                point.x = pointX;
                                point.y = pointY;
                                if (!xPointMap.ContainsKey(pointX)) {
                                    var points = new Array();
                                    points.push(point);
                                    xPointMap.Set(pointX, points);
                                    xArray.push(pointX);
                                }else{
                                    var points = xPointMap.Get(pointX);
                                    points.push(point);
                                }
                            }
                        }else{
                            //如果透明度等于0， 则下一个非透明顶点则为边缘顶点，需要加入计算队列
                            isFirst = true;
                        }
                    }
                }
                
                //从上到下进行扫描， 取出图片的上下边缘顶点， 并剔除与上一步的重复顶点
                for (var i = 0; i < count + 1; i++) {
                    var isFirst = true;
                    for (var j = 0; j < count + 1; j++) {
                        var pointX = sw*i;
                        var pointY = sh*j;
                        var imageData = context.getImageData(pointX, pointY, 1, 1);
                        var pixel = imageData.data;
                        if(pixel[3] > 0){
                            var isNextEmpty = false;
                            if(j < count){
                                var nPointY = sh*(j+1);
                                var nImageData = context.getImageData(pointX, nPointY, 1, 1);
                                var nPixel = nImageData.data;
                                if(nPixel[3] === 0){
                                    isNextEmpty = true;
                                }
                            }
                            if(i=== 0 || i === count || j === count || isFirst || isNextEmpty){
                                isFirst = false;
                                var point = new Object();
                                point.x = pointX;
                                point.y = pointY;
                                if (!xPointMap.ContainsKey(pointX)) {
                                    var points = new Array();
                                    points.push(point);
                                    xPointMap.Set(pointX, points);
                                    xArray.push(pointX);
                                }else{
                                    var points = xPointMap.Get(pointX);
                                    var isExist = false;
                                    for (var k = 0; k < points.length; k++) {
                                        if(points[k].x === pointX && points[k].y === pointY){
                                            isExist = true;
                                            continue;
                                        }
                                    }
                                    if(!isExist){
                                        points.push(point);
                                    }
                                }
                            }
                        }else{
                            isFirst = true;
                        }
                    }
                }
                
                sort(xArray);
                
                var nPoints = new Array();
                
                var sNum = 0;
                var sPoints = xPointMap.Get(xArray[sNum]);
                if(sPoints && sPoints.length > 0){
                    var prevPoint = sPoints[0];
                    buildPoint(xArray, xPointMap, sNum, prevPoint, nPoints);
                }
                
                if(success)success(nPoints);
            };
            img.src = url;
        },
        
        /**
         * 获取多边形Colider顶点列表
         * @param {string} url 图片地址
         * @param {int} width 图片宽度
         * @param {int} height 图片高度
         * @param {int} count 精细度，越大越精细， 为0时默认30 
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
         */
        GetPolygonColiderPoints: function (url, width, height, count, success, error) {
            if(!url || url === '' || width <= 0 || height <= 0){
                if(error)error('参数有误');
                return;
            }
            
            if(!count || count <= 0){
                count = 50;
            }
            
            //width：图片宽度，count: 网格数量， sw：每个网格的宽度
            var sw = width/count;
            sw = Math.floor(sw * 1000) / 1000;
            //width：图片高度，count: 网格数量， sw：每个网格的高度
            var sh = height/count;
            sh = Math.floor(sh * 1000) / 1000;
            
            if(sw === 0 || sh === 0){
                if(error)error('参数有误');
                return;
            }
            
            //对数组进行排序
            function sort(arr){
                for(var j=0;j<arr.length-1;j++){
                //两两比较，如果前一个比后一个大，则交换位置。
                   for(var i=0;i<arr.length-1-j;i++){
                        if(arr[i]>arr[i+1]){
                            var temp = arr[i];
                            arr[i] = arr[i+1];
                            arr[i+1] = temp;
                        }
                    } 
                }
            }
            
            //对数组进行排序
            function sortByX(arr){
                for(var j=0;j<arr.length-1;j++){
                //两两比较，如果前一个比后一个大，则交换位置。
                   for(var i=0;i<arr.length-1-j;i++){
                        if(arr[i].x>arr[i+1].x){
                            var temp = arr[i];
                            arr[i] = arr[i+1];
                            arr[i+1] = temp;
                        }
                    }
                }
            }
            
            function filterPoints(yArray, yPointMap){
                sort(yArray);
                var removeKeys = new Array();
                for (var i = 1; i < yArray.length - 1; i++) {
                    var key = yArray[i];
                    var points = yPointMap.Get(key);
                    //若为对称节点则保留，剔除非对称节点
                    if(points.length%2 === 0){
                        var prevKey = yArray[i - 1];
                        var nextKey = yArray[i + 1];
                        if(yPointMap.ContainsKey(prevKey) && yPointMap.ContainsKey(nextKey)){
                            //获取上一行顶点数据
                            var prevPoints = yPointMap.Get(prevKey);
                            //获取下一行顶点数据
                            var nextPoints = yPointMap.Get(nextKey);
                            if(prevPoints.length === nextPoints.length && points.length === nextPoints.length){
                                var isSameScale = false;
                                for(var j = 0; j < points.length; j++){
                                    //同一行，每两个节点进行比对计算
                                    if(j%2 === 0){
                                        //如果为反角类型则保留，计算同行下一对节点
                                        //反角
                                        // .    .   或者       .  .
                                        //  .  .             .     .
                                        // .    .              .  .
                                        var d1 = nextPoints[j].x - points[j].x;
                                        var d2 = points[j].x - prevPoints[j].x;
                                        var d3 = nextPoints[j+1].x - points[j+1].x;
                                        var d4 = points[j+1].x - prevPoints[j+1].x;
                                        if((d2 > 0 && d3 > 0 && d1 <= 0 && d4 <= 0) || (d2 < 0 && d3 < 0 && d1 >=0 && d4 >=0)){
                                            continue;
                                        }
                                        var k1 = d1 - d2;
                                        var k2 = d3 - d4;
                                        //剔除垂直平行节点
                                        if(d1 === 0 && d2 === 0 && d3 === 0 && d4 === 0){
                                            isSameScale = true;
                                            break;
                                        }
                                        
                                        //如果角度比较小，也需要剔除
                                        if(((d1*d2>0 && d3*d4>0) || (d1*d2<=0 && d3*d4<=0)) && Math.abs(k1) <= 0.5*sw && Math.abs(k2) <= 0.5*sw){
                                            isSameScale = true;
                                            break;
                                        }else{
                                            continue;
                                        }
                                    }
                                }
                                
                                if(isSameScale){
                                    removeKeys.push(key);
                                }
                            }else{
                                
                            }
                        }
                    }else{
                        //剔除非对称节点
                        removeKeys.push(key);
                    }
                }
                
                //剔除边缘节点中角度变化较小的节点
                for (var i = 0; i < removeKeys.length; i++) {
                    yPointMap.Remove(removeKeys[i]);
                }
            }
            
            function searchMatch(yArray, yPointMap, points, j, begin, index, resultArray, gPoints){
                if(index > 3){
                    return;
                }
                var tkey = yArray[begin + index];
                if(tkey){
                    var nPoints = yPointMap.Get(tkey);
                    if(nPoints){
                        var isGet = false;
                        var min = nPoints.length - 1;
                        var max = 0;
                        var minStop = false;
                        var maxStop = false;
                        for(var k = 0; k < nPoints.length - 1; k++){
                            var isUsed = false;
                            for(var m = 0; m < gPoints.length; m++){
                                if(gPoints[m].x === nPoints[k].x && gPoints[m].y === nPoints[k].y){
                                    isUsed = true;
                                    break;
                                }
                            }
                            
                            if(isUsed){
                                continue;
                            }
                            
                            if(points[j].x < nPoints[k + 1].x && points[j + 1].x > nPoints[k].x){
                                if(min > k && !minStop){
                                    min = k;
                                }
                                if(max < k + 1 && !maxStop){
                                    max = k + 1;
                                }
                                
                                if(min != max){
                                    isGet = true;
                                }else{
                                    isGet = false;
                                }
                                
                                if(points[j].x >= nPoints[k].x){
                                    minStop = true;
                                }
                                
                                if(points[j + 1].x <= nPoints[k + 1].x){
                                    maxStop = true;
                                }
                            }
                        }
                        
                        if(!isGet){
                            searchMatch(yArray, yPointMap, points, j, begin, index + 1, resultArray, gPoints);
                        }else{
                            if(isGet){
                                var polygon = new Array;
                                polygon.push(points[j]);
                                polygon.push(points[j + 1]);
                                polygon.push(nPoints[min]);
                                polygon.push(nPoints[max]);
                                gPoints.push(nPoints[min]);
                                gPoints.push(nPoints[max]);
                                resultArray.push(polygon);
                            }
                        }
                    }
                }
            }
            
            //加载图片
            var img = new Image();
            img.setAttribute('crossorigin', 'anonymous');
            img.onload = function () {
                //将加载后的图片描绘到画布上
                if(!canvas){
                    canvas = document.createElement("canvas");
                }
                canvas.setAttribute("width",width);
                canvas.setAttribute("height",height);
                var context = canvas.getContext("2d");
                context.drawImage(this, 0, 0, width, height);
                //yPointMap：Map类型，边缘顶点集合，key为顶点的y值，value为顶点
                var yPointMap = new Dictionary();
                //yArray：Array类型，所有顶点的y值数组集合（无重复），从小到大排序
                var yArray = new Array();
                //从左到右进行扫描， 取出图片的左右边缘顶点
                for (var i = 0; i < count + 1; i++) {
                    var isFirst = true;
                    for (var j = 0; j < count + 1; j++) {
                        var pointY = Math.floor(sh*i * 1000) / 1000;
                        var pointX = Math.floor(sw*j * 1000) / 1000;
                        var imageData = context.getImageData(pointX, pointY, 1, 1);
                        //图片像素颜色值
                        var pixel = imageData.data;
                        //图片顶点颜色的透明度是否大于0，只有大于0的才会被进行计算
                        if(pixel[3] > 0){
                            //isNextEmpty: 如果下一个顶点是透明顶点且当前顶点非透明，则当前顶点为边缘顶点，需要加入计算队列
                            var isNextEmpty = false;
                            if(j < count){
                                var nPointX = sw*(j+1);
                                var nImageData = context.getImageData(nPointX, pointY, 1, 1);
                                var nPixel = nImageData.data;
                                if(nPixel[3] === 0){
                                    isNextEmpty = true;
                                }
                            }
                            
                            if(i=== 0 || i === count || j === count || isFirst || isNextEmpty){
                                isFirst = false;
                                
                                var point = new Object();
                                point.x = pointX;
                                point.y = pointY;
                                // c1.strokeRect(pointX, pointY, 1, 1);
                                if (!yPointMap.ContainsKey(pointY)) {
                                    var pArray = new Array();
                                    pArray.push(point);
                                    yPointMap.Set(point.y, pArray);
                                    yArray.push(point.y);
                                }else{
                                    var pArray = yPointMap.Get(point.y);
                                    pArray.push(point);
                                    sortByX(pArray);
                                    yPointMap.Set(point.y, pArray);
                                }
                            }
                        }else{
                            //如果透明度等于0， 则下一个非透明顶点则为边缘顶点，需要加入计算队列
                            isFirst = true;
                        }
                    }
                }
                
                var removeKeys = new Array();
                
                //剔除边缘节点中角度变化较小的节点
                filterPoints(yArray, yPointMap);
                
                //重新搜集边缘节点数据
                var yArray = new Array();
                for (var i = 0; i < yPointMap.Keys.length; i++) {
                    var key = yPointMap.Keys[i];
                    yArray.push(key);
                }
                
                //再次剔除边缘节点中角度变化较小的节点
                filterPoints(yArray, yPointMap);
                
                for (var i = 0; i < removeKeys.length; i++) {
                    yPointMap.Remove(removeKeys[i]);
                }
                
                var yArray = new Array();
                for (var i = 0; i < yPointMap.Keys.length; i++) {
                    var key = yPointMap.Keys[i];
                    yArray.push(key);
                }
                
                sort(yArray);
                for (var i = 1; i < yArray.length - 1; i++) {
                    var points = yPointMap.Get(yArray[i]);
                    var nextPoints = yPointMap.Get(yArray[i + 1]);
                    //对上下行都有大量边缘节点的数据进行特殊处理
                    if(points.length >= 4 && nextPoints.length >= 4 && points.length%2 === 0&& nextPoints.length%2 === 0){
                        var p1 = points[points.length/2 - 1];
                        var p2 = points[points.length/2];
                        for(var j = 0; j < nextPoints.length - 1; j++){
                            var p3 = nextPoints[j];
                            var p4 = nextPoints[j + 1];
                            if(!p1 || !p2 || !p3 || !p4){
                                var a = '';
                            }
                            if(Math.abs(p1.x - p3.x) < 2*sw && Math.abs(p4.x - p2.x) < 2*sw){
                                var ps = new Array();
                                for (var k = 0; k < points.length; k++) {
                                    if(k != points.length/2 - 1 && k != points.length/2){
                                        ps.push(points[k]);
                                    }
                                }
                                var nps = new Array();
                                for (var k = 0; k < nextPoints.length; k++) {
                                    if(k != j && k != j + 1){
                                        nps.push(nextPoints[k]);
                                    }
                                }
                                yPointMap.Set(yArray[i], ps);
                                yPointMap.Set(yArray[i + 1], nps);
                                break;
                            }
                        }
                    }
                }
                
                for (var i = 0; i < yArray.length; i++) {
                    var points = yPointMap.Get(yArray[i]);
                    if(points.length === 3){
                        points.splice(1,1);
                        yPointMap.Set(yArray[i], points);
                    }
                }
                
                //将顶点数据，转为多边形数据
                var resultArray = new Array;
                var sNum = 0;
                var testArray = new Array;
                for (var i = 0; i < yArray.length - 1; i++) {
                    var key = yArray[i];
                    var points = yPointMap.Get(key);
                    var nkey = yArray[i + 1];
                    var nPoints = yPointMap.Get(nkey);
                    //如果当前行只有两个顶点， 则取下一行的最大值与最小值组成多边形
                    if(points.length === 2){
                        testArray.push(points[0]);
                        testArray.push(points[1]);
                        if(points[0].x <= nPoints[nPoints.length - 1].x){
                            var polygon = new Array;
                            polygon.push(points[0]);
                            polygon.push(points[1]);
                            polygon.push(nPoints[0]);
                            polygon.push(nPoints[nPoints.length - 1]);
                            resultArray.push(polygon);
                        }
                    }else if(points.length > 2){
                        //如果当前行有4个顶点，下一行只有两个顶点，则取最接近的4个顶点组成多边形
                        if(points.length === 4 && nPoints.length === 2){
                            var min = points.length - 1;
                            var max = 0;
                            var isGet = false;
                            var minStop = false;
                            var maxStop = false;
                            for(var j = 0; j < points.length - 1; j ++ ){
                                testArray.push(points[j]);
                                if(points[j].x < nPoints[1].x && points[j + 1].x > nPoints[0].x){
                                    if(min > j && !minStop){
                                        min = j;
                                    }
                                    if(max < j + 1 && !maxStop){
                                        max = j + 1;
                                    }
                                    
                                    if(min != max){
                                        isGet = true;
                                    }else{
                                        isGet = false;
                                    }
                                    
                                    if(points[j].x <= nPoints[0].x){
                                        minStop = true;
                                    }
                                    
                                    if(points[j + 1].x >= nPoints[1].x){
                                        maxStop = true;
                                    }
                                }
                            }
                            
                            if(isGet){
                                var polygon = new Array;
                                polygon.push(points[min]);
                                polygon.push(points[max]);
                                polygon.push(nPoints[0]);
                                polygon.push(nPoints[1]);
                                resultArray.push(polygon);
                                continue;
                            }
                        }
                        var gPoints = new Array;
                        for(var j = 0; j < points.length; j ++ ){
                            if(j % 2 == 0 && j + 1 <= points.length - 1){
                                searchMatch(yArray, yPointMap, points, j, i, 1,resultArray, gPoints);
                            }
                        }
                    }
                }
                
                if(success)success(resultArray, this);
            };
            img.src = url;
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "ImageCollider"));