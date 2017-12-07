$(document).ready(function(){
    // 갤러리 탭 이벤트
    var galleryTab = function() {
        var sModule = 'xans-product-listnormal';
        var $gallery = $('.' + sModule);
        var $galleryList = $gallery.children('ul');

        $galleryList.delegate('li > div.information', 'click', function(e) {
            var $information = $(this);
            var height = $information.height();
            $information.css({bottom: '-' + height + 'px', opacity: '0'});
            e.stopPropagation();
            document.location.replace($(this).data('url'));
        });

        $gallery.delegate('li', 'click', function(e) {
            e.stopPropagation();

            var $information = $(this).find('div.information');
            var height = $information.height();

            if (typeof($information.attr('status')) === 'undefined' || $information.attr('status') == 'hide') {
                $information.animate({
                    opacity: 1,
                    bottom: 1,
                }, 300, function() {
                    $information.attr('status', 'show');
                });
            } else {
                $information.animate({
                    opacity: 0,
                    bottom: '-' + height + 'px',
                }, 300, function() {
                    $information.attr('status', 'hide');
                });
            }
        });
    };

    galleryTab();
});