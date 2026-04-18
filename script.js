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
        <img src="${prod.imagem}">
        <h3>${prod.nome}</h3>
        <p>R$ ${prod.preco}</p>
        <button onclick="addCarrinho('${prod.nome}', ${prod.preco})">
          Comprar
        </button>
      </div>
    `;
  });
}

function filtrar(tipo) {
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
}

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  lista.innerHTML = "";

  let total = 0;

  carrinho.forEach(item => {
    lista.innerHTML += `<p>${item.nome} - R$ ${item.preco}</p>`;
    total += item.preco;
  });

  document.getElementById("total").innerText = `Total: R$ ${total}`;
}

function finalizarCompra() {
  let mensagem = "Pedido:%0A";

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (R$ ${item.preco})%0A`;
  });

  let total = carrinho.reduce((s, i) => s + i.preco, 0);
  mensagem += `%0ATotal: R$ ${total}`;

  const numero = "5599999999999"; // SEU WHATSAPP
  const url = `https://wa.me/${numero}?text=${mensagem}`;

  window.open(url, "_blank");
}