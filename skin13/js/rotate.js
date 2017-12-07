/**
* @class
*   이미지 롤링를 처리 합니다.
*
* @example
*    $.fn.roate.defaults  = {
*        'duration' : '3000',
*       'stopButton' : '#stopButton',
*        'playButton' : '#playButton',
*        'prevButton' : '#prevButton',
*        'nextButton' : '#nextButton',
*        'movement'  : 'left',
*        'scroll'     : 1,
*        'autoStart'   : false,
*        'interval'   : 2000
*    };
*
*/

;(function($){

    $.fn.roate = function( options ) {

        var opts = $.extend( {}, $.fn.roate.defaults, options ),
            containerBox = [],
            $this = $(this),
            defaultWidth, defaultHeight, curentIndex = 0, distance, childLength, isAnimate = false, timer = null;

        var pm = {}

        var _init = function() {
            _setDefaultSize();
            _setDistance();
            _displayOverFlow();
            _setContainerBox();
            if(childLength > 1) {
                _setEventBind();
            } else {
                _displayPlayButton();
            }
        }
        , _setDefaultSize = function() {
            defaultWidth  = opts.defaultWidth || $this.children().eq(0).width();
            defaultHeight = opts.defaultHeight || $this.children().eq(0).height();
            childLength   = $this.children().length;
            if ( opts.movement == 'top' ) {
                defaultHeight = defaultHeight * parseInt(opts.scroll,10);
            } else {
                defaultWidth  = defaultWidth * parseInt(opts.scroll,10);
                $this.children().css('float','left');
            }
        }
        , _setDistance = function() {
            if ( opts.movement == 'top') {
                distance = defaultHeight;
            } else {
                distance = defaultWidth;
            }
        }
        , _displayOverFlow = function() {
            var $wrap = $("<div class='containterWrap'></div>").css({
                'overflow' : 'hidden',
                'position' : 'relative',
                'width' : defaultWidth,
                'height' : opts.defaultHeight || defaultHeight
            });
            $this.wrap( $wrap );
            $this.css({'position':'absolute', 'left': '0', 'top' : '0' });
        }
        , _setContainerBox = function() {
            $this.children().each(function(i){
                containerBox[ containerBox.length ] = this;
            });
        }
        , _setEventBind  = function() {
            $(options.nextButton).bind('click.roate', function(){
                pm.next();
            });

            $(options.prevButton).bind('click.roate', function(){
                pm.prev();
            });

            $(options.playButton).bind('click.roate', function(){
                _stopTimer();
                pm.play();
            });

            $(options.stopButton).bind('click.roate', function(){
                pm.stop();
            });
            $this.hover( function(){
                pm.stop();
            }, function(){
                _stopTimer();
                pm.play();
            });
        }
        , _addCurrent = function() {
            curentIndex++;

            if ( curentIndex >= childLength ) {
                curentIndex = 0;
            }
        }, _minusCurrent = function() {
            curentIndex--;
            if ( curentIndex < 0 ) {
                curentIndex = childLength -1;
            }
        }
        , _isAmimate = function() {
            if ( isAnimate ) {
                return true;
            }
            isAnimate = true;
            return false;
        }, _stopTimer = function(){
            if ( timer ) {
                clearInterval( timer );
                _displayPlayButton();
            }
        }, _displayPlayButton = function() {
            $(opts.playButton).css('display', 'inline');
            $(opts.stopButton).css('display', 'none');
        }, _displayStopButton = function() {
            $(opts.playButton).css('display', 'none');
            $(opts.stopButton).css('display', 'inline');
        }, _setOpacity = function ( style ) {
              if ( opts.opacity ) {
                style['display'] = 'none';
                style['opacity'] = 1;
            }
            return style;
        };

        pm.next = function() {
            this.nextMovement( $(containerBox[ curentIndex ]) );
        };

        pm.prev = function() {
            this.prevMovement( $(containerBox[ curentIndex ]) );
        };

        pm.play = function() {
            timer = setInterval(function(){ pm.next() }, opts.interval);
            _displayStopButton();
        };

        pm.stop = function() {
            _stopTimer();
        };

        pm.nextMovement = function ($el) {
            var moveDistance = $this.offset().left - $el.offset().left - distance;

            if ( _isAmimate() === false ) {
                var moveType = {},setCss = {}
                moveType[opts.movement] = moveDistance;
                if ( opts.opacity) {
                    moveType['opacity'] = 0;
                }
                setCss[opts.movement] = parseInt(moveDistance,10) + parseInt(distance,10);
                setCss = _setOpacity( setCss );
                $this.animate(moveType, opts.duration, function(){
                    $this.children(':last').after($el);
                    $this.css(setCss);
                    if ( opts.opacity ) {
                        $this.fadeIn(opts.duration);
                    }
                    isAnimate = false;
                    _addCurrent();
                });
            }
        }

        pm.prevMovement = function ($el) {
            var moveDistance = $this.offset().left - $el.offset().left + distance;
            if ( _isAmimate() === false ) {
                var moveType = {},setCss = {}
                moveType[opts.movement] = moveDistance;
                if ( opts.opacity ) {
                    moveType['opacity'] = 0;
                }
                setCss[opts.movement] = parseInt(moveDistance,10) - parseInt(distance,10);
                setCss = _setOpacity( setCss );
                if ( opts.movement == 'top' ) {
                    $this.css('top',-defaultHeight);
                    moveType[opts.movement] = 0;
                    $this.children(':first').before($this.children(':last'));
                }
                $this.animate(moveType, opts.duration, function(){
                    if ( opts.movement == 'left' ) {
                        $this.children(':first').before($this.children(':last'));
                    }
                    $this.css(setCss);
                    if ( opts.opacity ) {
                        $this.fadeIn(opts.duration);
                    }
                    _minusCurrent();
                    isAnimate = false;
                });
            }
        }

        _init();

        if ( opts.autoStart && childLength > 1) {
            pm.play();
        }

        return pm;
    };

    $.fn.roate.defaults  = {
        'duration' : '3000',
        'stopButton' : '#stopButton',
        'playButton' : '#playButton',
        'prevButton' : '#prevButton',
        'nextButton' : '#nextButton',
        'movement'  : 'left',
        'scroll'     : 1,
        'autoStart'   : false,
        'interval'   : 2000,
        'opacity'    : false
    };

})(jQuery);