
var placenickname = null;
var orgX, orgY, orgPath;
var orgData;
var spaType;
var feature;
var editorTool;
var map;
var editor;
var editing = false;
var picUploaders = new Array();
var singlePicInfoArray = [
    ["DXCG", "地形图", 455],
    ["TSCG", "图式图像", 160],
    ["SJCG", "实景图片", 564],
    ["SJQJ", "实景全景", 800],
    ["SJHR", "实景环绕", 700],
    ["YGCG", "遥感图像", 700],
    ["LTCG", "立体图像", 700],
    ["SYCG", "示意图像", 700]
];
var multiPicInfoArray = [
    ["SJDJ", "实景多角度", 700],
    ["SJDS", "实景多时相", 219],
    ["YGDS", "遥感多时相", 720]
];

function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

$(function() {

    var placename = getQueryString("name");
    var url;
    if(placename && ""!= placename) {
        url = 'getDistInfoByNickname.action?name=' + placename;
        placenickname = placename;
    } else {
        var idst = getQueryString("id");
        url = 'getDistInfoByNum.action?id=' + idst;
    }

    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            orgData = data;
            if(placenickname == null) {
                placenickname = data.nickname;
            }
            consPicsListContent(placename, data);
            // mapInit(data);
            consMainContent(data);

            consUploaders(data);

        },
        error: function (data) {
        }
    });
});

function consUploaders(data) {
    var picInfoArr = singlePicInfoArray.concat(multiPicInfoArray);
    for(var i = 0; i < picInfoArr.length; i++) {
        var typecode = picInfoArr[i][0];
        var typename = picInfoArr[i][1];
        var picnum = parseInt(data[typecode]);
        var uploader = uploadImage({
            wrap: jQuery("#uploader" + typecode), //包裹整个上传控件的元素，必须。可以传递dom元素、选择器、jQuery对象
            /*预览图片的宽度，可以不传，如果宽高都不传则为包裹预览图的元素宽度，高度自动计算*/
            //width: "160px",
            height: 150,//预览图片的高度
            auto: false, //是否自动上传
            method: "POST",//上传方式，可以有POST、GET
            sendAsBlob: false,//是否以二进制流的形式发送
            viewImgHorizontal: true,//预览图是否水平垂直居中
            fileVal: "file", // [默认值：'file'] 设置文件上传域的name。
            btns: {//必须
                uploadBtn: $("#upload_now" + typecode), //开始上传按钮，必须。可以传递dom元素、选择器、jQuery对象
                retryBtn: null, //用户自定义"重新上传"按钮
                chooseBtn: '#choose_file_' + typecode,//"选折图片"按钮，必须。可以传递dom元素、选择器、jQuery对象
                chooseBtnText: "选择本地图片" //选择文件按钮显示的文字
            },
            pictureOnly: true,//只能上传图片
            datas: {
                "uuid": new Date().getTime()
            }, //上传的参数,如果有参数则必须是一个对象
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！false为不压缩
            resize: false,
            //是否可以重复上传，即上传一张图片后还可以再次上传。默认是不可以的，false为不可以，true为可以
            duplicate: false,
            multiple: true, //是否支持多选能力
            swf: "Uploader.swf", //swf文件路径，必须
            url: "index2.html", //图片上传的路径，必须
            maxFileNum: 20, //最大上传文件个数
            maxFileTotalSize: 10485760, //最大上传文件大小，默认10M
            maxFileSize: 2097152, //单个文件最大大小，默认2M
            showToolBtn: true, //当鼠标放在图片上时是否显示工具按钮,
            onFileAdd: null, //当有图片进来后所处理函数
            onDelete: null, //当预览图销毁时所处理函数
            /*当单个文件上传失败时执行的函数，会传入当前显示图片的包裹元素，以便用户操作这个元素*/
            uploadFailTip: null,
            onError: null, //上传出错时执行的函数
            notSupport: null, //当浏览器不支持该插件时所执行的函数
            /*当上传成功（此处的上传成功指的是上传图片请求成功，并非图片真正上传到服务器）后所执行的函数，会传入当前状态及上一个状态*/
            onSuccess: null
        });
        for(var j = 0; j < picnum; j++) {
            var picpath;
            if(i < singlePicInfoArray.length) {
                picpath = "../data/wikiContent/place/" + placenickname + "/" +
                    placenickname + typename + ".jpg";
            } else{
                picpath = "../data/wikiContent/place/" + placenickname + "/" +
                    placenickname + typename + (j + 1) + ".jpg";
            }
//						var fso = new ActiveXObject("Scripting.FileSystemObject");
//						var file = fso.GetFile(picpath);
//						uploader.onFileQueued(file);
            uploader.onInitImg(picpath, typecode + "def" + (j + 1));
        }

        /*如果按钮开始是隐藏的，经过触发后才显示，则可以用这个方法重新渲染下*/
        //uploader.refresh();//该方法可以重新渲染选择文件按钮
        //uploader.upload();//调用该方法可以直接上传图片
        //uploader.retry();//调用该方法可以重新上传图片
        //console.log(uploader);
        picUploaders.push(uploader);
    }
}

