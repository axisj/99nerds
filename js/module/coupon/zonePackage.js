$(document).ready(function(){
    $('.tabTheme li a').click(function(e){
        $(this).parent().addClass('selected').siblings().removeClass('selected');
    });
});