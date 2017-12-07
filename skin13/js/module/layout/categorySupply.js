/**
 * 공급사 카테고리 마우스 오버 이미지
 * 공급사 카테고리 서브 메뉴 출력
 */

$(document).ready(function(){
    $('.xans-layout-categorysupplylist li').mouseenter(function(e) {
          var $this = $(this).addClass('on'),
            iCateNo = Number(methods.getParam($this.find('a').attr('href'), 'cate_no'));

          if (!iCateNo) {
               return;
          }

          methods.show($this, iCateNo);
     }).mouseleave(function(e) {
        $(this).removeClass('on');

          methods.close();
     });
});