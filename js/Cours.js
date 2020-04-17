const firebaseConfig = {
    apiKey: "AIzaSyB22w9CYMJV413plCv8yNYRgT0hr096qn8",
    authDomain: "imperator-7e26a.firebaseapp.com",
    databaseURL: "https://imperator-7e26a.firebaseio.com",
    projectId: "imperator-7e26a",
    storageBucket: "imperator-7e26a.appspot.com",
    messagingSenderId: "59630211424",
    appId: "1:59630211424:web:d9329b20431623aa230e05"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()




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

                    // Récupère les du formateur liée au cours
                    db.collection('formateurs').doc(doc.data().formateur).get()
                        .then((formateur) => {
                            $('#infos_cours').append(`
                            <div class="row justify-content-around">
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Classe :  <span class='font-weight-light'> ${classe.data().nom}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Formateur :  <span class='font-weight-light'> ${formateur.data().nom}  ${formateur.data().prenom}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Module :  <span class='font-weight-light'> ${doc.data().module}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Date :  <span class='font-weight-light'> ${doc.data().date}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Horaire Début :  <span class='font-weight-light'> ${doc.data().hr_debut}</span> </p>
                            <p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center"> Horaire Fin :  <span class='font-weight-light'> ${doc.data().hr_fin}</span> </p>
                            </div>
                            `)
                        })



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






                })

        }
    })







