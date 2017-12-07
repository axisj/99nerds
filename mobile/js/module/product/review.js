/**
 * 상품상세 사용후기
 */
$(document).ready(function(){
    $('.xans-product-review a').click(function(e) {
        e.preventDefault();

        var no = $(this).attr('href').replace(/(\S*)[?&]no=(\d+)(\S*)/g, '$2');
        var $obj = $('#product-review-read_'+no);

        //로드된 엘리먼트 존재 체크
        if ($obj.length > 0) {
            if ($obj.css('display') =='none') {
                $obj.show();
            } else {
                $obj.hide();
            }
            return;
        }

        REVIEW.getReadData($(this));
    });

    // 구매후기 탭 바로 활성화처리
    var href = document.location.href.split('#')[1];
    if (href == 'use_review') {
        $('a[name="use_review"]').trigger('click');
    }
});

var PARENT = '';

var OPEN_REVIEW = '';

var REVIEW = {
    getReadData : function(obj, eType)
    {
        if (obj != undefined) {
            PARENT = obj;
            var sHref = obj.attr('href');
            var pNode = obj.parents('li');
            var pass_check = '&pass_check=F';
        } else {
            var sHref = PARENT.attr('href');
            var pNode = PARENT.parents('li');
            var pass_check = '&pass_check=T';
        }

        var sQuery = sHref.split('?');

        var sQueryNo = sQuery[1].split('=');
        if (OPEN_REVIEW == sQueryNo[1]) {
            $('#product-review-read').remove();
            OPEN_REVIEW = '';
            return false;
        } else {
            OPEN_REVIEW = sQueryNo[1];
        }

        $.ajax({
            url : '/exec/front/board/product/4?'+sQuery[1]+pass_check,
            dataType: 'json',
            success: function(data) {
                $('#product-review-read').remove();

                var sPath = document.location.pathname;
                var sPattern = /^\/product\/(.+)\/([0-9]+)(\/.*)/;
                var aMatchResult = sPath.match(sPattern);

                if (aMatchResult) {
                    var iProductNo = aMatchResult[2];
                } else {
                    var iProductNo = getQueryString('product_no');
                }

                var aHtml = [];

                //읽기 권한 체크
                if (false === data.read_auth && eType == undefined) {
                    alert(decodeURIComponent(data.alertMSG));
                    return false;
                }

                if (data.is_secret == true) {
                    // 비밀글 비밀번호 입력 폼
                    aHtml.push('<form name="SecretForm_4" id="SecretForm_4">');
                    aHtml.push('<input type="text" name="a" style="display:none;">');
                    aHtml.push('<div class="view secret">');
                    aHtml.push('<span class="alert">이 글은 비밀글입니다.<br>비밀번호를 입력하여 주세요.</span>');
                    aHtml.push('<p><input type="password" id="secure_password" name="secure_password" onkeydown="if (event.keyCode == 13) '+data.action_pass_submit+'"> <input type="button" value="확인" onclick="'+data.action_pass_submit+'" class="btnStrong"></p>');
                    aHtml.push('</div>');
                    aHtml.push('</form>');
                } else {
                    // 글 내용
                    if (data.read['content_image'] != null) {
                        var sImg = data.read['content_image'];
                    } else {
                        var sImg = '';
                    }

                    aHtml.push('<div class="view">');
                    aHtml.push('<p class="attach">'+sImg+'</p>');
                    aHtml.push('<p>'+data.read['content']+'</p>');
                    aHtml.push('</div>');
                    aHtml.push('<div class="btnArea">');
                    if (data.comment != undefined) {
                        aHtml.push('<span class="gLeft">');
                        aHtml.push('<a href="#none" class="btnNormal mini" onclick="REVIEW.comment_view('+data.read['no']+');">댓글보기 <em>('+data.read['comment_count']+')</em></a> <a href="#none" class="btnNormal mini" onclick="REVIEW.comment_write(this);"><span class="ico write"></span> 쓰기</a>');
                        aHtml.push('</span>');
                    }
                    aHtml.push('<span class="gRight">');
                    aHtml.push('<a href="/board/product/modify.html?board_act=edit&no='+data.no+'&board_no=4&link_product_no='+iProductNo+'" class="btnNormal mini">수정</a>');
                    aHtml.push('</span>');
                    aHtml.push('</div>');

                    // 댓글리스트
                    if (data.comment != undefined && data.comment.length != undefined) {
                        aHtml.push('<ul class="boardComment" id="commentList_'+data.read['no']+'" style="display:none;">');
                        for (var i=0; data.comment.length > i; i++) {
                            //댓글리스트
                            if (data.comment[i]['comment_reply_css'] == undefined) {
                                aHtml.push('<li id="'+data.comment[i]['comment_reply_id']+'">');
                                aHtml.push('<div class="commentInfo">');
                                aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                aHtml.push('<span class="grade '+data.use_point+'"><img src="//img.echosting.cafe24.com/skin/mobile_ko_KR/board/ico_star'+data.comment[i]['comment_point_count']+'.png" alt="'+data.comment[i]['comment_point_count']+'점" /></span>');
                                aHtml.push('</div>');
                                aHtml.push('<p class="comment">'+data.comment[i]['comment_content']+'</p>');
                                if (data.comment[i]['comment_reply_display'] == true) {
                                    aHtml.push('<div class="btnArea">'+'<span class="gLeft">');
                                    aHtml.push('<a href="#none" class="btnNormal mini" onclick="REVIEW.comment_reply_view('+data.comment[i]['comment_no']+')">댓글의 댓글 <em>('+data.comment[i]['comment_reply_count']+')</em></a>');
                                    aHtml.push('<a href="#none" class="btnNormal mini" onclick="'+data.comment[i]['action_comment_reply_new']+'"><span class="ico write"></span> 쓰기</a>');
                                    aHtml.push('</span>'+'</div>');
                                }
                                aHtml.push('</li>');
                            } else {
                                //댓글의 댓글리스트
                                aHtml.push('<li class="replyArea" style="display:none;" id="'+data.comment[i]['comment_reply_id']+'">');
                                aHtml.push('<div class="commentInfo">');
                                aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                aHtml.push('</div>');
                                aHtml.push('<p class="comment">'+data.comment[i]['comment_content']+'</p>');
                                aHtml.push('</li>');
                            }
                        }
                        aHtml.push('</ul>');
                    }

                    // 댓글쓰기
                    if (data.comment_write != undefined) {
                        aHtml.push('<form name="commentWriteForm_4'+data.key+'" id="commentWriteForm_4'+data.key+'" style="display:none;">');
                        aHtml.push('<div class="memoCont">');
                        aHtml.push('<div class="info"><p class="name"><strong class="label">이름</strong>' +data.comment_write['comment_name']+ '</p><p class="password"><strong class="label">비밀번호</strong>' +data.comment_write['comment_password']+ '</p></div>');
                        aHtml.push('<div class="byteRating"><p class="byte ' +data.comment_write['use_comment_size']+ '">/ byte</p><p class="rating ' +data.comment_write['use_point']+ '"><strong class="label">평점</strong>' +data.comment_write['comment_point']+ '</p></div>');
                        aHtml.push('<div class="comment"><strong class="label hide">내용</strong>' +data.comment_write['comment']+ '</div>');
                        aHtml.push('<div class="captcha ' +data.comment_write['use_captcha']+ '"><span class="img"></span><div class="form">' +data.comment_write['captcha_image']+data.comment_write['captcha_refresh']+data.comment_write['captcha']+ '<p>왼쪽의 문자를 공백없이 입력하세요.<br>(대소문자구분)</p></div></div>');
                        aHtml.push('<div class="submit"><a href="#none" onclick="' +data.comment_write['action_comment_insert']+ '" class="btnStrong mini">댓글 입력</a></div>');
                        aHtml.push('</div>');
                        aHtml.push('</form>');
                    }

                    // 댓글의 댓글쓰기

                    if (data.comment_reply != undefined) {
                        aHtml.push('<form name="commentReplyWriteForm_4'+data.key+'" id="commentReplyWriteForm_4'+data.key+'" style="display:none">');
                        aHtml.push('<div class="memoCont reply">');
                        aHtml.push('<div class="info"><p class="name"><strong class="label">이름</strong>' +data.comment_reply['comment_name']+ '</p><p class="password"><strong class="label">비밀번호</strong>' +data.comment_reply['comment_password']+ '</p></div>');
                        aHtml.push('<div class="comment"><strong class="label hide">내용</strong>' +data.comment_reply['comment']+ '</div>');
                        aHtml.push('<p class="text '+data.comment_reply['use_comment_size']+'">'+data.comment_reply['comment_byte']+' / '+data.comment_reply['comment_size']+' byte</p>');
                        aHtml.push('<div class="captcha ' +data.comment_reply['use_captcha']+ '"><span class="img"></span><div class="form">' +data.comment_reply['captcha_image']+data.comment_reply['captcha_refresh']+data.comment_reply['captcha']+ '<p>왼쪽의 문자를 공백없이 입력하세요.<br>(대소문자구분)</p></div></div>');
                        aHtml.push('<div class="submit"><a href="#none" onclick="' +data.comment_reply['action_comment_insert']+ '" class="btnStrong mini">입력</a></div>');
                        aHtml.push('</div>');
                        aHtml.push('</form>');
                    }

                }
                $(pNode).after('<li id="product-review-read'+data.key+'" class="contentView">'+aHtml.join('')+'</li>');

                // 평점기능 사용안함일 경우 보여지는 td를 조절하기 위한 함수
                PRODUCT_COMMENT.comment_colspan(pNode);

                if (data.comment_write != undefined && data.comment_write['use_comment_size'] == '') PRODUCT_COMMENT.comment_byte(4, data.key);
                if (data.comment_reply != undefined && data.comment_write['use_comment_size'] == '') PRODUCT_COMMENT.comment_byte(4, data.key, 'commentReplyWriteForm');
            }
        });
    },

    // 댓글 보기
    comment_view : function (sId)
    {
        if ($('#commentList_'+sId).css('display') == 'none') {
            $('#commentList_'+sId).show();
        } else {
            $('#commentList_'+sId).hide();
        }
    },

    // 댓글의 댓글 보기
    comment_reply_view : function (iCommentNo)
    {
        $('[id^="replyArea_'+iCommentNo+'_"]').each(function(e) {
            if ($(this).css('display') == 'none') {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    },

    // 댓글 쓰기
    comment_write : function (e)
    {
        var $form = $("#commentWriteForm_4");
        if ($form.css('display') == 'none') {
            $form.css('display', 'block');

            var $p = $(e).parent().parent();
            if ( $(e).parent().find('#commentWriteForm_4').length < 1 ) {
                $p.after($form);
            }
        } else {
            $form.hide();
        }
    },

    END : function() {}
};