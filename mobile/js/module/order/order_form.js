$(document).ready(function(){
    // 쇼핑몰 이용약관 동의
    $('#mallAgree').click(function() {
        if ($(this).attr('checked') === true) {
            $('#mall_agreement_radio0').attr('checked', true);
        } else {
            $('#mall_agreement_radio1').attr('checked', true);
        }
    });

    // 비회원 구매 개인정보 취급방침에 동의
    $('#personAgree').click(function() {
        if ($(this).attr('checked') === true) {
            $('#nm_agreement0').attr('checked', true);
        } else {
            $('#nm_agreement1').attr('checked', true);
        }
    });

    // 청약 철회 방침에 동의
    $('#subscription').click(function() {
        if ($(this).attr('checked') === true) {
            $('#subscription_agreement0').attr('checked', true);
        } else {
            $('#subscription_agreement1').attr('checked', true);
        }
    });

    var fixLayerPriceRest = function() {
        $('#checked_order_count, #checked_order_price').html('').css('padding-bottom','0');
    };

    // 고정영역 빈값세팅
    fixLayerPriceRest();

    // 고정영역에 상품정보 세팅
    var fixedLayerPriceSet = function() {
        var iSumPrice = 0;
        var iCheckPrdCnt = 0;
        $('[id^="chk_order_cancel_list"]').each(function(){
            if ($(this).attr('checked') == true) {
                var sCheckId = $(this).attr('id');
                var aTemp = sCheckId.split('_');
                var iCheckId = aTemp[3].replace(/[^0-9]/g, '');
                var iProductPrice = aBasketProductOrderData[iCheckId].product_sum_price;
                iSumPrice = iSumPrice + iProductPrice;
                iCheckPrdCnt = iCheckPrdCnt + 1;
             }
        });
        if (iCheckPrdCnt > 0) {
            var sTotalPrice = SHOP_PRICE_FORMAT.toShopPrice(iSumPrice);
            $('#checked_order_count').html('<strong>' + sprintf(__('%s'),iCheckPrdCnt) + '</strong>' +'개 상품선택').css('padding-bottom','5px');
            $('#checked_order_price').html('결제예정금액 <strong><em>'+sTotalPrice+'</em></strong>').css('padding-bottom','5px');
        } else {
            fixLayerPriceRest();
        }

        var sPriceRef = SHOP_PRICE_FORMAT.shopPriceToSubPrice(iSumPrice);
        if (sPriceRef != '') $('#checked_order_price').find('strong').append(sPriceRef);
    };

    // 장바구니 체크박스 체크시 상품총합계, 체크한 숫자 구하기
    $('[id^="chk_order_cancel_list"]').click(function(e) {
        fixedLayerPriceSet();
    });

    // fix주문하기 버튼 클릭
    $('#btn_payment_fix').unbind().bind('click', function() {
        $('#btn_payment').trigger('click');
    });

    // 상품리스트 전체선택
    $('#product_select_all').bind('click', function() {
        var _status = $(this).data('status');

        $('[id^="chk_order_cancel_list"]').each(function(){
            var bChecked = $(this).is(":checked");

            if (_status == 'off') {
                if (bChecked === false) $(this).attr('checked', true);
            } else {
                $(this).attr('checked', false);
            }
        });

        $(this).data('status', _status == 'off' ? 'on' : 'off');
        fixedLayerPriceSet();
    });

    // 적립금, 마일리지 전체사용
    $('#all_use_mileage, #all_use_deposit').unbind().bind('click', function() {
        var id = $(this).attr('id');
        var total_mileage = parseInt($('#ori_total_avail_mileage').val());
        var total_deposit = parseInt($('#ori_total_deposit').val());
        if (id == 'all_use_mileage') {
            $('#input_mile').attr('value', total_mileage);
            $('#input_mile').trigger('blur');
        } else {
            $('#input_deposit').attr('value', total_deposit);
            $('#input_deposit').trigger('blur');
        }
    });
});

//쇼핑몰 이용약관 동의
function viewMallAgree() {
    window.open('/order/agreement/mallagree.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
}
//비회원 구매시 개인정보수집이용동의
function viewPersonAgree() {
    window.open('/order/agreement/personagree.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
}
//청약철회방침 보기
function viewSubscription() {
    window.open('/order/agreement/subscription.html?basket_type='+$('#basket_type').val());
}
//전자보증보험 보기
function viewInsurance() {
    window.open('/order/agreement/insurance.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
}
//Daum 비회원 구매 동의 보기
function viewDaum() {
    window.open('/order/agreement/daum.html?basket_type='+$('#basket_type').val());
}
//배송정보 제공방침 동의
function viewDelivery() {
    window.open('/order/agreement/delivery.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
}
//고유식별정보수집 동의
function viewIdentification() {
    window.open('/order/agreement/identification.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
}
//개인정보수집 이용동의
function viewMemberJoinAgree() {
    window.open('/order/agreement/privacy_agreement.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
}
//개인정보 제3자 제공 동의
function viewInformationAgree() {
    window.open('/order/agreement/information_agreement.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
}
//개인정보취급 위탁 동의
function viewConsignmentAgree() {
    window.open('/order/agreement/consignment_agreement.html?basket_type='+$('#basket_type').val()+'&delvtype='+getQueryString('delvtype'));
}
//장바구니 선택상품 삭제
function selBasketDel(id) {
    $('[id^="'+BASKET_CHK_ID_PREFIX+'"]').attr('checked', false);
    $('[id="'+id+'"]').attr('checked', true);
    Basket.deleteBasket();
}

// 도움말 툴팁
$('body').delegate('.mTooltip .eTip', 'click', function(e){
        var findSection = $(this).parents('.section:first');
        var findTarget = $($(this).siblings('.tooltip'));
        var findTooltip = $('.tooltip');
        $('.mTooltip').removeClass('show');
        $(this).parents('.mTooltip:first').addClass('show');
        $('.section').css({'zIndex':0, 'position':'static'});
        findSection.css({'zIndex':100, 'position':'relative'});

        findTooltip.hide();
        findTarget.show();
        e.preventDefault();
    });
    $('body').delegate('.mTooltip .eClose', 'click', function(e){
        var findSection = $(this).parents('.section:first');
        var findTarget = $(this).parents('.tooltip:first');
        $('.mTooltip').removeClass('show');
        findTarget.hide();
        findSection.css({'zIndex':0, 'position':'static'});
        e.preventDefault();
    });