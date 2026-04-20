let produtos = [];
let carrinho = [];

async function carregarDados() {
    try {
        // O "?t=" impede o navegador de "viciar" no código antigo e não mostrar o perfume novo
        const res = await fetch(`produtos.json?t=${new Date().getTime()}`);
        produtos = await res.json();
        renderProdutos(produtos);
    } catch (e) { console.error(e); }
}

function renderProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(p => {
        const cor = p.tipo === 'feminino' ? 'var(--fem)' : 'var(--masc)';
        container.innerHTML += `
            <div class="card">
                <div class="ml-tag">${p.ml || '100ML'}</div>
                <div class="img-box">
                    <img src="${p.imagem}" alt="${p.nome}">
                </div>
                <h3>${p.nome}</h3>
                <span class="preco" style="color: ${cor}">R$ ${p.preco.toFixed(2)}</span>
                <button class="btn-comprar" onclick="addCarrinho('${p.nome}', ${p.preco})">Adicionar</button>
            </div>
        `;
    });
}

function filtrar(tipo) {
    document.body.className = `tema-${tipo}`;
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === tipo || (tipo === 'todos' && btn.innerText === 'Todos'));
    });
    const filtrados = tipo === 'todos' ? produtos : produtos.filter(p => p.tipo === tipo);
    renderProdutos(filtrados);
}

function addCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const totalEl = document.getElementById("total");
    lista.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, i) => {
        lista.innerHTML += `<div class="cart-item"><span>${item.nome}</span><strong>R$ ${item.preco}</strong></div>`;
        total += item.preco;
    });
    totalEl.innerText = `R$ ${total.toFixed(2)}`;
}

function finalizarCompra() {
    const msg = encodeURIComponent(`Pedido LumiPerfum:\n${carrinho.map(i => i.nome).join('\n')}\nTotal: ${document.getElementById("total").innerText}`);
    window.open(`https://wa.me/5599999999999?text=${msg}`);
}

carregarDados();
