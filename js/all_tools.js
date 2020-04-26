const firebaseConfig = {
    apiKey: "AIzaSyB22w9CYMJV413plCv8yNYRgT0hr096qn8",
    authDomain: "imperator-7e26a.firebaseapp.com",
    databaseURL: "https://imperator-7e26a.firebaseio.com",
    projectId: "imperator-7e26a",
    storageBucket: "imperator-7e26a.appspot.com",
    messagingSenderId: "59630211424",
    appId: "1:59630211424:web:d9329b20431623aa230e05"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
const annee = '2019-2020'




// SECURITE VERIF ID

console.log($('#poste_id').val())
console.log(localStorage.getItem('ID_poste'))
console.log(localStorage.getItem('ID'))

if (($('#poste_id').val() != localStorage.getItem('ID_poste')) || ((localStorage.getItem('ID') == null) || (localStorage.getItem('ID').length != 20))) {
    self.location.href = 'lost_connection.html'
}


$('#logout').on('click', function () {
    localStorage.setItem('ID', null)
    localStorage.setItem('ID_poste', null)
})



// AFFICHE NOM DE L'UTILISATEUR 

db.collection(localStorage.getItem('ID_poste')).doc(localStorage.getItem('ID')).get()
    .then(infos => {
        console.log(infos.data().nom)
        $('#id_nom_user').text(infos.data().prenom + ' ' + infos.data().nom)
    })




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



if (localStorage.getItem('Notif') != 'null') {
    document.getElementById('sound-success').play()
    new Notyf().success({
        message: localStorage.getItem('Notif'),
        duration: 4000,

        position: {
            x: 'center',
            y: 'bottom',
        }
    });
    localStorage.setItem('Notif', null)

}
