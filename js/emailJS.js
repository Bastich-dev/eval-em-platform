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

const USER_ID = 'user_tj5B4Sy5rP8kEIPzlRfU2'
const TEMPLATE_ID = 'email_tepmplate_oubli'


$('#submit').on('submit', function (e) {
    e.preventDefault()
    const postes = ['eleves', 'formateurs', 'admins']
    for (let i = 0; i < postes.length; i++) {
        db.collection(postes[i]).where('identifiant', '==', document.getElementById('exampleInputEmail').value).get()
            .then(user => {
                user.forEach(element => {
                    if (element.empty == true) { console.log('pas trouvé') }
                    else {
                        document.getElementById('tomail').value = element.data().mail
                        document.getElementById('iden').value = element.data().identifiant
                        document.getElementById('pass').value = element.data().password
                        emailjs
                            .sendForm('gmail', TEMPLATE_ID, e.target, USER_ID)
                            .then(
                                () => {
                                    document.getElementById('sound-success').play()
                                    new Notyf().success({
                                        message: "Le mot de passe a été envoyé a l'adrese e-mail liée à cet identifiant ",
                                        duration: 4000,

                                        position: {
                                            x: 'center',
                                            y: 'bottom',
                                        }
                                    });
                                })
                    }
                })
            });
    }
})