/*
*全局变量定义文件
*引用顺序：1
*/

/*
/////////////
全局变量定义
/////////////
*/

//牙齿标志点列表
var teethPos = 
[
	[[84.5,245],[88.5,227],[78.5,261],[64.5,237],[102.5,250],[74.5,229],[101.5,235],[66.5,252],[93.5,259],[52,233],[111,252]],
	[[90.5,208],[94.5,192],[88.5,227],[69.5,202],[113.5,214],[80.5,193],[111.5,200],[74.5,218],[107.5,227],[56,197],[118,218]],
	[[97.5,170],[101.5,152],[94.5,192],[76.5,166],[120.5,175],[84.5,152],[118.5,159],[77.5,181],[114.5,192],[64,157],[124,179]],
	[[106.5,137],[109.5,123],[101.5,152],[88.5,129],[124.5,143],[98.5,123],[123.5,130],[90.5,142],[115.5,150],[76,123],[132,146]],
	[[119.5,109],[122.5,95],[109.5,123],[101.5,102],[137.5,115],[110.5,95],[135.5,103],[101.5,114],[125.5,124],[87,93],[140,116]],
	[[131.5,81],[140.5,69],[122.5,95],[119.5,70],[142.5,92],[130.5,66],[146.5,80],[116.5,80],[133.5,94],[108,61],[151,96]],
	[[153.5,63],[165.5,55],[140.5,69],[146.5,53],[160.5,71],[157.5,50],[165.5,63],[140.5,60],[150.5,73],[139,39],[166,82]],
	[[183.5,53],[201.5,51],[166.5,56],[181.5,39],[184.5,68],[194.5,41],[195.5,60],[170.5,44],[174.5,64],[180,31],[187,74]],
	[[219.5,52],[201.5,51],[235.5,56],[220.5,38],[216.5,67],[209.5,41],[207.5,61],[233.5,43],[228.5,63],[220,30],[216,74]],
	[[248.5,61],[235.5,56],[259.5,68],[255.5,51],[240.5,71],[245.5,50],[237.5,64],[261.5,59],[250.5,72],[264,40],[236,80]],
	[[269.5,81],[259.5,68],[278.5,96],[284.5,70],[256.5,90],[272.5,66],[256.5,80],[285.5,84],[268.5,95],[293,65],[250,94]],
	[[281.5,110],[278.5,96],[289.5,124],[299.5,100],[265.5,117],[290.5,95],[268.5,103],[300.5,114],[276.5,122],[311,97],[261,116]],
	[[294.5,135],[289.5,124],[299.5,150],[313.5,128],[276.5,142],[303.5,123],[280.5,130],[310.5,142],[285.5,150],[325,126],[269,143]],
	[[303.5,171],[299.5,150],[308.5,192],[326.5,163],[281.5,177],[315.5,152],[283.5,160],[324.5,181],[289.5,192],[337,162],[277,178]],
	[[308.5,210],[308.5,192],[311.5,227],[331.5,204],[287.5,216],[323.5,192],[292.5,198],[326.5,221],[295.5,227],[344,202],[283,217]],
	[[317.5,244],[311.5,227],[321.5,270],[337.5,237],[296.5,246],[327.5,228],[301.5,234],[333.5,254],[304.5,257],[350,240],[288,246]],
	[[315,311],[314,330],[313,278],[337,310],[297,310],[331,325],[298,324],[329,293],[303,293],[468,402],[372,402]],
	[[312,350],[306,369],[314,330],[334,351],[294,349],[327,371],[295,361],[330,337],[299,334],[452,463],[365,438]],
	[[298,391],[291,413],[306,369],[320,399],[280,385],[309,413],[278,401],[318,379],[289,372],[436,507],[359,474]],
	[[287,429],[278,442],[291,413],[302,438],[273,422],[291,445],[271,433],[303,422],[280,413],[420,542],[351,502]],
	[[271,456],[264,468],[278,442],[287,463],[258,447],[276,469],[259,457],[285,450],[267,442],[404,571],[341,530]],
	[[256,481],[245,488],[265,468],[268,491],[245,469],[256,492],[244,478],[270,479],[254,466],[377,600],[329,548]],
	[[234,493],[223,496],[245,488],[239,508],[230,479],[229,504],[225,486],[245,498],[238,482],[343,620],[322,555]],
	[[211,499],[201,498],[223,496],[213,512],[209,487],[204,507],[204,491],[220,505],[216,490],[315,626],[305,561]],
	[[189,499],[201,498],[179,496],[186,512],[191,488],[196,508],[197,492],[180,505],[185,492],[285,625],[292,560]],
	[[166,493],[179,496],[155,489],[162,507],[170,479],[172,504],[175,486],[156,499],[163,484],[255,620],[279,555]],
	[[143,479],[155,489],[136,469],[131,490],[157,468],[144,494],[157,479],[131,477],[146,466],[220,597],[272,549]],
	[[128,455],[136,469],[123,443],[114,462],[141,445],[124,468],[141,458],[116,450],[132,443],[197,569],[261,530]],
	[[113,429],[123,443],[109,414],[96,436],[129,422],[107,443],[130,435],[100,423],[122,413],[178,541],[252,509]],
	[[100,391],[109,414],[93,371],[81,398],[120,385],[89,412],[123,401],[81,381],[110,372],[161,500],[244,479]],
	[[88,351],[94,371],[85,331],[67,355],[105,349],[76,369],[105,361],[69,337],[101,334],[146,455],[235,441]],
	[[85,309],[85,331],[83,277],[64,310],[104,308],[69,325],[101,325],[71,295],[96,292],[134,406],[231,405]]
];

