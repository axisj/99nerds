/**
 * 모바일 상품 화보보기
 * @package app/Shop
 * @subpackage Front/Disp/Product
 * @since 2014. 4. 24.
 * @version 1.0
 */
var globalPictorialStatus = true;
var globalPictorialLoad = true;
var globalPictorlControl = function(module) {
    this.ui = module.find('h1, button.btnClose, div.pagenate, div.information');
    if (globalPictorialStatus === true) {
        this.ui.fadeOut('fast');
        globalPictorialStatus = false;
    } else {
        this.ui.fadeIn('fast');
        globalPictorialStatus = true;
    }
}
var globalPictorialSetUi = function(module, seq) {
    if (typeof(seq) === 'undefined') seq = 0;
    var $data = $.parseJSON(decodeURIComponent(module.find('li').eq(seq).data('infomation'))),
        $infomation = module.find('div.information'),
        $pagenate = module.find('div.pagenate'),
        $name = $infomation.find('p.name').children('a'),
        $price = $infomation.find('p.price').children('a'),
        $price_value = $price.find('span.price_value'),
        $price_ref = $price.find('span.price_ref'),
        $detail = $infomation.find('p.detail').children('a');
    var pictorialDetailview = function(param) { document.location.replace('/product/detail.html' + param); }
    var parseHtmlEnteties = function(str) {
        if (str === null) return;
        return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
            var num = parseInt(numStr, 10); // read num as normal number
            return String.fromCharCode(num);
        });
    }

    if (module.find('li').size() < 2) { $pagenate.remove(); }

    if (module.find('li').size() < 1) {
        $infomation.remove();
    } else {
        var product_price_ref_display = $data.product_price_ref_display === true ? '' : 'displaynone';

        // set detail view event
        $name.add($price).add($detail).bind('click', function(){ pictorialDetailview($data.param); });
        // set product infomation
        $name.text(parseHtmlEnteties($data.product_name));
        $price_value.text(SHOP_PRICE_FORMAT.toShopPrice($data.product_price));
        $price_ref.text(parseHtmlEnteties($data.txt_product_price_ref));

        if (product_price_ref_display != '') { $price_ref.addClass(product_price_ref_display); }
    }
}
$(function() {
    var $PictorialLoad = function() {
        var $effect = {
            /*
             * current module name
             */
            sModule : '',

            /*
             * current action module name
             */
            sObjectModule : '',
            /*
             * active div
             */
            iActive : 0,

            /**
             * event
             */
            $event : null,
            /**
             * zoom
             */
            $zoom : null,
            /**
             * prev
             */
            $prev : null,
            /**
             * next
             */
            $next : null,
            /**
             * module
             */
            $module : null,
            /**
             * visible
             */
            visible : true,
            /**
             * init
             */
            init : function(){
                // set Data
                this.setData();
                // set object
                this.setObject();
                // set event
                this.setEvent();
                // set Ui
                this.setUi();
            },
            /**
             * set data
             */
            setData : function() {
                this.sModule = oMobileSliderData.sModule;
                this.iActive = oMobileSliderData.iActive;
            },
            /**
             * set infomation
             */
            setUi : function() {
                globalPictorialSetUi(this.$module);
            },
            /**
             * set object
             */
            setObject : function(){
                try {
                    // current module class
                    var sActiveProduct = this.iActive > 0 ? '.' + this.sModule + '-' + this.iActive : '.' + this.sModule;
                    // object module
                    this.sObjectModule = '$' + $effect.sModule.replace(/-/g, "_") + '_slider_' + $effect.iActive;
                    // total element
                    this.total = $(sActiveProduct).find('ul').find('li').size();

                    //set module
                    this.$module = $($effect.iActive > 0 ? '.' + $effect.sModule + '-' + $effect.iActive : '.' + $effect.sModule);
                    // total page
                    this.$zoom = $(sActiveProduct).find('div.zoomList').children('ul').find('li');
                    // prev button
                    this.$prev = $(sActiveProduct).find('div.pagenate').find('button.prev');
                    // next button
                    this.$next = $(sActiveProduct).find('div.pagenate').find('button.next');
                } catch(e) { }
            },
            /**
             * set total page
             */
            setTotalPage : function() {
                this.$length.text(this.total);
            },
            /**
             * prev
             */
            prev : function(){
                eval(this.sObjectModule + '.prev(0, false);');
            },
            /**
             * next
             */
            next : function(){
                eval(this.sObjectModule + '.next(0, false);');
            },
            /**
             * set event
             */
            setEvent : function() {
                this.$event = {
                    /**
                     * init
                     */
                    init : function(){
                        this.action();
                        this.preventScroll();
                        this.orientation();
                    },

                    /**
                     * action
                     */
                    action : function(){
                        $effect.$next.bind('click', function(e){ e.stopPropagation(); $effect.next(); });
                        $effect.$prev.bind('click', function(){ $effect.prev(); });
                        $effect.$module.find('li').unbind().bind('click', function(){ globalPictorlControl($effect.$module); });
                    },

                    /**
                     * prevent scroll
                     */
                    preventScroll : function(){
                        document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });
                    },
                    /**
                     * orientation
                     */
                    orientation : function(){
                        $(window).resize(function(){
                            setTimeout(function(){
                                $effect.$module.find('ul').find('li').each(function(){
                                    $(this).find('img').css({'max-height': $(window).height()});
                                });
                            }, 500);
                        });
                    }
                };

                this.$event.init();
            }
        };
        $effect.init();
    };
    $PictorialLoad();
});