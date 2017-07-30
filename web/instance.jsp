<%@page language="java" contentType="text/html"
	import="java.sql.*,javax.servlet.*,java.util.*,java.io.*" pageEncoding="UTF-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"  
    "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href='images/fav.ico ' rel='icon' type=‘image/x-ico’ />
    <title>地名一张图管理系统</title>
    
    
    
    <link href="OntoSys/js/easyui/themes/default/easyui.css" rel="stylesheet" type="text/css" />
    <link href="OntoSys/js/easyui/themes/icon.css" rel="stylesheet" type="text/css" />
    <link href="OntoSys/js/galleryview/css/jquery.galleryview-3.0-dev.css" rel="stylesheet" type="text/css" />
    <link href="OntoSys/js/main.css" rel="stylesheet" />
    <link href="OntoSys/css/easy-responsive-tabs.css" rel="stylesheet" />
    
    <link href="js/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link href="font-awesome/css/font-awesome.css" rel="stylesheet">
	<link href="css/plugins/social-buttons/social-buttons.css" rel="stylesheet">
	<link href="css/jquery-ui.min.css" rel="stylesheet" />
	<!--<link href="css/hummingmap.css" rel="stylesheet"/>-->
	<link href="css/kkpager.css" rel="stylesheet"/>
	<link href="css/search.css" rel="stylesheet"/>
	<!--<link href="js/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet"/>-->
	<link href="css/index.css" rel="stylesheet"/>
	<link href="css/spinkit.css" rel="stylesheet"/>
	<link href="css/jquery.autocomplete.css" rel="stylesheet"/>
	<link href="css/jquery.treeview.css" rel="stylesheet" />
	<link href="css/screen.css" rel="stylesheet" />
	<link href="css/pages/inline.style.sheet4.css" rel="stylesheet" />
	<link href="css/pages/g1m-mainpage.css" rel="stylesheet" />

	<link href="css/plugins/right-menu/context.standalone.css" rel="stylesheet" type="text/css" />
	<link href="http://www.jq22.com/jquery/bootstrap-3.3.4.css" rel="stylesheet" type="text/css" />

	<%--<script src="OntoSys/js/easyui/jquery-1.44-min.js" type="text/javascript"></script>--%>
	<%--<script src="js/jquery.js" type="text/javascript"></script>--%>
    <%--<script src="js/jquery-1.10.2.min.js"></script>--%>
	<script src="js/jquery-1.10.2.js"></script>


	<%--<script src="js/jquery-ui.min.js"></script>--%>
	<%--<script src="js/jquery.cookie.js"></script>--%>
	<%--<script src="js/jquery.treeview.js" type="text/javascript"></script>--%>
	<script src="js/jquery.autocomplete.js" type="text/javascript"></script>
	<%--<script src='data/localdata.js' type='text/javascript'></script>--%>
	<%--<script src="data/testdata.js" type="text/javascript" charset=”utf-8″></script>--%>
	<%--<script src="js/jquery.treeview.edit.js" type="text/javascript"></script>--%>
	<%--<script src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js" type="text/javascript" charset="utf-8"></script>--%>
	<script src="http://webapi.amap.com/maps?v=1.3&key=8325164e247e15eea68b59e89200988b&plugin=AMap.Transfer,AMap.Walking,AMap.Driving,AMap.PlaceSearch,AMap.ToolBar,AMap.Marker,AMap.MouseTool,AMap.PolyEditor"></script>
	<script src="http://webapi.amap.com/js/marker.js"></script>
	<script src="http://webapi.amap.com/demos/js/liteToolbar.js" type="text/javascript"></script>
	<script src="http://webapi.amap.com/ui/1.0/main.js?v=1.0.10"></script>
	<script src="http://cache.amap.com/lbs/static/es5.min.js"></script>


    <!--  <script src="OntoSys/js/easyui/jquery-1.44-min.js" type="text/javascript"></script> -->

	<script src="OntoSys/js/easyui/jquery.easyui.min.js" type="text/javascript"></script>
	<script src="OntoSys/js/galleryview/jquery.timers-1.2.js" type="text/javascript"></script>
	<script src="OntoSys/js/galleryview/jquery.easing.1.3.js" type="text/javascript"></script>
	<script src="OntoSys/js/galleryview/jquery.galleryview-3.0-dev.js" type="text/javascript"></script>
	<script src="OntoSys/js/easyResponsiveTabs.js" type="text/javascript"></script>
	<%--<script src="OntoSys/js/easyui/jquery.iDialog.js"></script>--%>
	<script src="OntoSys/js/custom2.js"></script>
	<script src="js/pages/g1m-mainpage-map.js"></script>
	<%--<script src="OntoSys/js/my/instanceLoad.js" type="text/javascript" charset="utf-8"></script>--%>

	<script src="http://www.jq22.com/jquery/bootstrap-3.3.4.js"></script>
	<!--<script src="../../../js/bootstrap/js/bootstrap.js" type="text/javascript"></script>-->
	<script src="js/plugins/right-menu/demo3.js"></script>
	<script src="js/plugins/right-menu/context.js"></script>
    
