let produtos = [];
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

fetch('produtos.json')
  .then(res => res.json())
  .then(data => {
    produtos = data;
    renderProdutos(produtos);
    atualizarCarrinho();
  });

function renderProdutos(lista) {
  const container = document.getElementById("produtos");
  container.innerHTML = lista.map(prod => `
    <div class="card">
      <div class="img-container">
        <img src="${prod.imagem}" alt="${prod.nome}">
      </div>
      <p class="tipo">${prod.tipo} • ${prod.ml}</p>
      <h3>${prod.nome}</h3>
      <p class="preco">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
      <button onclick="addCarrinho(${prod.id})">Adicionar à Sacola</button>
    </div>
  `).join('');
}

function filtrar(tipo) {
  document.querySelectorAll('.filtros button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  const filtrados = tipo === "todos" ? produtos : produtos.filter(p => p.tipo === tipo);
  renderProdutos(filtrados);
}

function addCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  carrinho.push(produto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
  openCart(); // Abre o carrinho automaticamente ao adicionar
}

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const count = document.getElementById("cart-count");
  lista.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    lista.innerHTML += `
      <div class="item-carrinho">
        <p><strong>${item.nome}</strong><br>R$ ${item.preco.toFixed(2)}</p>
        <button onclick="removerItem(${index})">✕</button>
      </div>`;
    total += item.preco;
  });

  count.innerText = carrinho.length;
  document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function toggleCart() { document.getElementById("carrinho-lateral").classList.toggle("open"); }
function openCart() { document.getElementById("carrinho-lateral").classList.add("open"); }

function finalizarCompra() {
  if(carrinho.length === 0) return alert("Sua sacola está vazia!");
  let msg = "✨ *Novo Pedido - Lumi Perfum* ✨%0A%0A";
  carrinho.forEach(i => msg += `• ${i.nome} - R$ ${i.preco.toFixed(2)}%0A`);
  let total = carrinho.reduce((s, i) => s + i.preco, 0);
  msg += `%0A*Total: R$ ${total.toFixed(2)}*%0A%0AQuero prosseguir com o pagamento!`;
  window.open(`https://wa.me{msg}`, "_blank");
}
