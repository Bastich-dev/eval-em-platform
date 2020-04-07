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

    console.log(infos)

    if (confirm("Valider l'ajout de cet utilisateur ?") == true) {


        let poste = ''
        if (infos[4].value == 'eleve') poste = 'eleves'

        db.collection(poste).add({
            nom: infos[0],
            prenom: infos[1],
            classe: infos[1],
            identifiant: "",
            password: ""
        }).then(ref => {
            console.log('élève ajouté , ID: ', ref.id);
        });



    }
    else console.log('Validation refusée')
    console.log(infos)
})

