/**
 * 2016 Xin Fang 
 * version 3.0
 * V1功能：缺失标记、完整基托、舌侧基托、普通三臂卡环、连接体简单绘制
 * V2功能：连接体抛物线可调整、可撤销/重做（10步）
 * V3：根据新需求，更改牙列图、牙列参照点坐标数据结构，使用新结构、新需求绘制：缺失双线、基托
 * V4：根据新需求，去掉卡环图片，用图形化方式表示支托和卡环
 * V5：根据新需求，重写连接体绘制方法（包括连接体的调整，调整功能有待调试）
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
	[[97.5,170],[101.5,152],[94.5,190],[76.5,166],[120.5,175],[84.5,152],[118.5,159],[77.5,181],[114.5,192],[64,157],[124,179]],
	[[106.5,137],[109.5,123],[100.5,150],[88.5,129],[124.5,143],[98.5,123],[123.5,130],[90.5,142],[115.5,150],[76,123],[132,146]],
	[[119.5,109],[122.5,95],[110.5,123],[101.5,102],[137.5,115],[110.5,95],[135.5,103],[101.5,114],[125.5,124],[87,93],[140,116]],
	[[131.5,81],[140.5,69],[123.5,95],[119.5,70],[142.5,92],[130.5,66],[146.5,80],[116.5,80],[133.5,94],[108,61],[151,96]],
	[[153.5,63],[165.5,55],[140.5,68],[146.5,53],[160.5,71],[157.5,50],[165.5,63],[140.5,60],[150.5,73],[139,39],[166,82]],
	[[183.5,53],[201.5,51],[166.5,56],[181.5,39],[184.5,68],[194.5,41],[195.5,60],[170.5,44],[174.5,64],[180,31],[187,74]],
	[[219.5,52],[201.5,52],[235.5,56],[220.5,38],[216.5,67],[209.5,41],[207.5,61],[233.5,43],[228.5,63],[220,30],[216,74]],
	[[248.5,61],[235.5,54],[259.5,68],[255.5,51],[240.5,71],[245.5,50],[237.5,64],[261.5,59],[250.5,72],[264,40],[236,80]],
	[[269.5,81],[260.5,68],[278.5,96],[284.5,70],[256.5,90],[272.5,66],[256.5,80],[285.5,84],[268.5,95],[293,65],[250,94]],
	[[281.5,110],[278.5,95],[289.5,124],[299.5,100],[265.5,117],[290.5,95],[268.5,103],[300.5,114],[276.5,122],[311,97],[261,116]],
	[[294.5,135],[290.5,123],[299.5,150],[313.5,128],[276.5,142],[303.5,123],[280.5,130],[310.5,142],[285.5,150],[325,126],[269,143]],
	[[303.5,171],[297.5,151],[308.5,192],[326.5,163],[281.5,177],[315.5,152],[283.5,160],[324.5,181],[289.5,192],[337,162],[277,178]],
	[[308.5,210],[309.5,191],[311.5,227],[331.5,204],[287.5,216],[323.5,192],[292.5,198],[326.5,221],[295.5,227],[344,202],[283,217]],
	[[317.5,244],[311.5,228],[321.5,270],[337.5,237],[296.5,246],[327.5,228],[301.5,234],[333.5,254],[304.5,257],[350,240],[288,246]],
	[[315,311],[314,330],[313,278],[337,310],[297,310],[331,325],[298,324],[329,293],[303,293],[345,308.6],[288,309.6]],
	[[312,350],[306,369],[314,330],[334,351],[294,349],[327,371],[295,361],[330,337],[299,334],[343,351.6],[282,350.6]],
	[[298,391],[291,413],[307,369],[320,399],[280,385],[309,413],[278,401],[318,379],[289,372],[330,399.6],[272,383.6]],
	[[287,429],[278,442],[292,413],[302,438],[273,422],[291,445],[271,433],[303,422],[280,413],[313,437.6],[262,418.6]],
	[[271,456],[264,468],[279,441],[287,463],[258,447],[276,469],[259,457],[285,450],[267,442],[296,466.6],[251,442.6]],
	[[256,481],[245,488],[265,468],[268,491],[245,469],[256,492],[244,478],[270,479],[254,466],[274,495.6],[240,463.6]],
	[[234,493],[223,496],[245,489],[239,508],[230,479],[229,504],[225,486],[245,498],[238,482],[243,515.6],[228,474.6]],
	[[211,499],[201,498],[222,496],[213,512],[209,487],[204,507],[204,491],[220,505],[216,490],[214,518.6],[208,481.6]],
	[[189,499],[200,498],[179,496],[186,512],[191,488],[196,508],[197,492],[180,505],[185,492],[187,519.6],[190,482.6]],
	[[166,493],[179,497],[155,489],[162,507],[170,479],[172,504],[175,486],[156,499],[163,484],[156,515.6],[173,473.6]],
	[[143,479],[155,489],[136,469],[131,490],[157,468],[144,494],[157,479],[131,477],[146,466],[124,497.6],[161,464.6]],
	[[128,455],[136,470],[123,443],[114,462],[141,445],[124,468],[141,458],[116,450],[132,443],[104,471.6],[147,442.6]],
	[[113,429],[121,444],[109,414],[96,436],[129,422],[107,443],[130,435],[100,423],[122,413],[88,442.6],[136,418.6]],
	[[100,391],[109,414],[93,371],[81,398],[120,385],[89,412],[123,401],[81,381],[110,372],[71,400.6],[127,383.6]],
	[[88,351],[94,371],[85,331],[67,355],[105,349],[76,369],[105,361],[69,337],[101,334],[57,356.6],[118,349.6]],
	[[85,309],[85,331],[83,277],[64,310],[104,308],[69,325],[101,325],[71,295],[96,292],[55,311.6],[112,308.6]]
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

//当前被选中的牙齿列表
var selectList = new Array();

//存放牙齿详细信息的矩阵
var teethList = new Array();
for(var i = 0; i < 32; i++)
{
	teethList.push([0, 0, 0, 0]);
}
teethList[0][0] = teethList[15][0] = teethList[16][0] = teethList[31][0] = 2;


//存放当前连接体片段中各二次曲线的顶点
var quadraticTops = [];

//操作队列
var actionList = [];
var actionCursor = -1;
var LastTeethList = deepCopy(teethList);
var LastQuadraticTops = deepCopy(quadraticTops);


for(var i = 0; i < 32; i++)
{
	for(var j = 0; j < 11; j++)
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

var remarkList = [[[0,0], [90, 100], '这是一个示例示例变长了\n示例变高了', [0,0]]];

/*
////////////////////////////////////////
初始化动作：建立canvas对象，绘制基本牙列
////////////////////////////////////////
*/
var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");
loadteethmap(teethList);
document.oncontextmenu = function(e){ 
	return false; 
};




