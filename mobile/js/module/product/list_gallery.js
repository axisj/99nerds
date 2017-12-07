$(document).ready(function(){
    // 갤러리 탭 이벤트
    var galleryTab = function() {
        var sModule = 'xans-product-listnormal';
        var $gallery = $('.' + sModule);
        var $galleryList = $gallery.children('ul');
        $galleryList.delegate('li > div.description > a', 'click', function(e) {
            var $description = $(this);
            var height = $description.height();
            $description.css({bottom: '-' + height + 'px', opacity: '0'});
            e.stopPropagation();
        });
        $gallery.delegate('li > div.thumbnail > a', 'click', function(e) {
            e.stopPropagation();
            var $description = $(this).parents('li').find('div.description');
            var $likeButton = $description.children('.likeButton');
            var height = $description.height();
            if (typeof($description.attr('status')) === 'undefined' || $description.attr('status') == 'hide') {
                $description.animate({
                    opacity: 1,
                    bottom: 1,
                }, 300, function() {
                    $description.attr('status', 'show');
                });
                $likeButton.animate({
                    opacity: 1,
                    bottom: height + 'px',
                }, 250, function() {
                    $likeButton.attr('status', 'show');
                });
            } else {
                $description.animate({
                    opacity: 0,
                    bottom: '-' + height + 'px',
                }, 300, function() {
                    $description.attr('status', 'hide');
                });
                $likeButton.animate({
                    opacity: 0,
                    bottom: 0,
                }, 250, function() {
                    $likeButton.attr('status', 'hide');
                });
            }
        });
    };
    galleryTab();
});