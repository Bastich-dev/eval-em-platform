// SET USER 
db.collection(localStorage.getItem("editUserPoste")).doc(localStorage.getItem("editUser")).get()
    .then(user => {
        if (!user.exists) console.log('Utilisateur non trouvé');
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
                db.collection('classes').get()
                    .then(classes => {
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
    })



// DELETE ON CLICK
$('#delete_user').on('click', function () {

    if (confirm('Voulez vous définivement supprimer cet utilisateur ?')) {
        db.collection(document.getElementById('user-poste').value + 's').where("identifiant", "==", document.getElementById('user-identifiant').value)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete()
                        .then(() => {
                            if (document.getElementById('user-poste').value + 's' == 'eleves') {
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
                });
            })
    }
})




// EDIT ON CLICK
$('#edit_user').on('click', function () {

    // Animation modifs
    $('.editMark').css('background-color', '#28a745')
    $('.editMark').css('color', 'white')

    db.collection(document.getElementById('user-poste').value + 's').doc(document.getElementById('user-id').value).get()
        .then(user => {
            if (!user.exists) console.log('Utilisateur non trouvé');
            else {
                if (document.getElementById('user-poste').value + 's' == 'eleves') {
                    db.collection('classes').doc(user.data().classe).update({
                        eleves: firebase.firestore.FieldValue.arrayRemove(document.getElementById('user-id').value)
                    }).then(() => {
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
                                db.collection('classes').doc(document.getElementById('user-classe').value).update({
                                    eleves: firebase.firestore.FieldValue.arrayUnion(document.getElementById('user-id').value)
                                });
                            });
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
                }
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


// EDIT VALUES
$('.editMark').on('change', function () {
    db.collection('classes').doc(document.getElementById('user-classe').value).get()
        .then(classe => {
            document.getElementById('user-groupe').value = classe.data().groupe
        })
    $(this).css('background-color', 'orange')
})


// IF STUDENT, SHOW ADDITIONAL DATA
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






// SET PLANNING
db.collection('eleves').doc(localStorage.getItem('editUser')).get().then(eleve => {
    if (eleve.exists) {
        $('#eleve-planning').css('display', 'flex')
        let calendarEl = document.getElementById('calendrier');
        let calendar = new FullCalendar.Calendar(calendarEl, {
            defaultView: "timeGridWeek",
            plugins: ['dayGrid', 'timeGrid'],
            locale: 'fr',
            minTime: "08:00:00",
            maxTime: "19:00:00",
            allDaySlot: false,
            height: 650,
            hiddenDays: [0],
            header: {
                right: 'prev,today,next ',
                center: 'dayGridMonth,timeGridWeek,timeGridDay',
                left: 'title',
            },
            buttonText: {
                today: "Aujourd'hui",
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                list: 'Liste'
            },
            events: [],
            navLinks: true,
            eventClick: function (event) {
                $('.case').attr('data-toggle', 'modal');
                $('.case').attr('data-target', '#basicExampleModal');
                console.log(event.event.id)
                db.collection('cours').doc(event.event.id).get().then((cours) => {
                    db.collection('formateurs').doc(cours.data().formateur).get().then((formateur) => {
                        $('#data-cours').empty()
                        $('#data-cours').append(`
                                        <div class='d-none id_abs' id='${cours.id}'></div>
                                  Date : ${cours.data().date} 
                                  <br>
                            Horaires : ${cours.data().hr_debut} à ${cours.data().hr_fin} 
                                  <br>
                                  Formateur : ${formateur.data().prenom} ${formateur.data().nom}
                                  <br>
                                  Module : ${cours.data().module}
                                  <br>
                                  Salle : ${cours.data().salle}
                                  <br>
                                  Statut : ${cours.data().actif == true ? 'Prévu' : 'Passé'}
                                        `)
                    })
                })
            }
        });
        db.collection('eleves').doc(localStorage.getItem('editUser')).get().then((eleve) => {
            db.collection('cours').where('classe', '==', eleve.data().classe).get().then((cours) => {
                cours.forEach((cour) => {
                    db.collection('formateurs').doc(cour.data().formateur).get().then((formateur) => {
                        calendar.addEvent({
                            title: cour.data().module + '\n' + formateur.data().prenom + ' ' + formateur.data().nom,
                            start: cour.data().date + ' ' + cour.data().hr_debut + ':00',
                            end: cour.data().date + ' ' + cour.data().hr_fin + ':00',
                            allDay: false,
                            textColor: 'white',
                            className: 'case',
                            id: cour.id
                        })
                    })
                })
            })
        }).then(() => {
            calendar.render();
        })
    }
    else $('#eleve-planning').css('display', 'none')
})