/*
/////////////////////////////////////////
绘图函数：实际在画布上进行绘制的各类函数
/////////////////////////////////////////
*/

//绘制备注
function drawRemark(remarkpos, linepos, content, ID)
{
	var obj = {
		type: 'text', 
		mID: ID, 
		name: 'tempRemark', 
		layser: true,
		fillStyle: '#000000',
		draggable: true,
		fontSize: '10pt',
		fontFamily: 'Trebuchet MS, sans-serif',
		text: content,
		x: remarkpos[0], y: remarkpos[1],
		align: 'left',
		maxWidth: 50,
	};
	$('canvas').addLayer(obj).drawLayers();
	var twidth = $('canvas').measureText('tempRemark').width;
	var theight = $('canvas').measureText('tempRemark').height;
	obj.name = content;
	obj.x += twidth/2;
	obj.y += theight/2;
	obj.dragstart = function(){
		measure[0] = currentMousePos.x - remarkpos[0];
		measure[1] = currentMousePos.y - remarkpos[1];
		$('canvas').removeLayer(content+'line').drawLayers();
	};
	obj.dragstop = function(layer) {
		layer.x = currentMousePos.x-measure[0]+twidth/2;
		layer.y = currentMousePos.y-measure[1]+theight/2;
		for(var i = 0; i < remarkList.length; i++)
		{
			if(remarkList[i][3].toString() == layer.mID)
			{
				remarkList[i][0] = [currentMousePos.x-measure[0], currentMousePos.y-measure[1]];
			}
		}
		confset();
	};
	
	$('canvas').addLayer(obj).removeLayer('tempRemark').drawLayers();
	var connPoint = {};
	var k = (linepos[1]-obj.y)/(linepos[0]-obj.x);
	var kt = theight/twidth;
	if(k > kt || k < -kt)
	{
		connPoint.x = obj.x;
		if(linepos[1] < obj.y)
		{
			connPoint.y = remarkpos[1];
		}
		else
		{
			connPoint.y = remarkpos[1] + theight;
		}
	}
	else
	{
		connPoint.y = obj.y;
		if(linepos[0] < obj.x)
		{
			connPoint.x = remarkpos[0];
		}
		else
		{
			connPoint.x = remarkpos[0] + twidth;
		}
	}
	
	$('canvas').drawLine({
		name: content+'line',
		layer: true, 
		visible: true,
		strokeStyle: '#00000',
		strokeWidth: 1,
		x1: connPoint.x, y1: connPoint.y,
		x2: linepos[0], y2: linepos[1],
		handle: {
			type: 'arc',
			fillStyle: '#fff',
			strokeStyle: '#c33',
			strokeWidth: 2,
			radius: 3
		}
	});
}

