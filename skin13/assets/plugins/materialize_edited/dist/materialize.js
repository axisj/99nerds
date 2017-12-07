(function ($) {
  $(document).ready(function() {

    // jQuery reverse
    $.fn.reverse = [].reverse;

    // Hover behaviour: make sure this doesn't work on .click-to-toggle FABs!
    $(document).on('mouseenter.fixedActionBtn', '.fixed-action-btn:not(.click-to-toggle):not(.toolbar)', function(e) {
      var $this = $(this);
      openFABMenu($this);
    });
    $(document).on('mouseleave.fixedActionBtn', '.fixed-action-btn:not(.click-to-toggle):not(.toolbar)', function(e) {
      var $this = $(this);
      closeFABMenu($this);
    });

    // Toggle-on-click behaviour.
    $(document).on('click.fabClickToggle', '.fixed-action-btn.click-to-toggle > a', function(e) {
      var $this = $(this);
      var $menu = $this.parent();
      if ($menu.hasClass('active')) {
        closeFABMenu($menu);
      } else {
        openFABMenu($menu);
      }
    });

    // Toolbar transition behaviour.
    $(document).on('click.fabToolbar', '.fixed-action-btn.toolbar > a', function(e) {
      var $this = $(this);
      var $menu = $this.parent();
      FABtoToolbar($menu);
    });

  });

  $.fn.extend({
    openFAB: function() {
      openFABMenu($(this));
    },
    closeFAB: function() {
      closeFABMenu($(this));
    },
    openToolbar: function() {
      FABtoToolbar($(this));
    },
    closeToolbar: function() {
      toolbarToFAB($(this));
    }
  });


  var openFABMenu = function (btn) {
    var $this = btn;
    if ($this.hasClass('active') === false) {

      // Get direction option
      var horizontal = $this.hasClass('horizontal');
      var offsetY, offsetX;

      if (horizontal === true) {
        offsetX = 40;
      } else {
        offsetY = 40;
      }

      $this.addClass('active');
      $this.find('ul .btn-floating').velocity(
        { scaleY: ".4", scaleX: ".4", translateY: offsetY + 'px', translateX: offsetX + 'px'},
        { duration: 0 });

      var time = 0;
      $this.find('ul .btn-floating').reverse().each( function () {
        $(this).velocity(
          { opacity: "1", scaleX: "1", scaleY: "1", translateY: "0", translateX: '0'},
          { duration: 80, delay: time });
        time += 40;
      });
    }
  };

  var closeFABMenu = function (btn) {
    var $this = btn;
    // Get direction option
    var horizontal = $this.hasClass('horizontal');
    var offsetY, offsetX;

    if (horizontal === true) {
      offsetX = 40;
    } else {
      offsetY = 40;
    }

    $this.removeClass('active');
    var time = 0;
    $this.find('ul .btn-floating').velocity("stop", true);
    $this.find('ul .btn-floating').velocity(
      { opacity: "0", scaleX: ".4", scaleY: ".4", translateY: offsetY + 'px', translateX: offsetX + 'px'},
      { duration: 80 }
    );
  };


  /**
   * Transform FAB into toolbar
   * @param  {Object}  object jQuery object
   */
  var FABtoToolbar = function(btn) {
    if (btn.attr('data-open') === "true") {
      return;
    }

    var offsetX, offsetY, scaleFactor;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var btnRect = btn[0].getBoundingClientRect();
    var anchor = btn.find('> a').first();
    var menu = btn.find('> ul').first();
    var backdrop = $('<div class="fab-backdrop"></div>');
    var fabColor = anchor.css('background-color');
    anchor.append(backdrop);

    offsetX = btnRect.left - (windowWidth / 2) + (btnRect.width / 2);
    offsetY = windowHeight - btnRect.bottom;
    scaleFactor = windowWidth / backdrop.width();
    btn.attr('data-origin-bottom', btnRect.bottom);
    btn.attr('data-origin-left', btnRect.left);
    btn.attr('data-origin-width', btnRect.width);

    // Set initial state
    btn.addClass('active');
    btn.attr('data-open', true);
    btn.css({
      'text-align': 'center',
      width: '100%',
      bottom: 0,
      left: 0,
      transform: 'translateX(' + offsetX + 'px)',
      transition: 'none'
    });
    anchor.css({
      transform: 'translateY(' + -offsetY + 'px)',
      transition: 'none'
    });
    backdrop.css({
      'background-color': fabColor
    });


    setTimeout(function() {
      btn.css({
        transform: '',
        transition: 'transform .2s cubic-bezier(0.550, 0.085, 0.680, 0.530), background-color 0s linear .2s'
      });
      anchor.css({
        overflow: 'visible',
        transform: '',
        transition: 'transform .2s'
      });

      setTimeout(function() {
        btn.css({
          overflow: 'hidden',
          'background-color': fabColor
        });
        backdrop.css({
          transform: 'scale(' + scaleFactor + ')',
          transition: 'transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)'
        });
        menu.find('> li > a').css({
          opacity: 1
        });

        // Scroll to close.
        $(window).on('scroll.fabToolbarClose', function() {
          toolbarToFAB(btn);
          $(window).off('scroll.fabToolbarClose');
          $(document).off('click.fabToolbarClose');
        });

        $(document).on('click.fabToolbarClose', function(e) {
          if (!$(e.target).closest(menu).length) {
            toolbarToFAB(btn);
            $(window).off('scroll.fabToolbarClose');
            $(document).off('click.fabToolbarClose');
          }
        });
      }, 100);
    }, 0);
  };

  /**
   * Transform toolbar back into FAB
   * @param  {Object}  object jQuery object
   */
  var toolbarToFAB = function(btn) {
    if (btn.attr('data-open') !== "true") {
      return;
    }

    var offsetX, offsetY, scaleFactor;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var btnWidth = btn.attr('data-origin-width');
    var btnBottom = btn.attr('data-origin-bottom');
    var btnLeft = btn.attr('data-origin-left');
    var anchor = btn.find('> .btn-floating').first();
    var menu = btn.find('> ul').first();
    var backdrop = btn.find('.fab-backdrop');
    var fabColor = anchor.css('background-color');

    offsetX = btnLeft - (windowWidth / 2) + (btnWidth / 2);
    offsetY = windowHeight - btnBottom;
    scaleFactor = windowWidth / backdrop.width();


    // Hide backdrop
    btn.removeClass('active');
    btn.attr('data-open', false);
    btn.css({
      'background-color': 'transparent',
      transition: 'none'
    });
    anchor.css({
      transition: 'none'
    });
    backdrop.css({
      transform: 'scale(0)',
      'background-color': fabColor
    });
    menu.find('> li > a').css({
      opacity: ''
    });

    setTimeout(function() {
      backdrop.remove();

      // Set initial state.
      btn.css({
        'text-align': '',
        width: '',
        bottom: '',
        left: '',
        overflow: '',
        'background-color': '',
        transform: 'translate3d(' + -offsetX + 'px,0,0)'
      });
      anchor.css({
        overflow: '',
        transform: 'translate3d(0,' + offsetY + 'px,0)'
      });

      setTimeout(function() {
        btn.css({
          transform: 'translate3d(0,0,0)',
          transition: 'transform .2s'
        });
        anchor.css({
          transform: 'translate3d(0,0,0)',
          transition: 'transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)'
        });
      }, 20);
    }, 200);
  };


}( jQuery3_2_1 ));

(function ($) {

  // Add posibility to scroll to selected option
  // usefull for select for example
  $.fn.scrollTo = function(elem) {
    $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
    return this;
  };

  $.fn.dropdown = function (options) {
    var defaults = {
      inDuration: 300,
      outDuration: 225,
      constrainWidth: true, // Constrains width of dropdown to the activator
      hover: false,
      gutter: 0, // Spacing from edge
      belowOrigin: false,
      alignment: 'left',
      stopPropagation: false
    };

    // Open dropdown.
    if (options === "open") {
      this.each(function() {
        $(this).trigger('open');
      });
      return false;
    }

    // Close dropdown.
    if (options === "close") {
      this.each(function() {
        $(this).trigger('close');
      });
      return false;
    }

    this.each(function(){
      var origin = $(this);
      var curr_options = $.extend({}, defaults, options);
      var isFocused = false;

      // Dropdown menu
      var activates = $("#"+ origin.attr('data-activates'));

      function updateOptions() {
        if (origin.data('induration') !== undefined)
          curr_options.inDuration = origin.data('induration');
        if (origin.data('outduration') !== undefined)
          curr_options.outDuration = origin.data('outduration');
        if (origin.data('constrainwidth') !== undefined)
          curr_options.constrainWidth = origin.data('constrainwidth');
        if (origin.data('hover') !== undefined)
          curr_options.hover = origin.data('hover');
        if (origin.data('gutter') !== undefined)
          curr_options.gutter = origin.data('gutter');
        if (origin.data('beloworigin') !== undefined)
          curr_options.belowOrigin = origin.data('beloworigin');
        if (origin.data('alignment') !== undefined)
          curr_options.alignment = origin.data('alignment');
        if (origin.data('stoppropagation') !== undefined)
          curr_options.stopPropagation = origin.data('stoppropagation');
      }

      updateOptions();

      // Attach dropdown to its activator
      origin.after(activates);

      /*
        Helper function to position and resize dropdown.
        Used in hover and click handler.
      */
      function placeDropdown(eventType) {
        // Check for simultaneous focus and click events.
        if (eventType === 'focus') {
          isFocused = true;
        }

        // Check html data attributes
        updateOptions();

        // Set Dropdown state
        activates.addClass('active');
        origin.addClass('active');

        // Constrain width
        if (curr_options.constrainWidth === true) {
          activates.css('width', origin.outerWidth());

        } else {
          activates.css('white-space', 'nowrap');
        }

        // Offscreen detection
        var windowHeight = window.innerHeight;
        var originHeight = origin.innerHeight();
        var offsetLeft = origin.offset().left;
        var offsetTop = origin.offset().top - $(window).scrollTop();
        var currAlignment = curr_options.alignment;
        var gutterSpacing = 0;
        var leftPosition = 0;

        // Below Origin
        var verticalOffset = 0;
        if (curr_options.belowOrigin === true) {
          verticalOffset = originHeight;
        }

        // Check for scrolling positioned container.
        var scrollYOffset = 0;
        var scrollXOffset = 0;
        var wrapper = origin.parent();
        if (!wrapper.is('body')) {
          if (wrapper[0].scrollHeight > wrapper[0].clientHeight) {
            scrollYOffset = wrapper[0].scrollTop;
          }
          if (wrapper[0].scrollWidth > wrapper[0].clientWidth) {
            scrollXOffset = wrapper[0].scrollLeft;
          }
        }


        if (offsetLeft + activates.innerWidth() > $(window).width()) {
          // Dropdown goes past screen on right, force right alignment
          currAlignment = 'right';

        } else if (offsetLeft - activates.innerWidth() + origin.innerWidth() < 0) {
          // Dropdown goes past screen on left, force left alignment
          currAlignment = 'left';
        }
        // Vertical bottom offscreen detection
        if (offsetTop + activates.innerHeight() > windowHeight) {
          // If going upwards still goes offscreen, just crop height of dropdown.
          if (offsetTop + originHeight - activates.innerHeight() < 0) {
            var adjustedHeight = windowHeight - offsetTop - verticalOffset;
            activates.css('max-height', adjustedHeight);
          } else {
            // Flow upwards.
            if (!verticalOffset) {
              verticalOffset += originHeight;
            }
            verticalOffset -= activates.innerHeight();
          }
        }

        // Handle edge alignment
        if (currAlignment === 'left') {
          gutterSpacing = curr_options.gutter;
          leftPosition = origin.position().left + gutterSpacing;
        }
        else if (currAlignment === 'right') {
          var offsetRight = origin.position().left + origin.outerWidth() - activates.outerWidth();
          gutterSpacing = -curr_options.gutter;
          leftPosition =  offsetRight + gutterSpacing;
        }

        // Position dropdown
        activates.css({
          position: 'absolute',
          top: origin.position().top + verticalOffset + scrollYOffset,
          left: leftPosition + scrollXOffset
        });


        // Show dropdown
        activates.stop(true, true).css('opacity', 0)
          .slideDown({
            queue: false,
            duration: curr_options.inDuration,
            easing: 'easeOutCubic',
            complete: function() {
              $(this).css('height', '');
            }
          })
          .animate( {opacity: 1}, {queue: false, duration: curr_options.inDuration, easing: 'easeOutSine'});

        // Add click close handler to document
        setTimeout(function() {
          $(document).bind('click.'+ activates.attr('id'), function (e) {
            hideDropdown();
            $(document).unbind('click.'+ activates.attr('id'));
          });
        }, 0);
      }

      function hideDropdown() {
        // Check for simultaneous focus and click events.
        isFocused = false;
        activates.fadeOut(curr_options.outDuration);
        activates.removeClass('active');
        origin.removeClass('active');
        $(document).unbind('click.'+ activates.attr('id'));
        setTimeout(function() { activates.css('max-height', ''); }, curr_options.outDuration);
      }

      // Hover
      if (curr_options.hover) {
        var open = false;
        origin.unbind('click.' + origin.attr('id'));
        // Hover handler to show dropdown
        origin.on('mouseenter', function(e){ // Mouse over
          if (open === false) {
            placeDropdown();
            open = true;
          }
        });
        origin.on('mouseleave', function(e){
          // If hover on origin then to something other than dropdown content, then close
          var toEl = e.toElement || e.relatedTarget; // added browser compatibility for target element
          if(!$(toEl).closest('.dropdown-content').is(activates)) {
            activates.stop(true, true);
            hideDropdown();
            open = false;
          }
        });

        activates.on('mouseleave', function(e){ // Mouse out
          var toEl = e.toElement || e.relatedTarget;
          if(!$(toEl).closest('.dropdown-button').is(origin)) {
            activates.stop(true, true);
            hideDropdown();
            open = false;
          }
        });

        // Click
      } else {
        // Click handler to show dropdown
        origin.unbind('click.' + origin.attr('id'));
        origin.bind('click.'+origin.attr('id'), function(e){
          if (!isFocused) {
            if ( origin[0] == e.currentTarget &&
                 !origin.hasClass('active') &&
                 ($(e.target).closest('.dropdown-content').length === 0)) {
              e.preventDefault(); // Prevents button click from moving window
              if (curr_options.stopPropagation) {
                e.stopPropagation();
              }
              placeDropdown('click');
            }
            // If origin is clicked and menu is open, close menu
            else if (origin.hasClass('active')) {
              hideDropdown();
              $(document).unbind('click.'+ activates.attr('id'));
            }
          }
        });

      } // End else

      // Listen to open and close event - useful for select component
      origin.on('open', function(e, eventType) {
        placeDropdown(eventType);
      });
      origin.on('close', hideDropdown);

    });
  }; // End dropdown plugin

  /*
  $(document).ready(function(){
    $('.dropdown-button').dropdown();
  });
  */
}( jQuery3_2_1 ));

