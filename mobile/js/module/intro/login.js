//로그인폼 placeholder 추가
if ($('.xans-member-login').val() != undefined) {
    $('#member_id').attr('placeholder', '아이디');
    $('#member_passwd').attr('placeholder', '패스워드');
}

//키보드 미리보기
$('.keyboard button').click(function(){
    if($(this).hasClass('selected')==true){
        $('.keyboard .btnKey').removeClass('selected');
        $('.view div').hide();
    }
    else{
        $('.keyboard .btnKey').removeClass('selected');
        $('.view div').hide();
        $(this).addClass('selected');
        var key=$(this).attr('title');
        $(this).parent().next().children('.'+key+'').show();
    }
});

// 회원&비회원 토글
$('.tab').each(function(){
    var selected = $(this).find('> ul > li.selected > a');
    if(selected.siblings('ul').length <= 0){
        $(this).removeClass('gExtend');
    }
});
$('body').delegate('.eTab a', 'click', function(e){
   var _target = $(this).attr('href');
    if (_target == '#member') {
        $('#member_login_module_id').show();
        $('#order_history_nologin_id').hide();
    } else { console.log("BBB");
        $('#member_login_module_id').hide();
        $('#order_history_nologin_id').show();
    }
    e.preventDefault();
});