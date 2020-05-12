


// SET STUDENT DATATABLE
db.collection('eleves').onSnapshot(eleves => {
  $('#EleveTable').DataTable().clear()
  eleves.forEach(eleve => {
    db.collection('classes').doc(eleve.data().classe).get()
      .then(classe => {
        let absences_semaine = 0
        let absences_mois = 0
        let absences_trimestre = 0
        let absences_non_justifiee = 0
        db.collection('absences').where('eleve', '==', eleve.id).get().then((doc) => {
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
        })
        db.collection('absences').where('eleve', '==', eleve.id).onSnapshot((abs) => {
          abs.forEach((elem) => {
            if (elem.data().justifiee == false) absences_non_justifiee += 1
          })
        })
        $('#EleveTable').DataTable().row.add([
          `<td> <a href="espace_admin_utilisateur_modifier.html" class='goToUser eleves'  id ='${eleve.id}'>  ${eleve.data().nom}  ${eleve.data().prenom}  </a> </td>`,
          `<td> ${eleve.data().mail} </td>`,
          `<td> <a href="espace_admin_classe_modifier.html" class='goToClasse'  id ='${classe.id}'>   ${classe.data().nom}  </a> </td>`,
          ` <td>${classe.data().groupe}</td>`,
          `     <td>
                <div class="d-flex">
                  <div class="col-auto">
                    <i class="  ${ colorIndicator(absences_semaine)} text-300" ></i>
                  </div>
                  <div class="col-auto">
                    <i class="${ colorIndicator(absences_mois)} text-300" style="color: #1cc88a;"></i>
                  </div>
                  <div class="col-auto">
                    <i class="${ colorIndicator(absences_trimestre)}  text-300" style="color: #f6c23e;"></i>
                  </div>
                  <div class="col-auto">
                  <i class="${ colorIndicator(absences_non_justifiee)}  text-300" style="color: #f6c23e;"></i>
                </div>
                </div>
              </td>`,
        ]).draw();
      })
  });
})


// STUDENT GOTOCLASS ON CLICK
$('#EleveTable').on('click', '.goToClasse', function () {
  localStorage.setItem("editClasse", $(this).attr('id'));
})

// STUDENT GOTOUSER ON CLICK
$('#EleveTable').on('click', '.goToUser', function () {
  const goToPoste = $(this).attr('class').split(' ')
  localStorage.setItem("editUser", $(this).attr('id'));
  localStorage.setItem("editUserPoste", goToPoste[1]);
})




// SET FORMERS DATATABLE
db.collection('formateurs').onSnapshot(formateurs => {
  $('#FormateurTable').DataTable().clear()
  formateurs.forEach(formateur => {
    db.collection('cours').where('formateur', '==', formateur.id).get().then((info) => {
      $('#FormateurTable').DataTable().row.add([
        `<td> <a href="espace_admin_utilisateur_modifier.html" class='goToUser formateurs'  id ='${formateur.id}'>  ${formateur.data().nom}  ${formateur.data().prenom}  </a> </td>`,
        `<td> ${formateur.data().mail} </td>`,
        ` <td> ${info.docs.length} </td>`,
      ]).draw();
    })
  });
})

// FORMER GOTOUSER ON CLICK
$('#FormateurTable').on('click', '.goToUser', function () {
  const goToPoste = $(this).attr('class').split(' ')
  localStorage.setItem("editUser", $(this).attr('id'));
  localStorage.setItem("editUserPoste", goToPoste[1]);
})


// SET ADMINS DATATABLE
db.collection('admins').get()
  .then(formateurs => {
    formateurs.forEach(formateur => {
      $('#AdminTable').DataTable().row.add([
        `<td> <a href="espace_admin_utilisateur_modifier.html" class='goToUser admins'  id ='${formateur.id}'>  ${formateur.data().nom}  ${formateur.data().prenom}  </a> </td>`,
        `<td> ${formateur.data().mail} </td>`,
        ` <td> ${formateur.data().date} </td>`,
      ]).draw();
      $('.goToUser').bind()
      $('.goToUser').bind('click', function () {
        const goToPoste = $(this).attr('class').split(' ')
        localStorage.setItem("editUser", $(this).attr('id'));
        localStorage.setItem("editUserPoste", goToPoste[1]);
      })
    });
  })


// ADMIN GOTOUSER ON CLICK
$('#AdminTable').on('click', '.goToUser', function () {
  const goToPoste = $(this).attr('class').split(' ')
  localStorage.setItem("editUser", $(this).attr('id'));
  localStorage.setItem("editUserPoste", goToPoste[1]);
})

