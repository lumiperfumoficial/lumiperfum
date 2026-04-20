let produtos = [];
let carrinho = [];

// Carregamento inicial dos dados
async function carregarDados() {
    try {
        const response = await fetch('produtos.json');
        produtos = await response.json();
        renderProdutos(produtos);
    } catch (error) {
        console.error("Erro ao carregar perfumes:", error);
    }
}

function renderProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(p => {
        container.innerHTML += `
            <div class="card">
                <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
                <h3>${p.nome}</h3>
                <span class="price">R$ ${p.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                <button class="btn-add" onclick="addCarrinho('${p.nome}', ${p.preco})">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
    });
}

function filtrar(tipo) {
    // Altera o tema visual do body (muda as cores no CSS)
    document.body.className = `tema-${tipo}`;

    // Atualiza estado dos botões
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tipo === tipo);
    });

    // Filtra a lógica
    const filtrados = tipo === 'todos' ? produtos : produtos.filter(p => p.tipo === tipo);
    renderProdutos(filtrados);
}

function addCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarInterfaceCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
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
                    <div>
                        <p style="font-weight:600">${item.nome}</p>
                        <small>R$ ${item.preco.toFixed(2)}</small>
                    </div>
                    <button onclick="removerItem(${index})">Remover</button>
                </div>
            `;
            total += item.preco;
        });
    }

    totalEl.innerText = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    countEl.innerText = `${carrinho.length} itens`;
}

function finalizarCompra() {
    if (carrinho.length === 0) return alert("Adicione itens antes de finalizar!");

    const numeroWhats = "5599999999999"; // Substitua pelo seu número
    let texto = "🚀 *Novo Pedido - Luxury Fragrance*\n\n";
    
    carrinho.forEach(item => {
        texto += `• ${item.nome} - R$ ${item.preco}\n`;
    });
    
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    texto += `\n*Total: R$ ${total.toFixed(2)}*`;

    window.open(`https://wa.me/${numeroWhats}?text=${encodeURIComponent(texto)}`);
}

carregarDados();
