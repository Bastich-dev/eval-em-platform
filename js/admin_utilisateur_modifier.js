



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


console.log(localStorage.getItem('editUserPoste'))
if (localStorage.getItem('editUserPoste') == 'eleves') {

    $('.container-fluid').append(`  <div class="row">

<!-- Card abscences hebdomadaire -->
<div class="col-xl-3 col-md-6 mb-4" id='absences-semaine'>
</div>

<!-- Card abscences mensuel -->
<div class="col-xl-3 col-md-6 mb-4" id='absences-mois'>

</div>



<!-- Card abscences trimestre -->
<div class="col-xl-3 col-md-6 mb-4" id='absences-trimestre'>
</div>

<!-- Card abscences à justifier -->
<div class="col-xl-3 col-md-6 mb-4" id='absences-justifier'>
</div>

</div>`)


    db.collection('absences').where('eleve', '==', localStorage.getItem('editUser')).get().then((doc) => {


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



    })


}






function cardManager(nb, titre) {

    let card = {
        color: '',
        icon: ``
    }
    if (nb < 3) {
        card.color = 'success'
        card.icon = `<i class="fas fa-check-circle fa-2x text-300 text-success"></i>`
    }
    else if (nb < 10) {
        card.color = 'warning'
        card.icon = `<i class="fas fa-exclamation-triangle fa-2x text-300 text-warning"></i>`
    }
    else if (nb >= 10) {
        card.color = 'danger'
        card.icon = `<i class="fas fa-exclamation-circle fa-2x text-300 text-danger"></i>`
    }

    return `
    <div class="card border-left-${card.color} shadow h-100 py-2">
    <div class="card-body">
      <div class="row no-gutters align-items-center">
        <div class="col mr-2">
          <div class="text-sm font-weight-bold text-${card.color} text-uppercase mb-1">${titre}</div>
          <div class="row no-gutters align-items-center">
            <div class="col-auto">
              <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${nb}</div>
            </div>
          </div>
        </div>
        <div class="col-auto">
        ${card.icon}
        </div>
      </div>
    </div>
    </div>
    `
}
