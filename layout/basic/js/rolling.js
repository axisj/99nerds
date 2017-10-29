/**
 * 레이아웃 중앙형 > 하단 프로모션 배너
 */

function rolling (divId,intervalTime) {
    var divId = document.getElementById(divId);
    var pTag =  divId.getElementsByTagName("p")[0];
    var imgTag =  divId.getElementsByTagName("img");
    var textTag = divId.getElementsByTagName("a");
    var pWidth = pTag.offsetWidth;
    var speed = 1;

    pTag.style.left = 0 + "px";

    var bannerArray = new Array();
    bannerArray[0] = pTag.innerHTML;

    if (pWidth > divId.offsetWidth) {
        pTag.innerHTML=pTag.innerHTML+bannerArray[0];
        var rollInterval = setInterval(
        function(){
            pTag.onmouseover = function() {
                speed=0;
            };
            pTag.onmouseout = function() {
                speed=1;
            };
            pTag.style.left =  parseInt(pTag.style.left)-speed + "px";
            if (parseInt(pTag.style.left) % pWidth==0) {
                pTag.innerHTML=pTag.innerHTML+bannerArray[0];
            }
        }
        ,intervalTime);
    }
}

$(document).ready(function(){
    rolling ("banners",20);
});