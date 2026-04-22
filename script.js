let produtosData = [];
let carrinho = [];
let catFiltro = 'todos';

async function carregar() {
    try {
        const res = await fetch('produtos.json');
        produtosData = await res.json();
        render();
    } catch (e) { console.log("Aguardando produtos do painel..."); }
}

function render() {
    const grid = document.getElementById('produtos');
    const busca = document.getElementById('input-busca').value.toLowerCase();

    const lista = produtosData.filter(p => {
        const bateNome = p.nome.toLowerCase().includes(busca);
        const bateCat = catFiltro === 'todos' || (p.categoria && p.categoria.toLowerCase() === catFiltro);
        return bateNome && bateCat;
    });

    grid.innerHTML = lista.map(p => `
        <div class="card">
            <div class="tag-ml">${p.ml || '100ML'}</div>
            <img src="${p.imagem}" onerror="this.src='https://via.placeholder.com/200?text=Sem+Foto'">
            <span class="marca-txt">LUMIPERFUM</span>
            <h3>${p.nome}</h3>
            <span class="estoque-txt">Disponível</span>
            <div class="card-footer">
                <span class="preco">R$ ${p.preco}</span>
                <button class="btn-add" onclick="addCarrinho('${p.nome}', '${p.preco}')">+</button>
            </div>
        </div>
    `).join('');
}

function filtrar(cat, btn) {
    catFiltro = cat;
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
}

function buscarPerfume() { render(); }
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('active'); }

function addCarrinho(nome, preco) {
    carrinho.push({nome, preco: parseFloat(preco.replace(',','.'))});
    const lista = document.getElementById('lista-carrinho');
    let total = 0;
    
    lista.innerHTML = carrinho.map(i => {
        total += i.preco;
        return `<div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:10px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                    <span>${i.nome}</span><b>R$ ${i.preco.toFixed(2)}</b>
                </div>`;
    }).join('');
    
    document.getElementById('total').innerText = `R$ ${total.toFixed(2).replace('.',',')}`;
    document.getElementById('cart-sidebar').classList.add('active');
}

function finalizarCompra() {
    if(carrinho.length === 0) return alert("Sua sacola está vazia!");
    let texto = `🌸 *Pedido LumiPerfum*%0A%0A` + carrinho.map(i => `- ${i.nome}`).join('%0A');
    window.open(`https://wa.me/5569981009562?text=${texto}%0A%0ATotal: ${document.getElementById('total').innerText}`);
}

carregar();
