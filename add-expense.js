if (typeof window.Y === 'undefined') {
  import('https://cdn.jsdelivr.net/npm/yjs@13.6.19/+esm').then((module) => {
    window.Y = module;
    return import('https://cdn.jsdelivr.net/npm/y-indexeddb@9.0.12/+esm');
  }).then((module) => {
    window.IndexeddbPersistence = module.IndexeddbPersistence;
    inicializarYjsEIndexedDB();
  }).catch((error) => {
    console.error("Erro ao carregar os módulos Yjs:", error);
  });
} else {
  inicializarYjsEIndexedDB();
}

function inicializarYjsEIndexedDB() {
  const doc = new Y.Doc();
  const ydb = new IndexeddbPersistence('expenseDB', doc);
  const expenseMap = doc.getMap('expenses');

  ydb.on('synced', () => {
    console.log('Dados de gastos sincronizados com IndexedDB');
  });

  const addExpenseBtn = document.getElementById('add-expense-btn');
  const expenseList = document.getElementById('expense-list');

  addExpenseBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const expense = document.getElementById('expense').value;
    const amount = document.getElementById('amount').value;
    const userName = localStorage.getItem('user'); // Obtém o nome do usuário logado

    if (expense && amount && userName) {
      const now = new Date();
      const date = `${now.toLocaleDateString()} ${now.getHours()}:${now.getMinutes()}`; // Formata sem os segundos
      // Adiciona o gasto à lista de exibição
      const li = document.createElement('li');
      li.textContent = `${expense}: R$ ${amount} - ${date} (Registrado por ${userName})`;
      expenseList?.appendChild(li);

      // Salvar o gasto no Yjs (IndexedDB)
      expenseMap.set(expense, {
        amount: amount,
        user: userName,
        date: date
      });

      console.log(`Gasto salvo: ${expense} - R$ ${amount}, ${date} por ${userName}`);
    } else {
      alert('Por favor, preencha todos os campos e verifique se o usuário está logado!');
    }
  });

  const backToDashboardBtn = document.getElementById('back-to-dashboard');
  backToDashboardBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = 'dashboard.html';
  });
}
