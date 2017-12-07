/**
 * 모바일 상품상세 더보기
 * @package app/Shop
 * @subpackage Front/Disp/Product
 * @since 2014. 5. 12.
 * @version 1.0
 */
$(function() {
    var $DetailMore = {
        /*
         * current module name
         */
        sModule : 'xans-product-additional',

        /*
         * active div
         */
        iActive : 0,

        /**
         * module
         */
        $module : null,

        /**
         * detail
         */
        $detail : null,

        /**
         * more
         */
        $more : null,

        /**
         * real height
         */
        realHeight : 0,

        /**
         * fake height
         */
        fakeHeight : 0,

        /**
         * run
         */
        run : function() {
            setTimeout(function(){ $DetailMore.init(); }, 500);
        },

        /**
         * init
         */
        init : function() {
            // validate
            if (this.validate === false) return;

            // set object
            this.setObject();

            // set detail height
            this.setDetailHeight();

            // set more
            this.setMore();
        },

        /**
         * set event
         */
        setMore : function() {
            if (this.realHeight <= this.fakeHeight) {
                this.$more.remove();
            } else {
                this.$more.unbind().bind('click', function() { if (this.validate === false) return; $DetailMore.load(); });
            }
        },

        /**
         * set detail height
         */
        setDetailHeight : function() {
            this.$detail.css({'max-height' : parseInt($(window).height()*4) + 'px', overflow : 'hidden'});
            this.fakeHeight = this.$detail.height();
        },

        /**
         * validate
         */
        validate : function() {
            if (mobileWeb === false) return false;
        },

        /**
         * set object
         */
        setObject : function(){
            try {
                // current module class
                var sActiveProduct = this.iActive > 0 ? '.' + this.sModule + '-' + this.iActive : '.' + this.sModule;
                // set module
                this.$module = $(sActiveProduct);

                // set detail
                this.$detail = this.$module.find('div#prdDetailContent');

                // set more
                this.$more = this.$module.find('div#btnMore');

                // set real height
                this.realHeight = this.$detail.height();
            } catch(e) { }
        },

        /**
         * load detail
         */
        load : function() {
            this.$detail.css({'max-height' : 'none'});
            this.$more.remove();
        }
    };
    $DetailMore.run();
});