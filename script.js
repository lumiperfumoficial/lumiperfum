let produtos = [];
let carrinho = [];

async function carregarDados() {
    try {
        const res = await fetch(`produtos.json?t=${new Date().getTime()}`);
        produtos = await res.json();
        renderProdutos(produtos);
    } catch (e) { console.error("Erro no JSON. Suba para o GitHub para testar.", e); }
}

function renderProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(p => {
        const corTema = p.tipo === 'feminino' ? 'var(--fem)' : 'var(--masc)';
        const oldPriceHtml = p.precoAntigo ? `R$ ${p.precoAntigo.toFixed(2)}` : '';
        const descHtml = p.desconto ? `<div class="promo-tag">-${p.desconto}%</div>` : '';
        const benHtml = p.beneficio ? `<div class="beneficio-tag">${p.beneficio}</div>` : '';

        container.innerHTML += `
            <div class="card" style="border-bottom: 3px solid ${corTema}">
                ${descHtml}
                <div class="img-box"><img src="${p.imagem}" alt="${p.nome}"></div>
                ${benHtml}
                <h3>LumiPerfum</h3>
                <h2>${p.nome} - ${p.ml || '100ML'}</h2>
                <span class="price-old">${oldPriceHtml}</span>
                <span class="price-new" style="color: ${corTema}">R$ ${p.precoAtual.toFixed(2)}</span>
                <button class="btn-add-sacola" onclick="addSacola('${p.nome}', ${p.precoAtual})">+</button>
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

    carrinho.forEach((item, i) => {
        lista.innerHTML += `
            <div class="cart-item">
                <div>
                    <p style="font-weight:600">${item.nome}</p>
                    <small style="color:#94a3b8">R$ ${item.preco.toFixed(2)}</small>
                </div>
                <button onclick="removerItem(${i})" style="border:none; background:none; color:#ef4444; font-weight:bold; cursor:pointer;">X</button>
            </div>`;
        total += item.preco;
    });

    document.getElementById("total").innerText = `R$ ${total.toFixed(2)}`;
}

function removerItem(i) {
    carrinho.splice(i, 1);
    atualizarCarrinho();
}

function finalizarCompra() {
    if (carrinho.length === 0) return alert("Sacola vazia!");
    const formaPgto = document.getElementById('metodo-pagamento').value;
    let total = 0;
    let msg = "💎 *PEDIDO LUMIPERFUM*\n\n";
    
    carrinho.forEach(item => {
        msg += `▪️ ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
        total += item.preco;
    });

    msg += `\n💰 *Total:* R$ ${total.toFixed(2)}`;
    msg += `\n💳 *Pagamento:* ${formaPgto}\n\n_Aguardando confirmação..._`;

    window.open(`https://wa.me/5599999999999?text=${encodeURIComponent(msg)}`);
}

carregarDados();
