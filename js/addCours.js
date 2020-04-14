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


// FORMULAIRE AJOUTER COURS
$('#formulaire_cours').on('submit', function (evt) {

    // [Start] Si le formulaire est validé ...
    if (confirm("Valider l'ajout de ce cours  ?") == true) {
        let infos = $(this).serializeArray()
        evt.preventDefault();

        db.collection('cours').add({
            classe: infos[0].value,
            formateur: infos[1].value,
            module: infos[2].value,
            date: infos[3].value,
            hr_debut: infos[4].value + ':' + infos[5].value,
            hr_fin: infos[6].value + ':' + infos[7].value,
            actif: true
        }).then(ref => {
            console.log('cours ajouté , ID: ', ref.id);
        }).catch(ref => {
            alert("Une erreur est survenue, réessayez ultérieurement")
        })
    }
    //  [End] Si le formulaire est validé ...
    else console.log('Validation refusée')
})


// AFFICHAGE FORMATEUR

// [Start] Récupère tous les formateurs ...  
db.collection('formateurs').get()
    .then(formateurs => {
        formateurs.forEach(formateur => {
            $('#select-formateur').append(`   <option value="${formateur.id}">${formateur.data().nom}  ${formateur.data().prenom} </option  `)
        });
    })
    .then(() => {
        console.log('Affichage formateurs réussi');
    })
    .catch(err => {
        console.log('Error getting informations', err);
    });
// [End] Récupère tous les formateurs ...  




// AFFICHAGE CLASSES

// [Start] Récupère toutes les classes ...  
db.collection('classes').get()
    .then(classes => {
        classes.forEach(classe => {
            $('#select-classe').append(`   <option value="${classe.id}">${classe.data().nom}   </option  `)
        });
    })
    .then(() => {
        console.log('Affichage classes réussi');
    })
    .catch(err => {
        console.log('Error getting informations', err);
    });
// [End] Récupère tous les classes ...  




// AFFICHAGE COURS

// [Start] Quand 'cours' est mofiifé... 
db.collection('cours').onSnapshot(() => {
    $('#CoursTable').DataTable().clear()

    // [Start] Récupère tous les cours actifs ...  
    db.collection('cours').where('actif', '==', true).get()
        .then(cours_actifs => {

            // [Start] Pour chaque cours actif ...
            cours_actifs.forEach(cours => {

                // [Start] Récupère les infos de la classe ...  
                db.collection('classes').doc(cours.data().classe).get()
                    .then(classe => {

                        // [Start] Récupère  les infos du formateur ...  
                        db.collection('formateurs').doc(cours.data().formateur).get()
                            .then(formateur => {

                                $('#CoursTable').DataTable().row.add([
                                    `<td>  ${cours.data().date}</td>`,
                                    `<td>   ${classe.data().nom} </td>`,
                                    `<td> ${formateur.data().prenom}  ${formateur.data().nom} </td>`,
                                    `<td>  ${cours.data().module}</td>`,
                                    `<td>   ${cours.data().hr_debut}  </a> </td>`,
                                    `<td> ${cours.data().hr_fin} </td>`,
                                    `<td>  lol</td>`,


                                ]).draw();

                            })
                        // [End] Récupère  les infos du formateur ...  
                    })
                // [End] Récupère les infos de la classe ...  
            });
            // [End] Pour chaque cours actif ...

        })
        .then(() => {
            console.log('Affichage cours réussi');
        })
        .catch(err => {
            console.log('Error getting informations', err);
        });
    // [End] Récupère tous les cours actifs ...  

});
// [End] Quand 'cours' est mofiifé...


