$('.wrap').delegate( 'textarea', 'keyup', function (){
    $(this).height( 0 );
    $(this).height( this.scrollHeight );
});
$('.wrap').find( 'textarea' ).keyup();