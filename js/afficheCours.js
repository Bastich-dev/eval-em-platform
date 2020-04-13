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


db.collection('cours').where('formateur', '==', localStorage.getItem('ID')).get()
    .then(snapshot => {
        snapshot.forEach(doc => {


            if (doc.data().actif == true) {
                const infos_classe = doc.data()
                let lul = ''
                db.collection('classes').doc(infos_classe.classe).get()
                    .then(snapshot => {
                        db.collection('formateurs').doc(infos_classe.formateur).get()
                            .then(doc => {

                                $('#CoursTable').DataTable().row.add([
                                    `<td>  ${infos_classe.date}</td>`,
                                    `<td> <a href="espace_admin_classe.html" class='goToClasse'  id ='${doc.id}'>   ${snapshot.data().nom}  </a> </td>`,
                                    `<td> ${doc.data().prenom}  ${doc.data().nom} </td>`,
                                    `<td>  ${infos_classe.module}</td>`,
                                    `<td>   ${infos_classe.hr_debut}  </a> </td>`,
                                    `<td> ${infos_classe.hr_fin} </td>`,
                                    `<td>  lol</td>`,
                                ]).draw();
                            })
                            .catch(err => {
                                console.log('Error getting documents', err);
                            });
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
            }


            const d = new Date()
            const dtf = new Intl.DateTimeFormat('fr', { year: 'numeric', month: '2-digit', day: '2-digit' })
            const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(d)
            if (doc.data().date == (ye + '-' + mo + '-' + da)) {
                const infos_classe = doc.data()
                let lul = ''
                db.collection('classes').doc(infos_classe.classe).get()
                    .then(snapshot => {
                        db.collection('formateurs').doc(infos_classe.formateur).get()
                            .then(doc => {

                                let actif = ``
                                if (infos_classe.actif == false) actif = `  <div
                                class="card-header py-3 d-flex  align-items-center justify-content-between bg-success">
                                <h6 class=" font-weight-bold text-white text-uppercase">
                                    Terminé
                                </h6>
                                <i class="fas fa-check-circle fa-2x text-300"
                                    style="color: white;"></i>
                            </div>`
                                else actif = `    <div
class="card-header py-3 d-flex  align-items-center justify-content-between bg-info">
<h6 class=" font-weight-bold text-white text-uppercase">
    à faire
</h6>
<i class="fas fa-chevron-circle-down fa-2x text-300"
    style="color: white;"></i>
</div>`


                                let lul = ``
                                lul += `
                                <!-- CARD COURS -->
                                <div class="col-lg-4  col-md-12 ">
                                    <div class="card shadow m-3 cours">
                                    ${actif}
                                        <div class="card-body text-white bg-primary">
                                            <h6>Module : ${infos_classe.module} </h6>
                                            <h6>Groupe :  ${snapshot.data().groupe}</h6>
                                            <h6>Classe : ${snapshot.data().nom}</h6>
                                            <h6>Horaire début : ${infos_classe.hr_debut}</h6>
                                            <h6>Horaire fin : ${infos_classe.hr_fin}</h6>
                                        </div>
                                    </div>
                                </div>`


                                $('#cours_cards').append(lul)
                                $('.cours').on('click', function () {
                                    self.location.href = 'espace_formateur_cours.html'
                                })

                            })
                            .catch(err => {
                                console.log('Error getting documents', err);
                            });
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
            }






        });
    })
    .then(() => {

    })
    .catch(err => {
        console.log('Error getting informations', err);
    });




