/**
 * 카테고리 마우스 오버 이미지
 * 카테고리 서브 메뉴 출력
 */
$(document).ready(function(){
    var methods = {
        aCategory    : [],
        aSubCategory : {},
        get: function()
        {
             $.ajax({
                url : '/exec/front/Product/SubCategory',
                dataType: 'json',
                success: function(aData) {
                    if (aData == null || aData == 'undefined') return;
                    for (var i=0; i<aData.length; i++)
                    {
                        var sParentCateNo = aData[i].parent_cate_no;
                        if (!methods.aSubCategory[sParentCateNo]) {
                            methods.aSubCategory[sParentCateNo] = [];
                        }
                        methods.aSubCategory[sParentCateNo].push( aData[i] );
                    }
                }
            });
        },
        getParam: function(sUrl, sKey) {
            var aUrl         = sUrl.split('?');
            var sQueryString = aUrl[1];
            var aParam       = {};
            if (sQueryString) {
                var aFields = sQueryString.split("&");
                var aField  = [];
                for (var i=0; i<aFields.length; i++) {
                    aField = aFields[i].split('=');
                    aParam[aField[0]] = aField[1];
                }
            }
            return sKey ? aParam[sKey] : aParam;
        },
        show: function(overNode, iCateNo) {
            if (methods.aSubCategory[iCateNo].length == 0) {
                return;
            }
            var aHtml = [];
            aHtml.push('<ul>');
            $(methods.aSubCategory[iCateNo]).each(function() {
                aHtml.push('<li><a href="/'+this.design_page_url+this.param+'">'+this.name+'</a></li>');
            });
            aHtml.push('</ul>');
            var offset = $(overNode).offset();
            $('<div class="sub-category"></div>')
                .appendTo(overNode)
                .html(aHtml.join(''))
                .find('li').mouseover(function(e) {
                    $(this).addClass('over');
                }).mouseout(function(e) {
                    $(this).removeClass('over');
                });
        },
        close: function() {
            $('.sub-category').remove();
        }
    };
    methods.get();
    $('.xans-layout-category li').mouseenter(function(e) {
          var $this = $(this).addClass('on'),
            iCateNo = Number(methods.getParam($this.find('a').attr('href'), 'cate_no'));
          if (!iCateNo) {
               return;
          }
          methods.show($this, iCateNo);
     }).mouseleave(function(e) {
        $(this).removeClass('on');
          methods.close();
     });
});