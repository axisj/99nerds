var aCategory = [];
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
                    if (aData == null || aData == 'undefined') {
                        methods.checkSub();
                        return;
                    }
                    for (var i=0; i<aData.length; i++)
                    {
                        var sParentCateNo = aData[i].parent_cate_no;
                        var sCateNo = aData[i].cate_no;
                        if (!methods.aSubCategory[sParentCateNo]) {
                            methods.aSubCategory[sParentCateNo] = [];
                        }
                        if (!aCategory[sCateNo]) {
                            aCategory[sCateNo] = [];
                        }
                        methods.aSubCategory[sParentCateNo].push( aData[i] );
                        aCategory[sCateNo] = aData[i];
                    }
                    methods.checkSub();
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
             var oParentNode = overNode;
            var aHtml = [];
            var sMyCateList = localStorage.getItem("myCateList");
            if (methods.aSubCategory[iCateNo] != undefined) {
                aHtml.push('<ul class="cateSubMenu">');
                $(methods.aSubCategory[iCateNo]).each(function() {
                    var sNextParentNo = this.cate_no;
                    if (methods.aSubCategory[sNextParentNo] == undefined) {
                        aHtml.push('<li class="noChild" id="cate'+this.cate_no+'">');
                        var sHref = '/product/list_thumb.html'+this.param; 
                    } else {
                        aHtml.push('<li id="cate'+this.cate_no+'">');
                        var sHref = '#none';
                    }
                    if (methods.aSubCategory[sNextParentNo] != undefined)  aHtml.push('<a href="'+sHref+'" class="cate" cate="'+this.param+'" onclick="subMenuEvent(this);"><span>펼침</span></a>');

                    aHtml.push('<a href="/product/list_thumb.html'+this.param+'" class="view">'+this.name+'</a>');
                    if (methods.aSubCategory[sNextParentNo] != undefined) {
                        aHtml.push('<ul>');
                        $(methods.aSubCategory[sNextParentNo]).each(function() {
                            var sNextParentNo2 = this.cate_no;
                            if (methods.aSubCategory[sNextParentNo2] == undefined) {
                                aHtml.push('<li class="noChild" id="cate'+this.cate_no+'">');
                                var sHref = '/product/list_thumb.html'+this.param;
                            } else {
                                aHtml.push('<li id="cate'+this.cate_no+'">');
                                var sHref = '#none';
                            }
                            if (methods.aSubCategory[sNextParentNo] != undefined)  aHtml.push('<a href="'+sHref+'" class="cate" cate="'+this.param+'" onclick="subMenuEvent(this);"><span>펼침</span></a>');
                            aHtml.push('<a href="/product/list_thumb.html'+this.param+'" class="view">'+this.name+'</a>');

                            if (methods.aSubCategory[sNextParentNo2] != undefined) {
                                aHtml.push('<ul>');

                                $(methods.aSubCategory[sNextParentNo2]).each(function() {
                                    aHtml.push('<li class="noChild" id="cate'+this.cate_no+'">');
                                    aHtml.push('<a href="'+sHref+'" class="cate" cate="'+this.param+'" onclick="subMenuEvent(this);"><span>펼침</span></a>');
                                    aHtml.push('<a href="/product/list_thumb.html'+this.param+'" class="view">'+this.name+'</a>');
                                    aHtml.push('</li>');
                                });
                                aHtml.push('</ul>');
                            }
                            aHtml.push('</li>');
                        });
                        aHtml.push('</ul>');
                    }
                    aHtml.push('</li>');
                });
                aHtml.push('</ul>');
            }
            $(oParentNode).append(aHtml.join(''));
        },
        close: function() {
            $('.cateSubMenu').remove();
        },
        checkSub: function() {
            $('.cate').each(function(){
                var iCateNo = Number(methods.getParam($(this).attr('cate'), 'cate_no'));
                var result = methods.aSubCategory[iCateNo];
                if (result == undefined) {
                    $(this).attr('href', '/product/list_thumb.html'+$(this).attr('view'));
                    $(this).parent().attr('class', 'noChild');
                }
            });
        }
    };

    methods.get();

    $('#categoryList li > a.cate').click(function(e) {
        var iCateNo = Number(methods.getParam($(this).attr('cate'), 'cate_no'));
        if ($(this).parent().attr('class') == 'xans-record- selected') {
            methods.close();
        } else {
            if (!iCateNo) return;
            $('#categoryList li').removeClass('selected');
            methods.close();
            methods.show(this.parentNode, iCateNo);
        }
    });

    $('#categoryList li a.cate').click(function(e){
            $(this).parent().find('li').removeClass('selected');
            $(this).parent().toggleClass('selected');
            if (!$(this).parent('li').hasClass('noChild')){
                e.preventDefault();
            }
    });

    $('#categoryList h2').click(function() {
        var oParentId = $(this).parent().attr('id');
        if (oParentId == 'categoryList') {
            ($(this).attr('class') == 'selected') ? $(this).next().hide() : $(this).next().show();
        }
        $(this).toggleClass('selected');
    });
});
function subMenuEvent(obj) {
    $(obj).parent().find('li').removeClass('selected');
    $(obj).parent().toggleClass('selected');
}

$(document).ready(function() {
    if($('#categoryList h2').hasClass('selected') == false){
        $('#categoryList h2').next().hide();
    }
});