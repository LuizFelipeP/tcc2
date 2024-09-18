document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('user');
    const welcomeMessage = document.getElementById('welcome-message');
    const expenseList = document.getElementById('expense-list'); // Certifique-se de que este elemento exista no HTML

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
    }
});

// Função para carregar os gastos
function carregarGastos() {
    const doc = new Y.Doc();
    const ydb = new IndexeddbPersistence('expenseDB', doc);
    const expenseMap = doc.getMap('expenses');

    ydb.on('synced', () => {
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = ''; // Limpa a lista antes de preencher

        // Itera sobre os gastos e adiciona cada um à lista
        expenseMap.forEach((value, key) => {
            const li = document.createElement('li');
            li.textContent = `${key}: R$ ${value.amount} - ${value.date} (Registrado por ${value.user})`;
            expenseList.appendChild(li);
        });

        console.log('Gastos carregados com sucesso');
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
