
var infoWindow, map, level = 13;
var markers = [];	//	所有地点标注，包括点、线
var showingMarkers = [];
var distPolygons = [];	//	所有行政区标注
var showingDists = [];
var boundPolylines = [];	//	所有界线标注
var showingBounds = [];
var boundMarkers = [];	//	所有界桩、界碑
var showingbms = [];
var mouseTool;
var placedata;
var showingPlaces;	//	所有当前显示的地名
var windata;		//	当前信息窗体中的地名数据
var orgdata, destdata;	//	信息窗体搜索框中起点，终点的地点数据
var navMethod = "trans";	//	信息窗体中上一次导航方式
var entered = false;	//	信息窗体搜索框是否键入过Enter
var infoWinDown;	//	信息窗体下部搜索框html

var distsInited = false;	//	地区是否已经初始化

var mousePos;



$(function() {

    $.ajax({
        url: 'wholeGeonames.action',
        type:'get',
        dataType: 'json',
        success:function(data){
            var places = data;
            AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
                map = new AMap.Map('mapContainer',{
                    resizeEnable: true,
                    center: [109.461756,30.285877],
                    zoom: level,
                    keyboardEnable :false,
                });
                map.on('complete', function(){
                    map.plugin(["AMap.ToolBar", "AMap.OverView", "AMap.Scale"], function(){
                        map.addControl(new AMap.ToolBar);
                        map.addControl(new AMap.OverView({isOpen: true}));
                        map.addControl(new AMap.Scale);
                        map.addControl(new BasicControl.LayerSwitcher({position: 'rt'}));
                    });
                });
                map.on('rightclick', function(e) {
                    // me.contextMenu.open(map, e.lnglat);
                    // me.contextMenuPositon = e.lnglat; //右键菜单位置
                    var pos = [e.lnglat.lng, e.lnglat.lat];
                    mousePos = pos;
                });
                mouseTool = new AMap.MouseTool(map);
                AMap.event.addListener( mouseTool,'draw',function(e){ //添加事件
                    $("#mapextentdone")[0].innerHTML = "已选择地图范围";
                    mouseTool.close(false);
                });
                placedata = places;
                showingPlaces = placedata;
                initmarkers();
                setAutoComplete();
                // map.setFitView();
                setRightMenu();
                initTrees();
                initBounds();
                initBoundMarkers();
            });

        },
        error:function(data){
            console.log(data);
        }
    })



});

function createDistPolygon(distjson, dists) {
    if(!distjson.path) {
        return;
    }
    distjson['overlay'] = "dist";
    var pathArr = JSON.parse(distjson.path);
    var polygon = new AMap.Polygon({
        zIndex: 40,
        extData: distjson,
        path: pathArr,//设置多边形边界路径
        strokeColor: "#FF44FF", //线颜色
        strokeOpacity: 0.3, //线透明度
        strokeWeight: 1.5,    //线宽
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.3//填充透明度
    });
    // AMap.event.addListener(polygon, "dblclick", distDbClick);
    AMap.event.addListener(polygon, "mouseover", overlayHighlight);
    AMap.event.addListener(polygon, "mouseout", overlayMouseOut);
    AMap.event.addListener(polygon, "click", overlayFeatureClick);
    // polygon.setMap(map);
    dists.push(polygon);
}

function distDbClick(e) {
    var distPolygon = e.target;
    // var nickname = distPolygon.getExtData()['nickname'];
    var id = distPolygon.getExtData()['id'];
    window.open("html/distEdit.html?id=" + id);
}

function boundDbClick(e) {
    var boundline = e.target;
    var id = boundline.getExtData()['Id'];
    window.open("html/boundEdit.html?id=" + id);
}

function bdmarkDbClick(e) {
    var boundMarker = e.target;
    // var nickname = distPolygon.getExtData()['nickname'];
    var id = boundMarker.getExtData()['Id'];
    window.open("html/boundMarkerEdit.html?id=" + id);
}

function showDists(distpolygons) {
    if(distPolygons != distpolygons) {
        for(var i = 0; i < distPolygons.length; i++) {
            var old = distPolygons[i];
            old.setMap(null);
        }
    }
    for(var i = 0; i < distpolygons.length; i++) {
        var polygon = distpolygons[i];
        polygon.setMap(map);
        polygon.show();
    }
    $("#toolbarDists")[0].checked = true;
    
}

