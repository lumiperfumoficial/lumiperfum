let produtos = [];
let carrinho = [];
let numeroWhatsapp = "";

async function carregarDados() {
    try {
        const res = await fetch(`produtos.json?t=${new Date().getTime()}`);
        produtos = await res.json();
        renderProdutos(produtos);
        
        // Puxa o arquivo criado pelo painel
        const resConfig = await fetch(`config.json?t=${new Date().getTime()}`);
        if (resConfig.ok) {
            const config = await resConfig.json();
            // Puxa a chave "whatsapp" exatamente como está no seu JSON
            numeroWhatsapp = config.whatsapp;
        }
    } catch (e) { 
        console.error("Erro técnico: O site não conseguiu ler o config.json"); 
    }
}

function renderProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(p => {
        const oldPrice = p.precoAntigo ? `R$ ${p.precoAntigo.toFixed(2)}` : '';
        const promoTag = p.desconto ? `<div class="promo-tag">-${p.desconto}%</div>` : '';
        const benTag = p.beneficio ? `<div class="beneficio-tag">${p.beneficio}</div>` : '';
        
        // ADIÇÃO: Puxa a descrição do banco de dados (se houver)
        const descHtml = p.descricao ? `<div class="card-desc">${p.descricao}</div>` : '';
        
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
                
                ${descHtml}
                
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
    // Limpa a barra de busca se o cliente resolver clicar nos filtros normais
    document.getElementById('input-busca').value = '';
    
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tipo === tipo);
    });
    const filtrados = tipo === 'todos' ? produtos : produtos.filter(p => p.tipo === tipo);
    renderProdutos(filtrados);
}

// A MÁGICA DA BUSCA EM TEMPO REAL
function buscarPerfume() {
    const termo = document.getElementById('input-busca').value.toLowerCase();
    
    // Tira a cor dos botões de categoria, já que o cliente está digitando livremente
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
    
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
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
    let msg = "*PEDIDO LUMIPERFUM*\n\n";
    
    carrinho.forEach(item => {
        // Usando um hífen (-) que é universal e não quebra
        msg += `- ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
        total += item.preco;
    });

    msg += `\n*Total da Compra:* R$ ${total.toFixed(2)}`;
    msg += `\n*Forma de Pagamento:* ${formaPgto}\n\n_Aguardando confirmação..._`;

    // Usa a variável dinâmica que veio do Painel
   if (!numeroWhatsapp) {
        alert("O número de vendas ainda não foi carregado. Aguarde um segundo e tente novamente.");
        return;
    }
    window.open(`https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(msg)}`);
}

carregarDados();
