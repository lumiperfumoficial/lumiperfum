let produtos = [];
let carrinho = [];

async function carregarDados() {
    try {
        const res = await fetch(`produtos.json?t=${new Date().getTime()}`);
        produtos = await res.json();
        renderProdutos(produtos);
    } catch (e) { console.error("Erro ao carregar dados", e); }
}

function renderProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(p => {
        const oldPrice = p.precoAntigo ? `R$ ${p.precoAntigo.toFixed(2)}` : '';
        const promoTag = p.desconto ? `<div class="promo-tag">-${p.desconto}%</div>` : '';
        const benTag = p.beneficio ? `<div class="beneficio-tag">${p.beneficio}</div>` : '';
        
        container.innerHTML += `
            <div class="card">
                <div class="tag-container">
                    ${promoTag}
                    ${benTag}
                </div>
                <div class="ml-badge">${p.ml || '100ML'}</div>
                
                <div class="img-box">
                    <img src="${p.imagem}" alt="${p.nome}">
                </div>
                
                <div class="card-brand">LumiPerfum</div>
                <div class="card-title">${p.nome}</div>
                
                <div class="price-area">
                    <div class="price-box">
                        <span class="price-old">${oldPrice}</span>
                        <span class="price-new">R$ ${p.precoAtual.toFixed(2)}</span>
                    </div>
                    <button class="btn-add" onclick="addSacola('${p.nome}', ${p.precoAtual})">+</button>
                </div>
            </div>
        `;
    });
}

function filtrar(tipo) {
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tipo === tipo);
    });
    const filtrados = tipo === 'todos' ? produtos : produtos.filter(p => p.tipo === tipo);
    renderProdutos(filtrados);
}

function addSacola(nome, preco) {
    carrinho.push({ nome, preco });
    document.getElementById('cart-sidebar').classList.add('active');
    atualizarCarrinho();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    lista.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="empty-msg">Nenhum produto selecionado.</p>';
    } else {
        carrinho.forEach((item, i) => {
            lista.innerHTML += `
                <div class="cart-item">
                    <div>
                        <p style="font-weight:700; font-size:14px; margin-bottom:4px;">${item.nome}</p>
                        <p style="color:#71717a; font-weight:600;">R$ ${item.preco.toFixed(2)}</p>
                    </div>
                    <button onclick="removerItem(${i})" style="border:none; background:none; color:#e11d48; font-weight:bold; cursor:pointer; font-size:14px;">Remover</button>
                </div>`;
            total += item.preco;
        });
    }
    document.getElementById("total").innerText = `R$ ${total.toFixed(2)}`;
}

function removerItem(i) {
    carrinho.splice(i, 1);
    atualizarCarrinho();
}

function finalizarCompra() {
    if (carrinho.length === 0) return alert("Sua sacola está vazia!");
    
    const formaPgto = document.getElementById('metodo-pagamento').value;
    let total = 0;
    let msg = "🛍️ *PEDIDO LUMIPERFUM*\n\n";
    
    carrinho.forEach(item => {
        msg += `▪️ ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
        total += item.preco;
    });

    msg += `\n💰 *Total da Compra:* R$ ${total.toFixed(2)}`;
    msg += `\n💳 *Forma de Pagamento:* ${formaPgto}\n\n_Aguardando confirmação..._`;

    window.open(`https://wa.me/5599999999999?text=${encodeURIComponent(msg)}`);
}

carregarDados();
