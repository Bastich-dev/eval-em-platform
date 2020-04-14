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

// // [Start] Quand 'eleves' est modifé...   
// db.collection('eleves').onSnapshot(() => {

// })
// // [End] Quand 'eleves' est modifé...   

// [Start] Récupère tous les élèves ...  
db.collection('eleves').get()
  .then(eleves => {

    // [Start] Pour chaque élève ...
    eleves.forEach(eleve => {

      $('#EleveTable').DataTable().row.add([
        `<td> <a href="espace_admin_user.html" class='goToUser eleves'  id ='${eleve.id}'>  ${eleve.data().nom}  ${eleve.data().prenom}  </a> </td>`,
        `<td> ${eleve.data().mail} </td>`,
        `<td> <a href=""> ${eleve.data().classe}</a></td>`,
        ` <td>Groupe</td>`,
        `     <td>
                <div class="d-flex">
                  <div class="col-auto">
                    <i class="  ${ colorIndicator(eleve.data().indicator_1)} text-300" ></i>
                  </div>
                  <div class="col-auto">
                    <i class="${ colorIndicator(eleve.data().indicator_2)} text-300" style="color: #1cc88a;"></i>
                  </div>
                  <div class="col-auto">
                    <i class="${ colorIndicator(eleve.data().indicator_3)}  text-300" style="color: #f6c23e;"></i>
                  </div>
                </div>
              </td>`,
        `      <td>  Modifier </td>`
      ]).draw();

    });
    // [End] Pour chaque élève ...
  })
  .then(() => {
    // [Start] Récupère ID élèves quand click ...  
    $('.goToUser').on('click', function () {
      const goToPoste = $(this).attr('class').split(' ')
      localStorage.setItem("editUser", $(this).attr('id'));
      localStorage.setItem("editUserPoste", goToPoste[1]);
    })
    // [End] Récupère ID élèves quand click ...  

  })
  .catch(err => {
    console.log('Error getting informations', err);
  });
// [End] Récupère tous les élèves ...  






//  AFFICHAGE FORMATEUR 

// [Start] Récupère tous les formateurs ... 
db.collection('formateurs').get()
  .then(formateurs => {

    // [Start] Pour chaque formateur ...
    formateurs.forEach(formateur => {

      $('#FormateurTable').DataTable().row.add([
        `<td> <a href="espace_admin_user.html" class='goToUser formateurs'  id ='${formateur.id}'>  ${formateur.data().nom}  ${formateur.data().prenom}  </a> </td>`,
        `<td> ${formateur.data().mail} </td>`,
        ` <td> ${formateur.data().cours.length} </td>`,
      ]).draw();

    });
    // [End] Pour chaque formateur ...
  })
  .then(() => {
    // [Start] Récupère ID formateur quand click ...  
    $('.goToUser').on('click', function () {
      const goToPoste = $(this).attr('class').split(' ')
      localStorage.setItem("editUser", $(this).attr('id'));
      localStorage.setItem("editUserPoste", goToPoste[1]);
    })
    // [End] Récupère ID formateur quand click ...  
  })
  .catch(err => {
    console.log('Error getting informations', err);
  });
// [End] Récupère tous les formateurs ... 



//  AFFICHAGE ADMINISTRATEUR 

// [Start] Récupère tous les administrateurs ... 
db.collection('admins').get()
  .then(formateurs => {

    // [Start] Pour chaque administrateur ...
    formateurs.forEach(formateur => {

      $('#AdminTable').DataTable().row.add([
        `<td> <a href="espace_admin_user.html" class='goToUser admins'  id ='${formateur.id}'>  ${formateur.data().nom}  ${formateur.data().prenom}  </a> </td>`,
        `<td> ${formateur.data().mail} </td>`,
        ` <td> ${formateur.data().date} </td>`,
      ]).draw();

    });
    // [End] Pour chaque administrateur ...

  })
  .then(() => {
    // [Start] Récupère ID administrateur quand click ...  
    $('.goToUser').on('click', function () {
      const goToPoste = $(this).attr('class').split(' ')
      localStorage.setItem("editUser", $(this).attr('id'));
      localStorage.setItem("editUserPoste", goToPoste[1]);
    })
    // [End] Récupère ID administrateur quand click ...  
  })
  .catch(err => {
    console.log('Error getting informations', err);
  });
// [Start] Récupère tous les administrateurs ... 






///////////////////////     FONCTIONS //////////////////////////



// ICONE INDICATOR ELEVE
function colorIndicator(indice) {
  let color = ''
  if (indice == 1) color = `fas fa-check-circle text-success`
  else if (indice == 2) color = `fas fa-exclamation-triangle text-warning`
  else if (indice == 3) color = `fas fa-exclamation-circle text-danger`
  return color
}