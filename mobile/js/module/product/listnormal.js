/**
 * 할인기간 레이어
 */
$(document).ready(function(){
    $('.discountPeriod > a').live('click', function() {
        $(this).parent().find('.layerDiscountPeriod').show();
    });

    $('.btnClose, button.submit').live('click', function() {
        $(this).parents('.layerDiscountPeriod').hide();
    });
});