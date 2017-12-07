/**
 * 팝업창에 리사이즈 관련
 */

function setResizePopup() {
    var iWrapWidth    = $('.popup').width();
    var iWrapHeight   = $('.popup').height();

    var iWindowWidth  = $(window).width();
    var iWindowHeight = $(window).height();

    window.resizeBy(iWrapWidth - iWindowWidth, iWrapHeight - iWindowHeight+20);
}
setResizePopup();
