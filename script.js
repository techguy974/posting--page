const form = document.querySelector('#post-form'); 
const tituloPost = document.querySelector('#tituloPost');
const conteudoPost = document.querySelector('#conteudoPost');
const postFeed = document.querySelector('#post-feed');
const charCount = document.querySelector('#charCount');

let posts = JSON.parse(localStorage.getItem('posts')) || [];
let apiPosts = [];
let apiPage = 0;
const apiLimit = 10; // posts por página

// Contador de caracteres do textarea
conteudoPost.addEventListener('input', () => {
  charCount.textContent = `${conteudoPost.value.length} / 200`;
});

// Função para gerar cor aleatória
function getRandomColor() {
  const colors = ["#0077b6","#023e8a","#0096c7","#00b4d8","#48cae4","#f77f00","#fb8500","#ffb703","#023047","#8ecae6"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Função para gerar emoji aleatório
function getRandomEmoji() {
  const emojis = ["😎","🌍","✈️","🏖️","🏔️","🏰","🛳️","🎒","📸","🗺️"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Cria post card
function adicionarPost(post, index) {
  const postCard = document.createElement('div');
  postCard.classList.add('post-card');

  const avatarDiv = document.createElement('div');
  avatarDiv.classList.add('avatar');
  avatarDiv.textContent = post.avatarEmoji || getRandomEmoji();
  avatarDiv.style.backgroundColor = post.avatarColor || getRandomColor();

  postCard.style.borderTop = `4px solid ${avatarDiv.style.backgroundColor}`;

  const dataFormatada = new Date(post.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  postCard.innerHTML = `
    <div class="post-card-header">
      <h2>${post.title}</h2>
    </div>
    <div class="post-meta">Postado em: ${dataFormatada}</div>
    <p>${post.body}</p>
    <div class="post-actions">
      <button class="like-btn">Curtir (${post.likes || 0})</button>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Excluir</button>
      <button class="comment-btn">Comentar</button>
    </div>
    <div class="comment-section" id="comment-${index}"></div>
    <div class="add-comment" id="add-comment-${index}" style="display:none;">
      <input type="text" placeholder="Escreva um comentário..." id="comment-input-${index}">
      <button id="comment-btn-${index}">Adicionar</button>
    </div>
  `;

  postCard.querySelector('.post-card-header').prepend(avatarDiv);

  // Botões de ação
  const likeBtn = postCard.querySelector('.like-btn');
  likeBtn.addEventListener('click', () => {
    post.likes = (post.likes || 0) + 1;
    salvarPosts();
  });

  const deleteBtn = postCard.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    if(confirm('Deseja realmente excluir este post?')) {
      posts.splice(index, 1);
      salvarPosts();
    }
  });

  const editBtn = postCard.querySelector('.edit-btn');
  editBtn.addEventListener('click', () => {
    tituloPost.value = post.title;
    conteudoPost.value = post.body;
    charCount.textContent = `${conteudoPost.value.length} / 200`;
    posts.splice(index, 1);
    salvarPosts();
  });

  const commentBtn = postCard.querySelector('.comment-btn');
  const addCommentDiv = postCard.querySelector(`#add-comment-${index}`);
  commentBtn.addEventListener('click', () => {
    addCommentDiv.style.display = addCommentDiv.style.display === 'none' ? 'flex' : 'none';
  });

  const addCommentBtn = postCard.querySelector(`#comment-btn-${index}`);
  const commentInput = postCard.querySelector(`#comment-input-${index}`);
  const commentSection = postCard.querySelector(`#comment-${index}`);

  addCommentBtn.addEventListener('click', () => {
    if(commentInput.value.trim() !== '') {
      post.comments = post.comments || [];
      post.comments.push(commentInput.value);
      commentInput.value = '';
      renderizarPosts();
      salvarPosts();
    }
  });

  if(post.comments) {
    post.comments.forEach(c => {
      const commentDiv = document.createElement('div');
      commentDiv.classList.add('comment');
      commentDiv.textContent = c;
      commentSection.appendChild(commentDiv);
    });
  }

  postFeed.append(postCard);
}

// Renderiza posts
function renderizarPosts() {
  postFeed.innerHTML = '';
  [...posts].forEach((post, index) => adicionarPost(post, index));
}

// Salva posts no localStorage
function salvarPosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
  renderizarPosts();
}

// Evento submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const novoPost = {
    title: tituloPost.value,
    body: conteudoPost.value,
    date: new Date(),
    likes: 0,
    comments: [],
    avatarColor: getRandomColor(),
    avatarEmoji: getRandomEmoji()
  };

  // Envia para a API
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      title: novoPost.title,
      body: novoPost.body,
      userId: 1
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  .then(res => res.json())
  .then(data => {
    console.log("Post enviado para a API:", data);
    posts.unshift(novoPost);
    salvarPosts();
    form.reset();
    charCount.textContent = '0 / 200';
  })
  .catch(err => console.error(err));
});

// Função para carregar próximos posts da API
let carregando = false; // controla se está carregando posts

function carregarProximosPosts() {
  if (carregando) return; // previne chamadas múltiplas simultâneas
  carregando = true;

  const start = apiPage * apiLimit;
  const end = start + apiLimit;

  const postsParaAdicionar = apiPosts.slice(start, end);
  if (postsParaAdicionar.length === 0) {
    carregando = false;
    return; // todos os posts carregados
  }

  // Opcional: mostrar mensagem de carregamento
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.textContent = 'Carregando mais posts...';
  loadingDiv.style.textAlign = 'center';
  loadingDiv.style.padding = '1rem';
  postFeed.appendChild(loadingDiv);

  setTimeout(() => { // simula atraso de carregamento
    postsParaAdicionar.forEach((post) => {
      const postFormatado = {
        title: post.title,
        body: post.body,
        date: new Date(),
        likes: 0,
        comments: [],
        avatarColor: getRandomColor(),
        avatarEmoji: getRandomEmoji()
      };
      posts.push(postFormatado);
    });

    apiPage++;
    renderizarPosts();

    // remove loading
    if (document.querySelector('#loading')) {
      document.querySelector('#loading').remove();
    }

    carregando = false;
  }, 1000); // atraso opcional de 1s
}

// Scroll infinito
window.addEventListener('scroll', () => {
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
    carregarProximosPosts();
  }
});


// Inicializa API e adiciona scroll infinito
fetch("https://jsonplaceholder.typicode.com/posts")
  .then(res => res.json())
  .then(data => {
    apiPosts = data;
    carregarProximosPosts();
  });

window.addEventListener('scroll', () => {
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    carregarProximosPosts();
  }
});
