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


db.collection('eleves').doc(localStorage.getItem('ID')).get()
    .then(eleve => {


        db.collection('classes').doc(eleve.data().classe).get()
            .then(classe => {

                console.log(classe.data().messages)

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





                db.collection('classes').doc(classe.id).onSnapshot((classse) => {

                    $('#statut_cours').empty()

                    if (classse.data().statut == 0) {
                        statut_cours_titre = 'Pas de cours actuellement'
                        statut_cours_message = 'Reposez vous bien '
                        statut_cours_icone = '<i class="fas fa-check-circle text-300 fa-4x text-success"></i>'
                    }
                    if (classse.data().statut == 1) {
                        statut_cours_titre = 'Le cours va commencer !'
                        statut_cours_message = 'Début du cours dans 00:00'
                        statut_cours_icone = '<i class="fas fa-exclamation-triangle text-300 fa-4x text-warning"></i>'
                    }
                    if (classse.data().statut == 2) {
                        statut_cours_titre = 'Le cours a commencer'
                        statut_cours_message = "L'accès au cours est bloqué"
                        statut_cours_icone = '<i class="fas fa-hand-paper text-300 fa-4x text-danger"></i>'
                    }




                    $('#statut_cours').append(`
                    <div class=" pt-1 pb-1 text-center">
                    <p class="h2 m-4 font-weight-bold ">${statut_cours_titre}</p>
                    ${statut_cours_icone}
                    </div>
                    <p class="h4 mt-3 font-weight-bold text-center">${statut_cours_message} </p>
                    <a class="btn btn-primary col-12 p-3 mt-4  text-center small text-uppercase text-white js-scrollTo"
                    href="#eleve-prevenir">
                    Contacter Formateur
                    </a>`)

                })



            })


    })



