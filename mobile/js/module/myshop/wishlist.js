$(document).ready(function(){
    // 상품리스트 전체선택
    $('#product_select_all').bind('click', function() {
        var _status = $(this).data('status');

        $('[id^="wish_idx_"]').each(function(){
            var bChecked = $(this).is(":checked");

            if (_status == 'off') {
                if (bChecked === false) $(this).attr('checked', true);
            } else {
                $(this).attr('checked', false);
            }
        });

        $(this).data('status', _status == 'off' ? 'on' : 'off');
    });
});