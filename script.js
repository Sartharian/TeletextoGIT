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
        //1- Definir formato del texto (parrafos con salto de linea) = LISTO
        //2- Definir objetos:
        /*   Letra-> titulo-art-cuerpo-dur-cantparrafos = LISTO 
             Parrafo-> Duracion de muestra = PROX REV
        */
        //3- variables editables en ejecucion: tiempo de velocidad y muestra = LISTO

        // Ocultar barra de progreso
        $("#total").parent().removeClass("hidden");

        // Separa los parrafos de la cancion
        var _bod = $(".source").text().split("."); 
        var _t = _bod.length; // cantidad de parrafos
        var _i = 0; // inicio de lectura
        var DEBUG = false; // Muestra texto en consola
        var _k = false; // Modo karaoke

        // HACK: (en la prox rev esto ya no servirá) duracion entre frases 
        var _d = parseInt($("#vel_lect").val().replace(".", ",")) * 1000; 

        // Convierte cada oración deltexto en span faddeables
        // Ojo: se opera con el texto que está dentro del documento
        for (var elems = 0; elems < _t; elems++) {
            var _c = $(document.createElement("span"));
            $(_c).html(_bod[elems] + "<br />").hide();
            $(_c).appendTo($(".dest"));
        }

        function recursive() {
            // la recursividad termina cuando se alcanza el total de frases
            if (_i > _t) return;

            // Selector de frases segun posicion dentro del total
            var opt = $(".dest span").eq(_i % _t);

            // Seguimiento de estado (ejecución recursiva!)
            var _e = _i + 1;

            // Conteo de parrafos (Util para el debug)
            if (_gats.length === 0) {
                if (DEBUG) {
                    console.log("Recursive gatillado!:\n" +
                        "Parrafos a mostrar: " + _t);
                }
            }

            // Creamos un listado de desencadenadores 
            // (Se usa para luego detenerlos)
            _gats.push(
                setTimeout(function () {
                    // Desresaltamos (?) previamente el texto
                    $(".dest span").each(function (i, elem) {
                        $(elem).removeClass("text-warning");
                    });
                    // Descomentar para verlo como karaoke
                    // if(_k) $(opt).prev().remove();

                    // Barra de progreso de lectura
                    $("#total").css("width", Math.floor(_e * 100 / _t) + "%");

                    // Resaltamos el texto a mostrar (El callback del fadeIn puede no ser necesario)
                    $(opt).addClass("text-warning").fadeIn(1200, function () {          
                        if (DEBUG) console.log("Progreso: " + Math.floor(_e * 100 / _t) + "%");
                    });

                    //El desplazamiento ocurre cuando no esta activado el modo karaoke
                    if(!_k) $("html, body").animate({ scrollTop: "+="+$("html, body").height() + "px" }, "linear");

                }, _d * _i) // [duración de la muestra X posicion actual de muestra]
            );    
            _i++; // posicion en que estamos

            //Ejecucion recursiva
            recursive();
        }

        // Llamada de ejecución
        recursive();
    }); 
});