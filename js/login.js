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


localStorage.setItem('ID', null)
localStorage.setItem('ID_poste', null)

$('#formLogin').on('submit', function (e) {
    e.preventDefault()

    if (($('#login_eleve')[0].checked) == true) {

        db.collection('eleves').where('identifiant', '==', $('#Identifiant').val()).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    $('#errId').css('visibility', 'visible')
                    return;
                } else {
                    db.collection('eleves').where('password', '==', $('#Password').val()).get()
                        .then(snapshot => {
                            if (snapshot.empty) {
                                $('#errId').css('visibility', 'visible')
                                return;
                            } else {
                                snapshot.forEach(doc => {
                                    console.log(doc.id);
                                    localStorage.setItem('ID', doc.id)
                                    localStorage.setItem('ID_poste', 'eleves')
                                    $('#errId').css('visibility', 'hidden')
                                    self.location.href = 'espace_eleve.html'
                                });
                            }
                        })
                        .catch(err => {
                            console.log('Error getting documents', err);
                        });
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }


    else if (($('#login_formateur')[0].checked) == true) {

        db.collection('formateurs').where('identifiant', '==', $('#Identifiant').val()).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    $('#errId').css('visibility', 'visible')
                    return;
                } else {
                    db.collection('formateurs').where('password', '==', $('#Password').val()).get()
                        .then(snapshot => {
                            if (snapshot.empty) {
                                $('#errId').css('visibility', 'visible')
                                return;
                            } else {
                                snapshot.forEach(doc => {
                                    console.log(doc.id);
                                    localStorage.setItem('ID', doc.id)
                                    localStorage.setItem('ID_poste', 'formateurs')
                                    $('#errId').css('visibility', 'hidden')
                                    self.location.href = 'espace_formateur.html'
                                });
                            }
                        })
                        .catch(err => {
                            console.log('Error getting documents', err);
                        });
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }
    else if (($('#login_admin')[0].checked) == true) {

        db.collection('admins').where('identifiant', '==', $('#Identifiant').val()).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    $('#errId').css('visibility', 'visible')
                    return;
                } else {
                    db.collection('admins').where('password', '==', $('#Password').val()).get()
                        .then(snapshot => {
                            if (snapshot.empty) {
                                $('#errId').css('visibility', 'visible')
                                return;
                            } else {
                                snapshot.forEach(doc => {
                                    console.log(doc.id);
                                    localStorage.setItem('ID', doc.id)
                                    localStorage.setItem('ID_poste', 'admins')
                                    $('#errId').css('visibility', 'hidden')
                                    self.location.href = 'espace_admin.html'
                                });
                            }
                        })
                        .catch(err => {
                            console.log('Error getting documents', err);
                        });
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }



})