function initBounds() {
    $.ajax({
        url: 'wholeEasyBounds.action',
        type:'get',
        dataType: 'json',
        success:function(bound_data){
            var boundArrayJson = bound_data;
            // initBounds(boundArrayJson);
            for(var i = 0; i < boundArrayJson.length; i++) {
                var boundjson = boundArrayJson[i];
                boundjson['selected'] = false;
                createBoundPolyline(boundjson, boundPolylines);
            }
            showingBounds = boundPolylines;
        },
        error:function(bound_data){
            console.log(bound_data);
        }
    });

    // showBounds(boundPolylines);
}

function createBoundPolyline(boundjson, bounds) {
    if(!boundjson.path) {
        return;
    }
    boundjson['overlay'] = "bound";
    var lineArr = JSON.parse(boundjson.path);
    var polyline = new AMap.Polyline({
        zIndex: 50,
        extData: boundjson,
        path: lineArr,//设置多边形边界路径
        strokeColor: "#FF33FF", //线颜色
        strokeOpacity: 0.9,       //线透明度
        strokeWeight: 3,        //线宽
        strokeStyle: "solid",   //线样式
        strokeDasharray: [10, 5] //补充线样式
    });
    // AMap.event.addListener(polyline, "dblclick", boundDbClick);
    AMap.event.addListener(polyline, "mouseover", overlayHighlight);
    AMap.event.addListener(polyline, "mouseout", overlayMouseOut);
    AMap.event.addListener(polyline, "click", overlayFeatureClick);
    // polyline.setMap(map);
    bounds.push(polyline);
}

function showBounds(boundPylylines) {
    if(boundPolylines != boundPylylines) {
        for(var i = 0; i < boundPolylines.length; i++) {
            var old = boundPolylines[i];
            old.setMap(null);
        }
    }
    for(var i = 0; i < boundPylylines.length; i++) {
        var polyline = boundPylylines[i];
        polyline.setMap(map);
        polyline.show();
    }

    $("#toolbarBounds")[0].checked = true;
}

function initBoundMarkers(bmArrayJson) {
    $.ajax({
        url: 'wholeEasyBoundMarkers.action',
        type:'get',
        dataType: 'json',
        success:function(bm_data){
            var bmArrayJson = bm_data;
            // initBoundMarkers(bmArrayJson);
            for(var i = 0; i < bmArrayJson.length; i++) {
                var bmjson = bmArrayJson[i];
                bmjson['selected'] = false;
                createBoundMarkers(bmjson, boundMarkers);
            }
            showingbms = boundMarkers;
        },
        error:function(bm_data){
            console.log(bm_data);
        }
    });

    // showBoundMarkers(boundMarkers);
}

function createBoundMarkers(bmjson, boundMarkers) {
    if(!bmjson.position) {
        return;
    }
    bmjson['overlay'] = "boundmarker";
    var marker = new AMap.Marker({
        // map: map,
        position: bmjson.position,
        zIndex: 180,
        extData: bmjson,
        title: bmjson.name,
        icon: "images/markers/boundmarker_blue.png",
    });
    // AMap.event.addListener(marker, "dblclick", bdmarkDbClick);
    AMap.event.addListener(marker, "mouseover", overlayHighlight);
    AMap.event.addListener(marker, "mouseout", overlayMouseOut);
    AMap.event.addListener(marker, "click", overlayFeatureClick);
    // marker.setMap(map);
    boundMarkers.push(marker);
}

function showBoundMarkers(bmMarkers) {
    if(boundMarkers != bmMarkers) {
        for(var i = 0; i < boundMarkers.length; i++) {
            var old = boundMarkers[i];
            old.setMap(null);
        }
    }
    for(var i = 0; i < bmMarkers.length; i++) {
        var marker = bmMarkers[i];
        marker.setMap(map);
        marker.show();
    }
    $("#toolbarBoundMarkers")[0].checked = true;
}

