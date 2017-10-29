// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight() - 20;

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('header').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('nav-up').addClass('nav-down');
        }
        // Scroll Up
        if(st <= 10) {
            $('header').removeClass('nav-up').removeClass('nav-down');
        }
    }
    
    lastScrollTop = st;
}





$(document).ready(function(){

	var $btnmy = $('.xans-layout-statelogon');
	var $status = $('.xans-layout-shoppinginfo');	
	$btnmy.mouseenter(function(){	
		$status.slideDown(20);	
	}).mouseleave(function(){
		$status.slideUp(90);
	});	
	
	var $btn_all = $("li.btn_allmenu");
	var $all_menu = $(".all_gnb_wp");
	$btn_all.click(function(){
		if ($all_menu.hasClass('fixed')){
			$all_menu.removeClass('fixed');
			$btn_all.removeClass('close');
		}else{
			$all_menu.addClass('fixed');
			$btn_all.addClass('close');
		}
	});

});