</head>
<body class="easyui-layout">
    <div id="northDiv" data-options="region:'north',border:false">
        <span><img id="icon" src="OntoSys/img/knowledge.png" /></span>
        <span>地名一张图管理系统</span>
        <span id="staticsDiv" class="statics"></span>
    </div>
    <div id="westDiv" data-options="region:'west',split:true,collapsed:false,title:'地名目录'" style="width: 350px; padding: 2px;">
        <div id="tabsDiv" class="easyui-tabs" data-options="fit:true" style="cursor:pointer">
            <div title="地名" data-options="iconCls:'icon-category',tools:'#p-tools'">
				<ul id="id_tree_type" style="margin-top: 10px;"></ul>

				<%--<div class="hm-wikiAdv">--%>

					<%--<table>--%>
						<%--<tr>--%>
							<%--<!--<td><wb:share-button appkey='2943998357' addition='simple' type='icon'></wb:share-button></td>-->--%>
							<%--<td>--%>
								<%--<div id="sidetreecontrol2"> &nbsp; <a href="#">全部收起</a> | <a href="#">全部展开</a> </div>--%>
							<%--</td>--%>
						<%--</tr>--%>
					<%--</table>--%>
					<%--<table>--%>
						<%--<tr>--%>
							<%--<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>--%>
							<%--<td>--%>
								<%--<ul class="treeview" id="tree2">--%>
						<%--<li class="expandable" id="folder2">--%>
							<%--<div class="hitarea expandable-hitarea"></div><a href="#" onclick="gotoBigType('行政区域类')">行政区域类</a>--%>
							<%--<ul style="display: none;">--%>
								<%--<li class="last">--%>
									<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a>--%>
								<%--</li>--%>
							<%--</ul>--%>
						<%--</li>--%>
						<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#" onclick="gotoBigType('非行政区域类')">非行政区域类</a></li>--%>
						<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#/index.cfm">群众自治组织类</a></li>--%>
						<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#/index.cfm">居民点类</a></li>--%>
						<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#/index.cfm">交通运输设施类</a></li>--%>
						<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#/index.cfm">水利电力设施类</a></li>--%>
						<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#/index.cfm">纪念地旅游景点类</a></li>--%>
						<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#/index.cfm">建筑物类</a></li>--%>
						<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#/index.cfm">单位类</a></li>--%>
						<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#/index.cfm">陆地水系类</a></li>--%>
						<%--<li class="last"><div class="hitarea expandable-hitarea"></div><a href="#/index.cfm">陆地地形类</a></li>--%>
					<%--</ul>--%>
							<%--</td>--%>
						<%--</tr>--%>
					<%--</table>--%>
				<%--</div>--%>
                
                
            </div>

			<div title="区划" data-options="iconCls:'icon-category',tools:'#p-tools'">
				<ul id="id_tree_dist" style="margin-top: 10px;"></ul>

				<%--<div class="hm-wikiAdv">--%>
					<%--<table>--%>
						<%--<tr>--%>
							<%--<!--<td><wb:share-button appkey='2943998357' addition='simple' type='icon'></wb:share-button></td>-->--%>
							<%--<td>--%>
								<%--<div id="sidetreecontrol1">&nbsp; <a href="#">全部收起</a> | <a href="#">全部展开</a></div>--%>
							<%--</td>--%>
						<%--</tr>--%>
					<%--</table>--%>
					<%--<!--<div class="weiboicondiv">-->--%>
						<%--<!--<wb:share-button appkey='2943998357' addition='simple' type='icon'></wb:share-button>-->--%>
					<%--<!--</div>-->--%>
					<%--<!--<div id="sidetreecontrol1" style="width:200px;height:20px;margin: 0 0 0 80px;">-->--%>
						<%--<!--<a href="#">全部收起</a> | <a href="#">全部展开</a>-->--%>
					<%--<!--</div>-->--%>
					<%--<table>--%>
						<%--<tr>--%>
							<%--<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>--%>
							<%--<td>--%>
								<%--<ul class="treeview" id="tree1">--%>
							<%--<li class="expandable" id="folder1">--%>
								<%--<div class="hitarea expandable-hitarea"></div>--%>
								<%--<a href="#">湖北省</a>--%>
								<%--<ul>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">武汉市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
												<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul>--%>
									<%--</li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">黄石市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">十堰市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">宜昌市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">襄阳市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">鄂州市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">荆门市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">孝感市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">荆州市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">黄冈市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">咸宁市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">随州市</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="expandable"><div class="hitarea expandable-hitarea"></div><a href="#">恩施土家族苗族自治州</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
									<%--<li class="last"><div class="hitarea expandable-hitarea"></div><a href="#">省直辖县级行政单位</a>--%>
										<%--<ul style="display: none;"><li class="last">--%>
											<%--<a href="#" onclick="gotoSmallType('行政区域类', '行政区域')">行政区域</a></li></ul></li>--%>
								<%--</ul>--%>
							<%--</li>--%>
						<%--</ul>--%>
							<%--</td>--%>
						<%--</tr>--%>
					<%--</table>--%>
				<%--</div>--%>
            
            </div>

			<div id="listTab" title="检索" data-options="iconCls:'icon-search'">
               <div id="searchDiv">
              	<form id="ClassCheckbox" class="otherFonts" action="searchInstance.action">
	                <h2>概念名称：<input id="input_GNMC" name="input_GNMC" type="text" /></h2>
	                <h2>分类代码：<input id="input_FLDM" name="input_FLDM" type="text" /></h2>
	        		<!--    <h2>范例名称：<input id="input_FLMC" type="text" ></input></h2>  --> 
	                <h2>负责单位：</h2><br>
	                <div class="styleDiv">
	                <select name="department" class="otherFonts">
	                    <option value="不选择">不选择</option>
	                    <option value="武汉大学">武汉大学</option>
	                    <option value="国家测绘地理信息局海南基础地理信息中心">国家测绘地理信息局海南基础地理信息中心</option>
	                    <option value="陕西测绘地理信息局">陕西测绘地理信息局</option>
	                    <option value="天津市测绘院">天津市测绘院</option>
	                </select>
	                </div>

	                <h2>采&nbsp;集&nbsp;人：</h2>
	                  <div class="styleDiv">
	                    <td>
	                        <select name="principal" class="otherFonts">
		                        <option value="">不选择</option>
		                        <optgroup label="武汉大学">
		                          <option value="罗恒">罗恒</option>
		                          <option value="雷媛">雷媛</option>
		                          <option value="颜芬">颜芬</option>
		                        </optgroup>
		                        <optgroup label="国家测绘地理信息局海南基础地理信息中心">
		                          <option value="王蓉">王蓉</option>
		                        </optgroup>
		                        <optgroup label="陕西测绘地理信息局">
		                          <option value="张三">张三</option>
		                        </optgroup>
		                        <optgroup label="天津市测绘院">
		                          <option value="王磊">王磊</option>
		                        </optgroup>
	                        </select>
	                    </td>
	                  </div>

	                <h2>范例类型：</h2><br>
	                <input class="subClassCheckbox" id="TSCG" name="TSCG" type="checkbox" value="exsit">图式图像</input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	                <input class="subClassCheckbox" id="DXCG" name="DXCG" type="checkbox" value="exsit">地形图</input><br>
	                <input class="subClassCheckbox" id="SJCG" name="SJCG" type="checkbox" value="exsit">实景常规</input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	                <input class="subClassCheckbox" id="SJQJ" name="SJQJ" type="checkbox" value="exsit">全景</input><br>
	                <input class="subClassCheckbox" id="SJHR" name="SJHR" type="checkbox" value="exsit">实景环绕</input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	                <input class="subClassCheckbox" id="SJDJ" name="SJDJ" type="checkbox" value="exsit">实景多角度</input><br>
	                <input class="subClassCheckbox" id="SJDS" name="SJDS" type="checkbox" value="exsit">实景多时相</input>&nbsp;&nbsp;
	                <input class="subClassCheckbox" id="YGCG" name="YGCG" type="checkbox" value="exsit">遥感常规</input><br>
	                <input class="subClassCheckbox" id="YGDS" name="YGDS" type="checkbox" value="exsit">遥感多时相</input>&nbsp;&nbsp;
	                <input class="subClassCheckbox" id="SWCG" name="SWCG" type="checkbox" value="exsit">三维</input><br>
	                <input class="subClassCheckbox" id="LTCG" name="LTCG" type="checkbox" value="exsit">立体</input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	                <input class="subClassCheckbox" id="SYCG" name="SYCG" type="checkbox" value="exsit">示意</input><br>
	                <input class="subClassCheckbox" id="SPCG" name="SPCG" type="checkbox" value="exsit">视频</input><br>
                </form>
                </h2>
                <button id="searchStart" type="button">开始检索</button>
              </div>  
            </div>
            
            <div title="列表" data-options="iconCls:'icon-category',tools:'#p-tools'">

				<div id="tb" style="margin-bottom: 4px; padding:2px;">
					<input id="id_search" />
				</div>

				<div id="searchresults">
					<div id="resultitems"></div>
					<div id="hm_Paginate"></div>
				</div>


               	<table id="id_searchresult" class="easyui-datagrid" data-options="toolbar:'#tb'">
                     <thead>
                        <tr>
                            <th data-options="field:'Geo_Code',width:100" align="center">分类<br>代码</th>
                            <th data-options="field:'InstanceName'" align="center">范例名称</th>
                            <th data-options="field:'InstanceId'" align="center">范例<br>序号</th>
                            <th data-options="field:'Del'" align="center" >删除</th>
                        </tr>
                    </thead>
				</table>

				<div id="hiddendiv" class="hiddendiv"></div>

				<!--
                <div id="uploadDiv">
	                <form id="form1" name="form1" action="AppUpload.do1" enctype="multipart/form-data" method="post" target="hidden_frame" >
						<table id="table1" border="1">
							<tr>
						    	<td width="160"><h2>名称:</h2></td>
						    	<td width="200"><input name="ModelName" type="text" id="ModelName" size="30"/></td>
						    </tr>
						    <tr>
						    	<td width="160"><h2>文件:</h2></td>
						      	<td width="200"><input type="file" id="Upload" name="Upload" /></td>
						    </tr>
						    <tr>
						    	<td width="160"><h2>进度:</h2></td>
						      	<td width="200" id="msg"></td>
						    </tr>
						</table>
						<input type="button" id="submit0" name="submit0" value="上传" onclick="fSubmit();"/>
						<iframe name='hidden_frame' id="hidden_frame" style='display:none'></iframe>
					</form>
                </div>
               --> 

            </div>

        </div>
        <div id="p-tools">
            <a href="javascript:void(0)" class="icon-mini-refresh" onclick="reloadTree();"></a>
        </div>
    </div>
    <div id="centerDiv" data-options="region:'center',title:'地名一张图'" style="padding: 6px; overflow-y: scroll">
        <div class="floatDiv" id="floatDiv">
            <%--<div class="jbsx1">--%>
                <%--<span>概念名称：</span>--%>
                <%--<a id="id_gnmc"></a>--%>
                <%--<span>分类代码：</span>--%>
                <%--<a id="id_fldm"></a>--%>
                <%--<span>范例名称：</span>--%>
                <%--<a id="id_flmc"></a>--%>
            <%--</div>--%>
            <%--<div class="jbsx2" id="attrDiv">--%>
            <%--</div>--%>
          <!--     <div id="labelContainer"></div> -->
        </div>
        
        <div id="mapContainer" style="width:100%; height: 93%"></div>
		<div class='button-group' style="background-color: #0d9bf2;right: 20px">
			<input type="checkbox" checked="checked" onclick="placesCheckBox(this)"/>地名
			<input type="checkbox" id="toolbar" onclick="distsCheckBox(this)"/>行政区
			<input type="checkbox" id="toolbarDirection" onclick="boundsCheckBox(this)"/>行政界线
			<input type="checkbox" id="toolbarRuler" onclick="boundMarksCheckBox(this)"/>界桩、界碑
			<input type="checkbox" id="overview" disabled/>显示鹰眼
			<input type="checkbox" id="overviewOpen" disabled />展开鹰眼
		</div>
      <!--  <div id="divContainer">  -->  
        <div id="divContainer1">
        	
          <ul id=tabs class="resp-tabs-list tabContainer tab1"></ul>
          <div id="AllContainer" class="resp-tabs-container tab1"></div>
         <!-- <div id="divContainer"></div> -->   
    	</div>

		<div id="dlg" class="easyui-dialog" title="详情" data-options="iconCls:'icon-save',closed:true" style="width:600px;height:420px;">
			<div id="dlg_content"></div>
		</div>
		<div data-options="region:'south',border:false" style="text-align: center; vertical-align: middle; font-size: 10pt;">
			Copyright &copy; 2017 武汉睿数信息技术有限公司. All Rights Reserved
		</div>

	</div>
    
    
	<%--<script src="js/echarts/echarts-all.js" type="text/javascript" ></script>--%>
	<%--<script src="js/require.js" data-main="js/main" ></script>--%>

    
</body>

</html>