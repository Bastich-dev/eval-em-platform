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






$('#formulaire').on('submit', function (evt) {

    // Récupère infos formulaire
    let infos = $(this).serializeArray()
    evt.preventDefault();

    console.log($('#input-poste').val())

    if (confirm("Valider l'ajout de cet utilisateur ?") == true) {

        const identifiant = ((infos[0].value.slice(0, 2)).toUpperCase() + (infos[1].value).toLowerCase()) + getRandomInt(9) + getRandomInt(9) + getRandomInt(9) + getRandomInt(9)
        const mdp = generatePassword()

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

            }).catch(ref => {
                alert("Une erreur est survenue, réessayez ultérieurement")
            })
        }


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
            }).catch(ref => {
                alert("Une erreur est survenue, réessayez ultérieurement")
            })
        }

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
            }).catch(ref => {
                alert("Une erreur est survenue, réessayez ultérieurement")
            })
        }

    }
    else console.log('Validation refusée')
    console.log(infos)
})



function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}




$('#vider_champs').on('click', function () {
    document.getElementById('input-nom').value = ''
    document.getElementById('input-prenom').value = ''
    document.getElementById('input-classe').value = ''
    document.getElementById('input-mail').value = ''
})