!function(a,b,c,d){"use strict";function k(a,b,c){return setTimeout(q(a,c),b)}function l(a,b,c){return Array.isArray(a)?(m(a,c[b],c),!0):!1}function m(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function n(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function o(a,b){return n(a,b,!0)}function p(a,b,c){var e,d=b.prototype;e=a.prototype=Object.create(d),e.constructor=a,e._super=d,c&&n(e,c)}function q(a,b){return function(){return a.apply(b,arguments)}}function r(a,b){return typeof a==g?a.apply(b?b[0]||d:d,b):a}function s(a,b){return a===d?b:a}function t(a,b,c){m(x(b),function(b){a.addEventListener(b,c,!1)})}function u(a,b,c){m(x(b),function(b){a.removeEventListener(b,c,!1)})}function v(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function w(a,b){return a.indexOf(b)>-1}function x(a){return a.trim().split(/\s+/g)}function y(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function z(a){return Array.prototype.slice.call(a,0)}function A(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];y(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function B(a,b){for(var c,f,g=b[0].toUpperCase()+b.slice(1),h=0;h<e.length;){if(c=e[h],f=c?c+g:b,f in a)return f;h++}return d}function D(){return C++}function E(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function ab(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){r(a.options.enable,[a])&&c.handler(b)},this.init()}function bb(a){var b,c=a.options.inputClass;return b=c?c:H?wb:I?Eb:G?Gb:rb,new b(a,cb)}function cb(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&O&&0===d-e,g=b&(Q|R)&&0===d-e;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,db(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function db(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=gb(b)),e>1&&!c.firstMultiple?c.firstMultiple=gb(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=hb(d);b.timeStamp=j(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=lb(h,i),b.distance=kb(h,i),eb(c,b),b.offsetDirection=jb(b.deltaX,b.deltaY),b.scale=g?nb(g.pointers,d):1,b.rotation=g?mb(g.pointers,d):0,fb(c,b);var k=a.element;v(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function eb(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===O||f.eventType===Q)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function fb(a,b){var f,g,h,j,c=a.lastInterval||b,e=b.timeStamp-c.timeStamp;if(b.eventType!=R&&(e>N||c.velocity===d)){var k=c.deltaX-b.deltaX,l=c.deltaY-b.deltaY,m=ib(e,k,l);g=m.x,h=m.y,f=i(m.x)>i(m.y)?m.x:m.y,j=jb(k,l),a.lastInterval=b}else f=c.velocity,g=c.velocityX,h=c.velocityY,j=c.direction;b.velocity=f,b.velocityX=g,b.velocityY=h,b.direction=j}function gb(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:h(a.pointers[c].clientX),clientY:h(a.pointers[c].clientY)},c++;return{timeStamp:j(),pointers:b,center:hb(b),deltaX:a.deltaX,deltaY:a.deltaY}}function hb(a){var b=a.length;if(1===b)return{x:h(a[0].clientX),y:h(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:h(c/b),y:h(d/b)}}function ib(a,b,c){return{x:b/a||0,y:c/a||0}}function jb(a,b){return a===b?S:i(a)>=i(b)?a>0?T:U:b>0?V:W}function kb(a,b,c){c||(c=$);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function lb(a,b,c){c||(c=$);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function mb(a,b){return lb(b[1],b[0],_)-lb(a[1],a[0],_)}function nb(a,b){return kb(b[0],b[1],_)/kb(a[0],a[1],_)}function rb(){this.evEl=pb,this.evWin=qb,this.allow=!0,this.pressed=!1,ab.apply(this,arguments)}function wb(){this.evEl=ub,this.evWin=vb,ab.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function Ab(){this.evTarget=yb,this.evWin=zb,this.started=!1,ab.apply(this,arguments)}function Bb(a,b){var c=z(a.touches),d=z(a.changedTouches);return b&(Q|R)&&(c=A(c.concat(d),"identifier",!0)),[c,d]}function Eb(){this.evTarget=Db,this.targetIds={},ab.apply(this,arguments)}function Fb(a,b){var c=z(a.touches),d=this.targetIds;if(b&(O|P)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=z(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return v(a.target,i)}),b===O)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Q|R)&&delete d[g[e].identifier],e++;return h.length?[A(f.concat(h),"identifier",!0),h]:void 0}function Gb(){ab.apply(this,arguments);var a=q(this.handler,this);this.touch=new Eb(this.manager,a),this.mouse=new rb(this.manager,a)}function Pb(a,b){this.manager=a,this.set(b)}function Qb(a){if(w(a,Mb))return Mb;var b=w(a,Nb),c=w(a,Ob);return b&&c?Nb+" "+Ob:b||c?b?Nb:Ob:w(a,Lb)?Lb:Kb}function Yb(a){this.id=D(),this.manager=null,this.options=o(a||{},this.defaults),this.options.enable=s(this.options.enable,!0),this.state=Rb,this.simultaneous={},this.requireFail=[]}function Zb(a){return a&Wb?"cancel":a&Ub?"end":a&Tb?"move":a&Sb?"start":""}function $b(a){return a==W?"down":a==V?"up":a==T?"left":a==U?"right":""}function _b(a,b){var c=b.manager;return c?c.get(a):a}function ac(){Yb.apply(this,arguments)}function bc(){ac.apply(this,arguments),this.pX=null,this.pY=null}function cc(){ac.apply(this,arguments)}function dc(){Yb.apply(this,arguments),this._timer=null,this._input=null}function ec(){ac.apply(this,arguments)}function fc(){ac.apply(this,arguments)}function gc(){Yb.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function hc(a,b){return b=b||{},b.recognizers=s(b.recognizers,hc.defaults.preset),new kc(a,b)}function kc(a,b){b=b||{},this.options=o(b,hc.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=bb(this),this.touchAction=new Pb(this,this.options.touchAction),lc(this,!0),m(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function lc(a,b){var c=a.element;m(a.options.cssProps,function(a,d){c.style[B(c.style,d)]=b?a:""})}function mc(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var e=["","webkit","moz","MS","ms","o"],f=b.createElement("div"),g="function",h=Math.round,i=Math.abs,j=Date.now,C=1,F=/mobile|tablet|ip(ad|hone|od)|android/i,G="ontouchstart"in a,H=B(a,"PointerEvent")!==d,I=G&&F.test(navigator.userAgent),J="touch",K="pen",L="mouse",M="kinect",N=25,O=1,P=2,Q=4,R=8,S=1,T=2,U=4,V=8,W=16,X=T|U,Y=V|W,Z=X|Y,$=["x","y"],_=["clientX","clientY"];ab.prototype={handler:function(){},init:function(){this.evEl&&t(this.element,this.evEl,this.domHandler),this.evTarget&&t(this.target,this.evTarget,this.domHandler),this.evWin&&t(E(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&u(this.element,this.evEl,this.domHandler),this.evTarget&&u(this.target,this.evTarget,this.domHandler),this.evWin&&u(E(this.element),this.evWin,this.domHandler)}};var ob={mousedown:O,mousemove:P,mouseup:Q},pb="mousedown",qb="mousemove mouseup";p(rb,ab,{handler:function(a){var b=ob[a.type];b&O&&0===a.button&&(this.pressed=!0),b&P&&1!==a.which&&(b=Q),this.pressed&&this.allow&&(b&Q&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:L,srcEvent:a}))}});var sb={pointerdown:O,pointermove:P,pointerup:Q,pointercancel:R,pointerout:R},tb={2:J,3:K,4:L,5:M},ub="pointerdown",vb="pointermove pointerup pointercancel";a.MSPointerEvent&&(ub="MSPointerDown",vb="MSPointerMove MSPointerUp MSPointerCancel"),p(wb,ab,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=sb[d],f=tb[a.pointerType]||a.pointerType,g=f==J,h=y(b,a.pointerId,"pointerId");e&O&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Q|R)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var xb={touchstart:O,touchmove:P,touchend:Q,touchcancel:R},yb="touchstart",zb="touchstart touchmove touchend touchcancel";p(Ab,ab,{handler:function(a){var b=xb[a.type];if(b===O&&(this.started=!0),this.started){var c=Bb.call(this,a,b);b&(Q|R)&&0===c[0].length-c[1].length&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:J,srcEvent:a})}}});var Cb={touchstart:O,touchmove:P,touchend:Q,touchcancel:R},Db="touchstart touchmove touchend touchcancel";p(Eb,ab,{handler:function(a){var b=Cb[a.type],c=Fb.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:J,srcEvent:a})}}),p(Gb,ab,{handler:function(a,b,c){var d=c.pointerType==J,e=c.pointerType==L;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Q|R)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Hb=B(f.style,"touchAction"),Ib=Hb!==d,Jb="compute",Kb="auto",Lb="manipulation",Mb="none",Nb="pan-x",Ob="pan-y";Pb.prototype={set:function(a){a==Jb&&(a=this.compute()),Ib&&(this.manager.element.style[Hb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return m(this.manager.recognizers,function(b){r(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),Qb(a.join(" "))},preventDefaults:function(a){if(!Ib){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return b.preventDefault(),void 0;var d=this.actions,e=w(d,Mb),f=w(d,Ob),g=w(d,Nb);return e||f&&c&X||g&&c&Y?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var Rb=1,Sb=2,Tb=4,Ub=8,Vb=Ub,Wb=16,Xb=32;Yb.prototype={defaults:{},set:function(a){return n(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(l(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_b(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return l(a,"dropRecognizeWith",this)?this:(a=_b(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(l(a,"requireFailure",this))return this;var b=this.requireFail;return a=_b(a,this),-1===y(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(l(a,"dropRequireFailure",this))return this;a=_b(a,this);var b=y(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function d(d){b.manager.emit(b.options.event+(d?Zb(c):""),a)}var b=this,c=this.state;Ub>c&&d(!0),d(),c>=Ub&&d(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):(this.state=Xb,void 0)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(Xb|Rb)))return!1;a++}return!0},recognize:function(a){var b=n({},a);return r(this.options.enable,[this,b])?(this.state&(Vb|Wb|Xb)&&(this.state=Rb),this.state=this.process(b),this.state&(Sb|Tb|Ub|Wb)&&this.tryEmit(b),void 0):(this.reset(),this.state=Xb,void 0)},process:function(){},getTouchAction:function(){},reset:function(){}},p(ac,Yb,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(Sb|Tb),e=this.attrTest(a);return d&&(c&R||!e)?b|Wb:d||e?c&Q?b|Ub:b&Sb?b|Tb:Sb:Xb}}),p(bc,ac,{defaults:{event:"pan",threshold:10,pointers:1,direction:Z},getTouchAction:function(){var a=this.options.direction,b=[];return a&X&&b.push(Ob),a&Y&&b.push(Nb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&X?(e=0===f?S:0>f?T:U,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?S:0>g?V:W,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return ac.prototype.attrTest.call(this,a)&&(this.state&Sb||!(this.state&Sb)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$b(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),p(cc,ac,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Mb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&Sb)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),p(dc,Yb,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[Kb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,e=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Q|R)&&!e)this.reset();else if(a.eventType&O)this.reset(),this._timer=k(function(){this.state=Vb,this.tryEmit()},b.time,this);else if(a.eventType&Q)return Vb;return Xb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===Vb&&(a&&a.eventType&Q?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=j(),this.manager.emit(this.options.event,this._input)))}}),p(ec,ac,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Mb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&Sb)}}),p(fc,ac,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:X|Y,pointers:1},getTouchAction:function(){return bc.prototype.getTouchAction.call(this)},attrTest:function(a){var c,b=this.options.direction;return b&(X|Y)?c=a.velocity:b&X?c=a.velocityX:b&Y&&(c=a.velocityY),this._super.attrTest.call(this,a)&&b&a.direction&&a.distance>this.options.threshold&&i(c)>this.options.velocity&&a.eventType&Q},emit:function(a){var b=$b(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),p(gc,Yb,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[Lb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,e=a.deltaTime<b.time;if(this.reset(),a.eventType&O&&0===this.count)return this.failTimeout();if(d&&e&&c){if(a.eventType!=Q)return this.failTimeout();var f=this.pTime?a.timeStamp-this.pTime<b.interval:!0,g=!this.pCenter||kb(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,g&&f?this.count+=1:this.count=1,this._input=a;var h=this.count%b.taps;if(0===h)return this.hasRequireFailures()?(this._timer=k(function(){this.state=Vb,this.tryEmit()},b.interval,this),Sb):Vb}return Xb},failTimeout:function(){return this._timer=k(function(){this.state=Xb},this.options.interval,this),Xb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==Vb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),hc.VERSION="2.0.4",hc.defaults={domEvents:!1,touchAction:Jb,enable:!0,inputTarget:null,inputClass:null,preset:[[ec,{enable:!1}],[cc,{enable:!1},["rotate"]],[fc,{direction:X}],[bc,{direction:X},["swipe"]],[gc],[gc,{event:"doubletap",taps:2},["tap"]],[dc]],cssProps:{userSelect:"default",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ic=1,jc=2;kc.prototype={set:function(a){return n(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?jc:ic},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&Vb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===jc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(Sb|Tb|Ub)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Yb)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(l(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(l(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(y(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return m(x(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return m(x(a),function(a){b?c[a].splice(y(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&mc(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&lc(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},n(hc,{INPUT_START:O,INPUT_MOVE:P,INPUT_END:Q,INPUT_CANCEL:R,STATE_POSSIBLE:Rb,STATE_BEGAN:Sb,STATE_CHANGED:Tb,STATE_ENDED:Ub,STATE_RECOGNIZED:Vb,STATE_CANCELLED:Wb,STATE_FAILED:Xb,DIRECTION_NONE:S,DIRECTION_LEFT:T,DIRECTION_RIGHT:U,DIRECTION_UP:V,DIRECTION_DOWN:W,DIRECTION_HORIZONTAL:X,DIRECTION_VERTICAL:Y,DIRECTION_ALL:Z,Manager:kc,Input:ab,TouchAction:Pb,TouchInput:Eb,MouseInput:rb,PointerEventInput:wb,TouchMouseInput:Gb,SingleTouchInput:Ab,Recognizer:Yb,AttrRecognizer:ac,Tap:gc,Pan:bc,Swipe:fc,Pinch:cc,Rotate:ec,Press:dc,on:t,off:u,each:m,merge:o,extend:n,inherit:p,bindFn:q,prefixed:B}),typeof define==g&&define.amd?define(function(){return hc}):"undefined"!=typeof module&&module.exports?module.exports=hc:a[c]=hc}(window,document,"Hammer");
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
(function (jQuery) {
  jQuery.easing['jswing'] = jQuery.easing['swing'];

  jQuery.extend(jQuery.easing,
    {
      def: 'easeOutQuad',
      swing: function (x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
      },
      easeInQuad: function (x, t, b, c, d) {
        return c * (t /= d) * t + b;
      },
      easeOutQuad: function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOutQuad: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      },
      easeInCubic: function (x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
      },
      easeOutCubic: function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOutCubic: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      },
      easeInQuart: function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
      },
      easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOutQuart: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      },
      easeInQuint: function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
      },
      easeOutQuint: function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOutQuint: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      },
      easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOutSine: function (x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      },
      easeInExpo: function (x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOutExpo: function (x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
      },
      easeInOutExpo: function (x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      },
      easeInCirc: function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOutCirc: function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOutCirc: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      },
      easeInElastic: function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      },
      easeOutElastic: function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
      },
      easeInOutElastic: function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      },
      easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
      },
      easeInBounce: function (x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
      },
      easeOutBounce: function (x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
          return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
      },
      easeInOutBounce: function (x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
      }
    });
})(jQuery3_2_1);


/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'hammerjs'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('hammerjs'));
    } else {
        factory(jQuery3_2_1, Hammer);
    }
}(function($, Hammer) {
    function hammerify(el, options) {
        var $el = $(el);
        if(!$el.data("hammer")) {
            $el.data("hammer", new Hammer($el[0], options));
        }
    }

    $.fn.hammer = function(options) {
        return this.each(function() {
            hammerify(this, options);
        });
    };

    // extend the emit method to also trigger jQuery events
    Hammer.Manager.prototype.emit = (function(originalEmit) {
        return function(type, data) {
            originalEmit.call(this, type, data);
            $(this.element).trigger({
                type: type,
                gesture: data
            });
        };
    })(Hammer.Manager.prototype.emit);
}));

/*! VelocityJS.org (1.5.0). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

/*************************
 Velocity jQuery Shim
 *************************/

/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */

/* This file contains the jQuery functions that Velocity relies on, thereby removing Velocity's dependency on a full copy of jQuery, and allowing it to work in any environment. */
/* These shimmed functions are only used if jQuery isn't present. If both this shim and jQuery are loaded, Velocity defaults to jQuery proper. */
/* Browser support: Using this shim instead of jQuery proper removes support for IE8. */

(function(window) {
  "use strict";
  /***************
   Setup
   ***************/

  /* If jQuery is already loaded, there's no point in loading this shim. */
  if (window.jQuery3_2_1) {
    return;
  }

  /* jQuery base. */
  var $ = function(selector, context) {
    return new $.fn.init(selector, context);
  };

  /********************
   Private Methods
   ********************/

  /* jQuery */
  $.isWindow = function(obj) {
    /* jshint eqeqeq: false */
    return obj && obj === obj.window;
  };

  /* jQuery */
  $.type = function(obj) {
    if (!obj) {
      return obj + "";
    }

    return typeof obj === "object" || typeof obj === "function" ?
      class2type[toString.call(obj)] || "object" :
      typeof obj;
  };

  /* jQuery */
  $.isArray = Array.isArray || function(obj) {
    return $.type(obj) === "array";
  };

  /* jQuery */
  function isArraylike(obj) {
    var length = obj.length,
        type = $.type(obj);

    if (type === "function" || $.isWindow(obj)) {
      return false;
    }

    if (obj.nodeType === 1 && length) {
      return true;
    }

    return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
  }

  /***************
   $ Methods
   ***************/

  /* jQuery: Support removed for IE<9. */
  $.isPlainObject = function(obj) {
    var key;

    if (!obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow(obj)) {
      return false;
    }

    try {
      if (obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
    } catch (e) {
      return false;
    }

    for (key in obj) {
    }

    return key === undefined || hasOwn.call(obj, key);
  };

  /* jQuery */
  $.each = function(obj, callback, args) {
    var value,
        i = 0,
        length = obj.length,
        isArray = isArraylike(obj);

    if (args) {
      if (isArray) {
        for (; i < length; i++) {
          value = callback.apply(obj[i], args);

          if (value === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          if (!obj.hasOwnProperty(i)) {
            continue;
          }
          value = callback.apply(obj[i], args);

          if (value === false) {
            break;
          }
        }
      }

    } else {
      if (isArray) {
        for (; i < length; i++) {
          value = callback.call(obj[i], i, obj[i]);

          if (value === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          if (!obj.hasOwnProperty(i)) {
            continue;
          }
          value = callback.call(obj[i], i, obj[i]);

          if (value === false) {
            break;
          }
        }
      }
    }

    return obj;
  };

  /* Custom */
  $.data = function(node, key, value) {
    /* $.getData() */
    if (value === undefined) {
      var getId = node[$.expando],
          store = getId && cache[getId];

      if (key === undefined) {
        return store;
      } else if (store) {
        if (key in store) {
          return store[key];
        }
      }
      /* $.setData() */
    } else if (key !== undefined) {
      var setId = node[$.expando] || (node[$.expando] = ++$.uuid);

      cache[setId] = cache[setId] || {};
      cache[setId][key] = value;

      return value;
    }
  };

  /* Custom */
  $.removeData = function(node, keys) {
    var id = node[$.expando],
        store = id && cache[id];

    if (store) {
      // Cleanup the entire store if no keys are provided.
      if (!keys) {
        delete cache[id];
      } else {
        $.each(keys, function(_, key) {
          delete store[key];
        });
      }
    }
  };

  /* jQuery */
  $.extend = function() {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    if (typeof target === "boolean") {
      deep = target;

      target = arguments[i] || {};
      i++;
    }

    if (typeof target !== "object" && $.type(target) !== "function") {
      target = {};
    }

    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {
      if ((options = arguments[i])) {
        for (name in options) {
          if (!options.hasOwnProperty(name)) {
            continue;
          }
          src = target[name];
          copy = options[name];

          if (target === copy) {
            continue;
          }

          if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && $.isArray(src) ? src : [];

            } else {
              clone = src && $.isPlainObject(src) ? src : {};
            }

            target[name] = $.extend(deep, clone, copy);

          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    return target;
  };

  /* jQuery 1.4.3 */
  $.queue = function(elem, type, data) {
    function $makeArray(arr, results) {
      var ret = results || [];

      if (arr) {
        if (isArraylike(Object(arr))) {
          /* $.merge */
          (function(first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            while (j < len) {
              first[i++] = second[j++];
            }

            if (len !== len) {
              while (second[j] !== undefined) {
                first[i++] = second[j++];
              }
            }

            first.length = i;

            return first;
          })(ret, typeof arr === "string" ? [arr] : arr);
        } else {
          [].push.call(ret, arr);
        }
      }

      return ret;
    }

    if (!elem) {
      return;
    }

    type = (type || "fx") + "queue";

    var q = $.data(elem, type);

    if (!data) {
      return q || [];
    }

    if (!q || $.isArray(data)) {
      q = $.data(elem, type, $makeArray(data));
    } else {
      q.push(data);
    }

    return q;
  };

  /* jQuery 1.4.3 */
  $.dequeue = function(elems, type) {
    /* Custom: Embed element iteration. */
    $.each(elems.nodeType ? [elems] : elems, function(i, elem) {
      type = type || "fx";

      var queue = $.queue(elem, type),
          fn = queue.shift();

      if (fn === "inprogress") {
        fn = queue.shift();
      }

      if (fn) {
        if (type === "fx") {
          queue.unshift("inprogress");
        }

        fn.call(elem, function() {
          $.dequeue(elem, type);
        });
      }
    });
  };

  /******************
   $.fn Methods
   ******************/

  /* jQuery */
  $.fn = $.prototype = {
    init: function(selector) {
      /* Just return the element wrapped inside an array; don't proceed with the actual jQuery node wrapping process. */
      if (selector.nodeType) {
        this[0] = selector;

        return this;
      } else {
        throw new Error("Not a DOM node.");
      }
    },
    offset: function() {
      /* jQuery altered code: Dropped disconnected DOM node checking. */
      var box = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {top: 0, left: 0};

      return {
        top: box.top + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
        left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
      };
    },
    position: function() {
      /* jQuery */
      function offsetParentFn(elem) {
        var offsetParent = elem.offsetParent;

        while (offsetParent && (offsetParent.nodeName.toLowerCase() !== "html" && offsetParent.style && offsetParent.style.position.toLowerCase() === "static")) {
          offsetParent = offsetParent.offsetParent;
        }

        return offsetParent || document;
      }

      /* Zepto */
      var elem = this[0],
          offsetParent = offsetParentFn(elem),
          offset = this.offset(),
          parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? {top: 0, left: 0} : $(offsetParent).offset();

      offset.top -= parseFloat(elem.style.marginTop) || 0;
      offset.left -= parseFloat(elem.style.marginLeft) || 0;

      if (offsetParent.style) {
        parentOffset.top += parseFloat(offsetParent.style.borderTopWidth) || 0;
        parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0;
      }

      return {
        top: offset.top - parentOffset.top,
        left: offset.left - parentOffset.left
      };
    }
  };

  /**********************
   Private Variables
   **********************/

  /* For $.data() */
  var cache = {};
  $.expando = "velocity" + (new Date().getTime());
  $.uuid = 0;

  /* For $.queue() */
  var class2type = {},
      hasOwn = class2type.hasOwnProperty,
      toString = class2type.toString;

  var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
  for (var i = 0; i < types.length; i++) {
    class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
  }

  /* Makes $(node) possible, without having to call init. */
  $.fn.init.prototype = $.fn;

  /* Globalize Velocity onto the window, and assign its Utilities property. */
  window.Velocity = {Utilities: $};
})(window);

/******************
 Velocity.js
 ******************/

(function(factory) {
  "use strict";
  /* CommonJS module. */
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
    /* AMD module. */
  } else if (typeof define === "function" && define.amd) {
    define(factory);
    /* Browser globals. */
  } else {
    factory();
  }
}(function() {
  "use strict";
  return function(global, window, document, undefined) {

    /***************
     Summary
     ***************/

    /*
		 - CSS: CSS stack that works independently from the rest of Velocity.
		 - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
		 - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
		 - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack.
		 Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
		 - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
		 - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
		 - completeCall(): Handles the cleanup process for each Velocity call.
		 */

    /*********************
     Helper Functions
     *********************/

    /* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
    var IE = (function() {
      if (document.documentMode) {
        return document.documentMode;
      } else {
        for (var i = 7; i > 4; i--) {
          var div = document.createElement("div");

          div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

          if (div.getElementsByTagName("span").length) {
            div = null;

            return i;
          }
        }
      }

      return undefined;
    })();

    /* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
    var rAFShim = (function() {
      var timeLast = 0;

      return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        var timeCurrent = (new Date()).getTime(),
            timeDelta;

        /* Dynamically set delay on a per-tick basis to match 60fps. */
        /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
        timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
        timeLast = timeCurrent + timeDelta;

        return setTimeout(function() {
          callback(timeCurrent + timeDelta);
        }, timeDelta);
      };
    })();

    var performance = (function() {
      var perf = window.performance || {};

      if (typeof perf.now !== "function") {
        var nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : (new Date()).getTime();

        perf.now = function() {
          return (new Date()).getTime() - nowOffset;
        };
      }
      return perf;
    })();

    /* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
    function compactSparseArray(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value) {
          result.push(value);
        }
      }

      return result;
    }

    /**
     * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
     * on host objects like NamedNodeMap, NodeList, and HTMLCollection
     * (technically, since host objects have been implementation-dependent,
     * at least before ES2015, IE hasn't needed to work this way).
     * Also works on strings, fixes IE < 9 to allow an explicit undefined
     * for the 2nd argument (as in Firefox), and prevents errors when
     * called on other DOM objects.
     */
    var _slice = (function() {
      var slice = Array.prototype.slice;

      try {
        // Can't be used with DOM elements in IE < 9
        slice.call(document.documentElement);
        return slice;
      } catch (e) { // Fails in IE < 9

        // This will work for genuine arrays, array-like objects,
        // NamedNodeMap (attributes, entities, notations),
        // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
        // and will not fail on other DOM objects (as do DOM elements in IE < 9)
        return function(begin, end) {
          var len = this.length;

          if (typeof begin !== "number") {
            begin = 0;
          }
          // IE < 9 gets unhappy with an undefined end argument
          if (typeof end !== "number") {
            end = len;
          }
          // For native Array objects, we use the native slice function
          if (this.slice) {
            return slice.call(this, begin, end);
          }
          // For array like object we handle it ourselves.
          var i,
              cloned = [],
              // Handle negative value for "begin"
              start = (begin >= 0) ? begin : Math.max(0, len + begin),
              // Handle negative value for "end"
              upTo = end < 0 ? len + end : Math.min(end, len),
              // Actual expected size of the slice
              size = upTo - start;

          if (size > 0) {
            cloned = new Array(size);
            if (this.charAt) {
              for (i = 0; i < size; i++) {
                cloned[i] = this.charAt(start + i);
              }
            } else {
              for (i = 0; i < size; i++) {
                cloned[i] = this[start + i];
              }
            }
          }
          return cloned;
        };
      }
    })();

    /* .indexOf doesn't exist in IE<9 */
    var _inArray = (function() {
      if (Array.prototype.includes) {
        return function(arr, val) {
          return arr.includes(val);
        };
      }
      if (Array.prototype.indexOf) {
        return function(arr, val) {
          return arr.indexOf(val) >= 0;
        };
      }
      return function(arr, val) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === val) {
            return true;
          }
        }
        return false;
      };
    });

    function sanitizeElements(elements) {
      /* Unwrap jQuery/Zepto objects. */
      if (Type.isWrapped(elements)) {
        elements = _slice.call(elements);
        /* Wrap a single element in an array so that $.each() can iterate with the element instead of its node's children. */
      } else if (Type.isNode(elements)) {
        elements = [elements];
      }

      return elements;
    }

    var Type = {
      isNumber: function(variable) {
        return (typeof variable === "number");
      },
      isString: function(variable) {
        return (typeof variable === "string");
      },
      isArray: Array.isArray || function(variable) {
        return Object.prototype.toString.call(variable) === "[object Array]";
      },
      isFunction: function(variable) {
        return Object.prototype.toString.call(variable) === "[object Function]";
      },
      isNode: function(variable) {
        return variable && variable.nodeType;
      },
      /* Determine if variable is an array-like wrapped jQuery, Zepto or similar element, or even a NodeList etc. */
      /* NOTE: HTMLFormElements also have a length. */
      isWrapped: function(variable) {
        return variable
          && variable !== window
          && Type.isNumber(variable.length)
          && !Type.isString(variable)
          && !Type.isFunction(variable)
          && !Type.isNode(variable)
          && (variable.length === 0 || Type.isNode(variable[0]));
      },
      isSVG: function(variable) {
        return window.SVGElement && (variable instanceof window.SVGElement);
      },
      isEmptyObject: function(variable) {
        for (var name in variable) {
          if (variable.hasOwnProperty(name)) {
            return false;
          }
        }

        return true;
      }
    };

    /*****************
     Dependencies
     *****************/

    var $,
        isJQuery = false;

    if (global.fn && global.fn.jquery) {
      $ = global;
      isJQuery = true;
    } else {
      $ = window.Velocity.Utilities;
    }

    if (IE <= 8 && !isJQuery) {
      throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
    } else if (IE <= 7) {
      /* Revert to jQuery's $.animate(), and lose Velocity's extra features. */
      jQuery3_2_1.fn.velocity = jQuery3_2_1.fn.animate;

      /* Now that $.fn.velocity is aliased, abort this Velocity declaration. */
      return;
    }

    /*****************
     Constants
     *****************/

    var DURATION_DEFAULT = 400,
        EASING_DEFAULT = "swing";

    /*************
     State
     *************/

    var Velocity = {
      /* Container for page-wide Velocity state data. */
      State: {
        /* Detect mobile devices to determine if mobileHA should be turned on. */
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        /* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
        isAndroid: /Android/i.test(navigator.userAgent),
        isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
        isChrome: window.chrome,
        isFirefox: /Firefox/i.test(navigator.userAgent),
        /* Create a cached element for re-use when checking for CSS property prefixes. */
        prefixElement: document.createElement("div"),
        /* Cache every prefix match to avoid repeating lookups. */
        prefixMatches: {},
        /* Cache the anchor used for animating window scrolling. */
        scrollAnchor: null,
        /* Cache the browser-specific property names associated with the scroll anchor. */
        scrollPropertyLeft: null,
        scrollPropertyTop: null,
        /* Keep track of whether our RAF tick is running. */
        isTicking: false,
        /* Container for every in-progress call to Velocity. */
        calls: [],
        delayedElements: {
          count: 0
        }
      },
      /* Velocity's custom CSS stack. Made global for unit testing. */
      CSS: {/* Defined below. */},
      /* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
      Utilities: $,
      /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
      Redirects: {/* Manually registered by the user. */},
      Easings: {/* Defined below. */},
      /* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
      Promise: window.Promise,
      /* Velocity option defaults, which can be overriden by the user. */
      defaults: {
        queue: "",
        duration: DURATION_DEFAULT,
        easing: EASING_DEFAULT,
        begin: undefined,
        complete: undefined,
        progress: undefined,
        display: undefined,
        visibility: undefined,
        loop: false,
        delay: false,
        mobileHA: true,
        /* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
        _cacheValues: true,
        /* Advanced: Set to false if the promise should always resolve on empty element lists. */
        promiseRejectEmpty: true
      },
      /* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
      init: function(element) {
        $.data(element, "velocity", {
          /* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
          isSVG: Type.isSVG(element),
          /* Keep track of whether the element is currently being animated by Velocity.
					 This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
          isAnimating: false,
          /* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
          computedStyle: null,
          /* Tween data is cached for each animation on the element so that data can be passed across calls --
					 in particular, end values are used as subsequent start values in consecutive Velocity calls. */
          tweensContainer: null,
          /* The full root property values of each CSS hook being animated on this element are cached so that:
					 1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
					 2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
          rootPropertyValueCache: {},
          /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
          transformCache: {}
        });
      },
      /* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
      hook: null, /* Defined below. */
      /* Velocity-wide animation time remapping for testing purposes. */
      mock: false,
      version: {major: 1, minor: 5, patch: 0},
      /* Set to 1 or 2 (most verbose) to output debug info to console. */
      debug: false,
      /* Use rAF high resolution timestamp when available */
      timestamp: true,
      /* Pause all animations */
      pauseAll: function(queueName) {
        var currentTime = (new Date()).getTime();

        $.each(Velocity.State.calls, function(i, activeCall) {

          if (activeCall) {

            /* If we have a queueName and this call is not on that queue, skip */
            if (queueName !== undefined && ((activeCall[2].queue !== queueName) || (activeCall[2].queue === false))) {
              return true;
            }

            /* Set call to paused */
            activeCall[5] = {
              resume: false
            };
          }
        });

        /* Pause timers on any currently delayed calls */
        $.each(Velocity.State.delayedElements, function(k, element) {
          if (!element) {
            return;
          }
          pauseDelayOnElement(element, currentTime);
        });
      },
      /* Resume all animations */
      resumeAll: function(queueName) {
        var currentTime = (new Date()).getTime();

        $.each(Velocity.State.calls, function(i, activeCall) {

          if (activeCall) {

            /* If we have a queueName and this call is not on that queue, skip */
            if (queueName !== undefined && ((activeCall[2].queue !== queueName) || (activeCall[2].queue === false))) {
              return true;
            }

            /* Set call to resumed if it was paused */
            if (activeCall[5]) {
              activeCall[5].resume = true;
            }
          }
        });
        /* Resume timers on any currently delayed calls */
        $.each(Velocity.State.delayedElements, function(k, element) {
          if (!element) {
            return;
          }
          resumeDelayOnElement(element, currentTime);
        });
      }
    };

    /* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
    if (window.pageYOffset !== undefined) {
      Velocity.State.scrollAnchor = window;
      Velocity.State.scrollPropertyLeft = "pageXOffset";
      Velocity.State.scrollPropertyTop = "pageYOffset";
    } else {
      Velocity.State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
      Velocity.State.scrollPropertyLeft = "scrollLeft";
      Velocity.State.scrollPropertyTop = "scrollTop";
    }

    /* Shorthand alias for jQuery's $.data() utility. */
    function Data(element) {
      /* Hardcode a reference to the plugin name. */
      var response = $.data(element, "velocity");

      /* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
      return response === null ? undefined : response;
    }

    /**************
     Delay Timer
     **************/

    function pauseDelayOnElement(element, currentTime) {
      /* Check for any delay timers, and pause the set timeouts (while preserving time data)
			 to be resumed when the "resume" command is issued */
      var data = Data(element);
      if (data && data.delayTimer && !data.delayPaused) {
        data.delayRemaining = data.delay - currentTime + data.delayBegin;
        data.delayPaused = true;
        clearTimeout(data.delayTimer.setTimeout);
      }
    }

    function resumeDelayOnElement(element, currentTime) {
      /* Check for any paused timers and resume */
      var data = Data(element);
      if (data && data.delayTimer && data.delayPaused) {
        /* If the element was mid-delay, re initiate the timeout with the remaining delay */
        data.delayPaused = false;
        data.delayTimer.setTimeout = setTimeout(data.delayTimer.next, data.delayRemaining);
      }
    }



    /**************
     Easing
     **************/

    /* Step easing generator. */
    function generateStep(steps) {
      return function(p) {
        return Math.round(p * steps) * (1 / steps);
      };
    }

    /* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    function generateBezier(mX1, mY1, mX2, mY2) {
      var NEWTON_ITERATIONS = 4,
          NEWTON_MIN_SLOPE = 0.001,
          SUBDIVISION_PRECISION = 0.0000001,
          SUBDIVISION_MAX_ITERATIONS = 10,
          kSplineTableSize = 11,
          kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
          float32ArraySupported = "Float32Array" in window;

      /* Must contain four arguments. */
      if (arguments.length !== 4) {
        return false;
      }

      /* Arguments must be numbers. */
      for (var i = 0; i < 4; ++i) {
        if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
          return false;
        }
      }

      /* X values must be in the [0, 1] range. */
      mX1 = Math.min(mX1, 1);
      mX2 = Math.min(mX2, 1);
      mX1 = Math.max(mX1, 0);
      mX2 = Math.max(mX2, 0);

      var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

      function A(aA1, aA2) {
        return 1.0 - 3.0 * aA2 + 3.0 * aA1;
      }
      function B(aA1, aA2) {
        return 3.0 * aA2 - 6.0 * aA1;
      }
      function C(aA1) {
        return 3.0 * aA1;
      }

      function calcBezier(aT, aA1, aA2) {
        return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
      }

      function getSlope(aT, aA1, aA2) {
        return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
      }

      function newtonRaphsonIterate(aX, aGuessT) {
        for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
          var currentSlope = getSlope(aGuessT, mX1, mX2);

          if (currentSlope === 0.0) {
            return aGuessT;
          }

          var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
          aGuessT -= currentX / currentSlope;
        }

        return aGuessT;
      }

      function calcSampleValues() {
        for (var i = 0; i < kSplineTableSize; ++i) {
          mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
      }

      function binarySubdivide(aX, aA, aB) {
        var currentX, currentT, i = 0;

        do {
          currentT = aA + (aB - aA) / 2.0;
          currentX = calcBezier(currentT, mX1, mX2) - aX;
          if (currentX > 0.0) {
            aB = currentT;
          } else {
            aA = currentT;
          }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

        return currentT;
      }

      function getTForX(aX) {
        var intervalStart = 0.0,
            currentSample = 1,
            lastSample = kSplineTableSize - 1;

        for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
          intervalStart += kSampleStepSize;
        }

        --currentSample;

        var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]),
            guessForT = intervalStart + dist * kSampleStepSize,
            initialSlope = getSlope(guessForT, mX1, mX2);

        if (initialSlope >= NEWTON_MIN_SLOPE) {
          return newtonRaphsonIterate(aX, guessForT);
        } else if (initialSlope === 0.0) {
          return guessForT;
        } else {
          return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
        }
      }

      var _precomputed = false;

      function precompute() {
        _precomputed = true;
        if (mX1 !== mY1 || mX2 !== mY2) {
          calcSampleValues();
        }
      }

      var f = function(aX) {
        if (!_precomputed) {
          precompute();
        }
        if (mX1 === mY1 && mX2 === mY2) {
          return aX;
        }
        if (aX === 0) {
          return 0;
        }
        if (aX === 1) {
          return 1;
        }

        return calcBezier(getTForX(aX), mY1, mY2);
      };

      f.getControlPoints = function() {
        return [{x: mX1, y: mY1}, {x: mX2, y: mY2}];
      };

      var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
      f.toString = function() {
        return str;
      };

      return f;
    }

    /* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    /* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
		 then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
    var generateSpringRK4 = (function() {
      function springAccelerationForState(state) {
        return (-state.tension * state.x) - (state.friction * state.v);
      }

      function springEvaluateStateWithDerivative(initialState, dt, derivative) {
        var state = {
          x: initialState.x + derivative.dx * dt,
          v: initialState.v + derivative.dv * dt,
          tension: initialState.tension,
          friction: initialState.friction
        };

        return {dx: state.v, dv: springAccelerationForState(state)};
      }

      function springIntegrateState(state, dt) {
        var a = {
              dx: state.v,
              dv: springAccelerationForState(state)
            },
            b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
            c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
            d = springEvaluateStateWithDerivative(state, dt, c),
            dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
            dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

        state.x = state.x + dxdt * dt;
        state.v = state.v + dvdt * dt;

        return state;
      }

      return function springRK4Factory(tension, friction, duration) {

        var initState = {
              x: -1,
              v: 0,
              tension: null,
              friction: null
            },
            path = [0],
            time_lapsed = 0,
            tolerance = 1 / 10000,
            DT = 16 / 1000,
            have_duration, dt, last_state;

        tension = parseFloat(tension) || 500;
        friction = parseFloat(friction) || 20;
        duration = duration || null;

        initState.tension = tension;
        initState.friction = friction;

        have_duration = duration !== null;

        /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
        if (have_duration) {
          /* Run the simulation without a duration. */
          time_lapsed = springRK4Factory(tension, friction);
          /* Compute the adjusted time delta. */
          dt = time_lapsed / duration * DT;
        } else {
          dt = DT;
        }

        while (true) {
          /* Next/step function .*/
          last_state = springIntegrateState(last_state || initState, dt);
          /* Store the position. */
          path.push(1 + last_state.x);
          time_lapsed += 16;
          /* If the change threshold is reached, break. */
          if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
            break;
          }
        }

        /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
				 computed path and returns a snapshot of the position according to a given percentComplete. */
        return !have_duration ? time_lapsed : function(percentComplete) {
          return path[ (percentComplete * (path.length - 1)) | 0 ];
        };
      };
    }());

    /* jQuery easings. */
    Velocity.Easings = {
      linear: function(p) {
        return p;
      },
      swing: function(p) {
        return 0.5 - Math.cos(p * Math.PI) / 2;
      },
      /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
      spring: function(p) {
        return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6));
      }
    };

    /* CSS3 and Robert Penner easings. */
    $.each(
      [
        ["ease", [0.25, 0.1, 0.25, 1.0]],
        ["ease-in", [0.42, 0.0, 1.00, 1.0]],
        ["ease-out", [0.00, 0.0, 0.58, 1.0]],
        ["ease-in-out", [0.42, 0.0, 0.58, 1.0]],
        ["easeInSine", [0.47, 0, 0.745, 0.715]],
        ["easeOutSine", [0.39, 0.575, 0.565, 1]],
        ["easeInOutSine", [0.445, 0.05, 0.55, 0.95]],
        ["easeInQuad", [0.55, 0.085, 0.68, 0.53]],
        ["easeOutQuad", [0.25, 0.46, 0.45, 0.94]],
        ["easeInOutQuad", [0.455, 0.03, 0.515, 0.955]],
        ["easeInCubic", [0.55, 0.055, 0.675, 0.19]],
        ["easeOutCubic", [0.215, 0.61, 0.355, 1]],
        ["easeInOutCubic", [0.645, 0.045, 0.355, 1]],
        ["easeInQuart", [0.895, 0.03, 0.685, 0.22]],
        ["easeOutQuart", [0.165, 0.84, 0.44, 1]],
        ["easeInOutQuart", [0.77, 0, 0.175, 1]],
        ["easeInQuint", [0.755, 0.05, 0.855, 0.06]],
        ["easeOutQuint", [0.23, 1, 0.32, 1]],
        ["easeInOutQuint", [0.86, 0, 0.07, 1]],
        ["easeInExpo", [0.95, 0.05, 0.795, 0.035]],
        ["easeOutExpo", [0.19, 1, 0.22, 1]],
        ["easeInOutExpo", [1, 0, 0, 1]],
        ["easeInCirc", [0.6, 0.04, 0.98, 0.335]],
        ["easeOutCirc", [0.075, 0.82, 0.165, 1]],
        ["easeInOutCirc", [0.785, 0.135, 0.15, 0.86]]
      ], function(i, easingArray) {
        Velocity.Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
      });

    /* Determine the appropriate easing type given an easing input. */
    function getEasing(value, duration) {
      var easing = value;

      /* The easing option can either be a string that references a pre-registered easing,
			 or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
      if (Type.isString(value)) {
        /* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
        if (!Velocity.Easings[value]) {
          easing = false;
        }
      } else if (Type.isArray(value) && value.length === 1) {
        easing = generateStep.apply(null, value);
      } else if (Type.isArray(value) && value.length === 2) {
        /* springRK4 must be passed the animation's duration. */
        /* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
				 function generated with default tension and friction values. */
        easing = generateSpringRK4.apply(null, value.concat([duration]));
      } else if (Type.isArray(value) && value.length === 4) {
        /* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
        easing = generateBezier.apply(null, value);
      } else {
        easing = false;
      }

      /* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
			 if the Velocity-wide default has been incorrectly modified. */
      if (easing === false) {
        if (Velocity.Easings[Velocity.defaults.easing]) {
          easing = Velocity.defaults.easing;
        } else {
          easing = EASING_DEFAULT;
        }
      }

      return easing;
    }

    /*****************
     CSS Stack
     *****************/

    /* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
		 It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
    /* Note: A "CSS" shorthand is aliased so that our code is easier to read. */
    var CSS = Velocity.CSS = {
      /*************
       RegEx
       *************/

      RegEx: {
        isHex: /^#([A-f\d]{3}){1,2}$/i,
        /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
        valueUnwrap: /^[A-z]+\((.*)\)$/i,
        wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
        /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
        valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
      },
      /************
       Lists
       ************/

      Lists: {
        colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
        transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
        transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"],
        units: [
          "%", // relative
          "em", "ex", "ch", "rem", // font relative
          "vw", "vh", "vmin", "vmax", // viewport relative
          "cm", "mm", "Q", "in", "pc", "pt", "px", // absolute lengths
          "deg", "grad", "rad", "turn", // angles
          "s", "ms" // time
        ],
        colorNames: {
          "aliceblue": "240,248,255",
          "antiquewhite": "250,235,215",
          "aquamarine": "127,255,212",
          "aqua": "0,255,255",
          "azure": "240,255,255",
          "beige": "245,245,220",
          "bisque": "255,228,196",
          "black": "0,0,0",
          "blanchedalmond": "255,235,205",
          "blueviolet": "138,43,226",
          "blue": "0,0,255",
          "brown": "165,42,42",
          "burlywood": "222,184,135",
          "cadetblue": "95,158,160",
          "chartreuse": "127,255,0",
          "chocolate": "210,105,30",
          "coral": "255,127,80",
          "cornflowerblue": "100,149,237",
          "cornsilk": "255,248,220",
          "crimson": "220,20,60",
          "cyan": "0,255,255",
          "darkblue": "0,0,139",
          "darkcyan": "0,139,139",
          "darkgoldenrod": "184,134,11",
          "darkgray": "169,169,169",
          "darkgrey": "169,169,169",
          "darkgreen": "0,100,0",
          "darkkhaki": "189,183,107",
          "darkmagenta": "139,0,139",
          "darkolivegreen": "85,107,47",
          "darkorange": "255,140,0",
          "darkorchid": "153,50,204",
          "darkred": "139,0,0",
          "darksalmon": "233,150,122",
          "darkseagreen": "143,188,143",
          "darkslateblue": "72,61,139",
          "darkslategray": "47,79,79",
          "darkturquoise": "0,206,209",
          "darkviolet": "148,0,211",
          "deeppink": "255,20,147",
          "deepskyblue": "0,191,255",
          "dimgray": "105,105,105",
          "dimgrey": "105,105,105",
          "dodgerblue": "30,144,255",
          "firebrick": "178,34,34",
          "floralwhite": "255,250,240",
          "forestgreen": "34,139,34",
          "fuchsia": "255,0,255",
          "gainsboro": "220,220,220",
          "ghostwhite": "248,248,255",
          "gold": "255,215,0",
          "goldenrod": "218,165,32",
          "gray": "128,128,128",
          "grey": "128,128,128",
          "greenyellow": "173,255,47",
          "green": "0,128,0",
          "honeydew": "240,255,240",
          "hotpink": "255,105,180",
          "indianred": "205,92,92",
          "indigo": "75,0,130",
          "ivory": "255,255,240",
          "khaki": "240,230,140",
          "lavenderblush": "255,240,245",
          "lavender": "230,230,250",
          "lawngreen": "124,252,0",
          "lemonchiffon": "255,250,205",
          "lightblue": "173,216,230",
          "lightcoral": "240,128,128",
          "lightcyan": "224,255,255",
          "lightgoldenrodyellow": "250,250,210",
          "lightgray": "211,211,211",
          "lightgrey": "211,211,211",
          "lightgreen": "144,238,144",
          "lightpink": "255,182,193",
          "lightsalmon": "255,160,122",
          "lightseagreen": "32,178,170",
          "lightskyblue": "135,206,250",
          "lightslategray": "119,136,153",
          "lightsteelblue": "176,196,222",
          "lightyellow": "255,255,224",
          "limegreen": "50,205,50",
          "lime": "0,255,0",
          "linen": "250,240,230",
          "magenta": "255,0,255",
          "maroon": "128,0,0",
          "mediumaquamarine": "102,205,170",
          "mediumblue": "0,0,205",
          "mediumorchid": "186,85,211",
          "mediumpurple": "147,112,219",
          "mediumseagreen": "60,179,113",
          "mediumslateblue": "123,104,238",
          "mediumspringgreen": "0,250,154",
          "mediumturquoise": "72,209,204",
          "mediumvioletred": "199,21,133",
          "midnightblue": "25,25,112",
          "mintcream": "245,255,250",
          "mistyrose": "255,228,225",
          "moccasin": "255,228,181",
          "navajowhite": "255,222,173",
          "navy": "0,0,128",
          "oldlace": "253,245,230",
          "olivedrab": "107,142,35",
          "olive": "128,128,0",
          "orangered": "255,69,0",
          "orange": "255,165,0",
          "orchid": "218,112,214",
          "palegoldenrod": "238,232,170",
          "palegreen": "152,251,152",
          "paleturquoise": "175,238,238",
          "palevioletred": "219,112,147",
          "papayawhip": "255,239,213",
          "peachpuff": "255,218,185",
          "peru": "205,133,63",
          "pink": "255,192,203",
          "plum": "221,160,221",
          "powderblue": "176,224,230",
          "purple": "128,0,128",
          "red": "255,0,0",
          "rosybrown": "188,143,143",
          "royalblue": "65,105,225",
          "saddlebrown": "139,69,19",
          "salmon": "250,128,114",
          "sandybrown": "244,164,96",
          "seagreen": "46,139,87",
          "seashell": "255,245,238",
          "sienna": "160,82,45",
          "silver": "192,192,192",
          "skyblue": "135,206,235",
          "slateblue": "106,90,205",
          "slategray": "112,128,144",
          "snow": "255,250,250",
          "springgreen": "0,255,127",
          "steelblue": "70,130,180",
          "tan": "210,180,140",
          "teal": "0,128,128",
          "thistle": "216,191,216",
          "tomato": "255,99,71",
          "turquoise": "64,224,208",
          "violet": "238,130,238",
          "wheat": "245,222,179",
          "whitesmoke": "245,245,245",
          "white": "255,255,255",
          "yellowgreen": "154,205,50",
          "yellow": "255,255,0"
        }
      },
      /************
       Hooks
       ************/

      /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
			 (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
      /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
			 tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
      Hooks: {
        /********************
         Registration
         ********************/

        /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
        /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
        templates: {
          "textShadow": ["Color X Y Blur", "black 0px 0px 0px"],
          "boxShadow": ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
          "clip": ["Top Right Bottom Left", "0px 0px 0px 0px"],
          "backgroundPosition": ["X Y", "0% 0%"],
          "transformOrigin": ["X Y Z", "50% 50% 0px"],
          "perspectiveOrigin": ["X Y", "50% 50%"]
        },
        /* A "registered" hook is one that has been converted from its template form into a live,
				 tweenable property. It contains data to associate it with its root property. */
        registered: {
          /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
					 which consists of the subproperty's name, the associated root property's name,
					 and the subproperty's position in the root's value. */
        },
        /* Convert the templates into individual hooks then append them to the registered object above. */
        register: function() {
          /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
					 currently set to "transparent" default to their respective template below when color-animated,
					 and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
					 which is almost always set closer to black than white. */
          for (var i = 0; i < CSS.Lists.colors.length; i++) {
            var rgbComponents = (CSS.Lists.colors[i] === "color") ? "0 0 0 1" : "255 255 255 1";
            CSS.Hooks.templates[CSS.Lists.colors[i]] = ["Red Green Blue Alpha", rgbComponents];
          }

          var rootProperty,
              hookTemplate,
              hookNames;

          /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
					 Thus, we re-arrange the templates accordingly. */
          if (IE) {
            for (rootProperty in CSS.Hooks.templates) {
              if (!CSS.Hooks.templates.hasOwnProperty(rootProperty)) {
                continue;
              }
              hookTemplate = CSS.Hooks.templates[rootProperty];
              hookNames = hookTemplate[0].split(" ");

              var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

              if (hookNames[0] === "Color") {
                /* Reposition both the hook's name and its default value to the end of their respective strings. */
                hookNames.push(hookNames.shift());
                defaultValues.push(defaultValues.shift());

                /* Replace the existing template for the hook's root property. */
                CSS.Hooks.templates[rootProperty] = [hookNames.join(" "), defaultValues.join(" ")];
              }
            }
          }

          /* Hook registration. */
          for (rootProperty in CSS.Hooks.templates) {
            if (!CSS.Hooks.templates.hasOwnProperty(rootProperty)) {
              continue;
            }
            hookTemplate = CSS.Hooks.templates[rootProperty];
            hookNames = hookTemplate[0].split(" ");

            for (var j in hookNames) {
              if (!hookNames.hasOwnProperty(j)) {
                continue;
              }
              var fullHookName = rootProperty + hookNames[j],
                  hookPosition = j;

              /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
							 and the hook's position in its template's default value string. */
              CSS.Hooks.registered[fullHookName] = [rootProperty, hookPosition];
            }
          }
        },
        /*****************************
         Injection and Extraction
         *****************************/

        /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
        /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
        getRoot: function(property) {
          var hookData = CSS.Hooks.registered[property];

          if (hookData) {
            return hookData[0];
          } else {
            /* If there was no hook match, return the property name untouched. */
            return property;
          }
        },
        getUnit: function(str, start) {
          var unit = (str.substr(start || 0, 5).match(/^[a-z%]+/) || [])[0] || "";

          if (unit && _inArray(CSS.Lists.units, unit)) {
            return unit;
          }
          return "";
        },
        fixColors: function(str) {
          return str.replace(/(rgba?\(\s*)?(\b[a-z]+\b)/g, function($0, $1, $2) {
            if (CSS.Lists.colorNames.hasOwnProperty($2)) {
              return ($1 ? $1 : "rgba(") + CSS.Lists.colorNames[$2] + ($1 ? "" : ",1)");
            }
            return $1 + $2;
          });
        },
        /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
				 the targeted hook can be injected or extracted at its standard position. */
        cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
          /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
          if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
            rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
          }

          /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
					 default to the root's default value as defined in CSS.Hooks.templates. */
          /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
					 zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
          if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
            rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
          }

          return rootPropertyValue;
        },
        /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
        extractValue: function(fullHookName, rootPropertyValue) {
          var hookData = CSS.Hooks.registered[fullHookName];

          if (hookData) {
            var hookRoot = hookData[0],
                hookPosition = hookData[1];

            rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

            /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
            return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
          } else {
            /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
            return rootPropertyValue;
          }
        },
        /* Inject the hook's value into its root property's value. This is used to piece back together the root property
				 once Velocity has updated one of its individually hooked values through tweening. */
        injectValue: function(fullHookName, hookValue, rootPropertyValue) {
          var hookData = CSS.Hooks.registered[fullHookName];

          if (hookData) {
            var hookRoot = hookData[0],
                hookPosition = hookData[1],
                rootPropertyValueParts,
                rootPropertyValueUpdated;

            rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

            /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
						 then reconstruct the rootPropertyValue string. */
            rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
            rootPropertyValueParts[hookPosition] = hookValue;
            rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

            return rootPropertyValueUpdated;
          } else {
            /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
            return rootPropertyValue;
          }
        }
      },
      /*******************
       Normalizations
       *******************/

      /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
			 and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
      Normalizations: {
        /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
				 the targeted element (which may need to be queried), and the targeted property value. */
        registered: {
          clip: function(type, element, propertyValue) {
            switch (type) {
              case "name":
                return "clip";
              /* Clip needs to be unwrapped and stripped of its commas during extraction. */
              case "extract":
                var extracted;

                /* If Velocity also extracted this value, skip extraction. */
                if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                  extracted = propertyValue;
                } else {
                  /* Remove the "rect()" wrapper. */
                  extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                  /* Strip off commas. */
                  extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                }

                return extracted;
              /* Clip needs to be re-wrapped during injection. */
              case "inject":
                return "rect(" + propertyValue + ")";
            }
          },
          blur: function(type, element, propertyValue) {
            switch (type) {
              case "name":
                return Velocity.State.isFirefox ? "filter" : "-webkit-filter";
              case "extract":
                var extracted = parseFloat(propertyValue);

                /* If extracted is NaN, meaning the value isn't already extracted. */
                if (!(extracted || extracted === 0)) {
                  var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                  /* If the filter string had a blur component, return just the blur value and unit type. */
                  if (blurComponent) {
                    extracted = blurComponent[1];
                    /* If the component doesn't exist, default blur to 0. */
                  } else {
                    extracted = 0;
                  }
                }

                return extracted;
              /* Blur needs to be re-wrapped during injection. */
              case "inject":
                /* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
                if (!parseFloat(propertyValue)) {
                  return "none";
                } else {
                  return "blur(" + propertyValue + ")";
                }
            }
          },
          /* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
          opacity: function(type, element, propertyValue) {
            if (IE <= 8) {
              switch (type) {
                case "name":
                  return "filter";
                case "extract":
                  /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
									 Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                  var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

                  if (extracted) {
                    /* Convert to decimal value. */
                    propertyValue = extracted[1] / 100;
                  } else {
                    /* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
                    propertyValue = 1;
                  }

                  return propertyValue;
                case "inject":
                  /* Opacified elements are required to have their zoom property set to a non-zero value. */
                  element.style.zoom = 1;

                  /* Setting the filter property on elements with certain font property combinations can result in a
									 highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
									 value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
                  if (parseFloat(propertyValue) >= 1) {
                    return "";
                  } else {
                    /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                    return "alpha(opacity=" + parseInt(parseFloat(propertyValue) * 100, 10) + ")";
                  }
              }
              /* With all other browsers, normalization is not required; return the same values that were passed in. */
            } else {
              switch (type) {
                case "name":
                  return "opacity";
                case "extract":
                  return propertyValue;
                case "inject":
                  return propertyValue;
              }
            }
          }
        },
        /*****************************
         Batched Registrations
         *****************************/

        /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
        register: function() {

          /*****************
           Transforms
           *****************/

          /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
					 so that they can be referenced in a properties map by their individual names. */
          /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
					 setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM.
					 Transform setting is batched in this way to improve performance: the transform style only needs to be updated
					 once when multiple transform subproperties are being animated simultaneously. */
          /* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
					 transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
					 from being normalized for these browsers so that tweening skips these properties altogether
					 (since it will ignore them as being unsupported by the browser.) */
          if ((!IE || IE > 9) && !Velocity.State.isGingerbread) {
            /* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
						 share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
            CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
          }

          for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
            /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
						 paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
            (function() {
              var transformName = CSS.Lists.transformsBase[i];

              CSS.Normalizations.registered[transformName] = function(type, element, propertyValue) {
                switch (type) {
                  /* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
                  case "name":
                    return "transform";
                  /* Transform values are cached onto a per-element transformCache object. */
                  case "extract":
                    /* If this transform has yet to be assigned a value, return its null value. */
                    if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                      /* Scale CSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                      return /^scale/i.test(transformName) ? 1 : 0;
                      /* When transform values are set, they are wrapped in parentheses as per the CSS spec.
											 Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                    }
                    return Data(element).transformCache[transformName].replace(/[()]/g, "");
                  case "inject":
                    var invalid = false;

                    /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
										 Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                    /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                    switch (transformName.substr(0, transformName.length - 1)) {
                      /* Whitelist unit types for each transform. */
                      case "translate":
                        invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                        break;
                      /* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
                      case "scal":
                      case "scale":
                        /* Chrome on Android has a bug in which scaled elements blur if their initial scale
												 value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
												 and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
                        if (Velocity.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
                          propertyValue = 1;
                        }

                        invalid = !/(\d)$/i.test(propertyValue);
                        break;
                      case "skew":
                        invalid = !/(deg|\d)$/i.test(propertyValue);
                        break;
                      case "rotate":
                        invalid = !/(deg|\d)$/i.test(propertyValue);
                        break;
                    }

                    if (!invalid) {
                      /* As per the CSS spec, wrap the value in parentheses. */
                      Data(element).transformCache[transformName] = "(" + propertyValue + ")";
                    }

                    /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                    return Data(element).transformCache[transformName];
                }
              };
            })();
          }

          /*************
           Colors
           *************/

          /* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
					 Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
          for (var j = 0; j < CSS.Lists.colors.length; j++) {
            /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
						 (Otherwise, all functions would take the final for loop's colorName.) */
            (function() {
              var colorName = CSS.Lists.colors[j];

              /* Note: In IE<=8, which support rgb but not rgba, color properties are reverted to rgb by stripping off the alpha component. */
              CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
                switch (type) {
                  case "name":
                    return colorName;
                  /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                  case "extract":
                    var extracted;

                    /* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
                    if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                      extracted = propertyValue;
                    } else {
                      var converted,
                          colorNames = {
                            black: "rgb(0, 0, 0)",
                            blue: "rgb(0, 0, 255)",
                            gray: "rgb(128, 128, 128)",
                            green: "rgb(0, 128, 0)",
                            red: "rgb(255, 0, 0)",
                            white: "rgb(255, 255, 255)"
                          };

                      /* Convert color names to rgb. */
                      if (/^[A-z]+$/i.test(propertyValue)) {
                        if (colorNames[propertyValue] !== undefined) {
                          converted = colorNames[propertyValue];
                        } else {
                          /* If an unmatched color name is provided, default to black. */
                          converted = colorNames.black;
                        }
                        /* Convert hex values to rgb. */
                      } else if (CSS.RegEx.isHex.test(propertyValue)) {
                        converted = "rgb(" + CSS.Values.hexToRgb(propertyValue).join(" ") + ")";
                        /* If the provided color doesn't match any of the accepted color formats, default to black. */
                      } else if (!(/^rgba?\(/i.test(propertyValue))) {
                        converted = colorNames.black;
                      }

                      /* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip
											 repeated spaces (in case the value included spaces to begin with). */
                      extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                    }

                    /* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                    if ((!IE || IE > 8) && extracted.split(" ").length === 3) {
                      extracted += " 1";
                    }

                    return extracted;
                  case "inject":
                    /* If we have a pattern then it might already have the right values */
                    if (/^rgb/.test(propertyValue)) {
                      return propertyValue;
                    }

                    /* If this is IE<=8 and an alpha component exists, strip it off. */
                    if (IE <= 8) {
                      if (propertyValue.split(" ").length === 4) {
                        propertyValue = propertyValue.split(/\s+/).slice(0, 3).join(" ");
                      }
                      /* Otherwise, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                    } else if (propertyValue.split(" ").length === 3) {
                      propertyValue += " 1";
                    }

                    /* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units
										 on all values but the fourth (R, G, and B only accept whole numbers). */
                    return (IE <= 8 ? "rgb" : "rgba") + "(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                }
              };
            })();
          }

          /**************
           Dimensions
           **************/
          function augmentDimension(name, element, wantInner) {
            var isBorderBox = CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box";

            if (isBorderBox === (wantInner || false)) {
              /* in box-sizing mode, the CSS width / height accessors already give the outerWidth / outerHeight. */
              var i,
                  value,
                  augment = 0,
                  sides = name === "width" ? ["Left", "Right"] : ["Top", "Bottom"],
                  fields = ["padding" + sides[0], "padding" + sides[1], "border" + sides[0] + "Width", "border" + sides[1] + "Width"];

              for (i = 0; i < fields.length; i++) {
                value = parseFloat(CSS.getPropertyValue(element, fields[i]));
                if (!isNaN(value)) {
                  augment += value;
                }
              }
              return wantInner ? -augment : augment;
            }
            return 0;
          }
          function getDimension(name, wantInner) {
            return function(type, element, propertyValue) {
              switch (type) {
                case "name":
                  return name;
                case "extract":
                  return parseFloat(propertyValue) + augmentDimension(name, element, wantInner);
                case "inject":
                  return (parseFloat(propertyValue) - augmentDimension(name, element, wantInner)) + "px";
              }
            };
          }
          CSS.Normalizations.registered.innerWidth = getDimension("width", true);
          CSS.Normalizations.registered.innerHeight = getDimension("height", true);
          CSS.Normalizations.registered.outerWidth = getDimension("width");
          CSS.Normalizations.registered.outerHeight = getDimension("height");
        }
      },
      /************************
       CSS Property Names
       ************************/

      Names: {
        /* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
				 Camelcasing is used to normalize property names between and across calls. */
        camelCase: function(property) {
          return property.replace(/-(\w)/g, function(match, subMatch) {
            return subMatch.toUpperCase();
          });
        },
        /* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
        SVGAttribute: function(property) {
          var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";

          /* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
          if (IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) {
            SVGAttributes += "|transform";
          }

          return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
        },
        /* Determine whether a property should be set with a vendor prefix. */
        /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
				 If the property is not at all supported by the browser, return a false flag. */
        prefixCheck: function(property) {
          /* If this property has already been checked, return the cached value. */
          if (Velocity.State.prefixMatches[property]) {
            return [Velocity.State.prefixMatches[property], true];
          } else {
            var vendors = ["", "Webkit", "Moz", "ms", "O"];

            for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
              var propertyPrefixed;

              if (i === 0) {
                propertyPrefixed = property;
              } else {
                /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
                propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) {
                  return match.toUpperCase();
                });
              }

              /* Check if the browser supports this property as prefixed. */
              if (Type.isString(Velocity.State.prefixElement.style[propertyPrefixed])) {
                /* Cache the match. */
                Velocity.State.prefixMatches[property] = propertyPrefixed;

                return [propertyPrefixed, true];
              }
            }

            /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
            return [property, false];
          }
        }
      },
      /************************
       CSS Property Values
       ************************/

      Values: {
        /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
        hexToRgb: function(hex) {
          var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
              longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
              rgbParts;

          hex = hex.replace(shortformRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
          });

          rgbParts = longformRegex.exec(hex);

          return rgbParts ? [parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16)] : [0, 0, 0];
        },
        isCSSNullValue: function(value) {
          /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
					 Thus, we check for both falsiness and these special strings. */
          /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
					 templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
          /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
          return (!value || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
        },
        /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
        getUnitType: function(property) {
          if (/^(rotate|skew)/i.test(property)) {
            return "deg";
          } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
            /* The above properties are unitless. */
            return "";
          } else {
            /* Default to px for all other properties. */
            return "px";
          }
        },
        /* HTML elements default to an associated display type when they're not set to display:none. */
        /* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
        getDisplayType: function(element) {
          var tagName = element && element.tagName.toString().toLowerCase();

          if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
            return "inline";
          } else if (/^(li)$/i.test(tagName)) {
            return "list-item";
          } else if (/^(tr)$/i.test(tagName)) {
            return "table-row";
          } else if (/^(table)$/i.test(tagName)) {
            return "table";
          } else if (/^(tbody)$/i.test(tagName)) {
            return "table-row-group";
            /* Default to "block" when no match is found. */
          } else {
            return "block";
          }
        },
        /* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
        addClass: function(element, className) {
          if (element) {
            if (element.classList) {
              element.classList.add(className);
            } else if (Type.isString(element.className)) {
              // Element.className is around 15% faster then set/getAttribute
              element.className += (element.className.length ? " " : "") + className;
            } else {
              // Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
              var currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";

              element.setAttribute("class", currentClass + (currentClass ? " " : "") + className);
            }
          }
        },
        removeClass: function(element, className) {
          if (element) {
            if (element.classList) {
              element.classList.remove(className);
            } else if (Type.isString(element.className)) {
              // Element.className is around 15% faster then set/getAttribute
              // TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
              element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
            } else {
              // Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
              var currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";

              element.setAttribute("class", currentClass.replace(new RegExp("(^|\s)" + className.split(" ").join("|") + "(\s|$)", "gi"), " "));
            }
          }
        }
      },
      /****************************
       Style Getting & Setting
       ****************************/

      /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
      getPropertyValue: function(element, property, rootPropertyValue, forceStyleLookup) {
        /* Get an element's computed property value. */
        /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
				 style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
				 *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
        function computePropertyValue(element, property) {
          /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
					 element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
					 offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
					 We subtract border and padding to get the sum of interior + scrollbar. */
          var computedValue = 0;

          /* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array
					 of hacks to accurately retrieve IE8 property values. Re-implementing that logic here is not worth bloating the
					 codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
					 Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
          if (IE <= 8) {
            computedValue = $.css(element, property); /* GET */
            /* All other browsers support getComputedStyle. The returned live object reference is cached onto its
						 associated element so that it does not need to be refetched upon every GET. */
          } else {
            /* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
						 toggle display to the element type's default value. */
            var toggleDisplay = false;

            if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, "display") === 0) {
              toggleDisplay = true;
              CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element));
            }

            var revertDisplay = function() {
              if (toggleDisplay) {
                CSS.setPropertyValue(element, "display", "none");
              }
            };

            if (!forceStyleLookup) {
              if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                revertDisplay();

                return contentBoxHeight;
              } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                revertDisplay();

                return contentBoxWidth;
              }
            }

            var computedStyle;

            /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
						 of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
            if (Data(element) === undefined) {
              computedStyle = window.getComputedStyle(element, null); /* GET */
              /* If the computedStyle object has yet to be cached, do so now. */
            } else if (!Data(element).computedStyle) {
              computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
              /* If computedStyle is cached, use it. */
            } else {
              computedStyle = Data(element).computedStyle;
            }

            /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
						 Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
						 So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
            if (property === "borderColor") {
              property = "borderTopColor";
            }

            /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
						 instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
            if (IE === 9 && property === "filter") {
              computedValue = computedStyle.getPropertyValue(property); /* GET */
            } else {
              computedValue = computedStyle[property];
            }

            /* Fall back to the property's style value (if defined) when computedValue returns nothing,
						 which can happen when the element hasn't been painted. */
            if (computedValue === "" || computedValue === null) {
              computedValue = element.style[property];
            }

            revertDisplay();
          }

          /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
					 defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
					 effect as being set to 0, so no conversion is necessary.) */
          /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
					 property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
					 to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
          if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
            var position = computePropertyValue(element, "position"); /* GET */

            /* For absolute positioning, jQuery's $.position() only returns values for top and left;
						 right and bottom will have their "auto" value reverted to 0. */
            /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
						 Not a big deal since we're currently in a GET batch anyway. */
            if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
              /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
              computedValue = $(element).position()[property] + "px"; /* GET */
            }
          }

          return computedValue;
        }

        var propertyValue;

        /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
				 extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
        if (CSS.Hooks.registered[property]) {
          var hook = property,
              hookRoot = CSS.Hooks.getRoot(hook);

          /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
					 query the DOM for the root property's value. */
          if (rootPropertyValue === undefined) {
            /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
            rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
          }

          /* If this root has a normalization registered, peform the associated normalization extraction. */
          if (CSS.Normalizations.registered[hookRoot]) {
            rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
          }

          /* Extract the hook's value. */
          propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

          /* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
					 normalize the property's name and value, and handle the special case of transforms. */
          /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
					 numerical and therefore do not require normalization extraction. */
        } else if (CSS.Normalizations.registered[property]) {
          var normalizedPropertyName,
              normalizedPropertyValue;

          normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);

          /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
					 At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
					 This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
					 thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
          if (normalizedPropertyName !== "transform") {
            normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

            /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
            if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
              normalizedPropertyValue = CSS.Hooks.templates[property][1];
            }
          }

          propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
        }

        /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
        if (!/^[\d-]/.test(propertyValue)) {
          /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
					 their HTML attribute values instead of their CSS style values. */
          var data = Data(element);

          if (data && data.isSVG && CSS.Names.SVGAttribute(property)) {
            /* Since the height/width attribute values must be set manually, they don't reflect computed values.
						 Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
            if (/^(height|width)$/i.test(property)) {
              /* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
              try {
                propertyValue = element.getBBox()[property];
              } catch (error) {
                propertyValue = 0;
              }
              /* Otherwise, access the attribute value directly. */
            } else {
              propertyValue = element.getAttribute(property);
            }
          } else {
            propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
          }
        }

        /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
				 convert CSS null-values to an integer of value 0. */
        if (CSS.Values.isCSSNullValue(propertyValue)) {
          propertyValue = 0;
        }

        if (Velocity.debug >= 2) {
          console.log("Get " + property + ": " + propertyValue);
        }

        return propertyValue;
      },
      /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
      setPropertyValue: function(element, property, propertyValue, rootPropertyValue, scrollData) {
        var propertyName = property;

        /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
        if (property === "scroll") {
          /* If a container option is present, scroll the container instead of the browser window. */
          if (scrollData.container) {
            scrollData.container["scroll" + scrollData.direction] = propertyValue;
            /* Otherwise, Velocity defaults to scrolling the browser window. */
          } else {
            if (scrollData.direction === "Left") {
              window.scrollTo(propertyValue, scrollData.alternateValue);
            } else {
              window.scrollTo(scrollData.alternateValue, propertyValue);
            }
          }
        } else {
          /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
					 Thus, for now, we merely cache transforms being SET. */
          if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
            /* Perform a normalization injection. */
            /* Note: The normalization logic handles the transformCache updating. */
            CSS.Normalizations.registered[property]("inject", element, propertyValue);

            propertyName = "transform";
            propertyValue = Data(element).transformCache[property];
          } else {
            /* Inject hooks. */
            if (CSS.Hooks.registered[property]) {
              var hookName = property,
                  hookRoot = CSS.Hooks.getRoot(property);

              /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
              rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

              propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
              property = hookRoot;
            }

            /* Normalize names and values. */
            if (CSS.Normalizations.registered[property]) {
              propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
              property = CSS.Normalizations.registered[property]("name", element);
            }

            /* Assign the appropriate vendor prefix before performing an official style update. */
            propertyName = CSS.Names.prefixCheck(property)[0];

            /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
						 Try/catch is avoided for other browsers since it incurs a performance overhead. */
            if (IE <= 8) {
              try {
                element.style[propertyName] = propertyValue;
              } catch (error) {
                if (Velocity.debug) {
                  console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]");
                }
              }
              /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
              /* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
            } else {
              var data = Data(element);

              if (data && data.isSVG && CSS.Names.SVGAttribute(property)) {
                /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                element.setAttribute(property, propertyValue);
              } else {
                element.style[propertyName] = propertyValue;
              }
            }

            if (Velocity.debug >= 2) {
              console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
            }
          }
        }

        /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
        return [propertyName, propertyValue];
      },
      /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
      /* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
      flushTransformCache: function(element) {
        var transformString = "",
            data = Data(element);

        /* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
				 (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
        if ((IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) && data && data.isSVG) {
          /* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
					 Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
          var getTransformFloat = function(transformProperty) {
            return parseFloat(CSS.getPropertyValue(element, transformProperty));
          };

          /* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
					 we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
          var SVGTransforms = {
            translate: [getTransformFloat("translateX"), getTransformFloat("translateY")],
            skewX: [getTransformFloat("skewX")], skewY: [getTransformFloat("skewY")],
            /* If the scale property is set (non-1), use that value for the scaleX and scaleY values
						 (this behavior mimics the result of animating all these properties at once on HTML elements). */
            scale: getTransformFloat("scale") !== 1 ? [getTransformFloat("scale"), getTransformFloat("scale")] : [getTransformFloat("scaleX"), getTransformFloat("scaleY")],
            /* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
						 defining the rotation's origin point. We ignore the origin values (default them to 0). */
            rotate: [getTransformFloat("rotateZ"), 0, 0]
          };

          /* Iterate through the transform properties in the user-defined property map order.
					 (This mimics the behavior of non-SVG transform animation.) */
          $.each(Data(element).transformCache, function(transformName) {
            /* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
						 properties so that they match up with SVG's accepted transform properties. */
            if (/^translate/i.test(transformName)) {
              transformName = "translate";
            } else if (/^scale/i.test(transformName)) {
              transformName = "scale";
            } else if (/^rotate/i.test(transformName)) {
              transformName = "rotate";
            }

            /* Check that we haven't yet deleted the property from the SVGTransforms container. */
            if (SVGTransforms[transformName]) {
              /* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
              transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

              /* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
							 re-insert the same master property if we encounter another one of its axis-specific properties. */
              delete SVGTransforms[transformName];
            }
          });
        } else {
          var transformValue,
              perspective;

          /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
          $.each(Data(element).transformCache, function(transformName) {
            transformValue = Data(element).transformCache[transformName];

            /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
            if (transformName === "transformPerspective") {
              perspective = transformValue;
              return true;
            }

            /* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
            if (IE === 9 && transformName === "rotateZ") {
              transformName = "rotate";
            }

            transformString += transformName + transformValue + " ";
          });

          /* If present, set the perspective subproperty first. */
          if (perspective) {
            transformString = "perspective" + perspective + " " + transformString;
          }
        }

        CSS.setPropertyValue(element, "transform", transformString);
      }
    };

    /* Register hooks and normalizations. */
    CSS.Hooks.register();
    CSS.Normalizations.register();

    /* Allow hook setting in the same fashion as jQuery's $.css(). */
    Velocity.hook = function(elements, arg2, arg3) {
      var value;

      elements = sanitizeElements(elements);

      $.each(elements, function(i, element) {
        /* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
        if (Data(element) === undefined) {
          Velocity.init(element);
        }

        /* Get property value. If an element set was passed in, only return the value for the first element. */
        if (arg3 === undefined) {
          if (value === undefined) {
            value = CSS.getPropertyValue(element, arg2);
          }
          /* Set property value. */
        } else {
          /* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
          var adjustedSet = CSS.setPropertyValue(element, arg2, arg3);

          /* Transform properties don't automatically set. They have to be flushed to the DOM. */
          if (adjustedSet[0] === "transform") {
            Velocity.CSS.flushTransformCache(element);
          }

          value = adjustedSet;
        }
      });

      return value;
    };

    /*****************
     Animation
     *****************/

    var animate = function() {
      var opts;

      /******************
       Call Chain
       ******************/

      /* Logic for determining what to return to the call stack when exiting out of Velocity. */
      function getChain() {
        /* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
				 default to null instead of returning the targeted elements so that utility function's return value is standardized. */
        if (isUtility) {
          return promiseData.promise || null;
          /* Otherwise, if we're using $.fn, return the jQuery-/Zepto-wrapped element set. */
        } else {
          return elementsWrapped;
        }
      }

      /*************************
       Arguments Assignment
       *************************/

      /* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "elements" (or "e"), "properties" (or "p"), and "options" (or "o")
			 objects are defined on a container object that's passed in as Velocity's sole argument. */
      /* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
      var syntacticSugar = (arguments[0] && (arguments[0].p || (($.isPlainObject(arguments[0].properties) && !arguments[0].properties.names) || Type.isString(arguments[0].properties)))),
          /* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
          isUtility,
          /* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
					 passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
          elementsWrapped,
          argumentIndex;

      var elements,
          propertiesMap,
          options;

      /* Detect jQuery/Zepto elements being animated via the $.fn method. */
      if (Type.isWrapped(this)) {
        isUtility = false;

        argumentIndex = 0;
        elements = this;
        elementsWrapped = this;
        /* Otherwise, raw elements are being animated via the utility function. */
      } else {
        isUtility = true;

        argumentIndex = 1;
        elements = syntacticSugar ? (arguments[0].elements || arguments[0].e) : arguments[0];
      }

      /***************
       Promises
       ***************/

      var promiseData = {
        promise: null,
        resolver: null,
        rejecter: null
      };

      /* If this call was made via the utility function (which is the default method of invocation when jQuery/Zepto are not being used), and if
			 promise support was detected, create a promise object for this call and store references to its resolver and rejecter methods. The resolve
			 method is used when a call completes naturally or is prematurely stopped by the user. In both cases, completeCall() handles the associated
			 call cleanup and promise resolving logic. The reject method is used when an invalid set of arguments is passed into a Velocity call. */
      /* Note: Velocity employs a call-based queueing architecture, which means that stopping an animating element actually stops the full call that
			 triggered it -- not that one element exclusively. Similarly, there is one promise per call, and all elements targeted by a Velocity call are
			 grouped together for the purposes of resolving and rejecting a promise. */
      if (isUtility && Velocity.Promise) {
        promiseData.promise = new Velocity.Promise(function(resolve, reject) {
          promiseData.resolver = resolve;
          promiseData.rejecter = reject;
        });
      }

      if (syntacticSugar) {
        propertiesMap = arguments[0].properties || arguments[0].p;
        options = arguments[0].options || arguments[0].o;
      } else {
        propertiesMap = arguments[argumentIndex];
        options = arguments[argumentIndex + 1];
      }

      elements = sanitizeElements(elements);

      if (!elements) {
        if (promiseData.promise) {
          if (!propertiesMap || !options || options.promiseRejectEmpty !== false) {
            promiseData.rejecter();
          } else {
            promiseData.resolver();
          }
        }
        return;
      }

      /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
			 single raw DOM element is passed in (which doesn't contain a length property). */
      var elementsLength = elements.length,
          elementsIndex = 0;

      /***************************
       Argument Overloading
       ***************************/

      /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
			 Overloading is detected by checking for the absence of an object being passed into options. */
      /* Note: The stop/finish/pause/resume actions do not accept animation options, and are therefore excluded from this check. */
      if (!/^(stop|finish|finishAll|pause|resume)$/i.test(propertiesMap) && !$.isPlainObject(options)) {
        /* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
        var startingArgumentPosition = argumentIndex + 1;

        options = {};

        /* Iterate through all options arguments */
        for (var i = startingArgumentPosition; i < arguments.length; i++) {
          /* Treat a number as a duration. Parse it out. */
          /* Note: The following RegEx will return true if passed an array with a number as its first item.
					 Thus, arrays are skipped from this check. */
          if (!Type.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
            options.duration = arguments[i];
            /* Treat strings and arrays as easings. */
          } else if (Type.isString(arguments[i]) || Type.isArray(arguments[i])) {
            options.easing = arguments[i];
            /* Treat a function as a complete callback. */
          } else if (Type.isFunction(arguments[i])) {
            options.complete = arguments[i];
          }
        }
      }

      /*********************
       Action Detection
       *********************/

      /* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view,
			 or they can be started, stopped, paused, resumed, or reversed . If a literal or referenced properties map is passed in as Velocity's
			 first argument, the associated action is "start". Alternatively, "scroll", "reverse", "pause", "resume" or "stop" can be passed in
			 instead of a properties map. */
      var action;

      switch (propertiesMap) {
        case "scroll":
          action = "scroll";
          break;

        case "reverse":
          action = "reverse";
          break;

        case "pause":

          /*******************
           Action: Pause
           *******************/

          var currentTime = (new Date()).getTime();

          /* Handle delay timers */
          $.each(elements, function(i, element) {
            pauseDelayOnElement(element, currentTime);
          });

          /* Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a
					 single element will cause any calls that containt tweens for that element to be paused/resumed
					 as well. */

          /* Iterate through all calls and pause any that contain any of our elements */
          $.each(Velocity.State.calls, function(i, activeCall) {

            var found = false;
            /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
            if (activeCall) {
              /* Iterate through the active call's targeted elements. */
              $.each(activeCall[1], function(k, activeElement) {
                var queueName = (options === undefined) ? "" : options;

                if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                  return true;
                }

                /* Iterate through the calls targeted by the stop command. */
                $.each(elements, function(l, element) {
                  /* Check that this call was applied to the target element. */
                  if (element === activeElement) {

                    /* Set call to paused */
                    activeCall[5] = {
                      resume: false
                    };

                    /* Once we match an element, we can bounce out to the next call entirely */
                    found = true;
                    return false;
                  }
                });

                /* Proceed to check next call if we have already matched */
                if (found) {
                  return false;
                }
              });
            }

          });

          /* Since pause creates no new tweens, exit out of Velocity. */
          return getChain();

        case "resume":

          /*******************
           Action: Resume
           *******************/

          /* Handle delay timers */
          $.each(elements, function(i, element) {
            resumeDelayOnElement(element, currentTime);
          });

          /* Pause and Resume are call-wide (not on a per elemnt basis). Thus, calling pause or resume on a
					 single element will cause any calls that containt tweens for that element to be paused/resumed
					 as well. */

          /* Iterate through all calls and pause any that contain any of our elements */
          $.each(Velocity.State.calls, function(i, activeCall) {
            var found = false;
            /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
            if (activeCall) {
              /* Iterate through the active call's targeted elements. */
              $.each(activeCall[1], function(k, activeElement) {
                var queueName = (options === undefined) ? "" : options;

                if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                  return true;
                }

                /* Skip any calls that have never been paused */
                if (!activeCall[5]) {
                  return true;
                }

                /* Iterate through the calls targeted by the stop command. */
                $.each(elements, function(l, element) {
                  /* Check that this call was applied to the target element. */
                  if (element === activeElement) {

                    /* Flag a pause object to be resumed, which will occur during the next tick. In
										 addition, the pause object will at that time be deleted */
                    activeCall[5].resume = true;

                    /* Once we match an element, we can bounce out to the next call entirely */
                    found = true;
                    return false;
                  }
                });

                /* Proceed to check next call if we have already matched */
                if (found) {
                  return false;
                }
              });
            }

          });

          /* Since resume creates no new tweens, exit out of Velocity. */
          return getChain();

        case "finish":
        case "finishAll":
        case "stop":
          /*******************
           Action: Stop
           *******************/

          /* Clear the currently-active delay on each targeted element. */
          $.each(elements, function(i, element) {
            if (Data(element) && Data(element).delayTimer) {
              /* Stop the timer from triggering its cached next() function. */
              clearTimeout(Data(element).delayTimer.setTimeout);

              /* Manually call the next() function so that the subsequent queue items can progress. */
              if (Data(element).delayTimer.next) {
                Data(element).delayTimer.next();
              }

              delete Data(element).delayTimer;
            }

            /* If we want to finish everything in the queue, we have to iterate through it
						 and call each function. This will make them active calls below, which will
						 cause them to be applied via the duration setting. */
            if (propertiesMap === "finishAll" && (options === true || Type.isString(options))) {
              /* Iterate through the items in the element's queue. */
              $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                /* The queue array can contain an "inprogress" string, which we skip. */
                if (Type.isFunction(item)) {
                  item();
                }
              });

              /* Clearing the $.queue() array is achieved by resetting it to []. */
              $.queue(element, Type.isString(options) ? options : "", []);
            }
          });

          var callsToStop = [];

          /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
					 been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
					 is stopped, the next item in its animation queue is immediately triggered. */
          /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
					 or a custom queue string can be passed in. */
          /* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
					 regardless of the element's current queue state. */

          /* Iterate through every active call. */
          $.each(Velocity.State.calls, function(i, activeCall) {
            /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
            if (activeCall) {
              /* Iterate through the active call's targeted elements. */
              $.each(activeCall[1], function(k, activeElement) {
                /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
								 clear calls associated with the relevant queue. */
                /* Call stopping logic works as follows:
								 - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
								 - options === undefined --> stop current queue:"" call and all queue:false calls.
								 - options === false --> stop only queue:false calls.
								 - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
                var queueName = (options === undefined) ? "" : options;

                if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                  return true;
                }

                /* Iterate through the calls targeted by the stop command. */
                $.each(elements, function(l, element) {
                  /* Check that this call was applied to the target element. */
                  if (element === activeElement) {
                    /* Optionally clear the remaining queued calls. If we're doing "finishAll" this won't find anything,
										 due to the queue-clearing above. */
                    if (options === true || Type.isString(options)) {
                      /* Iterate through the items in the element's queue. */
                      $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                        /* The queue array can contain an "inprogress" string, which we skip. */
                        if (Type.isFunction(item)) {
                          /* Pass the item's callback a flag indicating that we want to abort from the queue call.
													 (Specifically, the queue will resolve the call's associated promise then abort.)  */
                          item(null, true);
                        }
                      });

                      /* Clearing the $.queue() array is achieved by resetting it to []. */
                      $.queue(element, Type.isString(options) ? options : "", []);
                    }

                    if (propertiesMap === "stop") {
                      /* Since "reverse" uses cached start values (the previous call's endValues), these values must be
											 changed to reflect the final value that the elements were actually tweened to. */
                      /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
											 object. Also, queue:false animations can't be reversed. */
                      var data = Data(element);
                      if (data && data.tweensContainer && queueName !== false) {
                        $.each(data.tweensContainer, function(m, activeTween) {
                          activeTween.endValue = activeTween.currentValue;
                        });
                      }

                      callsToStop.push(i);
                    } else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
                      /* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
											 they finish upon the next rAf tick then proceed with normal call completion logic. */
                      activeCall[2].duration = 1;
                    }
                  }
                });
              });
            }
          });

          /* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
					 that the complete callback and display:none setting should be skipped since we're completing prematurely. */
          if (propertiesMap === "stop") {
            $.each(callsToStop, function(i, j) {
              completeCall(j, true);
            });

            if (promiseData.promise) {
              /* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
              promiseData.resolver(elements);
            }
          }

          /* Since we're stopping, and not proceeding with queueing, exit out of Velocity. */
          return getChain();

        default:
          /* Treat a non-empty plain object as a literal properties map. */
          if ($.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
            action = "start";

            /****************
             Redirects
             ****************/

            /* Check if a string matches a registered redirect (see Redirects above). */
          } else if (Type.isString(propertiesMap) && Velocity.Redirects[propertiesMap]) {
            opts = $.extend({}, options);

            var durationOriginal = opts.duration,
                delayOriginal = opts.delay || 0;

            /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
            if (opts.backwards === true) {
              elements = $.extend(true, [], elements).reverse();
            }

            /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
            $.each(elements, function(elementIndex, element) {
              /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
              if (parseFloat(opts.stagger)) {
                opts.delay = delayOriginal + (parseFloat(opts.stagger) * elementIndex);
              } else if (Type.isFunction(opts.stagger)) {
                opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
              }

              /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
							 the duration of each element's animation, using floors to prevent producing very short durations. */
              if (opts.drag) {
                /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
								 B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
								 The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex / elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
              }

              /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
							 reduce the opts checking logic required inside the redirect. */
              Velocity.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
            });

            /* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
						 (The performance overhead up to this point is virtually non-existant.) */
            /* Note: The jQuery call chain is kept intact by returning the complete element set. */
            return getChain();
          } else {
            var abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

            if (promiseData.promise) {
              promiseData.rejecter(new Error(abortError));
            } else if (window.console) {
              console.log(abortError);
            }

            return getChain();
          }
      }

      /**************************
       Call-Wide Variables
       **************************/

      /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
			 being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
			 avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
			 conversion metrics across Velocity animations that are not immediately consecutively chained. */
      var callUnitConversionData = {
        lastParent: null,
        lastPosition: null,
        lastFontSize: null,
        lastPercentToPxWidth: null,
        lastPercentToPxHeight: null,
        lastEmToPx: null,
        remToPx: null,
        vwToPx: null,
        vhToPx: null
      };

      /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
			 Velocity.State.calls array that is processed during animation ticking. */
      var call = [];

      /************************
       Element Processing
       ************************/

      /* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
			 1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
			 2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
			 3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
			 `elementArrayIndex` allows passing index of the element in the original array to value functions.
			 If `elementsIndex` were used instead the index would be determined by the elements' per-element queue.
			 */
      function processElement(element, elementArrayIndex) {

        /*************************
         Part I: Pre-Queueing
         *************************/

        /***************************
         Element-Wide Variables
         ***************************/

        var /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */
            opts = $.extend({}, Velocity.defaults, options),
            /* A container for the processed data associated with each property in the propertyMap.
						 (Each property in the map produces its own "tween".) */
            tweensContainer = {},
            elementUnitConversionData;

        /******************
         Element Init
         ******************/

        if (Data(element) === undefined) {
          Velocity.init(element);
        }

        /******************
         Option: Delay
         ******************/

        /* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
        /* Note: Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay()
				 (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
        if (parseFloat(opts.delay) && opts.queue !== false) {
          $.queue(element, opts.queue, function(next) {
            /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
            Velocity.velocityQueueEntryFlag = true;

            /* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay.
						 The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Velocity's "stop" command, and
						 delayBegin/delayTime is used to ensure we can "pause" and "resume" a tween that is still mid-delay. */

            /* Temporarily store delayed elements to facilite access for global pause/resume */
            var callIndex = Velocity.State.delayedElements.count++;
            Velocity.State.delayedElements[callIndex] = element;

            var delayComplete = (function(index) {
              return function() {
                /* Clear the temporary element */
                Velocity.State.delayedElements[index] = false;

                /* Finally, issue the call */
                next();
              };
            })(callIndex);


            Data(element).delayBegin = (new Date()).getTime();
            Data(element).delay = parseFloat(opts.delay);
            Data(element).delayTimer = {
              setTimeout: setTimeout(next, parseFloat(opts.delay)),
              next: delayComplete
            };
          });
        }

        /*********************
         Option: Duration
         *********************/

        /* Support for jQuery's named durations. */
        switch (opts.duration.toString().toLowerCase()) {
          case "fast":
            opts.duration = 200;
            break;

          case "normal":
            opts.duration = DURATION_DEFAULT;
            break;

          case "slow":
            opts.duration = 600;
            break;

          default:
            /* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
            opts.duration = parseFloat(opts.duration) || 1;
        }

        /************************
         Global Option: Mock
         ************************/

        if (Velocity.mock !== false) {
          /* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
					 Alternatively, a multiplier can be passed in to time remap all delays and durations. */
          if (Velocity.mock === true) {
            opts.duration = opts.delay = 1;
          } else {
            opts.duration *= parseFloat(Velocity.mock) || 1;
            opts.delay *= parseFloat(Velocity.mock) || 1;
          }
        }

        /*******************
         Option: Easing
         *******************/

        opts.easing = getEasing(opts.easing, opts.duration);

        /**********************
         Option: Callbacks
         **********************/

        /* Callbacks must functions. Otherwise, default to null. */
        if (opts.begin && !Type.isFunction(opts.begin)) {
          opts.begin = null;
        }

        if (opts.progress && !Type.isFunction(opts.progress)) {
          opts.progress = null;
        }

        if (opts.complete && !Type.isFunction(opts.complete)) {
          opts.complete = null;
        }

        /*********************************
         Option: Display & Visibility
         *********************************/

        /* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
        /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
        if (opts.display !== undefined && opts.display !== null) {
          opts.display = opts.display.toString().toLowerCase();

          /* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
          if (opts.display === "auto") {
            opts.display = Velocity.CSS.Values.getDisplayType(element);
          }
        }

        if (opts.visibility !== undefined && opts.visibility !== null) {
          opts.visibility = opts.visibility.toString().toLowerCase();
        }

        /**********************
         Option: mobileHA
         **********************/

        /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
				 on animating elements. HA is removed from the element at the completion of its animation. */
        /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
        /* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
        opts.mobileHA = (opts.mobileHA && Velocity.State.isMobile && !Velocity.State.isGingerbread);

        /***********************
         Part II: Queueing
         ***********************/

        /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
				 In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
        /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
				 the call array is pushed to Velocity.State.calls for live processing by the requestAnimationFrame tick. */
        function buildQueue(next) {
          var data, lastTweensContainer;

          /*******************
           Option: Begin
           *******************/

          /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
          if (opts.begin && elementsIndex === 0) {
            /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
            try {
              opts.begin.call(elements, elements);
            } catch (error) {
              setTimeout(function() {
                throw error;
              }, 1);
            }
          }

          /*****************************************
           Tween Data Construction (for Scroll)
           *****************************************/

          /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
          if (action === "scroll") {
            /* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
            var scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
                scrollOffset = parseFloat(opts.offset) || 0,
                scrollPositionCurrent,
                scrollPositionCurrentAlternate,
                scrollPositionEnd;

            /* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
						 as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
            if (opts.container) {
              /* Ensure that either a jQuery object or a raw DOM element was passed in. */
              if (Type.isWrapped(opts.container) || Type.isNode(opts.container)) {
                /* Extract the raw DOM element from the jQuery wrapper. */
                opts.container = opts.container[0] || opts.container;
                /* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
								 (due to the user's natural interaction with the page). */
                scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */

                /* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions
								 -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
								 the scroll container's current scroll position. */
                scrollPositionEnd = (scrollPositionCurrent + $(element).position()[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
                /* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
              } else {
                opts.container = null;
              }
            } else {
              /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
							 the appropriate cached property names (which differ based on browser type). */
              scrollPositionCurrent = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + scrollDirection]]; /* GET */
              /* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
              scrollPositionCurrentAlternate = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */

              /* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
							 and therefore end values do not need to be compounded onto current values. */
              scrollPositionEnd = $(element).offset()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
            }

            /* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
            tweensContainer = {
              scroll: {
                rootPropertyValue: false,
                startValue: scrollPositionCurrent,
                currentValue: scrollPositionCurrent,
                endValue: scrollPositionEnd,
                unitType: "",
                easing: opts.easing,
                scrollData: {
                  container: opts.container,
                  direction: scrollDirection,
                  alternateValue: scrollPositionCurrentAlternate
                }
              },
              element: element
            };

            if (Velocity.debug) {
              console.log("tweensContainer (scroll): ", tweensContainer.scroll, element);
            }

            /******************************************
             Tween Data Construction (for Reverse)
             ******************************************/

            /* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
						 that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
						 the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
            /* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
            /* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
						 there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
						 as reverting to the element's values as they were prior to the previous *Velocity* call. */
          } else if (action === "reverse") {
            data = Data(element);

            /* Abort if there is no prior animation data to reverse to. */
            if (!data) {
              return;
            }

            if (!data.tweensContainer) {
              /* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
              $.dequeue(element, opts.queue);

              return;
            } else {
              /*********************
               Options Parsing
               *********************/

              /* If the element was hidden via the display option in the previous call,
							 revert display to "auto" prior to reversal so that the element is visible again. */
              if (data.opts.display === "none") {
                data.opts.display = "auto";
              }

              if (data.opts.visibility === "hidden") {
                data.opts.visibility = "visible";
              }

              /* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
							 Further, remove the previous call's callback options; typically, users do not want these to be refired. */
              data.opts.loop = false;
              data.opts.begin = null;
              data.opts.complete = null;

              /* Since we're extending an opts object that has already been extended with the defaults options object,
							 we remove non-explicitly-defined properties that are auto-assigned values. */
              if (!options.easing) {
                delete opts.easing;
              }

              if (!options.duration) {
                delete opts.duration;
              }

              /* The opts object used for reversal is an extension of the options object optionally passed into this
							 reverse call plus the options used in the previous Velocity call. */
              opts = $.extend({}, data.opts, opts);

              /*************************************
               Tweens Container Reconstruction
               *************************************/

              /* Create a deepy copy (indicated via the true flag) of the previous call's tweensContainer. */
              lastTweensContainer = $.extend(true, {}, data ? data.tweensContainer : null);

              /* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
              for (var lastTween in lastTweensContainer) {
                /* In addition to tween data, tweensContainers contain an element property that we ignore here. */
                if (lastTweensContainer.hasOwnProperty(lastTween) && lastTween !== "element") {
                  var lastStartValue = lastTweensContainer[lastTween].startValue;

                  lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
                  lastTweensContainer[lastTween].endValue = lastStartValue;

                  /* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
									 Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
									 The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
                  if (!Type.isEmptyObject(options)) {
                    lastTweensContainer[lastTween].easing = opts.easing;
                  }

                  if (Velocity.debug) {
                    console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
                  }
                }
              }

              tweensContainer = lastTweensContainer;
            }

            /*****************************************
             Tween Data Construction (for Start)
             *****************************************/

          } else if (action === "start") {

            /*************************
             Value Transferring
             *************************/

            /* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
						 while the element was in the process of being animated by Velocity, then this current call is safe to use
						 the end values from the prior call as its start values. Velocity attempts to perform this value transfer
						 process whenever possible in order to avoid requerying the DOM. */
            /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
						 then the DOM is queried for the element's current values as a last resort. */
            /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */

            data = Data(element);

            /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
						 to transfer over end values to use as start values. If it's set to true and there is a previous
						 Velocity call to pull values from, do so. */
            if (data && data.tweensContainer && data.isAnimating === true) {
              lastTweensContainer = data.tweensContainer;
            }

            /***************************
             Tween Data Calculation
             ***************************/

            /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
            /* Property map values can either take the form of 1) a single value representing the end value,
						 or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
						 The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
						 the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
            var parsePropertyValue = function(valueData, skipResolvingEasing) {
              var endValue, easing, startValue;

              /* If we have a function as the main argument then resolve it first, in case it returns an array that needs to be split */
              if (Type.isFunction(valueData)) {
                valueData = valueData.call(element, elementArrayIndex, elementsLength);
              }

              /* Handle the array format, which can be structured as one of three potential overloads:
							 A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
              if (Type.isArray(valueData)) {
                /* endValue is always the first item in the array. Don't bother validating endValue's value now
								 since the ensuing property cycling logic does that. */
                endValue = valueData[0];

                /* Two-item array format: If the second item is a number, function, or hex string, treat it as a
								 start value since easings can only be non-hex strings or arrays. */
                if ((!Type.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || Type.isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
                  startValue = valueData[1];
                  /* Two or three-item array: If the second item is a non-hex string easing name or an array, treat it as an easing. */
                } else if ((Type.isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1]) && Velocity.Easings[valueData[1]]) || Type.isArray(valueData[1])) {
                  easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

                  /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                  startValue = valueData[2];
                } else {
                  startValue = valueData[1] || valueData[2];
                }
                /* Handle the single-value format. */
              } else {
                endValue = valueData;
              }

              /* Default to the call's easing if a per-property easing type was not defined. */
              if (!skipResolvingEasing) {
                easing = easing || opts.easing;
              }

              /* If functions were passed in as values, pass the function the current element as its context,
							 plus the element's index and the element set's size as arguments. Then, assign the returned value. */
              if (Type.isFunction(endValue)) {
                endValue = endValue.call(element, elementArrayIndex, elementsLength);
              }

              if (Type.isFunction(startValue)) {
                startValue = startValue.call(element, elementArrayIndex, elementsLength);
              }

              /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
              return [endValue || 0, easing, startValue];
            };

            var fixPropertyValue = function(property, valueData) {
              /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
              var rootProperty = CSS.Hooks.getRoot(property),
                  rootPropertyValue = false,
                  /* Parse out endValue, easing, and startValue from the property's data. */
                  endValue = valueData[0],
                  easing = valueData[1],
                  startValue = valueData[2],
                  pattern;

              /**************************
               Start Value Sourcing
               **************************/

              /* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
							 inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
							 Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
              /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
							 there is no way to check for their explicit browser support, and so we skip skip this check for them. */
              if ((!data || !data.isSVG) && rootProperty !== "tween" && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                if (Velocity.debug) {
                  console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");
                }
                return;
              }

              /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
							 animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
							 a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
              if (((opts.display !== undefined && opts.display !== null && opts.display !== "none") || (opts.visibility !== undefined && opts.visibility !== "hidden")) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                startValue = 0;
              }

              /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
							 for all of the current call's properties that were *also* animated in the previous call. */
              /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
              if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                if (startValue === undefined) {
                  startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                }

                /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
								 instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
								 attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                rootPropertyValue = data.rootPropertyValueCache[rootProperty];
                /* If values were not transferred from a previous Velocity call, query the DOM as needed. */
              } else {
                /* Handle hooked properties. */
                if (CSS.Hooks.registered[property]) {
                  if (startValue === undefined) {
                    rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
                    /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
										 getPropertyValue() will extract the hook from rootPropertyValue. */
                    startValue = CSS.getPropertyValue(element, property, rootPropertyValue);
                    /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
										 just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
										 root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
										 to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
                  } else {
                    /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                  }
                  /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
                } else if (startValue === undefined) {
                  startValue = CSS.getPropertyValue(element, property); /* GET */
                }
              }

              /**************************
               Value Data Extraction
               **************************/

              var separatedValue,
                  endValueUnitType,
                  startValueUnitType,
                  operator = false;

              /* Separates a property value into its numeric value and its unit type. */
              var separateValue = function(property, value) {
                var unitType,
                    numericValue;

                numericValue = (value || "0")
                  .toString()
                  .toLowerCase()
                  /* Match the unit type at the end of the value. */
                  .replace(/[%A-z]+$/, function(match) {
                    /* Grab the unit type. */
                    unitType = match;

                    /* Strip the unit type off of value. */
                    return "";
                  });

                /* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
                if (!unitType) {
                  unitType = CSS.Values.getUnitType(property);
                }

                return [numericValue, unitType];
              };

              if (startValue !== endValue && Type.isString(startValue) && Type.isString(endValue)) {
                pattern = "";
                var iStart = 0, // index in startValue
                    iEnd = 0, // index in endValue
                    aStart = [], // array of startValue numbers
                    aEnd = [], // array of endValue numbers
                    inCalc = 0, // Keep track of being inside a "calc()" so we don't duplicate it
                    inRGB = 0, // Keep track of being inside an RGB as we can't use fractional values
                    inRGBA = 0; // Keep track of being inside an RGBA as we must pass fractional for the alpha channel

                startValue = CSS.Hooks.fixColors(startValue);
                endValue = CSS.Hooks.fixColors(endValue);
                while (iStart < startValue.length && iEnd < endValue.length) {
                  var cStart = startValue[iStart],
                      cEnd = endValue[iEnd];

                  if (/[\d\.-]/.test(cStart) && /[\d\.-]/.test(cEnd)) {
                    var tStart = cStart, // temporary character buffer
                        tEnd = cEnd, // temporary character buffer
                        dotStart = ".", // Make sure we can only ever match a single dot in a decimal
                        dotEnd = "."; // Make sure we can only ever match a single dot in a decimal

                    while (++iStart < startValue.length) {
                      cStart = startValue[iStart];
                      if (cStart === dotStart) {
                        dotStart = ".."; // Can never match two characters
                      } else if (!/\d/.test(cStart)) {
                        break;
                      }
                      tStart += cStart;
                    }
                    while (++iEnd < endValue.length) {
                      cEnd = endValue[iEnd];
                      if (cEnd === dotEnd) {
                        dotEnd = ".."; // Can never match two characters
                      } else if (!/\d/.test(cEnd)) {
                        break;
                      }
                      tEnd += cEnd;
                    }
                    var uStart = CSS.Hooks.getUnit(startValue, iStart), // temporary unit type
                        uEnd = CSS.Hooks.getUnit(endValue, iEnd); // temporary unit type

                    iStart += uStart.length;
                    iEnd += uEnd.length;
                    if (uStart === uEnd) {
                      // Same units
                      if (tStart === tEnd) {
                        // Same numbers, so just copy over
                        pattern += tStart + uStart;
                      } else {
                        // Different numbers, so store them
                        pattern += "{" + aStart.length + (inRGB ? "!" : "") + "}" + uStart;
                        aStart.push(parseFloat(tStart));
                        aEnd.push(parseFloat(tEnd));
                      }
                    } else {
                      // Different units, so put into a "calc(from + to)" and animate each side to/from zero
                      var nStart = parseFloat(tStart),
                          nEnd = parseFloat(tEnd);

                      pattern += (inCalc < 5 ? "calc" : "") + "("
                        + (nStart ? "{" + aStart.length + (inRGB ? "!" : "") + "}" : "0") + uStart
                        + " + "
                        + (nEnd ? "{" + (aStart.length + (nStart ? 1 : 0)) + (inRGB ? "!" : "") + "}" : "0") + uEnd
                        + ")";
                      if (nStart) {
                        aStart.push(nStart);
                        aEnd.push(0);
                      }
                      if (nEnd) {
                        aStart.push(0);
                        aEnd.push(nEnd);
                      }
                    }
                  } else if (cStart === cEnd) {
                    pattern += cStart;
                    iStart++;
                    iEnd++;
                    // Keep track of being inside a calc()
                    if (inCalc === 0 && cStart === "c"
                      || inCalc === 1 && cStart === "a"
                      || inCalc === 2 && cStart === "l"
                      || inCalc === 3 && cStart === "c"
                      || inCalc >= 4 && cStart === "("
                    ) {
                      inCalc++;
                    } else if ((inCalc && inCalc < 5)
                      || inCalc >= 4 && cStart === ")" && --inCalc < 5) {
                      inCalc = 0;
                    }
                    // Keep track of being inside an rgb() / rgba()
                    if (inRGB === 0 && cStart === "r"
                      || inRGB === 1 && cStart === "g"
                      || inRGB === 2 && cStart === "b"
                      || inRGB === 3 && cStart === "a"
                      || inRGB >= 3 && cStart === "("
                    ) {
                      if (inRGB === 3 && cStart === "a") {
                        inRGBA = 1;
                      }
                      inRGB++;
                    } else if (inRGBA && cStart === ",") {
                      if (++inRGBA > 3) {
                        inRGB = inRGBA = 0;
                      }
                    } else if ((inRGBA && inRGB < (inRGBA ? 5 : 4))
                      || inRGB >= (inRGBA ? 4 : 3) && cStart === ")" && --inRGB < (inRGBA ? 5 : 4)) {
                      inRGB = inRGBA = 0;
                    }
                  } else {
                    inCalc = 0;
                    // TODO: changing units, fixing colours
                    break;
                  }
                }
                if (iStart !== startValue.length || iEnd !== endValue.length) {
                  if (Velocity.debug) {
                    console.error("Trying to pattern match mis-matched strings [\"" + endValue + "\", \"" + startValue + "\"]");
                  }
                  pattern = undefined;
                }
                if (pattern) {
                  if (aStart.length) {
                    if (Velocity.debug) {
                      console.log("Pattern found \"" + pattern + "\" -> ", aStart, aEnd, "[" + startValue + "," + endValue + "]");
                    }
                    startValue = aStart;
                    endValue = aEnd;
                    endValueUnitType = startValueUnitType = "";
                  } else {
                    pattern = undefined;
                  }
                }
              }

              if (!pattern) {
                /* Separate startValue. */
                separatedValue = separateValue(property, startValue);
                startValue = separatedValue[0];
                startValueUnitType = separatedValue[1];

                /* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
                separatedValue = separateValue(property, endValue);
                endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
                  operator = subMatch;

                  /* Strip the operator off of the value. */
                  return "";
                });
                endValueUnitType = separatedValue[1];

                /* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
                startValue = parseFloat(startValue) || 0;
                endValue = parseFloat(endValue) || 0;

                /***************************************
                 Property-Specific Value Conversion
                 ***************************************/

                /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
                if (endValueUnitType === "%") {
                  /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
									 which is identical to the em unit's behavior, so we piggyback off of that. */
                  if (/^(fontSize|lineHeight)$/.test(property)) {
                    /* Convert % into an em decimal value. */
                    endValue = endValue / 100;
                    endValueUnitType = "em";
                    /* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
                  } else if (/^scale/.test(property)) {
                    endValue = endValue / 100;
                    endValueUnitType = "";
                    /* For RGB components, take the defined percentage of 255 and strip off the unit type. */
                  } else if (/(Red|Green|Blue)$/i.test(property)) {
                    endValue = (endValue / 100) * 255;
                    endValueUnitType = "";
                  }
                }
              }

              /***************************
               Unit Ratio Calculation
               ***************************/

              /* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
							 %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
							 for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
							 from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
							 1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
							 2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
              /* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
							 setting values with the target unit type then comparing the returned pixel value. */
              /* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
							 of batching the SETs and GETs together upfront outweights the potential overhead
							 of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
              /* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
              var calculateUnitRatios = function() {

                /************************
                 Same Ratio Checks
                 ************************/

                /* The properties below are used to determine whether the element differs sufficiently from this call's
								 previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
								 of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
								 this is done to minimize DOM querying. */
                var sameRatioIndicators = {
                      myParent: element.parentNode || document.body, /* GET */
                      position: CSS.getPropertyValue(element, "position"), /* GET */
                      fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
                    },
                    /* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
                    samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
                    /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                    sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);

                /* Store these ratio indicators call-wide for the next element to compare against. */
                callUnitConversionData.lastParent = sameRatioIndicators.myParent;
                callUnitConversionData.lastPosition = sameRatioIndicators.position;
                callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;

                /***************************
                 Element-Specific Units
                 ***************************/

                /* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
								 of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
                var measurement = 100,
                    unitRatios = {};

                if (!sameEmRatio || !samePercentRatio) {
                  var dummy = data && data.isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");

                  Velocity.init(dummy);
                  sameRatioIndicators.myParent.appendChild(dummy);

                  /* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
									 Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
                  /* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
                  $.each(["overflow", "overflowX", "overflowY"], function(i, property) {
                    Velocity.CSS.setPropertyValue(dummy, property, "hidden");
                  });
                  Velocity.CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
                  Velocity.CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
                  Velocity.CSS.setPropertyValue(dummy, "boxSizing", "content-box");

                  /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
                  $.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(i, property) {
                    Velocity.CSS.setPropertyValue(dummy, property, measurement + "%");
                  });
                  /* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
                  Velocity.CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");

                  /* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
                  unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
                  unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
                  unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */

                  sameRatioIndicators.myParent.removeChild(dummy);
                } else {
                  unitRatios.emToPx = callUnitConversionData.lastEmToPx;
                  unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
                  unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
                }

                /***************************
                 Element-Agnostic Units
                 ***************************/

                /* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
								 once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
								 that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
								 so we calculate it now. */
                if (callUnitConversionData.remToPx === null) {
                  /* Default to browsers' default fontSize of 16px in the case of 0. */
                  callUnitConversionData.remToPx = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                }

                /* Similarly, viewport units are %-relative to the window's inner dimensions. */
                if (callUnitConversionData.vwToPx === null) {
                  callUnitConversionData.vwToPx = parseFloat(window.innerWidth) / 100; /* GET */
                  callUnitConversionData.vhToPx = parseFloat(window.innerHeight) / 100; /* GET */
                }

                unitRatios.remToPx = callUnitConversionData.remToPx;
                unitRatios.vwToPx = callUnitConversionData.vwToPx;
                unitRatios.vhToPx = callUnitConversionData.vhToPx;

                if (Velocity.debug >= 1) {
                  console.log("Unit ratios: " + JSON.stringify(unitRatios), element);
                }
                return unitRatios;
              };

              /********************
               Unit Conversion
               ********************/

              /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
              if (/[\/*]/.test(operator)) {
                endValueUnitType = startValueUnitType;
                /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
								 is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
								 on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
								 would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitType. */
              } else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
                /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
                /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
								 match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
								 which remains past the point of the animation's completion. */
                if (endValue === 0) {
                  endValueUnitType = startValueUnitType;
                } else {
                  /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
									 If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                  elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();

                  /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                  /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
                  var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";

                  /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
									 1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                  switch (startValueUnitType) {
                    case "%":
                      /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
											 Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
											 to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                      startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                      break;

                    case "px":
                      /* px acts as our midpoint in the unit conversion process; do nothing. */
                      break;

                    default:
                      startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
                  }

                  /* Invert the px ratios to convert into to the target unit. */
                  switch (endValueUnitType) {
                    case "%":
                      startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                      break;

                    case "px":
                      /* startValue is already in px, do nothing; we're done. */
                      break;

                    default:
                      startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
                  }
                }
              }

              /*********************
               Relative Values
               *********************/

              /* Operator logic must be performed last since it requires unit-normalized start and end values. */
              /* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
							 to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
							 50 points is added on top of the current % value. */
              switch (operator) {
                case "+":
                  endValue = startValue + endValue;
                  break;

                case "-":
                  endValue = startValue - endValue;
                  break;

                case "*":
                  endValue = startValue * endValue;
                  break;

                case "/":
                  endValue = startValue / endValue;
                  break;
              }

              /**************************
               tweensContainer Push
               **************************/

              /* Construct the per-property tween object, and push it to the element's tweensContainer. */
              tweensContainer[property] = {
                rootPropertyValue: rootPropertyValue,
                startValue: startValue,
                currentValue: startValue,
                endValue: endValue,
                unitType: endValueUnitType,
                easing: easing
              };
              if (pattern) {
                tweensContainer[property].pattern = pattern;
              }

              if (Velocity.debug) {
                console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
              }
            };

            /* Create a tween out of each property, and append its associated data to tweensContainer. */
            for (var property in propertiesMap) {

              if (!propertiesMap.hasOwnProperty(property)) {
                continue;
              }
              /* The original property name's format must be used for the parsePropertyValue() lookup,
							 but we then use its camelCase styling to normalize it for manipulation. */
              var propertyName = CSS.Names.camelCase(property),
                  valueData = parsePropertyValue(propertiesMap[property]);

              /* Find shorthand color properties that have been passed a hex string. */
              /* Would be quicker to use CSS.Lists.colors.includes() if possible */
              if (_inArray(CSS.Lists.colors, propertyName)) {
                /* Parse the value data for each shorthand. */
                var endValue = valueData[0],
                    easing = valueData[1],
                    startValue = valueData[2];

                if (CSS.RegEx.isHex.test(endValue)) {
                  /* Convert the hex strings into their RGB component arrays. */
                  var colorComponents = ["Red", "Green", "Blue"],
                      endValueRGB = CSS.Values.hexToRgb(endValue),
                      startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;

                  /* Inject the RGB component tweens into propertiesMap. */
                  for (var i = 0; i < colorComponents.length; i++) {
                    var dataArray = [endValueRGB[i]];

                    if (easing) {
                      dataArray.push(easing);
                    }

                    if (startValueRGB !== undefined) {
                      dataArray.push(startValueRGB[i]);
                    }

                    fixPropertyValue(propertyName + colorComponents[i], dataArray);
                  }
                  /* If we have replaced a shortcut color value then don't update the standard property name */
                  continue;
                }
              }
              fixPropertyValue(propertyName, valueData);
            }

            /* Along with its property data, store a reference to the element itself onto tweensContainer. */
            tweensContainer.element = element;
          }

          /*****************
           Call Push
           *****************/

          /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
					 being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
          if (tweensContainer.element) {
            /* Apply the "velocity-animating" indicator class. */
            CSS.Values.addClass(element, "velocity-animating");

            /* The call array houses the tweensContainers for each element being animated in the current call. */
            call.push(tweensContainer);

            data = Data(element);

            if (data) {
              /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
              if (opts.queue === "") {

                data.tweensContainer = tweensContainer;
                data.opts = opts;
              }

              /* Switch on the element's animating flag. */
              data.isAnimating = true;
            }

            /* Once the final element in this call's element set has been processed, push the call array onto
						 Velocity.State.calls for the animation tick to immediately begin processing. */
            if (elementsIndex === elementsLength - 1) {
              /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
							 Anything on this call container is subjected to tick() processing. */
              Velocity.State.calls.push([call, elements, opts, null, promiseData.resolver, null, 0]);

              /* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
              if (Velocity.State.isTicking === false) {
                Velocity.State.isTicking = true;

                /* Start the tick loop. */
                tick();
              }
            } else {
              elementsIndex++;
            }
          }
        }

        /* When the queue option is set to false, the call skips the element's queue and fires immediately. */
        if (opts.queue === false) {
          /* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
					 we manually inject the delay property here with an explicit setTimeout. */
          if (opts.delay) {

            /* Temporarily store delayed elements to facilitate access for global pause/resume */
            var callIndex = Velocity.State.delayedElements.count++;
            Velocity.State.delayedElements[callIndex] = element;

            var delayComplete = (function(index) {
              return function() {
                /* Clear the temporary element */
                Velocity.State.delayedElements[index] = false;

                /* Finally, issue the call */
                buildQueue();
              };
            })(callIndex);

            Data(element).delayBegin = (new Date()).getTime();
            Data(element).delay = parseFloat(opts.delay);
            Data(element).delayTimer = {
              setTimeout: setTimeout(buildQueue, parseFloat(opts.delay)),
              next: delayComplete
            };
          } else {
            buildQueue();
          }
          /* Otherwise, the call undergoes element queueing as normal. */
          /* Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic. */
        } else {
          $.queue(element, opts.queue, function(next, clearQueue) {
            /* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
						 so it's fine if this is repeatedly triggered for each element in the associated call.) */
            if (clearQueue === true) {
              if (promiseData.promise) {
                promiseData.resolver(elements);
              }

              /* Do not continue with animation queueing. */
              return true;
            }

            /* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Velocity.
						 See completeCall() for further details. */
            Velocity.velocityQueueEntryFlag = true;

            buildQueue(next);
          });
        }

        /*********************
         Auto-Dequeuing
         *********************/

        /* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element
				 must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
				 for the "inprogress" item that jQuery prepends to active queue stack arrays.) Regardless, whenever the element's
				 queue is further appended with additional items -- including $.delay()'s or even $.animate() calls, the queue's
				 first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
        /* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until
				 each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
        /* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function.
				 Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
        if ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress") {
          $.dequeue(element);
        }
      }

      /**************************
       Element Set Iteration
       **************************/

      /* If the "nodeType" property exists on the elements variable, we're animating a single element.
			 Place it in an array so that $.each() can iterate over it. */
      $.each(elements, function(i, element) {
        /* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
        if (Type.isNode(element)) {
          processElement(element, i);
        }
      });

      /******************
       Option: Loop
       ******************/

      /* The loop option accepts an integer indicating how many times the element should loop between the values in the
			 current call's properties map and the element's property values prior to this call. */
      /* Note: The loop option's logic is performed here -- after element processing -- because the current call needs
			 to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
			 which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
      opts = $.extend({}, Velocity.defaults, options);
      opts.loop = parseInt(opts.loop, 10);
      var reverseCallsCount = (opts.loop * 2) - 1;

      if (opts.loop) {
        /* Double the loop count to convert it into its appropriate number of "reverse" calls.
				 Subtract 1 from the resulting value since the current call is included in the total alternation count. */
        for (var x = 0; x < reverseCallsCount; x++) {
          /* Since the logic for the reverse action occurs inside Queueing and therefore this call's options object
					 isn't parsed until then as well, the current call's delay option must be explicitly passed into the reverse
					 call so that the delay logic that occurs inside *Pre-Queueing* can process it. */
          var reverseOptions = {
            delay: opts.delay,
            progress: opts.progress
          };

          /* If a complete callback was passed into this call, transfer it to the loop redirect's final "reverse" call
					 so that it's triggered when the entire redirect is complete (and not when the very first animation is complete). */
          if (x === reverseCallsCount - 1) {
            reverseOptions.display = opts.display;
            reverseOptions.visibility = opts.visibility;
            reverseOptions.complete = opts.complete;
          }

          animate(elements, "reverse", reverseOptions);
        }
      }

      /***************
       Chaining
       ***************/

      /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
      return getChain();
    };

    /* Turn Velocity into the animation function, extended with the pre-existing Velocity object. */
    Velocity = $.extend(animate, Velocity);
    /* For legacy support, also expose the literal animate method. */
    Velocity.animate = animate;

    /**************
     Timing
     **************/

    /* Ticker function. */
    var ticker = window.requestAnimationFrame || rAFShim;

    /* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
		 To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
		 devices to avoid wasting battery power on inactive tabs. */
    /* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
    if (!Velocity.State.isMobile && document.hidden !== undefined) {
      var updateTicker = function() {
        /* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
        if (document.hidden) {
          ticker = function(callback) {
            /* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
            return setTimeout(function() {
              callback(true);
            }, 16);
          };

          /* The rAF loop has been paused by the browser, so we manually restart the tick. */
          tick();
        } else {
          ticker = window.requestAnimationFrame || rAFShim;
        }
      };

      /* Page could be sitting in the background at this time (i.e. opened as new tab) so making sure we use correct ticker from the start */
      updateTicker();

      /* And then run check again every time visibility changes */
      document.addEventListener("visibilitychange", updateTicker);
    }

    /************
     Tick
     ************/

    /* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
    function tick(timestamp) {
      /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
			 We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
			 the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
			 calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
			 the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
			 by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
      if (timestamp) {
        /* We normally use RAF's high resolution timestamp but as it can be significantly offset when the browser is
				 under high stress we give the option for choppiness over allowing the browser to drop huge chunks of frames.
				 We use performance.now() and shim it if it doesn't exist for when the tab is hidden. */
        var timeCurrent = Velocity.timestamp && timestamp !== true ? timestamp : performance.now();

        /********************
         Call Iteration
         ********************/

        var callsLength = Velocity.State.calls.length;

        /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
				 when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
				 has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears Velocity.State.calls. */
        if (callsLength > 10000) {
          Velocity.State.calls = compactSparseArray(Velocity.State.calls);
          callsLength = Velocity.State.calls.length;
        }

        /* Iterate through each active call. */
        for (var i = 0; i < callsLength; i++) {
          /* When a Velocity call is completed, its Velocity.State.calls entry is set to false. Continue on to the next call. */
          if (!Velocity.State.calls[i]) {
            continue;
          }

          /************************
           Call-Wide Variables
           ************************/

          var callContainer = Velocity.State.calls[i],
              call = callContainer[0],
              opts = callContainer[2],
              timeStart = callContainer[3],
              firstTick = !!timeStart,
              tweenDummyValue = null,
              pauseObject = callContainer[5],
              millisecondsEllapsed = callContainer[6];



          /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
					 We assign timeStart now so that its value is as close to the real animation start time as possible.
					 (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
					 between that time and now would cause the first few frames of the tween to be skipped since
					 percentComplete is calculated relative to timeStart.) */
          /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
					 first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
					 same style value as the element's current value. */
          if (!timeStart) {
            timeStart = Velocity.State.calls[i][3] = timeCurrent - 16;
          }

          /* If a pause object is present, skip processing unless it has been set to resume */
          if (pauseObject) {
            if (pauseObject.resume === true) {
              /* Update the time start to accomodate the paused completion amount */
              timeStart = callContainer[3] = Math.round(timeCurrent - millisecondsEllapsed - 16);

              /* Remove pause object after processing */
              callContainer[5] = null;
            } else {
              continue;
            }
          }

          millisecondsEllapsed = callContainer[6] = timeCurrent - timeStart;

          /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
					 (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
					 Accordingly, we ensure that percentComplete does not exceed 1. */
          var percentComplete = Math.min((millisecondsEllapsed) / opts.duration, 1);

          /**********************
           Element Iteration
           **********************/

          /* For every call, iterate through each of the elements in its set. */
          for (var j = 0, callLength = call.length; j < callLength; j++) {
            var tweensContainer = call[j],
                element = tweensContainer.element;

            /* Check to see if this element has been deleted midway through the animation by checking for the
						 continued existence of its data cache. If it's gone, or the element is currently paused, skip animating this element. */
            if (!Data(element)) {
              continue;
            }

            var transformPropertyExists = false;

            /**********************************
             Display & Visibility Toggling
             **********************************/

            /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
						 (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
            if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
              if (opts.display === "flex") {
                var flexValues = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];

                $.each(flexValues, function(i, flexValue) {
                  CSS.setPropertyValue(element, "display", flexValue);
                });
              }

              CSS.setPropertyValue(element, "display", opts.display);
            }

            /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
            if (opts.visibility !== undefined && opts.visibility !== "hidden") {
              CSS.setPropertyValue(element, "visibility", opts.visibility);
            }

            /************************
             Property Iteration
             ************************/

            /* For every element, iterate through each property. */
            for (var property in tweensContainer) {
              /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
              if (tweensContainer.hasOwnProperty(property) && property !== "element") {
                var tween = tweensContainer[property],
                    currentValue,
                    /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
										 on the Velocity.Easings object. In either case, return the appropriate easing *function*. */
                    easing = Type.isString(tween.easing) ? Velocity.Easings[tween.easing] : tween.easing;

                /******************************
                 Current Value Calculation
                 ******************************/

                if (Type.isString(tween.pattern)) {
                  var patternReplace = percentComplete === 1 ?
                    function($0, index, round) {
                      var result = tween.endValue[index];

                      return round ? Math.round(result) : result;
                    } :
                    function($0, index, round) {
                      var startValue = tween.startValue[index],
                          tweenDelta = tween.endValue[index] - startValue,
                          result = startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

                      return round ? Math.round(result) : result;
                    };

                  currentValue = tween.pattern.replace(/{(\d+)(!)?}/g, patternReplace);
                } else if (percentComplete === 1) {
                  /* If this is the last tick pass (if we've reached 100% completion for this tween),
									 ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                  currentValue = tween.endValue;
                } else {
                  /* Otherwise, calculate currentValue based on the current delta from startValue. */
                  var tweenDelta = tween.endValue - tween.startValue;

                  currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));
                  /* If no value change is occurring, don't proceed with DOM updating. */
                }
                if (!firstTick && (currentValue === tween.currentValue)) {
                  continue;
                }

                tween.currentValue = currentValue;

                /* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
								 it can be passed into the progress callback. */
                if (property === "tween") {
                  tweenDummyValue = currentValue;
                } else {
                  /******************
                   Hooks: Part I
                   ******************/
                  var hookRoot;

                  /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
									 for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
									 rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
									 updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
									 subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                  if (CSS.Hooks.registered[property]) {
                    hookRoot = CSS.Hooks.getRoot(property);

                    var rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

                    if (rootPropertyValueCache) {
                      tween.rootPropertyValue = rootPropertyValueCache;
                    }
                  }

                  /*****************
                   DOM Update
                   *****************/

                  /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                  /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                  var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                    property,
                    tween.currentValue + (IE < 9 && parseFloat(currentValue) === 0 ? "" : tween.unitType),
                    tween.rootPropertyValue,
                    tween.scrollData);

                  /*******************
                   Hooks: Part II
                   *******************/

                  /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                  if (CSS.Hooks.registered[property]) {
                    /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                    if (CSS.Normalizations.registered[hookRoot]) {
                      Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                    } else {
                      Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                    }
                  }

                  /***************
                   Transforms
                   ***************/

                  /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
                  if (adjustedSetData[0] === "transform") {
                    transformPropertyExists = true;
                  }

                }
              }
            }

            /****************
             mobileHA
             ****************/

            /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
						 It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
            if (opts.mobileHA) {
              /* Don't set the null transform hack if we've already done so. */
              if (Data(element).transformCache.translate3d === undefined) {
                /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

                transformPropertyExists = true;
              }
            }

            if (transformPropertyExists) {
              CSS.flushTransformCache(element);
            }
          }

          /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
					 Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
          if (opts.display !== undefined && opts.display !== "none") {
            Velocity.State.calls[i][2].display = false;
          }
          if (opts.visibility !== undefined && opts.visibility !== "hidden") {
            Velocity.State.calls[i][2].visibility = false;
          }

          /* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
          if (opts.progress) {
            opts.progress.call(callContainer[1],
              callContainer[1],
              percentComplete,
              Math.max(0, (timeStart + opts.duration) - timeCurrent),
              timeStart,
              tweenDummyValue);
          }

          /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
          if (percentComplete === 1) {
            completeCall(i);
          }
        }
      }

      /* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
      if (Velocity.State.isTicking) {
        ticker(tick);
      }
    }

    /**********************
     Call Completion
     **********************/

    /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
    function completeCall(callIndex, isStopped) {
      /* Ensure the call exists. */
      if (!Velocity.State.calls[callIndex]) {
        return false;
      }

      /* Pull the metadata from the call. */
      var call = Velocity.State.calls[callIndex][0],
          elements = Velocity.State.calls[callIndex][1],
          opts = Velocity.State.calls[callIndex][2],
          resolver = Velocity.State.calls[callIndex][4];

      var remainingCallsExist = false;

      /*************************
       Element Finalization
       *************************/

      for (var i = 0, callLength = call.length; i < callLength; i++) {
        var element = call[i].element;

        /* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
        /* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
        /* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
        if (!isStopped && !opts.loop) {
          if (opts.display === "none") {
            CSS.setPropertyValue(element, "display", opts.display);
          }

          if (opts.visibility === "hidden") {
            CSS.setPropertyValue(element, "visibility", opts.visibility);
          }
        }

        /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
				 a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
				 an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
				 we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
				 is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
        var data = Data(element);

        if (opts.loop !== true && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
          /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
          if (data) {
            data.isAnimating = false;
            /* Clear the element's rootPropertyValueCache, which will become stale. */
            data.rootPropertyValueCache = {};

            var transformHAPropertyExists = false;
            /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
            $.each(CSS.Lists.transforms3D, function(i, transformName) {
              var defaultValue = /^scale/.test(transformName) ? 1 : 0,
                  currentValue = data.transformCache[transformName];

              if (data.transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                transformHAPropertyExists = true;

                delete data.transformCache[transformName];
              }
            });

            /* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
            if (opts.mobileHA) {
              transformHAPropertyExists = true;
              delete data.transformCache.translate3d;
            }

            /* Flush the subproperty removals to the DOM. */
            if (transformHAPropertyExists) {
              CSS.flushTransformCache(element);
            }

            /* Remove the "velocity-animating" indicator class. */
            CSS.Values.removeClass(element, "velocity-animating");
          }
        }

        /*********************
         Option: Complete
         *********************/

        /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
        /* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
        if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
          /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
          try {
            opts.complete.call(elements, elements);
          } catch (error) {
            setTimeout(function() {
              throw error;
            }, 1);
          }
        }

        /**********************
         Promise Resolving
         **********************/

        /* Note: Infinite loops don't return promises. */
        if (resolver && opts.loop !== true) {
          resolver(elements);
        }

        /****************************
         Option: Loop (Infinite)
         ****************************/

        if (data && opts.loop === true && !isStopped) {
          /* If a rotateX/Y/Z property is being animated by 360 deg with loop:true, swap tween start/end values to enable
					 continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
          $.each(data.tweensContainer, function(propertyName, tweenContainer) {
            if (/^rotate/.test(propertyName) && ((parseFloat(tweenContainer.startValue) - parseFloat(tweenContainer.endValue)) % 360 === 0)) {
              var oldStartValue = tweenContainer.startValue;

              tweenContainer.startValue = tweenContainer.endValue;
              tweenContainer.endValue = oldStartValue;
            }

            if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === "%") {
              tweenContainer.endValue = 0;
              tweenContainer.startValue = 100;
            }
          });

          Velocity(element, "reverse", {loop: true, delay: opts.delay});
        }

        /***************
         Dequeueing
         ***************/

        /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
				 which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
				 $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
        if (opts.queue !== false) {
          $.dequeue(element, opts.queue);
        }
      }

      /************************
       Calls Array Cleanup
       ************************/

      /* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
			 (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
      Velocity.State.calls[callIndex] = false;

      /* Iterate through the calls array to determine if this was the final in-progress animation.
			 If so, set a flag to end ticking and clear the calls array. */
      for (var j = 0, callsLength = Velocity.State.calls.length; j < callsLength; j++) {
        if (Velocity.State.calls[j] !== false) {
          remainingCallsExist = true;

          break;
        }
      }

      if (remainingCallsExist === false) {
        /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
        Velocity.State.isTicking = false;

        /* Clear the calls array so that its length is reset. */
        delete Velocity.State.calls;
        Velocity.State.calls = [];
      }
    }

    /******************
     Frameworks
     ******************/

    /* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
		 If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
		 also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
		 accessible beyond just a per-element scope. This master object contains an .animate() method, which is later assigned to $.fn
		 (if jQuery or Zepto are present). Accordingly, Velocity can both act on wrapped DOM elements and stand alone for targeting raw DOM elements. */
    global.Velocity = Velocity;

    if (global !== window) {
      /* Assign the element function to Velocity's core animate() method. */
      global.fn.velocity = animate;
      /* Assign the object function's defaults to Velocity's global defaults object. */
      global.fn.velocity.defaults = Velocity.defaults;
    }

    /***********************
     Packaged Redirects
     ***********************/

    /* slideUp, slideDown */
    $.each(["Down", "Up"], function(i, direction) {
      Velocity.Redirects["slide" + direction] = function(element, options, elementsIndex, elementsSize, elements, promiseData) {
        var opts = $.extend({}, options),
            begin = opts.begin,
            complete = opts.complete,
            inlineValues = {},
            computedValues = {height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: ""};

        if (opts.display === undefined) {
          /* Show the element before slideDown begins and hide the element after slideUp completes. */
          /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
          opts.display = (direction === "Down" ? (Velocity.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
        }

        opts.begin = function() {
          /* If the user passed in a begin callback, fire it now. */
          if (elementsIndex === 0 && begin) {
            begin.call(elements, elements);
          }

          /* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
          for (var property in computedValues) {
            if (!computedValues.hasOwnProperty(property)) {
              continue;
            }
            inlineValues[property] = element.style[property];

            /* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
						 use forcefeeding to start from computed values and animate down to 0. */
            var propertyValue = CSS.getPropertyValue(element, property);
            computedValues[property] = (direction === "Down") ? [propertyValue, 0] : [0, propertyValue];
          }

          /* Force vertical overflow content to clip so that sliding works as expected. */
          inlineValues.overflow = element.style.overflow;
          element.style.overflow = "hidden";
        };

        opts.complete = function() {
          /* Reset element to its pre-slide inline values once its slide animation is complete. */
          for (var property in inlineValues) {
            if (inlineValues.hasOwnProperty(property)) {
              element.style[property] = inlineValues[property];
            }
          }

          /* If the user passed in a complete callback, fire it now. */
          if (elementsIndex === elementsSize - 1) {
            if (complete) {
              complete.call(elements, elements);
            }
            if (promiseData) {
              promiseData.resolver(elements);
            }
          }
        };

        Velocity(element, computedValues, opts);
      };
    });

    /* fadeIn, fadeOut */
    $.each(["In", "Out"], function(i, direction) {
      Velocity.Redirects["fade" + direction] = function(element, options, elementsIndex, elementsSize, elements, promiseData) {
        var opts = $.extend({}, options),
            complete = opts.complete,
            propertiesMap = {opacity: (direction === "In") ? 1 : 0};

        /* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
				 callbacks by firing them only when the final element has been reached. */
        if (elementsIndex !== 0) {
          opts.begin = null;
        }
        if (elementsIndex !== elementsSize - 1) {
          opts.complete = null;
        } else {
          opts.complete = function() {
            if (complete) {
              complete.call(elements, elements);
            }
            if (promiseData) {
              promiseData.resolver(elements);
            }
          };
        }

        /* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
        /* Note: We allow users to pass in "null" to skip display setting altogether. */
        if (opts.display === undefined) {
          opts.display = (direction === "In" ? "auto" : "none");
        }

        Velocity(this, propertiesMap, opts);
      };
    });

    return Velocity;
  }((window.jQuery3_2_1 || window.Zepto || window), window, (window ? window.document : undefined));
}));

