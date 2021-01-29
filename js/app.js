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