$(document).ready(function () {
    $('#trigger').click(function () {
        $('#overlay').fadeIn(300);
    });

    $('.closebtn').click(function () {
        $('#overlay').fadeOut(300);
    });
});

