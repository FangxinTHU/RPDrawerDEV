/**
 * 2016 Xin Fang 
 * version 6.0+
 * V1功能：缺失标记、完整基托、舌侧基托、普通三臂卡环、连接体简单绘制
 * V2功能：连接体抛物线可调整、可撤销/重做（10步）
 * V3：根据新需求，更改牙列图、牙列参照点坐标数据结构，使用新结构、新需求绘制：缺失双线、基托
 * V4：根据新需求，去掉卡环图片，用图形化方式表示支托和卡环
 * V5：根据新需求，重写连接体绘制方法（包括连接体的调整，调整功能有待调试）
 * V6：新增备注功能，进一步优化连接体绘制规则，微调了卡环和支托形态
 */

 
/*
////////////////////////////////////////
初始化动作：建立canvas对象，绘制基本牙列
////////////////////////////////////////
*/

LastTeethList = deepCopy(teethList);
LastQuadraticTops = deepCopy(quadraticTops);
loadteethmap(teethList);
document.oncontextmenu = function(e){ 
	return false; 
};


/*
/////////////////////////////////////////
绘图函数：实际在画布上进行绘制的各类函数
/////////////////////////////////////////
*/

/*
********
绘制备注【无返回值】
********
ID：			传入备注建立的初始坐标作为备注的唯一标识
remarkpos：		备注左上角的坐标
linepos：		备注起点的坐标
content：		备注内容
*/
function drawRemark(ID, remarkpos, linepos, content)
{
	//临时text对象
	var obj = {
		type: 'text', 
		mID: ID, 
		name: 'tempRemark', 
		fillStyle: '#000000',
		draggable: true,
		fontSize: '10pt',
		fontFamily: 'Trebuchet MS, sans-serif',
		text: content,
		x: remarkpos[0], y: remarkpos[1],
		align: 'left',
		maxWidth: 50,
		rtclick: false
	};
	
	//暂时绘制一次，以便获取文字需要占用的宽度和高度
	$('canvas').addLayer(obj).drawLayers();
	var twidth = $('canvas').measureText('tempRemark').width;
	var theight = $('canvas').measureText('tempRemark').height;
	
	//完善临时text对象为用于正式绘制
	obj.name = content;
	obj.x += twidth/2;
	obj.y += theight/2;
	
	//拖拽响应部分
	obj.dragstart = function(layer){
		
		//是否为右键拖动？
		if(event.button == 2)
		{
			layer.rtclick = true;
			return;
		}
		
		//记录拖动锚点与备注左上角的相对位置
		measure[0] = currentMousePos.x - remarkpos[0];
		measure[1] = currentMousePos.y - remarkpos[1];
		
		//移除备注引导线
		$('canvas').removeLayer(content+'line').drawLayers();
	};
	obj.dragstop = function(layer) {
		
		//不响应右键的拖拽行为
		if(!layer.rtclick)
		{
			//根据当前鼠标位置和之前记录的相对位置关系更新备注左上角坐标
			layer.x = currentMousePos.x-measure[0]+twidth/2;
			layer.y = currentMousePos.y-measure[1]+theight/2;
			
			//更改全局变量remarkList中该备注的位置
			for(var i = 0; i < remarkList.length; i++)
			{
				if(remarkList[i][0].toString() == layer.mID)
				{
					remarkList[i][1] = [currentMousePos.x-measure[0], currentMousePos.y-measure[1]];
					remarkList[i][2] = [currentMousePos.x-measure[0]+twidth, currentMousePos.y-measure[1]+theight];
				}
			}
			confset();
		}
	};
	
	//移除临时text对象，绘制正式text
	$('canvas').addLayer(obj).removeLayer('tempRemark').drawLayers();
	
	//根据备注点坐标 和 备注框左上角坐标 的相对位置，确定引导线与备注框的连接点
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
	
	//绘制引导线 
	$('canvas').drawLine({
		name: content+'line',
		layer: true, 
		visible: true,
		strokeStyle: '#00000',
		strokeWidth: 2,
		x1: connPoint.x, y1: connPoint.y,
		x2: linepos[0], y2: linepos[1],
		handle: {
			type: 'arc',
			fillStyle: '#fff',
			strokeStyle: '#c33',
			strokeWidth: 2,
			radius: 3
		},
		
		//拖动停止，更新全局变量remarkList中的备注点坐标
		handlestop: function(){
			for(var i = 0; i < remarkList.length; i++)
			{
				if(remarkList[i][0].toString() == obj.mID)
				{
					remarkList[i][3] = [currentMousePos.x, currentMousePos.y];
				}
			}
			confset();
		}
	});
}


