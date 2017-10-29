/*********************************************************************************
제작 : 디자인블랙 , http://designblack.com
*********************************************************************************/

!(function($){
	$.fn.DB_cate=function(options){
		var opt={
			fadeSpeed:200,
			mouseEvent:'over',                    //click, over
			motionType:'fade'                     //none, fade
		};
		$.extend(opt,options);
		return this.each(function(){
			var $this=$(this);	
			var $li=$this.find('li');
			var $ul=$this.find('ul');
			var $d2=$this.find('.d2');
			var fadeSpeed=opt.fadeSpeed;
			var motionType=opt.motionType;
			var mouseEvent=opt.mouseEvent;
			var $body=$('body');

			$d2.each(function(){
				//화살표
				if($(this).find('>ul').length>0){
					$(this).addClass('arrow');
				}
			});

			if(mouseEvent=='over'){
				$li.bind('mouseenter',function(){
					$(this).addClass('on');
					if(motionType=='none'){
						$(this).find('>ul').show();
					}else{
						$(this).find('>ul').fadeIn(fadeSpeed);
					}
				}).bind('mouseleave',function(){
					$(this).removeClass('on');
					$(this).find('>ul').hide();
				});
			}else{
				$li.bind('click',function(e){	
					e.stopPropagation();
					if($(this).hasClass('fix')){
						$(this).removeClass('fix');
						if(motionType=='none'){
							$(this).find('>ul').hide();
						}else{
							$(this).find('>ul').fadeOut(fadeSpeed);
						}
					}else{
						$(this).nextAll().removeClass('fix').find('ul').hide();
						$(this).prevAll().removeClass('fix').find('ul').hide();
						
						$(this).addClass('fix');
						if(motionType=='none'){
							$(this).find('>ul').show();
						}else{
							$(this).find('>ul').fadeIn(fadeSpeed);
						}
					}
					
				}).bind('mouseenter',function(){
					$(this).addClass('on');
				}).bind('mouseleave',function(){
					$(this).removeClass('on');
				});
			}

			$body.bind('click',function(e){	
				if(motionType=='none'){
					$ul.hide();
				}else{
					$ul.fadeOut(fadeSpeed);
				}
				$li.removeClass('fix');
			})

		});
	};
})(jQuery);




/* 상단메뉴 */
$('#JS_topMenu').DB_cate({
	mouseEvent:'over',
	motionType:'fade'
});

/* 브랜드 */
$('#brand_all').DB_cate({
	mouseEvent:'click',
	motionType:'fade'
});

/* 추가메뉴1 */
$('.categorySub.m01').DB_cate({
	mouseEvent:'over',
	motionType:'fade'
});

/* 추가메뉴2 */
$('.categorySub.m02').DB_cate({
	mouseEvent:'over',
	motionType:'fade'
});

/* 추가메뉴3 */
$('.categorySub.m03').DB_cate({
	mouseEvent:'over',
	motionType:'fade'
});