//绘制连接体
function drawConn(type)
{
	var plist = [];
	var llist = [];
	var temp = [];
	var obj = {
		type: 'path',
		fillStyle: '#FFE4E1',
		strokeStyle: '#FF6A6A',
		strokeWidth: 2,
		layer: true,
		closed: true
	};
	var firstPoint = [];
	var pos = 0;
	var count = 0;

	var ajustObj = {
		strokeStyle: '#c33',
		strokeWidth: 2,
		rounded: true,
		groups: ['myConns'],
		handle: {
			type: 'arc',
			fillStyle: '#fff',
			strokeStyle: '#c33',
			strokeWidth: 2,
			radius: 3
		},
		guide: {
			strokeStyle: '#c33',
			strokeWidth: 1
		},
		mp: 3,
		handlestart: function(layer) {
			// code to run when resizing starts
			if(layer.type == 'bezier')
			{
				var mindis = dis(currentMousePos.x, currentMousePos.y, layer.cx1, layer.cy1);
				if(dis(currentMousePos.x, currentMousePos.y, layer.cx2, layer.cy2) < mindis)
				{
					mindis = dis(currentMousePos.x, currentMousePos.y, layer.cx2, layer.cy2);
					layer.mp = 4;
				}
				if(dis(currentMousePos.x, currentMousePos.y, layer.x2, layer.y2) < mindis)
				{
					mindis = dis(currentMousePos.x, currentMousePos.y, layer.x2, layer.y2);
					layer.mp = 2;
				}
				if(dis(currentMousePos.x, currentMousePos.y, layer.x1, layer.y1) < mindis)
				{
					mindis = dis(currentMousePos.x, currentMousePos.y, layer.x1, layer.y1);
					layer.mp = 1;
				}
			}
		},
		handlestop: function(layer) {
			// code to run while resizing stops
			var i;
			for(i = 0; i < quadraticTops.length; i++)
			{
				if(quadraticTops[i][1].toString() == [layer.x1, layer.y1].toString() && quadraticTops[i][2].toString() == [layer.x2, layer.y2].toString() )
				{
					if(layer.mp > 2)
					{
						quadraticTops[i][layer.mp] = [currentMousePos.x, currentMousePos.y];
					}
					else
					{
						if(quadraticTops[i][layer.mp][0] == centerX)
						{
							quadraticTops[i][layer.mp][1] = currentMousePos.y;
						}
					}
					break;
				}
			}
			if(i == quadraticTops.length)
			{
				var temp = [];
				if(layer.type =='bezier')
				{
					temp = ['Bezier', [layer.x1, layer.y1], [layer.x2, layer.y2], [layer.cx1, layer.cy1], [layer.cx2, layer.cy2]];
					if(layer.mp == 1)
					{
						if(layer.x1 == centerX)
						{
							temp[layer.mp][0] = centerX;
							temp[layer.mp][1] = currentMousePos.y;
						}
					}
					else if(layer.mp == 2)
					{
						if(layer.x2 == centerX)
						{
							temp[layer.mp][0] = centerX;
							temp[layer.mp][1] = currentMousePos.y;
						}
					}
					else
					{
						temp[layer.mp] = [currentMousePos.x, currentMousePos.y];
					}
				}
				else
				{
					temp = ['Quadratic', [layer.x1, layer.y1], [layer.x2, layer.y2], [layer.cx1, layer.cy1]];
					if(layer.mp == 3)
					{
						temp[layer.mp] = [currentMousePos.x, currentMousePos.y];
					}
				}
				quadraticTops.push(temp);
			}
			storeChange('quadraticTops');
			redrawall();
		}
	};


	//计算llist，格式：[起点位置，终点位置，线型]
	for(var i = 0; i < 16; i++)
	{
		if(teethList[i][1] + teethList[i][2] + teethList[i][3] > 0)
		{
			if(teethList[i][1] != 0)
			{
				pos = 2-Math.floor(i/8);
			}
			else if(teethList[i][2] != 0)
			{
				pos = Math.floor(teethList[i][2]/1000);
			}
			else if(teethList[i][3] != 0)
			{
				pos = teethList[i][3];
			}

			if(firstPoint.length == 0)
			{
				firstPoint = [i, pos];
			}
			else
			{
				if(llist.length == 0)
				{
					if(teethPos[firstPoint[0]][firstPoint[1]].toString() != teethPos[i][pos].toString() )
					{
						llist.push([firstPoint, [i, pos], 'B']);
					}
				}
				else
				{
					if(teethPos[llist[llist.length-1][1][0]][llist[llist.length-1][1][1]].toString() != teethPos[i][pos].toString())
					{
						llist.push([ llist[llist.length-1][1], [i, pos], 'B']);
					}
				}
			}

			if(teethList[i][1] != 0)
			{
				var a = i;
				while(teethList[i][1] != 0)
				{
					i++;
				}
				var b = i-1;
				for(var j = a; j <= b; j++)    
				{
					llist.push([[j, 2-Math.floor(j/8)], [j, 1+Math.floor(j/8)], 'L']);
				}
			}
			count += 1;
		}
	}
	llist.push([ llist[llist.length-1][1], firstPoint, 'B' ]);

	//根据llist计算plist，格式：[线型，起点坐标，终点坐标， 其他参照点坐标（0或2个）]
	for(var i = 0; i < llist.length; i++)
	{
		if(llist[i][2] == 'L')
		{
			plist.push(['Line', teethPos[llist[i][0][0]][llist[i][0][1]], teethPos[llist[i][1][0]][llist[i][1][1]]]);
		}
		else
		{
			temp = connTwoPoint(llist[i][0], llist[i][1]);
			for(var j = 0; j < temp.length; j++)
			{
				plist.push(temp[j]);
			}
		}
	}

	//读取quadraticTops中的有用信息并删除过期项
	for(var i = 0; i < quadraticTops.length; i++)
	{
		for(var j = 0; j < plist.length; j++)
		{
			if(quadraticTops[i][1][0] == plist[j][1][0] && quadraticTops[i][2][0] == plist[j][2][0])
			{
				plist[j][1] = quadraticTops[i][1];
				plist[j][2] = quadraticTops[i][2];
				plist[j][3] = quadraticTops[i][3];
				if(plist[j][0] == 'Bezier')
				{
					plist[j][4] = quadraticTops[i][4];
				}
				break;
			}
		}
		if(j == plist.length)
		{
			quadraticTops.splice(i,1);
		}
	}

	if(count == 1)
	{
		return;
	}
	else
	{
		count = 1;
		var attrname = 'p'+ count;
		var attrvalue = {};

		attrvalue.x1 = plist[0][1][0];
		attrvalue.y1 = plist[0][1][1];

		for(var i = 0; i < plist.length; i++)
		{
			if(plist[i][0] == 'Line')
			{
				attrvalue.type = 'line';
				attrvalue.x2 = plist[i][2][0];
				attrvalue.y2 = plist[i][2][1];
			}
			else
			{
				var tmpajustObj = $.extend(true, {}, ajustObj);
				if(plist[i][0] == 'Bezier')
				{
					attrvalue.type = 'bezier';
					attrvalue.x2 = plist[i][2][0];
					attrvalue.y2 = plist[i][2][1];
					attrvalue.cx1 = plist[i][3][0];
					attrvalue.cy1 = plist[i][3][1]; 
					attrvalue.cx2 = plist[i][4][0];
					attrvalue.cy2 = plist[i][4][1]; 
					if(isconnmodify)
					{
						tmpajustObj.type = attrvalue.type;
						tmpajustObj.x2 = attrvalue.x2;
						tmpajustObj.y2 = attrvalue.y2;
						tmpajustObj.cx1 = attrvalue.cx1;
						tmpajustObj.cy1 = attrvalue.cy1;
						tmpajustObj.cx2 = attrvalue.cx2;
						tmpajustObj.cy2 = attrvalue.cy2;
						tmpajustObj.x1 = plist[i][1][0];
						tmpajustObj.y1 = plist[i][1][1];
						$('canvas').addLayer(tmpajustObj);
					}
				}
				else
				{
					attrvalue.type = 'quadratic';
					attrvalue.x2 = plist[i][2][0];
					attrvalue.y2 = plist[i][2][1];
					attrvalue.cx1 = plist[i][3][0];
					attrvalue.cy1 = plist[i][3][1]; 
					if(isconnmodify)
					{
						tmpajustObj.type = attrvalue.type;
						tmpajustObj.x2 = attrvalue.x2;
						tmpajustObj.y2 = attrvalue.y2;
						tmpajustObj.cx1 = attrvalue.cx1;
						tmpajustObj.cy1 = attrvalue.cy1;
						tmpajustObj.x1 = plist[i][1][0];
						tmpajustObj.y1 = plist[i][1][1];
						$('canvas').addLayer(tmpajustObj);
					}
				}
				
			}
			
			obj[attrname] = $.extend(true, {}, attrvalue);
			count ++;
			attrname = 'p'+ count;
			attrvalue = {};
		}
		$('canvas').addLayer(obj);
		var layers = $('canvas').getLayers();
		var temp = layers[layers.length-1];
		for(var i = layers.length-1; i > 0; i--)
		{
			layers[i] = layers[i-1];
		}
		layers[0] = temp;
		$('canvas').drawLayers();
	}

}



