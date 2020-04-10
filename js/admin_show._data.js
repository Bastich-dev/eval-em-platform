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


//  AFFICHAGE ELEVE 
db.collection('eleves').get()
  .then(snapshot => {
    snapshot.forEach(doc => {

      const infos_eleve = doc.data()

      $('#EleveTable').DataTable().row.add([
        `<td> <a href="espace_admin_user.html" class='goToUser eleves'  id ='${doc.id}'>  ${infos_eleve.nom}  ${infos_eleve.prenom}  </a> </td>`,
        `<td> ${infos_eleve.mail} </td>`,
        `<td> <a href=""> ${infos_eleve.classe}</a></td>`,
        ` <td>Groupe</td>`,
        `     <td>
                <div class="d-flex">
                  <div class="col-auto">
                    <i class="  ${ colorIndicator(infos_eleve.indicator_1)} text-300" ></i>
                  </div>
                  <div class="col-auto">
                    <i class="${ colorIndicator(infos_eleve.indicator_2)} text-300" style="color: #1cc88a;"></i>
                  </div>
                  <div class="col-auto">
                    <i class="${ colorIndicator(infos_eleve.indicator_3)}  text-300" style="color: #f6c23e;"></i>
                  </div>
                </div>
              </td>`,
        `      <td>  Modifier </td>`
      ]).draw();
    });
  })
  .then(() => {
    $('.goToUser').on('click', function () {
      const goToPoste = $(this).attr('class').split(' ')
      localStorage.setItem("editUser", $(this).attr('id'));
      localStorage.setItem("editUserPoste", goToPoste[1]);
    })
  })
  .catch(err => {
    console.log('Error getting informations', err);
  });


//  AFFICHAGE FORMATEUR 
db.collection('formateurs').get()
  .then(snapshot => {
    snapshot.forEach(doc => {

      const infos_formateur = doc.data()

      $('#FormateurTable').DataTable().row.add([
        `<td> <a href="espace_admin_user.html" class='goToUser formateurs'  id ='${doc.id}'>  ${infos_formateur.nom}  ${infos_formateur.prenom}  </a> </td>`,
        `<td> ${infos_formateur.mail} </td>`,
        ` <td> ${infos_formateur.cours.length} </td>`,

      ]).draw();
    });
  })
  .then(() => {
    $('.goToUser').on('click', function () {
      const goToPoste = $(this).attr('class').split(' ')
      localStorage.setItem("editUser", $(this).attr('id'));
      localStorage.setItem("editUserPoste", goToPoste[1]);
    })
  })
  .catch(err => {
    console.log('Error getting informations', err);
  });


//  AFFICHAGE ADMINISTRATEUR 
db.collection('admins').get()
  .then(snapshot => {
    snapshot.forEach(doc => {

      const infos_formateur = doc.data()

      $('#AdminTable').DataTable().row.add([
        `<td> <a href="espace_admin_user.html" class='goToUser admins'  id ='${doc.id}'>  ${infos_formateur.nom}  ${infos_formateur.prenom}  </a> </td>`,
        `<td> ${infos_formateur.mail} </td>`,
        ` <td> ${infos_formateur.date} </td>`,

      ]).draw();
    });
  })
  .then(() => {
    $('.goToUser').on('click', function () {
      const goToPoste = $(this).attr('class').split(' ')
      localStorage.setItem("editUser", $(this).attr('id'));
      localStorage.setItem("editUserPoste", goToPoste[1]);
    })
  })
  .catch(err => {
    console.log('Error getting informations', err);
  });








function colorIndicator(indice) {
  let color = ''
  if (indice == 1) color = `fas fa-check-circle text-success`
  else if (indice == 2) color = `fas fa-exclamation-triangle text-warning`
  else if (indice == 3) color = `fas fa-exclamation-circle text-danger`
  return color
}