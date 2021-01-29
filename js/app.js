function irArriba(pxPantalla) {
    window.addEventListener("scroll", () => {
        var scroll = document.documentElement.scrollTop;
        console.log("🚀 ~ file: app.js ~ line 4 ~ window.addEventListener ~ scroll", scroll)
        var btnArriba = document.getElementById("btnArriba");

        if (scroll > pxPantalla) {
            btnArriba.style.right = 20 + "px";
        } else {
            btnArriba.style.right = -100 + "px";
        }
    })
}

irArriba(500);