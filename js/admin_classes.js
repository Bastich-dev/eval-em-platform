

// FORMULAIRE AJOUTER CLASSE
$('#formulaire_classe').on('submit', function (evt) {

    let infos = $(this).serializeArray()
    evt.preventDefault();
    db.collection('classes').add({
        nom: infos[0].value,
        groupe: infos[1].value,
        statut: 0,
        timer: 0,
        eleves: [],
        cours: '',
        messages: []
    }).then(ref => {
        $('#nom_classe')[0].value = ''
        $('#select-groupe')[0].value = ''
        db.collection('groupes').doc(infos[1].value).update({
            classes: firebase.firestore.FieldValue.arrayUnion(ref.id)
        });
        console.log('classe ajouté , ID: ', ref.id);
        document.getElementById('sound-success').play()
        new Notyf().success({
            message: 'La classe a été ajoutée avec succès',
            duration: 4000,

            position: {
                x: 'center',
                y: 'bottom',
            }
        });
    }).catch(() => { alert("Une erreur est survenue, réessayez ultérieurement") })

})



// FORMULAIRE AJOUTER GROUPE
$('#formulaire_groupe').on('submit', function (evt) {

    let infos = $(this).serializeArray()
    evt.preventDefault();
    db.collection('groupes').doc(infos[0].value).set({ classes: [] }).catch(() => { alert("Une erreur est survenue, réessayez ultérieurement") })
    document.getElementById('sound-success').play()
    new Notyf().success({
        message: "Le groupe a été ajoutée avec succès </br>ATTENTION : Pour modifier ou supprimer un groupe, contactez l'administrateur du site internet",
        duration: 10000,

        position: {
            x: 'center',
            y: 'bottom',
        }
    });

})




//  AFFICHAGE CLASSE 

// [Start] Quand 'classes' est modifié...   
db.collection('classes').onSnapshot(() => {



    // [Start] Récupère toutes les classes ...  
    db.collection('classes').get()
        .then(classes => {
            $('#ClasseTable').DataTable().clear()
            // [Start] Pour chaque classe ...
            classes.forEach(classe => {
                $('#ClasseTable').DataTable().row.add([
                    `<td> <a href="espace_admin_classe_modifier.html" class='goToClasse'  id ='${classe.id}'>   ${classe.data().nom}  </a> </td>`,
                    `<td> ${classe.data().groupe} </td>`,
                    `<td>  ${classe.data().eleves.length}</td>`,]).draw();
            });
            // [End] Pour chaque classe ...

        }).then(() => {

            $('.goToClasse').unbind()
            $('.goToClasse').bind('click', function () {
                localStorage.setItem("editClasse", $(this).attr('id'));
            })
            console.log('Affichage classes réussi');
        })
        .catch(err => {
            console.log('Error getting informations', err);
        });
    // [End] Récupère toutes les classes ...

})
// [End] Quand 'classes' est modifié... 




//  AFFICHAGE GROUPES 

// [Start] Quand 'groupes' est modifié...   
db.collection('groupes').onSnapshot(() => {


    // [Start] Récupère tous les groupes ...  
    db.collection('groupes').get()
        .then(groupes => {
            $('#GroupeTable').DataTable().clear()
            $('#select-groupe').empty()
            $('#select-groupe').append(` <option value=""></option> `)

            // [Start] Pour chaque groupe ...
            groupes.forEach(groupe => {
                $('#GroupeTable').DataTable().row.add([
                    `<td>    ${groupe.id}  </a> </td>`,
                    `<td> ${groupe.data().classes.length} </td>`,
                ]).draw();
                $('#select-groupe').append(` <option value="${groupe.id}">${groupe.id}</option> `)
            });
            // [End] Pour chaque groupe ...
        })
        .then(() => {
            console.log('Affichage groupe réussi');
        })
        .catch(err => {
            console.log('Error getting informations', err);
        });
    // [End] Récupère tous les groupes ...  

})
    // [End] Quand 'groupes' est modifié...



