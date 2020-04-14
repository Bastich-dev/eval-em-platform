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



// FORMULAIRE AJOUTER UTILISATEUR
$('#formulaire').on('submit', function (evt) {

    // [Start] Si le formulaire est validé ...
    if (confirm("Valider l'ajout de cet utilisateur ?") == true) {
        let infos = $(this).serializeArray()
        evt.preventDefault();
        const identifiant = ((infos[0].value.slice(0, 2)).toUpperCase() + (infos[1].value).toLowerCase()) + getRandomInt(9) + getRandomInt(9) + getRandomInt(9) + getRandomInt(9)
        const mdp = generatePassword()



        // [Start] Si on ajoute un élève ...
        if ($('#input-poste').val() == 'eleve') {
            db.collection('eleves').add({
                nom: infos[0].value,
                prenom: infos[1].value,
                classe: infos[2].value,
                mail: infos[3].value,
                identifiant: identifiant,
                password: mdp,
                indicator_1: 1,
                indicator_2: 1,
                indicator_3: 1,
                poste: 'Élève',
                absences: []
            }).then(ref => {
                console.log('élève ajouté , ID: ', ref.id);
                localStorage.setItem("editUser", ref.id);
                localStorage.setItem("editUserPoste", 'eleves');
                self.location.href = 'espace_admin_user.html'
            }).catch(() => {
                alert("Une erreur est survenue dans l'ajout, réessayez ultérieurement")
                confirm('lol')
            })
        }
        // [End] Si on ajoute un élève ...


        // [Start] Si on ajoute un formateur ...
        else if ($('#input-poste').val() == 'formateur') {
            db.collection('formateurs').add({
                nom: infos[0].value,
                prenom: infos[1].value,
                mail: infos[2].value,
                identifiant: identifiant,
                password: mdp,
                cours: [],
                poste: 'Formateur',
            }).then(ref => {
                console.log('formateur ajouté , ID: ', ref.id);
                localStorage.setItem("editUser", ref.id);
                localStorage.setItem("editUserPoste", 'formateurs');
                self.location.href = 'espace_admin_user.html'
            }).catch(() => { alert("Une erreur est survenue dans l'ajout, réessayez ultérieurement") })
        }
        // [End] Si on ajoute un formateur ...

        // [Start] Si on ajoute un administrateur ...
        else if ($('#input-poste').val() == 'admin') {
            let date = '' + new Date()
            date = date.split('GMT')
            console.log(date)
            db.collection('admins').add({
                nom: infos[0].value,
                prenom: infos[1].value,
                mail: infos[2].value,
                identifiant: identifiant,
                password: mdp,
                poste: 'Administrateur',
                date: date[0]
            }).then(ref => {
                console.log('administrateur ajouté , ID: ', ref.id);
                localStorage.setItem("editUser", ref.id);
                localStorage.setItem("editUserPoste", 'admins');
                self.location.href = 'espace_admin_user.html'
            }).catch(() => { alert("Une erreur est survenue, réessayez ultérieurement") })
        }
        // [End] Si on ajoute un administrateur ...

    }
    //  [End] Si le formulaire est validé ...
    else console.log('Validation refusée')
})


// CLICK VIDER CHAMPS
$('#vider_champs').on('click', function () {
    document.getElementById('input-nom').value = ''
    document.getElementById('input-prenom').value = ''
    document.getElementById('input-classe').value = ''
    document.getElementById('input-mail').value = ''
})




// SELECT POSTE AUTO
$("#input-poste").prop("selectedIndex", localStorage.getItem('sidebar-ajout-user'));

// ENABLE INPUT CLASSE POUR ELEVE
document.getElementById('input-poste').addEventListener('change', function () {
    enableClasse()
})
// Première fois quand affichage de la page 
enableClasse()




///////////////////////     FONCTIONS //////////////////////////


// ENABLE INPUT CLASSE POUR ELEVE
function enableClasse() {
    if (document.getElementById('input-poste').value != 'eleve') {
        document.getElementById('input-classe').value = ''
        document.getElementById('input-classe').disabled = true
        document.getElementById('input-classe').required = false
    }
    else {
        document.getElementById('input-classe').disabled = false
        document.getElementById('input-classe').required = true
    }
}

// RANDOM NUMBER
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


// GENERATE PASSWORD
function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}



