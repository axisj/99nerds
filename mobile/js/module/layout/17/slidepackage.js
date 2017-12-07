 /**
 * 모바일쇼핑몰 슬라이딩메뉴 */
var aCategory = [];
$(document).ready(function(){
    $('#header').append('<div id="dimmedSlider"></div>');
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
                    methods.getMyCateList();
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
                aHtml.push('<ul class="slideSubMenu">');
                $(methods.aSubCategory[iCateNo]).each(function() {
                    var sNextParentNo = this.cate_no;
                    var sCateSelected = (checkInArray(sMyCateList, this.cate_no) == true) ? ' selected' : '';
                    if (methods.aSubCategory[sNextParentNo] == undefined) {
                        aHtml.push('<li class="noChild" id="cate'+this.cate_no+'">');
                        var sHref = '/product/list_thumb.html'+this.param;
                    } else {
                        aHtml.push('<li id="cate'+this.cate_no+'">');
                        var sHref = '#none';
                    }
                    aHtml.push('<a href="'+sHref+'" class="cate" cate="'+this.param+'" onclick="subMenuEvent(this);">'+this.name+'</a>');
                    if (methods.aSubCategory[sNextParentNo] != undefined)  aHtml.push('<a href="/product/list_thumb.html'+this.param+'" class="view">상품보기</a>');
                    aHtml.push('<button type="button" class="icoBookmark'+sCateSelected+'" id="icoBookmark">즐겨찾기 추가</button>');

                    if (methods.aSubCategory[sNextParentNo] != undefined) {
                        aHtml.push('<ul>');
                        $(methods.aSubCategory[sNextParentNo]).each(function() {
                            var sNextParentNo2 = this.cate_no;
                            var sCateSelected = (checkInArray(sMyCateList, this.cate_no) == true) ? ' selected' : '';
                            if (methods.aSubCategory[sNextParentNo2] == undefined) {
                                aHtml.push('<li class="noChild" id="cate'+this.cate_no+'">');
                                var sHref = '/product/list_thumb.html'+this.param;
                            } else {
                                aHtml.push('<li id="cate'+this.cate_no+'">');
                                var sHref = '#none';
                            }
                            aHtml.push('<a href="'+sHref+'" class="cate" cate="'+this.param+'" onclick="subMenuEvent(this);">'+this.name+'</a>');
                            if (methods.aSubCategory[sNextParentNo] != undefined)  aHtml.push('<a href="/product/list_thumb.html'+this.param+'" class="view">상품보기</a>');
                            aHtml.push('<button type="button" class="icoBookmark'+sCateSelected+'" id="icoBookmark">즐겨찾기 추가</button>');

                            if (methods.aSubCategory[sNextParentNo2] != undefined) {
                                aHtml.push('<ul>');

                                $(methods.aSubCategory[sNextParentNo2]).each(function() {
                                    aHtml.push('<li class="noChild" id="cate'+this.cate_no+'">');
                                    var sCateSelected = (checkInArray(sMyCateList, this.cate_no) == true) ? ' selected' : '';
                                    aHtml.push('<a href="/product/list_thumb.html'+this.param+'" class="cate" cate="'+this.param+'" onclick="subMenuEvent(this);">'+this.name+'</a>');
                                    aHtml.push('<button type="button" class="icoBookmark'+sCateSelected+'" id="icoBookmark">즐겨찾기 추가</button>');
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
            $('.slideSubMenu').remove();
        },
        checkSub: function() {
            $('.cate').each(function(){
                var iCateNo = Number(methods.getParam($(this).attr('cate'), 'cate_no'));
                var result = methods.aSubCategory[iCateNo];
                if (result == undefined) {
                    if ($(this).closest('#slideProjectList').length) {
                        var sHref = '/product/project.html'+$(this).attr('cate');
                    } else {
                        var sHref = '/product/list_thumb.html'+$(this).attr('cate');
                    }

                    $(this).attr('href', sHref);
                    $(this).parent().attr('class', 'noChild');
                }
            });
        },
        getMyCateList :function() {
            var sMyCateList = localStorage.getItem("myCateList");
            if (sMyCateList != null && sMyCateList != "") {
                var aTempList = sMyCateList.split("|");
                var aHtml = [];
                for (var i = 0; i < aTempList.length; i++) {
                    if (aTempList[i] != "") {
                        var iCateNo = aTempList[i];
                        var sCateName = aCategory[iCateNo].name;
                        var sCateParam = aCategory[iCateNo].param;
                        aHtml.push('<li id="bookmark'+iCateNo+'"><a href="/product/list_thumb.html'+sCateParam+'" book_mark="'+iCateNo+'">'+sCateName+'</a><button type="button" class="icoBookmark selected" onclick="setMyCateList('+iCateNo+');">즐겨찾기 삭제</button></li>');
                        $("#cate"+iCateNo+" #icoBookmark").addClass("selected");
                    }
                }
                $('#bookmartCateArea').append('<ul>'+aHtml.join('')+'</ul>');
            }
            chkMyCateList();
        }
    };

    var offCover = {
        init : function() {
            $(function() {
               $('#wrap').append('<a href="#container" id="btnFoldLayout">메뉴 토글</a>');
                offCover.resize();
                $(window).resize(function(){
                    offCover.resize();
                });
            });
        },
        layout : function(){
            if ($('html').hasClass('expand')) {
                $('#btnFoldLayout').show();
                $('#aside').css({'visibility':'visible'});

                setTimeout(function(){
                    $('#btnFoldLayout').css({'background':'rgba(0,0,0,0.7)'});
                }, 350);
            } else {
                $('#btnFoldLayout').hide();
                setTimeout(function(){
                     $('#aside').css({'visibility':'hidden'});
                    }, 300);
            }
            $('#aside').css({'visibility':'visible'});
        },
        resize : function(){
            var height = $('body').height();
            $('#container').css({'min-height':height});
        }
    };
    methods.get();

    offCover.init();


    $('#header .fold, #aside .btnClose').click(function(e){
        $('#dimmedSlider').toggle();
        $('html').toggleClass('expand');
        offCover.layout(); console.log("AAA");
        e.preventDefault();
    });

    $('#btnFoldLayout').click(function(e){
        $('#header .fold').trigger('click');
        e.preventDefault();
    });

    $('#slideCateList li > a.cate').click(function(e) {
        var iCateNo = Number(methods.getParam($(this).attr('cate'), 'cate_no'));
        if ($(this).parent().attr('class') == 'xans-record- selected') {
            methods.close();
        } else {
            if (!iCateNo) return;
            $('#aside #slideCateList li').removeClass('selected');
            methods.close();
            methods.show(this.parentNode, iCateNo);
        }
    });

    $('#aside ul a.cate').click(function(e){
            $(this).parent().find('li').removeClass('selected');
            $(this).parent().toggleClass('selected');
            if (!$(this).parent('li').hasClass('noChild')){
                e.preventDefault();
            }
    });

    $("#icoBookmark").live('click', function() {
        var iCateNo = Number(methods.getParam($(this).parent().find('a').attr('cate'), 'cate_no'));
        setMyCateList(iCateNo, $(this));
    });

    $('#slideCateList h2').click(function() {
        var oParentId = $(this).parent().attr('id');
        if (oParentId == 'slideCateList' || oParentId == 'slideMultishopList' || oParentId == 'slideProjectList') {
            ($(this).attr('class') == 'selected') ? $(this).next().hide() : $(this).next().show();
        } else if (oParentId == 'bookmarkCategory') {
            if ($(this).attr('class') == 'selected') {
                $(this).parent().find('#bookmarkEmpty').hide();
                $(this).parent().find('#bookmartCateArea').hide();
            } else {
                chkMyCateList();
                $(this).parent().find('#bookmartCateArea').show();
            }
        }
        $(this).toggleClass('selected');
    });
});
function subMenuEvent(obj) {
    $(obj).parent().find('li').removeClass('selected');
    $(obj).parent().toggleClass('selected');
}
function setMyCateList(iCateNo, oObj) {
    $(oObj).toggleClass('selected');
    var sMyCateList = localStorage.getItem("myCateList");
    var aCateList = [];
    if (checkInArray(sMyCateList, iCateNo) == true) {
        var aTemp = sMyCateList.split("|");
        for (var i = 0 ; i < aTemp.length ; i++) {
            if (aTemp[i] != iCateNo) {
                aCateList.push(aTemp[i]);
            }
        }
        var sCateList = aCateList.join('|');
        localStorage.setItem("myCateList" , sCateList);
        $('#bookmartCateArea #bookmark'+iCateNo).remove();
        if (aCateList.length == 0) {
             $('#bookmarkCategory #bookmartCateArea').find('ul').remove();
        }
        $("#cate"+iCateNo+" > #icoBookmark").removeClass("selected");
    } else {
        var sCateName = aCategory[iCateNo].name;
        var sCateParam = aCategory[iCateNo].param;
        var sHtml = '';
        if (sMyCateList == null || sMyCateList == '') {
            sHtml = '<ul><li id="bookmark'+iCateNo+'"><a href="/product/list_thumb.html'+sCateParam+'" book_mark="'+iCateNo+'">'+sCateName+'</a><button type="button" class="icoBookmark selected" onclick="setMyCateList('+iCateNo+');">즐겨찾기 삭제</button></li></ul>'
            $('#bookmarkCategory #bookmartCateArea').append(sHtml);
        } else {
            sHtml = '<li id="bookmark'+iCateNo+'"><a href="/product/list_thumb.html'+sCateParam+'" book_mark="'+iCateNo+'">'+sCateName+'</a><button type="button" class="icoBookmark selected" onclick="setMyCateList('+iCateNo+');">즐겨찾기 삭제</button></li>'
            $('#bookmarkCategory #bookmartCateArea ul').append(sHtml);
        }
        $(this).addClass('selected');
        if (sMyCateList == null || sMyCateList == '') {
            localStorage.setItem('myCateList' , iCateNo);
        } else {
            localStorage.setItem('myCateList' , sMyCateList + '|' + iCateNo);
        }
    }
    chkMyCateList();
}
function checkInArray(sBookmarkList, iCateNo) {
    if (sBookmarkList == null) return false;
    var aBookmarkList = sBookmarkList.split("|");
    for (var i = 0; i < aBookmarkList.length; i++) {
        if (aBookmarkList[i] == iCateNo) {
            return true;
        }
    }
    return false;
}
function chkMyCateList() {
    var sMyCateList = localStorage.getItem("myCateList");
    if (sMyCateList == null || sMyCateList == '') {
        $('#bookmarkEmpty').show();
    } else {
        $('#bookmarkEmpty').hide();
    }
}