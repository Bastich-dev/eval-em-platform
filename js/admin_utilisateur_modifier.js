



// AFFICHAGE UTILSATEUR

console.log(localStorage.getItem("editUserPoste"))
console.log(localStorage.getItem("editUser"))

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
            document.getElementById('user-mail').value = user.data().mail
            document.getElementById('user-identifiant').value = user.data().identifiant
            document.getElementById('user-poste').value = poste
            document.getElementById('user-password').value = user.data().password
            document.getElementById('user-id').value = localStorage.getItem("editUser")


            if (localStorage.getItem("editUserPoste") == 'eleves') {
                // AFFICHAGE SELECT CLASSE
                db.collection('classes').get()
                    .then(classes => {
                        // [Start] Pour chaque formateur ...
                        classes.forEach(classe => {
                            $('#user-classe').append(`
<option  value="${classe.id}"  id="${classe.id}">${classe.data().nom}</option>
`)
                        })
                    }).then(() => {
                        document.getElementById('user-classe').value = user.data().classe
                        db.collection('classes').doc(user.data().classe).get()
                            .then(groupe => {
                                document.getElementById('user-groupe').value = groupe.data().groupe
                            })

                    })
            }
            else {
                document.getElementById('user-classe').value = ''
                document.getElementById('user-classe').disabled = true
                document.getElementById('user-classe').required = false
            }



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

                            if (document.getElementById('user-poste').value + 's' == 'eleves') {
                                // Delete id eleve dans le tableau eleve de la  classe
                                db.collection('classes').doc(doc.data().classe).update({
                                    eleves: firebase.firestore.FieldValue.arrayRemove(doc.id)
                                }).then(() => {
                                    localStorage.setItem('Notif', "L'utlisateur a été supprimé avec succès")
                                    self.location.href = 'espace_admin_utilisateurs.html'
                                })
                            }
                            else if (document.getElementById('user-poste').value + 's' == 'formateurs') {

                                db.collection('cours').where("formateur", "==", document.getElementById('user-id').value)
                                    .get()
                                    .then(querySnapshot => {


                                        querySnapshot.forEach((doc) => {
                                            console.log(doc.data())
                                            doc.ref.delete().then(() => {
                                                localStorage.setItem('Notif', "L'utlisateur a été supprimé avec succès")
                                                self.location.href = 'espace_admin_utilisateurs.html'
                                            })

                                        }).then(() => {
                                            localStorage.setItem('Notif', "L'utlisateur a été supprimé avec succès")
                                            self.location.href = 'espace_admin_utilisateurs.html'
                                        })
                                    })
                            }
                            self.location.href = 'espace_admin_utilisateurs.html'
                            localStorage.setItem('Notif', "L'utlisateur a été supprimé avec succès")



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
    $('.editMark').css('color', 'white')


    console.log(document.getElementById('user-poste').value + 's')
    console.log(document.getElementById('user-id').value)
    db.collection(document.getElementById('user-poste').value + 's').doc(document.getElementById('user-id').value).get()
        .then(user => {
            if (!user.exists) {
                console.log('Utilisateur non trouvé');
            }

            else {

                if (document.getElementById('user-poste').value + 's' == 'eleves') {
                    // Delete id eleve dans le tableau eleve de la  classe
                    db.collection('classes').doc(user.data().classe).update({
                        eleves: firebase.firestore.FieldValue.arrayRemove(document.getElementById('user-id').value)
                    }).then(() => {

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


                                // Ajoute id eleve dans le tableau eleve de la  classe
                                console.log(document.getElementById('user-classe').value)
                                db.collection('classes').doc(document.getElementById('user-classe').value).update({
                                    eleves: firebase.firestore.FieldValue.arrayUnion(document.getElementById('user-id').value)
                                });


                                // Animation modifs

                            });
                        // [End] Update TOUTES les infos user entrés...  


                    })
                }
                else {

                    db.collection(document.getElementById('user-poste').value + 's').doc(document.getElementById('user-id').value).update(
                        {
                            nom: document.getElementById('user-nom').value,
                            prenom: document.getElementById('user-prenom').value,
                            mail: document.getElementById('user-mail').value,
                            password: document.getElementById('user-password').value,
                            identifiant: document.getElementById('user-identifiant').value,
                        })

                    // Animation modifs


                }
                // [End] Update TOUTES les infos user entrés...  

                setTimeout(function () {
                    $('.editMark').css('background-color', 'white');
                    $('.editMark').css('color', 'black')
                    $('#user-poste').css({ 'background-color': '#ebebf5', 'color': 'grey' })
                    $('#user-groupe').css({ 'background-color': '#ebebf5', 'color': 'grey' })
                    if (document.getElementById('user-poste').value + 's' != 'eleves') $('#user-classe').css({ 'background-color': '#ebebf5', 'color': 'grey' })

                }, 1500)

                document.getElementById('sound-success').play()
                new Notyf().success({
                    message: "L'utilisateur a été modifié avec succès",
                    duration: 2000,
                    position: {
                        x: 'center',
                        y: 'bottom',
                    }
                });


            }

        })

})


// [End] Si un changement est détécté
$('.editMark').on('change', function () {



    db.collection('classes').doc(document.getElementById('user-classe').value).get()
        .then(classe => {

            document.getElementById('user-groupe').value = classe.data().groupe

        })

    // Animation modifs
    $(this).css('background-color', 'orange')
    // [End] Si un changement est détécté


})




