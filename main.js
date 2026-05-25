/**
 * AURA INTIMATES — main.js
 * Organização:
 *   1. Dados dos produtos
 *   2. Estado do carrinho
 *   3. Utilitário: formatação de preço
 *   4. Renderização dos produtos
 *   5. Modal de produto (abrir / fechar / interações)
 *   6. Toast / notificação
 *   7. Header com efeito ao rolar
 *   8. Menu hamburger (mobile)
 *   9. Newsletter
 *  10. Scroll Reveal (Intersection Observer)
 *  11. Smooth scroll para âncoras
 *  12. Inicialização
 */

/* ─────────────────────────────────────────────
   1. DADOS DOS PRODUTOS
───────────────────────────────────────────── */
const products = [
  {
    id: 1,
    name: "Conjunto Renda Soirée",
    category: "Lingerie",
    badge: "Lançamento",
    price: 189.90,
    oldPrice: null,
    image: "Imgs/lingerie.jpg",

    colors: [
      { name: "Nude Rosé", hex: "#e8c8b8" },
      { name: "Preto",     hex: "#2c2826" },
      { name: "Marsala",   hex: "#8b3a3a" }
    ],
    material: "Renda francesa 78% nylon, 22% elastano. Bojo removível em espuma memoform. Lavagem à mão com sabão neutro, secar à sombra."
  },
  {
    id: 2,
    name: "Calcinha Sem Costura",
    category: "Underwear",
    badge: "Mais Vendido",
    price: 49.90,
    oldPrice: 69.90,
    image: "Imgs/calcinha-sem-costura.jpg",

    colors: [
      { name: "Off White", hex: "#faf7f4" },
      { name: "Nude",      hex: "#e8d5c4" },
      { name: "Rosa Chá",  hex: "#d4a5a5" },
      { name: "Preto",     hex: "#2c2826" }
    ],
    material: "Microfibra ultrasoft 92% poliamida, 8% elastano. Tecnologia seamless que elimina marcas sob a roupa. Lavagem à máquina em saco de proteção, água fria."
  },
  {
    id: 3,
    name: "Pijama Cetim Dulce",
    category: "Pijamas",
    badge: "Edição Especial",
    price: 259.00,
    oldPrice: null,
    image: "Imgs/pijama-cetim.jpg",

    colors: [
      { name: "Champagne",   hex: "#e8d9bc" },
      { name: "Azul Noite",  hex: "#4a5568" },
      { name: "Rosa Antigo", hex: "#c9a5a5" }
    ],
    material: "Cetim de viscose 100% natural, toque leve e fresco. Acabamento em renda no decote e punhos. Lavar à mão com delicatesse, não torcer."
  },
  {
    id: 4,
    name: "Sutiã Bralette Veludo",
    category: "Lingerie",
    badge: null,
    price: 129.90,
    oldPrice: 159.90,
    image: "Imgs/sutia-bralete.jpg",

    colors: [
      { name: "Borgonha",    hex: "#722f37" },
      { name: "Verde Sage",  hex: "#a3b899" },
      { name: "Nude",        hex: "#e8d5c4" }
    ],
    material: "Veludo 95% poliéster, 5% elastano. Alças ajustáveis em elástico macio. Sem bojo, sem aro — máximo conforto. Lavar à mão, agua morna."
  }
];


/* ─────────────────────────────────────────────
   2. ESTADO DO CARRINHO
───────────────────────────────────────────── */
let cartCount = 0;

/**
 * Atualiza o contador do carrinho no header,
 * disparando uma animação de "bump".
 * @param {number} delta - Quantidade a adicionar (padrão: 1)
 */
// Mantido por compatibilidade, mas removido do fluxo principal.
function updateCartCount(delta = 1) {
  cartCount += delta;
}



/* ─────────────────────────────────────────────
   3. UTILITÁRIO — formatação de preço (BRL)
───────────────────────────────────────────── */
function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


/* ─────────────────────────────────────────────
   4. RENDERIZAÇÃO DOS PRODUTOS
───────────────────────────────────────────── */
function renderProducts() {
  const grid = document.getElementById('products-grid');

  // Gera o HTML de cada produto e injeta no grid
  grid.innerHTML = products.map(p => `
    <article class="product-card reveal" data-id="${p.id}">
      <div class="product-img-wrap" aria-hidden="true">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>


      <div class="product-info">

        <h3 class="product-name">${p.name}</h3>
        <p class="product-cat">${p.category}</p>
        <p class="product-price">
        ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : ''}
          ${formatPrice(p.price)}
        </p>
        <button class="btn btn-rose open-modal-btn" data-id="${p.id}">Ver Detalhes</button>
      </div>
    </article>
  `).join('');


  // Delegação de eventos: um único listener no grid para todos os cards
  grid.addEventListener('click', e => {
    // "Ver Detalhes" → abre o modal
    const modalBtn = e.target.closest('.open-modal-btn');
    if (modalBtn) {
      openModal(parseInt(modalBtn.dataset.id));
      return;
    }


  });
}


/* ─────────────────────────────────────────────
   5. MODAL DE PRODUTO
───────────────────────────────────────────── */
let currentProduct = null;
let selectedSize   = null;
let selectedColor  = null;