var topMidPos = [[78.5,261],[88.5,227],[94.5,190],[100.5,150],[110.5,123],[123.5,95],[140.5,68],[166.5,56],[201.5,52],[235.5,54],[260.5,68],[278.5,95],[290.5,123],[297.5,151],[309.5,191],[311.5,228],[321.5,270]];
var botMidPos = [[313,278],[314,330],[307,369],[292,413],[279,441],[265,468],[245,489],[222,496],[200,498],[179,497],[155,489],[136,470],[121,444],[109,414],[94,371],[85,331],[83,277]];

//按钮选择状态
var state = 0;

//是否绘制连接体
var isconndisped = false;

//是否允许编辑连接体
var isconnmodify = false;

//牙位选择器：选择的起始和终止牙位
var begin = -1;
var end = -1;
var current = -1;

//当前鼠标位置
var currentMousePos = [0,0];

//点击右键菜单前记录右键点击位置
var postRclickpos = [0,0];

//点击右键菜单前记录已经删除的备注条目位置信息
var remarkData = [];

//拖拽点距文本框左上角的相对位移
var measure = [0,0];

//上颌中心点坐标
var centerX = 197;
var centerY = 171;

//图片位置坐标
var picPosX1 = 200;
var picPosY1 = 150;

var picPosX2 = 200;
var picPosY2 = 400;

//存放牙齿详细信息的矩阵
var teethList = new Array();
for(var i = 0; i < 32; i++)
{
	teethList.push([0, 0, 0, 0]);
}
teethList[0][0] = teethList[15][0] = teethList[16][0] = teethList[31][0] = 2;


//存放当前连接体片段中各曲线的顶点
var quadraticTops = [];

//操作队列
var actionList = [];
var actionCursor = -1;
var LastTeethList;
var LastQuadraticTops;

//存放备注列表
var remarkList = [];

//被调整过的图层编号，以便保留handle
var adjustIndex = -2;
var adjustInnerindex = -2;

//连接体形态标识
var conntypelist = [false, false, false];

//上牙连接体中空部分边界点列表
var innerPathList = [];
var innerTopList = [];

//canvas画布对象
var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");

//画布扩大后的临时处理
for(var i = 0; i < 16; i++)
{
	for(var j = 0; j < 11; j++)
	{
		teethPos[i][j][0] += 100;
		teethPos[i][j][1] += 100;
	}
}
for(var i = 16; i < 32; i++)
{
	for(var j = 0; j < 9; j++)
	{
		teethPos[i][j][0] += 100;
		teethPos[i][j][1] += 100;
	}
}
centerX += 100;
centerY += 100;
picPosX1 += 100;
picPosY1 += 100;
picPosX2 += 100;
picPosY2 += 100;