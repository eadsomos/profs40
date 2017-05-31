function trocar(id) {
       var e = document.getElementById(id);
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
    }

function changeText(idElement) {
    var element = document.getElementById('mais-menos' + idElement);
    if (idElement === 1 || idElement === 2) {
        if (element.innerHTML === '[ + ]') element.innerHTML = '[ - ]';
        else {
            element.innerHTML = '[ + ]';
        }
    }
}



//$(function () {
//    $(".accordion2 span").show();
  //  setTimeout("$('.accordion2 span').slideToggle('slow');", 1000);
    //$("h4.accordion2").click(function () {
      //  $(this).next(".pane").slideToggle("slow").siblings(".pane:visible").slideUp("slow");
        //$(this).toggleClass("current");
        //$(this).siblings("h4").removeClass("current");
    //});
//});