function kiemtraText(idText, strInfor)
{
    objText = document.getElementById(idText);
    tb = document.getElementById("thongbao");
    if(objText.value == "")
    {
        tb.innerHTML = "Vui lòng nhập " + strInfor;
        tb.style.color = "red";
        objText.focus();
        return false;
    }

    if(isNaN(objText.value) == true)
    {
        tb.innerHTML = "Bạn phải nhập số cho " + strInfor;
        tb.style.color = "red";
        objText.select();
        return false;
    }
    if(parseFloat(objText.value) <=0)
    {
        tb.innerHTML = strInfor + " phải >0";
        tb.style.color = "red";
        objText.select();
        return false;
    }
    tb.innerHTML="";
    return true;
}


function kiemtra()
{
    chatluong = document.getElementById("service");
    tb = document.getElementById("thongbao");
    if(kiemtraText("bill", "Tổng tiền thanh toán")==false)
        return false;
    
    i = chatluong.selectedIndex;
    if(i == 0)
    {
        tb.innerHTML = "Bạn chưa chọn chất lượng dịch vụ..";
        tb.style.color = "red";
        return false;
    }

    if(kiemtraText("people", "Số người nhận")==false)
        return false;
    
    tb.innerHTML = "";
    return true;
}

function tinhtientip()
{
    if(kiemtra() == true)
    {
        tongbill = document.getElementById("bill");
        chatluong = document.getElementById("service");
        people =  document.getElementById("people");
        i = chatluong.selectedIndex;
        tientip = (parseFloat(tongbill.value)*parseFloat(chatluong[i].value))/100/parseFloat(people.value);
        tb.innerHTML = "TIP AMOUNT <br>" + tientip + "  <img src = 'dollar.png'>" + "<br> Each";
        tb.style.color = "black";
    }
}