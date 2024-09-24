document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('user');
  const welcomeMessage = document.getElementById('welcome-message');

  if (userName) {
    welcomeMessage.textContent = `Bem-vindo, ${userName}!`;

    // Importar Yjs e IndexedDB
    if (typeof window.Y === 'undefined') {
      import('https://cdn.jsdelivr.net/npm/yjs@13.6.19/+esm').then((module) => {
        window.Y = module;
        return import('https://cdn.jsdelivr.net/npm/y-indexeddb@9.0.12/+esm');
      }).then((module) => {
        window.IndexeddbPersistence = module.IndexeddbPersistence;
        carregarGasto();
      }).catch((error) => {
        console.error("Erro ao carregar os módulos Yjs:", error);
      });
    } else {
      carregarGasto();
    }
  } else {
    window.location.href = 'index.html';
  }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });
});

// Função para carregar o gasto específico para edição
function carregarGasto() {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key');

  if (!key) {
    console.error('Chave do gasto não fornecida na URL.');
    return;
  }

  const doc = new Y.Doc();
  const ydb = new IndexeddbPersistence('expenseDB', doc);
  const expenseMap = doc.getMap('expenses');

  ydb.on('synced', () => {
    const expenseData = expenseMap.get(key);

    // Sempre tenta buscar os dados do gasto
    if (expenseData) {
      document.getElementById('expense').value = key; // Preenche a descrição do gasto
      document.getElementById('amount').value = expenseData.amount; // Preenche o valor
      document.getElementById('date').value = expenseData.date; // Preenche a data
    }
  });

  // Salvar alterações
  const saveEditBtn = document.getElementById('save-edit-btn');
  saveEditBtn.addEventListener('click', () => {
    const updatedExpense = document.getElementById('expense').value; // Nova descrição
    const updatedAmount = parseFloat(document.getElementById('amount').value);
    const updatedDate = document.getElementById('date').value;
    const userName = localStorage.getItem('user');

    // Remove o gasto antigo
    expenseMap.delete(key);

    // Adiciona o gasto atualizado com a nova chave (descrição)
    expenseMap.set(updatedExpense, { // Usa a nova descrição como a chave
      amount: updatedAmount,
      date: updatedDate,
      synced: false, // Marca como não sincronizado inicialmente
      user: userName
    });

    // Redirecionar de volta para a página de gastos
    window.location.href = 'dashboard.html'; // Atualize para a URL correta
  });

  // Cancelar edição
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => {
    window.location.href = 'dashboard.html'; // Atualize para a URL correta
  });
}
