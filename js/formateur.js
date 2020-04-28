


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



window.mobilecheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
// On va chercher la div dans le HTML
let calendarEl = document.getElementById('calendrier');


// On instancie le calendrier
let calendar = new FullCalendar.Calendar(calendarEl, {
    // On charge le composant "dayGrid"
    defaultView: window.mobilecheck() ? "timeGridDay" : "timeGridWeek",
    plugins: ['dayGrid', 'timeGrid'],
    locale: 'fr',
    minTime: "08:00:00",
    maxTime: "19:00:00",
    allDaySlot: false,
    height: 650,
    hiddenDays: [0],
    header: {
        right: 'prev,today,next ',
        center: window.mobilecheck() ? '' : 'dayGridMonth,timeGridWeek,timeGridDay',
        left: window.mobilecheck() ? '' : 'title',
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
