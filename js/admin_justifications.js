
// [Start] Récupère toutes les classes ... 
db.collection('absences').where('justifiee', '==', false).onSnapshot(doc => {
    $('#AbsTable').DataTable().clear()
    // [Start] Pour chaque classe ...
    doc.forEach(absence => {

        db.collection('eleves').doc(absence.data().eleve).get()
            .then(eleve => {

                db.collection('classes').doc(eleve.data().classe).get()
                    .then(classe => {


                        let retard_hours = ''
                        let retard_minutes = ''

                        if (absence.data().retard != true) {
                            retard_hours += new Date(getDateFromHours(absence.data().hr_debut).getTime() + absence.data().retard * 60000).getHours()
                            if (retard_hours.length != 2) retard_hours = '0' + retard_hours

                            retard_minutes += new Date(getDateFromHours(absence.data().hr_debut).getTime() + absence.data().retard * 60000).getMinutes()
                            if (retard_minutes.length != 2) retard_minutes = '0' + retard_minutes
                        }

                        $('#AbsTable').DataTable().row.add([
                            `<td> <a href="espace_admin_utilisateur_modifier.html" class='goToUser eleves' id ='${eleve.id}'>  ${eleve.data().prenom}  ${eleve.data().nom}    </a> </td>`,
                            `<td> ${eleve.data().mail} </td>`,
                            `<td> <a href="espace_admin_classe_modifier.html" class='goToClasse' id ='${classe.id}'> ${classe.data().nom}    </a> </td>`,
                            `<td> ${absence.data().date} </td>`,
                            `<td> ${absence.data().module} </td>`,
                            `<td> ${absence.data().hr_debut} </td>`,
                            `<td> ${absence.data().retard == false ? absence.data().hr_fin : retard_hours + ':' + retard_minutes} </td>`,
                            `<td>  <i id="${absence.id}" class="fas fa-trash-alt fa-2x btn btn-danger delete_cours"> </td>`,
                        ]).draw();

                        $('.goToClasse').unbind()
                        $('.goToClasse').bind('click', function () {

                            localStorage.setItem("editClasse", $(this).attr('id'));

                        })

                        $('.goToUser').unbind()
                        $('.goToUser').on('click', function () {
                            const goToPoste = $(this).attr('class').split(' ')
                            localStorage.setItem("editUser", $(this).attr('id'));
                            localStorage.setItem("editUserPoste", goToPoste[1]);
                        })

                        $('.delete_cours').unbind()
                        $('.delete_cours').on('click', function () {

                            db.collection('absences').doc($(this).attr('id'))
                                .get()
                                .then(doc => {

                                    doc.ref.delete().then(() => {

                                        document.getElementById('sound-success').play()
                                        new Notyf({ duration: 4000, position: { x: 'center', y: 'bottom', } }).success("L'absence a été supprimer avec succès");

                                    })

                                })

                        })

                    })
            })
    });
    // [End] Pour chaque classe ...
})

// [End] Récupère toutes les classes ... 


