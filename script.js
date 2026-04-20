let produtos = [];
let carrinho = [];

async function carregarDados() {
    try {
        const response = await fetch('produtos.json');
        produtos = await response.json();
        renderProdutos(produtos);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function renderProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(p => {
        // Define a cor baseada no tipo para o card individual
        const corDestaque = p.tipo === 'feminino' ? 'var(--feminino)' : 'var(--masculino)';
        
        container.innerHTML += `
            <div class="card" style="border-bottom: 4px solid ${corDestaque}">
                <span class="ml-tag">${p.ml || '100ML'}</span>
                <img src="${p.imagem}" alt="${p.nome}">
                <h3>${p.nome}</h3>
                <span class="preco" style="color: ${corDestaque}">R$ ${p.preco.toFixed(2)}</span>
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
    atualizarCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const totalEl = document.getElementById("total");
    const countEl = document.getElementById("cart-count");
    
    lista.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="empty-msg">O carrinho está vazio.</p>';
    } else {
        carrinho.forEach((item, index) => {
            lista.innerHTML += `
                <div class="cart-item">
                    <span>${item.nome}</span>
                    <strong>R$ ${item.preco.toFixed(2)}</strong>
                    <button onclick="removerItem(${index})" style="color:red; background:none; border:none; cursor:pointer;">X</button>
                </div>
            `;
            total += item.preco;
        });
    }

    totalEl.innerText = `R$ ${total.toFixed(2)}`;
    countEl.innerText = `${carrinho.length} itens`;
}

function finalizarCompra() {
    if (carrinho.length === 0) return alert("Carrinho vazio!");
    const msg = encodeURIComponent(`Olá LumiPerfum! Gostaria de encomendar:\n${carrinho.map(i => `- ${i.nome}`).join('\n')}\nTotal: R$ ${document.getElementById("total").innerText}`);
    window.open(`https://wa.me/5599999999999?text=${msg}`);
}

carregarDados();
