let produtos = [];
let carrinho = [];

// Carrega dados com carimbo de tempo para evitar cache do navegador
async function carregarDados() {
    try {
        const cacheBuster = `?t=${new Date().getTime()}`;
        const response = await fetch('produtos.json' + cacheBuster);
        produtos = await response.json();
        renderProdutos(produtos);
    } catch (error) {
        console.error("Erro ao sincronizar estoque:", error);
    }
}

function renderProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(p => {
        // Define a cor de destaque individual por perfume
        const color = p.tipo === 'feminino' ? 'var(--accent-fem)' : 'var(--accent-masc)';
        
        container.innerHTML += `
            <div class="card" style="border-bottom: 4px solid ${color}">
                <span class="ml-badge">${p.ml || '100ML'}</span>
                <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
                <h3>${p.nome}</h3>
                <span class="price" style="color: ${color}">R$ ${p.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                <button class="btn-add" onclick="addCarrinho('${p.nome}', ${p.preco})">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
    });
}

function filtrar(tipo) {
    document.body.className = `tema-${tipo}`;
    
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tipo === tipo);
    });

    const filtrados = tipo === 'todos' ? produtos : produtos.filter(p => p.tipo === tipo);
    renderProdutos(filtrados);
}

function addCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarInterface();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarInterface();
}

function atualizarInterface() {
    const lista = document.getElementById("lista-carrinho");
    const totalEl = document.getElementById("total");
    const countEl = document.getElementById("cart-count");
    
    lista.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="empty-msg">Nenhuma fragrância selecionada.</p>';
    } else {
        carrinho.forEach((item, index) => {
            lista.innerHTML += `
                <div class="cart-item">
                    <div>
                        <p style="font-weight:600; font-size: 14px;">${item.nome}</p>
                        <small style="color:#94a3b8">R$ ${item.preco.toFixed(2)}</small>
                    </div>
                    <button onclick="removerItem(${index})" style="color:#ef4444; background:none; border:none; cursor:pointer; font-weight:800;">×</button>
                </div>
            `;
            total += item.preco;
        });
    }

    totalEl.innerText = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    countEl.innerText = `${carrinho.length} produtos`;
}

function finalizarCompra() {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");

    const numeroLoja = "5599999999999"; // Seu WhatsApp
    let pedido = "💎 *LumiPerfum - Novo Pedido*\n\n";
    
    carrinho.forEach(i => pedido += `▪️ ${i.nome} - R$ ${i.preco.toFixed(2)}\n`);
    
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    pedido += `\n*TOTAL: R$ ${total.toFixed(2)}*`;

    window.open(`https://wa.me/${numeroLoja}?text=${encodeURIComponent(pedido)}`);
}

carregarDados();
