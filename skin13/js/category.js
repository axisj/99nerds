/*
 * ���� : http://designblack.com
 */

$(document).ready(function(){
    var $d1_wrap = $('.d1-wrap');
    var $d1_img = $('.category_img li');
    var $d1_list = $d1_wrap.find('.d1');
    var len = $d1_list.length;

    $.ajax({
        url : '/exec/front/Product/SubCategory',
        dataType: 'json',
        success: function(aData) {
            if (aData == null || aData == 'undefined') {
                return;
            }
            $.each(aData, function(index, key) {
                var $d1 = $d1_wrap.find('.d1[data-param$="=' + key.parent_cate_no + '"]');
                if ($d1.length > 0) {
                    var _index = $d1_list.index($d1);

                    if ($d1.hasClass('be') === false) {
                        $d1.addClass('be');
                        $d1.append('<div class="d2-wrap"><dl></dl><div class="img">'+$d1_img.eq(_index % len).html()+'</div></div>');
                    }
                    $d1.find('.d2-wrap dl').append('<dd data-param="'+key.param+'" class="d2"><a href="/product/list.html'+key.param+'">'+key.name+'</a></dd>');
                    return;
                }

                var $d2 = $d1_wrap.find('.d2[data-param$="=' + key.parent_cate_no + '"]');
                if ($d2.length > 0) {
                    if ($d2.hasClass('be') === false) {
                        $d2.addClass('be');
                        $d2.append('<dl class="d3-wrap"></dl>');
                    }
                    $d2.find('.d3-wrap').append('<dd data-param="'+key.param+'" class="d3"><a href="/product/list.html'+key.param+'">'+key.name+'</a></dd>');
                    return;
                }

                var $d3 = $d1_wrap.find('.d3[data-param$="=' + key.parent_cate_no + '"]');
                if ($d3.hasClass('be') === false) {
                    $d3.addClass('be');
                    $d3.append('<dl class="d4-wrap"></dl>');
                }
                $d3.find('.d4-wrap').append('<dd data-param="'+key.param+'" class="d4"><a href="/product/list.html'+key.param+'">'+key.name+'</a></dd>');
            });

            setCategory();
        }
    });
});

function setCategory(){
    //lnb
	(function(){
		var $this=$('#category-lnb');
		var $d1=$this.find('.d1');
		var $d2=$this.find('.d2');
        var $d3=$this.find('.d3');
		
		var speed=200;

		$d1.bind('mouseenter',function(){			
			$(this).addClass('on');           
			$(this).find('.d2-wrap').stop(true,true).fadeIn(speed);
		}).bind('mouseleave',function(){
			$(this).removeClass('on');
			$(this).find('.d2-wrap').stop(true,true).fadeOut(speed);
		});
		$d2.bind('mouseenter',function(){
			$d2.css('z-index',0);
			$(this).css('z-index',1);
			$(this).find('.d3-wrap').stop(true,true).fadeIn(speed);
			$(this).addClass('on');
		}).bind('mouseleave',function(){
			$(this).find('.d3-wrap').stop(true,true).fadeOut(speed);
			$(this).removeClass('on');
		});
        $d3.bind('mouseenter',function(){
			$d3.css('z-index',0);
			$(this).css('z-index',1);
			$(this).find('.d4-wrap').stop(true,true).fadeIn(speed);
			$(this).addClass('on');
		}).bind('mouseleave',function(){
			$(this).find('.d4-wrap').stop(true,true).fadeOut(speed);
			$(this).removeClass('on');
		});

		
	})();


	//full
	(function(){
		var $this=$('#category-full');
		var $d1=$this.find('.d1');
		var $d2=$this.find('.d2');
        var $d3=$this.find('.d3');
		var $close=$this.find('.close');
        var $full_btn=$('#d_full_btn');
		var speed=200;
		$d1.bind('mouseenter',function(){
			$d1.css('z-index',0);
			$(this).css('z-index',1);
			$(this).addClass('on');
		}).bind('mouseleave',function(){
			$(this).removeClass('on');
		});
		$d2.bind('mouseenter',function(){
			$d2.css('z-index',0);
			$(this).css('z-index',1);
			$(this).find('.d3-wrap').stop(true,true).fadeIn(speed);
			$(this).addClass('on');
		}).bind('mouseleave',function(){
			$(this).find('.d3-wrap').stop(true,true).fadeOut(speed);
			$(this).removeClass('on');
		});
        $d3.bind('mouseenter',function(){
			$d3.css('z-index',0);
			$(this).css('z-index',1);
			$(this).find('.d4-wrap').stop(true,true).fadeIn(speed);
			$(this).addClass('on');
		}).bind('mouseleave',function(){
			$(this).find('.d4-wrap').stop(true,true).fadeOut(speed);
			$(this).removeClass('on');
		});
        
        $full_btn.bind('click',function(e){
            e.stopPropagation();
			if($(this).hasClass('on')){
				$(this).removeClass('on')
				$this.fadeOut(speed);
			}else{
				$(this).addClass('on')
				$this.fadeIn(speed);
			}
		});
        
		$close.bind('click',function(){
			$full_btn.removeClass('on');
			$this.fadeOut(speed);
		});
        
        
        $('body').bind('click',function(event){  
            if($full_btn.hasClass('on')){
                $full_btn.removeClass('on');
                $this.fadeOut(speed);
            }
        });
	})();
    
    
    //�ߺз� ī�װ�
    (function(){
        var $this=$('.menuCategory');
        if($this.length>0){
            var $dm2=$this.find('.dm2');
            var $dm3=$this.find('.dm3');
            var speed=200;
            $dm2.bind('mouseenter',function(){
                $(this).addClass('on');
                $(this).find('.dm3-wrap').stop(true,true).fadeIn(speed);
            }).bind('mouseleave',function(){
                $(this).removeClass('on');
                $(this).find('.dm3-wrap').stop(true,true).fadeOut(speed);
            });
            $dm3.bind('mouseenter',function(){
                $(this).addClass('on');
                $(this).find('.dm4-wrap').stop(true,true).fadeIn(speed);
            }).bind('mouseleave',function(){
                $(this).removeClass('on');
                $(this).find('.dm4-wrap').stop(true,true).fadeOut(speed);
            });
        }
    })();
};
