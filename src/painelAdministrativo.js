
// ======= FUNÇÕES CORE (SPA & TOAST) =======

// Exibe notificações sem usar alert()
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if(type === 'success') icon = '✅';
    if(type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Remove o toast após 4 segundos
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.4s forwards';
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4000);
}

// Sistema de navegação de Views
function navigate(viewId) {
    // Oculta todas as views
    document.querySelectorAll('.view').forEach(el => {
        el.classList.remove('active');
    });
    // Mostra a view desejada
    document.getElementById(viewId).classList.add('active');

    // Atualiza status do menu
    if(viewId !== 'view-login') {
        document.getElementById('main-nav').style.display = 'flex';
    }
}


// ======= LÓGICA DE NEGÓCIO =======

// Fluxo 1: Login do Bibliotecário
function handleLogin(e) {
    e.preventDefault();
    showToast('Login realizado com sucesso!', 'success');
    navigate('view-dashboard');
}

function logout() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('form-login').reset();
    navigate('view-login');
    showToast('Você saiu do sistema.', 'info');
}

// Fluxo 2: Cadastrar/Editar Livro
function handleCadastroLivro(e) {
    e.preventDefault();
    
    // Simula a coleta de dados
    const titulo = document.getElementById('livro-titulo').value;
    const qtd = document.getElementById('livro-qtd').value;
    
    // Simula salvamento no banco de dados
    setTimeout(() => {
        showToast(`Livro "${titulo}" (${qtd} exemplares) salvo no Banco de Dados com sucesso!`, 'success');
        document.getElementById('form-cadastrar').reset();
    }, 300);
}

// Fluxo 3: Processar Devolução
function verificarAtraso() {
    const codigo = document.getElementById('codigo-emprestimo').value.trim();
    
    if(!codigo) {
        showToast('Por favor, digite ou escaneie um código válido.', 'error');
        return;
    }

    // Exibe a div de resultados
    const resultBox = document.getElementById('resultado-devolucao');
    resultBox.style.display = 'block';

    // Simula uma busca no banco (Tabela Emprestimos -> auth.users -> livros)
    const mockTitulos = ["Clean Code", "Design Patterns", "O Senhor dos Anéis", "1984"];
    const tituloSorteado = mockTitulos[Math.floor(Math.random() * mockTitulos.length)];
    
    // Simula aleatoriamente se está atrasado (50% de chance para demonstração)
    const isLate = Math.random() > 0.5;

    const badge = document.getElementById('devolucao-badge');
    const detalhes = document.getElementById('devolucao-detalhes');
    const acoes = document.getElementById('devolucao-acoes');

    if (isLate) {
        // HÁ MULTA PENDENTE (Sim)
        const diasAtraso = Math.floor(Math.random() * 15) + 1;
        const valorMulta = (diasAtraso * 2.50).toFixed(2).replace('.', ',');

        badge.className = 'status-badge badge-late';
        badge.innerText = '⚠️ Atrasado - Multa Pendente';
        
        detalhes.innerHTML = `
            <strong>Livro:</strong> ${tituloSorteado}<br>
            <strong>ID Empréstimo:</strong> ${codigo}<br>
            <strong>Dias de Atraso:</strong> ${diasAtraso} dias<br>
            <strong style="color: #e74c3c;">Valor da Multa: R$ ${valorMulta}</strong>
        `;

        acoes.innerHTML = `
            <button type="button" class="btn btn-danger" onclick="registrarMulta()">Registrar Multa</button>
            <button type="button" class="btn" onclick="atualizarStatusDevolucao()">Atualizar Status</button>
        `;

        showToast(`Empréstimo localizado. O exemplar está com ${diasAtraso} dias de atraso.`, 'error');

    } else {
        // NÃO HÁ MULTA (Não - No Prazo)
        badge.className = 'status-badge badge-ok';
        badge.innerText = '✅ Devolução no Prazo';

        detalhes.innerHTML = `
            <strong>Livro:</strong> ${tituloSorteado}<br>
            <strong>ID Empréstimo:</strong> ${codigo}<br>
            <span style="color: #27ae60;">O exemplar foi devolvido dentro da data limite estipulada.</span>
        `;

        acoes.innerHTML = `
            <button type="button" class="btn btn-success" onclick="liberarExemplar()">Liberar Exemplar</button>
            <button type="button" class="btn" onclick="atualizarStatusDevolucao()">Atualizar Status</button>
        `;

        showToast('Empréstimo localizado. Devolução regular.', 'success');
    }
}

// Sub-ações da Devolução
function registrarMulta() {
    showToast('Multa registrada no sistema (Tabela perfis/financeiro).', 'info');
}

function liberarExemplar() {
    showToast('Exemplar liberado fisicamente. Pronto para retornar à estante.', 'info');
}

function atualizarStatusDevolucao() {
    showToast('Status atualizado! Tabela "emprestimos" e "livros" sincronizadas.', 'success');
    
    // Limpa o formulário e oculta resultados simulando finalização do fluxo
    document.getElementById('codigo-emprestimo').value = '';
    document.getElementById('resultado-devolucao').style.display = 'none';
}

function fecharDevolucao() {
    document.getElementById('codigo-emprestimo').value = '';
    document.getElementById('resultado-devolucao').style.display = 'none';
    navigate('view-dashboard');
}