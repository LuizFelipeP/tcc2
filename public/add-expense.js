// Inicializar Yjs e IndexedDB para salvar os gastos
import * as Y from 'https://cdn.jsdelivr.net/npm/yjs@13.6.19/+esm';
import { IndexeddbPersistence } from 'https://cdn.jsdelivr.net/npm/y-indexeddb@9.0.12/+esm';

const doc = new Y.Doc();
const ydb = new IndexeddbPersistence('expenseDB', doc);
const expenseMap = doc.getMap('expenses'); // Certifique-se de definir o mapa corretamente

ydb.on('synced', () => {
  console.log('Dados de gastos sincronizados com IndexedDB');
});

// Lidar com a adição de gastos
const addExpenseBtn = document.getElementById('add-expense-btn'); // Corrigido o ID
const expenseList = document.getElementById('expense-list'); // Certifique-se de que esse elemento existe se necessário

addExpenseBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Evitar comportamento padrão do botão
  const expense = document.getElementById('expense').value;
  const amount = document.getElementById('amount').value;

  if (expense && amount) {
    // Adicionar gasto à lista (se existir uma lista)
    const li = document.createElement('li');
    li.textContent = `${expense}: R$ ${amount}`;
    expenseList?.appendChild(li); // Opcional se a lista existir no DOM

    // Salvar o gasto no Yjs (IndexedDB)
    expenseMap.set(expense, amount);
    console.log(`Gasto salvo: ${expense} - R$ ${amount}`);
  } else {
    alert('Por favor, preencha a descrição e o valor do gasto!');
  }
});

// Voltar para o dashboard
const backToDashboardBtn = document.getElementById('back-to-dashboard');
backToDashboardBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Prevenir comportamento padrão do botão
  window.location.href = '/pages/dashboard.html'; // Certifique-se de que o caminho está correto
});
