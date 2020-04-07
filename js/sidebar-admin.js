$(".sidebar_ajout_user").on('click', function () {

    const sidebar_ajout = $(this).text()
    let lol = 0
    if (sidebar_ajout == 'Élève') lol = 1
    else if (sidebar_ajout == 'Formateur') lol = 2
    else if (sidebar_ajout == 'Admin') lol = 3
    localStorage.setItem('sidebar-ajout-user', lol)
})

$("#input-poste").prop("selectedIndex", localStorage.getItem('sidebar-ajout-user'));

// Disable input Classe pour touts les postes sauf élève
document.getElementById('input-poste').addEventListener('change', function () {
    if (document.getElementById('input-poste').value != 'eleve') {
        document.getElementById('input-classe').value = ''
        document.getElementById('input-classe').disabled = true
        document.getElementById('input-classe').required = false
    }
    else {
        document.getElementById('input-classe').disabled = false
        document.getElementById('input-classe').required = true
    }
})


if (document.getElementById('input-poste').value != 'eleve') {
    document.getElementById('input-classe').value = ''
    document.getElementById('input-classe').disabled = true
    document.getElementById('input-classe').required = false
}
else {
    document.getElementById('input-classe').disabled = false
    document.getElementById('input-classe').required = true
}
