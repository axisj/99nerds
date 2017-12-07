/**
 * 조건별 검색 기능 스크립트
 */
$(document).ready(function()
{
    var sParentElement = 'select.SecondSelect';
    $('select.FirstSelect').change(function()
    {
        var iGroupNo = $(this).find('option:selected').val();
        if (iGroupNo > 0) {
            $.ajax({
                url : '/product/provider/selectsearch.xml?GroupNo=' + iGroupNo,
                dataType : 'text',
                success : function(data){
                    if ( window.DOMParser ) {
                        tmp = new DOMParser();
                        xml = tmp.parseFromString( data , "text/xml" );
                    } else {
                        xml = new ActiveXObject( "Microsoft.XMLDOM" );
                        xml.async = "false";
                        xml.loadXML( data );
                    }

                    $(sParentElement).html('');
                    getOptionElement('','-세부항목선택-').appendTo(sParentElement);
                    var nodes = $(xml).find('searchkey');
                    for ( var x = 0 ; x < nodes.length ; x++) {
                        getOptionElement($(nodes[x]).find('search_value').text(),$(nodes[x]).find('search_value').text()).appendTo(sParentElement);
                    }
                }
            });
        }
    });
    $('a.SelectSearch').click(function()
    {
        var sGroup = $('select.FirstSelect').val();
        var sItem = $('select.SecondSelect').val();
        if (!sGroup) {
            alert('조건을 선택해 주세요.');
            return false;
        }
        if (!sItem) {
            alert('세부 항목을 선택해 주세요.');
            return false;
        }
        location.href = document.location.href.split('?')[0].split(document.domain)[1] + '?' + sSSUrl + '&sGroup=' + sGroup + '&sItem=' + sItem;
    });

    function getOptionElement(sVal, sTitle)
    {
        return $("<option value='" + sVal + "'>" + sTitle + "</option>");
    }
});
