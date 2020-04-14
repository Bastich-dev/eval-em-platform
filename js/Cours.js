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





db.collection('cours').doc(localStorage.getItem("ID_cours"))
    .get()
    .then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            const infos_user = doc.data()
            console.log(infos_user)


            db.collection('classes').doc(infos_user.classe).get()
                .then(snapshot2 => {

                    console.log(snapshot2.data().eleves)


                    db.collection('formateurs').doc(infos_user.formateur).get()
                        .then((snapshot3) => {



                            let lul = ``
                            lul += `
<div class="row justify-content-around">
<p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Classe :  <span class='font-weight-light'> ${snapshot2.data().nom}</span> </p>
<p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Formateur :  <span class='font-weight-light'> ${snapshot3.data().nom}  ${snapshot3.data().prenom}</span> </p>
<p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Module :  <span class='font-weight-light'> ${infos_user.module}</span> </p>
<p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Date :  <span class='font-weight-light'> ${infos_user.date}</span> </p>
<p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center">  Horaire Début :  <span class='font-weight-light'> ${infos_user.hr_debut}</span> </p>
<p class="h4 col-lg-4 col-sm-12 mt-3 font-weight-bold text-center"> Horaire Fin :  <span class='font-weight-light'> ${infos_user.hr_fin}</span> </p>
</div>
`
                            $('#infos_cours').append(lul)


                        })
                })
        }

    })
