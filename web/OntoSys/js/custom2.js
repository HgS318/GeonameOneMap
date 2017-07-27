
var infoWindow, map, level = 12;
var markers = [];	//	所有点标注
var showingPlaces;	//	所有当前显示的地名
var windata;		//	当前信息窗体中的地名数据
var orgdata, destdata;	//	信息窗体搜索框中起点，终点的地点数据
var navMethod = "trans";	//	信息窗体中上一次导航方式
var entered = false;	//	信息窗体搜索框是否键入过Enter
var infoWinDown;	//	信息窗体下部搜索框html


var k = true, R = false;
var O = '93%', j = '500px', L = '5px';
var G = '93%', J = '500px', K = '5px';

function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

//	生成信息窗体的内容
function constructInfoWindow(title, content) {
	var info = document.createElement("div");
	info.className = "info";

	//可以通过下面的方式修改自定义窗体的宽高
	//info.style.width = "400px";
	// 定义顶部标题
	var top = document.createElement("div");
	var titleD = document.createElement("div");
	var closeX = document.createElement("img");
	top.className = "info-top";
	titleD.innerHTML = title;
	closeX.src = "images/close2.gif";
	closeX.onclick = closeInfoWindow;
	top.appendChild(titleD);
	top.appendChild(closeX);
	info.appendChild(top);

	// 定义中部内容
	var middle = document.createElement("div");
	middle.className = "info-middle";
	middle.style.backgroundColor = 'white';
	middle.innerHTML = content;
	info.appendChild(middle);

	//	添加下部内容（搜索框）
	info.appendChild(infoWinDown);

	// 定义底部内容
	var bottom = document.createElement("div");
	bottom.className = "info-bottom";
	bottom.style.position = 'relative';
	bottom.style.top = '0px';
	bottom.style.margin = '0 auto';
	var sharp = document.createElement("img");
	sharp.src = "images/sharp.png";
	bottom.appendChild(sharp);
	info.appendChild(bottom);

	return info;
}

//	生成信息创意下部（搜索框）的内容
function constructInfoDown() {
	//	定义下部内容
	var down = document.createElement("div");
	down.className = "amap-info-combo status-origin";
	down.setAttribute("id", "winbtm");
//			down.setAttribute("style", "background-color: #FFFFFF");
	var downstr = "" +
//			"<div class=\"amap-info-combo status-origin\" id=\"winbtm\">" +
			"<table><tbody>"+
			"<tr class=\"amap-info-tabs\">" +
			"<td class=\"tab\" id=\"findnear\" onclick=\"selectsrhmethod(this)\"><i class=\"tab-icon icon-around\"></i>在附近找</td>" +
			"<td class=\"tab selected\" id=\"fromhere\" onclick=\"selectsrhmethod(this)\"><i class=\"tab-icon icon-start\"></i>这里出发</td>" +
			"<td class=\"tab\" id=\"tothere\" onclick=\"selectsrhmethod(this)\"><i class=\"tab-icon icon-end\"></i>到这里去</td>" +
			"</tr></tbody>" +
			"</table>" +
			"<table cellpadding=\"0\"><tbody>" +
			"<tr>" +
			"<td class=\"input-label\" id=\"startorend\">终点</td>" +
			"<td>" +
			"<div class=\"keyword-input\"><input class=\"keyword\" type=\"text\" id=\"winsrhword\" /></div>" +
			"</td>" +
			"<td>" +
			"<div class=\"search-button hide\" id=\"poisrhbtn\" onclick=\"srhpoi();\">搜索</div>" +
			"<div class=\"nav-button\" id=\"navsrhdiv\">" +
			"<span class=\"nav-icon nav-drive\" id=\"drivesrhbtn\" onclick=\"srhdrive();\">驾车</span>" +
			"<span class=\"nav-icon nav-bus\" id=\"bussrhbtn\" onclick=\"srhbus();\">公交</span>" +
			"<span class=\"nav-icon nav-walk\" id=\"walksrhbtn\" onclick=\"srhwalk();\">步行</span>" +
			"</div>" +
			"</td>" +
			"</tr></tbody>" +
			"</table>"
//			 + "</div>"
		;
	down.innerHTML = downstr;
	return down;
}

//	打开信息窗体
function openInfoWindow(e) {
	markerHighlight(e);
	var extData = e.target.getExtData();
	extData["selected"] = true;
	var title = extData.name + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + extData['小类'] + '</span>';
	//var title = '华荣正街' + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + '街道' + '</span>';
	var content = [];
	content.push("<img src='images/contentdemopic.jpg'>"
		+ "<strong>地名含义：</strong>" + extData.brif);
	content.push("<strong>行政区：</strong>" + extData['所在跨行政区']);
	content.push("<a href='html/wikiContent_fitall.html?name=" + extData.nickname + "' target='_blank'>详细信息</a>");
	closeInfoWindow();
	infoWindow = new AMap.InfoWindow({
		isCustom: true,  //使用自定义窗体
		content: constructInfoWindow(title, content.join("<br>")),
		offset: new AMap.Pixel(14, -47)	//-113, -140
	});
	infoWindow.on('open', function () {
		windata = extData;
	});
	infoWindow.on('close', function () {
		hasAutoCom = false;
		markerUnhighlight(e);
//				var srhdiv = document.getElementById("winbtm");
//				srhdiv.setAttribute("id", "oldwinbtm");
//				srhdiv.innerHTML = " ";
	});
	infoWindow.on('change', function () {

	});

	infoWindow.open(map, extData.position);


}

