$(document).ready(function(){
    // 댓글의댓글 display none;
    $('[id^="replyArea_"]').each(function(e) {
         $(this).hide();
    });
});