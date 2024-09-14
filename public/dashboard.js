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

// Redirecionar para a página de adição de gastos
const addExpenseBtn = document.getElementById('add-expense-btn');
addExpenseBtn.addEventListener('click', () => {
    window.location.href = '/pages/add-expense.html'; // Redireciona para uma nova página
});

// Logout
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
});
