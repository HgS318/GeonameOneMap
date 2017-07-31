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
            </div>

			<div title="区划" data-options="iconCls:'icon-category',tools:'#p-tools'">
				<ul id="id_tree_dist" style="margin-top: 10px;"></ul>
            </div>

			<div id="listTab" title="检索" data-options="iconCls:'icon-search'">

               <div id="searchDiv" class="searchDiv">

				   <form id="ClassCheckbox1" class="ClassCheckbox" action="searchInstance.action">

					   <div id="highsearch">
						   <div id="mapextent">
							   <h3><input type="checkbox" id="mapextentcheckbox" onclick="toChooseMapExtent(this)"/>&nbsp;选择地图范围</h3>
								<div id="mapextentdone" class="nextTab" style="display: none">范围未选择</div>
						   </div>
						   <div id="choosegrade">
							   <h3><input type="checkbox" id="gradecheckbox" checked onclick="toChooseGrade(this)"/>行政等级</h3>
							   <div id="gradecheckboxes" class="nextTab">
								   <input type="checkbox" id="provincecheckbox" checked="checked" onclick=""/>省级
								   <input type="checkbox" id="citycheckbox" checked="checked" onclick=""/>地级
								   <input type="checkbox" id="countycheckbox" checked="checked" onclick=""/>县级
								   <input type="checkbox" id="streetcheckbox" checked="checked" onclick=""/>街道、乡镇级
							   </div>
						   </div>

						   <div id="choosedists">

								<h3><input type="checkbox" id="distscheckbox" checked onclick="toChooseDist(this)"/>&nbsp;所在地区</h3>
							   <div id="distscheckboxes" class="nextTab">
								   <input type="checkbox" id="whcheckbox" onclick=""/>武汉市 &nbsp;
								   <input type="checkbox" id="hscheckbox" onclick=""/>黄石市 &nbsp;
								   <input type="checkbox" id="sycheckbox" onclick=""/>十堰市<br/>
								   <input type="checkbox" id="yccheckbox" onclick=""/>宜昌市 &nbsp;
								   <input type="checkbox" id="xycheckbox" onclick=""/>襄阳市 &nbsp;
								   <input type="checkbox" id="ezcheckbox" onclick=""/>鄂州市<br/>
								   <input type="checkbox" id="jmcheckbox" onclick=""/>荆门市 &nbsp;
								   <input type="checkbox" id="xgcheckbox" onclick=""/>孝感市 &nbsp;
								   <input type="checkbox" id="jzcheckbox" onclick=""/>荆州市<br/>
								   <input type="checkbox" id="hgcheckbox" onclick=""/>黄冈市 &nbsp;
								   <input type="checkbox" id="xjcheckbox" onclick=""/>咸宁市 &nbsp;
								   <input type="checkbox" id="szcheckbox" onclick=""/>随州市<br/>
								   <input type="checkbox" id="escheckbox" onclick=""/>恩施土家族苗族自治州<br/>
								   <input type="checkbox" id="zxcheckbox" onclick=""/>省直辖县级行政单位
							   </div>
						   </div>

						   <div id="choosetime">
							   <h3><input type="checkbox" id="timecheckbox" onclick="toChooseTime(this)"/>&nbsp;时间</h3>
							   <div id="choosetimeitmes" class="nextTab" style="display: none">
								   <%--入库时间<input id="intotimeinput" type="text"/>--%>
								   <%--更新时间<input id="updatetimeinput" type="text" />--%>
									   <p>起始时间 <input id="starttime" type="text" class="easyui-datebox" required="required"></p>
									   <p>截止时间 <input id="endtime" type="text" class="easyui-datebox" required="required"></p>
							   </div>

						   </div>

						   <div id="geonamesearch">
							   <h3><input type="checkbox" id="geonamecheckbox" checked="checked" onclick="toSearchGeonames(this)"/>&nbsp;地名</h3>
							   <div id="geoitems" class="nextTab">
								   <p>关键词：<input id="geonameword" type="text" class="innerWord" /></p>
								   <p>地名类型
								   <select id="bigtype" class="otherFonts" size="1" onChange="chooseType(this.options.selectedIndex)">
									   <option value="">行政区域类</option>
									   <option value="">非行政区域类</option>
									   <option value="">群众自治组织类</option>
									   <option value="">居民点类</option>
									   <option value="">交通运输设施类</option>
									   <option value="">交通运输设施类</option>
									   <option value="">纪念地旅游景点类</option>
									   <option value="">建筑物类</option>
									   <option value="">单位类</option>
									   <option value="">陆地水系类</option>
									   <option value="">陆地地形类</option>
								   </select>
									   </p>
								   <p><input type="checkbox" id="geonamemmcheckbox" onclick=""/>包含多媒体信息</p>
							   </div>

						   </div>

						   <div id="distsearch">
							   <h3><input type="checkbox" id="distcheckbox" onclick="toSearchDists(this)"/>&nbsp;行政区</h3>
							   <div id="distitems" class="nextTab">
								   <p>关键词：<input id="distword" class="innerWord"/></p>
								   <p><input type="checkbox" id="distmmcheckbox" onclick=""/>包含多媒体信息</p>
							   </div>
						   </div>

						   <div id="boundsearch">
							   <h3><input type="checkbox" id="boundcheckbox" onclick="toSearchBounds(this)"/>&nbsp;界线</h3>
							   <div id="bounditems" class="nextTab">
								   <p>关键词：<input id="boundword" class="innerWord" /></p>
								   <p><input type="checkbox" id="boundmmcheckbox" onclick=""/>包含多媒体信息</p>
							   </div>
						   </div>

						   <div id="boundmarkersearch">
							   <h3><input type="checkbox" id="boundmarkercheckbox" onclick="toSearchBoundMarkers(this)"/>&nbsp;界桩、界碑</h3>
							   <div id="boundmarkeritems" class="nextTab">
								   <p>关键词：<input id="boundmarkerword" class="innerWord" /></p>
								   <p>类型：

									   <input type="checkbox" id="stonecheckbox" checked="checked" onclick=""/>界桩 &nbsp;
									   <input type="checkbox" id="tabletcheckbox" checked="checked" onclick=""/>界碑

								   </p>
								   <input type="checkbox" id="boundmarkermmcheckbox" onclick=""/>包含多媒体信息
							   </div>

						   </div>
					   </div>


				   </form>

				   <%--<div id="tb" style="margin-bottom: 4px; padding:2px;">--%>
					   <%--<input id="id_search" />--%>
				   <%--</div>--%>

				   <%--<table id="id_searchresult" class="easyui-datagrid" data-options="toolbar:'#tb'">--%>
					   <%--<thead>--%>
					   <%--<tr>--%>
						   <%--<th data-options="field:'Geo_Code',width:100" align="center">分类<br>代码</th>--%>
						   <%--<th data-options="field:'InstanceName'" align="center">范例名称</th>--%>
						   <%--<th data-options="field:'InstanceId'" align="center">范例<br>序号</th>--%>
						   <%--<th data-options="field:'Del'" align="center" >删除</th>--%>
					   <%--</tr>--%>
					   <%--</thead>--%>
				   <%--</table>--%>
                <button id="searchStart" type="button">开始检索</button>
              </div>  
            </div>
            
            <div title="列表" data-options="iconCls:'icon-category',tools:'#p-tools'">

				<div id="searchresults">
					<div id="resultitems"></div>
					<div id="hm_Paginate"></div>
				</div>

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