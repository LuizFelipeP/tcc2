// Inicializar Yjs e IndexedDB para salvar os gastos
import * as Y from 'https://cdn.jsdelivr.net/npm/yjs@13.6.19/+esm';
import { IndexeddbPersistence } from 'https://cdn.jsdelivr.net/npm/y-indexeddb@9.0.12/+esm';

const doc = new Y.Doc();
const ydb = new IndexeddbPersistence('expenseDB', doc);
const expenseMap = doc.getMap('expenses');

ydb.on('synced', () => {
  console.log('Dados de gastos sincronizados com IndexedDB');
});

// Lidar com o envio do formulário de adição de gastos
const expenseForm = document.getElementById('expense-form');
expenseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const expense = document.getElementById('expense').value;
  const amount = document.getElementById('amount').value;

  if (expense && amount) {
    // Salvar o gasto no Yjs (IndexedDB)
    expenseMap.set(expense, amount);

    alert('Gasto adicionado com sucesso!');
    // Limpar os campos do formulário
    document.getElementById('expense').value = '';
    document.getElementById('amount').value = '';
  } else {
    alert('Por favor, preencha todos os campos!');
  }
});

// Voltar para o dashboard
const backToDashboardBtn = document.getElementById('back-to-dashboard');
backToDashboardBtn.addEventListener('click', () => {
  window.location.href = '/pages/dashboard.html';
});
