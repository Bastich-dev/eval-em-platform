


// SET COURS VALUES
db.collection('cours').doc(localStorage.getItem('ID_cours_modif')).get()
    .then((cours) => {

        db.collection('formateurs').get()
            .then(formateurs => {
                formateurs.forEach(formateur => {
                    $('#select-formateur').append(`   <option value="${formateur.id}">${formateur.data().nom}  ${formateur.data().prenom} </option  `)
                });
            })
            .then(() => {
                db.collection('classes').get()
                    .then(classes => {
                        classes.forEach(classe => {
                            $('#select-classe').append(`   <option value="${classe.id}">${classe.data().nom}   </option  `)
                        });
                    })
                    .then(() => {
                        document.getElementById('select-classe').value = cours.data().classe
                        document.getElementById('select-formateur').value = cours.data().formateur
                        document.getElementById('module').value = cours.data().module
                        document.getElementById('date').value = cours.data().date
                        document.getElementById('hr1_debut').value = cours.data().hr_debut.split(':')[0]
                        document.getElementById('hr2_debut').value = cours.data().hr_debut.split(':')[1]
                        document.getElementById('hr1_fin').value = cours.data().hr_fin.split(':')[0]
                        document.getElementById('hr2_fin').value = cours.data().hr_fin.split(':')[1]
                        document.getElementById('salle').value = cours.data().salle
                    })
            })
    })



// DELETE COURSE ON CLICK
$('#delete').on('click', function () {
    db.collection('cours').doc(localStorage.getItem('ID_cours_modif'))
        .get()
        .then(doc => {
            doc.ref.delete().then(() => {
                localStorage.setItem('Notif', 'Le cours a bien été supprimé')
                document.getElementById('sound-success').play()
                self.location.href = 'espace_admin_cours.html'
            })
        })
})




// EDIT COURSE ON CLICK
$('#modifs').on('click', function () {

    // Animation modifs
    $('.editMark').css('background-color', '#28a745')
    $('.editMark').css('color', 'white')

    db.collection('cours').doc(localStorage.getItem('ID_cours_modif')).get()
        .then(user => {
            if (!user.exists) console.log('Utilisateur non trouvé');
            else {
                db.collection('cours').doc(localStorage.getItem('ID_cours_modif')).update(
                    {
                        classe: document.getElementById('select-classe').value,
                        formateur: document.getElementById('select-formateur').value,
                        module: document.getElementById('module').value,
                        date: document.getElementById('date').value,
                        hr_debut: document.getElementById('hr1_debut').value + ':' + document.getElementById('hr2_debut').value,
                        hr_fin: document.getElementById('hr1_fin').value + ':' + document.getElementById('hr2_fin').value,
                        salle: document.getElementById('salle').value,
                    })
                setTimeout(function () {
                    $('.editMark').css('background-color', 'white');
                    $('.editMark').css('color', 'black')
                }, 1500)
                document.getElementById('sound-success').play()
                new Notyf().success({
                    message: "Le cours a été modifié avec succès",
                    duration: 2000,
                    position: {
                        x: 'center',
                        y: 'bottom',
                    }
                });
            }
        })
})


// CHANGE VALUE OF COURSE
$('.editMark').on('change', function () {
    $(this).css('background-color', 'orange')
})

