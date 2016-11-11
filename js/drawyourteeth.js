/**
 * 2016 Xin Fang 
 * version 3.0
 * V1功能：缺失标记、完整基托、舌侧基托、普通三臂卡环、连接体简单绘制
 * V2功能：连接体抛物线可调整、可撤销/重做（10步）
 * V3：功能开发中，根据新需求，更改牙列图、牙列参照点坐标数据结构，使用新结构、新需求绘制：缺失双线、基托
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
	[[315,311],[314,330],[313,278],[337,310],[297,310],[331,325],[298,324],[329,293],[303,293],[355,309],[284,309]],
	[[312,350],[306,369],[314,330],[334,351],[294,349],[327,371],[295,361],[330,337],[299,334],[351,351],[281,349]],
	[[298,391],[291,413],[307,369],[320,399],[280,385],[309,413],[278,401],[318,379],[289,372],[336,405],[268,381]],
	[[287,429],[278,442],[292,413],[302,438],[273,422],[291,445],[271,433],[303,422],[280,413],[315,441],[260,418]],
	[[271,456],[264,468],[279,441],[287,463],[258,447],[276,469],[259,457],[285,450],[267,442],[299,470],[250,443]],
	[[256,481],[245,488],[265,468],[268,491],[245,469],[256,492],[244,478],[270,479],[254,466],[275,499],[237,462]],
	[[234,493],[223,496],[245,489],[239,508],[230,479],[229,504],[225,486],[245,498],[238,482],[241,517],[227,471]],
	[[211,499],[201,498],[222,496],[213,512],[209,487],[204,507],[204,491],[220,505],[216,490],[213,520],[208,477]],
	[[189,499],[200,498],[179,496],[186,512],[191,488],[196,508],[197,492],[180,505],[185,492],[184,520],[194,479]],
	[[166,493],[179,497],[155,489],[162,507],[170,479],[172,504],[175,486],[156,499],[163,484],[159,516],[172,471]],
	[[143,479],[155,489],[136,469],[131,490],[157,468],[144,494],[157,479],[131,477],[146,466],[125,499],[162,461]],
	[[128,455],[136,470],[123,443],[114,462],[141,445],[124,468],[141,458],[116,450],[132,443],[104,467],[147,439]],
	[[113,429],[121,444],[109,414],[96,436],[129,422],[107,443],[130,435],[100,423],[122,413],[85,441],[137,417]],
	[[100,391],[109,414],[93,371],[81,398],[120,385],[89,412],[123,401],[81,381],[110,372],[64,402],[129,382]],
	[[88,351],[94,371],[85,331],[67,355],[105,349],[76,369],[105,361],[69,337],[101,334],[51,356],[115,347]],
	[[85,309],[85,331],[83,277],[64,310],[104,308],[69,325],[101,325],[71,295],[96,292],[45,310],[115,308]]
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

//上颌中心点坐标
var centerX = 124;
var centerY = 107;

//图片位置坐标
var picPosX1 = 200;
var picPosY1 = 150;

var picPosX2 = 200;
var picPosY2 = 400;

//当前被选中的牙齿列表
var selectList = new Array();

//存放牙齿详细信息的矩阵
var teethList = new Array();
for(var i = 0; i <= 16; i++)
{
  teethList.push([0, 0, 0, 0]);
}

//存放当前连接体片段中各二次曲线的顶点
var quadraticTops = [[[0,0],[0,0],[0,0]]];

//操作队列
var actionList = [];
var actionCursor = -1;
var LastTeethList = deepCopy(teethList);
var LastQuadraticTops = deepCopy(quadraticTops);






/*
////////////////////////////////////////
初始化动作：建立canvas对象，绘制基本牙列
////////////////////////////////////////
*/
var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");
loadteethmap(teethList);





/*
/////////////////////////////////////////
绘图函数：实际在画布上进行绘制的各类函数
/////////////////////////////////////////
*/

