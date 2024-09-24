document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('user');
    const welcomeMessage = document.getElementById('welcome-message');
    const expenseList = document.getElementById('expense-list');

    if (userName) {
        welcomeMessage.textContent = `Bem-vindo, ${userName}!`;

        // Importar Yjs e IndexedDB
        if (typeof window.Y === 'undefined') {
            import('https://cdn.jsdelivr.net/npm/yjs@13.6.19/+esm').then((module) => {
                window.Y = module;
                return import('https://cdn.jsdelivr.net/npm/y-indexeddb@9.0.12/+esm');
            }).then((module) => {
                window.IndexeddbPersistence = module.IndexeddbPersistence;
                carregarGastos();
            }).catch((error) => {
                console.error("Erro ao carregar os módulos Yjs:", error);
            });
        } else {
            carregarGastos();
        }
    } else {
        window.location.href = '/index.html';


        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
              .then((registration) => {
                  console.log('Service Worker registrado com sucesso:', registration.scope);
              })
              .catch((error) => {
                  console.error('Falha ao registrar o Service Worker:', error);
              });
        }

    }
});

// Função para carregar os gastos
function carregarGastos() {
    const doc = new Y.Doc();
    const ydb = new IndexeddbPersistence('expenseDB', doc);
    const expenseMap = doc.getMap('expenses');

    ydb.on('synced', () => {
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = ''; // Limpa a tabela antes de preencher


        expenseMap.forEach((value, key) => {
            // Cria uma nova linha na tabela
            const tr = document.createElement('tr');


            // Status (sincronizado ou não)
            const statusTd = document.createElement('td');
            const statusCircle = document.createElement('span');
            statusCircle.classList.add('status-circle');
            statusCircle.classList.add(value.synced ? 'status-synced' : 'status-not-synced');
            statusTd.appendChild(statusCircle);

            // Usuário que fez o gasto
            const userTd = document.createElement('td');
            userTd.textContent = value.user;

            // Descrição do gasto
            const descriptionTd = document.createElement('td');
            descriptionTd.textContent = key;

            // Valor do gasto
            const amountTd = document.createElement('td');
            amountTd.textContent = `R$ ${value.amount}`;

            // Data do gasto
            const dateTd = document.createElement('td');
            dateTd.textContent = value.date;

            // Botão de remover
            const actionTd = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-expense-btn');
            removeBtn.innerHTML = 'X';
            removeBtn.addEventListener('click', () => {
                expenseMap.delete(key); // Remover o item do Yjs
                tr.remove(); // Remove o item da lista na interface imediatamente
            });
            actionTd.appendChild(removeBtn);

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-expense-btn');
            editBtn.innerHTML = '✏️'; // Ícone de lápis
            editBtn.addEventListener('click', () => {
                window.location.href = `../pages/editar.html?key=${encodeURIComponent(key)}`;
            });
            actionTd.appendChild(editBtn);


            // Adiciona os elementos à linha (tr) na ordem correta
            tr.appendChild(statusTd);
            tr.appendChild(userTd);
            tr.appendChild(descriptionTd);
            tr.appendChild(amountTd);
            tr.appendChild(dateTd);
            tr.appendChild(actionTd);

            // Adiciona a linha ao corpo da tabela
            expenseList.appendChild(tr);
        });

        console.log('Gastos carregados com sucesso');
    });


}



// Função para remover gasto
function removerGasto(key) {
    const doc = new Y.Doc();
    const ydb = new IndexeddbPersistence('expenseDB', doc);
    const expenseMap = doc.getMap('expenses');

    ydb.on('synced', () => {
        expenseMap.delete(key);  // Remove o gasto do Yjs map
        console.log(`Gasto "${key}" removido`);
    });
}

// Redirecionar para a página de adição de gastos
const addExpenseBtn = document.getElementById('add-expense-btn');
addExpenseBtn.addEventListener('click', () => {
    window.location.href = '../pages/add-expense.html';
});

// Logout
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/index.html';




});

