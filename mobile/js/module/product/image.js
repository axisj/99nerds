/**
 * 상품상세 확대보기
 */
$(document).ready(function(){
    $.fn.prdZoom = function(param){
        var ul     = param.target.find('.xans-product-addimage > ul'),
            detail = param.target.find('a#prdDetailImg'),
            swipe  = param.target.find('.xans-product-mobileimage > ul > li'),
            add    = param.target.find('.xans-product-addimage > ul > li');

        var zoom = {
            init : function(){
                function structMobile(){
                    swipe.unbind().bind('click', function(){
                        var sZoomUrl = '/product/image_zoom.html' + $(this).data('param') + '&order=' + $(this).index();
                        zoom.showZoom(sZoomUrl);
                    });
                    add.mouseover(function(){
                        try {
                            $xans_product_mobileimage_slider_0.moveTab($(this).index());
                        } catch (e) { }
                        detail.data('order', $(this).index());
                    });
                    detail.unbind().bind('click', function(){
                        var iOrder =  $(this).data('order') || 0,
                            sZoomUrl = '/product/image_zoom.html' + $(this).data('param') + '&order=' + iOrder;
                        zoom.showZoom(sZoomUrl);
                    });
                }
                structMobile();
            },
            showZoom : function(sZoomUrl){
                window.open(sZoomUrl, 'image_zoom', 'toolbar=no,scrollbars=auto,resizable=yes,width=560,height=710,left=0,top=0', this);
                return false;
            }
        }
        zoom.init();
    };
    // 함수호출 : 상품상세 페이지
    $.fn.prdZoom({
        target : $('.xans-product-image')
    });
});