/*
*************************************************************
绘制用于拖拽调整的紫色图层（连接体调整图层点击事件的响应函数）【无返回值】
*************************************************************
layer：			连接体调整图层对象
*/
function clickREP(layer)
{
	//获取以清除所有的引导线对象（目前只能通过类型、宽度和颜色识别，要求后面不能使用宽度为1的紫色直线）
	var guidelinelist = $('canvas').getLayers(function(layer) {
		return (layer.type == 'line' && layer.strokeWidth == 1 && layer.strokeStyle == '#ED05FC');
	});
	
	//删除引导线
	var layers = $('canvas').getLayers();
	for(var i = 0; i < guidelinelist.length; i++)
	{
		layers.splice(guidelinelist[i].index, 1);
	}
	
	//删除其它的紫色操作图层（此时该图层绑定的handle会一起被删除）
	$('canvas').removeLayerGroup('myConns').drawLayers();
	
	//在全局变量adjustIndex中记录当前调整的曲线在构成大连接体的所有曲线中的序号，用于在拖拽调整后的重绘后维持当前曲线片段的被调整状态
	adjustIndex = layer.idnum;
	
	//新建一个紫色操作图层
	var handleajustObj = {
		layer: true,
		strokeStyle: '#ED05FC',
		strokeWidth: 2,
		rounded: 10,
		groups: ['myConns'],
		handle: {
			type: 'arc',
			fillStyle: '#FFFFFF',
			strokeStyle: '#ED05FC',
			strokeWidth: 2,
			radius: 2
		},
		guide: {
			strokeStyle: '#ED05FC',
			strokeWidth: 1
		},
		//记录被拖动更改的是贝塞尔/抛物线上的哪一个点。1：起点，2：终点，3：第一参照点，4：第二参照点（仅针对三次贝塞尔曲线）
		mp: 3,
	};
	handleajustObj.type = layer.type;
	handleajustObj.x1 = layer.x1;
	handleajustObj.y1 = layer.y1;
	handleajustObj.cx1 = layer.cx1;
	handleajustObj.cy1 = layer.cy1;
	if(layer.type == 'bezier')
	{
		handleajustObj.cx2 = layer.cx2;
		handleajustObj.cy2 = layer.cy2;
	}
	handleajustObj.x2 = layer.x2;
	handleajustObj.y2 = layer.y2;
	
	//调整点拖拽响应
	handleajustObj.handlestart = function(layer) {
		
		//找出被拖拽的是哪一个调整点（仅针对贝塞尔曲线，因为抛物线一定是调整顶点）
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
		
		//记录调整点被拖动前，曲线的起点和终点位置
		layer.px1 = layer.x1;
		layer.py1 = layer.y1;
		layer.px2 = layer.x2;
		layer.py2 = layer.y2;
	};
	handleajustObj.handlestop = function(layer) {
		
		//在全局变量quadraticTop寻找该曲线的历史数据，用新数据覆盖
		var i;
		for(i = 0; i < quadraticTops.length; i++)
		{
			if(quadraticTops[i][1][0] == layer.px1 && quadraticTops[i][2][0] == layer.px2 )
			{
				//如果被调整的是参考点，直接用当前鼠标坐标覆盖记录即可
				if(layer.mp > 2)
				{
					quadraticTops[i][layer.mp] = [currentMousePos.x, currentMousePos.y];
				}
				//否则只取当前鼠标坐标的Y值（用于调整口腔中轴线上参考点的上下调整）
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
		
		//没有相关历史记录则新建
		if(i == quadraticTops.length)
		{
			var temp = [];
			if(layer.type =='bezier')
			{
				temp = ['Bezier', [layer.px1, layer.py1], [layer.px2, layer.py2], [layer.cx1, layer.cy1], [layer.cx2, layer.cy2]];
				if(layer.mp == 1)
				{
					if(layer.px1 == centerX)
					{
						temp[layer.mp][0] = centerX;
						temp[layer.mp][1] = currentMousePos.y;
					}
				}
				else if(layer.mp == 2)
				{
					if(layer.px2 == centerX)
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
	};
	$('canvas').addLayer(handleajustObj).drawLayers();
}


/*
*****************
绘制下牙小连接体【无返回值】
*****************
pos：绘制小连接体的位置
*/
function drawedgestick(pos)
{
	var edgestick = {
		type: 'line',
		strokeStyle: '#FF6A6A',
		strokeWidth: 5,
		layer: true,
		groups: ['edgesticks'],
		rounded: 10
	};
	edgestick.x1 = teethPos[pos[0]][pos[1]][0];
	edgestick.y1 = teethPos[pos[0]][pos[1]][1];
	var edgestickPoint = getGapPoint(pos).outer;
	edgestick.x2 = edgestickPoint[0];
	edgestick.y2 = edgestickPoint[1];
	$('canvas').addLayer(edgestick);
}


/*
*********************************
计算上颌连接体需要连接的位置列表【返回列表内容、连接片段数量】
*********************************
*/
function getConnPoints()
{
	//列表的起始点
	var firstPoint = [];
	//某颗牙齿需要连接的位置，最多为近中（1）、远中（2）两个
	var pos = [];
	//连接的片段总数，至少有两个才有绘制连接体的意义
	var count = 0;
	//连接位置列表，格式：[起点位置，终点位置，线型]
	var llist = [];
	
	for(var i = 0; i < 16; i++)
	{
		pos = [];
		//需要连接
		if(teethList[i][1] + teethList[i][2] + teethList[i][3] > 0)
		{
			//基托？
			if(teethList[i][1] != 0)
			{
				pos.push(2-Math.floor(i/8));
				count += 1;
			}
			if(teethList[i][2] != 0)
			{
				//卡环？
				pos.push(Math.floor(teethList[i][2]/1000));
			}
			if(teethList[i][3] != 0)
			{
				//支托
				pos.push(teethList[i][3]);
			}
			
			//保证连接顺序
			pos.sort();
			if(i < 8)
			{
				pos.reverse();
			}
			
			//将连接位置加入列表
			for(var j = 0; j < pos.length; j++)
			{
				if(firstPoint.length == 0)
				{
					firstPoint = [i, pos[j]];
				}
				else
				{
					if(llist.length == 0)
					{
						if(teethPos[firstPoint[0]][firstPoint[1]].toString() != teethPos[i][pos[j]].toString() )
						{
							llist.push([firstPoint, [i, pos[j]], 'B']);
							count += 1;
						}
					}
					else
					{
						if(teethPos[llist[llist.length-1][1][0]][llist[llist.length-1][1][1]].toString() != teethPos[i][pos[j]].toString())
						{
							llist.push([ llist[llist.length-1][1], [i, pos[j]], 'B']);
							count += 1;
						}
					}
				}
			}
			
			//基托连续连接的情况
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
				i--;
			}
		}
	}
	if(count > 1)
	{
		//最后一段连接封口
		llist.push([ llist[llist.length-1][1], firstPoint, 'B' ]);
		count += 1;
	}
	return {'llist':llist, 'count':count};
}


/*
*********************************************************************
将连接位置列表转换为绘图信息列表，读取并应用quadraticTops中的顶点坐标【返回绘图信息列表】
*********************************************************************
*/
function Pos2Path(connPoints)
{
	//返回的绘图信息列表，格式：[线型，起点坐标，终点坐标， 其他参照点坐标（0或2个）]
	var plist = [];
	var cplseg;
	
	for(var i = 0; i < connPoints.llist.length; i++)
	{
		//直线，根据牙位坐标直接转换
		if(connPoints.llist[i][2] == 'L')
		{
			plist.push(['Line', teethPos[connPoints.llist[i][0][0]][connPoints.llist[i][0][1]], teethPos[connPoints.llist[i][1][0]][connPoints.llist[i][1][1]]]);
		}
		else
		{
			//曲线，使用特定函数返回用曲线连接两点需要绘制的各个片段
			cplseg = connTwoPoint(connPoints.llist[i][0], connPoints.llist[i][1]);
			for(var j = 0; j < cplseg.length; j++)
			{
				plist.push(cplseg[j]);
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
				var k;
				for(k = 0; k < plist.length; k++)
				{
					if(plist[k][1].toString() == plist[j][2].toString())
					{
						plist[k][1] = deepCopy(quadraticTops[i][2]);
					}
					if(plist[k][2].toString() == plist[j][1].toString())
					{
						plist[k][2] = deepCopy(quadraticTops[i][1]);
					}
				}
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
	return plist;
}


/*
***********
绘制连接体【无返回值】
***********
type：连接体类型（暂时未使用，有待补充）
*/
function drawConn(type)
{
	//绘制上牙连接体
	
	//获取上牙连接体要连接的位置
	var connPoints = getConnPoints();
	
	//连接体主体path层
	var obj = {
		type: 'path',
		fillStyle: '#FFE4E1',
		strokeStyle: '#FF6A6A',
		strokeWidth: 2,
		layer: true,
		closed: true
	};
	
	//连接体调整响应层，用于相应调整点击事件
	var ajustObj = {
		layer: true, 
		strokeStyle: '#c33',
		strokeWidth: 2,
		rounded: true,
		idnum:-1,
		click: function(layer){
			clickREP(layer);
		}
	};
	
	//连接位置大于2个才有意义绘制连接体
	if(connPoints.count > 2)
	{
		//根据连接位置列表获取详细绘制信息
		var plist = Pos2Path(connPoints);
		
		//Path片段计数
		var count = 1;
		//Path片段名
		var attrname = 'p'+ count;
		//Path片段对象
		var attrvalue = {};
		attrvalue.x1 = plist[0][1][0];
		attrvalue.y1 = plist[0][1][1];

		for(var i = 0; i < plist.length; i++)
		{
			//Path片段：直线
			if(plist[i][0] == 'Line')
			{
				$.extend(true, attrvalue, {
					type: 'line',
					x2: plist[i][2][0],
					y2: plist[i][2][1]
				});
			}
			else
			{
				//Path片段：三次贝塞尔曲线
				if(plist[i][0] == 'Bezier')
				{
					$.extend(true, attrvalue, {
						type: 'bezier',
						x2: plist[i][2][0],
						y2: plist[i][2][1],
						cx1: plist[i][3][0],
						cy1: plist[i][3][1],
						cx2: plist[i][4][0],
						cy2: plist[i][4][1]
					});
					
				}
				
				//Path片段：二次曲线
				else
				{
					$.extend(true, attrvalue, {
						type: 'quadratic',
						x2: plist[i][2][0],
						y2: plist[i][2][1],
						cx1: plist[i][3][0],
						cy1: plist[i][3][1],
					});
				}
				
				//调整响应层
				var tmpajustObj = $.extend(true, {}, ajustObj);
				if(isconnmodify)
				{
					$.extend(true, tmpajustObj, attrvalue);
					tmpajustObj.x1 = plist[i][1][0];
					tmpajustObj.y1 = plist[i][1][1];
					tmpajustObj.idnum = i;
					$('canvas').addLayer(tmpajustObj);
				}
				
			}
			
			//添加Path片段
			obj[attrname] = $.extend(true, {}, attrvalue);
			count ++;
			attrname = 'p'+ count;
			attrvalue = {};
		}
		
		//调整连接体图层至最底层
		$('canvas').addLayer(obj);
		var layers = $('canvas').getLayers();
		var temp = layers[layers.length-1];
		for(var i = layers.length-1; i > 0; i--)
		{
			layers[i] = layers[i-1];
		}
		layers[0] = temp;
		
		//恢复上一次调整的连接体片段至调整状态
		for(var i = 0; i < layers.length; i++)
		{
			if(layers[i].idnum == adjustIndex)
			{
				clickREP(layers[i]);
			}
		}
		$('canvas').drawLayers();
	}

	//绘制下牙连接体
	
	//确定连接体起始位置
	var botConnBegin = [16, 0];
	var botConnEnd = [16, 0];
	
	for(var i = 16; i < 31; i++)
	{
		if(teethList[i][2] > 0 || teethList[i][3] > 0 || teethList[i][1] > 0)
		{
			
			if(teethList[i][1] > 0)
			{
				if(botConnBegin[1] == 0)
				{
					botConnBegin = [i, 3];
				}
				botConnEnd = [i, 3];
			}
			else
			{
				if(i < 24)
				{
					if(botConnBegin[1] == 0)
					{
						botConnBegin = [i, Math.max(Math.floor(teethList[i][2]/1000), teethList[i][3])];
					}
					botConnEnd = [i, Math.max(Math.floor(teethList[i][2]/1000), teethList[i][3]) - Math.min(Math.floor(teethList[i][2]/1000), teethList[i][3])];
				}
				else
				{
					if(botConnBegin[1] == 0)
					{
						botConnBegin = [i, Math.max(Math.floor(teethList[i][2]/1000), teethList[i][3]) - Math.min(Math.floor(teethList[i][2]/1000), teethList[i][3])];
					}
					botConnEnd = [i, Math.max(Math.floor(teethList[i][2]/1000), teethList[i][3])];
				}
			}
		}
	}
	
	if(botConnBegin[0] < botConnEnd[0])
	{
		//下牙连接体的绘制点列表
		var plist = [];
		
		//内侧连接点
		for(var i = botConnEnd[0]-1; i > botConnBegin[0]; i--)
		{
			plist.push(teethPos[i][10]);
		}
		
		//起始点在基托上
		if(botConnBegin[1] == 3)
		{
			plist.push(teethPos[botConnBegin[0]][10]);
			plist.push([(teethPos[botConnBegin[0]][4][0] + teethPos[botConnBegin[0]][10][0])/2, (teethPos[botConnBegin[0]][4][1] + teethPos[botConnBegin[0]][10][1])/2]);
		}
		//起始点在牙齿之间
		else
		{
			var p1 = getGapPoint(botConnBegin).outer;
			var p2 = getGapPoint(botConnBegin, 'short').outer;
			if((botConnBegin[1] == 2 && botConnBegin[0] < 24) || (botConnBegin[1] == 1 && botConnBegin[0] > 23))
			{
				plist.push(teethPos[botConnBegin[0]][10]);
				plist.push(p1);
				plist.push(p2);
				plist.push([(teethPos[botConnBegin[0]][4][0] + teethPos[botConnBegin[0]][10][0])/2, (teethPos[botConnBegin[0]][4][1] + teethPos[botConnBegin[0]][10][1])/2]);
			}
			else
			{
				plist.push(p1);
				plist.push(p2);
			}
		}
		
		//外侧连接点
		for(var i = botConnBegin[0]+1; i < botConnEnd[0]; i++)
		{
			plist.push([(teethPos[i][4][0] + teethPos[i][10][0])/2, (teethPos[i][4][1] + teethPos[i][10][1])/2]);
		}
		
		//终止点在基托上
		if(botConnEnd[1] == 3)
		{
			plist.push([(teethPos[botConnEnd[0]][4][0] + teethPos[botConnEnd[0]][10][0])/2, (teethPos[botConnEnd[0]][4][1] + teethPos[botConnEnd[0]][10][1])/2]);
			plist.push(teethPos[botConnEnd[0]][10]);
		}
		//终止点在牙齿之间
		else
		{
			var p1 = getGapPoint(botConnEnd).outer;
			var p2 = getGapPoint(botConnEnd, 'short').outer;
			
			if(botConnEnd[1] == 2)
			{
				plist.push([(teethPos[botConnEnd[0]][4][0] + teethPos[botConnEnd[0]][10][0])/2, (teethPos[botConnEnd[0]][4][1] + teethPos[botConnEnd[0]][10][1])/2]);
				plist.push(p2);
				plist.push(p1);
				plist.push(teethPos[botConnEnd[0]][10]);
			}
			else
			{
				plist.push(p2);
				plist.push(p1);
			}
		}
		
		//绘制下牙小连接体
		var stickpos;
		for(var i = 16; i < 32; i++)
		{
			if(teethList[i][2] != 0)
			{
				stickpos = [i, Math.floor(teethList[i][2]/1000)];
				drawedgestick(stickpos);
			}
			if(teethList[i][3] != 0 && teethList[i][3] != Math.floor(teethList[i][2]/1000))
			{
				stickpos = [i, teethList[i][3]];
				drawedgestick(stickpos);
			}
		}
		
		//构建下牙连接体对象
		var topLists = getAroundTops(plist);	
		var attrname;
		var attrvalue = {
			x1: plist[0][0],
			y1: plist[0][1]
		};
		count = plist.length;
		
		for(var i = 0; i < count; i++)
		{
			attrname = 'p'+(i+1);
			type: 'quadratic',
			attrvalue.cx1 = topLists[i].x;
			attrvalue.cy1 = topLists[i].y;
			attrvalue.x2 = plist[(count+i+1)%count][0];
			attrvalue.y2 = plist[(count+i+1)%count][1];
			obj[attrname] = $.extend(true, {}, attrvalue);
			attrvalue = {};
			
		}
		
		//添加下牙连接体对象，调整连接体图层至最底层
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


/*
************************************
使用二次曲线绘制通过若干点的封闭曲线【返回二次曲线顶点列表】
************************************
plist：二次曲线通过点的列表
*/
function getAroundTops(plist)
{
	count = plist.length;
	var topLists = [];
	for(var i = 0; i < count; i++)
	{
		k1 = (plist[(count+i+1)%count][1]-plist[(count+i-1)%count][1])/(plist[(count+i+1)%count][0]-plist[(count+i-1)%count][0]);
		k2 = (plist[(count+i+2)%count][1]-plist[i][1])/(plist[(count+i+2)%count][0]-plist[i][0]);
		x = (plist[(count+i+1)%count][1]-plist[i][1]-k2*plist[(count+i+1)%count][0]+k1*plist[i][0])/(k1-k2);
		y = k1*(x-plist[i][0])+plist[i][1];
		
		//消除异常毛边
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
		topLists.push({'x':x, 'y':y});
	}
	return topLists;
}


/*
*********
绘制基托【无返回值】
*********
begin：起始牙齿
end：终止牙齿
type：基托类型
istmp：是否为响应鼠标动作的临时绘制（临时绘制会被实时刷新）
*/
function drawBase(begin, end, type, istmp)
{
	//清除临时绘制
	$('canvas').removeLayer('base').drawLayers();
	
	//确定绘制的起点和终点
	var a = Math.min(begin, end);
	var b = Math.max(begin, end);
	if(a < 16 && b > 15)
	{
		if(a == begin)
		{
			if(teethList[15][0] == 2)
			{
				b = 14;
			}
			else
			{
				b = 15;
			}
		}
		else
		{
			if(teethList[16][0] == 2)
			{
				a = 17;
			}
			else
			{
				a = 16;
			}
		}
	}
	begin = a;
	end = b;
	
	//计算绘制基托的连接点列表plist
	var plist = [];
	var ka1,ka2,kb1,kb2;
	var x,y;
	var posBegin,posEnd;

	ka1 = (teethPos[begin][2][1]-teethPos[begin][1][1])/(teethPos[begin][2][0]-teethPos[begin][1][0]);
	ka2 = (teethPos[begin][3][1]-teethPos[begin][4][1])/(teethPos[begin][3][0]-teethPos[begin][4][0]);
	kb1 = (teethPos[end][2][1]-teethPos[end][1][1])/(teethPos[end][2][0]-teethPos[end][1][0]);
	kb2 = (teethPos[end][3][1]-teethPos[end][4][1])/(teethPos[end][3][0]-teethPos[end][4][0]);
	
	posBegin = 2-Math.floor(begin/8)%2;
	posEnd = 1+Math.floor(end/8)%2;
	
	//完整基托
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
	
	//只保留舌侧基托
	else if(type == 2)
	{
		for(var i = begin; i <= end; i++)
		{
			plist.push(teethPos[i][2-Math.floor(i/8)%2]);
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
	
	//基托对象
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
	
	var count = plist.length;
	var topLists = getAroundTops(plist);
	var attrname;
	var attrvalue = {
		x1: plist[0][0],
		y1: plist[0][1]
	};
	
	//构建基托片段
	for(var i = 0; i < count; i++)
	{
		attrname = 'p'+(i+1);
		$.extend(true, attrvalue, {
			cx1: topLists[i].x,
			cy1: topLists[i].y,
			x2: plist[(count+i+1)%count][0],
			y2: plist[(count+i+1)%count][1]
		});
		attrvalue.type = 'quadratic';
		obj[attrname] = $.extend(true, {}, attrvalue);
		attrvalue = {};
	}
	
	//添加基托对象，将基托图层移至最底层
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


/*
*********
绘制支托【无返回值】
*********
current：要绘制的牙齿
pos：近中或远中绘制
istmp：是否为响应鼠标动作的临时绘制（临时绘制会被实时刷新）
*/
function drawsupport(current, pos, tmp)
{
	//清除临时绘制
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
	
	//绘制磨牙牙合支托
	if((current >= 0 && current <= 4) || (current >= 11 && current <= 20) || (current >= 27 && current <= 31))
	{
		var x,y;
		var k1 = (teethPos[current][2*pos+3][1] - teethPos[current][2*pos+4][1]) / (teethPos[current][2*pos+3][0] - teethPos[current][2*pos+4][0]);
		var k2 = (teethPos[current][3][1] - teethPos[current][pos][1]) / (teethPos[current][3][0] - teethPos[current][pos][0]);
		var k3 = (teethPos[current][4][1] - teethPos[current][pos][1]) / (teethPos[current][4][0] - teethPos[current][pos][0]);

		var p1 = {
			type: 'quadratic',
			x1: teethPos[current][2*pos+3][0], y1: teethPos[current][2*pos+3][1],
			cx1: teethPos[current][0][0], cy1: teethPos[current][0][1],
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
	
	//绘制尖牙支托
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


/*
*********
绘制卡环【无返回值】
*********
current：要绘制的牙齿
pos1：近中，远中
pos2：双侧，颊侧，舌侧
type：铸造，弯制
length：全卡，半卡
tmp：是否为响应鼠标动作的临时绘制（临时绘制会被实时刷新）
*/
function drawclasp(current, pos1, type, pos2, length, tmp)
{
	//卡环分两层绘制，一层path作为基底，一层boarder做外层线宽变化
	//清除临时绘制
	$('canvas').removeLayer('clasp');
	$('canvas').removeLayerGroup('claspboard');
	
	//path基底对象
	var obj = {
		type: 'path',
        layer: true,
		strokeStyle: '#000000',
		strokeWidth: 2
	};
	if(tmp)
	{
		obj.name = 'clasp';
	}
	
	//根据近远中、舌颊侧、全半卡计算要连接的点列
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
	//外层boarder对象
	var tmpboard = {};
	
	//卡环路径片段对象
	var tmpobj = {
		x1: teethPos[current][pathlist[1]][0],
		y1: teethPos[current][pathlist[1]][1]
	};
	
	var cx,cy;
	var k1, k2;
	for(var i = 2; i < pathlist.length-1; i++)
	{
		attrname = 'p'+ count;
		k1 = (teethPos[current][pathlist[i-2]][1] - teethPos[current][pathlist[i]][1]) / (teethPos[current][pathlist[i-2]][0] - teethPos[current][pathlist[i]][0]);
		k2 = (teethPos[current][pathlist[i-1]][1] - teethPos[current][pathlist[i+1]][1]) / (teethPos[current][pathlist[i-1]][0] - teethPos[current][pathlist[i+1]][0]);
		cx = (k1*teethPos[current][pathlist[i-1]][0] - k2*teethPos[current][pathlist[i]][0] + teethPos[current][pathlist[i]][1] - teethPos[current][pathlist[i-1]][1])/(k1-k2);
		cy = k2*(cx-teethPos[current][pathlist[i]][0])+teethPos[current][pathlist[i]][1];
		
		$.extend(true, tmpobj, {
			type: 'quadratic',
			cx1: cx,
			cy1: cy,
			x2: teethPos[current][pathlist[i]][0],
			y2: teethPos[current][pathlist[i]][1]
		});
		
		//如果为铸造卡环，添加boarder对象
		if(type == 1)
		{
			tempboard = $.extend(true, {}, tmpobj);
			$.extend(true, tempboard, {
				x1: teethPos[current][pathlist[i-1]][0],
				y1: teethPos[current][pathlist[i-1]][1],
				layer: true,
				strokeStyle: '#000000'
			});
			if(tmp)
			{
				tempboard.groups = ['claspboard'];
			}
			
			//分段设定线宽
			if(pathlist.length >= 7)
			{
				if(i < Math.ceil(pathlist.length/2))
				{
					tempboard.strokeWidth = i;
				}
				else
				{
					tempboard.strokeWidth = pathlist.length - i;
				}
			}
			else
			{
				tempboard.strokeWidth = i;
			}
			
			$('canvas').addLayer(tempboard);
		}
		
		obj[attrname] = $.extend(true, {}, tmpobj);
		tmpobj = {};
		count ++;
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
	if(a < 16 && b > 15)
	{
		if(a == begin)
		{
			if(teethList[15][0] == 2)
			{
				b = 14;
			}
			else
			{
				b = 15;
			}
		}
		else
		{
			if(teethList[16][0] == 2)
			{
				a = 17;
			}
			else
			{
				a = 16;
			}
		}
	}
	
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
				if(a == begin)
				{
					if(teethList[15][0] == 2)
					{
						b = 14;
					}
					else
					{
						b = 15;
					}
				}
				else
				{
					if(teethList[16][0] == 2)
					{
						a = 17;
					}
					else
					{
						a = 16;
					}
				}
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
				if(a == begin)
				{
					if(teethList[15][0] == 2)
					{
						b = 14;
					}
					else
					{
						b = 15;
					}
				}
				else
				{
					if(teethList[16][0] == 2)
					{
						a = 17;
					}
					else
					{
						a = 16;
					}
				}
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
		var i;
		for(i = 0; i < remarkList.length; i++)
		{
			if(currentMousePos.x > remarkList[i][1][0] && currentMousePos.x < remarkList[i][2][0] && currentMousePos.y > remarkList[i][1][1] && currentMousePos.y < remarkList[i][2][1])
			{
				$('#newRemark').css("display", "none");
				$('#editRemark').attr("itemid", i);
				$('#changeRemark').css("display", "block");
				$('#changeRemark').css("left", evt.clientX + $(document).scrollLeft());
				$('#changeRemark').css("top", evt.clientY + $(document).scrollTop());
				postRclickpos = [currentMousePos.x, currentMousePos.y];
				break;
			}
		}
		if(i == remarkList.length)
		{
			$('#changeRemark').css("display", "none");
			$('#newRemark').css("display", "block");
			$('#newRemark').css("left", evt.clientX + $(document).scrollLeft());
			$('#newRemark').css("top", evt.clientY + $(document).scrollTop());
			postRclickpos = [currentMousePos.x, currentMousePos.y];
		}
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
	confset();
	isconndisped = false;
	$('#conn').val('显示连接体');
	$('#conn').removeClass("red_btn");
	$('#conn').addClass("blue_btn");
	state = 1;
}

//切换状态：基托选择
function baseSelected()
{
	var base = $('#base').val();
	confset();
	isconndisped = false;
	$('#conn').val('显示连接体');
	$('#conn').removeClass("red_btn");
	$('#conn').addClass("blue_btn");
	$('#base').val(base);
	state = parseInt(base);
}

//切换状态：卡环选择
function claspSelected()
{
	var clasptype = $('#clasptype').val();
	var clasppos = $('#clasppos').val();
	var clasplength = $('#clasplength').val();
	confset();
	isconndisped = false;
	$('#conn').val('显示连接体');
	$('#conn').removeClass("red_btn");
	$('#conn').addClass("blue_btn");
	$('#clasptype').val(clasptype);
	$('#clasppos').val(clasppos);
	$('#clasplength').val(clasplength);
	//标记卡环选择状态：3
	if(parseInt(clasptype)*parseInt(clasppos)*parseInt(clasplength) != 0)
	{
		state = 3*1000 + parseInt(clasptype)*100 + parseInt(clasppos)*10 + parseInt(clasplength);
	}
}

//切换状态：支托选择
function supportSelected()
{
	
	var support = $('#support').val();
	confset();
	isconndisped = false;
	$('#conn').val('显示连接体');
	$('#conn').removeClass("red_btn");
	$('#conn').addClass("blue_btn");
	//标记卡环选择状态：4
	$('#support').val(support);
	state = parseInt(support);
}

//切换状态：显示/隐藏连接体
function dispConn()
{
	if(isconndisped)
	{
		isconndisped = false;
		$('#conn').val('显示连接体');
		$('#conn').removeClass("red_btn");
		$('#conn').addClass("blue_btn");
	}
	else
	{
		conntypelist = [document.getElementById("topConn1").checked, document.getElementById("topConn2").checked, document.getElementById("botConn1").checked];
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
	$('#conn').val('隐藏连接体');
	$('#conn').removeClass("blue_btn");
	$('#conn').addClass("red_btn");
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
		$('#modfconn').addClass("blue_btn");
	}
	confset();
}

//恢复初始状态
function confset()
{
	
	$('#newRemark').css("display", "none");
	$('#remarkText').val('');
	$('#remarkInput').css("display", "none");
	$('#editRemark').attr("itemid", "-1");
	$('#remarkconf').attr("edit", "false");
	$('#changeRemark').css("display", "none");
	$('#support').val("0");
	$('#clasptype').val("0");
	$('#clasppos').val("0");
	$('#clasplength').val("0");
	$('#base').val("0");
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
	if(wt[3])
	{
		teethList[16][0] = 0;
	}
	else
	{
		teethList[16] = [2, 0, 0, 0];
	}
	if(wt[2])
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
			sourceString = './img/bottom_teeth_LM.png';
		}
		else if(teethList[31][0] != 2 && teethList[16][0] == 2)
		{
			sourceString = './img/bottom_teeth_RM.png';
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
	  drawRemark(remarkList[i][0], remarkList[i][1], remarkList[i][3], remarkList[i][4]);
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
	var dis = Number.MAX_VALUE;
	var pos = -1;
	for(var i = 0; i < 32; i++)
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


//获取连接体边缘的连接点
function getEdgeStickPos(pos, length)
{
	var x1, x2, posbeside, y1, y2;
	if(pos[0] < 16)
	{
		posbeside = pos[0] + (2*Math.floor(pos[0]/8)-1)*(2*pos[1]-3);
	}
	else
	{
		posbeside = pos[0] + (2*Math.floor((pos[0]-16)/8)-1)*(2*pos[1]-3);
	}
	x1 = teethPos[pos[0]][pos[1]][0];
	y1 = teethPos[pos[0]][pos[1]][1];
	
	if(length == 'long')
	{
		return getIntersection(teethPos[pos[0]][pos[1]], getMidPoint(pos[0], pos[1]), teethPos[pos[0]][10], teethPos[posbeside][10]);
	}
	else if(length == 'short')
	{
		return getIntersection(teethPos[pos[0]][pos[1]], getMidPoint(pos[0], pos[1]), teethPos[pos[0]][4], teethPos[posbeside][4]);
	}
}

//计算绘制牙缝之间的“凹”形（小连接体）所需的连接点：
//pos——牙缝位置
//type——
//	'begin':返回起点一侧的连接点
//	'end'：返回终点一侧的连接点
function getGapPoint(pos, type)
{
	var gapPoint1, gapPoint2, transX, transY, posbeside;
	var p = teethPos[pos[0]][pos[1]];
	var midp = getMidPoint(pos[0], pos[1]);
	
	if(type == 'begin')
	{
		transX = 2/Math.sqrt(Math.pow((p[0]-midp[0])/(p[1]-midp[1]), 2)+1);
	}
	else if(type == 'end')
	{
		transX = -2/Math.sqrt(Math.pow((p[0]-midp[0])/(p[1]-midp[1]), 2)+1);
	}
	else
	{
		transX = 0;
	}
	transY = -transX*(p[0]-midp[0])/(p[1]-midp[1]);
	posbeside = pos[0] + (2*Math.floor(pos[0]/8)-1)*(2*pos[1]-3);
	gapPoint1 = [p[0] + transX, p[1] + transY];
	if(type == 'short')
	{
		gapPoint2 = getIntersection(p, midp, [(teethPos[pos[0]][10][0]+teethPos[pos[0]][4][0])/2, (teethPos[pos[0]][10][1]+teethPos[pos[0]][4][1])/2], [(teethPos[posbeside][10][0]+teethPos[posbeside][4][0])/2, (teethPos[posbeside][10][1]+teethPos[posbeside][4][1])/2]);
	}
	else
	{
		gapPoint2 = getIntersection(p, midp, teethPos[pos[0]][10], teethPos[posbeside][10]);
	}
	gapPoint2[0] += transX;
	gapPoint2[1] += transY;
	return {inner:gapPoint1, outer:gapPoint2};
}

//计算连接体中两点间的相连方式（用于组合路径）
function connTwoPoint(pos1, pos2)
{
	var p1 = teethPos[pos1[0]][pos1[1]];
	var p2 = teethPos[pos2[0]][pos2[1]];
	var midp1 = getMidPoint(pos1[0], pos1[1]);
	var midp2 = getMidPoint(pos2[0], pos2[1]);
	var temp = [];
	var gapPoints, gapPoint1, gapPoint2, gapPoint3, gapPoint4, transX, transY, posbeside;
	
	if((p1[0]-centerX)*(p2[0]-centerX) >= 0)
	{
		gapPoints = getGapPoint(pos1, 'begin');
		gapPoint1 = gapPoints.inner;
		gapPoint2 = gapPoints.outer;
		
		gapPoints = getGapPoint(pos2, 'end');
		gapPoint3 = gapPoints.outer;
		gapPoint4 = gapPoints.inner;
		
		return [
			['Line', p1, gapPoint1],
			['Line', gapPoint1, gapPoint2],
			['Bezier', gapPoint2, gapPoint3, [(gapPoint2[0]+midp1[0])/2, (gapPoint2[1]+midp1[1])/2], [(gapPoint3[0]+midp2[0])/2, (gapPoint3[1]+midp2[1])/2]],
			['Line', gapPoint3, gapPoint4],
			['Line', gapPoint4, p2]
		];
	}
	else
	{
		var cPoint = [centerX, (midp1[1]+midp2[1])/2];
		if(Math.abs(midp1[1]-midp2[1]) > 20)
		{
			var tp1, tp2, tmpx;
			
			gapPoints = getGapPoint(pos1, 'begin');
			gapPoint1 = gapPoints.inner;
			gapPoint2 = gapPoints.outer;
			temp.push(['Line', p1, gapPoint1]);
			temp.push(['Line', gapPoint1, gapPoint2]);
			
			if(cPoint[1] < gapPoint2[1] && cPoint[1] > midp1[1])
			{
				tmpx = (cPoint[1]-gapPoint2[1])*(gapPoint2[0]-midp1[0])/(gapPoint2[1]-midp1[1])+gapPoint2[0];
				tp1 = [(gapPoint2[0]+tmpx)/2, (gapPoint2[1]+cPoint[1])/2];
				tp2 = [(cPoint[0]+3*tmpx)/4, cPoint[1]];
			}
			else
			{
				tp1 = [(3*gapPoint2[0]+midp1[0])/4, (3*gapPoint2[1]+midp1[1])/4];
				tp2 = [(gapPoint2[0]+midp1[0])/2, cPoint[1]];
			}
			temp.push(['Bezier', gapPoint2, cPoint, tp1, tp2]);
			
			gapPoints = getGapPoint(pos2, 'end');
			gapPoint3 = gapPoints.outer;
			gapPoint4 = gapPoints.inner;
			
			if(cPoint[1] < gapPoint3[1] && cPoint[1] > midp2[1])
			{
				tmpx = (cPoint[1]-gapPoint3[1])*(gapPoint3[0]-midp2[0])/(gapPoint3[1]-midp2[1])+gapPoint3[0];
				tp1 = [(gapPoint3[0]+tmpx)/2, (gapPoint3[1]+cPoint[1])/2];
				tp2 = [(cPoint[0]+3*tmpx)/4, cPoint[1]];
			}
			else
			{
				tp1 = [(3*gapPoint3[0]+midp2[0])/4, (3*gapPoint3[1]+midp2[1])/4];
				tp2 = [(gapPoint3[0]+midp2[0])/2, cPoint[1]];
			}
			temp.push(['Bezier', cPoint, gapPoint3, tp2, tp1]);
			temp.push(['Line', gapPoint3, gapPoint4]);
			temp.push(['Line', gapPoint4, p2]);
			
			return temp;
		}
		else
		{
			gapPoints = getGapPoint(pos1, 'begin');
			gapPoint1 = gapPoints.inner;
			gapPoint2 = gapPoints.outer;
			gapPoints = getGapPoint(pos2, 'end');
			gapPoint3 = gapPoints.outer;
			gapPoint4 = gapPoints.inner;
			
			return [
				['Line', p1, gapPoint1],
				['Line', gapPoint1, gapPoint2],
				['Quadratic', gapPoint2, gapPoint3, cPoint],
				['Line', gapPoint3, gapPoint4],
				['Line', gapPoint4, p2]
			];
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

//计算两条直线交点
function getIntersection(p1, p2, p3, p4)
{
	var k1 = (p2[1]-p1[1])/(p2[0]-p1[0]);
	var k2 = (p4[1]-p3[1])/(p4[0]-p3[0]);
	var x = (k1*p1[0]-p1[1]-k2*p3[0]+p3[1])/(k1-k2);
	var y = k1*(x-p1[0])+p1[1];
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


//备注绘制部分
function setNewRemark()
{
	$('#remarkInput').css("display","block");
	var left = c.getBoundingClientRect().left + $(document).scrollLeft() + postRclickpos[0];
	var top = c.getBoundingClientRect().top + $(document).scrollTop() + postRclickpos[1];
	$('#remarkInput').css("left",left);
	$('#remarkInput').css("top",top);
	$('#newRemark').css("display", "none");
}

//新建一个备注
function confNewRemark()
{
	var edit = $('#remarkconf').attr("edit");
	var text = $('#remarkText').val();
	var obj = {
		type: 'text', 
		name: 'tempRemark', 
		fontSize: '10pt',
		fontFamily: 'Trebuchet MS, sans-serif',
		text: text,
		x: 0, y: 0,
		align: 'left',
		maxWidth: 50,
	};
	$('canvas').addLayer(obj);
	var twidth = $('canvas').measureText('tempRemark').width;
	var theight = $('canvas').measureText('tempRemark').height;
	$('canvas').removeLayer('tempRemark');
	if(edit=="true")
	{
		remarkList.push([remarkData[0], remarkData[1], remarkData[2], remarkData[3], text]);
	}
	else
	{
		remarkList.push([postRclickpos, [postRclickpos[0], postRclickpos[1]-theight/2], [postRclickpos[0]+twidth, postRclickpos[1]+theight/2], postRclickpos, text]);
	}
	confset();
}

//更改一个备注
function editRemark()
{
	var id = parseInt($('#editRemark').attr("itemid"));
	remarkData = deepCopy(remarkList[id]);
	remarkList.splice(id, 1);
	confset();
	var left = c.getBoundingClientRect().left + $(document).scrollLeft() + remarkData[1][0];
	var top = c.getBoundingClientRect().top + $(document).scrollTop() + remarkData[1][1];
	$('#remarkInput').css("display","block");
	$('#remarkInput').css("left",left);
	$('#remarkInput').css("top",top);
	$('#changeRemark').css("display", "none");
	$('#remarkText').val(remarkData[4]);
	$('#remarkconf').attr("edit", "true");
}

//删除一个备注
function deleteRemark()
{
	var id = parseInt($('#editRemark').attr("itemid"));
	remarkList.splice(id, 1);
	confset();
}