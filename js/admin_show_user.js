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

let Ref = db.collection(localStorage.getItem("editUserPoste")).doc(localStorage.getItem("editUser"));
Ref.get()
    .then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
        } else {

            const infos_user = doc.data()
            let poste = ''
            if (infos_user.poste == 'Élève') poste = 'eleve'
            else if (infos_user.poste == 'Formateur') poste = 'formateur'
            else if (infos_user.poste == 'Administrateur') poste = 'admin'


            document.getElementById('user-nom').value = infos_user.nom
            document.getElementById('user-prenom').value = infos_user.prenom
            document.getElementById('user-classe').value = infos_user.classe
            document.getElementById('user-mail').value = infos_user.mail
            document.getElementById('user-identifiant').value = infos_user.identifiant
            document.getElementById('user-poste').value = poste
            document.getElementById('user-password').value = infos_user.password
            document.getElementById('user-id').value = localStorage.getItem("editUser")
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });

$('#delete_user').on('click', function () {
    if (confirm('Voulez vous définivement supprimer cet utilisateur ?')) {
        db.collection(document.getElementById('user-poste').value).where("identifiant", "==", document.getElementById('user-identifiant').value)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete().then(() => {
                        self.location.href = 'espace_admin.html#admin-eleve'
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });
                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }
})


$('#edit_user').on('click', function () {




    $('.editMark').css('background-color', '#28a745')
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
            setTimeout(function () { $('.editMark').css('background-color', 'white') }, 1000)
        });


})


$('.editMark').on('change', function () {
    $(this).css('background-color', 'orange')
})



