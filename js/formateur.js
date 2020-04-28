


// AFFICHAGE COURS FORMATEUR

// [Start] Récupre touts les cours du formateur ...
db.collection('cours').where('formateur', '==', localStorage.getItem('ID')).get()
    .then(cours_formateur => {

        // [Start] Pour chaque cours ...
        cours_formateur.forEach(cours => {

            // [Start] Si le cours est actif ...
            if (cours.data().actif == true) {

                // [Start] Récupère les infos de la classe ...  
                db.collection('classes').doc(cours.data().classe).get()
                    .then(classe => {

                        // [Start] Récupère les infos  du formateur ...  
                        db.collection('formateurs').doc(cours.data().formateur).get()
                            .then(formateur => {



                                $('#CoursTable').DataTable().row.add([
                                    `<td>  ${cours.data().date}</td>`,
                                    `<td>   ${classe.data().nom}  </a> </td>`,
                                    `<td> ${formateur.data().prenom}  ${formateur.data().nom} </td>`,
                                    `<td>  ${cours.data().module}</td>`,
                                    `<td>   ${cours.data().hr_debut}  </a> </td>`,
                                    `<td> ${cours.data().hr_fin} </td>`,
                                    `<td> ${cours.data().salle}  </td>`,
                                ]).draw();

                            })
                            .catch(err => {
                                console.log('Error getting documents', err);
                            });
                        // [End] Récupère les infos  du formateur ...  
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
                // [End] Récupère les infos de la classe ...  
            }
            // [End] Si le cours est actif ...




            const d = new Date()
            const dtf = new Intl.DateTimeFormat('fr', { year: 'numeric', month: '2-digit', day: '2-digit' })
            const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(d)

            // [Start] Si le cours est daté pour aujourd'hui ...
            if (cours.data().date == (ye + '-' + mo + '-' + da)) {

                // [Start] Récupère les infos de la classe ...  
                db.collection('classes').doc(cours.data().classe).get()
                    .then(classe => {

                        // Cours términé ou non ...
                        let actif = ``
                        if (cours.data().actif == false) actif = ` 
                         <div class="card-header py-3 d-flex  align-items-center justify-content-between bg-success">
                         <h6 class=" font-weight-bold text-white text-uppercase">
                         Terminé
                         </h6>
                         <i class="fas fa-check-circle fa-2x text-300 text-white"></i>
                         </div>`
                        else actif = `
                        <div class="card-header py-3 d-flex  align-items-center justify-content-between bg-info">
                        <h6 class=" font-weight-bold text-white text-uppercase">
                        à faire
                        </h6>
                        <i class="fas fa-chevron-circle-down fa-2x text-300 text-white " ></i>
                        </div>`


                        $('#cours_cards').append(`
                        <!-- CARD COURS -->
                        <div class="col-lg-4  col-md-12 ">
                            <div class="card shadow m-3 cours">
                            ${actif}
                                <div class="card-body text-white bg-primary goToCours" id=${cours.id}>
                                    <h6>Module : ${cours.data().module} </h6>
                                    <h6>Groupe :  ${classe.data().groupe}</h6>
                                    <h6>Classe : ${classe.data().nom}</h6>
                                    <h6>Horaire début : ${cours.data().hr_debut}</h6>
                                    <h6>Horaire fin : ${cours.data().hr_fin}</h6>
                                    <h6>Salle : ${cours.data().salle}</h6>
                                </div>
                            </div>
                        </div>`)


                    })
                    .then(() => {
                        // Affiche cours si cliqué
                        $('.cours').on('click', function () {
                            localStorage.setItem('ID_cours', $(this).find('.goToCours').attr('id'))
                            self.location.href = 'espace_formateur_cours.html'
                        })
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
                // [End] Récupère les infos de la classe ...  
            }
            // [End] Si le cours est daté pour aujourd'hui ...



        });
        // [End] Pour chaque cours ...

    })
    .then(() => {
        console.log('Affichage cours réussi')
    })
    .catch(err => {
        console.log('Error getting informations', err);
    });
// [End] Récupre touts les cours du formateur ...




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
    height: 650,
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


db.collection('formateurs').doc(localStorage.getItem('ID')).get().then((form) => {


    db.collection('cours').where('formateur', '==', form.id).get().then((cours) => {

        cours.forEach((cour) => {

            let olll = cour.data().date + ' ' + cour.data().hr_debut + ':00'
            console.log(olll)

            db.collection('formateurs').doc(cour.data().formateur).get().then((formateur) => {
                db.collection('classes').doc(cour.data().classe).get().then((classe) => {
                    calendar.addEvent({
                        title: cour.data().module + '\n' + formateur.data().prenom + ' ' + formateur.data().nom,
                        start: cour.data().date + ' ' + cour.data().hr_debut + ':00',
                        end: cour.data().date + ' ' + cour.data().hr_fin + ':00',
                        allDay: false,
                        textColor: 'white',
                        className: 'case',
                        id: cour.id,
                        classe: classe.data().nom

                    })
                })
            })




        })

    })


}).then(() => {
    calendar.render();
})
