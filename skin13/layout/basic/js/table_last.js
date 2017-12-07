/* tableTheme3 마지막 노드에 last 클래스 추가 */
$(document).ready(function(){
    $("thead tr").each(function(index){
        var len = $(this).children().length;
        var add = 0;
        var plus = 0;
        var jn;

        for(var i=0; i<len; i++){
            var str = $(this).children().eq(i).attr("class").split(" ");
            if(str.length > 1){
                for(j=0; j<str.length; j++){
                    if(str[j] == "displaynone"){
                        jn = j;
                    }
                }
            }else{
                jn = 0;
            }

            if(str[jn] == "displaynone"){
                add++;
            }else{
                plus = i;
            }
        }
        if(add == 0){ // displaynone이 아닌 경우, 마지막 노드에 클래스 추가
            $(this).children().eq((len-1)).addClass("last");
        }else{
            $(this).children().eq(plus).addClass("last");
        }
    });

    $("tbody tr").find("th").each(function(index){
        $(this).parent().find("td:last-child").addClass("last");
    });

});