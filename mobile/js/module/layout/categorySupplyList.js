$(document).ready(function(){
    $('[id^="category_"]').each(function(e) {
        if ($(this).siblings().length != 0) {
            $(this).siblings().hide();
         } else {
            $(this).css('background-image', 'url("")');
         }
    });

    $('[id^="category_"]').click(function(e) {
        $(this).toggleClass('selected');
        if ($(this).attr('class').indexOf('selected') > -1) {
            $(this).siblings().show();
        } else {
             $(this).siblings().hide();
        }
     });
});