/******************
 Known Issues
 ******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
 Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
 will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */
/*!
 * Waves v0.6.4
 * http://fian.my.id/Waves
 *
 * Copyright 2014 Alfiana E. Sibuea and other contributors
 * Released under the MIT license
 * https://github.com/fians/Waves/blob/master/LICENSE
 */

;(function(window) {
    'use strict';

    var Waves = Waves || {};
    var $$ = document.querySelectorAll.bind(document);

    // Find exact position of element
    function isWindow(obj) {
        return obj !== null && obj === obj.window;
    }

    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    function offset(elem) {
        var docElem, win,
            box = {top: 0, left: 0},
            doc = elem && elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    function convertStyle(obj) {
        var style = '';

        for (var a in obj) {
            if (obj.hasOwnProperty(a)) {
                style += (a + ':' + obj[a] + ';');
            }
        }

        return style;
    }

    var Effect = {

        // Effect delay
        duration: 750,

        show: function(e, element) {

            // Disable right click
            if (e.button === 2) {
                return false;
            }

            var el = element || this;

            // Create ripple
            var ripple = document.createElement('div');
            ripple.className = 'waves-ripple';
            el.appendChild(ripple);

            // Get click coordinate and element witdh
            var pos         = offset(el);
            var relativeY   = (e.pageY - pos.top);
            var relativeX   = (e.pageX - pos.left);
            var scale       = 'scale('+((el.clientWidth / 100) * 10)+')';

            // Support for touch devices
            if ('touches' in e) {
              relativeY   = (e.touches[0].pageY - pos.top);
              relativeX   = (e.touches[0].pageX - pos.left);
            }

            // Attach data to element
            ripple.setAttribute('data-hold', Date.now());
            ripple.setAttribute('data-scale', scale);
            ripple.setAttribute('data-x', relativeX);
            ripple.setAttribute('data-y', relativeY);

            // Set ripple position
            var rippleStyle = {
                'top': relativeY+'px',
                'left': relativeX+'px'
            };

            ripple.className = ripple.className + ' waves-notransition';
            ripple.setAttribute('style', convertStyle(rippleStyle));
            ripple.className = ripple.className.replace('waves-notransition', '');

            // Scale the ripple
            rippleStyle['-webkit-transform'] = scale;
            rippleStyle['-moz-transform'] = scale;
            rippleStyle['-ms-transform'] = scale;
            rippleStyle['-o-transform'] = scale;
            rippleStyle.transform = scale;
            rippleStyle.opacity   = '1';

            rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
            rippleStyle['-moz-transition-duration']    = Effect.duration + 'ms';
            rippleStyle['-o-transition-duration']      = Effect.duration + 'ms';
            rippleStyle['transition-duration']         = Effect.duration + 'ms';

            rippleStyle['-webkit-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            rippleStyle['-moz-transition-timing-function']    = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            rippleStyle['-o-transition-timing-function']      = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            rippleStyle['transition-timing-function']         = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';

            ripple.setAttribute('style', convertStyle(rippleStyle));
        },

        hide: function(e) {
            TouchHandler.touchup(e);

            var el = this;
            var width = el.clientWidth * 1.4;

            // Get first ripple
            var ripple = null;
            var ripples = el.getElementsByClassName('waves-ripple');
            if (ripples.length > 0) {
                ripple = ripples[ripples.length - 1];
            } else {
                return false;
            }

            var relativeX   = ripple.getAttribute('data-x');
            var relativeY   = ripple.getAttribute('data-y');
            var scale       = ripple.getAttribute('data-scale');

            // Get delay beetween mousedown and mouse leave
            var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
            var delay = 350 - diff;

            if (delay < 0) {
                delay = 0;
            }

            // Fade out ripple after delay
            setTimeout(function() {
                var style = {
                    'top': relativeY+'px',
                    'left': relativeX+'px',
                    'opacity': '0',

                    // Duration
                    '-webkit-transition-duration': Effect.duration + 'ms',
                    '-moz-transition-duration': Effect.duration + 'ms',
                    '-o-transition-duration': Effect.duration + 'ms',
                    'transition-duration': Effect.duration + 'ms',
                    '-webkit-transform': scale,
                    '-moz-transform': scale,
                    '-ms-transform': scale,
                    '-o-transform': scale,
                    'transform': scale,
                };

                ripple.setAttribute('style', convertStyle(style));

                setTimeout(function() {
                    try {
                        el.removeChild(ripple);
                    } catch(e) {
                        return false;
                    }
                }, Effect.duration);
            }, delay);
        },

        // Little hack to make <input> can perform waves effect
        wrapInput: function(elements) {
            for (var a = 0; a < elements.length; a++) {
                var el = elements[a];

                if (el.tagName.toLowerCase() === 'input') {
                    var parent = el.parentNode;

                    // If input already have parent just pass through
                    if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf('waves-effect') !== -1) {
                        continue;
                    }

                    // Put element class and style to the specified parent
                    var wrapper = document.createElement('i');
                    wrapper.className = el.className + ' waves-input-wrapper';

                    var elementStyle = el.getAttribute('style');

                    if (!elementStyle) {
                        elementStyle = '';
                    }

                    wrapper.setAttribute('style', elementStyle);

                    el.className = 'waves-button-input';
                    el.removeAttribute('style');

                    // Put element as child
                    parent.replaceChild(wrapper, el);
                    wrapper.appendChild(el);
                }
            }
        }
    };


    /**
     * Disable mousedown event for 500ms during and after touch
     */
    var TouchHandler = {
        /* uses an integer rather than bool so there's no issues with
         * needing to clear timeouts if another touch event occurred
         * within the 500ms. Cannot mouseup between touchstart and
         * touchend, nor in the 500ms after touchend. */
        touches: 0,
        allowEvent: function(e) {
            var allow = true;

            if (e.type === 'touchstart') {
                TouchHandler.touches += 1; //push
            } else if (e.type === 'touchend' || e.type === 'touchcancel') {
                setTimeout(function() {
                    if (TouchHandler.touches > 0) {
                        TouchHandler.touches -= 1; //pop after 500ms
                    }
                }, 500);
            } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
                allow = false;
            }

            return allow;
        },
        touchup: function(e) {
            TouchHandler.allowEvent(e);
        }
    };


    /**
     * Delegated click handler for .waves-effect element.
     * returns null when .waves-effect element not in "click tree"
     */
    function getWavesEffectElement(e) {
        if (TouchHandler.allowEvent(e) === false) {
            return null;
        }

        var element = null;
        var target = e.target || e.srcElement;

        while (target.parentElement !== null) {
            if (!(target instanceof SVGElement) && target.className.indexOf('waves-effect') !== -1) {
                element = target;
                break;
            } else if (target.classList.contains('waves-effect')) {
                element = target;
                break;
            }
            target = target.parentElement;
        }

        return element;
    }

    /**
     * Bubble the click and show effect if .waves-effect elem was found
     */
    function showEffect(e) {
        var element = getWavesEffectElement(e);

        if (element !== null) {
            Effect.show(e, element);

            if ('ontouchstart' in window) {
                element.addEventListener('touchend', Effect.hide, false);
                element.addEventListener('touchcancel', Effect.hide, false);
            }

            element.addEventListener('mouseup', Effect.hide, false);
            element.addEventListener('mouseleave', Effect.hide, false);
        }
    }

    Waves.displayEffect = function(options) {
        options = options || {};

        if ('duration' in options) {
            Effect.duration = options.duration;
        }

        //Wrap input inside <i> tag
        Effect.wrapInput($$('.waves-effect'));

        if ('ontouchstart' in window) {
            document.body.addEventListener('touchstart', showEffect, false);
        }

        document.body.addEventListener('mousedown', showEffect, false);
    };

    /**
     * Attach Waves to an input element (or any element which doesn't
     * bubble mouseup/mousedown events).
     *   Intended to be used with dynamically loaded forms/inputs, or
     * where the user doesn't want a delegated click handler.
     */
    Waves.attach = function(element) {
        //FUTURE: automatically add waves classes and allow users
        // to specify them with an options param? Eg. light/classic/button
        if (element.tagName.toLowerCase() === 'input') {
            Effect.wrapInput([element]);
            element = element.parentElement;
        }

        if ('ontouchstart' in window) {
            element.addEventListener('touchstart', showEffect, false);
        }

        element.addEventListener('mousedown', showEffect, false);
    };

    window.Waves = Waves;

    document.addEventListener('DOMContentLoaded', function() {
        Waves.displayEffect();
    }, false);

})(window);
