$(function(){
    var sModule = '#prdDetail', $pop = $(sModule).find('img');

    // set pop image
    $pop.each(function(i){ $(this).data('index', i).css('z-index', '100'); });

    $pop.click(function(){
        var _index = $(this).data('index');
        $pop.each(function(i){
            if (i != _index) {
                $(this).css("z-index", "100").removeClass();
            } else {
                $(this).css("z-index", "9999");
                $(this).removeClass().delay(1).queue(function (a) {
                    $(this).addClass("animate pop");
                    a();
                    $(this).dequeue();
                });
            }
        });
    });
});