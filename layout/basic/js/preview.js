$('#preview .close').click(function() {
    $('#preview .close').hide();
    $('#preview > ul, #preview .open').show();
});

$('#preview .open').click(function() {
    $('#preview .close').show();
    $('#preview > ul, #preview .open').hide();
});

$('#preview li button').click(function(){
    var fonts = $(this).attr("class");

    if(fonts.indexOf('fontSelected') < 0) {
       $('.'+fonts).addClass('fontSelected');
    } else {
       $('.fontSelected').removeClass('fontSelected');
    }
});