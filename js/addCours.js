
$('#formulaire_cours').on('submit', function (evt) {
    // Récupère infos formulaire
    let infos = $(this).serializeArray()
    evt.preventDefault();
    console.log(infos)
    if (confirm("Valider l'ajout de ce cours  ?") == true) {


        db.collection('cours').add({
            classe: infos[0].value,
            formateur: infos[1].value,
            module: infos[2].value,
            date: infos[3].value,
            hr_debut: infos[4].value + ':' + infos[5].value,
            hr_fin: infos[6].value + ':' + infos[7].value,
            actif: true
        }).then(ref => {
            console.log('cours ajouté , ID: ', ref.id);
            self.location.href = '#'
        }).catch(ref => {
            alert("Une erreur est survenue, réessayez ultérieurement")
        })


    }
})


db.collection('formateurs').get()
    .then(snapshot => {
        snapshot.forEach(doc => {

            const infos_classe = doc.data()
            console.log(infos_classe)
            let lol = ``
            lol += `
        <option value="${doc.id}">${infos_classe.nom}  ${infos_classe.prenom} </option
        `
            $('#select-formateur').append(lol)

        });
    })
    .then(() => {

    })
    .catch(err => {
        console.log('Error getting informations', err);
    });



db.collection('classes').get()
    .then(snapshot => {
        snapshot.forEach(doc => {

            const infos_classe = doc.data()
            console.log(infos_classe)
            let lol = ``
            lol += `
        <option value="${doc.id}">${infos_classe.nom} </option
        `
            $('#select-classe').append(lol)

        });
    })
    .then(() => {

    })
    .catch(err => {
        console.log('Error getting informations', err);
    });

db.collection('cours').onSnapshot(() => {
    $('#CoursTable').DataTable().clear()
    db.collection('cours').where('actif', '==', true).get()
        .then(snapshot => {
            snapshot.forEach(doc => {

                const infos_classe = doc.data()
                let lul = ''
                db.collection('classes').doc(infos_classe.classe).get()
                    .then(snapshot => {
                        db.collection('formateurs').doc(infos_classe.formateur).get()
                            .then(doc => {

                                $('#CoursTable').DataTable().row.add([
                                    `<td>  ${infos_classe.date}</td>`,
                                    `<td> <a href="espace_admin_classe.html" class='goToClasse'  id ='${doc.id}'>   ${snapshot.data().nom}  </a> </td>`,
                                    `<td> ${doc.data().prenom}  ${doc.data().nom} </td>`,
                                    `<td>  ${infos_classe.module}</td>`,
                                    `<td>   ${infos_classe.hr_debut}  </a> </td>`,
                                    `<td> ${infos_classe.hr_fin} </td>`,
                                    `<td>  lol</td>`,


                                ]).draw();

                            })
                            .catch(err => {
                                console.log('Error getting documents', err);
                            });

                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });



            });
        })
        .then(() => {

        })
        .catch(err => {
            console.log('Error getting informations', err);
        });
});


