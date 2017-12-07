;(function($){

    $.fn.floatBanner = function(options) {
        options = $.extend({}, $.fn.floatBanner.defaults , options);

        return this.each(function() {
            var aPosition = $(this).position();
            var node = this;

            $(window).scroll(function() {
                var _top = $(document).scrollTop();
                _top = (aPosition.top < _top) ? _top : aPosition.top;

                setTimeout(function () {
                    $(node).stop().animate({top: 130 + _top}, options.animate);
                }, options.delay);
            });
        });
    };

    $.fn.floatBanner.defaults = {
        'animate'  : 500,
        'delay'    : 0
    };

})(jQuery);

/**
 * 문서 구동후 시작 */

$(document).ready(function(){
    $('#banner:visible, #quick:visible').floatBanner();
});

//placeholder
$(".ePlaceholder input, .ePlaceholder textarea").each(function(i){
    var placeholderName = $(this).parents().attr('title');
    $(this).attr("placeholder", placeholderName);
});
/* placeholder ie8, ie9 */
$.fn.extend({
    placeholder : function() {
        //IE 8 버전에는 hasPlaceholderSupport() 값이 false를 리턴
       if (hasPlaceholderSupport() === true) {
            return this;
        }
        //hasPlaceholderSupport() 값이 false 일 경우 아래 코드를 실행
        return this.each(function(){
            var findThis = $(this);
            var sPlaceholder = findThis.attr('placeholder');
            if ( ! sPlaceholder) {
               return;
            }
            findThis.wrap('<label class="ePlaceholder" />');
            var sDisplayPlaceHolder = $(this).val() ? ' style="display:none;"' : '';
            findThis.before('<span' + sDisplayPlaceHolder + '>' + sPlaceholder + '</span>');
            this.onpropertychange = function(e){
                e = event || e;
                if (e.propertyName == 'value') {
                    $(this).trigger('focusout');
                }
            };
            //공통 class
            var agent = navigator.userAgent.toLowerCase();
            if (agent.indexOf("msie") != -1) {
                $(".ePlaceholder").css({"position":"relative"});
                $(".ePlaceholder span").css({"position":"absolute", "padding":"0 4px", "color":"#878787"});
                $(".ePlaceholder label").css({"padding":"0"});
            } 
        });
    }
});
  
$(':input[placeholder]').placeholder(); //placeholder() 함수를 호출
  
//클릭하면 placeholder 숨김
$('body').delegate('.ePlaceholder span', 'click', function(){
    $(this).hide();
});
  
//input창 포커스 인 일때 placeholder 숨김
$('body').delegate('.ePlaceholder :input', 'focusin', function(){
    $(this).prev('span').hide();
});
  
//input창 포커스 아웃 일때 value 가 true 이면 숨김, false 이면 보여짐
$('body').delegate('.ePlaceholder :input', 'focusout', function(){
    if (this.value) {
        $(this).prev('span').hide();
    } else {
        $(this).prev('span').show();
    }
});
  
//input에 placeholder가 지원이 되면 true를 안되면 false를 리턴값으로 던져줌
function hasPlaceholderSupport() {
    if ('placeholder' in document.createElement('input')) {
        return true;
    } else {
        return false;
    }
}

/**
 *  썸네일 이미지 엑박일경우 기본값 설정
 */
$(window).load(function() {
    $("img.thumb,img.ThumbImage,img.BigImage").each(function($i,$item){
        var $img = new Image();
        $img.onerror = function () {
                $item.src="//img.echosting.cafe24.com/thumb/img_product_big.gif";
        }
        $img.src = this.src;
    });
});

//window popup script
function winPop(url) {
    window.open(url, "popup", "width=300,height=300,left=10,top=10,resizable=no,scrollbars=no");
}