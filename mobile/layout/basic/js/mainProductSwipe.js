/**
 * 모바일 상품 스와이프 모듈
 * @package app/Shop
 * @subpackage Front/Disp/Product
 * @since 2014. 2. 12.
 * @update 2014. 4. 24.
 * @version 2.2
 */
var $S = {
    /*
     * current module name
     */
    sModule : 'xans-product-listmain',

    /*
     * swipe action name
     */
    sModuleSwipe : '',

    /*
     * mode
     */
    sMode : 'multi',

    /*
     * slider
     */
    bSlider : false,

    /*
     * swipeable
     */
    sSwipeable : 'yes',

    /*
     * grid
     */
    sGrid : 'grid3',

    /*
     * grid array
     */
    aGrid : {'grid2':2, 'grid3':3, 'grid4':4, 'grid5':5},

    /*
     * start slide
     */
    iStart : 0,

    /*
     * page block
     */
    iPageBlock : 3,

    /*
     * line
     */
    iLine : 1,

    /*
     * limit circle
     */
    iLimit : 9,

    /*
     * active div
     */
    iActive : 0,

    /*
     * save li element
     */
    aElement : [],

    /*
     * save circle element
     */
    aCircle : [],

    /*
     * product class
     */
    $product : null,

    /*
     * product ul
     */
    $productModule : null,

    /*
     * product list li
     */
    $productList : null,

    /*
     * init
     */
    init : function() {
        // set param
        this.setParam();

         // set obejct
        this.setObject();

        // set block
        this.setBlock();

        // validate
        if (this.validate() === false) return;

         // generate
        this.generate();

        // load swipe
        this.load();
    },

    /*
     * set param
     */
    setParam : function() {
        this.sModuleSwipe = this.sModule.replace(/-/g, "_");
    },

    /*
     * set block
     */
    setBlock : function() {
        // set block num
        this.iPageBlock = (this.sMode == 'multi') ? this.iLine * this.aGrid[this.sGrid] : 1;
    },

    /*
     * set obejct
     */
    setObject : function() {
        try
        {
            // current module class
            var sActiveProduct = this.iActive > 0 ? '.' + this.sModule + '-'+this.iActive : '.' + this.sModule;

            // div
            this.$product = $(sActiveProduct);

            // div > ul
            this.$productModule = this.$product.find('ul');

            // div > ul > li > ul > li
            this.$productList = this.$productModule.find('li');
        }
        catch (e) { }
    },
    /*
     * validate
     */
    validate : function() {
        // not use swipe
        if (this.sSwipeable != 'yes') return false;

        // empty ul
        if (this.$productModule.size() < 1) return false;

        // empty li
        if (this.$productList.size() < 1) return false;

        // no condition swipe
        if (this.$productList.size() <= this.iPageBlock) return false;
    },
    /*
     * ganerate swipe single dom
     */
    generate : function() {
        if (this.sMode == 'single') { this.generateSingle(); }
        else { this.generateMulti(); }
    },
    /*
     * prepare for element
     */
    prepare : function() {
        var $prepare = {
            /*
             * reset element and circle
             */
            reset : function() {
                $S.aElement = [];
                $S.aCircle = [];
            },

            /*
             * set target id
             */
            setId : function() {
                $S.$product.attr('id', $S.sModule + '-slider-' + $S.iActive);
            }
        }
        $prepare.reset();
        $prepare.setId();
    },
    /*
     * ganerate swipe single dom
     */
    generateSingle : function() {
        // prepare
        this.prepare();

        // make li > ul > li
        for (var i=0; i<this.$productList.size(); i++) { this.makeCircle(i); }

        // call pagenate
        this.makePagenate();
    },

    /*
     * reset grid
     */
    resetGrid : function() {
        for (var sKey in this.aGrid) {
            if (this.$productModule.hasClass(sKey) === true) { this.$productModule.empty().removeClass(sKey); }
        }
    },

    /*
     * ganerate swipe multi dom
     */
    generateMulti : function() {
        // prepare
        this.prepare();

        // save li
        this.$productList.each(function(){ $S.aElement.push($(this).clone(true)); });

        // delete li and grid2, gird3, grid4
        this.resetGrid();

        // make li > ul > li
        for (var i=0, k=1, j=0; i<this.aElement.length; i++, k++)
        {
            // templete for li > ul
            var $template = (j == 0) ? $("<li>", { html: $("<ul>", {'class': this.sGrid} ) } ) : $('<li>', { html: $("<ul>", {'class': this.sGrid} ), css: {'display': 'none'} } );

            // add li > ul
            if (k == 1)
            {
                this.$productModule.append($template);
                this.makeCircle(j);
            }

            // add li > ul > li
            this.$product.children('ul').children('li').eq(j).children('ul').append(this.aElement[i]);

            // see block
            if (k == this.iPageBlock)
            {
                k = 0;
                j++;
            }
        }

        // not necessary pagenate
        if (i < (parseInt(this.iPageBlock) + 1)) return;

        // call pagenate
        this.makePagenate();
    },

    /*
     * make circle
     */
    makeCircle : function(iCnt) {
        // make circle
        var iNum = iCnt + 1,
            sSelected = (iCnt == 0) ? 'selected' : '',
            sLimitStyle = (iNum > this.iLimit) ? 'style="display:none"' : '';
        this.aCircle.push( '<button type="button" ' + sLimitStyle +' class="circle ' + sSelected + '" onclick="$' + this.sModuleSwipe + '_slider_' + this.iActive + '.moveTab(' + iCnt + ');return false;"><span>' + iNum +'번째 리스트</span></button>' );
    },

    /*
     * make pagenation
     */
    makePagenate : function() {
        var aBtn = [];
        aBtn.push( '<div class="paginate">' );
        aBtn.push( '<button type="button" class="prev" onclick="$' + this.sModuleSwipe + '_slider_' + this.iActive + '.prev();return false;"><span>이전 리스트</span></button>' );
        aBtn.push( '<span id="' + this.sModule + '-swipe-button-' + this.iActive + '">' +  this.aCircle.join('') +'</span>' );
        aBtn.push( '<button type="button" class="next" onclick="$' + this.sModuleSwipe + '_slider_' + this.iActive + '.next();return false;"><span>다음 리스트</span></button>' );
        aBtn.push( '</div>' );

        if ($S.bSlider === false) { this.$product.append(aBtn.join('')); }
    },

    /*
     * load swipe js
     */
    load : function() {
        try
        {
            var aSwipeVars = [],
                $swipe = document.getElementById('' + this.sModule + '-slider-' + this.iActive + ''),
                $button = $('#' + this.sModule + '-swipe-button-' + this.iActive + '').find("button"),
                $now = this.iActive > 0 ? $('.' + this.sModule + '-' + this.iActive + '').find('div.swipePage').find('span.now') : $('.' + this.sModule).find('div.swipePage').find('span.now');
            aSwipeVars.push( '$' + this.sModuleSwipe + '_slider_' + this.iActive + ' = new SwipeClient($swipe, {' );
            aSwipeVars.push( '    startSlide: ' + this.iStart + ',' );
            aSwipeVars.push( '    callback: function(e, pos) {' );
            aSwipeVars.push( '        if ($S.bSlider === true) {  $now.text(pos + 1); }'  );
            aSwipeVars.push( '        if (pos > ($S.iLimit - 1)) {' );
            aSwipeVars.push( '            $button.each(function(index){' );
            aSwipeVars.push( '                $S.iLimit - 1 != index ? $(this).removeClass(\'selected\') : $(this).addClass(\'selected\');' );
            aSwipeVars.push( '            });' );
            aSwipeVars.push( '        } else {' );
            aSwipeVars.push( '            $button.each(function(index){' );
            aSwipeVars.push( '                pos == index ? $(this).addClass(\'selected\') : $(this).removeClass(\'selected\');' );
            aSwipeVars.push( '             });' );
            aSwipeVars.push( '         }' );
            aSwipeVars.push( '    }' );
            aSwipeVars.push( '});' );

            eval(aSwipeVars.join(''));
        }
        catch(e) { }
    }
}