function simpleSetMarkers(psdata, markers) {
    for (var i = 0; i < psdata.length; i++) {
        var data = psdata[i];
        data["selected"] = false;
        if ("1" == data.spaType) {
            var marker = new AMap.Marker({
                // map: map,
                position: data.position,
                zIndex: 100,
                extData: data,
                title: data.name,
                icon: "images/markers/common_marker.png",
            });
            AMap.event.addListener(marker, "mouseover", markerHighlight);
            AMap.event.addListener(marker, "mouseout", markerMouseOut);
            AMap.event.addListener(marker, "click", mapFeatureClick);
            markers.push(marker);
        } else if("3" == data.spaType) {
            var lineArr = JSON.parse(data.path);
            var polyline = new AMap.Polyline({
                // map: map,
                zIndex: 95,
                extData: data,
                path: lineArr,          //设置线覆盖物路径
                strokeColor: "#3366FF", //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 5,        //线宽
                strokeStyle: "solid",   //线样式
                strokeDasharray: [10, 5] //补充线样式
            });
            AMap.event.addListener(polyline, "mouseover", markerHighlight);
            AMap.event.addListener(polyline, "mouseout", markerMouseOut);
            AMap.event.addListener(polyline, "click", mapFeatureClick);
            markers.push(polyline);
        }
    }
}

//	新的点标注
function setNewMarkers(newdata) {
    for(var i = 0; i < showingMarkers.length; i++) {
        var marker = showingMarkers[i];
        marker.hide();
        marker.setMap(null);
        map.remove(marker);
    }
    closeInfoWindow();
    showingMarkers = [];
    simpleSetMarkers(newdata, showingMarkers);
    // map.setFitView();
}

//	在左边结果栏显示若干条结果，muldata为json
function setResultItems(muldata, divname, clas) {

    var parentdiv = document.getElementById(divname);
    parentdiv.style.display="block";
    var num = 0;
    if(!muldata || "" == muldata) {
        parentdiv.innerHTML = "";
    } else {
        num = muldata.length;
        var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
        for (var i = 0; i < muldata.length; i++) {
            var data = muldata[i];
            var str;
            if (clas) {
                if (clas == "geoname") {
                    str = consPlaceResult(data, i + 1);
                } else if (clas == "dist") {
                    str = consDistResult(data, i + 1);
                }
                if (clas == "bound") {
                    str = consBoundResult(data, i + 1);
                }
                if (clas == "bounemarker") {
                    str = consBoundMarkerResult(data, i + 1);
                }
            } else {
                str = consPlaceResult(data, i + 1);
            }
            midstr += str;
        }
        var totalstr = prestr + midstr + endstr;
        parentdiv.innerHTML = totalstr;
    }

    if(clas) {
        if(clas == "geoname") {
            document.getElementById("placeintotal").innerText = "      地名：" + num +" 条记录";
        } else if(clas == "dist") {
            document.getElementById("distintotal").innerText = "      行政区：" + num +" 条记录";
        }if(clas == "bound") {
            document.getElementById("boundintotal").innerText = "      行政界线：" + num +" 条记录";
        }if(clas == "bounemarker") {
            document.getElementById("bmintotal").innerText = "      界桩、界碑：" + num +" 条记录";
        }
    } else{
        document.getElementById("placeintotal").innerText = "      地名：" + num +" 条记录";
    }
}

//	在左边结果栏显示若干条结果，items为html
function setResultsInDiv(items, divname) {
    var parentdiv = document.getElementById(divname);
    parentdiv.style.display="block";
    var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
    for(var i = 0; i < items.length; i++) {
        midstr += items[i];
    }
    var totalstr = prestr + midstr + endstr;
    parentdiv.innerHTML = totalstr;
}

//	产生左边结果栏的一条数据——名称，位置，起点/终点，最左序号，下方详情
function consResultItem(clas, name, id, type, order, content){
    str = "<div class='list-group-item'" +"onclick=\"gotoOverlay('"+ clas + "', '" + id + "')\"" +
        "><div class='SearchResult_item_left' " +
        "><p><strong>" + order +
        "</strong></p></div><div class='SearchResult_item_content'>" +
        "<p><font color='#0B73EB'>" + name +
        "</font><span class='wikiTag'>" + type +
        "</span></p><p>" + content + "</p></div></div>";
    return str;
}

//	产生左边结果栏的一条数据，place为地点的json数据
function consPlaceResult(place, order) {
    return consResultItem("geoname" ,place.name, place.id, place['小类'], order,
        "地域代码：" + place.dist);
    // return consResultItem_old(place.name, place.position, place['小类'], order, "地域代码：" + place.dist);
}
function consDistResult(dist, order) {
    return consResultItem("dist" ,dist.name, dist.id, dist['Grade'], order,
        "地域代码：" + dist.id + "&nbsp;&nbsp;&nbsp;上级行政区:" + dist['上级行政区']);
}
function consBoundResult(bound, order) {
    return consResultItem("bound" ,bound.name, bound.Id, bound['Grade'], order,
        "相关行政区：" + bound.LeftName + ", " + bound.RightName);
}
function consBoundMarkerResult(bm, order) {
    return consResultItem("bm" ,bm.name, bm.Id, bm['TypeName'], order,
        "相关行政区：" + bm.relatedDists);
}

