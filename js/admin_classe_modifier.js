
db.collection('classes').doc(localStorage.getItem('editClasse')).get()
    .then(classe => {

        db.collection('groupes').get()
            .then(groupes => {

                groupes.forEach(groupe => {

                    $('#classe-groupe').append(`
<option  value="${groupe.id}" >${groupe.id}</option>
`)
                })
            }).then(() => {

                document.getElementById('classe-nom').value = classe.data().nom
                document.getElementById('classe-groupe').value = classe.data().groupe

            })



    })




$('#edit').on('click', function () {


    // Animation modifs
    $('.editMark').css('background-color', '#28a745')
    $('.editMark').css('color', 'white')
    db.collection('classes').doc(localStorage.getItem('editClasse')).get()
        .then(classe => {
            if (!classe.exists) {
                console.log('Utilisateur non trouvé');
            }
            // [Start] Si l'utilisateur à été trouvé ...
            else {

                db.collection('groupes').doc(document.getElementById('classe-groupe').value).update({
                    classes: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('editClasse'))
                })

                // Delete id eleve dans le tableau eleve de la  classe
                db.collection('groupes').doc(classe.data().groupe).update({
                    classes: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('editClasse'))
                }).then(() => {

                    db.collection('classes').doc(localStorage.getItem('editClasse')).update(
                        {
                            nom: document.getElementById('classe-nom').value,
                            groupe: document.getElementById('classe-groupe').value
                        })
                        .then(() => {
                            document.getElementById('sound-success').play()
                            new Notyf().success({
                                message: "La classe a été modifié avec succès",
                                duration: 2000,
                                position: {
                                    x: 'center',
                                    y: 'bottom',
                                }
                            });
                            // Animation modifs
                            setTimeout(function () {
                                $('.editMark').css('background-color', 'white');
                                $('.editMark').css('color', 'black')
                            }, 1500)
                        });

                })
            }
        })

})

// [End] Si un changement est détécté
$('.editMark').on('change', function () {
    // Animation modifs
    $(this).css('background-color', 'orange')

})



$('#delete').on('click', function () {

    // [Start] Si le click est validé ...
    if (confirm('Voulez vous définivement supprimer cette classe ?\nCela supprimera aussi toutes les données des élèves assignés à cette classe ')) {


        // [Start] Récupère le user en fonction de l'utilisateur entré...  
        db.collection('classes').where("nom", "==", document.getElementById('classe-nom').value)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete()
                        .then(() => {
                            // Delete id eleve dans le tableau eleve de la  classe
                            db.collection('groupes').doc(doc.data().groupe).update({
                                classes: firebase.firestore.FieldValue.arrayRemove(doc.id)
                            })


                            db.collection('eleves').where("classe", "==", localStorage.getItem('editClasse'))
                                .get()
                                .then(eleves => {
                                    eleves.forEach((eleve) => {

                                        eleve.ref.delete().then(() => {

                                            db.collection('absences').where("eleve", "==", eleve.id).get().then((absences) => {
                                                absences.ref.delete().then(() => {
                                                    db.collection('justifications').where("absence", "==", absences.id).get().then((justifs) => {
                                                        justifs.ref.delete().then(() => {
                                                            self.location.href = 'espace_admin_classes.html'
                                                            localStorage.setItem('Notif', 'La classe et tous ses élèves ont été supprimées')
                                                        })
                                                    })
                                                    self.location.href = 'espace_admin_classes.html'
                                                    localStorage.setItem('Notif', 'La classe et tous ses élèves ont été supprimées')
                                                })
                                            })
                                            self.location.href = 'espace_admin_classes.html'
                                            localStorage.setItem('Notif', 'La classe et tous ses élèves ont été supprimées')
                                        })

                                    })
                                    self.location.href = 'espace_admin_classes.html'
                                    localStorage.setItem('Notif', 'La classe et tous ses élèves ont été supprimées')
                                })





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


db.collection('classes').doc(localStorage.getItem('editClasse')).get()
    .then(classe => {

        // [Start] Pour chaque formateur ...
        classe.data().eleves.forEach(eleve_id => {

            db.collection('eleves').doc(eleve_id).get()
                .then(eleve => {

                    $('#EleveClasse').DataTable().row.add([
                        `<td> <a href="espace_admin_utilisateur_modifier.html" class='goToUser eleves'  id ='${eleve.id}'>  ${eleve.data().nom}  ${eleve.data().prenom}  </a> </td>`,
                        `<td> ${eleve.data().mail} </td>`,
                        ` <td> ${eleve.data().absences.length} </td>`,
                    ]).draw();

                    $('.goToUser').unbind()
                    $('.goToUser').bind('click', function () {
                        const goToPoste = $(this).attr('class').split(' ')
                        localStorage.setItem("editUser", $(this).attr('id'));
                        localStorage.setItem("editUserPoste", goToPoste[1]);
                    })
                })



        });
        // [End] Pour chaque formateur ...
    })

    .catch(err => {
        console.log('Error getting informations', err);
    });
// [End] Récupère tous les formateurs ...


$('#ajout-message').on('submit', function (evt) {

    let infos = $(this).serializeArray()
    evt.preventDefault();

    console.log(infos)

    let titre = infos[0].value
    let message = infos[1].value
    message = message.replace(/ /g, '£')
    message = message.replace(/\n/g, '</br>')
    message = titre + 'ZYX' + message

    db.collection('classes').doc(localStorage.getItem('editClasse')).update({
        messages: firebase.firestore.FieldValue.arrayUnion(message)
    });
    document.getElementById('sound-success').play()
    new Notyf().success({
        message: 'Le message a été ajouté avec succès',
        duration: 4000,

        position: {
            x: 'center',
            y: 'bottom',
        }
    });

})


db.collection('classes').doc(localStorage.getItem('editClasse')).onSnapshot(() => {
    $('#affiche_message').empty()


    db.collection('classes').doc(localStorage.getItem('editClasse')).get()
        .then(classe => {
            if (!classe.exists) {
                console.log('Utilisateur non trouvé');
            }
            else {

                // [Start] Pour chaque formateur ...
                classe.data().messages.forEach(message => {

                    let infos_message = message.replace(/£/g, ' ')

                    $('#affiche_message').append(`
<div class="card m-4  border-bottom-secondary">
<div class="card-body">
  <b>${infos_message.split('ZYX')[0]}</b>
  <input type="button" class="btn btn-primary delete_message" value="Supprimer" style="float: right;"> <br><br>
  
<div class='mess'>${infos_message.split('ZYX')[1]}</div >

</div >
</div >
                `)

                    $('.delete_message').unbind()
                    $('.delete_message').bind('click', function () {

                        db.collection('classes').doc(localStorage.getItem('editClasse')).update({
                            messages: firebase.firestore.FieldValue.arrayRemove(infos_message.replace(/ /g, '£'))
                        });
                        document.getElementById('sound-success').play()
                        new Notyf().success({
                            message: 'Le message a été supprimé avec succès',
                            duration: 4000,

                            position: {
                                x: 'center',
                                y: 'bottom',
                            }
                        });

                    })
                    // [End] Pour chaque formateur ...
                })



            }


        })


        .catch(err => {
            console.log('Error getting informations', err);
        });
    // [End] Récupère tous les formateurs ...





})



