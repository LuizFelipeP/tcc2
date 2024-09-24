if (typeof window.Y === 'undefined') {
    // Importação dinâmica dos módulos
    import('https://cdn.jsdelivr.net/npm/yjs@13.6.19/+esm').then((module) => {
        window.Y = module; // Defina Y globalmente
        return import('https://cdn.jsdelivr.net/npm/y-indexeddb@9.0.12/+esm');
    }).then((module) => {
        window.IndexeddbPersistence = module.IndexeddbPersistence; // Defina IndexeddbPersistence globalmente

        // Inicializar Yjs e IndexedDB após o carregamento dos módulos
        inicializarYjsEIndexedDB();

    }).catch((error) => {
        console.error("Erro ao carregar os módulos Yjs:", error);
    });
} else {
    // Se Yjs já estiver carregado, reutilize as instâncias existentes
    const Y = window.Y;
    const IndexeddbPersistence = window.IndexeddbPersistence;
    inicializarYjsEIndexedDB();
}

// Função para inicializar Yjs e IndexedDB
function inicializarYjsEIndexedDB() {
    const doc = new Y.Doc();
    const ydb = new IndexeddbPersistence('userDB', doc);
    const userMap = doc.getMap('users');

    ydb.on('synced', () => {
        console.log('Dados sincronizados com o IndexedDB');
    });

    // Alternar entre login e registro
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');

    showRegisterBtn.addEventListener('click', () => {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
        setTimeout(() => {
            registerContainer.style.opacity = '1';
        }, 100);
    });

    showLoginBtn.addEventListener('click', () => {
        registerContainer.style.opacity = '0';
        setTimeout(() => {
            registerContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        }, 300);
    });

    // Função para salvar usuário no Yjs (IndexedDB)
    function saveUser(email, password) {
        if (userMap.has(email)) {
            return false; // Usuário já registrado
        } else {
            userMap.set(email, { email, password });
            return true;
        }
    }

    // Função para verificar se o usuário está registrado
    function validateUser(email, password) {
        const user = userMap.get(email);
        if (user && user.password === password) {
            // Salva o nome do usuário no localStorage
            localStorage.setItem('user', email);
            return true; // Login válido
        }
        return false; // Login inválido
    }

    // Ações de login e registro
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (email && password) {
            if (validateUser(email, password)) {
                alert(`Usuário ${email} logado com sucesso!`);
                // Redirecionar para o dashboard
                window.location.href = '../pages/dashboard.html';
            } else {
                alert('Usuário ou senha inválidos!');
            }
        } else {
            alert('Por favor, preencha todos os campos!');
        }
    });

    registerBtn.addEventListener('click', () => {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (email && password) {
            if (saveUser(email, password)) {
                alert(`Usuário ${email} registrado com sucesso!`);
                showLoginBtn.click();
            } else {
                alert('Usuário já está registrado!');
            }
        } else {
            alert('Por favor, preencha todos os campos!');
        }
    });
}