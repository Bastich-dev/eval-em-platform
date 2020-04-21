

// Récupère le cours sélectionné au clic de la page espace_formateur.html
db.collection('cours').doc(localStorage.getItem("ID_cours"))
    .get()
    .then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
        }
        // Si il trouve le cours
        else {
            // Récupère les infos de la classe liée au cours
            db.collection('classes').doc(doc.data().classe).get()
                .then(classe => {


                    $('#infos_cours').append(`
                            <div class="row justify-content-around">
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Classe :  <span class='font-weight-light'> ${classe.data().nom}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center"> Salle :  <span class='font-weight-light'> ${doc.data().salle}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Module :  <span class='font-weight-light'> ${doc.data().module}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Date :  <span class='font-weight-light'> ${doc.data().date}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Horaire Début :  <span class='font-weight-light'> ${doc.data().hr_debut}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center"> Horaire Fin :  <span class='font-weight-light'> ${doc.data().hr_fin}</span> </p>
                         
                            </div>
                            `)




                    classe.data().eleves.forEach(eleve => {


                        db.collection('eleves').doc(eleve).get()
                            .then(eleve_infos => {


                                $('#EleveFormateur').DataTable().row.add([
                                    `   <td>  <b> ${eleve_infos.data().nom} ${eleve_infos.data().prenom} </b>  </td>`,
                                    ` <td> ${eleve_infos.data().mail}  </td>`,
                                    ` <td>  ${classe.data().nom}</td>`,
                                    ` ${classe.data().groupe}`,
                                    `  <div class="container">
                                    <div class="button-wrap d-flex">
                                      <input class="hidden radio-label radio present" id="present-${eleve_infos.id}" type="radio" name="${eleve_infos.id}" checked="checked"/>
                                      <label class="button-label" for="present-${eleve_infos.id}">
                                        <h1>Présent</h1>
                                      </label>
                                      <input class="hidden radio-label retard" id="retard-${eleve_infos.id}" type="radio" name="${eleve_infos.id}"/>
                                      <label class="button-label" for="retard-${eleve_infos.id}">
                                        <h1>Retard</h1>
                                            <h1>  <select disabled
                                            style="left:-60px; width: 120%;">
                                            <option value="09">5 min</option>
                                            <option value="10">10 min</option>
                                            <option value="11">15 min</option>
                                            <option value="12">20 min</option>
                                            <option value="13">30 min</option>
                                            <option value="14">45 min</option>
                                            <option value="15">1h</option>
                                            <option value="16">1h30</option>
                                            <option value="17">2h</option>
                                        </select> </h1>
                                      </label>
                                      <input class="hidden radio-label radio absent" id="absent-${eleve_infos.id}" type="radio" name="${eleve_infos.id}"/>
                                      <label class="button-label" for="absent-${eleve_infos.id}">
                                        <h1>Absent</h1>
                                      </label>
                                    </div>
                                  </div>  `,
                                    `  
                                    <i id="trigger" class="fas fa-comment-dots fa-2x btn btn-warning"></i>
                                `
                                ]).draw();

                                $('.retard').on('click', function () {
                                    $(this).parent().find('select').prop("disabled", false);
                                })
                                $('.radio').on('click', function () {
                                    $(this).parent().find('select').prop("disabled", true);
                                })

                                $('#trigger').click(function () {
                                    $('#overlay').fadeIn(300);
                                    console.log(eleve_infos.data().nom)
                                });

                                $('.closebtn').click(function () {
                                    $('#overlay').fadeOut(300);
                                });


                            })
                    })









                    db.collection('classes').doc(classe.id).onSnapshot((classse) => {






                        db.collection('cours').doc(localStorage.getItem("ID_cours"))
                            .get()
                            .then(doc => {

                                if ((classse.data().statut == 0) && (doc.data().actif == true)) {
                                    $('#cours-commencer').find('.hide_card').hide('slow')
                                    $('#cours-timer').find('.hide_card').show('slow')
                                    $('#cours-cours').find('.hide_card').show('slow')
                                    $('#cours-fin').find('.hide_card').show('slow')
                                }
                                else if ((classse.data().statut == 0) && (doc.data().actif == false)) {
                                    $('#cours-commencer').find('.hide_card').show('slow')
                                    $('#cours-timer').find('.hide_card').show('slow')
                                    $('#cours-cours').find('.hide_card').show('slow')
                                    $('#cours-fin').find('.hide_card').hide('slow')

                                    $("#btn-fin").replaceWith("<h2 class='text-center'>Cours clos</h2>");
                                    $("input[type=radio]").attr('disabled', true);
                                    $('#message-appel').replaceWith("<b id='message-appel' class='text-primary h5'> La feuille d'appel a été envoyée !</b>")
                                }
                                else if (classse.data().statut == 1) {
                                    $('#cours-commencer').find('.hide_card').show('slow')
                                    $('#cours-timer').find('.hide_card').hide('slow')
                                    $('#cours-cours').find('.hide_card').show('slow')
                                    $('#cours-fin').find('.hide_card').show('slow')
                                }
                                else if (classse.data().statut == 2) {

                                    $("#cours-timer_titre").replaceWith(`<h6 class='text-center' id='timer_count'> Timer lancé ! </h6>`);
                                    $("#btn-timer").css({ 'display': 'none' })



                                    console.log(classse.data().timer)
                                    if (classse.data().timer <= 0) {
                                        $('#cours-commencer').find('.hide_card').show('slow')
                                        $('#cours-timer').find('.hide_card').show('slow')
                                        $('#cours-cours').find('.hide_card').hide('slow')
                                        $('#cours-fin').find('.hide_card').hide('slow')
                                        $('#timer_count').text('')
                                        document.getElementById('sound-success').play()
                                        new Notyf().success({
                                            message: 'Le cours a démarré',
                                            duration: 4000,

                                            position: {
                                                x: 'center',
                                                y: 'bottom',
                                            }
                                        });

                                    } else {

                                        $('#cours-commencer').find('.hide_card').show('slow')
                                        $('#cours-timer').find('.hide_card').hide('slow')
                                        $('#cours-cours').find('.hide_card').show('slow')
                                        $('#cours-fin').find('.hide_card').show('slow')


                                        setTimeout(() => {
                                            $('#timer_count').text(Math.floor((classse.data().timer / 60) % 60) + ' minutes ' + Math.floor(classse.data().timer % 60) + ' secondes ')
                                            console.log(Math.floor(8) % 60)
                                            db.collection('classes').doc(classe.id).update({
                                                timer: classse.data().timer - 1,
                                            })
                                        }, 1000)
                                    }




                                }
                                else if (classse.data().statut == 3) {
                                    $('#cours-commencer').find('.hide_card').show('slow')
                                    $('#cours-timer').find('.hide_card').show('slow')
                                    $('#cours-cours').find('.hide_card').show('slow')
                                    $('#cours-fin').find('.hide_card').hide('slow')

                                    $("#btn-fin").replaceWith("<h2 class='text-center'>Cours clos</h2>");
                                    $("input[type=radio]").attr('disabled', true);
                                    $('#message-appel').replaceWith("<b id='message-appel' class='text-primary h5'> La feuille d'appel a été envoyée !</b>")
                                    db.collection('cours').doc(localStorage.getItem("ID_cours")).update({
                                        actif: false
                                    }).then(() => {
                                        db.collection('classes').doc(classe.id).update({
                                            statut: 0,
                                        })
                                    })

                                }


                            })







                    });


                    $('#btn-commencer').on('click', function () {
                        document.getElementById('sound-success').play()
                        new Notyf().success({
                            message: 'Vous avez commencer la session',
                            duration: 4000,
                            position: {
                                x: 'center',
                                y: 'bottom',
                            }
                        });
                        db.collection('classes').doc(classe.id).update({
                            statut: 1
                        })
                    })

                    $('#btn-timer').on('click', function () {
                        document.getElementById('sound-success').play()
                        new Notyf().success({
                            message: 'Vous commencerez le cours dans ' + document.getElementById('timer-count').value + ' minutes',
                            duration: 4000,
                            position: {
                                x: 'center',
                                y: 'bottom',
                            }
                        });
                        db.collection('classes').doc(classe.id).update({
                            statut: 2,
                            timer: document.getElementById('timer-count').value * 60
                        })



                    })

                    $('#btn-cours').on('click', function () {
                        document.getElementById('sound-success').play()
                        new Notyf().success({
                            message: 'Vous avez mis le cours en pause',
                            duration: 4000,
                            position: {
                                x: 'center',
                                y: 'bottom',
                            }
                        });
                        $("#btn-timer").css({ 'display': 'flex' })
                        $("#timer_count").replaceWith(`  <div class="row" id='cours-timer_titre'>
                        <select id='timer-count' name="hr1-debut" class="mt-2 ml-2 form-control form-control-user"
                          style="width: 40%;">
                          <option value="02">2</option>
                          <option value="03">3</option>
                          <option value="04">4</option>
                          <option value="05">5</option>
                          <option value="08">8</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option>
                          <option value="25">25</option>
                          <option value="30">30</option>

                        </select>
                        <b class="m-2 d-flex align-items-center "> minutes </b>

                      </div>`);

                        db.collection('classes').doc(classe.id).update({
                            statut: 1
                        })
                    })


                    $('#btn-fin').on('click', function () {
                        document.getElementById('sound-success').play()
                        new Notyf().success({
                            message: "Vous avez mis fin au cours, la feuille d'apel à bien été envoyée ",
                            duration: 4000,
                            position: {
                                x: 'center',
                                y: 'bottom',
                            }
                        });
                        db.collection('classes').doc(classe.id).update({
                            statut: 3,

                        })
                    })




                })






        }
    })





