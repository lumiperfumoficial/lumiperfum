let produtos = [];
let carrinho = [];

async function carregarDados() {
    const res = await fetch(`produtos.json?t=${new Date().getTime()}`);
    produtos = await res.json();
    renderProdutos(produtos);
}

function renderProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";
    lista.forEach(p => {
        container.innerHTML += `
            <div class="card">
                ${p.desconto ? `<div class="promo-tag">-${p.desconto}%</div>` : ''}
                <img src="${p.imagem}" alt="${p.nome}">
                <div class="beneficio-tag">${p.beneficio || 'FRETE GRÁTIS'}</div>
                <h3>LumiPerfum</h3>
                <h2>${p.nome} - ${p.ml}</h2>
                <span class="price-old">R$ ${p.precoAntigo || ''}</span>
                <span class="price-new">R$ ${p.precoAtual.toFixed(2)}</span>
                <button class="btn-add-sacola" onclick="addSacola('${p.nome}', ${p.precoAtual})">+</button>
            </div>
        `;
    });
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
                <span>${item.nome}</span>
                <strong>R$ ${item.preco.toFixed(2)}</strong>
                <button onclick="removerItem(${i})" style="border:none; background:none; color:red; cursor:pointer;">Remover</button>
            </div>`;
        total += item.preco;
    });
    document.getElementById("total").innerText = `R$ ${total.toFixed(2)}`;
    document.getElementById("cart-count").innerText = `${carrinho.length} itens`;
}

function removerItem(i) {
    carrinho.splice(i, 1);
    atualizarCarrinho();
}

function finalizarCompra() {
    if (carrinho.length === 0) return alert("Sua sacola está vazia!");
    
    const formaPagamento = document.getElementById('metodo-pagamento').value;
    let total = 0;
    let mensagem = "🛍️ *NOVO PEDIDO - LUMIPERFUM*\n\n";
    
    carrinho.forEach(item => {
        mensagem += `• ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
        total += item.preco;
    });

    mensagem += `\n💰 *Total:* R$ ${total.toFixed(2)}`;
    mensagem += `\n💳 *Forma de Pagamento:* ${formaPagamento}`;
    mensagem += `\n\n_Aguardando confirmação do vendedor..._`;

    const numero = "5599999999999"; // SEU WHATSAPP
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`);
}

carregarDados();
