
$(document).ready(function () {


    // SMOOTH SCROLL
    $('.js-scrollTo').on('click', function () { // Au clic sur un élément

        var page = $(this).attr('href'); // Page cible
        $('#fadeForScroll').fadeIn()
        $(page).css('z-index', '3')

        var speed = 1000; // Durée de l'animation (en ms)
        $('html, body').animate({ scrollTop: $(page).offset().top - 150 }, speed, function () {
            $('#fadeForScroll').fadeOut()
            setTimeout(function () {
                $(page).css('z-index', '1')

            }, 300)
        }); // Go
        return false;
    });



    // AFFICHE NOM DE L'UTILISATEUR 

    // localStorage.getItem()

});