db.collection('justifications').onSnapshot((justifs) => {

    $('#JustificationsTable').DataTable().clear()
    $('#VerifierTable').DataTable().clear()

    justifs.forEach(justification => {


        db.collection('absences').doc(justification.data().absence).get()
            .then(absence => {

                db.collection('classes').doc(absence.data().classe).get()
                    .then(classe => {
                        db.collection('eleves').doc(absence.data().eleve).get()
                            .then(eleve => {
                                db.collection('formateurs').doc(absence.data().formateur).get()
                                    .then(formateur => {


                                        $('#' + ((justification.data().valid == true) ? 'JustificationsTable' : 'VerifierTable')).DataTable().row.add([
                                            ` <td  class='justif_id'>
                <button type="button" id='${absence.id} ${justification.id}'
                class="mt-2 btn-icon-split btn btn-primary btn-justif"
                data-toggle="modal" data-target="#exampleModal">
                <span class="icon text-white-50">
                    <i class="fas fa-arrow-right"></i>
                </span>
                <span class="text">Voir</span>
            </button>
                </td>   `,
                                            `<td> <a href="espace_admin_utilisateur_modifier.html" class='goToUser eleves'  id ='${eleve.id}'>  ${eleve.data().nom}  ${eleve.data().prenom}  </a> </td>`,
                                            `<td>  ${eleve.data().mail}  </td> `,
                                            `<td> <a href="espace_admin_classe_modifier.html" class='goToClasse'  id ='${classe.id}'>   ${classe.data().nom}  </a> </td>`,
                                            `<td>  ${absence.data().date}  </td> `,
                                            `<td>  ${absence.data().module}  </td> `

                                        ]).draw();

                                        $('.goToUser').unbind()
                                        $('.goToUser').bind('click', function () {
                                            const goToPoste = $(this).attr('class').split(' ')
                                            localStorage.setItem("editUser", $(this).attr('id'));
                                            localStorage.setItem("editUserPoste", goToPoste[1]);
                                        })
                                        $('.goToClasse').unbind()
                                        $('.goToClasse').bind('click', function () {
                                            localStorage.setItem("editClasse", $(this).attr('id'));
                                        })

                                        $('.btn-justif').unbind()
                                        $('.btn-justif').bind('click', function () {

                                            let div_btn = $(this)
                                            if (justification.data().valid == true) {
                                                $('#btn-valider').hide()
                                                $('#btn-rejeter').hide()
                                            }
                                            else {
                                                $('#btn-valider').show()
                                                $('#btn-rejeter').show()
                                                $('#btn-rejeter').unbind()
                                                $('#btn-rejeter').bind('click', function () {
                                                    $('#exampleModal').modal('hide')
                                                    db.collection('absences').doc(div_btn.attr('id').split(' ')[0]).update({
                                                        justifiee: false
                                                    });
                                                    console.log(div_btn.attr('id').split(' ')[0])
                                                    db.collection('justifications').where('absence', '==', div_btn.attr('id').split(' ')[0])
                                                        .get()
                                                        .then(querySnapshot => {
                                                            querySnapshot.forEach((doc) => {
                                                                doc.ref.delete().then(() => {
                                                                    document.getElementById('sound-success').play()
                                                                    new Notyf().success({
                                                                        message: "L'absence a été refusée",
                                                                        duration: 4000,

                                                                        position: {
                                                                            x: 'center',
                                                                            y: 'bottom',
                                                                        }
                                                                    });
                                                                })

                                                            })
                                                        })
                                                })
                                                $('#btn-valider').unbind()
                                                $('#btn-valider').bind('click', function () {
                                                    $('#exampleModal').modal('hide')
                                                    db.collection('justifications').doc(div_btn.attr('id').split(' ')[1]).update({
                                                        valid: true
                                                    });
                                                    document.getElementById('sound-success').play()
                                                    new Notyf().success({
                                                        message: "L'absence a été validée",
                                                        duration: 4000,

                                                        position: {
                                                            x: 'center',
                                                            y: 'bottom',
                                                        }
                                                    });
                                                })

                                            }


                                            db.collection('justifications').doc($(this).attr('id').split(' ')[1]).get().then((justifi) => {
                                                $('#text-justification').empty()
                                                $('#text-justification').append(`
                                                   <hr>
                                                    Image : ''
                                                  </br>
                                                     Message : ${justifi.data().message} 
                                                    `)
                                            })


                                            db.collection('absences').doc($(this).attr('id').split(' ')[0]).get().then((abs) => {

                                                let retard_hours = ''
                                                let retard_minutes = ''

                                                if (abs.data().retard != true) {
                                                    retard_hours += new Date(getDateFromHours(abs.data().hr_debut).getTime() + abs.data().retard * 60000).getHours()
                                                    if (retard_hours.length != 2) retard_hours = '0' + retard_hours

                                                    retard_minutes += new Date(getDateFromHours(abs.data().hr_debut).getTime() + abs.data().retard * 60000).getMinutes()
                                                    if (retard_minutes.length != 2) retard_minutes = '0' + retard_minutes
                                                }


                                                $('#exampleModalLabel').text('Justifier absence')
                                                $('#data-absence').empty()
                                                $('#data-absence').append(`
                                <div class='d-none id_abs' id='${abs.id}'></div>
                          Date : ${abs.data().date} 
                          <br>
                          Duree :  de ${abs.data().hr_debut}  à  ${abs.data().retard == true ? abs.data().hr_fin : retard_hours + ':' + retard_minutes}
                          <br>
                          Formateur : ${formateur.data().prenom} ${formateur.data().nom}
                          <br>
                          Module : ${abs.data().module}
                          <br>
                          Salle : ${abs.data().salle}
                
                                `)
                                            })





                                        })


                                    })
                            })
                    })
            })
    })
    $('#JustificationsTable').DataTable().draw()
    $('#VerifierTable').DataTable().draw()

})








function getDateFromHours(time) {
    time = time.split(':');
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
}