//绘制基托
function drawBase(begin, end, type, istmp)
{
	cxt.clearRect(0, 0, c.width, c.height);
	$('canvas').removeLayer('base').drawLayers();

	if(begin > end)
	{
		var temp = begin;
		begin = end;
		end = temp;
	}
	if(begin <16 && end > 15)
	{
		return;
	}
	var plist = [];
	var ka1,ka2,kb1,kb2;
	var x,y;
	var posBegin,posEnd;

	ka1 = (teethPos[begin][2][1]-teethPos[begin][1][1])/(teethPos[begin][2][0]-teethPos[begin][1][0]);
	ka2 = (teethPos[begin][3][1]-teethPos[begin][4][1])/(teethPos[begin][3][0]-teethPos[begin][4][0]);
	kb1 = (teethPos[end][2][1]-teethPos[end][1][1])/(teethPos[end][2][0]-teethPos[end][1][0]);
	kb2 = (teethPos[end][3][1]-teethPos[end][4][1])/(teethPos[end][3][0]-teethPos[end][4][0]);
	if( (begin >= 0 && begin <= 7) || (begin >= 16 && begin <= 23) )
	{
		posBegin = 2;
	}
	else if( (begin >= 8 && begin <= 15) || (begin >= 24 && begin <= 31))
	{
		posBegin = 1;
	}
	if((end >= 0 && end <= 7) || (end >= 16 && end <= 23))
	{
		posEnd = 1;
	}
	else if((end >= 8 && end <= 15) || (end >= 24 && end <= 31))
	{
		posEnd = 2;
	}

	if(type == 1)
	{
		x = (ka1*teethPos[begin][4][0]-ka2*teethPos[begin][posBegin][0]-teethPos[begin][4][1]+teethPos[begin][posBegin][1])/(ka1-ka2);
		y = ka2*(x-teethPos[begin][posBegin][0])+teethPos[begin][posBegin][1];
		plist.push([x,y]);
		plist.push(teethPos[begin][posBegin]);
		x = (ka1*teethPos[begin][3][0]-ka2*teethPos[begin][posBegin][0]-teethPos[begin][3][1]+teethPos[begin][posBegin][1])/(ka1-ka2);
		y = ka2*(x-teethPos[begin][posBegin][0])+teethPos[begin][posBegin][1];
		plist.push([x,y]);
		for(var i = begin; i <= end; i++)
		{
			plist.push(teethPos[i][9]);
		}
		x = (kb2*teethPos[end][posEnd][0]-kb1*teethPos[end][3][0]+teethPos[end][3][1]-teethPos[end][posEnd][1])/(kb2-kb1);
		y = kb2*(x-teethPos[end][posEnd][0])+teethPos[end][posEnd][1];
		plist.push([x,y]);
		plist.push(teethPos[end][posEnd]);
		x = (kb2*teethPos[end][posEnd][0]-kb1*teethPos[end][4][0]+teethPos[end][4][1]-teethPos[end][posEnd][1])/(kb2-kb1);
		y = kb2*(x-teethPos[end][posEnd][0])+teethPos[end][posEnd][1];
		plist.push([x,y]);
		for(var i = end; i >= begin; i--)
		{
			plist.push(teethPos[i][10]);
		}
	}

	else if(type == 2)
	{
		for(var i = begin; i <= end; i++)
		{
			if(i >= 0 && i <= 7)
			{
				plist.push(teethPos[i][2]);
			}
			else if(i >= 7 && i <= 15)
			{
				plist.push(teethPos[i][1]);
			}
		}
		plist.push(teethPos[end][posEnd]);
		x = (kb2*teethPos[end][posEnd][0]-kb1*teethPos[end][4][0]+teethPos[end][4][1]-teethPos[end][posEnd][1])/(kb2-kb1);
		y = kb2*(x-teethPos[end][posEnd][0])+teethPos[end][posEnd][1];
		plist.push([x,y]);
		for(var i = end; i >= begin; i--)
		{
			plist.push(teethPos[i][10]);
		}
		plist.push(teethPos[begin][posBegin]);
		x = (ka2*teethPos[begin][posBegin][0]-ka1*teethPos[begin][4][0]+teethPos[begin][4][1]-teethPos[begin][posBegin][1])/(ka2-ka1);
		y = ka2*(x-teethPos[begin][posBegin][0])+teethPos[begin][posBegin][1];
		plist.push([x,y]);
	}

	var count = plist.length;
	var obj = {
		type: 'path',
		fillStyle: '#FFE4E1',
		strokeStyle: '#FF6A6A',
		strokeWidth: 2,
		layer: true,
		closed: true
	};
	if(istmp)
	{
		obj.name = 'base';
	}
	for(var i = 0; i < count; i++)
	{
		k1 = (plist[(count+i+1)%count][1]-plist[(count+i-1)%count][1])/(plist[(count+i+1)%count][0]-plist[(count+i-1)%count][0]);
		k2 = (plist[(count+i+2)%count][1]-plist[i][1])/(plist[(count+i+2)%count][0]-plist[i][0]);
		x = (plist[(count+i+1)%count][1]-plist[i][1]-k2*plist[(count+i+1)%count][0]+k1*plist[i][0])/(k1-k2);
		y = k1*(x-plist[i][0])+plist[i][1];
		
		if(Math.abs(plist[i][0] - plist[(count+i+1)%count][0]) > Math.abs(plist[i][1] - plist[(count+i+1)%count][1]))
		{
			if(x < Math.min(plist[i][0],plist[(count+i+1)%count][0]) || x > Math.max(plist[i][0],plist[(count+i+1)%count][0]))
			{
				x = (plist[i][0]+plist[(count+i+1)%count][0])/2;
				y = (plist[i][1]+plist[(count+i+1)%count][1])/2;
			}
		}
		else
		{
			if( y < Math.min(plist[i][1],plist[(count+i+1)%count][1]) || y > Math.max(plist[i][1],plist[(count+i+1)%count][1]) )
			{
				x = (plist[i][0]+plist[(count+i+1)%count][0])/2;
				y = (plist[i][1]+plist[(count+i+1)%count][1])/2;
			}
		}
		
		var attrname = 'p'+(i+1);
		var attrvalue = {};
		var attrvalue2 = {};
		attrvalue.type = 'quadratic';
		attrvalue2.type = 'quadratic';
		if(i == 0)
		{
			attrvalue2.x1 = plist[i][0];
			attrvalue2.y1 = plist[i][1];
			attrvalue2.cx1 = x;
			attrvalue2.cy1 = y;
			attrvalue2.x2 = plist[(count+i+1)%count][0];
			attrvalue2.y2 = plist[(count+i+1)%count][1];
			obj[attrname] = attrvalue2;
		}
		else
		{
			attrvalue.cx1 = x;
			attrvalue.cy1 = y;
			attrvalue.x2 = plist[(count+i+1)%count][0];
			attrvalue.y2 = plist[(count+i+1)%count][1];
			obj[attrname] = attrvalue;
		}
	}
	
	$('canvas').addLayer(obj);
	var layers = $('canvas').getLayers();
	var temp = layers[layers.length-1];
	for(var i = layers.length-1; i > 0; i--)
	{
		layers[i] = layers[i-1];
	}
	layers[0] = temp;
	$('canvas').drawLayers();
}