function consBasicCotent(data, attaname, divname) {
    if(data[attaname]) {
        document.getElementById(divname).value = data[attaname];
    }
}

function consDetailedContent(data, attaname, divname) {
    if(data[attaname]) {
        var org = data[attaname];
        var str = org.replace(/\<br\/\>/g,"\r\n &nbsp;&nbsp;&nbsp;&nbsp;");
//			str = str.replace(/\n/g,"<br>&nbsp;&nbsp;&nbsp;&nbsp;");
        document.getElementById(divname).innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + str;
    }
}

function consMainContent(data) {

    var name = data['name'];
    document.title = "修改行政区域 - " + name;
    var bc = data['大类'],sc = data['小类'];
    var upDist = data['上级行政区'];
    document.getElementById("name0").setAttribute("value", name);
    document.getElementById("doctitle").innerHTML = "修改行政区域 - " + name;
    document.getElementById("bigclass1").innerHTML = sc;
    document.getElementById("smallclass1").innerHTML = upDist;
    document.getElementById("bigclass2").innerHTML = sc;
    document.getElementById("smallclass2").innerHTML = upDist;
    document.getElementById("name2").innerHTML = name;
    document.getElementById("smallclass3").innerHTML = upDist;

    consBasicCotent(data, "标准名称", "stdname");
    // consBasicCotent(data, "nickname", "nicktext");
    consBasicCotent(data, "ChnSpell", "chnSpell");
    consBasicCotent(data, "上级行政区", "superdist");
    consBasicCotent(data, "下级行政区", "subdists");

    // consBasicCotent(data, "所在跨行政区","indist");
    // consBasicCotent(data, "比例尺","scale");
    // consBasicCotent(data, "图名图号年版","mapname");
    // consBasicCotent(data, "使用时间","usetime");
    consBasicCotent(data, "普查状态","instate");
    consBasicCotent(data, "设立年份","setyear");
    // consBasicCotent(data, "废止年份","endyear");
    // consBasicCotent(data, "东经","east");
    // consBasicCotent(data, "至东经","toeast");
    // consBasicCotent(data, "北纬","north");
    // consBasicCotent(data, "至北纬","tonorth");
    // consBasicCotent(data, "坐标系","coo");
    // consBasicCotent(data, "测量方法","method");
    consBasicCotent(data, "政府驻地", "govplace");
    consBasicCotent(data, "政府网址", "govwebsite");
    consBasicCotent(data, "总面积", "totalarea");
    consBasicCotent(data, "电话区号", "areatelcode");
    consBasicCotent(data, "邮政编码", "postcode");
    consBasicCotent(data, "政府驻地人口", "centerpop");

    consDetailedContent(data, "地名含义","hanyi");
    consDetailedContent(data, "地理位置","geopos");
    consDetailedContent(data, "民族构成","nations");
    consDetailedContent(data, "主要工业","indus");
    consDetailedContent(data, "主要农业","argui");
    consDetailedContent(data, "著名历史人物","hispeople");
    consDetailedContent(data, "主要农业","argui");
    // consDetailedContent(data, "地名来历","laili");
    consDetailedContent(data, "历史沿革","yange");
    consDetailedContent(data, "地理实体描述","miaoshu");
    consDetailedContent(data, "资料来源及出处","ziliao");

}

function consPicsListContent(placename, data) {

    var sharp = 7;

    for(var i = 0; i < singlePicInfoArray.length; i++) {
        var info = singlePicInfoArray[i];
        consListContent(placename, ++sharp, info[0], info[1], info[2]);
    }

    for(var i = 0; i < multiPicInfoArray.length; i++) {
        var info = multiPicInfoArray[i];
        var typecode = info[0];
        var num = data[typecode];
        consListMultiContent(placename, ++sharp, typecode, info[1], info[2]);
    }

////		if(data.DXCG) {
//			consListContent(placename, ++sharp, "DXCG", "地形图", 455);
////		}
////		if(data.TSCG) {
//			consListContent(placename, ++sharp, "TSCG", "图式图像", 160);
////		}
////		if(data.SJCG) {
//			consListContent(placename, ++sharp, "SJCG", "实景图片", 564);
////		}
////		if(data.SJQJ) {
//			consListContent(placename, ++sharp, "SJQJ", "实景全景", 800);
////		}
////		if(data.SJHR) {
//			consListContent(placename, ++sharp, "SJHR", "实景环绕", 700);
////		}
////		if(data.SJDJ) {
//			consListMultiContent(placename, ++sharp, "SJDJ", "实景多角度", 700, 2);
////		}
////		if(data.SJDS) {
//			consListMultiContent(placename, ++sharp, "SJDS", "实景多时相", 219, 2);
////		}
////		if(data.YGCG) {
//			consListContent(placename, ++sharp, "YGCG", "遥感图像", 700);
////		}
////		if(data.YGDS) {
//			consListMultiContent(placename, ++sharp, "YGDS", "遥感多时相", 720, 2);
////		}
////		if(data.LTCG) {
//			consListContent(placename, ++sharp, "LTCG", "立体图像", 700);
////		}
////		if(data.SYCG) {
//			consListContent(placename, ++sharp, "SYCG", "示意图像", 700);
////		}

}