/**
 * Abre o modal com os dados do produto selecionado.
 * @param {number} id - ID do produto no array `products`
 */
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  // Guarda referência ao produto atual e reseta seleções
  currentProduct = p;
  selectedSize   = null;
  selectedColor  = null;

  // Preenche os campos do modal
  document.getElementById('modal-img').src              = p.image;
  document.getElementById('modal-img').alt              = p.name;
  document.getElementById('modal-badge').textContent    = p.badge || '';
  document.getElementById('modal-badge').style.display  = p.badge ? 'inline' : 'none';
  document.getElementById('modal-brand').textContent    = 'Aura Intimates — ' + p.category;
  document.getElementById('modal-name').textContent     = p.name;
  document.getElementById('modal-material').textContent = p.material;

  document.getElementById('modal-price').innerHTML =
    (p.oldPrice ? `<span class="old">${formatPrice(p.oldPrice)}</span>` : '') +
    formatPrice(p.price);

  // Renderiza botões de tamanho
  const sizes = ['P', 'M', 'G', 'GG', 'XG'];
  document.getElementById('size-btns').innerHTML = sizes
    .map(s => `<button class="size-btn" data-size="${s}">${s}</button>`)
    .join('');
  document.getElementById('size-selected-label').textContent = '';

  // Renderiza swatches de cor
  document.getElementById('color-btns').innerHTML = p.colors
    .map(c =>
      `<button class="color-btn" data-color="${c.name}" style="background:${c.hex}" title="${c.name}" aria-label="${c.name}"></button>`
    ).join('');
  document.getElementById('color-selected-label').textContent = '';

  // Eventos: seleção de tamanho
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
      document.getElementById('size-selected-label').textContent = '— ' + selectedSize;
    });
  });

  // Eventos: seleção de cor
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedColor = btn.dataset.color;
      document.getElementById('color-selected-label').textContent = '— ' + selectedColor;
    });
  });

  // Abre o overlay
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Fecha o modal e restaura o scroll da página. */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Fecha ao clicar no botão "X"
document.getElementById('modal-close-btn').addEventListener('click', closeModal);

// Fecha ao clicar fora do modal (no overlay)
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// Fecha com a tecla ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// WhatsApp pedido
const WHATSAPP_ORDER_URL = 'https://wa.me/5585991067509';

document.getElementById('modal-add-cart').addEventListener('click', () => {
  if (!selectedSize)  { showToast('Por favor, selecione um tamanho ✦'); return; }
  if (!selectedColor) { showToast('Por favor, selecione uma cor ✦');    return; }

  const message = [
    'Olá! Gostaria de pedir: ' + currentProduct.name + '.',
    'Tamanho: ' + selectedSize + '.',
    'Cor: ' + selectedColor + '.',
    'Preço: ' + formatPrice(currentProduct.price) + '.'
  ].join('\n');

  const url = WHATSAPP_ORDER_URL + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank');
  showToast('Abrindo WhatsApp ✦');
  closeModal();
});



/* ─────────────────────────────────────────────
   6. TOAST / NOTIFICAÇÃO
───────────────────────────────────────────── */
let toastTimer;

/**
 * Exibe uma notificação temporária na base da tela.
 * @param {string} msg - Mensagem a exibir
 */
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}


/* ─────────────────────────────────────────────
   7. HEADER — efeito ao rolar
───────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('site-header')
    .classList.toggle('scrolled', window.scrollY > 40);
});


/* ─────────────────────────────────────────────
   8. MENU HAMBURGER (mobile)
───────────────────────────────────────────── */
const hamburgerBtn = document.getElementById('hamburger');
const mobileNavEl  = document.getElementById('mobile-nav');

hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('open');
  mobileNavEl.classList.toggle('open');
});

/** Fecha o menu mobile (chamado nos links com onclick="closeMobileMenu()"). */
function closeMobileMenu() {
  hamburgerBtn.classList.remove('open');
  mobileNavEl.classList.remove('open');
}


/* ─────────────────────────────────────────────
   9. NEWSLETTER
───────────────────────────────────────────── */
function subscribeNewsletter() {
  const emailEl = document.getElementById('newsletter-email');
  const val     = emailEl.value.trim();

  // Validação básica de e-mail
  if (!val || !val.includes('@')) {
    showToast('Por favor, insira um e-mail válido.');
    return;
  }

  // Desabilita o formulário e exibe mensagem de sucesso
  const form = document.getElementById('newsletter-form');
  form.style.opacity        = '.5';
  form.style.pointerEvents  = 'none';
  document.getElementById('newsletter-success').style.display = 'block';

  showToast('Bem-vinda à família Aura! ✦ Confira seu e-mail.');
}


/* ─────────────────────────────────────────────
   10. SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────────── */

/**
 * Observa todos os elementos com a classe `.reveal`
 * e adiciona `.visible` quando entram na viewport,
 * disparando a animação de entrada definida no CSS.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Para de observar após animar
      }
    });
  },
  { threshold: 0.12 }
);

function observeReveal() {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}


/* ─────────────────────────────────────────────
   11. SMOOTH SCROLL para âncoras
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      // Compensa a altura fixa do header (72px)
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ─────────────────────────────────────────────
   12. INICIALIZAÇÃO
───────────────────────────────────────────── */
(function init() {
  renderProducts();  // Gera os cards de produto no DOM
  observeReveal();   // Registra o observer de animação de entrada
})();
