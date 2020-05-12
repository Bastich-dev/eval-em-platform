
// SET INPUTS & OPTIONS
db.collection('classes').doc(localStorage.getItem('editClasse')).get()
    .then(classe => {
        db.collection('groupes').get()
            .then(groupes => {
                groupes.forEach(groupe => {
                    $('#classe-groupe').append(`<option  value="${groupe.id}" >${groupe.id}</option>`)
                })
            }).then(() => {
                document.getElementById('classe-nom').value = classe.data().nom
                document.getElementById('classe-groupe').value = classe.data().groupe
            })
    })



// BUTTON EDIT ON CLICK
$('#edit').on('click', function () {


    // Animation modifs
    $('.editMark').css('background-color', '#28a745')
    $('.editMark').css('color', 'white')


    db.collection('classes').doc(localStorage.getItem('editClasse')).get()
        .then(classe => {
            if (!classe.exists) console.log('Utilisateur non trouvé');
            else {


                // Set & delete groupe of class
                db.collection('groupes').doc(document.getElementById('classe-groupe').value).update({
                    classes: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('editClasse'))
                })
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



// IF EDIT VALUE
$('.editMark').on('change', function () {
    $(this).css('background-color', 'orange')
})


// BUTTON DELETE ON CLICK
$('#delete').on('click', function () {

    if (confirm('Voulez vous définivement supprimer cette classe ?\nCela supprimera aussi toutes les données des élèves assignés à cette classe ')) {

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
                });
            })
    }
})




// SET STUDENTS DATATABLE
db.collection('classes').doc(localStorage.getItem('editClasse')).get()
    .then(classe => {
        classe.data().eleves.forEach(eleve_id => {
            db.collection('eleves').doc(eleve_id).get()
                .then(eleve => {
                    let absences_semaine = 0
                    let absences_mois = 0
                    let absences_trimestre = 0
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
                    $('#absences-semaine').append(cardManager(absences_semaine, 'Absences cette semaine'))
                    $('#absences-trimestre').append(cardManager(absences_trimestre, 'Absences ce trimestre'))
                    $('#absences-mois').append(cardManager(absences_mois, 'Absences ce mois-ci'))
                    db.collection('absences').where('eleve', '==', localStorage.getItem('editUser')).onSnapshot((abs) => {
                        let absences_non_justifiee = 0
                        abs.forEach((elem) => {
                            if (elem.data().justifiee == false) absences_non_justifiee += 1
                        })
                        $('#absences-justifier').empty()
                        $('#absences-justifier').append(cardManager(absences_non_justifiee, 'Absences à justifier'))
                    })
                    $('#EleveClasse').DataTable().row.add([
                        `<td> <a href="espace_admin_utilisateur_modifier.html" class='goToUser eleves'  id ='${eleve.id}'>  ${eleve.data().nom}  ${eleve.data().prenom}  </a> </td>`,
                        `<td> ${eleve.data().mail} </td>`,
                        ` <td>  <div class="d-flex">
                        <div class="col-auto">
                          <i class="  ${ colorIndicator(absences_semaine)} text-300" ></i>
                        </div>
                        <div class="col-auto">
                          <i class="${ colorIndicator(absences_mois)} text-300" style="color: #1cc88a;"></i>
                        </div>
                        <div class="col-auto">
                          <i class="${ colorIndicator(absences_trimestre)}  text-300" style="color: #f6c23e;"></i>
                        </div>
                        <div class="col-auto">
                        <i class="${ colorIndicator(absences_non_justifiee)}  text-300" style="color: #f6c23e;"></i>
                      </div>
                      </div> </td>`,
                    ]).draw();
                })
        });
    })


// SET GOTOUSER ON CLICK
$('#EleveClasse').on('click', '.goToUser', function () {
    const goToPoste = $(this).attr('class').split(' ')
    localStorage.setItem("editUser", $(this).attr('id'));
    localStorage.setItem("editUserPoste", goToPoste[1]);
})


// ADD MESSAGE ON CLICK
$('#ajout-message').on('submit', function (evt) {

    const infos = $(this).serializeArray()
    evt.preventDefault();

    const titre = infos[0].value
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



// SET MESSAGES
db.collection('classes').doc(localStorage.getItem('editClasse')).onSnapshot(() => {

    $('#affiche_message').empty()
    db.collection('classes').doc(localStorage.getItem('editClasse')).get()
        .then(classe => {
            if (!classe.exists) console.log('Utilisateur non trouvé');
            else {
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
                })
            }
        })
})