//绘制支托
function drawsupport(current, pos, tmp)
{
	cxt.clearRect(0, 0, c.width, c.height);
	$('canvas').removeLayer('support');
	var obj = {
		type: 'path',
		fillStyle: '#0000FF',
		strokeStyle: '#0000FF',
		strokeWidth: 2,
		layer: true,
		closed: true,
		
	};
	if(tmp)
	{
		obj.name = 'support';
	}
	if((current >= 0 && current <= 4) || (current >= 11 && current <= 20) || (current >= 27 && current <= 31))
	{
		var x,y;
		var k1 = (teethPos[current][2*pos+3][1] - teethPos[current][2*pos+4][1]) / (teethPos[current][2*pos+3][0] - teethPos[current][2*pos+4][0]);
		var k2 = (teethPos[current][3][1] - teethPos[current][pos][1]) / (teethPos[current][3][0] - teethPos[current][pos][0]);
		var k3 = (teethPos[current][4][1] - teethPos[current][pos][1]) / (teethPos[current][4][0] - teethPos[current][pos][0]);

		var p1 = {
			type: 'quadratic',
			x1: teethPos[current][2*pos+3][0], y1: teethPos[current][2*pos+3][1],
			cx1: teethPos[current][3-pos][0], cy1: teethPos[current][3-pos][1],
			x2: teethPos[current][2*pos+4][0], y2: teethPos[current][2*pos+4][1]
		};

		x = (k1*teethPos[current][pos][0]-k3*teethPos[current][4][0]+teethPos[current][4][1]-teethPos[current][pos][1])/(k1-k3);
		y = k1*(x-teethPos[current][pos][0])+teethPos[current][pos][1];
		var p2 = {
			type: 'quadratic',
			cx1: x, cy1: y,
			x2: teethPos[current][pos][0], y2: teethPos[current][pos][1]
		};

		x = (k1*teethPos[current][pos][0]-k2*teethPos[current][3][0]+teethPos[current][3][1]-teethPos[current][pos][1])/(k1-k2);
		y = k1*(x-teethPos[current][pos][0])+teethPos[current][pos][1];
		var p3 = {
			type: 'quadratic',
			cx1: x, cy1: y,
			x2: teethPos[current][2*pos+3][0], y2: teethPos[current][2*pos+3][1]
		};
		obj.p1 = p1;
		obj.p2 = p2;
		obj.p3 = p3;
	}
	else if(current == 5 || current == 10 || current == 21 || current == 26)
	{
		var p1 = {
			type: 'quadratic',
			x1: teethPos[current][2*pos+4][0], y1: teethPos[current][2*pos+4][1],
			cx1: teethPos[current][0][0], cy1: teethPos[current][0][1],
			x2: (teethPos[current][3-pos][0]+teethPos[current][0][0])/2, y2: (teethPos[current][3-pos][1]+teethPos[current][0][1])/2
		};
		obj.p1 = p1;
	}
	$('canvas').addLayer(obj);
	$('canvas').drawLayers();

}


//绘制卡环
function drawclasp(current, pos1, type, pos2, length, tmp)
{
	cxt.clearRect(0, 0, c.width, c.height);
	$('canvas').removeLayer('clasp');
	
	var obj = {
		type: 'path',
        layer: true,
		strokeStyle: '#000000'
	};
	if(tmp)
	{
		obj.name = 'clasp';
	}
	if(type == 1)
	{
		obj.strokeWidth = 4;
	}
	else
	{
		obj.strokeWidth = 2;
	}
	var pathlist;
	
	if(pos1 == 1)
		if(pos2 == 1)
			if(length == 1)
				pathlist = [2,7,3,5,1,6,4,8,2];
			else
				pathlist = [7,3,5,1,6,4,8];
		else if(pos2 == 2)
			if(length == 1)
				pathlist = [2,7,3,5,1,6];
			else
				pathlist = [7,3,5,1,6];
		else
			if(length == 1)
				pathlist = [2,8,4,6,1,5];
			else
				pathlist = [8,4,6,1,5];
	else
		if(pos2 == 1)
			if(length == 1)
				pathlist = [1,5,3,7,2,8,4,6,1];
			else
				pathlist = [5,3,7,2,8,4,6];
		else if(pos2 == 2)
			if(length == 1)
				pathlist = [1,5,3,7,2,8];
			else
				pathlist = [5,3,7,2,8];
		else
			if(length == 1)
				pathlist = [1,6,4,8,2,7];
			else
				pathlist = [6,4,8,2,7];
	
	var count = 1;
	attrname = 'p'+ count;
	var tmpobj = {};
	tmpobj.type = 'quadratic';
	var cx,cy;
	var k1, k2;
	for(var i = 2; i < pathlist.length-1; i++)
	{
		
		k1 = (teethPos[current][pathlist[i-2]][1] - teethPos[current][pathlist[i]][1]) / (teethPos[current][pathlist[i-2]][0] - teethPos[current][pathlist[i]][0]);
		k2 = (teethPos[current][pathlist[i-1]][1] - teethPos[current][pathlist[i+1]][1]) / (teethPos[current][pathlist[i-1]][0] - teethPos[current][pathlist[i+1]][0]);
		cx = (k1*teethPos[current][pathlist[i-1]][0] - k2*teethPos[current][pathlist[i]][0] + teethPos[current][pathlist[i]][1] - teethPos[current][pathlist[i-1]][1])/(k1-k2);
		cy = k2*(cx-teethPos[current][pathlist[i]][0])+teethPos[current][pathlist[i]][1];
		tmpobj.cx1 = cx;
		tmpobj.cy1 = cy;
		tmpobj.x2 = teethPos[current][pathlist[i]][0];
		tmpobj.y2 = teethPos[current][pathlist[i]][1];
		if(i == 2)
		{
			tmpobj.x1 = teethPos[current][pathlist[1]][0];
			tmpobj.y1 = teethPos[current][pathlist[1]][1];
			obj[attrname] = $.extend(true, {}, tmpobj);
			delete tmpobj.x1;
			delete tmpobj.y1;
		}
		else
		{
			obj[attrname] = $.extend(true, {}, tmpobj);
		}
		count ++;
		attrname = 'p'+ count;
	}
	
	$('canvas').addLayer(obj);
	$('canvas').drawLayers();
}