//绘制连接体
function drawConn()
{
	var start = false;
	var plist = [];
	var obj = {
		type: 'path',
		fillStyle: '#FFE4E1',
		strokeStyle: '#FF6A6A',
		strokeWidth: 2,
		layer: true,
		closed: true
	};
	var firstPoint = [];
	var count = 0;
	
	var ajustObj = {
		type: 'quadratic',
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
		handlestart: function(layer) {
			// code to run when resizing starts
			state = -1;
		},
		handlestop: function(layer) {
			// code to run while resizing stops
			state = 0;
			for(var i = 0; i < quadraticTops.length; i++)
			{
				if(quadraticTops[i][0].toString() == [layer.x1, layer.y1].toString() && quadraticTops[i][1].toString() == [layer.x2, layer.y2].toString() )
				{
					quadraticTops[i][2] = [currentMousePos.x, currentMousePos.y];

				}
			}
			storeChange('quadraticTops');
			redrawall();
		}
	};
	
	//计算连接体片段,格式：[起点,终点,线形]
	for(var i = 0; i < 16; i++)
	{
		if(teethList[i][1] != 0)
		{
			if(firstPoint.length == 0)
			{
				firstPoint = [topMidPos[i][0], topMidPos[i][1]];
			}
			else
			{
				if(plist.length == 0)
				{
					if(firstPoint.toString() != [topMidPos[i][0], topMidPos[i][1]].toString() )
					{
						plist.push([firstPoint, [topMidPos[i][0], topMidPos[i][1]], 'quadratic']);
					}
				}
				else
				{
					if(plist[plist.length-1][1].toString() != [topMidPos[i][0], topMidPos[i][1]].toString())
					{
						plist.push([ plist[plist.length-1][1], [topMidPos[i][0], topMidPos[i][1]], 'quadratic']);
					}
				}
			}

			var a = i;
			while(teethList[i][1] != 0)
			{
				i++;
			}
			var b = i-1;
			for(var j = a; j <= b; j++)
			{
				plist.push([[topMidPos[j][0], topMidPos[j][1]], [topMidPos[j+1][0], topMidPos[j+1][1]], 'line']);
			}
			count += 1;
		}

		if(teethList[i][2] != 0)
		{
			if((teethList[i][2] == 'A' && i >= 8 && i <= 15) || (teethList[i][2] == 'B' && i >= 0 && i <= 7))
			{
				var midx = topMidPos[i][0];
				var midy = topMidPos[i][1];
			}
			else
			{
				var midx = topMidPos[i+1][0];
				var midy = topMidPos[i+1][1];
			}
			if(firstPoint.length == 0)
			{
				firstPoint = [midx, midy];
			}
			else
			{
				if(plist.length == 0)
				{
					if(firstPoint.toString() != [midx, midy].toString() )
					{
						plist.push([ firstPoint, [midx, midy], 'quadratic']);
					}
				}
				else
				{
					if(plist[plist.length-1][1].toString() != [midx, midy].toString() )
					{
						plist.push([ plist[plist.length-1][1], [midx, midy], 'quadratic']);
					}
				}
			}
			count += 1;
		}
	}
	plist.push([plist[plist.length-1][1], firstPoint, 'quadratic']);
	
	//读取quadraticTops中的有用信息并删除过期项
	for(var i = 0; i < quadraticTops.length; i++)
	{
		for(var j = 0; j < plist.length; j++)
		{
			if(plist[j][2] == 'quadratic' && quadraticTops[i][0].toString() == plist[j][0].toString() && quadraticTops[i][1].toString() == plist[j][1].toString())
			{
				plist[j][2] = quadraticTops[i][2];
				break;
			}
		}
		if(j == plist.length)
		{
			quadraticTops.splice(i,1);
		}
	}
	
	//根据连接体片段绘制整个连接体
	if(count == 1)
	{
		return;
	}
	else
	{
		count = 1;
		var attrname = 'p'+ count;
		var attrvaluefirst = {};
		var attrvalueline = {};
		var attrvaluequadratic = {};
		
		//起始点&第一条线
		if(plist[0][2] == 'line')
		{
			attrvaluefirst.type = 'line';
			attrvaluefirst.x1 = plist[0][0][0];
			attrvaluefirst.y1 = plist[0][0][1];
			attrvaluefirst.x2 = plist[0][1][0];
			attrvaluefirst.y2 = plist[0][1][1];
		}
		else
		{
			if(plist[0][2] == 'quadratic')
			{
				quadraticTops.push([plist[0][0], plist[0][1], [centerX, centerY]]);
				attrvaluefirst.cx1 = centerX;
				attrvaluefirst.cy1 = centerY;
			}
			else
			{
				attrvaluefirst.cx1 = plist[0][2][0];
				attrvaluefirst.cy1 = plist[0][2][1];
			}
			attrvaluefirst.type = 'quadratic';
			attrvaluefirst.x1 = plist[0][0][0];
			attrvaluefirst.y1 = plist[0][0][1];
			attrvaluefirst.x2 = plist[0][1][0];
			attrvaluefirst.y2 = plist[0][1][1];
			if(isconnmodify)
			{
				ajustObj.x1 = attrvaluefirst.x1;
				ajustObj.y1 = attrvaluefirst.y1;
				ajustObj.cx1 = attrvaluefirst.cx1;
				ajustObj.cy1 = attrvaluefirst.cy1;
				ajustObj.x2 = attrvaluefirst.x2;
				ajustObj.y2 = attrvaluefirst.y2;
				$('canvas').addLayer(ajustObj);
			}
		}
		obj[attrname] = attrvaluefirst;
		count ++;
		attrname = 'p'+ count;
		
		//循环接续其他连接体片段
		for(var i = 1; i < plist.length; i++)
		{
			if(plist[i][2] == 'line')
			{
				attrvalueline.type = 'line';
				attrvalueline.x2 = plist[i][1][0];
				attrvalueline.y2 = plist[i][1][1];
				obj[attrname] = $.extend(true, {}, attrvalueline);
				count ++;
				attrname = 'p'+ count;
			}
			else
			{
				if(plist[i][2] == 'quadratic')
				{
					quadraticTops.push([plist[i][0], plist[i][1], [centerX, centerY]]);
					attrvaluequadratic.cx1 = centerX;
					attrvaluequadratic.cy1 = centerY;
				}
				else
				{
					attrvaluequadratic.cx1 = plist[i][2][0];
					attrvaluequadratic.cy1 = plist[i][2][1];
				}
				attrvaluequadratic.type = 'quadratic';
				attrvaluequadratic.x2 = plist[i][1][0];
				attrvaluequadratic.y2 = plist[i][1][1];
				if(isconnmodify)
				{
					ajustObj.x1 = plist[i][0][0];
					ajustObj.y1 = plist[i][0][1];
					ajustObj.cx1 = attrvaluequadratic.cx1;
					ajustObj.cy1 = attrvaluequadratic.cy1;
					ajustObj.x2 = attrvaluequadratic.x2;
					ajustObj.y2 = attrvaluequadratic.y2;
					$('canvas').addLayer(ajustObj);
				}
				
				obj[attrname] = $.extend(true, {}, attrvaluequadratic);
				count ++;
				attrname = 'p'+ count;
			}
		}
		
		//绘制最终的连接体路径obj
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
	$('canvas').removeLayer('base');

	if(begin > end)
	{
		var temp = begin;
		begin = end;
		end = temp;
	}

	var plist = [];
	var ka1,ka2,kb1,kb2;
	var x,y;
	var posBegin,posEnd;

	ka1 = (teethPos[begin][2][1]-teethPos[begin][1][1])/(teethPos[begin][2][0]-teethPos[begin][1][0]);
	ka2 = (teethPos[begin][3][1]-teethPos[begin][4][1])/(teethPos[begin][3][0]-teethPos[begin][4][0]);
	kb1 = (teethPos[end][2][1]-teethPos[end][1][1])/(teethPos[end][2][0]-teethPos[end][1][0]);
	kb2 = (teethPos[end][3][1]-teethPos[end][4][1])/(teethPos[end][3][0]-teethPos[end][4][0]);
	if(begin >= 0 && begin <= 7)
	{
		posBegin = 2;
	}
	else if(begin >= 7 && begin <= 15)
	{
		posBegin = 1;
	}
	if(end >= 0 && end <= 7)
	{
		posEnd = 1;
	}
	else if(end >= 8 && end <= 15)
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
	if((current >= 0 && current <= 4) || (current >= 11 && current <= 15))
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
	else if(current == 5 || current == 10)
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
	if(a >= 0 && a <= 7)
	{
		pts1.push([(teethPos[a][7][0]+teethPos[a][2][0])/2, (teethPos[a][7][1]+teethPos[a][2][1])/2]);
		pts2.push([(teethPos[a][8][0]+teethPos[a][2][0])/2, (teethPos[a][8][1]+teethPos[a][2][1])/2]);
	}
	else if(a >= 8 && a <= 15)
	{
		pts1.push([(teethPos[a][5][0]+teethPos[a][1][0])/2, (teethPos[a][5][1]+teethPos[a][1][1])/2]);
		pts2.push([(teethPos[a][6][0]+teethPos[a][1][0])/2, (teethPos[a][6][1]+teethPos[a][1][1])/2]);
	}
	
	for(var i = a; i <= b; i++)
	{
		pts1.push([(teethPos[i][0][0]+teethPos[i][3][0])/2, (teethPos[i][0][1]+teethPos[i][3][1])/2]);
		pts2.push([(teethPos[i][0][0]+teethPos[i][4][0])/2, (teethPos[i][0][1]+teethPos[i][4][1])/2]);
	}
	
	if(b >= 0 && b <= 7)
	{
		pts1.push([(teethPos[b][5][0]+teethPos[b][1][0])/2, (teethPos[b][5][1]+teethPos[b][1][1])/2]);
		pts2.push([(teethPos[b][6][0]+teethPos[b][1][0])/2, (teethPos[b][6][1]+teethPos[b][1][1])/2]);
	}
	else if(b >= 8 && b <= 15)
	{
		pts1.push([(teethPos[b][7][0]+teethPos[b][2][0])/2, (teethPos[b][7][1]+teethPos[b][2][1])/2]);
		pts2.push([(teethPos[b][8][0]+teethPos[b][2][0])/2, (teethPos[b][8][1]+teethPos[b][2][1])/2]);
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
	if(evt.button == 0)
	{
		end = current;
		var a = Math.min(begin, end);
		var b = Math.max(begin, end);
	    if(state == 1)
		{
			for(var i = a; i <= b; i++)
			{
				teethList[i][0] = 1;
			}
			storeChange('teethList');
		}
		else if(Math.floor(state/10) == 2)
		{
			for(var i = a; i <= b; i++)
			{
				teethList[i][1] = state%10;
			}
			storeChange('teethList');
		}
		else if(state == -1)
		{
			currentMousePos = getMousePos(c, evt);
		}
		begin = end = current = -1;
		redrawall();
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
function dispConn(mod)
{
	if(mod)
	{
		isconndisped = true;
		isconnmodify = mod;
	}
	else
	{
		isconndisped = !isconndisped;
	}
	confset();
}

//切换状态：连接体调整确认
function modfconnconf()
{
	isconndisped = true;
	isconnmodify = false;
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

//根据数组重新绘制图像
function redrawall()
{
	cxt.clearRect(0, 0, c.width, c.height);
	$('canvas').removeLayers();
	loadteethmap();
}

//获取相应牙位应该显示的图片
function getsourceString(i)
{
	var sourceString;
	if(teethList[i][2] != 0)
	{
		if((i >= 11 && i <= 20) || (i >= 0 && i <= 4) || (i >= 27 && i <= 31))
		{
			sourceString = './img/'+ (i+1) +'-1' + teethList[i][2] + '.png';
		}
		else
		{
			sourceString = './img/'+ (i+1) +'.png';
		}
	}
	else
	{
		sourceString = './img/'+ (i+1) +'.png';
	}
    return sourceString;
}

//牙位图绘制主函数
function loadteethmap()
{
	//绘制基托
	for(var i=0;i<16;i++)
  	{
  		if(teethList[i][1] != 0)
  		{
  			var begin = i;
  			var type = teethList[i][1];
  			while(teethList[i][1] == type)
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
		source: './img/top_teeth.png',
		x: picPosX1, 
		y: picPosY1,
		width: 275.56,
		height: 223.89,
		groups: ['teethPic']
	});

	$('canvas').drawImage({
		layer: true,
		source: './img/bottom_teeth.png',
		x: picPosX2, 
		y: picPosY2,
		width: 275.56,
		height: 223.89,
		groups: ['teethPic']
	});
	
	//修正牙列用图片
	/*$('canvas').drawImage({
		layer: true,
		source: './img/pic.png',
		x: picPosX1, 
		y: picPosY1-10,
		width: 300,
		height: 218.5,
		groups: ['teethPic']
	});*/
	
	//显示所有标识点
	/*for(var i = 0; i < 16; i++)
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
  for(var i=0; i<16;i++)
  {
  	if(teethList[i][0] == 1)
  	{
  		var begin = i;
  		while(teethList[i][0] == 1)
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
		var tmp = (teethPos[i][0][0] - x)*(teethPos[i][0][0] - x) + (teethPos[i][0][1] - y)*(teethPos[i][0][1] - y);
		if(tmp < dis)
		{
			dis = tmp;
			pos = i;
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