$(document).ready(function(){
    //실시간 계좌이체, 에스크로 결제 수단 제외 처리
    $('#addr_paymethod').find("option[value='tcash']").remove();
    $('#addr_paymethod').find("option[value='esc_vcash']").remove();
    $('#payment_input_tcash').hide();
    $('#payment_input_esc_vcash').hide();
});

order = {

    //결제 로딩바 제거, Element 복구
    dLoadingHide:function()
    {
        $('input, a, select, button, textarea, .trigger').show();
        $('#progressPaybar').hide();
    },

    //결제진행
    processPayModule:function()
    {
        $('#progressPaybarView').hide();
        document.getElementById('payReqForm').target = '';
        document.getElementById('payReqForm').CAFE24EncData.value = '';

        if ( $('#addr_paymethod').val() == 'cell' ) {
            //휴대폰결제
            processCellPay(document.getElementById('payForm'));
        }else{
            //결제진행 (PG쪽 js)
            processPay(document.getElementById('payForm'));
        }

        window.scrollTo(0,0);
    },

    SSLencryptSubmit:function(frmName, callbackName)
    {
        var aData = new Array();
        var hObjList = document.getElementById(frmName);
        for (var i=0; i<hObjList.length; i++)
        {
            if (hObjList[i].name && hObjList[i].name != 'CAFE24EncData')
            {
                aData[aData.length] = 'frm_order_act::'+hObjList[i].name;
            }
        }

        AuthSSLManager.weave({
            'auth_mode': 'encrypt1.9'
            , 'aEleId': aData
            , 'auth_callbackName': callbackName
        });
    },

    payEncSubmit_Complete:function(output)
    {
        var payReqForm = document.getElementById('payReqForm');
        var payForm = document.getElementById('payForm');
        var sParam;

        if ( AuthSSLManager.isError(output) == true )
        {
            alert('[ERR-03] 결제시도중 오류발생');
            order.dLoadingHide();
            return;
        }

        //요청용 히든폼에 변수대입
        payReqForm.CAFE24EncData.value = encodeURIComponent(output);

        payReqForm.pgName.value = payForm.pgName.value;
        payReqForm.reqType.value = payForm.reqType.value;
        payReqForm.action = '/Pay/request.php';
        payReqForm.submit();
    },

    //결제결과 리턴
    processPayResult:function(bType)
    {
        if (bType === true)
        {
            order.SSLencryptSubmit('payForm', 'order.payEncSubmit_Complete');
        }else{
            //폼영역을 초기화하여 재활용이 가능하게끔 함
            $('#paymentFormWrap').html('');

            try
            {
                var frmObj = document.createElement('<form name="payForm">');
            }
            catch (e)
            {
                var frmObj = document.createElement('form');
                frmObj.setAttribute('name', 'payForm');
            }
            frmObj.setAttribute('id', 'payForm');
            frmObj.setAttribute('method', 'post');
            frmObj.setAttribute('action', '/Pay/request.php');

            document.getElementById('paymentFormWrap').appendChild(frmObj);
        }
    }

};