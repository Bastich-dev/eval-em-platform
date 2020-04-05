$('#login').on('click', function () {


    if (($('#login_eleve')[0].checked) == true) { self.location.href = 'espace_eleve.html' }
    else if (($('#login_formateur')[0].checked) == true) { self.location.href = 'espace_formateur.html' }
    else if (($('#login_admin')[0].checked) == true) { self.location.href = 'espace_admin.html' }
})