(function($) { 
var data={
	mousedown:false,//鼠标按下
	_x:0,//当前拖动元素上鼠标相对元素的坐标
	_y:0,
	dragobj:null//正在拖动的对象
};
//判断元素移动到哪个子元素上啦
/**
 *@param dragblockobj 拖动的区域
 *@param dragitem  区域内的排序item
 *@param da 传递过来的正在拖动的对象的位置信息是一个json对象包含坐标和宽高
 */
function getobj(dragblockobj,dragitem,da){
	
	var info={
		o:null,//查到满足条件的对象
		insert:'before',//插入到前面还是后面,避免最后一个元素不能排序
		status:0//查找的结果0为没找到1为找到
	};
	var itemnum=null;//定义一个找到的满足条件的元素索引
	dragblockobj.find(dragitem).each(function(index, element) {
		//取当前拖动对象的边距
		cury=da.y;
		curx=da.x;
		curdragid=da.dragid;
		// curH=da.h;
		// curW=da.w;
		//子元素的距离
		var yyy=$(this).offset().top;
		var xxx=$(this).offset().left;
		var cW=$(this).outerWidth();
		var cH=$(this).outerHeight();
		var cdragid=$(this).attr('dragid');
		//取当前元素y的绝对值
		absy=Math.abs(cury-yyy);
		absx=Math.abs(curx-xxx);
		//console.log('相对于元素'+index+'的坐标为：'+absx+'---'+absy);
		bo=(cury!==yyy && curx!==xxx  && absy<(cH/3) && absx<(cW/3) && curdragid!==cdragid);
		if(bo){
			if(yyy<cury){
				itemnum=index;
				info.status=1;
				return false;
			}else{
				itemnum=index;
				info.status=1;
				info.insert='after';
				return false;				
			}
		}
	});	
	
	if(itemnum==null){
		return info;
	}else{
		info.o=dragblockobj.find(dragitem).eq(itemnum);
		return info;
	}
	
	}
$.fn.kldrag = function(options, callback) { 
     var defaults={
               'spacestyle':'',//点位空间样式
			   'dragitem':'.dragitem',//排序的项目类选择器
               'draggroup':''//把拖动项目分组子容器
				};

     var opts = $.extend(defaults, options);
     //保存拖动的区域对象
     var dragblock=this;

     //在有效区域内注册鼠标移动事件
	this.bind('mousemove',function(e){	
		if(data.mousedown && data.dragobj!=null){
			obj=data.dragobj;//正在拖动的对象
			xx=e.pageX-(data._x);
			yy=e.pageY-(data._y);
			obj.css({zIndex:1000,position:'absolute',left:xx+'px',top:yy+'px'});
			//取当前拖动元素的信息组合成一个json对象
			var da={y:yy,x:xx,h:obj.outerHeight(),w:obj.outerWidth(),dragid:obj.attr('dragid')};
			info=getobj(dragblock,opts.dragitem,da);
			if(info.status===1){
				$('.divspace').remove();
				str='<div class="divspace" style="margin:'+obj.css('margin')+';width:'+(obj.outerWidth()-2)+'px;height:'+(obj.outerHeight()-2)+'px;border:dashed 1px #f00;'+opts.spacestyle+'"></div>';
					if(info.insert==='after'){
						info.o.after(str);
					}else{
						info.o.before(str);
					}
				
			}				
		}
	});
	
	//遍历拖动项目
	this.find(opts.dragitem).each(function(index, element) {
			 //添加一个唯一的标识
		$(this).attr('dragid',index);
		$(this).bind('mousedown',function(e){
			data.mousedown=true;
			data.dragobj=$(this);//填充对象
			//取元素到页面top和left上的坐标
			var xxx=$(this).offset().left;
			var yyy=$(this).offset().top;
			
			//计算鼠标相对于元素上的坐标并保存状态
			data._x=e.pageX-xxx;
			data._y=e.pageY-yyy;
			
			$(this).css({zIndex:1000,position:'absolute',left:xxx+'px',top:yyy+'px'});
			$('.divspace').remove();
			$(this).before('<div class="divspace" style="margin:'+$(this).css('margin')+';width:'+($(this).outerWidth()-2)+'px;height:'+($(this).outerHeight()-2)+'px;border:dashed 1px #f00;'+opts.spacestyle+'"></div>');
			$(this).css('cursor','move');
			});	

		$(this).bind('mouseup',function(){
			data.mousedown=false;
			data.lock=null;//删除对象
			var obj=$('.divspace').before($(this));
			$('.divspace').remove();
			$(this).removeAttr('style');
			if(callback)callback();
			
		});
	});


}; 
})(jQuery); 