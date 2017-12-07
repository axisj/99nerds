/**
 * 모바일 확대상품 스와이프 모듈
 * @package app/Shop
 * @subpackage Front/Disp/Product
 * @version 1.0
 */
$(function(){
   var $Z = function(m){
       var $zoom = {
           /**
            * order param
            */
           sParam : 'order',
           /**
            * display order
            */
           iOrder : 0,
           /**
            * init
            */
           init : function(){
               if (m == 'resize')
                   this.setWidth();
               else {
                   this.setOrder();
                   this.setWidth();
                   this.load();
                   this.setCircle();
               }
           },
           /**
            * load swipe
            */
           load : function(){
               try{
                   $S.sModule = "xans-product-zoom";
                   $S.sMode = "single";
                   $S.iStart = this.iOrder;
                   $S.init();
               }catch(e){ }
           },

           /**
            * set Circle
            */
           setCircle : function(){
               try{
                    $('.circle').each(function(){
                       if ($zoom.iOrder == $(this).index()) { $(this).addClass('selected').siblings().removeClass('selected'); }
                    });
               }catch(e){ }
           },

           /**
            * set width
            */
           setWidth : function(){
               try{
                  $('.xans-product-zoom').find('ul').find('li').each(function(){
                      $(this).find('img').css({width:''+ $(window).width() +'px'});
                  });
               }catch(e){ }
           },
           /**
            * set order
            */
           setOrder : function(){
              var sString = this.sParam.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]"),
                  sRegex = "[\\?&]" + sString + "=([^&#]*)",
                  oRegex = new RegExp(sRegex),
                  aResult = oRegex.exec( window.location.href );
              this.iOrder = ( aResult != null || aResult != undefined ) ? aResult[1] : 0;
           }
       };
       $zoom.init();
   };
   $Z('swipe');
   // orientation  handling
   $(window).resize(function(){ $Z('resize'); });
});