//绘制缺失牙的双线
function drawlost(begin, end, temp)
{
	cxt.clearRect(0, 0, c.width, c.height);
	$('canvas').removeLayer('temp1').removeLayer('temp2').drawLayers();

	var a = Math.min(begin, end);
	var b = Math.max(begin, end);
	if(a<16 && b>15)
	{
		return;
	}

	var obj1 = {
	  strokeStyle: '#FF0000',
	  strokeWidth: 3,
	  rounded: 10,
	  layer: true,
	};
	var obj2 = {
	  strokeStyle: '#FF0000',
	  strokeWidth: 3,
	  rounded: 10,
	  layer: true,
	};

	if(temp)
	{
		obj1.name = 'temp1';
		obj2.name = 'temp2';
	}
	
	var pts1 = [];
	var pts2 = [];
	if(b <= 15)
	{
		pts1.push([(teethPos[a][2*(2-Math.floor(a/8))+3][0]+teethPos[a][2-Math.floor(a/8)][0])/2, (teethPos[a][2*(2-Math.floor(a/8))+3][1]+teethPos[a][2-Math.floor(a/8)][1])/2]);
		pts2.push([(teethPos[a][2*(2-Math.floor(a/8))+4][0]+teethPos[a][2-Math.floor(a/8)][0])/2, (teethPos[a][2*(2-Math.floor(a/8))+4][1]+teethPos[a][2-Math.floor(a/8)][1])/2]);
		for(var i = a; i <= b; i++)
		{
			pts1.push([(teethPos[i][0][0]+teethPos[i][3][0])/2, (teethPos[i][0][1]+teethPos[i][3][1])/2]);
			pts2.push([(teethPos[i][0][0]+teethPos[i][4][0])/2, (teethPos[i][0][1]+teethPos[i][4][1])/2]);
		}
		pts1.push([(teethPos[b][2*(Math.floor(b/8)+1)+3][0]+teethPos[b][Math.floor(b/8)+1][0])/2, (teethPos[b][2*(Math.floor(b/8)+1)+3][1]+teethPos[b][Math.floor(b/8)+1][1])/2]);
		pts2.push([(teethPos[b][2*(Math.floor(b/8)+1)+4][0]+teethPos[b][Math.floor(b/8)+1][0])/2, (teethPos[b][2*(Math.floor(b/8)+1)+4][1]+teethPos[b][Math.floor(b/8)+1][1])/2]);
	}
	else if(a >= 16)
	{
		pts1.push([(teethPos[b][2*(Math.floor((b-16)/8)+1)+3][0]+teethPos[b][Math.floor((b-16)/8)+1][0])/2, (teethPos[b][2*(Math.floor((b-16)/8)+1)+3][1]+teethPos[b][Math.floor((b-16)/8)+1][1])/2]);
		pts2.push([(teethPos[b][2*(Math.floor((b-16)/8)+1)+4][0]+teethPos[b][Math.floor((b-16)/8)+1][0])/2, (teethPos[b][2*(Math.floor((b-16)/8)+1)+4][1]+teethPos[b][Math.floor((b-16)/8)+1][1])/2]);
		for(var i = b; i >= a; i--)
		{
			pts1.push([(teethPos[i][0][0]+teethPos[i][3][0])/2, (teethPos[i][0][1]+teethPos[i][3][1])/2]);
			pts2.push([(teethPos[i][0][0]+teethPos[i][4][0])/2, (teethPos[i][0][1]+teethPos[i][4][1])/2]);
		}
		pts1.push([(teethPos[a][2*(2-Math.floor((a-16)/8))+3][0]+teethPos[a][2-Math.floor((a-16)/8)][0])/2, (teethPos[a][2*(2-Math.floor((a-16)/8))+3][1]+teethPos[a][2-Math.floor((a-16)/8)][1])/2]);
		pts2.push([(teethPos[a][2*(2-Math.floor((a-16)/8))+4][0]+teethPos[a][2-Math.floor((a-16)/8)][0])/2, (teethPos[a][2*(2-Math.floor((a-16)/8))+4][1]+teethPos[a][2-Math.floor((a-16)/8)][1])/2]);
	}
	
	for (var p = 0; p < pts1.length; p += 1) 
	{
	  obj1['x'+(p+1)] = pts1[p][0];
	  obj1['y'+(p+1)] = pts1[p][1];
	  obj2['x'+(p+1)] = pts2[p][0];
	  obj2['y'+(p+1)] = pts2[p][1];
	}
	
	$('canvas').drawLine(obj2);
	$('canvas').drawLine(obj1);
}





/*
///////////////////////////////////////////////////
鼠标事件监听：不同状态下不同事件触发的不同绘制动作
///////////////////////////////////////////////////
*/

//事件：鼠标按下
c.addEventListener("mousedown", function (evt) 
{
	currentMousePos = getMousePos(c, evt);
	if(evt.button == 0)
	{
		if(state == 1 || Math.floor(state/10) == 2)
		{
			var mousePos = getMousePos(c, evt);
			begin = findnrst(mousePos.x, mousePos.y);
			current = begin;
		}
		else if(Math.floor(state/1000) == 3)
		{
			var mousePos = getMousePos(c, evt);
			current = findnrst(mousePos.x, mousePos.y);
			if(teethList[current][2] != 0)
			{
				return;
			}
			if(dis(mousePos.x, mousePos.y,teethPos[current][1][0],teethPos[current][1][1]) < dis(mousePos.x, mousePos.y,teethPos[current][2][0],teethPos[current][2][1]))
			{
				teethList[current][2] = state - 2000;
			}
			else
			{
				teethList[current][2] = state - 1000;
			}
			storeChange('teethList');
		}
		else if(Math.floor(state/10) == 4)
		{
			var mousePos = getMousePos(c, evt);
			current = findnrst(mousePos.x, mousePos.y);
			if(dis(mousePos.x, mousePos.y,teethPos[current][1][0],teethPos[current][1][1]) < dis(mousePos.x, mousePos.y,teethPos[current][2][0],teethPos[current][2][1]))
			{
				teethList[current][3] = 1;
			}
			else
			{
				teethList[current][3] = 2;
			}
			storeChange('teethList');
		}
	}
	
	//输出点击坐标
	/*if(evt.button == 0)
	{
		var mousePos = getMousePos(c, evt);
		console.log('['+ mousePos.x+','+mousePos.y +']');
		$('canvas').drawArc({
		  strokeStyle: '#000',
		  strokeWidth: 2,
		  x: mousePos.x, y: mousePos.y,
		  radius: 2
		});
	}
	else
	{
		console.log('\n');
	}*/
	
	
}, false); 

//事件：鼠标移动
c.addEventListener("mousemove", function (evt) 
{
	currentMousePos = getMousePos(c, evt);
	if(begin >= 0)
	{
		var mousePos = getMousePos(c, evt);
		current = findnrst(mousePos.x, mousePos.y);
		if(state == 1)
		{
			drawlost(begin, current, true);
		}
		else if(Math.floor(state/10) == 2)
		{
			drawBase(begin, current, state%10, true);
		}
	}
	else if(Math.floor(state/1000) == 3)
	{
		var mousePos = getMousePos(c, evt);
		current = findnrst(mousePos.x, mousePos.y);
		if(teethList[current][2] != 0)
		{
			return;
		}
		if(dis(mousePos.x, mousePos.y,teethPos[current][1][0],teethPos[current][1][1]) < dis(mousePos.x, mousePos.y,teethPos[current][2][0],teethPos[current][2][1]))
		{
			drawclasp(current, 1, Math.floor(state/100)%10, Math.floor(state/10)%10, state%10, true);
		}
		else
		{
			drawclasp(current, 2, Math.floor(state/100)%10, Math.floor(state/10)%10, state%10, true);
		}
	}
	else if(Math.floor(state/10) == 4)
	{
		var mousePos = getMousePos(c, evt);
		current = findnrst(mousePos.x, mousePos.y);
		if(teethList[current][3] != 0)
		{
			return;
		}
		if(dis(mousePos.x, mousePos.y,teethPos[current][1][0],teethPos[current][1][1]) < dis(mousePos.x, mousePos.y,teethPos[current][2][0],teethPos[current][2][1]))
		{
			drawsupport(current, 1, true);
		}
		else
		{
			drawsupport(current, 2, true);
		}
	}

}, false); 