//	初始化所有点标注
function initmarkers(pdata) {
    // if(pdata) {
    //     showingPlaces = pdata;
    // } else {
    //     showingPlaces = placedata;
    // }
    for(var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        marker.hide();
        marker.setMap(null);
        map.remove(marker);
    }
    markers = [];
    if(pdata) {
        simpleSetMarkers(pdata, markers);
    } else {
        simpleSetMarkers(placedata, markers);
    }
    setShowingMarkers(markers);
    showMarkers();
}

//	显示一定量的点标注
function showMarkers(psdata) {
    // placesHide();
    // simpleSetMarkers(psdata, showingMarkers);
    // setNewMarkers(psdata);
    if(psdata) {
        setShowingMarkers(psdata);
    } else {
        showingMarkers = markers;
    }
    placesShow();
    $("#toolbarPlaces")[0].selected = true;
}

function setShowingMarkers(psdata) {
    showingMarkers = [];
    for(var i = 0; i < markers.length; i++) {
        for(var j = 0; j < psdata.length; j++) {
            if(markers[i].getExtData(0)['id'] == psdata[j]['id']) {
                showingMarkers.push(markers[i]);
                break;
            }
        }
    }
    return showingMarkers;
}

function setShowingOverlays(psdata, distdata, bounddata, bmdata) {
    // setShowingMarkers(psdata);

    showingDists = [];
    for(var i = 0; i < distPolygons.length; i++) {
        for(var j = 0; j < distdata.length; j++) {
            if(distPolygons[i].getExtData(0)['id'] == distdata[j]['id']) {
                showingDists.push(distPolygons[i]);
                break;
            }
        }
    }

    showingBounds = [];
    for(var i = 0; i < boundPolylines.length; i++) {
        for(var j = 0; j < bounddata.length; j++) {
            if(boundPolylines[i].getExtData(0)['Id'] == bounddata[j]['Id']) {
                showingBounds.push(boundPolylines[i]);
                break;
            }
        }
    }

    showingbms = [];
    for(var i = 0; i < boundMarkers.length; i++) {
        for(var j = 0; j < bmdata.length; j++) {
            if(boundMarkers[i].getExtData(0)['Id'] == bmdata[j]['Id']) {
                showingbms.push(boundMarkers[i]);
                break;
            }
        }
    }

}

//	点击标注Marker时
function mapFeatureClick(e){
    openInfoWindow(e);
}

function markerHighlight(e) {
    var fea = e.target;
    var data = fea.getExtData();
    if("1" == data.spaType) {
        fea.setIcon("images/markers/common_marker_selected.png");
    } else if("3" == data.spaType) {
        fea.setOptions({strokeColor: "#FF0000"});
    }

}

function markerUnhighlight(e) {
    var fea = e.target;
    var data = fea.getExtData();
    data["selected"] = false;
    if("1" == data.spaType) {
        fea.setIcon("images/markers/common_marker.png");
    } else if("3" == data.spaType) {
        fea.setOptions({strokeColor: "#3366FF"});
    }
}

function markerMouseOut(e) {
    var fea = e.target;
    var data = fea.getExtData();
    if(data["selected"]) {
        return;
    }
    if("1" == data.spaType) {
        fea.setIcon("images/markers/common_marker.png");
    } else if("3" == data.spaType) {
        fea.setOptions({strokeColor: "#3366FF"});
    }
}

function overlayFeatureClick(e){
    openSimpleInfoWindow(e);
}

function overlayHighlight(e) {
    var fea = e.target;
    var data = fea.getExtData();
    var type = data['overlay'];
    if("dist" == type) {
        fea.setOptions({
            fillColor: "#00FFFF", //填充色
            fillOpacity: 0.5//填充透明度
        });
    } else if("bound" == type) {
        fea.setOptions({
            strokeColor: "#FF3322",
            strokeOpacity: 1,       //线透明度
            strokeWeight: 7,        //线宽
         });
    } else if("boundmarker" == type) {
        fea.setIcon("images/markers/boundmarker_red.png");
    }

}

