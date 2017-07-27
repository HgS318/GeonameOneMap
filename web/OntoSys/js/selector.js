// $(document).ready(function () {
//     $('#horizontalTab').easyResponsiveTabs({
//         type: 'default', //Types: default, vertical, accordion
//         width: 'auto', //auto or any width like 600px
//         fit: true, // 100% fit in a container
//         closed: 'accordion', // Start closed if in accordion view
//         activate: function(event) { // Callback function if tab is switched
//             var $tab = $(this);
//             var $info = $('#tabInfo');
//             var $name = $('span', $info);
//             $name.text($tab.text());
//             $info.show();
//         }
//     });
//     $('#cmt').easyResponsiveTabs({
//         type: 'vertical',
//         width: 'auto',
//         fit: true,
//     });
// });

var gma,gca,gsha,g,gre,gsp,gme,gfu;
var groupma,groupca,groupsha,group,groupre,groupsp,groupme,groupfu;
var tempma,tempca,tempsha,temp,tempre,tempsp,tempme,tempfu;
var selma,selca,selsha,sel,selre,selsp,selme,selfu;
var maId=0,caId=0,shaId=0,tId=0,reId=0,spId=0,meId=0,fuId=0;

// function loaded(){
//
//     $('#menu-container .testimonial').fadeOut(10);
//     $('#menu-container .testimonial').fadeIn(1000);
$(document).ready(function () {
    // gma = document.form1.material1.options.length; //获取物质性的第一个下拉列表的长度
    gma = 15;
    groupma = new Array(gma); //
    for (i = 0; i < gma; i++) {
        groupma[i] = new Array();
    }
    groupma[0][0] = new Option("不选择", ""); //一维数组变成二维数组
    groupma[1][0] = new Option("不选择", "");
    groupma[1][1] = new Option("石材", "石材");
    groupma[1][2] = new Option("砖", "砖");
    groupma[1][3] = new Option("木材", "木材");
    groupma[1][4] = new Option("竹材", "竹材");
    groupma[1][5] = new Option("水泥", "水泥");
    groupma[1][6] = new Option("铁", "铁");
    groupma[2][0] = new Option("不选择", "");
    groupma[2][1] = new Option("植物", "植物");
    groupma[2][2] = new Option("草本植物", "草本植物");
    groupma[2][3] = new Option("木本植物", "木本植物");
    groupma[2][4] = new Option("红树林", "红树林");
    groupma[3][0] = new Option("不选择", "");
    groupma[3][1] = new Option("泥", "泥");
    groupma[3][2] = new Option("黄土", "黄土");
    groupma[3][3] = new Option("沙", "沙");
    groupma[3][4] = new Option("砾", "砾");
    groupma[3][5] = new Option("石", "石");
    groupma[3][6] = new Option("土", "土");
    groupma[3][7] = new Option("岩", "岩");
    groupma[3][8] = new Option("熔岩", "熔岩");
    groupma[3][9] = new Option("珊瑚灰质", "珊瑚灰质");
    groupma[3][10] = new Option("盐", "盐");
    groupma[3][11] = new Option("碱", "碱");
    groupma[4][0] = new Option("不选择", "");
    groupma[4][1] = new Option("雪", "雪");
    groupma[4][2] = new Option("粒雪", "粒雪");
    groupma[4][3] = new Option("冰", "冰");
    groupma[5][0] = new Option("其它", "其它");
    selma = document.getElementById("bigtype");
    tempma = document.getElementById("smalltype");


    // redirectma(maId);


 });



//------------------------------------------------------------------------------------------
function redirectma(x){
    maId = x;
    selma.options[x].selected=true;
    for (var m = tempma.options.length - 1; m > 0; m--) {
        tempma.options[m] = null;  //清空选项
    }
    for (var i = 0; i < groupma[maId].length; i++) {
        tempma.options[i]=new Option(groupma[maId][i].text, groupma[maId][i].value);
    }
    tempma.options[0].selected=true ;
}
