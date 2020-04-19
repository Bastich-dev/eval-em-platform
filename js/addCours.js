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
            salle: infos[8].value,
            actif: true,
        }).then(ref => {
            db.collection('formateurs').doc(infos[1].value).update({
                cours: firebase.firestore.FieldValue.arrayUnion(ref.id)
            });
            console.log('cours ajouté , ID: ', ref.id);
        }).catch(ref => {
            alert("Une erreur est survenue, réessayez ultérieurement")
        })
    }
    //  [End] Si le formulaire est validé ...
    else evt.preventDefault();
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
                                    `<td> <a href="espace_admin_classe.html" class='goToClasse' id ='${classe.id}'>  ${classe.data().nom}    </a> </td>`,
                                    `<td> <a href="espace_admin_user.html" class='goToUser formateurs'  id ='${formateur.id}'>  ${formateur.data().nom}  ${formateur.data().prenom}  </a> </td>`,
                                    `<td>  ${cours.data().module}</td>`,
                                    `<td>   ${cours.data().hr_debut}  </a> </td>`,
                                    `<td> ${cours.data().hr_fin} </td>`,
                                    `<td> ${cours.data().salle} </td>`,
                                    `<td>  </td>`,


                                ]).draw();


                                $('.goToUser').on('click', function () {
                                    const goToPoste = $(this).attr('class').split(' ')
                                    localStorage.setItem("editUser", $(this).attr('id'));
                                    localStorage.setItem("editUserPoste", goToPoste[1]);
                                })
                                $('.goToClasse').on('click', function () {

                                    localStorage.setItem("editClasse", $(this).attr('id'));

                                })
                            })
                        // [End] Récupère  les infos du formateur ...  
                    })
                // [End] Récupère les infos de la classe ...  
            });
            // [End] Pour chaque cours actif ...

        })
        .catch(err => {
            console.log('Error getting informations', err);
        });
    // [End] Récupère tous les cours actifs ...  

});
// [End] Quand 'cours' est mofiifé...


