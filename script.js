$(document).ready(function () {
    var _gats = [];    

    // Esto lo quitaré después
    $('[data-toggle="tooltip"]').tooltip();

    // Gatilla el boton de config para que se apliquen los ajustes de tiempo
    $("#do_mod").click(function () {
        $("#do_stop, #do_play").click();
    });

    // muestra el panel de config
    $("#do_conf").click(function () {
        $("#show_conf").modal("show");
    });

    // Detiene los timeout anidados y restablece todo
    $("#do_stop").click(function () {
        for (var tim = 0; tim < _gats.length; tim++) {
            clearTimeout(_gats[tim]);
        }
        $(".dest").empty();
        $("#total").parent().addClass("hidden");
        $("#total").css("width", "0%");
    });

    //Rutina para cargar elementos.
    $("#do_start").click(function () {
        //1- Definir formato del texto (parrafos con salto de linea)
        //3- Definir objetos:
        /*   Letra-> titulo-art-cuerpo-dur-cantparrafos = LISTO 
             Parrafo-> Duracion de muestra
        */
        //4- variables editables en ejecucion: tiempo de velocidad y muestra

        $("#total").parent().removeClass("hidden");

        //Separa los parrafos de la cancion
        var _bod = $(".source").text().split("."); 
        var _t = _bod.length; // cantidad de parrafos
        var _i = -1; // inicio de lectura
        var DEBUG = false; // Muestra texto en consola
        var _k = false; // Modo karaoke
        var _d = parseInt($("#vel_lect").val().replace(".", ",")) * 1000; // duracion entre frases 

        //Convierte cada oración deltexto en span faddeables
        for (var elems = 0; elems < _t; elems++) {
            var _c = $(document.createElement("span"));
            $(_c).html(_bod[elems] + "<br />").hide();
            $(_c).appendTo($(".dest"));
        }

        function recursive() {
            _i++; //...en la posicion que estamos

            //Alcance de fin de lectura
            if (_i > _t) return;

            //Por cada frase
            var opt = $(".dest span").eq(_i % _t);

            //la mostramos..
            var _e = _i + 1;

            // Creamos un listado de desencadenadores 
            // (Se usa para luego detenerlos)
            _gats.push(
                setTimeout(function () {
                    // Desresaltamos (?) previamente el texto
                    $(".dest span").each(function (i, elem) {
                        $(elem).removeClass("text-warning");
                    });
                    // Descomentar para verlo como karaoke
                    if(_k) $(opt).prev().remove();

                    // Resaltamos el texto a mostrar
                    $(opt).addClass("text-warning").fadeIn(1200, function () {                        
                        $("#total").css("width", Math.floor(_e * 100 / _t) + "%");

                        if (DEBUG) console.log("Progreso: " + Math.floor(_e * 100 / _t) + "%");
                    });

                    if(!_k) $("html, body").animate({ scrollTop: "+="+$("html, body").height() + "px" }, "linear");
                                        
                    if (DEBUG) console.log("Animando elemento [" + _i + "] de [" + _t + "] | Tiempo: " + _d * _i);
                }, _d * _i)
            );            
            //Ejecucion recursiva
            recursive();
        }

        // Llamada de ejecución
        recursive();
    }); 
});