function consListContent(nickname, sharp, typecode, typename, fwitdh) {
    var lis = consListItem(sharp, typename);
    document.getElementById("hidesection").innerHTML += lis;
    var cont = consPicCont(nickname, sharp, typecode, typename, fwitdh);
    document.getElementById("details").innerHTML += cont;
}

function consListMultiContent(nickname, sharp, typecode, typename, fwitdh, numStr) {
    var lis = consListItem(sharp, typename);
    document.getElementById("hidesection").innerHTML += lis;
//		var cont = consMultiPicCont(nickname, sharp, typecode, typename, fwitdh, numStr);
    var cont = consPicCont(nickname, sharp, typecode, typename, fwitdh);
    document.getElementById("details").innerHTML += cont;
}

function consListItem(sharp, typename) {
    var str = "<li style=\"display:none\">&#8226; <a href=\"#" + sharp +"\">" + typename + "</a></li>";
    return str;
}

function consPicCont(nickname, sharp, typecode, typename, fwitdh) {

    var url1 = "../data/wikiContent/place/" + nickname + "/" + nickname + typename + ".jpg";
    var str1 = "<h3><span class='texts'>"+ typename + "</span>";
    var str2 =	"<a name='" + sharp + "'></a> <a href='#section'>回目录</a></h3>";
//		var str3 =	"<div class='content_topp'><p></p><p></p>" + "<div class='img img_l' style='width: " + fwitdh +"px;'>";
//		var reg1 = new RegExp("typename","g"); //创建正则RegExp对象
//		var reg2 = new RegExp("url1","g"); //创建正则RegExp对象
//		var str4tmp = "<a title='typename' href='url1' target='_blank'><img title='typename' alt='typename' src='url1' /></a>";
//		var str4tmp1 = str4tmp.replace(reg1, typename);
//		var str4 = str4tmp1.replace(reg2, url1);
//		var str5 = "<span style='clear: both; display: block; padding-top: 10px; color: rgb(51, 51, 51);'>"
//				+typename+"</span></div></div>";

//		var recon = str1 + str2 + str3 + str4 + str5;
//		return recon;

    var str4 = "<div id='uploader" + typecode + "'></div> <div class='choose-file-btn' id='choose_file_" +
        typecode + "'>选择图片</div> <button type='button' id='upload_now" + typecode +
        "'>上传图片</button>";


    var recon = str1 + str2 + str4;
    return recon;


}

function consMultiPicCont(nickname, sharp, typecode, typename, fwitdh, numStr) {

    var str1 = "<h3><span class='texts'>"+ typename + "</span>";
    var str2 =	"<a name='" + sharp + "'></a> <a href='#section'>回目录</a></h3>";
    var str3 =	"<div class='content_topp'><p></p><p></p>";
    var reg1 = new RegExp("typename","g"); //创建正则RegExp对象
    var mul = "";
    var num = parseInt(numStr);
    for(var i = 0; i < num; i++) {
        var url = "../data/wikiContent/place/" + nickname + "/" + nickname + typename + (i+1) + ".jpg";
        var reg = new RegExp("url","g"); //创建正则RegExp对象
        var s1 = "<div class='img img_l' style='width: " + fwitdh +"px;'>";
        var s2tmp = "<a title='typename' href='url' target='_blank'><img title='typename' alt='typename' src='url' /></a>";
        var s2tmp1 = s2tmp.replace(reg1, typename);
        var s2 = s2tmp1.replace(reg, url);
        var s3 = "<span style='clear: both; display: block; padding-top: 10px; color: rgb(51, 51, 51);'>"
            +typename+"</span></div>";
        mul += (s1 + s2 + s3);
    }
    var str5 = "</div>";
    var recon = str1 + str2 + str3 + mul + str5;
    return recon;
}

function partsection(){
    $('#fullsection').css('display','block');
    $('#partsection').css('display','none');
    $("#hidesection > li:gt(3)").css('display','none');
}

function fullsection(){
    $('#fullsection').css('display','none');
    $('#partsection').css('display','block');
    $("#hidesection > li:gt(3)").css('display','block');
}


