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

let Ref = db.collection(localStorage.getItem("editUserPoste")).doc(localStorage.getItem("editUser"));
let getDoc = Ref.get()
    .then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', doc.data());
            const infos_user = doc.data()
            console.log(infos_user)
            document.getElementById('user-nom').value = infos_user.nom
            document.getElementById('user-prenom').value = infos_user.prenom
            document.getElementById('user-classe').value = infos_user.classe
            document.getElementById('user-mail').value = infos_user.mail
            document.getElementById('user-identifiant').value = infos_user.identifiant
            document.getElementById('user-poste').value = infos_user.poste
            document.getElementById('user-password').value = infos_user.password
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });

