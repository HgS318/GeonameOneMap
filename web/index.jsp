<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/7/23 0023
  Time: 12:11
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head>
    <title>$Title$</title>
    </head>
    <body>
    $END$
    </body>

    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>折线、多边形、圆</title>
    <link rel="stylesheet" href="http://cache.amap.com/lbs/static/main1119.css"/>
    <script src="http://webapi.amap.com/maps?v=1.3&key=8325164e247e15eea68b59e89200988b"></script>
    <script type="text/javascript" src="http://cache.amap.com/lbs/static/addToolbar.js"></script>
    </head>
    <body>
    <div id="container"></div>
    <script>
        var map = new AMap.Map('container', {
          resizeEnable: true,
        //      center: [116.397428, 39.90923],
          center: [109.480907, 30.334029],
          zoom: 13
        });
        var lineArr = [
            [116.368904, 39.913423],
            [116.382122, 39.901176],
            [116.387271, 39.912501],
            [116.398258, 39.904600]
        ];
        var polyline = new AMap.Polyline({
            path: lineArr,          //设置线覆盖物路径
            strokeColor: "#3366FF", //线颜色
            strokeOpacity: 1,       //线透明度
            strokeWeight: 5,        //线宽
            strokeStyle: "solid",   //线样式
            strokeDasharray: [10, 5] //补充线样式
        });
        polyline.setMap(map);

        var polygonArr = new Array();//多边形覆盖物节点坐标数组
        //    polygonArr.push([116.403322, 39.920255]);
        //    polygonArr.push([116.410703, 39.897555]);
        //    polygonArr.push([116.402292, 39.892353]);
        //    polygonArr.push([116.389846, 39.891365]);
        polygonArr.push([109.480886, 30.334992]);
        polygonArr.push([109.480907, 30.334029]);
        polygonArr.push([109.480457, 30.331213]);
        polygonArr.push([109.481015, 30.32662]);
        var  polygon = new AMap.Polygon({
            path: polygonArr,//设置多边形边界路径
            strokeColor: "#FF33FF", //线颜色
            strokeOpacity: 0.2, //线透明度
            strokeWeight: 3,    //线宽
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.35//填充透明度
        });
        polygon.setMap(map);

        var circle = new AMap.Circle({
            center: new AMap.LngLat("116.403322", "39.920255"),// 圆心位置
            radius: 1000, //半径
            strokeColor: "#F33", //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 3, //线粗细度
            fillColor: "#ee2200", //填充颜色
            fillOpacity: 0.35//填充透明度
        });
        circle.setMap(map);
    </script>
    </body>


</html>
