

// FORMULAIRE AJOUTER COURS
$('#formulaire_cours').on('submit', function (evt) {

    // [Start] Si le formulaire est validé ...

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
        console.log('cours ajouté , ID: ', ref.id);

        document.getElementById('sound-success').play()
        new Notyf({ duration: 4000, position: { x: 'center', y: 'bottom', } }).success('Cours à été ajouté avec succès');

    }).catch(ref => {
        document.getElementById('sound-error').play()
        new Notyf({ duration: 4000, position: { x: 'center', y: 'bottom', } }).error('Une erreur est survenue, réessayez ultérieurement');
    })

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
db.collection('cours').onSnapshot((cours_actifs) => {
    $('#CoursTable').DataTable().clear()


    // [Start] Récupère tous les cours actifs ...  
    // [Start] Pour chaque cours actif ...
    cours_actifs.forEach(cours => {

        if (cours.data().actif == true) {




            db.collection('classes').doc(cours.data().classe).get()
                .then(classe => {

                    // [Start] Récupère  les infos du formateur ...  
                    db.collection('formateurs').doc(cours.data().formateur).get()
                        .then(formateur => {



                            $('#CoursTable').DataTable().row.add([
                                `<td>  ${cours.data().date}</td>`,
                                `<td> <a href="espace_admin_classe_modifier.html" class='goToClasse' id ='${classe.id}'>  ${classe.data().nom}    </a> </td>`,
                                `<td> <a href="espace_admin_utilisateur_modifier.html" class='goToUser formateurs'  id ='${formateur.id}'>  ${formateur.data().nom}  ${formateur.data().prenom}  </a> </td>`,
                                `<td>  ${cours.data().module}</td>`,
                                `<td>   ${cours.data().hr_debut}  </a> </td>`,
                                `<td> ${cours.data().hr_fin} </td>`,
                                `<td> ${cours.data().salle} </td>`,
                                `<td> ${(cours.data().actif == true ? 'Prévu' : 'Passé')}  </td>`,
                                `<td>  <a href='espace_admin_cours_modifier.html'>  <i id="${cours.id}" class="fas fa-edit fa-2x btn btn-warning delete_cours"></i> </ </td>`,
                            ]).draw();

                            $('.delete_cours').unbind()
                            $('.delete_cours').bind('click', function () {


                                localStorage.setItem('ID_cours_modif', $(this).attr('id'))

                            })

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
                        })
                    // [End] Récupère  les infos du formateur ...  
                })

        }

        // [End] Récupère les infos de la classe ...  
    });
    // [End] Pour chaque cours actif ...


    // [End] Récupère tous les cours actifs ...  

});
// [End] Quand 'cours' est mofiifé...



$('#viderchamps').on('click', function () {

    localStorage.setItem('Notif', 'Les champs ont été vidés')
    self.location.href = 'espace_admin_cours.html'
})