function overlayUnhighlight(e) {
    var fea = e.target;
    var data = fea.getExtData();
    var type = data['overlay'];
    data["selected"] = false;
    if("dist" == type) {
        fea.setOptions({
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.3//填充透明度
        });
    } else if("bound" == type) {
        fea.setOptions({
            strokeColor: "#FF33FF",
            strokeOpacity: 0.9,       //线透明度
            strokeWeight: 3,        //线宽
        });
    } else if("boundmarker" == type) {
        fea.setIcon("images/markers/boundmarker_blue.png");
    }
}

function overlayMouseOut(e) {
    var fea = e.target;
    var data = fea.getExtData();
    var type = data['overlay'];
    if(data["selected"]) {
        return;
    }
    if("dist" == type) {
        fea.setOptions({
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.3//填充透明度
        });
    } else if("bound" == type) {
        fea.setOptions({
            strokeColor: "#FF33FF",
            strokeOpacity: 0.9,       //线透明度
            strokeWeight: 3,        //线宽
        });
    } else if("boundmarker" == type) {
        fea.setIcon("images/markers/boundmarker_blue.png");
    }
}


//	附近搜索
function srhpoi() {
    var item0 = consPlaceResult(windata, "中");

    var inputele = document.getElementById("winsrhword");
    var srhtxt = inputele.value;
    var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
        pageSize: 5,
        pageIndex: 1,
        city: windata.citycode, //城市
        map: map,
        panel: "pathinfo1"
    });
    placeSearch.searchNearBy(srhtxt, windata.position, 500, function(status, result) {
        var test = 0;
    });
    closeWindowBySearch();
    clearNavPanel();
    setResultsInDiv([item0], "pathpoints");
}

//	驾车搜索
function srhdrive() {
    navMethod = "drive";
    var transOptions = createTransOption();
    var trans = new AMap.Driving(transOptions);
    trans.search(orgdata.position, destdata.position, function(status, result) {
        //TODO:开发者使用result自己创建交互面板和地图展示
    });
    closeWindowBySearch();
}

//	公交搜索
function srhbus() {
    navMethod = "trans";
    var transOptions = createTransOption();
    var trans = new AMap.Transfer(transOptions);
    trans.search(orgdata.position, destdata.position, function(status, result) {
        //TODO:开发者使用result自己创建交互面板和地图展示
    });
    closeWindowBySearch();
}

//	步行搜索
function srhwalk() {
    navMethod = "walk";
    var transOptions = createTransOption();
    var trans = new AMap.Walking(transOptions);
    trans.search(orgdata.position, destdata.position, function(status, result) {
        //TODO:开发者使用result自己创建交互面板和地图展示
    });
    closeWindowBySearch();
}

//	生成搜索Options的内容
function createTransOption() {
    var inputele = document.getElementById("winsrhword");
    var srhtxt = inputele.value;
    var soe = document.getElementById("startorend");
    var otherplace = findPlaceByAttr("name", srhtxt);
    if(soe.innerHTML == "起点") {
        orgdata = otherplace;
        destdata = windata;
    } else {
        orgdata = windata;
        destdata = otherplace;
    }
    var item1 = consPlaceResult(orgdata, "起");
    var item2 = consPlaceResult(destdata, "终");
    clearNavPanel();
    setResultsInDiv([item1, item2], "pathpoints");

    var transOptions = {
        city: orgdata.citycode,
        citid: destdata.citycode,
//				policy: AMap.TransferPolicy.LEAST_TIME,
        map: map,
        panel: "pathinfo1"
    };
    return transOptions;
}

//	在所有地名中按属性查询
function findPlaceByAttr(attr, _name) {
    var pla = null;
    for(var i = 0; i < markers.length; i++) {
        var testplace = markers[i].getExtData();
        if(testplace[attr] == _name) {
            pla = markers[i];
            break;
        }
    }
    return pla;
}

//	因为搜索而关闭信息窗体
function closeWindowBySearch() {
    document.getElementById("winsrhword").value = "";
    closeInfoWindow();
    map.clearMap();
    initmarkers();
    toChangeHead("hm_favnav");
}

//	清空“路径规划”容器的内容
function clearNavPanel() {
    var navPanel = document.getElementById("pathinfo1");
    navPanel.innerHTML = "";
}

