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



// AFFICHAGE UTILSATEUR

// [Start] Récupère les infos user quand affiche la page...  
db.collection(localStorage.getItem("editUserPoste")).doc(localStorage.getItem("editUser")).get()
    .then(user => {
        if (!user.exists) {
            console.log('Utilisateur non trouvé');
        }
        // [Start] Si l'utilisateur à été trouvé ...
        else {

            let poste = ''
            if (user.data().poste == 'Élève') poste = 'eleve'
            else if (user.data().poste == 'Formateur') poste = 'formateur'
            else if (user.data().poste == 'Administrateur') poste = 'admin'

            document.getElementById('user-nom').value = user.data().nom
            document.getElementById('user-prenom').value = user.data().prenom
            document.getElementById('user-classe').value = user.data().classe
            document.getElementById('user-mail').value = user.data().mail
            document.getElementById('user-identifiant').value = user.data().identifiant
            document.getElementById('user-poste').value = poste
            document.getElementById('user-password').value = user.data().password
            document.getElementById('user-id').value = localStorage.getItem("editUser")
        }
        // [End] Si l'utilisateur à été trouvé ...
    })
    .catch(err => {
        console.log('Error getting document', err);
    });
// [End] Récupère les infos user quand affiche la page... 




// SUPPRIMER UTILSATEUR

$('#delete_user').on('click', function () {

    // [Start] Si le click est validé ...
    if (confirm('Voulez vous définivement supprimer cet utilisateur ?')) {


        // [Start] Récupère le user en fonction de l'utilisateur entré...  
        db.collection(document.getElementById('user-poste').value + 's').where("identifiant", "==", document.getElementById('user-identifiant').value)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete()
                        .then(() => {
                            self.location.href = 'espace_admin.html'
                        })
                        .catch(function (error) {
                            console.error("Error removing document: ", error);
                        });
                });
            })

            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
        // [End] Récupère le user en fonction de l'utilisateur entré...  
    }
    // [End] Si le click est validé ...
})




// MODIFICATIONS USER

$('#edit_user').on('click', function () {

    // Animation modifs
    $('.editMark').css('background-color', '#28a745')

    // [Start] Update TOUTES les infos user entrés...  
    db.collection(document.getElementById('user-poste').value + 's').doc(document.getElementById('user-id').value).update(
        {
            nom: document.getElementById('user-nom').value,
            prenom: document.getElementById('user-prenom').value,
            classe: document.getElementById('user-classe').value,
            mail: document.getElementById('user-mail').value,
            password: document.getElementById('user-password').value,
            identifiant: document.getElementById('user-identifiant').value,
        })
        .then(() => {
            // Animation modifs
            setTimeout(function () { $('.editMark').css('background-color', 'white') }, 1000)
        });
    // [End] Update TOUTES les infos user entrés...  

})

// [End] Si un changement est détécté
$('.editMark').on('change', function () {

    // Animation modifs
    $(this).css('background-color', 'orange')
})
// [End] Si un changement est détécté



