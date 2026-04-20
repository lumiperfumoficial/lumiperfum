let produtos = [];
let carrinho = [];

fetch('produtos.json')
  .then(res => res.json())
  .then(data => {
    produtos = data;
    renderProdutos(produtos);
  });

function renderProdutos(lista) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach(prod => {
    container.innerHTML += `
      <div class="card">
        <img src="${prod.imagem}" alt="${prod.nome}">
        <h3>${prod.nome}</h3>
        <p>R$ ${prod.preco}</p>
        <button onclick="addCarrinho('${prod.nome}', ${prod.preco})">
          Adicionar ao Carrinho
        </button>
      </div>
    `;
  });
}

function filtrar(tipo) {
  // Atualiza botões ativos
  document.querySelectorAll('.filtros button').forEach(btn => {
    btn.classList.remove('active');
    if(btn.innerText.toLowerCase() === tipo) btn.classList.add('active');
  });

  if (tipo === "todos") {
    renderProdutos(produtos);
  } else {
    const filtrados = produtos.filter(p => p.tipo === tipo);
    renderProdutos(filtrados);
  }
}

function addCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  atualizarCarrinho();
  
  // Feedback visual no botão
  const btn = event.target;
  const originalText = btn.innerText;
  btn.innerText = "Adicionado! ✓";
  btn.style.backgroundColor = "#10b981";
  
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.backgroundColor = "";
  }, 1000);
}

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  lista.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, index) => {
    lista.innerHTML += `
      <div class="carrinho-item">
        <span>${item.nome}</span>
        <strong>R$ ${item.preco}</strong>
      </div>
    `;
    total += item.preco;
  });

  document.getElementById("total").innerText = `R$ ${total}`;
}

function finalizarCompra() {
  if (carrinho.length === 0) return alert("Seu carrinho está vazio!");

  let mensagem = "Olá! Gostaria de fazer o seguinte pedido:%0A%0A";

  carrinho.forEach(item => {
    mensagem += `• ${item.nome} - R$ ${item.preco}%0A`;
  });

  let total = carrinho.reduce((s, i) => s + i.preco, 0);
  mensagem += `%0A*Total: R$ ${total}*`;

  const numero = "5599999999999"; // SEU WHATSAPP
  const url = `https://wa.me/${numero}?text=${mensagem}`;

  window.open(url, "_blank");
}
