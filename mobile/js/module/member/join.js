$(document).ready(function() {
    //회원가입페이지 스타일 처리
    if ($('#member_name_cert_flag').val() != undefined) {
        if ($('#member_name_cert_flag').val() == 'F') {
            $('#auth_tr').html('');
            $('#rname_tr').html('');
            $('#rssn_tr').html('');
            $('#ipin_tr').html('');
            $('#name_tr').show();
            $('#ssn_tr').show();
        } else {
            $('#auth_tr').show();
        }

        if ($('#is_display_register_ssn').val() == 'F') $('#ssn_tr').hide();

        if ( $('#phone2').length > 0 ) $('#phone2').get(0).type = 'tel';
        if ( $('#phone3').length > 0 ) $('#phone3').get(0).type = 'tel';
        if ( $('#mobile2').length > 0 ) $('#mobile2').get(0).type = 'tel';
        if ( $('#mobile3').length > 0 ) $('#mobile3').get(0).type = 'tel';
    }
});