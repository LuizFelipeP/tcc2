// Carregar o nome do usuário do localStorage
document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('user');
    const welcomeMessage = document.getElementById('welcome-message');

    if (userName) {
        welcomeMessage.textContent = `Bem-vindo, ${userName}!`;
    } else {
        // Se o usuário não estiver logado, redirecionar de volta para o login
        window.location.href = '/index.html';
    }
});

// Lidar com a adição de gastos
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseList = document.getElementById('expense-list');

addExpenseBtn.addEventListener('click', () => {
    const expense = document.getElementById('expense').value;
    const amount = document.getElementById('amount').value;

    if (expense && amount) {
        const li = document.createElement('li');
        li.textContent = `${expense}: R$ ${amount}`;
        expenseList.appendChild(li);

        // Aqui você pode adicionar lógica para salvar os gastos no IndexedDB ou Yjs
        // Exemplo de como salvar no Yjs:
        // const expenseMap = doc.getMap('expenses');
        // expenseMap.set(expense, amount);
    } else {
        alert('Por favor, preencha a descrição e o valor do gasto!');
    }
});

// Logout
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
});