//事件：鼠标抬起
c.addEventListener("mouseup", function (evt) 
{   
	currentMousePos = getMousePos(c, evt);
	if(evt.button == 0)
	{
		end = current;
		var a = Math.min(begin, end);
		var b = Math.max(begin, end);
	    if(state == 1)
		{
			if(a < 16 && b > 15)
			{
				begin = end = current = -1;
				return;
			}
			for(var i = a; i <= b; i++)
			{
				teethList[i][0] = 1;
			}
			storeChange('teethList');
		}
		else if(Math.floor(state/10) == 2)
		{
			if(a < 16 && b > 15)
			{
				begin = end = current = -1;
				return;
			}
			for(var i = a; i <= b; i++)
			{
				teethList[i][1] = state%10;
			}
			storeChange('teethList');
		}
		begin = end = current = -1;
		redrawall();
	}
	else if(evt.button == 2)
	{
		
	}
}, false); 





/*
/////////////////////////////////////////
状态切换部分：前段交互时用于切换不同状态
/////////////////////////////////////////
*/

//切换状态：缺失选择
function lostSelected()
{
	//标记缺失状态：1
	isconndisped = false;
	confset();
	state = 1;
}

//切换状态：基托选择
function baseSelected()
{
	isconndisped = false;
	confset();
	state = parseInt($('#base').val());
}

//切换状态：卡环选择
function claspSelected()
{
	isconndisped = false;
	confset();
	//标记卡环选择状态：3
	if(parseInt($('#clasptype').val())*parseInt($('#clasppos').val())*parseInt($('#clasplength').val()) != 0)
	{
		state = 3*1000 + parseInt($('#clasptype').val())*100 + parseInt($('#clasppos').val())*10 + parseInt($('#clasplength').val());
	}
}

//切换状态：支托选择
function supportSelected()
{
	isconndisped = false;
	confset();
	//标记卡环选择状态：4
	state = parseInt($('#support').val());
}

//切换状态：显示/隐藏连接体
function dispConn()
{
	if(isconndisped)
	{
		isconndisped = false;
		$('#conn').val('显示连接体');
		$('#conn').removeClass("red_btn");
		$('#conn').addClass("green_btn");
	}
	else
	{
		isconndisped = true;
		$('#conn').val('隐藏连接体');
		$('#conn').removeClass("blue_btn");
		$('#conn').addClass("red_btn");
	}
	confset();
}

//切换状态：连接体调整确认
function modfConn()
{
	isconndisped = true;
	if(!isconnmodify)
	{
		isconnmodify = true;
		$('#modfconn').val('确认调整');
		$('#modfconn').removeClass("blue_btn");
		$('#modfconn').addClass("red_btn");
	}
	else
	{
		isconnmodify = false;
		$('#modfconn').val('调整连接体');
		$('#modfconn').removeClass("red_btn");
		$('#modfconn').addClass("green_btn");
	}
	confset();
}

//恢复初始状态
function confset()
{
	redrawall();
	state = 0;
	begin = end = current = -1;
}




/*
////////////////////////////////////////////
重绘过程相关：根据数组还原图形
////////////////////////////////////////////
*/

//设置智齿情况
function changeWTeeth()
{
	var wt = [document.getElementById("wteeth1").checked, document.getElementById("wteeth2").checked, document.getElementById("wteeth3").checked, document.getElementById("wteeth4").checked];
	if(wt[0])
	{
		teethList[0][0] = 0;
	}
	else
	{
		teethList[0] = [2, 0, 0, 0];
	}
	if(wt[1])
	{
		teethList[15][0] = 0;
	}
	else
	{
		teethList[15] = [2, 0, 0, 0];
	}
	if(wt[2])
	{
		teethList[16][0] = 0;
	}
	else
	{
		teethList[16] = [2, 0, 0, 0];
	}
	if(wt[3])
	{
		teethList[31][0] = 0;
	}
	else
	{
		teethList[31] = [2, 0, 0, 0];
	}
	storeChange('teethList');
	confset();
}

//根据数组重新绘制图像
function redrawall()
{
	cxt.clearRect(0, 0, c.width, c.height);
	$('canvas').removeLayers();
	loadteethmap();
}

//获取相应牙位应该显示的图片
function getsourceString(pos)
{
	var sourceString;
	if(pos == 'T')
	{
		if(teethList[0][0] == 2 && teethList[15][0] == 2)
		{
			sourceString = './img/top_teeth_BM.png';
		}
		else if(teethList[0][0] != 2 && teethList[15][0] == 2)
		{
			sourceString = './img/top_teeth_RM.png';
		}
		else if(teethList[0][0] == 2 && teethList[15][0] != 2)
		{
			sourceString = './img/top_teeth_LM.png';
		}
		else
		{
			sourceString = './img/top_teeth.png';
		}
	}
	else
	{
		if(teethList[31][0] == 2 && teethList[16][0] == 2)
		{
			sourceString = './img/bottom_teeth_BM.png';
		}
		else if(teethList[31][0] == 2 && teethList[16][0] != 2)
		{
			sourceString = './img/bottom_teeth_RM.png';
		}
		else if(teethList[31][0] != 2 && teethList[16][0] == 2)
		{
			sourceString = './img/bottom_teeth_LM.png';
		}
		else
		{
			sourceString = './img/bottom_teeth.png';
		}
	}
    return sourceString;
}

//牙位图绘制主函数
function loadteethmap()
{
	//绘制基托
	for(var i=0;i<32;i++)
  	{
  		if(teethList[i][1] != 0)
  		{
  			var begin = i;
  			var type = teethList[i][1];
  			while(i < 32 && teethList[i][1] == type && i < (Math.floor(i/16)+1)*16 )
  			{
  				i++;
  			}
  			drawBase(begin, i-1, type, false);
  			i -= 1;
  		}
  	}

	//绘制牙齿图像
	$('canvas').drawImage({
		layer: true,
		source: getsourceString('T'),
		x: picPosX1, 
		y: picPosY1,
		width: 275.56,
		height: 223.89,
		groups: ['teethPic']
	});

	$('canvas').drawImage({
		layer: true,
		source: getsourceString('B'),
		x: picPosX2, 
		y: picPosY2,
		width: 275.56,
		height: 223.89,
		groups: ['teethPic']
	});
	
	//修正牙列用图片
	/*$('canvas').drawImage({
		layer: true,
		source: './img/pic_bot.png',
		x: picPosX2, 
		y: picPosY2+10,
		width: 290,
		height: 218.5,
		groups: ['teethPic']
	});*/
	
	//显示所有标识点
	/*for(var i = 0; i < 32; i++)
	{
		for(var j = 0; j < 11; j++)
		{
			$('canvas').drawArc({
			  strokeStyle: '#000',
			  strokeWidth: 1,
			  x: teethPos[i][j][0], y: teethPos[i][j][1],
			  radius: 1,
			  layer: true,
			});
		}
	}*/

  //绘制缺失、支托
  for(var i=0; i<32;i++)
  {
  	if(teethList[i][0] == 1)
  	{
  		var begin = i;
  		while(i < 32 && i < (Math.floor(i/16)+1)*16 && teethList[i][0] == 1)
  		{
  			i++;
  		}
  		drawlost(begin, i-1, false);
		i--;
  	}
	if(teethList[i][2] != 0)
	{
		drawclasp(i, Math.floor(teethList[i][2]/1000), Math.floor(teethList[i][2]/100)%10, Math.floor(teethList[i][2]/10)%10, teethList[i][2]%10, false);
	}
	if(teethList[i][3] != 0)
	{
		drawsupport(i, teethList[i][3], false);
	}
  }

  //绘制连接体
  if(isconndisped)
  {
  	drawConn();
  }
  
  for(var i = 0; i < remarkList.length; i++)
  {
	  drawRemark(remarkList[i][0], remarkList[i][1], remarkList[i][2], remarkList[i][3]);
  }
}





