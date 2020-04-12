

$('#formulaire_classe').on('submit', function (evt) {
    // Récupère infos formulaire
    let infos = $(this).serializeArray()
    evt.preventDefault();
    console.log(db.collection('groupes').where('nom', '==', $('#select-groupe').val()))
    if (confirm("Valider l'ajout de cette classe  ?") == true) {

        db.collection('classes').add({
            nom: infos[0].value,
            groupe: infos[1].value,
            statut: 0,
            eleves: [],
            cours: []
        }).then(ref => {
            console.log('classe ajouté , ID: ', ref.id);
            self.location.href = 'espace_admin_classeAdd.html'
        }).catch(ref => {
            alert("Une erreur est survenue, réessayez ultérieurement")
        })

    }
})


$('#formulaire_groupe').on('submit', function (evt) {
    // Récupère infos formulaire
    let infos = $(this).serializeArray()
    evt.preventDefault();
    if (confirm("Valider l'ajout de ce groupe  ?\n\nAttention ! L'ajout d'un groupe est définitif, pour les modifier ou les supprimer, veulillez contacter l'adminstrateur de l'application web\n\nContact : bastien.chantrel@outlook.fr") == true) {
        db.collection('groupes').doc(infos[0].value).set({ classes: [] })
    }
})


//  AFFICHAGE CLASSE 
db.collection('classes').onSnapshot(() => {
    $('#ClasseTable').DataTable().clear()
    db.collection('classes').get()
        .then(snapshot => {
            snapshot.forEach(doc => {

                const infos_classe = doc.data()
                $('#ClasseTable').DataTable().row.add([
                    `<td> <a href="espace_admin_classe.html" class='goToClasse'  id ='${doc.id}'>   ${infos_classe.nom}  </a> </td>`,
                    `<td> ${infos_classe.groupe} </td>`,
                    `<td>  ${infos_classe.eleves.length}</td>`,

                ]).draw();
            });
        })
        .then(() => {

        })
        .catch(err => {
            console.log('Error getting informations', err);
        });
});


//  ON CHANGE GROUPE
db.collection('groupes').onSnapshot(() => {
    $('#GroupeTable').DataTable().clear()
    $('#select-groupe').empty()
    //  AFFICHAGE GROUPE 
    db.collection('groupes').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const infos_groupe = doc.data()
                $('#GroupeTable').DataTable().row.add([
                    `<td>    ${doc.id}  </a> </td>`,
                    `<td> ${infos_groupe.classes.length} </td>`,
                ]).draw();

                let lol = ``
                lol += `
            <option value="${doc.id}">${doc.id}</option
            `
                $('#select-groupe').append(lol)


            });
        })
        .then(() => { })
        .catch(err => {
            console.log('Error getting informations', err);
        });


    // SELECT GROUPE POUR ADD CLASSE







}, err => {
    console.log(`Encountered error: ${err}`);
});



