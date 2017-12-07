/**
 * 상품상세 섬네일 롤링
 */
$(document).ready(function(){
    $.fn.prdImg = function(parm){
        var index = 0;
        var target = parm.target;
        var view = parm.view;
        var listWrap = target.find('.xans-product-addimage');
        var limit = listWrap.find('> ul > li').length;
        var ul = target.find('.xans-product-addimage > ul');
        var liFirst = target.find('.xans-product-addimage > ul > li:first-child');
        var liWidth = parseInt(liFirst.width());
        var liHeight = parseInt(liFirst.height());
        var blockWidth = liWidth + parseInt(liFirst.css('marginRight')) + parseInt(liFirst.css('marginLeft'));
        var columWidth = blockWidth * view;
        var colum = Math.ceil(limit / view);

        var roll = {
            init : function(){
                function struct(){
                    var ulWidth = limit * parseInt(blockWidth);
                    listWrap.append('<button type="button" class="prev">이전</button>');
                    listWrap.append('<button type="button" class="next">다음</button>');
                    ul.css({'position':'absolute', 'left':0, 'top':0, 'width':ulWidth});
                    listWrap.find('> ul > li').each(function(){
                        $(this).css({'float':'left'});
                    });
                    listWrap.css({'position':'relative', 'height':liHeight});

                    var prev = listWrap.find('.prev');
                    var next = listWrap.find('.next');

                    prev.click(function(){
                        if(index > 0){
                            index --;
                        }
                        roll.slide(index);
                    });
                    next.click(function(){
                        if(index < (colum-1) ){
                            index ++;
                        } 
                        roll.slide(index);
                    });
                    if(index == 0){
                        prev.hide();
                    } else {
                        prev.show();
                    }
                    if(index >= (colum-1)){
                        next.hide();
                    } else {
                        next.show();
                    }
                }
                if(limit > view){
                    struct();
                }
            },
            slide : function(index){
                var left = '-' + (index * columWidth) +'px';
                var prev = listWrap.find('.prev');
                var next = listWrap.find('.next');
                if(index == 0){
                    prev.hide();
                } else {
                    prev.show();
                }
                if(index >= (colum-1)){
                    next.hide();
                } else {
                    next.show();
                }
                ul.stop().animate({'left':left},500);
            }
        }
        roll.init();
    };

    // 함수호출 : 상품상세 페이지
    $.fn.prdImg({
        target : $('.xans-product-image'),
        view : 5
    });
    
    // 함수호출 : 상품확대보기팝업
    $.fn.prdImg({
        target : $('.xans-product-zoom'),
        view : 5
    });
    
});