/*
/////////////////////////
其他工具函数
/////////////////////////
*/

//获取鼠标位置
function getMousePos(canvas, evt) {   
    var rect = canvas.getBoundingClientRect();   
    return {   
        x: evt.clientX - rect.left,   
        y: evt.clientY - rect.top   
    };   
}

//寻找离特定点最近的牙齿
function findnrst(x, y)
{
	var dis = (teethPos[0][0][0] - x)*(teethPos[0][0][0] - x) + (teethPos[0][0][1] - y)*(teethPos[0][0][1] - y);
	var pos = 0;
	for(var i = 1; i < 32; i++)
	{
		if(teethList[i][0] != 2)
		{
			var tmp = (teethPos[i][0][0] - x)*(teethPos[i][0][0] - x) + (teethPos[i][0][1] - y)*(teethPos[i][0][1] - y);
			if(tmp < dis)
			{
				dis = tmp;
				pos = i;
			}
		}
	}
	return pos;
}

//计算欧式距离
function dis(x1, y1, x2, y2)
{
  return Math.pow( (Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2)), 0.5);
}

//数组深复制
function deepCopy(arr)
{
	var tmp = [];
	for(var i = 0; i < arr.length; i++)
	{
		if(typeof(arr[i]) != "undefined")
		{
			if(typeof(arr[i]) == "object")
			{
				tmp.push(deepCopy(arr[i]));
			}
			else
			{
				tmp.push(arr[i]);
			}
		}
	}
	return tmp;
}

//计算连接体中两点间的相连方式
function connTwoPoint(pos1, pos2)
{
	var p1 = teethPos[pos1[0]][pos1[1]];
	var p2 = teethPos[pos2[0]][pos2[1]];
	var midp1 = getMidPoint(pos1[0], pos1[1]);
	var midp2 = getMidPoint(pos2[0], pos2[1]);
	var llist = [];
	if((p1[0]-centerX)*(p2[0]-centerX) >= 0)
	{
		return [['Bezier', p1, p2, [(p1[0]+midp1[0])/2, (p1[1]+midp1[1])/2], [(p2[0]+midp2[0])/2, (p2[1]+midp2[1])/2]]];
	}
	else
	{
		var cPoint = [centerX, (midp1[1]+midp2[1])/2];
		if(Math.abs(midp1[1]-midp2[1]) > 20)
		{
			var temp = [];
			var tp0 = [(p1[0]+cPoint[0])/2, (p1[1]+cPoint[1])/2];
			var tp1 = [(3*p1[0]+midp1[0])/4, (3*p1[1]+midp1[1])/4];
			var tp2 = [(cPoint[1]-tp0[1])*(tp0[0]-tp1[0])/(tp0[1]-tp1[1])+tp0[0], cPoint[1]];
			temp.push(['Bezier', p1, cPoint, tp1, tp2]);
			tp0 = [(p2[0]+cPoint[0])/2, (p2[1]+cPoint[1])/2];
			tp2 = [(3*p2[0]+midp2[0])/4, (3*p2[1]+midp2[1])/4];
			tp1 = [(cPoint[1]-tp0[1])*(tp0[0]-tp2[0])/(tp0[1]-tp2[1])+tp0[0], cPoint[1]];
			temp.push(['Bezier', cPoint, p2, tp1, tp2]);
			return temp;
		}
		else
		{
			return [['Quadratic', p1, p2, cPoint]];
		}
	}
}

//计算牙列垂线与上颚中垂线的交点
function getMidPoint(tnum, pos)
{
	var x = centerX;
	var k = (teethPos[tnum][1][0] - teethPos[tnum][2][0])/(teethPos[tnum][2][1] - teethPos[tnum][1][1]);
	var y = k*(x - teethPos[tnum][pos][0])+teethPos[tnum][pos][1];
	return [x, y];
}



/*
//////////////
撤销重做相关
//////////////
*/

//存储更改
function storeChange(listname)
{
	var tempTeethList;
	if(actionCursor < actionList.length-1)
	{
		actionList.splice(actionCursor+1, actionList.length-2-actionCursor);
	}
	if(actionList.length >= 10)
	{
		if(actionList[0][0] == 'teethList')
		{
			LastTeethList = deepCopy(actionList[0][1]);
		}
		else
		{
			LastQuadraticTops = deepCopy(actionList[0][1]);
		}
		actionList.shift();
	}
	if(listname == 'teethList')
	{
		tempTeethList = deepCopy(teethList);
		actionList.push(['teethList', tempTeethList]);
	}
	else
	{
		tempTeethList = deepCopy(quadraticTops);
		actionList.push(['quadraticTops', tempTeethList]);
	}
	actionCursor = actionList.length-1;
}

//撤销操作
function undo()
{
	if(actionCursor < 0)
	{
		return
	}
	else if(actionCursor == 0)
	{
		if(actionList[actionCursor][0] == 'teethList')
		{
			teethList = deepCopy(LastTeethList);
		}
		else
		{
			quadraticTops = deepCopy(LastQuadraticTops);
		}
	}
	else
	{
		if(actionList[actionCursor][0] == 'teethList')
		{
			for(var i = actionCursor - 1; i >= 0; i--)
			{
				if(actionList[i][0] == 'teethList')
				{
					break;
				}
			}
			if(i >= 0)
			{
				teethList = deepCopy(actionList[i][1]);
			}
			else
			{
				teethList = deepCopy(LastTeethList);
			}
		}
		else
		{
			for(var i = actionCursor - 1; i >= 0; i--)
			{
				if(actionList[i][0] == 'quadraticTops')
				{
					break;
				}
			}
			if(i >= 0)
			{
				quadraticTops = deepCopy(actionList[i][1]);
			}
			else
			{
				quadraticTops = deepCopy(LastQuadraticTops);
			}
		}	
	}
	actionCursor--;
	redrawall();
}

//重做操作
function redo()
{
	if(actionCursor == actionList.length-1)
	{
		return
	}
	else
	{
		if(actionList[actionCursor+1][0] == 'teethList')
		{
			teethList = deepCopy(actionList[actionCursor+1][1]);
		}
		else
		{
			quadraticTops = deepCopy(actionList[actionCursor+1][1]);
		}
	}
	actionCursor++;
	redrawall();
}