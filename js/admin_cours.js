

// ADD COURSE
$('#formulaire_cours').on('submit', function (evt) {

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
    }).then(() => {
        document.getElementById('sound-success').play()
        new Notyf({ duration: 4000, position: { x: 'center', y: 'bottom', } }).success('Cours à été ajouté avec succès');
    })
})


// SET FORMERS OPTIONS
db.collection('formateurs').get()
    .then(formateurs => {
        formateurs.forEach(formateur => {
            $('#select-formateur').append(`   <option value="${formateur.id}">${formateur.data().nom}  ${formateur.data().prenom} </option  `)
        });
    })





// SET CLASS OPTIONS
db.collection('classes').get()
    .then(classes => {
        classes.forEach(classe => {
            $('#select-classe').append(`   <option value="${classe.id}">${classe.data().nom}   </option  `)
        });
    })


// SET COURSE DATATABLES
db.collection('cours').onSnapshot((cours_actifs) => {
    $('#CoursTable').DataTable().clear()
    cours_actifs.forEach(cours => {
        if (cours.data().actif == true) {
            db.collection('classes').doc(cours.data().classe).get()
                .then(classe => {
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
                        })
                })
        }
    });
});



// DELETE COURSE ON CLICK
$('#CoursTable').on('click', '.delete_cours', function () {
    localStorage.setItem('ID_cours_modif', $(this).attr('id'))
})

// GOTOCLASS ON CLICK
$('#CoursTable').on('click', '.goToClasse', function () {
    localStorage.setItem("editClasse", $(this).attr('id'));
})

// GOTOUSER ON CLICK
$('#CoursTable').on('click', '.goToUser', function () {
    const goToPoste = $(this).attr('class').split(' ')
    localStorage.setItem("editUser", $(this).attr('id'));
    localStorage.setItem("editUserPoste", goToPoste[1]);
})



// CLEAR VALUES ON CLICK
$('#viderchamps').on('click', function () {
    $('input[type="text"]').val('')
    $('input[type="date"]').val('')
    $('select').val('')
    $('select[name="hr2-debut"]').val('00')
    $('select[name="hr2-fin"]').val('00')
    document.getElementById('sound-success').play()
    new Notyf({ duration: 4000, position: { x: 'center', y: 'bottom', } }).success('Les champs ont été vidés')
})