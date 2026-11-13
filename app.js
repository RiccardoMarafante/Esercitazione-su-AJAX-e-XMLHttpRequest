document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const output = document.getElementById('output');
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    function fetchUsers(query = '') {
        loading.classList.remove('hidden');
        errorDiv.classList.add('hidden');
        output.innerHTML = '';

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://jsonplaceholder.typicode.com/users', true);
        
        xhr.onload = function () {
            loading.classList.add('hidden');
            if (xhr.status === 200) {
                try {
                    const users = JSON.parse(xhr.responseText);
                    const filtered = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
                    renderUsers(filtered);
                } catch (e) {
                    showError('Errore nel parsing dei dati JSON.');
                }
            } else {
                showError(`Errore del server: ${xhr.status}`);
            }
        };

        xhr.onerror = function () {
            loading.classList.add('hidden');
            showError('Errore di rete: impossibile raggiungere il server.');
        };

        xhr.send();
    }

    function renderUsers(users) {
        if (users.length === 0) {
            output.innerHTML = '<p>Nessun utente trovato.</p>';
            return;
        }

        users.forEach(user => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Città:</strong> ${user.address.city}</p>
                <p><strong>Azienda:</strong> ${user.company.name}</p>
            `;
            output.appendChild(card);
        });
    }

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.classList.remove('hidden');
    }

    searchBtn.addEventListener('click', () => {
        fetchUsers(searchInput.value);
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            fetchUsers(searchInput.value);
        }
    });

    // Caricamento iniziale
    fetchUsers();
});