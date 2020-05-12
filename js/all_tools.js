// SET CONST
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

const USER_ID = 'user_tj5B4Sy5rP8kEIPzlRfU2'
const TEMPLATE_ID = 'template_LRgZvfAq'

const first_limit = 3
const second_limit = 10






// SECURITY PASS
if (($('#poste_id').val() != localStorage.getItem('ID_poste')) || ((localStorage.getItem('ID') == null) || (localStorage.getItem('ID').length != 20))) {
    self.location.href = 'lost_connection.html'
}


// LOGOUT FUNCTION
$('#logout').on('click', function () {
    localStorage.setItem('ID', null)
    localStorage.setItem('ID_poste', null)
})



// SHOW USERNAME OF ID
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



// NOTIF WHEN CHANGE PAGE
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




//////////////// FUNCTIONS ////////////////


function cardManager(nb, titre) {

    let card = {
        color: '',
        icon: ``
    }
    if (nb < 3) {
        card.color = 'success'
        card.icon = `<i class="fas fa-check-circle fa-2x text-300 text-success"></i>`
    }
    else if (nb < 10) {
        card.color = 'warning'
        card.icon = `<i class="fas fa-exclamation-triangle fa-2x text-300 text-warning"></i>`
    }
    else if (nb >= 10) {
        card.color = 'danger'
        card.icon = `<i class="fas fa-exclamation-circle fa-2x text-300 text-danger"></i>`
    }

    return `
    <div class="card border-left-${card.color} shadow h-100 py-2">
    <div class="card-body">
      <div class="row no-gutters align-items-center">
        <div class="col mr-2">
          <div class="text-sm font-weight-bold text-${card.color} text-uppercase mb-1">${titre}</div>
          <div class="row no-gutters align-items-center">
            <div class="col-auto">
              <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${nb}</div>
            </div>
          </div>
        </div>
        <div class="col-auto">
        ${card.icon}
        </div>
      </div>
    </div>
    </div>
    `
}




function colorIndicator(indice) {
    let color = ''
    if (indice < first_limit) color = `fas fa-check-circle text-success`
    else if (indice < second_limit) color = `fas fa-exclamation-triangle text-warning`
    else if (indice >= second_limit) color = `fas fa-exclamation-circle text-danger`
    return color
}


function getDateFromHours(time) {
    time = time.split(':');
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
}


function setColorIndicator(id) {


    let absences_semaine = 0
    let absences_mois = 0
    let absences_trimestre = 0
    let absences_non_justifiee = 0



    db.collection('absences').where('eleve', '==', id).get().then((doc) => {



        doc.forEach((elem) => {

            let date = Date.parse(elem.data().date)
            let trimestre = [
                Date.parse(annee.split('-')[0] + '-08-31'),
                Date.parse(annee.split('-')[0] + '-12-31'),
                Date.parse(annee.split('-')[1] + '-03-31'),
                Date.parse(annee.split('-')[1] + '-06-31')
            ]

            const today = new Date();
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
            let sem_now = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

            const today2 = new Date(elem.data().date);
            const firstDay = new Date(today2.getFullYear(), 0, 1);
            const pastDays = (today2 - firstDay) / 86400000;
            let sem_abs = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);


            if (sem_now == sem_abs) absences_semaine += 1


            let this_month = '' + (new Date().getMonth() + 1)
            if (this_month.length != 2) this_month = '0' + this_month
            if (this_month == elem.data().date.slice(5, 7)) absences_mois += 1

            let datenow = new Date()
            for (let i = 0; i < trimestre.length; i++) {
                if (datenow < trimestre[i]) datenow = i
            }

            if ((date < trimestre[datenow]) && (date > trimestre[datenow - 1])) absences_trimestre += 1

        })
    })



    db.collection('absences').where('eleve', '==', id).onSnapshot((abs) => {
        abs.forEach((elem) => {
            if (elem.data().justifiee == false) absences_non_justifiee += 1
        })
    })


    return [absences_semaine, absences_mois, absences_trimestre, absences_non_justifiee]
}




function getDateFromHours(time) {
    time = time.split(':');
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
}


function getRetard(absence) {
    let retard_hours = ''
    let retard_minutes = ''

    if (absence.data().retard != true) {
        retard_hours += new Date(getDateFromHours(absence.data().hr_debut).getTime() + absence.data().retard * 60000).getHours()
        if (retard_hours.length != 2) retard_hours = '0' + retard_hours

        retard_minutes += new Date(getDateFromHours(absence.data().hr_debut).getTime() + absence.data().retard * 60000).getMinutes()
        if (retard_minutes.length != 2) retard_minutes = '0' + retard_minutes
    }

    return [retard_hours, retard_minutes]
}