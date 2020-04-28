

db.collection('eleves').doc(localStorage.getItem('ID')).get()
    .then(eleve => {




        db.collection('absences').where('eleve', '==', eleve.id).get().then((doc) => {


            db.collection("absences").where("eleve", "==", eleve.id)
                .onSnapshot(function (querySnapshot) {
                    $('#releve_absences').empty()
                    querySnapshot.forEach(function (absence) {



                        let retard_hours = ''
                        let retard_minutes = ''

                        if (absence.data().retard != true) {
                            retard_hours += new Date(getDateFromHours(absence.data().hr_debut).getTime() + absence.data().retard * 60000).getHours()
                            if (retard_hours.length != 2) retard_hours = '0' + retard_hours

                            retard_minutes += new Date(getDateFromHours(absence.data().hr_debut).getTime() + absence.data().retard * 60000).getMinutes()
                            if (retard_minutes.length != 2) retard_minutes = '0' + retard_minutes
                        }



                        if (absence.data().justifiee == false) {
                            $('#releve_absences').append(`
                <div class="card mb-2  pl-5 border-left-danger" id='${absence.id}'>
                            <div class="card-body">
                              <i class="fas fa-exclamation-circle text-300 fa-1x" style="color: #e74a3b; "></i>
                              <b class="m-2 text-uppercase"> à justifier</b>
                              <span class="float-right">${absence.data().module} </span>
                              <br>
                              <button type="button" class=" mt-2 btn-icon-split btn btn-primary btn-justifier" data-toggle="modal" data-target="#exampleModal">
                              <span class="icon text-white-50">
                              <i class="fas fa-arrow-right"></i>
                            </span>
                            <span class="text">Justifier</span>
                            </button>
                              <span class=" mt-2 float-right">${absence.data().date} - ${absence.data().hr_debut} à ${absence.data().retard == true ? absence.data().hr_fin : retard_hours + ':' + retard_minutes} </span>
                            </div>
                          </div>
                `)
                        }
                        else {
                            $('#releve_absences').append(`
                            <div class="card mb-2  pl-5 border-left-success" id='${absence.id}'>
                            <div class="card-body">
                              <i class="fas fa-check-circle text-300 fa-1x" style="color: #1cc88a; "></i>
                              <b class="m-2 text-uppercase"> justifiée</b>
                              <span class="float-right">${absence.data().module}</span>
                              <br>
                              <button  id='${absence.data().justification}' type="button" class=" mt-2 btn-icon-split btn btn-primary btn-justification" data-toggle="modal" data-target="#exampleModal">
                              <span class="icon text-white-50">
                              <i class="fas fa-arrow-right"></i>
                            </span>
                            <span class="text">Justification</span>
                            </button>
                           
                              <span class=" mt-2 float-right">${absence.data().date} - ${absence.data().hr_debut} à ${absence.data().retard == true ? absence.data().hr_fin : retard_hours + ':' + retard_minutes} </span>
                            </div>
                          </div>
                            `)
                        }


                    });
                    $('.btn-justifier, .btn-justification').on('click', function () {

                        console.log($(this).parent().parent().attr('id'))
                        db.collection('absences').doc($(this).parent().parent().attr('id')).get()
                            .then((abs) => {
                                $('#data-absence').empty()
                                db.collection('formateurs').doc(abs.data().formateur).get()
                                    .then((formateur) => {
                                        $('#text-justification').empty()
                                        $('#btn-envoyer').empty()
                                        if (abs.data().justifiee == false) {
                                            $('#text-justification').append(`
                                    
                                            <hr>
                                            <a href="#" class="btn btn-primary btn-icon-split m-3">
                                              <span class="icon text-white-50">
                                                <i class="fas fa-folder-open"></i>
                                              </span>
                                              <span class="text">Ajouter photo, documents, etc ..</span>
                                            </a>
                                            <div class="control-group ml-3 mr-3  mt-4" >
                                              <div class="form-group floating-label-form-group controls mb-0 pb-2">
                                                <textarea class="form-control " id="message" rows="5" placeholder="Message" required="required"
                                                  required></textarea>
                                                <p class="help-block text-danger"></p>
                                              </div>
                            
                                            </div>
                                            `)

                                            $('#btn-envoyer').append(`<button type="submit" class="btn btn-primary">Envoyer</button>`)
                                        }
                                        else {

                                            db.collection('justifications').where('absence', '==', abs.id).get()
                                                .then(justif => {
                                                    justif.forEach((just) => {
                                                        $('#text-justification').append(`
                                        <hr>
                                        Image : ''
                                        </br>
                                        Message : ${just.data().message} 
                                        `)
                                                    })

                                                })



                                        }



                                        let retard_hours = ''
                                        let retard_minutes = ''

                                        if (abs.data().retard != true) {
                                            retard_hours += new Date(getDateFromHours(abs.data().hr_debut).getTime() + abs.data().retard * 60000).getHours()
                                            if (retard_hours.length != 2) retard_hours = '0' + retard_hours

                                            retard_minutes += new Date(getDateFromHours(abs.data().hr_debut).getTime() + abs.data().retard * 60000).getMinutes()
                                            if (retard_minutes.length != 2) retard_minutes = '0' + retard_minutes
                                        }

                                        console.log('loooooo')
                                        $('#exampleModalLabel').text('Justifier absence')
                                        $('#data-absence').append(`
                                <div class='d-none id_abs' id='${abs.id}'></div>
                          Date : ${abs.data().date} 
                          <br>
                          Duree : de ${abs.data().hr_debut}  à  ${abs.data().retard == true ? abs.data().hr_fin : retard_hours + ':' + retard_minutes}
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
                });







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


            db.collection('absences').where('eleve', '==', eleve.id).onSnapshot((abs) => {
                let absences_non_justifiee = 0
                abs.forEach((elem) => {

                    if (elem.data().justifiee == false) absences_non_justifiee += 1

                })
                $('#absences-justifier').empty()
                $('#absences-justifier').append(cardManager(absences_non_justifiee, 'Absences à justifier'))
            })



        })
















        db.collection('classes').doc(eleve.data().classe).get()
            .then(classe => {

                $('#classe_eleve').text(classe.data().nom)


                classe.data().messages.forEach(message => {

                    let infos_message = message.replace(/£/g, ' ')

                    $('#eleve-messages').append(`
    <div class="card m-4  border-bottom-secondary">
    <div class="card-body">
      <b> ${infos_message.split('ZYX')[0]}</b>
    <br>
      
    <div class='mess'> ${infos_message.split('ZYX')[1]}
                   </div >
    
    </div >
    </div >
                    `)

                })


                let valid = false
                let timer = 0
                db.collection('classes').doc(classe.id).onSnapshot((classse) => {

                    $('#statut_cours').empty()




                    if (classse.data().statut == 0) {
                        statut_cours_titre = 'Pas de cours actuellement'
                        statut_cours_message = 'Reposez vous bien '
                        statut_cours_icone = '<i class="fas fa-check-circle text-300 fa-4x text-success"></i>'
                    }
                    if (classse.data().statut == 1) {
                        statut_cours_titre = 'Le cours est en pause !'
                        statut_cours_message = 'Le cours va bientot commencer, tiens tois prêt '
                        statut_cours_icone = '<i class="fas fa-exclamation-triangle text-300 fa-4x text-warning"></i>'
                    }
                    if (classse.data().statut == 2) {
                        if (classse.data().timer > 0) {

                            if (valid == false) {
                                timer = classse.data().timer
                                statut_cours_titre = 'Le cours va commencer !'
                                statut_cours_message = 'Début du cours dans ' + Math.floor((timer / 60) % 60) + ' minutes ' + Math.floor(timer % 60) + ' secondes '
                                statut_cours_icone = '<i class="fas fa-exclamation-triangle text-300 fa-4x text-warning"></i>'
                                valid = true
                            }
                            else {
                                timer -= 1
                                statut_cours_titre = 'Le cours va commencer !'
                                statut_cours_message = 'Début du cours dans ' + Math.floor((timer / 60) % 60) + ' minutes ' + Math.floor(timer % 60) + ' secondes '
                                statut_cours_icone = '<i class="fas fa-exclamation-triangle text-300 fa-4x text-warning"></i>'
                            }





                        }
                        else {
                            statut_cours_titre = 'Le cours a commencer'
                            statut_cours_message = "L'accès au cours est bloqué"
                            statut_cours_icone = '<i class="fas fa-hand-paper text-300 fa-4x text-danger"></i>'
                        }

                    }




                    $('#statut_cours').append(`
                    <div class=" pt-1 pb-1 text-center">
                    <p class="h2 m-4 font-weight-bold ">${statut_cours_titre}</p>
                    ${statut_cours_icone}
                    </div>
                    <p class="h4 mt-3 font-weight-bold text-center">${statut_cours_message} </p>
                    `)

                })



            })


    })






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



$('#justifier-envoi').on('submit', function (e) {

    e.preventDefault()

    console.log($(this).find('.id_abs').attr('id'))
    db.collection('justifications').add({
        absence: $(this).find('.id_abs').attr('id'),
        message: $(this).find('textarea').val(),
        image: '',
        valid: false
    }).then(ref => {
        db.collection('absences').doc($(this).find('.id_abs').attr('id')).update({
            justifiee: true
        })
        $("#exampleModal").modal('hide');
    }).catch(() => { alert("Une erreur est survenue dans l'ajout, réessayez ultérieurement") })

})



// On va chercher la div dans le HTML
let calendarEl = document.getElementById('calendrier');


// On instancie le calendrier
let calendar = new FullCalendar.Calendar(calendarEl, {
    // On charge le composant "dayGrid"
    defaultView: 'timeGridWeek',
    plugins: ['dayGrid', 'timeGrid'],
    locale: 'fr',
    minTime: "08:00:00",
    maxTime: "19:00:00",
    allDaySlot: false,
    hiddenDays: [0],
    header: {
        right: 'prev,today,next ',
        center: 'dayGridMonth,timeGridWeek,dayGridDay',
        left: 'title'
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
                          Passé : ${cours.data().actif == false ? 'Prévu' : 'Passé'}
                                `)

            })
        })


    }
});


db.collection('eleves').doc(localStorage.getItem('ID')).get().then((eleve) => {


    db.collection('cours').where('classe', '==', eleve.data().classe).get().then((cours) => {

        cours.forEach((cour) => {

            let olll = cour.data().date + ' ' + cour.data().hr_debut + ':00'
            console.log(olll)

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






function getDateFromHours(time) {
    time = time.split(':');
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
}


