/**
 * 조건별 검색 기능 스크립트
 */
$(document).ready(function(){
    var sParentElement = 'select.SecondSelect';
    $('select.FirstSelect').change(function() {
        var iGroupNo = $(this).find('option:selected').val();
        if(iGroupNo > 0) {
            $.ajax({
                url : '/product/provider/selectsearch.xml?GroupNo='+iGroupNo,
                dataType: 'xml',
                success: function(xml) {
                    $(sParentElement).html('');
                    getOptionElement('','-세부항목선택-').appendTo(sParentElement);
                    var nodes = $(xml).find('searchkey');
                    for(var x = 0 ; x < nodes.length ; x++) {
                        getOptionElement($(nodes[x]).find('search_value').text(),$(nodes[x]).find('search_value').text()).appendTo(sParentElement);
                    }
                }
            });
        }
    });
    $('a.SelectSearch').click(function() {
        var sGroup = $('select.FirstSelect').val();
        var sItem = encodeURIComponent($('select.SecondSelect').val());
        if(!sGroup || !sItem) { return false; }
        location.href = document.location.href.split('?')[0].split(document.domain)[1]+'?'+sSSUrl+'&sGroup='+sGroup+'&sItem='+sItem;
    });

    function getOptionElement(sVal, sTitle)
    {
        return $("<option value='"+sVal+"'>"+sTitle+"</option>");
    }
});