//	设置信息窗体搜索方式
function selectsrhmethod(e) {
    var oid = e.id;
    var posObj = document.getElementById("findnear");
    var fhObj = document.getElementById("fromhere");
    var thObj = document.getElementById("tothere");

    switch(oid) {
        case "findnear":{
            posObj.className = "tab selected";
            fhObj.className = "tab";
            thObj.className = "tab";
            $("#startorend")[0].innerHTML = "";
            $("#poisrhbtn")[0].className = "search-button";
            $("#navsrhdiv")[0].className = "nav-button hide";
            break;
        }
        case "fromhere":{
            posObj.className = "tab";
            fhObj.className = "tab selected";
            thObj.className = "tab";
            $("#startorend")[0].innerHTML = "终点";
            $("#poisrhbtn")[0].className = "search-button hide";
            $("#navsrhdiv")[0].className = "nav-button";
            break;
        }
        case "tothere":{
            posObj.className = "tab";
            fhObj.className = "tab";
            thObj.className = "tab selected";
            $("#startorend")[0].innerHTML = "起点";
            $("#poisrhbtn")[0].className = "search-button hide";
            $("#navsrhdiv")[0].className = "nav-button";
            break;
        }
    }

}

//	切换左边栏的窗体
function toChangeHead(oid) {
    var titles=["hm_wikinav", "hm_classnav", "hm_favnav"];
    var infoClassObj = document.getElementById("hm_infoClass");
    var favoritesObj = document.getElementById("hm_favorites");
    var wikiClassObj = document.getElementById("hm_wikiClass");

    for(var i = 0;i < titles.length; i++) {
        var title = titles[i];
        var preHeadObj = document.getElementById(title);
        var reg = new RegExp('(\\s|^)' + "active" + '(\\s|$)');
        preHeadObj.className = preHeadObj.className.replace(reg, ' ');
    }
    document.getElementById(oid).className += " active";
    document.getElementById("hm_mapInfo").style.display="block";
    document.getElementById("placeresults").style.display="none";
    switch(oid) {
        case "hm_classnav":{
            infoClassObj.style.display="block";
            favoritesObj.style.display="none";
            document.getElementById("pathinfo1").style.display = "none";
            wikiClassObj.style.display="none";
            break;
        }
        case "hm_favnav":{
            infoClassObj.style.display="none";
            favoritesObj.style.display="block";
            document.getElementById("pathinfo1").style.display = "block";
            wikiClassObj.style.display="none";
            break;
        }
        case "hm_wikinav":{
            infoClassObj.style.display="none";
            favoritesObj.style.display="none";
            document.getElementById("pathinfo1").style.display = "none";
            wikiClassObj.style.display="block";
            break;
        }
    }
}

function gotoAll() {
    var tmpdata = placedata;
    showingPlaces = tmpdata;
    // setNewMarkers(tmpdata);
    showMarkers(tmpdata);
    setResultItems(tmpdata, "placeresults");
}

//	显示某大类的所有地名
function gotoBigType(bigtype) {
    var tmpdata = [];
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        if(data['大类'] == bigtype) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        // setNewMarkers(tmpdata);
        showMarkers(tmpdata);
        setResultItems(tmpdata, "placeresults");
    } else {
        alert("暂无 " + bigtype + " 相关数据...");
    }
}

//	显示某小类的所有地名
function gotoSmallType(bigtype, smalltype) {
    var tmpdata = [];
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        var flag = false;
        if(data['大类'] == bigtype && data['小类'] == smalltype) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        // setNewMarkers(tmpdata);
        showMarkers(tmpdata);
        setResultItems(tmpdata, "placeresults");
    } else {
        alert("暂无 " + bigtype +"-" + smalltype + " 相关数据...");
    }
}

//	显示某地区的所有地名
function gotoDist(dictcode) {

    var diststr = dictcode.toString();
    var tmpdata = [];
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        var thiscode = data['dist'];
        if(distIn(thiscode, diststr)) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        // setNewMarkers(tmpdata);
        showMarkers(tmpdata);
        setResultItems(tmpdata, "placeresults");
    } else {
        alert("暂无 " + dictcode + " 地区相关数据...");
    }
}

