function irArriba(pxPantalla) {
    window.addEventListener("scroll", () => {
        var scroll = document.documentElement.scrollTop;
        var btnArriba = document.getElementById("btnArriba");

        if (scroll > pxPantalla) {
            btnArriba.style.right = 20 + "px";
        } else {
            btnArriba.style.right = -100 + "px";
        }
    })
}

irArriba(500);

$('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:3
        }
    }
})