//	关闭地图中的信息窗体
function closeInfoWindow() {
	if(infoWindow) {
		infoWindow.close();
		map.clearInfoWindow();
		infoWindow = null;
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
	document.getElementById("searchresults").style.display="none";
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
	setNewMarkers(tmpdata);
	setResultItems(tmpdata, "searchresults");
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
		setNewMarkers(tmpdata);
		setResultItems(tmpdata, "searchresults");
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
		setNewMarkers(tmpdata);
		setResultItems(tmpdata, "searchresults");
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
		setNewMarkers(tmpdata);
		setResultItems(tmpdata, "searchresults");
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
//				if(zom < 14) {
//					map.setZoom(14);
//				} else {
//					map.setZoom(zom + 1);
//				}
	}
	map.panTo(npos);
	if(pla) {
		openInfoWindow({target: pla});
	}
//			openInfoWindow(placedata);
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

//	新的点标注
function setNewMarkers(newdata) {
	while (markers.length > 0) {
		map.remove(markers);
		markers.pop();
	}
	closeInfoWindow();
//			for(var i = 0; i < newdata.length; i++) {
//				var data = newdata[i];
//				var marker;
//				marker = new AMap.Marker({
//					map: map,
//					position: data.position,
//					zIndex: 3,
//					extData: data,
//					title: data.name,
//					label: data.name.substring(0, 1),
//				});
//				AMap.event.addListener(marker, "click", mapFeatureClick);
//				markers.push(marker);
//			}
	simpleSetMarkers(newdata, markers);
	map.setFitView();
}

function simpleSetMarkers(psdata, markers) {
	for (var i = 0; i < psdata.length; i++) {
		var data = psdata[i];
		data["selected"] = false;
		if ("1" == data.spaType) {
			var marker = new AMap.Marker({
				map: map,
				position: data.position,
				zIndex: 3,
				extData: data,
				title: data.name,
				icon: "../images/markers/common_marker.png",
			});
			AMap.event.addListener(marker, "mouseover", markerHighlight);
			AMap.event.addListener(marker, "mouseout", markerMouseOut);
			AMap.event.addListener(marker, "click", mapFeatureClick);
			markers.push(marker);
		} else if("3" == data.spaType) {
			var lineArr = JSON.parse(data.path);
			var polyline = new AMap.Polyline({
				map: map,
				zIndex: 3,
				extData: data,
				title: data.name,
				path: lineArr,          //设置线覆盖物路径
				strokeColor: "#3366FF", //线颜色
				strokeOpacity: 1,       //线透明度
				strokeWeight: 5,        //线宽
				strokeStyle: "solid",   //线样式
				strokeDasharray: [10, 5] //补充线样式
			});
			AMap.event.addListener(polyline, "click", mapFeatureClick);
			markers.push(polyline);
		}
	}
}

//	在左边结果栏显示若干条结果，muldata为json
function setResultItems(muldata, divname) {

	var parentdiv = document.getElementById(divname);
	parentdiv.style.display="block";
	var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
	for(var i = 0; i < muldata.length; i++) {
		var data = muldata[i];
		var str = consPlaceResult(data, i + 1);
		midstr += str;
	}
	var totalstr = prestr + midstr + endstr;
	parentdiv.innerHTML = totalstr;
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
function consResultItem(name, pos, type, order, content){
	var posstr = pos[0] +"," + pos[1];
	str = "<div class='list-group-item'" +"onclick=\"gotoPlace('"+ posstr + "', '" + name + "')\"" +
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
	return consResultItem(place.name, place.position, place['小类'], order, "地域代码：" + place.dist);
}

//	全部行政区域显示在左边栏相应位置
function setDists() {
	var wholetree = document.getElementById("tree1");
	var temp = document.getElementById("folder1");
	var inner1 = "<li class='collapsable'>";
	var inner2 = "</li>";
	var branches = $(inner1 + "<div class='hitarea collapsable-hitarea'></div>" +
		"<a href='#' onclick=\"gotoDist('420000000')\">湖北省</a><ul id='clist'></ul>" + inner2).appendTo("#folder1");
	var branchdom =$('#clist')[0];

	var subDistricts = distdata.subclasses;
	for (var i = 0; i < subDistricts.length; i++) {	//	省内各城市
		var city = subDistricts[i];
		var cityname = city.name;
		var citynode = document.createElement("li");
		var $cn = $(citynode);
		if(i == subDistricts.length - 1) {
			citynode.setAttribute("class", "last");
		} else {
			citynode.setAttribute("class", "expandable");
		}
//				citynode.setAttribute("class", "expandable");
		var citydiv = document.createElement("div");
		citydiv.setAttribute("class", "hitarea expandable-hitarea");
		var citya = document.createElement("a");
		citya.setAttribute("href", "#");
//				citya.setAttribute("class", "");
		citya.setAttribute("onclick", "gotoDist('" + city.id + "')");
		var citytext = document.createTextNode(cityname);
		citya.appendChild(citytext);
		citynode.appendChild(citydiv);
		citynode.appendChild(citya);
		if (!city.subclasses) {
			branchdom.appendChild(citynode);
			continue;
		}
		var countylist = document.createElement("ul");
		countylist.setAttribute("style", "display: none;");
		for (var j = 0; j < city.subclasses.length; j++) {//	城市内各区县
			var county = city.subclasses[j];
			var countyname = county.name;
			var countynode = document.createElement("li");
			var countya = document.createElement("a");
			countya.setAttribute("href", "#");
			countya.setAttribute("onclick", "gotoDist('" + county.id + "')");
			var countytext = document.createTextNode(countyname);
			countya.appendChild(countytext);

			if (county.subclasses) {
				if(j == city.subclasses.length - 1) {
					countynode.setAttribute("class", "last");
				} else {
					countynode.setAttribute("class", "expandable");
				}
//						countynode.setAttribute("class", "expandable");
				var countydiv = document.createElement("div");
				countydiv.setAttribute("class", "hitarea expandable-hitarea");
				countynode.appendChild(countydiv);
				countynode.appendChild(countya);
				var streetlist = document.createElement("ul");
				streetlist.setAttribute("style", "display: none;");
				for (var k = 0; k < county.subclasses.length; k++) {	//	区县内各街道
					var street = county.subclasses[k];
					var streetname = street.name;
					var streetnode = document.createElement("li");
					var streeta = document.createElement("a");
					streeta.setAttribute("href", "#");
					streeta.setAttribute("onclick", "gotoDist('" + street.id + "')");
					var streettext = document.createTextNode(streetname);
					streeta.appendChild(streettext);
					streetnode.appendChild(streeta);
					if(k == county.subclasses.length - 1) {
						streetnode.className = "last";
					}
					streetlist.appendChild(streetnode);
				}
				countynode.appendChild(streetlist);
			} else {
				if(j == city.subclasses.length - 1) {
					countynode.setAttribute("class", "last");
				}
				countynode.appendChild(countya);
			}
			countylist.appendChild(countynode);
		}
		citynode.appendChild(countylist);
		branchdom.appendChild(citynode);
	}
	var htm = branches.html();
	wholetree.innerHTML = inner1 + htm + inner2;

	$("#tree1").treeview({
//				add: branches,
//				remove: branches,
		collapsed: true,
		animated: "fast",
		control:"#sidetreecontrol1",
		prerendered: true,
//				persist: "location"
	});
}

//	全部地名类型显示在左边栏相应位置
function setTypes() {
	var wholetree = document.getElementById("tree2");
	var temp = document.getElementById("folder2");
	var inner1 = "<li class='collapsable'>";
	var inner2 = "</li>";
	var branches = $(inner1 + "<div class='hitarea collapsable-hitarea'></div>" +
		"<a href='#'>所有分类</a><ul id='dlist'></ul>" + inner2).appendTo("#folder2");
	var branchdom =$('#dlist')[0];
	var subDistricts = typedata.subclasses;
	for (var i = 0; i < subDistricts.length; i += 1) {	//	省内各城市
		var city = subDistricts[i];
		var cityname = city.name;
		var citynode = document.createElement("li");
		var $cn = $(citynode);
//				if(i == subDistricts.length - 1) {
//					citynode.setAttribute("class", "last");
//				} else {
//					citynode.setAttribute("class", "expandable");
//				}
		citynode.setAttribute("class", "expandable");
		var citydiv = document.createElement("div");
		citydiv.setAttribute("class", "hitarea expandable-hitarea");
		var citya = document.createElement("a");
		citya.setAttribute("href", "#");
//				citya.setAttribute("class", "");
		citya.setAttribute("onclick", "gotoBigType('" + cityname + "')");
		var citytext = document.createTextNode(cityname);
		citya.appendChild(citytext);
		citynode.appendChild(citydiv);
		citynode.appendChild(citya);
		if (!city.subclasses) {
			branchdom.appendChild(citynode);
			continue;
		}
		var streetlist = document.createElement("ul");
		streetlist.setAttribute("style", "display: none;");
		for (var k = 0; k < city.subclasses.length; k++) {	//	区县内各街道
			var street = city.subclasses[k];
			var streetname = street.name;
			var streetnode = document.createElement("li");
			var streeta = document.createElement("a");
			streeta.setAttribute("href", "#");
			streeta.setAttribute("onclick", "gotoSmallType('"+cityname+"', '"+streetname+"')");
			var streettext = document.createTextNode(streetname);
			streeta.appendChild(streettext);
			streetnode.appendChild(streeta);
			if(k == city.subclasses.length - 1) {
				streetnode.className = "last";
			}
			streetlist.appendChild(streetnode);
		}
		citynode.appendChild(streetlist);
		branchdom.appendChild(citynode);
	}
	var htm = branches.html();
	wholetree.innerHTML = inner1 + htm + inner2;

	$("#tree2").treeview({
//				add: branches,
//				remove: branches,
		collapsed: true,
		animated: "fast",
		control:"#sidetreecontrol2",
		prerendered: true,
//				persist: "location"
	});
}

//	设置自动补全
function setAutoComplete() {
	infoWinDown = constructInfoDown();
	document.getElementById("hiddendiv").appendChild(infoWinDown);
	$("#winsrhword").autocomplete(placedata, {
		minChars: 1,
		width: 100,
		matchCase: false,//不区分大小写
//				matchContains: "word",
//				autoFill: true,
		formatItem: function(row, i, max) {
			return row.name;
		},
		formatMatch: function(row, i, max) {
			return row.ChnSpell + row.name;
		},
		formatResult: function(row) {
			return row.name;
		},
		reasultSearch:function(row,v) {//本场数据自定义查询语法 注意这是我自己新加的事件
			//自定义在code或spell中匹配
			if(row.data.ChnSpell.indexOf(v) == 0 || row.data.name.indexOf(v) == 0) {
				return row;
			}
			else {
				return false;
			}
		}
	});
	$("#winsrhword").keydown(function(e) {
		if(e.keyCode != 13){
			return;
		}
		if(!entered) {
			entered = true;
			return;
		}
		var navTxt = $("#startorend")[0].innerText;
		entered = false;
		if(navTxt =="起点" || navTxt =="终点") {
			if(navMethod == "trans") {
				srhbus();
			} else if(navMethod == "drive") {
				srhdrive();
			} else if(navMethod == "walk") {
				srhwalk();
			}
		} else {
			srhpoi();
		}
	});
}

//	初始化所有点标注
function initmarkers(pdata) {
	simpleSetMarkers(placedata, markers);
	if(pdata) {
		showingPlaces = pdata;
		showNarkers(pdata);
	} else {
		showingPlaces = placedata;
	}
}

//	显示一定量的点标注
function showNarkers(psdata) {
	simpleSetMarkers(psdata, markers);
}

//	点击标注Marker时
function mapFeatureClick(e){
	openInfoWindow(e);
}

function markerHighlight(e) {
	var fea = e.target;
	var data = fea.getExtData();
	if("1" == data.spaType) {
		fea.setIcon("../images/markers/common_marker_selected.png");
	} else if("3" == data.spaType) {
		fea.setOptions({strokeColor: "#FF0000"});
	}

}

function markerUnhighlight(e) {
	var fea = e.target;
	var data = fea.getExtData();
	data["selected"] = false;
	if("1" == data.spaType) {
		fea.setIcon("../images/markers/common_marker.png");
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
		fea.setIcon("../images/markers/common_marker.png");
	} else if("3" == data.spaType) {

	}
}

$(function() {
//			setDists();
//			setTypes();
	$.ajax({
		url: 'easyGeonames.action',
		type:'get',
//				data: data,
		dataType: 'json',
		success:function(data){
			map = new AMap.Map('mapContainer',{
				resizeEnable: true,
				center: [109.461756,30.285877],
				zoom:level,
				keyboardEnable :false,
			});
			map.on('complete', function(){
				map.plugin(["AMap.ToolBar", "AMap.OverView", "AMap.Scale"], function(){
					map.addControl(new AMap.ToolBar);
					map.addControl(new AMap.OverView({isOpen: true}));
					map.addControl(new AMap.Scale);
				});
			});
			placedata = data;

			showingPlaces = placedata;
			initmarkers();
			setAutoComplete();
			map.setFitView();
		},
		error:function(data){
			console.log(data);
		}
	})

});

// showNarkers(showingPlaces);

function delInstance(geocode,insnum) {
	var url="delInstance.action?geocode="+geocode+"&insnum="+insnum;
	window.location.href=url;
}

$(document).ready(function () {
	$("#searchStart").click(function(){ //检索
		$("#ClassCheckbox").submit();
	});
	$('#id_tree_dist').tree({
		lines: true,
		animate: false,
		url: 'wholeDists.action',
		//queryParams: { id: '' },
		formatter: function (node) {
			var s = '<p style=\'color:#0000FF; font-size: 14px; line-height: 15px \'>'
				+ node.name + '(' + node.id + ')' + '</p>';
			// if (s.replace('未定义分类', '').length < s.length) {
			// 	s = '<span style=\'color:#c43a3a;\'>' + s + '</span>';
			// } else if (node.exsit == false) {
			// 	s = '<span style=\'color:#a79696;\'>' + s + '</span>';
			// }
			return s;
		},
		onLoadSuccess: function () {
			if ($('#id_tree_dist').tree('getRoots').length > 0 && k) {
//				V($('#id_tree').tree('getRoots')[0].id);
				k = false;
			}
		},
		onClick: function (node) {
			// V(node.id,1);
			gotoDist(node.id);
		},
		onExpand: function (node) {
			// if ($('#id_tree_dist').tree('getParent', node.target) == null) {
			// 	$.each($('#id_tree_dist').tree('getRoots'), function (name, val) {
			// 		if (val.id != node.id) {
			// 			$('#id_tree_dist').tree('collapseAll', val.target);
			// 		}
			// 	});
			// }
		}
	});

	$('#id_tree_type').tree({
		lines: true,
		animate: false,
		// url: 'wholeTypes.action',
		url: '/data/placetypes_treedata.json',
		//queryParams: { id: '' },
		formatter: function (node) {
			var s = '<p style=\'color:#0000FF; font-size: 14px; line-height: 15px \'>'
				+ node.name + '</p>';
			return s;
		},
		onLoadSuccess: function () {
			if ($('#id_tree_type').tree('getRoots').length > 0 && k) {
//				V($('#id_tree').tree('getRoots')[0].id);
				k = false;
			}
		},
		onClick: function (node) {
			if(node.name == '全部类型') {
				gotoAll();
			} else if(node.children) {
				gotoBigType(node.name);
			} else {
				gotoSmallType(node.parent, node.name);
			}
			// V(node.id,1);
		},
		onExpand: function (node) {
			// if ($('#id_tree_type').tree('getParent', node.target) == null) {
			// 	$.each($('#id_tree_type').tree('getRoots'), function (name, val) {
			// 		if (val.id != node.id) {
			// 			$('#id_tree_type').tree('collapseAll', val.target);
			// 		}
			// 	});
			// }
		}
	});

	// $('#id_gjz').bind('keypress', function (event) {
	// 	if (event.keyCode == "13") {
	// 		C();
	// 	}
	// });
	// $('#id_search').searchbox({
	// 	prompt: '请输入关键字',
	// 	searcher: function(value,name){
	//
	// 		C(value);
	// 	},
	// 	width: '100%',
	// 	height: '30px'
	// });

		// $('#id_searchresult').datagrid({
		// 	fitColumns: true,
		// 	striped: true,
		// 	nowrap: true,
		// 	width: '100%',
		// 	height: '100%',
		// 	url: 'totalinstances.action',
		// 	columns:[[
		// 		{field:'Geo_Code',title:'分类代码',width:100},
		// 		//{field:'Name',title:'概念名称'},
		// 		{field:'InstanceName',title:'范例名称'},
		// 		{field:'InstanceId',title:'范例序号'},
		// 		{field:'Del',title:'删除',
		// 			formatter:function(value,row,index){
		// 				return  "<p href='"+row.Geo_Code+"' target='_blank'>删除</p>";
		// 			}
		// 		}
		// 	]],
		// 	singleSelect: true,
		// 	method: 'get',
		// 	rownumbers: true,
		// 	pagination: true,
		// 	pageSize: 10,
		// 	loadMsg: '查询中,请稍后…',
		// 	pagePosition: 'bottom',
		// 	remoteSort: false,
		// 	onLoadSuccess: function(data){
		// 		$('#id_searchresult').datagrid("autoMergeCells");
		//
	     //    },
		// 	onClickCell: function (index, field, val) {
		// 		var rows = $('#id_searchresult').datagrid('getRows');
		// 		if(field!='Del'){
		// 			R=false;
		// 			V(rows[index].Geo_Code,rows[index].InstanceId);
		// 		}else{
		// 			$.messager.confirm('确认','确认删除？',function(row){
		// 				if(row) {
		// 					delInstance(rows[index].Geo_Code,rows[index].InstanceId);
		// 				}
		// 			})
		// 		}
		// 	}
		// });

	$("#tabsDiv").tabs("select",1);


	
	var p = $('#id_searchresult').datagrid('getPager');
	$(p).pagination({
		pageSize: 10,//每页显示的记录条数，默认为10 
		pageList: [10, 20, 25, 35, 50, 100],
		beforePageText: '第',
		afterPageText: '页 共{pages}页',
		displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
        onBeforeRefresh:function(){
	        $(p).pagination('loading');
//	        alert('before refresh');
	        $(p).pagination('loaded');
	    },
		onRefresh:function(pageNumber,pageSize){  
//	    	alert(pageNumber);  
//	    	alert(pageSize);  
	    },
	    onSelectPage:function(pageNumber,pageSize){    
//	    	alert(pageNumber);
//	    	alert(pageSize);
			$('#id_searchresult').datagrid({
				fitColumns: true,
				striped: true,
				nowrap: true,
				width: '100%',
				height: '100%',
				url: 'getEasyInstances.action?startpage=' + pageNumber
						+ '&pagerows' + pageSize,
				columns:[[
					{field:'Geo_Code',title:'分类代码'},
					//{field:'Name',title:'概念名称'},
					{field:'InstanceName',title:'范例名称'},
					{field:'InstanceId',title:'范例序号'},
					{field:'Del',title:'删除',
						formatter:function(value,row,index){
							return  "<p href='"+row.Geo_Code+"' target='_blank'>删除</p>";
						} }
					]],
				singleSelect: true,
				method: 'get',
				rownumbers: true,
				pagination: true,
				pageSize: 10,
				loadMsg: '查询中,请稍后…',
				pagePosition: 'bottom',
				remoteSort: false,
				onLoadSuccess: function(data){
					$('#id_searchresult').datagrid("autoMergeCells");
//					V($('#id_tree').tree('getRoots')[0].id);
					var rows = $('#id_searchresult').datagrid('getRows');
					if(rows.length>0) {
						V(rows[0].Geo_Code,rows[0].InstanceId);
					}
		        },
				onClickCell: function (index, field, val) {
					var rows = $('#id_searchresult').datagrid('getRows');
					if(field!='Del'){
						R=false;
						V(rows[index].Geo_Code,rows[index].InstanceId);
					}else{
						$.messager.confirm('确认','确认删除？',function(row){
							if(row) {
								delInstance(rows[index].Geo_Code,rows[index].InstanceId);
							}
						})
					}
				}
			},'reload');
			$("#tabsDiv").tabs("select",2);
	    }
	});
	window.addEventListener('resize', onWindowResize, false);
});


function onWindowResize() {	//	不管
    if ($('#centerDiv').width() < 1000) { } else { }
};
function am() {	//	设置、调整divContainer的高度
    $('#divContainer').height($('#centerDiv').height() - $('#floatDiv').height());
};
function reloadTree() {	//	重新加载树结构
    $('#id_tree_dist').tree('reload');
	$('#id_tree_type').tree('reload');
}; 
function ar(fldm) {	//暂不清楚
	$.ajax({
		crossDomain: true, 
		type: "GET", 
		async: true, 
		contentType: "application/json;charset=utf-8",
		url: "http://localhost/btk/s.asmx/getDefine?jsoncallback=?",
		data: { fldm: fldm },
		dataType: "jsonp",
		timeout: 5000,
		jsonpCallback: 'jsoncallback',
		error: function (x, t, e) { 
			//alert(t); 
		}, 
		success: function (data) { 
			ap(); 
			var tmp = eval(data); 
			var htmlstr = "", htmlstr1 = "";
			var num = 0, index = 0;
			if (tmp.length > 0) {
				$.each(tmp[0], function (name, val) {
					index++;
					if (val != "" && name != "分类代码") {
						htmlstr += '<div class="mypanel" title="(' + (num + 1) +
							')" data-options="footer:\'#footer' + num + '\'"\>';
						htmlstr += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + val;
						htmlstr += '<div id="footer' + num + '" style="padding:5px;">【信息来源】' + name + '</div>';
						htmlstr += '</div>';
						num++;
						if (num == 1) { 
							htmlstr1 = '<div class="mypanel1" style="padding:5px;"><strong>相关定义：</strong>' + val.substring(0, 40) +
								'…&nbsp&nbsp<a href="#" id="linkbutton1" class="linkbutton1" data-options="plain:true,iconCls:\'icon-more\'">详情</a></div>';
						}
					}
				});
				if (index == 1) {
					htmlstr1 = '<div class="mypanel1" style="padding:5px;">暂无相关定义。</div>';
				}
			} else {
				htmlstr1 = '<div class="mypanel1" style="padding:5px;">暂无相关定义。</div>';
			}
			F(htmlstr1);
			$('.mypanel1').panel({ width: '100%' });
			$('#linkbutton1').linkbutton();
			$('#linkbutton1').on('click', function (event) {
				$('#dlg_content').html(htmlstr);
				$('#dlg').dialog('open');
				$('.mypanel').panel({ width: '100%' });
			});
		},
		complete: function () { R = false; }
	});
};
function V(fldm, flbh) {	//根据分类代码查看范例的全部内容
	if (R) {
		return;
	} 
	R = true;
	$.ajax({
		crossDomain: true,
		type: "GET",
		async: true,
		contentType: "application/json",
		url: "instancedetail.action?geocode="+fldm+"&insnum="+flbh,
		//url: "testEJson.action",
		dataType: "text",
		timeout: 5000,
		jsonpCallback: 'jsoncallback',
		error: function (x, t, e) { 
			alert(t); 
		},
		success: function (data) {
		//	$('#labelContainer').html('');
		//	$('#divContainer').html('');
		//	$('#tabContainer').html('');		
		//	$('#AllContainer').html('');
			$('#tabs').html('');
			$('#AllContainer').html('');
		//	$('#QJingContainer').html('');
		//	$('#SJHRaoContainer').html('');
		//	$('#SJCGuiContainer').html('');
		//	$('#SPinContainer').html('');
		//	$('#SJDSXiangContainer').html('');
		//	$('#SYiContainer').html('');
		//	$('#SJDJDuContainer').html('');
		//	$('#YGCGuiContainer').html('');
		//	$('#LTiContainer').html('');
		//	$('#DXTuContainer').html('');
		//	$('#SWeiContainer').html('');
		//	$('#TSTXiangContainer').html('');
		//	$('#YGDSXiangContainer').html('');
			$('#attrDiv').html('');
			$('#id_fldm').html('');
			$('#id_gnmc').html('');
			$('#id_fzdw').html('');
			ar(fldm); 
			var jsonData = eval(data);
			if(jsonData==null) {
				alert("没有范例..."); 
				R=false;
				return;
			}
			//alert(data);
			var index = 0;
			if (jsonData.length > 0) { 
				var showExistData = "";
				
				$.each(jsonData[0], function (name, val) {
					var tmpId = "data_div_" + index;
					index++;
					if (name == "分类代码") {
						$('#id_fldm').html(val);
					} else if (name == "概念名称") {
						$('#id_gnmc').html(val);
					} else if (name == "范例名称") {
						$('#id_flmc').html(val);
					} else if (name == "属性") {
						$.each(val, function (name, val) {
							var div = $('<span>' + name + ':</span><a>' + (val==null || val == ''? '暂无' : val) + '</a>');
							div.appendTo($('#attrDiv'));
						});
					} else {
  						   if(val.exsit){
  						//     alert(name);
  						//	 alert(val.exsit);
  							showExistData = name + "," + showExistData;  							
							var div_id = '';
						//	var addInfoTab = '';
						//	var addInfoDiv = '';
							if(name == "实景全景图像"){ 
								var addInfoTab = $('<li id="QJtab">全景</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="QJingContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
								div_id = 'QJingContainer';
								bN1(tmpId, val.urls,div_id);
							}else
							if(name == "实景环绕图像"){
								var addInfoTab = $('<li id="SJtab">实景环绕</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SJHRaoContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#SJHRaoContainer').html('');
								div_id = 'SJHRaoContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SJtab');
								button.onclick=function(){
//									$('#SJHRaoContainer').html('');
//									div_id = 'SJHRaoContainer';
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "实景常规图像"){
								var addInfoTab = $('<li id="SJCGtab">实景常规</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SJCGuiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#SJCGuiContainer').html('');
								div_id = 'SJCGuiContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SJCGtab');
								button.onclick=function(){
//									$('#SJCGuiContainer').html('');
//									div_id = 'SJCGuiContainer';
//									ax1(tmpId, val.urls,div_id);
								}
							}else
							if(name == "视频"){
								var addInfoTab = $('<li id="SPtab">视频</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SPinContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
//						    	$('#SPinContainer').html('');
//								div_id = 'SPinContainer';	
//								bV1(tmpId, val.urls,div_id);
								var button=document.getElementById('SPtab');
								button.onclick=function(){
									$('#SPinContainer').html('');
									div_id = 'SPinContainer';	
									bV1(tmpId, val.urls,div_id);
								}
							//	div_id = 'SPinContainer';	
							//	bV1(tmpId, val.urls,div_id);
							}else
							if(name == "三维图像"){
								var addInfoTab = $('<li id="SWtab">三维</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SWeiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
								div_id = 'SWeiContainer';
								az1(tmpId, val.urls,div_id);
							}else
							if(name == "实景多时相图像"){
								var addInfoTab = $('<li id="SJDStab">实景多时相</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SJDSXiangContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#SJDSXiangContainer').html('');
								div_id = 'SJDSXiangContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SJDStab');
								button.onclick=function(){
//									$('#SJDSXiangContainer').html('');
//									div_id = 'SJDSXiangContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "示意图像"){
								var addInfoTab = $('<li id="SYtab">示意</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SYiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
								$('#SYiContainer').html('');
								div_id = 'SYiContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SYtab');
								button.onclick=function(){
//									$('#SYiContainer').html('');
//									div_id = 'SYiContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "实景多角度图像"){
								var addInfoTab = $('<li id="SJDJDtab">实景多角度</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SJDJDuContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
								$('#SJDJDuContainer').html('');
								div_id = 'SJDJDuContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SJDJDtab');
								button.onclick=function(){
//									$('#SJDJDuContainer').html('');
//									div_id = 'SJDJDuContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "遥感常规图像"){
								var addInfoTab = $('<li id="YGCGtab">遥感常规</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="YGCGuiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#YGCGuiContainer').html('');
								div_id = 'YGCGuiContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('YGCGtab');
								button.onclick=function(){
//									$('#YGCGuiContainer').html('');
//									div_id = 'YGCGuiContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "立体图像"){
								var addInfoTab = $('<li id="LTtab">立体</li> ');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="LTiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#LTiContainer').html('');
								div_id = 'LTiContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('LTtab');
								button.onclick=function(){
//									$('#LTiContainer').html('');
//									div_id = 'LTiContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "地形图"){
								var addInfoTab = $('<li id="DXTtab">地形图</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="DXTuContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#DXTuContainer').html('');
								div_id = 'DXTuContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('DXTtab');
								button.onclick=function(){
//									$('#DXTuContainer').html('');
//									div_id = 'DXTuContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "图式图像"){
								var addInfoTab = $('<li id="TSTXtab">图式图像</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="TSTXiangContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#TSTXiangContainer').html('');
								div_id = 'TSTXiangContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('TSTXtab');
								button.onclick=function(){
//									$('#TSTXiangContainer').html('');
//									div_id = 'TSTXiangContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "遥感多时相图像"){
								var addInfoTab = $('<li id="YGDSXtab">遥感多时相</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="YGDSXiangContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#YGDSXiangContainer').html('');
								div_id = 'YGDSXiangContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('YGDSXtab');
								button.onclick=function(){
//									$('#YGDSXiangContainer').html('');
//									div_id = 'YGDSXiangContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}
							
						}			
						
  						 $(document).ready(function(){  //标签
  						    $('#divContainer1').easyResponsiveTabs({
  						        type: 'default',
  						        width: 'auto',
  						        fit: true, // 100% fit in a container
  						        closed: 'accordion', // Start closed if in accordion view
  						        tabidentify: 'tab1',
  						        });
  						    });
					}
					
				} );
				var pShow = "该范例存在的数据类型有："+showExistData;
//			    alert(pShow);
			/*	if ($('#labelContainer').html() == '')
					$('#labelContainer').html('<div class="nodata"><a>暂无</a></div>');
				$('.linkbutton').linkbutton();
				$('.linkbutton_bold').linkbutton();
				$('.linkbutton_noneed').linkbutton();*/
			}
		}, complete: function () { am(); }
	});
	R = false;
};
function F(htmlStr) {	//	向divContainer添加相关信息
	var div = $('<div id="id_define" style="width: ' + G + ';">');
	div.html(htmlStr); 
	div.prependTo($("#divContainer"));
}; 

function ax1(id,jsonData,div_id) {	//展示图片 id:对应的范例种类标号, title：范例种类, jsonData：各图像的url
	var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
			j + '; float: left; margin:' + L + ';"></div>');
	var H = $('<div id=' + id + 
		'"style="cursor:pointer;width:100%;height:100%;overflow:hidden;"></div>');
	if (jsonData.length > 0) {
		var htmlstr = '<ul>';
		for (i = 0; i < jsonData.length; i++) {
			var ustr = jsonData[i].url;
			var urlstr = ustr.replace(".JPG", ".jpg");
			htmlstr += '<li class="' + id + '_' + i + '"><img src="Instance/' + urlstr +
				'" alt="样例' + (i + 1) + '" /></li>';
		}
		htmlstr += '</ul>';
		var T = $(htmlstr);
		T.appendTo(H);
		H.appendTo(l);
		var div_id1 = '#'+div_id;
        l.appendTo($(div_id1));
		$(H).panel(); 
		$(T).galleryView({
			transition_speed: 200,
			transition_interval: 500,
			easing: 'swing',
			show_panels: true,
			show_panel_nav: true,
			enable_overlays: false,
			panel_width: $(l).width() - 13,
			panel_height: $(l).height() - 140,
			panel_animation: 'fade', 
			panel_scale: 'fit',
			overlay_position: 'bottom',
			pan_images: true,
			pan_style: 'drag', 
			pan_smoothness: 15,
			start_frame: 1,
			show_filmstrip: true,
			show_filmstrip_nav: true,
			enable_slideshow: false,
			autoplay: false, 
			show_captions: true,
			filmstrip_size: 3,
			filmstrip_style: 'scroll',
			filmstrip_position: 'bottom',
			frame_width: 100,
			frame_height: 60,
			frame_opacity: 0.5,
			frame_scale: 'crop',
			frame_gap: 5,
			show_infobar: true,
			infobar_opacity: 1
		});
	}
};

function az1(id, jsonData,div_id) {	//	展示三维
	var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
		j + '; float: left; margin:' + L + ';"></div>');
	var H = $('<div id=' + id +
		'" style="width:1045pt;height:100%;overflow:hidden;"></div>');
	if (jsonData.length > 0) {
		var url=jsonData[0].url;
		var zipid = url.lastIndexOf(".zip");
		if(zipid>0) {
			var T = $('<iframe style="width:100%; height:100%;" src = "./threedtest/testltnone.html?url=../Instance/' +
					url + '"></iframe>');
				T.appendTo(H);
		} else {
		//var T = $('<iframe style="width:100%; height:100%;" src = "./threedtest/a_loader_collada.html?url=../Instance/' +
			var T = $('<iframe style="width:100%; height:100%;" src = "./threedtest/testlt03.html?url=../Instance/' +
				url + '"></iframe>');
			T.appendTo(H);
		}
		H.appendTo(l);
		var div_id1 = '#'+div_id;
        l.appendTo($(div_id1));
		$(H).panel();
	}
};

function bN1(id,jsonData,div_id) {	//	展示全景
    var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
        J + '; float: left; margin:' + K + ';"></div>');
  //  var H = $('<div id=' + id + ' title="' + title +
  //      '" style="width:1000pt;height:100%;overflow:hidden;"></div>');
    var H = $('<div id=' + id + 
        '" style="width:1045pt;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var T = $('<iframe style="width:100%; height:100%;" src = "qj.html?url=Instance/' 
            + jsonData[0].url + '"></iframe>');
        T.appendTo(H);
        H.appendTo(l);
        var div_id1 = '#'+div_id;
        l.appendTo($(div_id1));
        $(H).panel();
    }
};

function bV1(id, jsonData,div_id) {	//	展示视频
    var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
        j + '; float: left; margin:' + L + ';"></div>');
    var H = $('<div id=' + id +
        '" style="width:1045px;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var T = $('<iframe style="width:100%; height:100%;" src = "sp.html?url=Instance/'
            + jsonData[0].url + '"></iframe>');
        T.appendTo(H);
        H.appendTo(l);
        var div_id1 = '#'+div_id;
        l.appendTo($(div_id1));
        $(H).panel();
    }
};


function C() {	//	搜索函数
	var word=$('#id_search').val();
    if (word != '') {
//        $('#id_searchresult').datagrid('load', { gjz: $('#id_search').val() });
    	var url="searchInstanceEasy.action?word="+word;
    	window.location.href=url;
    }
};

function scrollTo(be, h) {	//	转到不同的范例种类.be:放置范例的父容器(divContainer),h:放置范例的父容器
    var mainContainer = $('#' + be), scrollToContainer = $('#' + h);
    mainContainer.animate({
        scrollTop: scrollToContainer.offset().top - mainContainer.offset().top + mainContainer.scrollTop() - 60
    }, 500);
};
function ap() {	//	展示总采集情况
    $.ajax({
        crossDomain: true,
        type: "GET",
        async: true, 
        contentType: "application/json;charset=utf-8",
        url: "http://localhost/btk/s.asmx/getStatics?jsoncallback=?",
        data: { v: 0 },
        dataType: "jsonp",
        timeout: 5000, 
        jsonpCallback: 'jsoncallback',
        error: function (x, t, e) {
        	//alert(t); 
        },
        success: function (data) {
            var jsonData = eval(data);
            $('#staticsDiv').html("总数" + jsonData[0].total + "个（" + jsonData[0].noneed +
                "个不需要采集），已采集" + jsonData[0].done + "个");
        },
        complete: function () { }
    });
}

$.extend($.fn.datagrid.methods, {
    autoMergeCells : function (jq, fields) {
        return jq.each(function () {
            var target = $(this);
            if (!fields) {
                fields = target.datagrid("getColumnFields");
            }
            var rows = target.datagrid("getRows");
            var i = 0,
            j = 0,
            temp = {};
            for (i; i < rows.length; i++) {
                var row = rows[i];
                j = 0;
                for (j; j < 1; j++) {
                    var field = fields[j];
                    var tf = temp[field];
                    if (!tf) {
                        tf = temp[field] = {};
                        tf[row[field]] = [i];
                    } else {
                        var tfv = tf[row[field]];
                        if (tfv) {
                            tfv.push(i);
                        } else {
                            tfv = tf[row[field]] = [i];
                        }
                    }
                }
            }
            $.each(temp, function (field, colunm) {
                $.each(colunm, function () {
                    var group = this;
                    
                    if (group.length > 1) {
                        var before,
                        after,
                        megerIndex = group[0];
                        for (var i = 0; i < group.length; i++) {
                            before = group[i];
                            after = group[i + 1];
                            if (after && (after - before) == 1) {
                                continue;
                            }
                            var rowspan = before - megerIndex + 1;
                            if (rowspan > 1) {
                                target.datagrid('mergeCells', {
                                    index : megerIndex,
                                    field : field,
                                    rowspan : rowspan
                                });
                            }
                            if (after && (after - before) != 1) {
                                megerIndex = after;
                            }
                        }
                    }
                });
            });
        });
    }
});