//	地图前往某一坐标点
function gotoPlace(posStr, name) {
    var pla;
    if(name) {
        pla = findPlaceByAttr("name", name);
        closeInfoWindow();
    }
    var xystr = posStr.split(",");
    var x = parseFloat(xystr[0]);
    var y = parseFloat(xystr[1]);
    var npos = [x, y];
    var zom = map.getZoom();
    if(zom < 16) {
        map.setZoom(16);
    }
    map.panTo(npos);
    if(pla) {
        openInfoWindow({target: pla});
    }
}

//	地图前往某一坐标点
function gotoGeoname(placeid) {
    var pla = findPlaceByAttr("id", placeid);
    closeInfoWindow();
    var xystr = posStr.split(",");
    var x = parseFloat(xystr[0]);
    var y = parseFloat(xystr[1]);
    var npos = [x, y];
    var zom = map.getZoom();
    if(zom < 16) {
        map.setZoom(16);
    }
    map.panTo(npos);
    if(pla) {
        openInfoWindow({target: pla});
    }
}

function gotoOverlay(type, id) {
    var overlay, center;
    var zom = 11;
    if(type == "dist") {
        overlay = findOverlay(distPolygons, id);
        center = overlay.getBounds().getCenter();
    } else if(type == "bound") {
        overlay = findOverlay(boundPolylines, id);
        center = overlay.getBounds().getCenter();
    } else if(type == "bm") {
        overlay = findOverlay(boundMarkers, id);
        center = overlay.getPosition();
    } else {
        overlay = findOverlay(showingMarkers, id);
        center = overlay.getExtData().spaType == 1 ?
            overlay.getPosition() : overlay.getBounds().getCenter();
        zom = 16;
    }
    map.setZoom(zom);
    map.panTo(center);
    if(type == "geoname") {
        openInfoWindow({target: overlay});
    } else {
        openSimpleInfoWindow({target: overlay, 'lnglat': center});
    }

}

function findOverlay(overlays, id) {
    for(var i = 0; i < overlays.length; i++) {
        var ov = overlays[i];
        if(id == ov.getExtData()['id'] || id == ov.getExtData()['Id']) {
            return ov;
        }
    }
    return null;
}

//	地区代码是否位于某地区
function distIn(sub, par) {
    var i = 1;
    for(i = 1; i < sub.length; i++) {
        var c1 = sub.charCodeAt(i), c2 = par.charCodeAt(i);
        if(c1 != c2) {
            break;
        }
    }
    for( ;i < par.length; i++) {
        var c = par.charCodeAt(i);
        if(c != 48) {
            return false;
        }
    }
    return true;
}

function placesShow() {

    if(showingMarkers != markers &&
        showingMarkers.length != markers.length) {
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            marker.hide();
        }
    }
    for (var i = 0; i < showingMarkers.length; i++) {
        var marker = showingMarkers[i];
        marker.setMap(map);
        marker.show();
    }
    map.setFitView();
}

function placesHide() {
    for(var i = 0; i < showingMarkers.length; i++) {
        var marker = showingMarkers[i];
        marker.hide();
        marker.setMap(null);
        map.remove(marker);
    }
}

function distsShow() {
    showDists(showingDists);
}

function distsHide() {
    for(var i = 0; i < showingDists.length; i++) {
        var dist = showingDists[i];
        dist.hide();
    }
}

function boundsShow() {
    showBounds(showingBounds);
}

function boundsHide() {
    for(var i = 0; i < showingBounds.length; i++) {
        var bound = showingBounds[i];
        bound.hide();
    }
}

function bdmarksShow() {
    showBoundMarkers(showingbms);
}

function bdmarksHide() {
    for(var i = 0; i < showingbms.length; i++) {
        var boundMarker = showingbms[i];
        boundMarker.hide();
    }
}

//  地名 checkbox
function placesCheckBox(checkbox) {
    if (checkbox.checked) {
        placesShow();
    } else {
        placesHide();
    }
}

//  行政区 checkbox
function distsCheckBox(checkbox) {
    if (checkbox.checked) {
        distsShow();
    } else {
        distsHide();
    }
}

//  行政界线 checkbox
function boundsCheckBox(checkbox) {
    if (checkbox.checked) {
        boundsShow();
    } else {
        boundsHide();
    }
}

//  界桩界碑 checkbox
function boundMarksCheckBox(checkbox) {
    if (checkbox.checked) {
        bdmarksShow();
    } else {
        bdmarksHide();
    }
}




