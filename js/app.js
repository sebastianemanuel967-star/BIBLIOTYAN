// ========================================================
//  BIBLIOTYAN — The Personal Knowledge Archive
//  Motor de Aplicación & Experiencia Editorial Luxury
//  Paleta: #09070D · #171020 · #21172C · #B66AFF
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // ── Estado Global ──
  const state = {
    currentFilter: 'Todos',
    searchQuery: '',
    sortBy: 'recent',
    currentBook: null,
    currentPdfPage: 1,
    totalPdfPages: 0,
    pdfDoc: null,
    requests: [],
    favorites: [],
    selectedFormat: 'pdf',
    dailyBook: null
  };

  // Cargar favoritos desde almacenamiento local
  try {
    const savedFavs = localStorage.getItem('bibliotyan_favorites');
    state.favorites = savedFavs ? JSON.parse(savedFavs) : [];
  } catch (e) {
    state.favorites = [];
  }

  // Refrescar iconos Lucide de forma segura en cualquier ciclo de render
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Fallback visual sobrio para portadas
  window.handleCoverError = function(img, title) {
    img.onerror = null;
    const initial = (title || 'B').charAt(0).toUpperCase();
    img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='420' viewBox='0 0 300 420'><rect width='100%' height='100%' fill='%23171020'/><rect x='10' y='10' width='280' height='400' fill='none' stroke='%23B66AFF' stroke-width='2' stroke-opacity='0.4'/><circle cx='150' cy='180' r='45' fill='%2321172C' stroke='%23B66AFF' stroke-width='2'/><text x='150' y='192' font-family='sans-serif' font-size='32' fill='%23B66AFF' font-weight='bold' text-anchor='middle'>" + initial + "</text><text x='150' y='260' font-family='sans-serif' font-size='14' fill='%23F2EEF5' text-anchor='middle'>BIBLIOTYAN</text><text x='150' y='285' font-family='sans-serif' font-size='11' fill='%23B66AFF' text-anchor='middle'>Edici%C3%B3n Digital</text></svg>";
  };

  // ========================================================
  // SISTEMA DE FAVORITOS (MI BIBLIOTECA)
  // ========================================================
  window.toggleFavorite = function(bookId, event) {
    if (event) event.stopPropagation();
    const id = Number(bookId);
    const index = state.favorites.indexOf(id);
    let isFav = false;

    if (index > -1) {
      state.favorites.splice(index, 1);
      showToast('Mi biblioteca', 'Libro retirado de tus favoritos.');
    } else {
      state.favorites.push(id);
      isFav = true;
      showToast('Mi biblioteca', 'Libro guardado en tus favoritos.');
    }

    try {
      localStorage.setItem('bibliotyan_favorites', JSON.stringify(state.favorites));
    } catch (e) {}

    updateFavoriteButtons();

    // Si estamos en la pestaña Mi biblioteca, re-renderizar
    if (state.currentFilter === 'Mi biblioteca') {
      renderBooks();
    }
  };

  function updateFavoriteButtons() {
    document.querySelectorAll('.card-fav-btn, .btn-mini-fav').forEach(btn => {
      const bId = Number(btn.getAttribute('data-id'));
      if (state.favorites.includes(bId)) {
        btn.classList.add('active');
        btn.setAttribute('title', 'Quitar de favoritos');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('title', 'Guardar en favoritos');
      }
    });
  }

  // ========================================================
  // SISTEMA DE ENLACES PROFUNDOS Y COMPARTIR
  // ========================================================
  function slugify(text) {
    return (text || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60);
  }

  function getBookShareUrl(book) {
    if (!book) return window.location.href;
    const base = window.location.origin + window.location.pathname;
    const slug = slugify(book.title);
    return `${base}?libro=${book.id}-${slug}`;
  }

  async function shareBook(book) {
    if (!book) return;
    const shareUrl = getBookShareUrl(book);
    const shareTitle = `${book.title} — BIBLIOTYAN`;
    const shareText = `Lee y descarga "${book.title}" de ${book.author} en BIBLIOTYAN — The Personal Knowledge Archive:`;

    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        showToast('Enlace Compartido', `Has compartido "${book.title}" con éxito.`);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    copyLinkToClipboard(shareUrl, book.title);
  }

  function copyLinkToClipboard(url, title) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('¡Enlace Copiado!', `El enlace de "${title}" está en tu portapapeles.`);
      }).catch(() => {
        legacyCopy(url, title);
      });
    } else {
      legacyCopy(url, title);
    }
  }

  function legacyCopy(url, title) {
    const input = document.createElement('input');
    input.value = url;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast('¡Enlace Copiado!', `El enlace de "${title}" se copió al portapapeles.`);
    } catch (e) {
      prompt('Copia este enlace para compartir el libro:', url);
    }
    document.body.removeChild(input);
  }

  function shareCurrentBook() {
    if (state.currentBook) {
      shareBook(state.currentBook);
    }
  }

  function shareBookDirect(bookId) {
    const book = BOOKS.find(b => b.id === bookId);
    if (book) {
      shareBook(book);
    }
  }

  function shareViaWhatsApp() {
    if (!state.currentBook) return;
    const book = state.currentBook;
    const shareUrl = getBookShareUrl(book);
    const msg = `📖 *${book.title}* — ${book.author}\n\n` +
      `Descarga gratuita en PDF de alta calidad en *BIBLIOTYAN*:\n` +
      `👉 ${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  function getCollectionShareUrl(categoryName) {
    const base = window.location.origin + window.location.pathname;
    if (categoryName === 'HARVARD LIBROS') {
      return `${base}?coleccion=harvard-libros`;
    }
    if (categoryName === 'BREVE HISTORIA') {
      return `${base}?coleccion=breve-historia`;
    }
    if (categoryName === 'PARA DUMMIES') {
      return `${base}?coleccion=dummies`;
    }
    return `${base}?coleccion=${slugify(categoryName)}`;
  }

  function copyCollectionLink(categoryName) {
    const cat = categoryName || state.currentFilter;
    const url = getCollectionShareUrl(cat);
    const label = cat === 'HARVARD LIBROS' ? 'Colección Harvard Libros' : `Colección ${cat}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('¡Enlace Copiado!', `Enlace directo de ${label} copiado al portapapeles.`);
      }).catch(() => {
        legacyCopy(url, label);
      });
      return;
    }
    legacyCopy(url, label);
  }

  function shareCollectionWhatsApp(categoryName) {
    const cat = categoryName || state.currentFilter;
    const url = getCollectionShareUrl(cat);
    let msg = '';
    if (cat === 'HARVARD LIBROS') {
      msg = `🏛️ *Colección HARVARD LIBROS en BIBLIOTYAN*\n` +
        `Accede y descarga gratis los 12 títulos de la Serie Inteligencia Emocional de Harvard Business Review Press en PDF:\n\n` +
        `• Autoconciencia\n` +
        `• Buenos Hábitos\n` +
        `• Energía y Motivación\n` +
        `• Saber Escuchar\n` +
        `• Empatía\n` +
        `• Y 7 títulos más...\n\n` +
        `👉 *Enlace directo a la colección:*\n${url}`;
    } else if (cat === 'PARA DUMMIES') {
      const dummiesCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => b.category === 'PARA DUMMIES').length : 36;
      msg = `💡 *Colección PARA DUMMIES en BIBLIOTYAN*\n` +
        `Accede y descarga gratis ${dummiesCount} guías prácticas de la icónica colección Para Dummies en PDF:\n\n` +
        `• Finanzas e Inversión\n` +
        `• Excel, Windows y Tecnología\n` +
        `• Idiomas, Música y Arte\n` +
        `• Ajedrez, Jardinería y Salud\n\n` +
        `👉 *Enlace directo a la colección:*\n${url}`;
    } else {
      msg = `📚 *Colección "${cat}" en BIBLIOTYAN*\n` +
        `Explora y descarga libros completos en PDF y EPUB de alta calidad:\n\n` +
        `👉 *Enlace directo:*\n${url}`;
    }
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  function updateCollectionUrl(categoryName) {
    try {
      const params = new URLSearchParams(window.location.search);
      params.delete('libro');
      params.delete('id');
      params.delete('book');

      if (!categoryName || categoryName === 'Todos' || categoryName === 'Más leídos' || categoryName === 'Nuevos' || categoryName === 'Recomendados') {
        params.delete('coleccion');
        params.delete('categoria');
        params.delete('cat');
      } else if (categoryName === 'HARVARD LIBROS') {
        params.set('coleccion', 'harvard-libros');
        params.delete('categoria');
        params.delete('cat');
      } else if (categoryName === 'BREVE HISTORIA') {
        params.set('coleccion', 'breve-historia');
        params.delete('categoria');
        params.delete('cat');
      } else if (categoryName === 'PARA DUMMIES') {
        params.set('coleccion', 'dummies');
        params.delete('categoria');
        params.delete('cat');
      } else {
        params.set('categoria', slugify(categoryName));
        params.delete('coleccion');
        params.delete('cat');
      }

      const qs = params.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      const pageTitle = categoryName && categoryName !== 'Todos'
        ? `${categoryName} — BIBLIOTYAN`
        : 'BIBLIOTYAN — The Personal Knowledge Archive';
      window.history.replaceState({ filter: categoryName }, pageTitle, newUrl);
    } catch (e) {}
  }

  function selectCategory(categoryName, shouldScroll = false, updateUrl = true) {
    state.currentFilter = categoryName;

    // Actualizar botones de filtro
    document.querySelectorAll('.filter-pill').forEach(btn => {
      if (btn.getAttribute('data-cat') === categoryName) {
        btn.classList.add('active');
        try {
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } catch (e) {}
      } else {
        btn.classList.remove('active');
      }
    });

    renderBooks();

    if (updateUrl) {
      updateCollectionUrl(categoryName);
    }

    if (shouldScroll) {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // ========================================================
  // EXPLORA POR CONOCIMIENTO & FILTROS ESPECIALES
  // ========================================================
  window.selectKnowledgeCategory = function(name) {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }

    if (name === 'Todos') {
      selectCategory('Todos', false, true);
      return;
    }

    const n = name.toLowerCase();
    let match = null;

    if (n.includes('filosof')) {
      match = CONFIG.categories.find(c => c.toLowerCase().includes('espiritualidad') || c.toLowerCase().includes('filosof'));
    } else if (n.includes('psicol')) {
      match = CONFIG.categories.find(c => c.toLowerCase().includes('psicolog') || c.toLowerCase().includes('mente'));
    } else if (n.includes('negocio')) {
      match = CONFIG.categories.find(c => c.toLowerCase().includes('liderazgo') || c.toLowerCase().includes('marketing'));
    } else if (n.includes('econom') || n.includes('finanz')) {
      match = CONFIG.categories.find(c => c.toLowerCase().includes('finanzas'));
    } else if (n.includes('histor')) {
      match = CONFIG.categories.find(c => c.toLowerCase().includes('breve historia') || c.toLowerCase().includes('historia'));
    } else if (n.includes('cienc')) {
      match = CONFIG.categories.find(c => c.toLowerCase().includes('tecnolog') || c.toLowerCase().includes('salud'));
    }

    if (match) {
      selectCategory(match, false, true);
    } else {
      state.currentFilter = 'Todos';
      state.searchQuery = n;
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = name;
      renderBooks();
    }
  };

  window.selectSpecialFilter = function(filterName) {
    selectCategory(filterName, true, true);
  };

  // ========================================================
  // BÚSQUEDA Y NAVEGACIÓN
  // ========================================================
  window.focusSearch = function() {
    const input = document.getElementById('searchInput');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 320);
    }
  };

  window.clearSearch = function() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    if (input) {
      input.value = '';
      state.searchQuery = '';
    }
    if (clearBtn) clearBtn.style.display = 'none';
    renderBooks();
  };

  window.openNotifications = function() {
    showToast('BIBLIOTYAN', 'Catálogo actualizado con colecciones de Harvard, Breve Historia y novedades.');
  };

  window.handleDockNav = function(tab) {
    document.querySelectorAll('.dock-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });

    if (tab === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'catalogo') {
      const cat = document.getElementById('catalog');
      if (cat) cat.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'buscar') {
      focusSearch();
    } else if (tab === 'solicitar') {
      const req = document.getElementById('pedidos');
      if (req) req.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'biblioteca') {
      state.currentFilter = 'Mi biblioteca';
      const cat = document.getElementById('catalog');
      if (cat) cat.scrollIntoView({ behavior: 'smooth' });
      renderBooks();
      if (state.favorites.length === 0) {
        showToast('Mi biblioteca', 'Aún no tienes libros guardados. Pulsa el marcador en cualquier libro para guardarlo.');
      }
    }
  };

  // ========================================================
  // GESTIÓN DE ENLACES INICIALES (DEEP LINKS)
  // ========================================================
  function handleInitialUrl() {
    const params = new URLSearchParams(window.location.search);
    const colParam = params.get('coleccion') || params.get('categoria') || params.get('collection') || params.get('cat') || params.get('filter');
    const hash = (window.location.hash || '').toLowerCase();

    let targetCat = null;
    if (colParam) {
      const cleanSlug = slugify(colParam);
      if (cleanSlug === 'harvard' || cleanSlug === 'harvard-libros' || cleanSlug.includes('harvard')) {
        targetCat = 'HARVARD LIBROS';
      } else if (cleanSlug === 'breve-historia' || cleanSlug === 'historia' || cleanSlug.includes('breve-historia')) {
        targetCat = 'BREVE HISTORIA';
      } else if (cleanSlug === 'dummies' || cleanSlug === 'para-dummies' || cleanSlug.includes('dummies')) {
        targetCat = 'PARA DUMMIES';
      } else {
        targetCat = CONFIG.categories.find(c => slugify(c) === cleanSlug || slugify(c).includes(cleanSlug) || cleanSlug.includes(slugify(c)));
      }
    } else if (hash.includes('harvard')) {
      targetCat = 'HARVARD LIBROS';
    } else if (hash.includes('dummies')) {
      targetCat = 'PARA DUMMIES';
    }

    if (targetCat) {
      selectCategory(targetCat, true, false);
      if (targetCat === 'HARVARD LIBROS') {
        showToast('Colección Harvard Activa', 'Explorando los 12 títulos de Harvard Business Review');
      } else if (targetCat === 'BREVE HISTORIA') {
        showToast('Colección Breve Historia', 'Explorando los 142 títulos de Ediciones Nowtilus');
      } else if (targetCat === 'PARA DUMMIES') {
        const dCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => b.category === 'PARA DUMMIES').length : 36;
        showToast('Colección Para Dummies', `Explorando las ${dCount} guías prácticas en PDF`);
      } else {
        showToast('Colección Seleccionada', `Mostrando títulos de "${targetCat}"`);
      }
    }

    const libroParam = params.get('libro') || params.get('id') || params.get('book');
    let targetBook = null;
    if (libroParam) {
      const idMatch = libroParam.match(/^(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1], 10);
        targetBook = BOOKS.find(b => b.id === id);
      }
      if (!targetBook) {
        const cleanQuery = slugify(libroParam);
        targetBook = BOOKS.find(b => {
          const bSlug = slugify(b.title);
          return bSlug === cleanQuery || bSlug.includes(cleanQuery);
        });
      }
    } else if (hash.startsWith('#libro-')) {
      const hashId = parseInt(hash.replace('#libro-', ''), 10);
      targetBook = BOOKS.find(b => b.id === hashId);
    }

    if (targetBook) {
      setTimeout(() => {
        openPreviewModal(targetBook, false);
        showToast('Libro Seleccionado', `Mostrando "${targetBook.title}"`);
        const catalog = document.getElementById('catalog');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }

    // Soporte para busquedas desde motores como Google SearchAction (?q=... o ?buscar=...)
    const searchParam = params.get('q') || params.get('buscar') || params.get('search');
    if (searchParam && searchParam.trim()) {
      const qVal = searchParam.trim();
      state.searchQuery = qVal;
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = qVal;
      const heroSearchInput = document.getElementById('heroSearchInput');
      if (heroSearchInput) heroSearchInput.value = qVal;
      renderBooks();
      const catalog = document.getElementById('catalog');
      if (catalog) {
        setTimeout(() => catalog.scrollIntoView({ behavior: 'smooth' }), 200);
      }
    }
  }

  // ========================================================
  // INICIALIZACIÓN
  // ========================================================
  function init() {
    setupSearchBar();
    renderFilterButtons();
    renderEditorialShelf();
    renderDailyRecommendation();
    renderBooks();
    renderSocialLinks();
    renderWhyReadSection();
    renderDailyQuote();
    renderFooter();
    initRequestsSystem();
    setupSecretAdminAccess();
    setupMobileBottomNav();
    updateStats();
    handleInitialUrl();
    refreshIcons();
  }

  // ========================================================
  // BÚSQUEDA EN TIEMPO REAL
  // ========================================================
  function setupSearchBar() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    if (!input) return;

    input.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      if (clearBtn) {
        clearBtn.style.display = state.searchQuery ? 'inline-flex' : 'none';
      }
      renderBooks();
    });
  }

  // ========================================================
  // SELECCIÓN EDITORIAL (HORIZONTAL SHELF)
  // ========================================================
  const EDITORIAL_SELECTION_IDS = [1087, 1467, 1453, 1519, 1491, 1476, 1411, 603];

  function renderEditorialShelf() {
    const shelf = document.getElementById('editorialShelf');
    if (!shelf) return;

    const curated = EDITORIAL_SELECTION_IDS.map(id => BOOKS.find(b => b.id === id)).filter(Boolean);
    if (curated.length === 0) {
      curated.push(...BOOKS.slice(0, 6));
    }

    shelf.innerHTML = '';
    curated.forEach(book => {
      const isFav = state.favorites.includes(book.id);
      const card = document.createElement('div');
      card.className = 'editorial-mini-card';
      card.innerHTML = `
        <div class="editorial-cover-wrap">
          <img src="${book.cover}" alt="${book.title}" loading="lazy" onerror="handleCoverError(this, '${(book.title || '').replace(/'/g, "\\'")}')">
        </div>
        <div class="editorial-mini-info">
          <h4 class="editorial-mini-title">${book.title}</h4>
          <p class="editorial-mini-author">${book.author}</p>
          <div class="editorial-mini-footer">
            <span class="editorial-mini-badge">${book.category}</span>
            <button type="button" class="btn-mini-fav ${isFav ? 'active' : ''}" data-id="${book.id}" onclick="event.stopPropagation(); toggleFavorite(${book.id}, event)" title="${isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}" aria-label="Favorito">
              <i data-lucide="bookmark"></i>
            </button>
          </div>
        </div>
      `;
      card.addEventListener('click', () => openPreviewModal(book));
      shelf.appendChild(card);
    });

    refreshIcons();
  }

  // ========================================================
  // RECOMENDACIÓN DEL DÍA (BANNER EDITORIAL)
  // ========================================================
  function renderDailyRecommendation() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    // Seleccionar obra seminal según el día del año
    const seminalList = BOOKS.filter(b => EDITORIAL_SELECTION_IDS.includes(b.id));
    const pool = seminalList.length > 0 ? seminalList : BOOKS;
    state.dailyBook = pool[dayOfYear % pool.length];

    const titleEl = document.getElementById('dailyRecTitle');
    const descEl = document.getElementById('dailyRecDesc');

    if (titleEl && state.dailyBook) {
      titleEl.textContent = `¿Qué deberías conocer hoy? — «${state.dailyBook.title}»`;
    }
    if (descEl && state.dailyBook) {
      descEl.textContent = `Una recomendación de ${state.dailyBook.author} para ampliar tu perspectiva e intelecto.`;
    }
  }

  window.openDailyRecommendation = function() {
    if (state.dailyBook) {
      openPreviewModal(state.dailyBook);
    } else {
      const first = BOOKS[0];
      if (first) openPreviewModal(first);
    }
  };

  // ========================================================
  // FILTROS DE GÉNERO Y COLECCIÓN (PILLS)
  // ========================================================
  function renderFilterButtons() {
    const bar = document.getElementById('filterBar');
    if (!bar) return;
    bar.innerHTML = '';

    const filterList = [
      'Todos',
      'Más leídos',
      'Nuevos',
      'Recomendados',
      'HARVARD LIBROS',
      'BREVE HISTORIA',
      'PARA DUMMIES',
      'National Geographic',
      'E-Books (EPUB)',
      'Espiritualidad & sabiduría',
      'Autoayuda & Mente',
      'Neurociencia & Mente',
      'Productividad & Hábitos',
      'Finanzas & Inversión',
      'Liderazgo & Estrategia',
      'Marketing & Ventas',
      'Crecimiento Personal',
      'Psicología & Conducta',
      'Salud & Longevidad',
      'Tecnología & Futuro',
      'Libros en Inglés'
    ];

    filterList.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-pill ${cat === state.currentFilter ? 'active' : ''}`;
      btn.setAttribute('data-cat', cat);

      let iconHtml = '';
      if (cat === 'Todos') iconHtml = '<i data-lucide="grid"></i>';
      else if (cat === 'Más leídos') iconHtml = '<i data-lucide="trending-up"></i>';
      else if (cat === 'Nuevos') iconHtml = '<i data-lucide="sparkles"></i>';
      else if (cat === 'Recomendados') iconHtml = '<i data-lucide="award"></i>';
      else if (cat === 'HARVARD LIBROS') iconHtml = '<i data-lucide="building-2"></i>';
      else if (cat === 'BREVE HISTORIA') iconHtml = '<i data-lucide="landmark"></i>';
      else if (cat === 'PARA DUMMIES') iconHtml = '<i data-lucide="lightbulb"></i>';

      btn.innerHTML = `${iconHtml} <span>${cat}</span>`;
      btn.addEventListener('click', () => {
        selectCategory(cat, false, true);
      });
      bar.appendChild(btn);
    });

    refreshIcons();
  }

  // ========================================================
  // BANNER DE COLECCIÓN COMPARTIDA EN CATÁLOGO
  // ========================================================
  function renderCollectionBanner() {
    const container = document.getElementById('collectionBannerContainer');
    if (!container) return;

    if (state.currentFilter === 'HARVARD LIBROS') {
      const count = BOOKS.filter(b => b.category === 'HARVARD LIBROS').length;
      const shareUrl = getCollectionShareUrl('HARVARD LIBROS');
      container.innerHTML = `
        <div class="collection-highlight-banner">
          <div class="harvard-collection-card">
            <div class="hbr-banner-header">
              <div class="hbr-banner-badge-group">
                <span class="hbr-banner-badge">
                  <i data-lucide="building-2"></i> Colección Oficial HBR
                </span>
                <span class="hbr-banner-count">
                  <i data-lucide="layers"></i> ${count} Volúmenes Completos
                </span>
              </div>
              <a href="${shareUrl}" class="hbr-direct-link-badge" onclick="event.preventDefault(); copyCollectionLink('HARVARD LIBROS');" title="Copiar enlace directo de la colección">
                <i data-lucide="link"></i> bibliotyan/?coleccion=harvard-libros
              </a>
            </div>

            <h3 class="hbr-banner-title">Harvard Business Review — Serie Inteligencia Emocional</h3>
            <p class="hbr-banner-desc">
              Colección editorial completa de guías maestras de Harvard Business Review Press: autoconciencia, gestión del agotamiento, rutinas diarias efectivas, comunicación y liderazgo consciente. Ediciones digitales en PDF listas para visualización y descarga libre.
            </p>

            <div class="hbr-share-box">
              <div class="hbr-link-wrapper">
                <i data-lucide="link" class="hbr-link-icon"></i>
                <input type="text" class="hbr-link-input" value="${shareUrl}" readonly onclick="this.select()">
              </div>
              <div class="hbr-share-actions">
                <button type="button" class="btn-hbr-copy" onclick="copyCollectionLink('HARVARD LIBROS')">
                  <i data-lucide="copy"></i> Copiar Enlace
                </button>
                <button type="button" class="btn-hbr-wa" onclick="shareCollectionWhatsApp('HARVARD LIBROS')">
                  <i class="fa-brands fa-whatsapp"></i> Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      refreshIcons();
    } else if (state.currentFilter === 'BREVE HISTORIA') {
      const count = BOOKS.filter(b => b.category === 'BREVE HISTORIA').length;
      const shareUrl = getCollectionShareUrl('BREVE HISTORIA');
      container.innerHTML = `
        <div class="collection-highlight-banner">
          <div class="harvard-collection-card">
            <div class="hbr-banner-header">
              <div class="hbr-banner-badge-group">
                <span class="hbr-banner-badge" style="background: rgba(182, 106, 255, 0.22); color: #B66AFF;">
                  <i data-lucide="landmark"></i> Colección Breve Historia
                </span>
                <span class="hbr-banner-count">
                  <i data-lucide="layers"></i> ${count} Títulos Nowtilus
                </span>
              </div>
              <a href="${shareUrl}" class="hbr-direct-link-badge" onclick="event.preventDefault(); copyCollectionLink('BREVE HISTORIA');" title="Copiar enlace directo de la colección">
                <i data-lucide="link"></i> bibliotyan/?coleccion=breve-historia
              </a>
            </div>

            <h3 class="hbr-banner-title">Colección Breve Historia — Ediciones Nowtilus</h3>
            <p class="hbr-banner-desc">
              Archivo enciclopédico de historia universal: civilizaciones clásicas, conflictos bélicos, biografías de emperadores, filosofía, religión y mitología. Libros completos en PDF optimizados para lectura libre.
            </p>

            <div class="hbr-share-box">
              <div class="hbr-link-wrapper">
                <i data-lucide="link" class="hbr-link-icon"></i>
                <input type="text" class="hbr-link-input" value="${shareUrl}" readonly onclick="this.select()">
              </div>
              <div class="hbr-share-actions">
                <button type="button" class="btn-hbr-copy" onclick="copyCollectionLink('BREVE HISTORIA')">
                  <i data-lucide="copy"></i> Copiar Enlace
                </button>
                <button type="button" class="btn-hbr-wa" onclick="shareCollectionWhatsApp('BREVE HISTORIA')">
                  <i class="fa-brands fa-whatsapp"></i> Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      refreshIcons();
    } else if (state.currentFilter === 'PARA DUMMIES') {
      const count = BOOKS.filter(b => b.category === 'PARA DUMMIES').length;
      const shareUrl = getCollectionShareUrl('PARA DUMMIES');
      container.innerHTML = `
        <div class="collection-highlight-banner">
          <div class="harvard-collection-card" style="border-color: rgba(234, 179, 8, 0.35);">
            <div class="hbr-banner-header">
              <div class="hbr-banner-badge-group">
                <span class="hbr-banner-badge" style="background: rgba(234, 179, 8, 0.22); color: #FACC15; border: 1px solid rgba(234, 179, 8, 0.4);">
                  <i data-lucide="lightbulb"></i> Colección Para Dummies
                </span>
                <span class="hbr-banner-count" style="color: #FACC15;">
                  <i data-lucide="layers"></i> ${count} Guías Prácticas
                </span>
              </div>
              <a href="${shareUrl}" class="hbr-direct-link-badge" onclick="event.preventDefault(); copyCollectionLink('PARA DUMMIES');" title="Copiar enlace directo de la colección">
                <i data-lucide="link"></i> bibliotyan/?coleccion=dummies
              </a>
            </div>

            <h3 class="hbr-banner-title">Colección Para Dummies &mdash; Guías Claras, Prácticas y Accesibles</h3>
            <p class="hbr-banner-desc">
              La célebre colección editorial creada para explicar cualquier tema de manera clara, amena y directa: finanzas, inversiones, idiomas, música, tecnología, ciencias y habilidades prácticas en PDF libres.
            </p>

            <div class="hbr-share-box">
              <div class="hbr-link-wrapper">
                <i data-lucide="link" class="hbr-link-icon"></i>
                <input type="text" class="hbr-link-input" value="${shareUrl}" readonly onclick="this.select()">
              </div>
              <div class="hbr-share-actions">
                <button type="button" class="btn-hbr-copy" onclick="copyCollectionLink('PARA DUMMIES')">
                  <i data-lucide="copy"></i> Copiar Enlace
                </button>
                <button type="button" class="btn-hbr-wa" onclick="shareCollectionWhatsApp('PARA DUMMIES')">
                  <i class="fa-brands fa-whatsapp"></i> Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      refreshIcons();
    } else {
      container.innerHTML = '';
    }
  }

  // ========================================================
  // RENDERIZADO DEL CATÁLOGO (GRID 2 COLUMNAS EN MÓVIL)
  // ========================================================
  function renderBooks() {
    const grid = document.getElementById('booksGrid');
    const countEl = document.getElementById('resultsCount');
    if (!grid) return;

    renderCollectionBanner();

    let filtered = BOOKS.filter(book => {
      // 1. Filtrado especial o de categoría
      let matchesCategory = false;

      if (state.currentFilter === 'Todos') {
        matchesCategory = true;
      } else if (state.currentFilter === 'Más leídos') {
        matchesCategory = true; // Se ordenará por descargas
      } else if (state.currentFilter === 'Nuevos') {
        matchesCategory = true; // Se ordenará por ID reciente
      } else if (state.currentFilter === 'Recomendados') {
        matchesCategory = EDITORIAL_SELECTION_IDS.includes(book.id) || (book.downloads >= 400);
      } else if (state.currentFilter === 'Mi biblioteca') {
        matchesCategory = state.favorites.includes(book.id);
      } else if (state.currentFilter === 'National Geographic') {
        matchesCategory = (book.collection === 'National Geographic' || book.category === 'National Geographic');
      } else if (state.currentFilter === 'E-Books (EPUB)') {
        matchesCategory = (book.format === 'epub' || book.format === 'dual' || !!book.epub);
      } else {
        matchesCategory = book.category === state.currentFilter;
      }

      // 2. Filtrado de búsqueda en tiempo real
      const q = state.searchQuery;
      const matchesSearch = !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q) ||
        (book.collection && book.collection.toLowerCase().includes(q)) ||
        book.description.toLowerCase().includes(q) ||
        (book.aiAnalysis && book.aiAnalysis.keyConcepts && book.aiAnalysis.keyConcepts.some(k => k.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });

    // Ordenamiento
    const sortSelect = document.getElementById('sortSelect');
    let sortBy = sortSelect ? sortSelect.value : state.sortBy;

    if (state.currentFilter === 'Más leídos') {
      sortBy = 'popular';
    } else if (state.currentFilter === 'Nuevos') {
      sortBy = 'recent';
    }

    if (state.currentFilter === 'Recomendados') {
      filtered.sort((a, b) => {
        const idxA = EDITORIAL_SELECTION_IDS.indexOf(a.id);
        const idxB = EDITORIAL_SELECTION_IDS.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return b.downloads - a.downloads;
      });
    } else {
      switch (sortBy) {
        case 'popular':
          filtered.sort((a, b) => b.downloads - a.downloads);
          break;
        case 'alpha':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'recent':
        default:
          filtered.sort((a, b) => b.id - a.id);
      }
    }

    if (countEl) {
      const filterLabel = state.currentFilter === 'Todos' ? 'el archivo general' : state.currentFilter;
      countEl.textContent = `${filtered.length} título${filtered.length !== 1 ? 's' : ''} en ${filterLabel}`;
    }

    grid.innerHTML = '';

    if (filtered.length === 0) {
      if (state.currentFilter === 'Mi biblioteca') {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted)">
            <i data-lucide="bookmark" style="width: 48px; height: 48px; color: var(--purple-primary); margin: 0 auto 1.2rem; display: block;"></i>
            <h3 style="color: var(--text-main); margin-bottom: 0.5rem; font-size: 1.35rem">Tu biblioteca está vacía</h3>
            <p style="max-width: 460px; margin: 0 auto 1.5rem; line-height: 1.55; color: var(--text-secondary);">
              Aún no has guardado ningún libro. Explora el catálogo y pulsa el icono de marcador en tus títulos favoritos para verlos aquí reunidos.
            </p>
            <button type="button" class="btn-hero-explore" onclick="selectCategory('Todos', false, true)">
              Explorar Catálogo Completo
            </button>
          </div>
        `;
      } else {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 4.5rem 1rem; color: var(--text-muted)">
            <i data-lucide="book-open" style="width: 48px; height: 48px; color: var(--purple-primary); margin: 0 auto 1.2rem; display: block;"></i>
            <h3 style="color: var(--text-main); margin-bottom: 0.5rem; font-size: 1.35rem">No se encontraron libros</h3>
            <p style="max-width: 480px; margin: 0 auto; line-height: 1.55; color: var(--text-secondary);">
              Si el título que buscas no figura en nuestro archivo, puedes pedirlo en la sección de
              <a href="#pedidos" style="color: var(--purple-light); font-weight: 500; text-decoration: underline;">Solicitudes Express</a> y lo entregaremos en máximo 10 horas.
            </p>
          </div>
        `;
      }
      refreshIcons();
      return;
    }

    filtered.forEach((book) => {
      const card = document.createElement('div');
      card.className = 'book-card';

      const isFav = state.favorites.includes(book.id);
      let formatIcon = 'file-text';
      let formatText = 'PDF';

      if (book.format === 'dual' || (book.pdf && book.epub)) {
        formatIcon = 'layers';
        formatText = 'PDF + EPUB';
      } else if (book.format === 'epub' || (!book.pdf && book.epub)) {
        formatIcon = 'book';
        formatText = 'EPUB';
      }

      card.innerHTML = `
        <div class="card-cover-container">
          <span class="card-floating-badge">
            <i data-lucide="${formatIcon}"></i> ${formatText}
          </span>
          <img src="${book.cover}" alt="${book.title}" loading="lazy" onerror="handleCoverError(this, '${(book.title || '').replace(/'/g, "\\'")}')">
        </div>
        <div class="card-details">
          <h3 class="card-title" title="${book.title}">${book.title}</h3>
          <p class="card-author">${book.author}</p>
          <div class="card-meta-row">
            <span class="card-category-pill" onclick="event.stopPropagation(); selectCategory('${book.category}', true, true);" title="Filtrar colección ${book.category}">${book.category}</span>
            <button type="button" class="card-fav-btn ${isFav ? 'active' : ''}" data-id="${book.id}" onclick="event.stopPropagation(); toggleFavorite(${book.id}, event)" title="${isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}" aria-label="Guardar en favoritos">
              <i data-lucide="bookmark"></i>
            </button>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openPreviewModal(book));
      grid.appendChild(card);
    });

    refreshIcons();
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.addEventListener('change', () => renderBooks());

  // ========================================================
  // MODAL VISTA PREVIA Y DIAGNÓSTICO IA
  // ========================================================
  function openPreviewModal(book, updateUrl = true) {
    if (!book) return;
    state.currentBook = book;

    if (updateUrl) {
      try {
        const shareUrl = getBookShareUrl(book);
        window.history.replaceState({ bookId: book.id }, book.title, shareUrl);
      } catch (e) {}
    }

    const modal = document.getElementById('previewModal');
    const catColor = CONFIG.categoryColors[book.category] || '#B66AFF';
    const analysis = book.aiAnalysis || AIClassifier.analyze(book);

    document.getElementById('previewCover').innerHTML = `
      <img src="${book.cover}" alt="${book.title}" onerror="handleCoverError(this, '${(book.title || '').replace(/'/g, "\\'")}')">
    `;

    const catEl = document.getElementById('previewCategory');
    if (catEl) {
      catEl.textContent = book.category;
      catEl.style.background = 'rgba(182, 106, 255, 0.12)';
      catEl.style.color = 'var(--purple-light)';
      catEl.style.borderColor = 'var(--purple-border)';
      catEl.style.cursor = 'pointer';
      catEl.title = `Ver toda la colección de ${book.category}`;
      catEl.onclick = () => {
        closePreviewModal();
        selectCategory(book.category, true, true);
      };
    }

    const colLinkEl = document.getElementById('previewCollectionLink');
    if (colLinkEl) {
      if (book.category === 'HARVARD LIBROS') {
        colLinkEl.style.display = 'inline-flex';
        colLinkEl.innerHTML = '<i class="fa-solid fa-layer-group"></i> Colección Harvard Libros';
        colLinkEl.onclick = (e) => {
          e.preventDefault();
          closePreviewModal();
          selectCategory('HARVARD LIBROS', true, true);
        };
      } else if (book.category === 'BREVE HISTORIA') {
        colLinkEl.style.display = 'inline-flex';
        colLinkEl.innerHTML = '<i class="fa-solid fa-landmark"></i> Colección Breve Historia (142 Libros)';
        colLinkEl.onclick = (e) => {
          e.preventDefault();
          closePreviewModal();
          selectCategory('BREVE HISTORIA', true, true);
        };
      } else if (book.category === 'PARA DUMMIES') {
        const dCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => b.category === 'PARA DUMMIES').length : 36;
        colLinkEl.style.display = 'inline-flex';
        colLinkEl.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Colección Para Dummies (${dCount} Libros)`;
        colLinkEl.onclick = (e) => {
          e.preventDefault();
          closePreviewModal();
          selectCategory('PARA DUMMIES', true, true);
        };
      } else {
        colLinkEl.style.display = 'none';
      }
    }

    // Badge de formato en el modal
    const formatBadgeEl = document.getElementById('previewFormatBadge');
    if (formatBadgeEl) {
      if (book.format === 'dual' || (book.pdf && book.epub)) {
        formatBadgeEl.className = 'format-badge dual-badge';
        formatBadgeEl.innerHTML = '<i class="fa-solid fa-layer-group"></i> PDF + EPUB';
        formatBadgeEl.style.display = 'inline-flex';
      } else if (book.format === 'epub' || (!book.pdf && book.epub)) {
        formatBadgeEl.className = 'format-badge epub-badge';
        formatBadgeEl.innerHTML = '<i class="fa-solid fa-book-open-reader"></i> EPUB E-Book';
        formatBadgeEl.style.display = 'inline-flex';
      } else {
        formatBadgeEl.className = 'format-badge';
        formatBadgeEl.innerHTML = '<i class="fa-solid fa-file-pdf"></i> PDF';
        formatBadgeEl.style.display = 'inline-flex';
      }
    }

    document.getElementById('previewTitle').textContent = book.title;
    document.getElementById('previewAuthor').textContent = book.author;
    document.getElementById('previewDescription').textContent = book.description;

    // Diagnóstico inteligente
    const aiTagsEl = document.getElementById('previewAiTags');
    const aiTargetEl = document.getElementById('previewAiTarget');
    if (aiTagsEl) {
      const concepts = analysis.keyConcepts || ["Lectura", "Conocimiento", "Desarrollo"];
      aiTagsEl.innerHTML = concepts.map(c => `<span class="ai-tag-item"># ${c}</span>`).join('');
    }
    if (aiTargetEl) {
      aiTargetEl.textContent = analysis.targetAudience || 'Lectores que valoran el pensamiento crítico y el desarrollo cognitivo.';
    }

    // Aviso de Apoyo al Creador (Exclusivo para libros de Harvard)
    const harvardNoticeEl = document.getElementById('harvardCreatorNotice');
    if (harvardNoticeEl) {
      if (book.category === 'HARVARD LIBROS') {
        harvardNoticeEl.style.display = 'flex';
      } else {
        harvardNoticeEl.style.display = 'none';
      }
    }

    // Acciones Directas: Leer Online & Descargar
    const dlContainer = document.getElementById('previewDownloadContainer');
    if (dlContainer) {
      if (book.format === 'dual' || (book.pdf && book.epub)) {
        dlContainer.innerHTML = `
          <div class="modal-direct-actions">
            <button class="btn-direct-read" onclick="openFullscreenReader()">
              <i class="fa-solid fa-book-open"></i> Leer en Pantalla
            </button>
            <button class="btn-direct-download" onclick="openSocialModal('pdf')">
              <i class="fa-solid fa-file-pdf"></i> Descargar PDF
            </button>
            <button class="btn-direct-download btn-direct-epub" onclick="openSocialModal('epub')">
              <i class="fa-solid fa-book-open-reader"></i> Descargar EPUB
            </button>
          </div>
        `;
      } else if (book.format === 'epub' || (!book.pdf && book.epub)) {
        dlContainer.innerHTML = `
          <div class="modal-direct-actions">
            <button class="btn-direct-download btn-direct-epub" onclick="openSocialModal('epub')">
              <i class="fa-solid fa-book-open-reader"></i> Descargar Ejemplar Completo (EPUB)
            </button>
          </div>
        `;
      } else {
        dlContainer.innerHTML = `
          <div class="modal-direct-actions">
            <button class="btn-direct-read" onclick="openFullscreenReader()">
              <i class="fa-solid fa-book-open"></i> Leer en Pantalla
            </button>
            <button class="btn-direct-download" onclick="openSocialModal('pdf')">
              <i class="fa-solid fa-download"></i> Descargar Ejemplar Completo (PDF)
            </button>
          </div>
        `;
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    try {
      updateCollectionUrl(state.currentFilter);
    } catch (e) {}
  }

  // ========================================================
  // LECTOR EN PANTALLA COMPLETA
  // ========================================================
  function openFullscreenReader(book) {
    const target = book || state.currentBook;
    if (!target) return;
    state.currentBook = target;

    // En móvil o enlaces directos, abrir en pestaña limpia
    if (target.pdf && (target.pdf.startsWith('http') || window.innerWidth <= 768)) {
      window.open(target.pdf, '_blank');
      return;
    }

    const modal = document.getElementById('readerModal');
    const titleEl = document.getElementById('readerTitle');
    const authorEl = document.getElementById('readerAuthor');
    const frame = document.getElementById('fullscreenPdfFrame');

    if (titleEl) titleEl.textContent = target.title;
    if (authorEl) authorEl.textContent = target.author ? `— ${target.author}` : '';

    if (frame && target.pdf) {
      frame.src = target.pdf;
    }

    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeFullscreenReader() {
    const modal = document.getElementById('readerModal');
    if (modal) modal.classList.remove('active');
    const frame = document.getElementById('fullscreenPdfFrame');
    if (frame) frame.src = '';
    document.body.style.overflow = '';
  }

  function downloadFromReader() {
    openSocialModal(state.currentBook && state.currentBook.pdf ? 'pdf' : 'epub');
  }

  // ========================================================
  // MODAL DE DESCARGA / COMUNIDAD
  // ========================================================
  function openSocialModal(format) {
    closePreviewModal();
    closeFullscreenReader();

    state.selectedFormat = format || (state.currentBook && state.currentBook.epub && !state.currentBook.pdf ? 'epub' : 'pdf');

    const modal = document.getElementById('socialModal');
    const container = document.getElementById('socialButtonsContainer');

    const iconEl = document.getElementById('socialModalIcon');
    const titleEl = document.getElementById('socialModalTitle');
    const msgEl = document.getElementById('socialModalMsg');

    const isHarvard = state.currentBook && state.currentBook.category === 'HARVARD LIBROS';

    if (iconEl && titleEl && msgEl) {
      if (isHarvard) {
        iconEl.className = 'fa-solid fa-building-columns';
        titleEl.textContent = 'Apoya al Creador • Colección Harvard';
        msgEl.innerHTML = 'Para mantener activa y disponible esta colección de Harvard, <strong>apoya al creador</strong>. Gracias a su esfuerzo y dedicación tenemos estos ejemplares completos para ti. Únete y apóyalo en sus canales comunitarios:';
      } else {
        iconEl.className = 'fa-solid fa-shield-heart';
        titleEl.textContent = 'Descarga Libre y Gratuita';
        msgEl.innerHTML = 'En <strong>BIBLIOTYAN</strong> no cobramos dinero. Nuestra iniciativa busca democratizar el acceso al conocimiento. Si valoras nuestro trabajo, apóyanos siguiendo nuestras redes comunitarias:';
      }
    }
    container.innerHTML = '';

    const socialMeta = {
      telegram: {
        subtitle: 'Canal oficial · Libros diarios & avisos',
        badge: 'Unirse',
        badgeColor: '#229ED9',
        iconBg: 'linear-gradient(135deg, #229ED9 0%, #1778a6 100%)'
      },
      instagram: {
        subtitle: 'Comunidad · Novedades & lecturas',
        badge: 'Seguir',
        badgeColor: '#E4405F',
        iconBg: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)'
      },
      facebook: {
        subtitle: 'Página oficial · Reseñas & videos',
        badge: 'Seguir',
        badgeColor: '#1877F2',
        iconBg: 'linear-gradient(135deg, #1877F2 0%, #0d5bb5 100%)'
      }
    };

    Object.entries(CONFIG.socialMedia).forEach(([key, social]) => {
      if (!social.active) return;
      const meta = socialMeta[key] || {
        subtitle: 'Comunidad oficial',
        badge: 'Seguir',
        badgeColor: '#B66AFF',
        iconBg: 'linear-gradient(135deg, #B66AFF 0%, #8e3ee8 100%)'
      };

      const a = document.createElement('a');
      a.href = social.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = `social-follow-card ${key}`;
      a.innerHTML = `
        <div class="social-card-icon-box" style="background: ${meta.iconBg}">
          <i class="${social.icon}"></i>
        </div>
        <div class="social-card-info">
          <span class="social-card-title">${social.label}</span>
          <span class="social-card-sub">${meta.subtitle}</span>
        </div>
        <div class="social-card-action">
          <span class="social-card-pill" style="border-color: ${meta.badgeColor}55; color: ${meta.badgeColor};">
            ${meta.badge} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem; margin-left: 2px;"></i>
          </span>
        </div>
      `;
      container.appendChild(a);
    });

    const actionContainer = document.getElementById('socialActionButtonsContainer');
    if (actionContainer && state.currentBook) {
      const book = state.currentBook;
      const hasBoth = (book.format === 'dual' || (book.pdf && book.epub));

      if (hasBoth && !format) {
        actionContainer.innerHTML = `
          <button class="btn-confirmed-download" onclick="downloadCurrentBook('pdf')">
            <i class="fa-solid fa-file-pdf"></i> ¡Ya los sigo! Descargar en PDF
          </button>
          <button class="btn-confirmed-download" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-color: #10b981; margin-top: 0.5rem;" onclick="downloadCurrentBook('epub')">
            <i class="fa-solid fa-book-open-reader"></i> ¡Ya los sigo! Descargar en EPUB
          </button>
          <button class="btn-skip-download" onclick="downloadCurrentBook('pdf')" style="margin-top: 0.6rem;">
            Descargar sin seguir (PDF)
          </button>
        `;
      } else if (state.selectedFormat === 'epub') {
        actionContainer.innerHTML = `
          <button class="btn-confirmed-download" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-color: #10b981;" onclick="downloadCurrentBook('epub')">
            <i class="fa-solid fa-book-open-reader"></i> ¡Ya los sigo! Descargar EPUB
          </button>
          <button class="btn-skip-download" onclick="downloadCurrentBook('epub')" style="margin-top: 0.6rem;">
            Descargar sin seguir
          </button>
        `;
      } else {
        actionContainer.innerHTML = `
          <button class="btn-confirmed-download" onclick="downloadCurrentBook('pdf')">
            <i class="fa-solid fa-file-pdf"></i> ¡Ya los sigo! Descargar PDF
          </button>
          <button class="btn-skip-download" onclick="downloadCurrentBook('pdf')" style="margin-top: 0.6rem;">
            Descargar sin seguir
          </button>
        `;
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSocialModal() {
    const modal = document.getElementById('socialModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function downloadCurrentBook(format) {
    if (!state.currentBook) return;
    closeSocialModal();

    const book = state.currentBook;
    const chosenFormat = format || state.selectedFormat || (book.epub && !book.pdf ? 'epub' : 'pdf');

    let filePath = book.pdf;
    let ext = 'pdf';

    if (chosenFormat === 'epub' && book.epub) {
      filePath = book.epub;
      ext = 'epub';
    } else if (!book.pdf && book.epub) {
      filePath = book.epub;
      ext = 'epub';
    }

    book.downloads++;
    renderBooks();
    updateStats();

    if (filePath) {
      const link = document.createElement('a');
      link.href = filePath;
      if (filePath.startsWith('http')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      link.download = `${book.title} - ${book.author}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Descarga Iniciada', `Disfruta la lectura de "${book.title}" (${ext.toUpperCase()}).`);
    } else {
      showToast('Solicitud en Proceso', `El archivo está preparándose. Puedes solicitarlo por nuestro canal de Telegram.`);
    }
  }

  // ========================================================
  // MODAL QR DE SOLICITUD (10 HORAS)
  // ========================================================
  function openQrModal(ticketId, bookTitle) {
    const modal = document.getElementById('qrModal');
    if (!modal) return;

    const titleEl = document.getElementById('qrTicketId');
    const bookEl = document.getElementById('qrBookTitle');
    const qrImg = document.getElementById('qrCodeImage');

    if (titleEl) titleEl.textContent = `Ticket #${ticketId}`;
    if (bookEl) bookEl.textContent = `«${bookTitle}»`;

    const encodedUrl = encodeURIComponent(CONFIG.communityInviteUrl || "https://t.me/bibliotyan");
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedUrl}&bgcolor=ffffff&color=09060f&margin=1`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQrModal() {
    const modal = document.getElementById('qrModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ========================================================
  // SISTEMA DE PETICIONES (ENTREGA EN 10 HORAS)
  // ========================================================
  function initRequestsSystem() {
    const saved = localStorage.getItem('bibliotyan_requests');
    if (saved) {
      try {
        state.requests = JSON.parse(saved);
      } catch (e) {
        state.requests = INITIAL_REQUESTS;
      }
    } else {
      state.requests = INITIAL_REQUESTS;
      localStorage.setItem('bibliotyan_requests', JSON.stringify(state.requests));
    }

    renderRequestsList();
    setInterval(updateTimers, 1000);

    const form = document.getElementById('bookRequestForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitNewRequest();
      });
    }
  }

  function submitNewRequest() {
    const titleInput = document.getElementById('reqTitle');
    const authorInput = document.getElementById('reqAuthor');
    const contactInput = document.getElementById('reqContact');
    const noteInput = document.getElementById('reqNotes');

    const title = titleInput.value.trim();
    const author = authorInput.value.trim() || 'Autor no especificado';
    const contact = contactInput.value.trim() || 'Anónimo';

    if (!title) return;

    const now = Date.now();
    const readyAt = now + (CONFIG.deliveryHours * 3600 * 1000);
    const ticketId = 'REQ-' + Math.floor(1000 + Math.random() * 9000);

    const newRequest = {
      id: ticketId,
      bookTitle: title,
      author: author,
      requester: contact,
      contact: contact,
      requestedAt: now,
      readyAt: readyAt,
      status: "processing",
      downloadUrl: null
    };

    state.requests.unshift(newRequest);
    localStorage.setItem('bibliotyan_requests', JSON.stringify(state.requests));

    titleInput.value = '';
    authorInput.value = '';
    contactInput.value = '';
    if (noteInput) noteInput.value = '';

    renderRequestsList();
    openQrModal(ticketId, title);
    showToast('Solicitud Registrada', `Ticket #${ticketId}. Entrega estimada en 10 horas.`);
  }

  function renderRequestsList() {
    const container = document.getElementById('requestItemsList');
    const counterEl = document.getElementById('activeRequestsCounter');
    if (!container) return;

    if (counterEl) {
      counterEl.textContent = `${state.requests.length} pedidos activos`;
    }

    container.innerHTML = '';

    state.requests.forEach(req => {
      const now = Date.now();
      const isReady = req.status === 'ready' || now >= req.readyAt;

      const item = document.createElement('div');
      item.className = `request-item ${isReady ? 'ready' : ''}`;
      item.id = `req-${req.id}`;

      item.innerHTML = `
        <div class="request-item-top">
          <span class="request-ticket-id">#${req.id}</span>
          <span class="request-status-badge ${isReady ? 'ready' : 'processing'}">
            ${isReady
              ? '<i class="fa-solid fa-circle-check"></i> Disponible para descarga'
              : '<i class="fa-solid fa-clock"></i> En preparación (10h)'}
          </span>
        </div>
        <h4 class="request-book-title">${req.bookTitle}</h4>
        <p class="request-book-author"><i class="fa-solid fa-pen-nib"></i> ${req.author} · Solicitado por: <strong>${req.requester}</strong></p>

        <div class="countdown-box">
          <div class="countdown-labels">
            <span>${isReady ? 'Entrega completada' : 'Tiempo restante:'}</span>
            <span class="countdown-timer-value" data-ready="${req.readyAt}">
              ${formatTimeRemaining(req.readyAt)}
            </span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${calculateProgress(req.requestedAt, req.readyAt)}%"></div>
          </div>
        </div>

        ${isReady ? `
          <button class="btn-download-delivered" onclick="deliveredDownload('${req.bookTitle}')">
            <i class="fa-solid fa-download"></i> Descargar Ejemplar Solicitado
          </button>
        ` : ''}
      `;

      container.appendChild(item);
    });
  }

  function formatTimeRemaining(readyAt) {
    const now = Date.now();
    const diff = readyAt - now;

    if (diff <= 0) return "00h 00m 00s (Disponible)";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  }

  function calculateProgress(requestedAt, readyAt) {
    const now = Date.now();
    const total = readyAt - requestedAt;
    const elapsed = now - requestedAt;
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return pct.toFixed(1);
  }

  function updateTimers() {
    const timerEls = document.querySelectorAll('.countdown-timer-value');
    timerEls.forEach(el => {
      const readyAt = parseInt(el.getAttribute('data-ready'), 10);
      if (readyAt) {
        el.textContent = formatTimeRemaining(readyAt);
      }
    });
  }

  window.deliveredDownload = function(title) {
    showToast('Libro Entregado', `Abriendo ejemplar de "${title}" en BIBLIOTYAN.`);
  };

  // ========================================================
  // ACCESO ADMIN OCULTO (Ctrl + Shift + A o Triple Click)
  // ========================================================
  function setupSecretAdminAccess() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = 'admin.html';
      }
    });

    const trigger = document.getElementById('secretAdminTrigger');
    if (trigger) {
      let clickCount = 0;
      let clickTimer = null;
      trigger.addEventListener('click', () => {
        clickCount++;
        clearTimeout(clickTimer);
        if (clickCount >= 3) {
          window.location.href = 'admin.html';
          clickCount = 0;
        } else {
          clickTimer = setTimeout(() => { clickCount = 0; }, 800);
        }
      });
    }
  }

  // ========================================================
  // NOTIFICACIÓN TOAST
  // ========================================================
  function showToast(title, message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastTitle = toast.querySelector('.toast-text strong');
    const toastMsg = toast.querySelector('.toast-text span');
    if (toastTitle) toastTitle.textContent = title;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3800);
  }

  // ========================================================
  // REDES SOCIALES FOOTER
  // ========================================================
  function renderSocialLinks() {
    const footerSocial = document.querySelector('.footer-social');
    if (footerSocial) {
      footerSocial.innerHTML = '';
      Object.entries(CONFIG.socialMedia).forEach(([key, social]) => {
        if (!social.active) return;
        const a = document.createElement('a');
        a.href = social.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'footer-social-btn';
        a.innerHTML = `<i class="${social.icon}"></i>`;
        a.title = social.label;
        footerSocial.appendChild(a);
      });
    }
  }

  // ========================================================
  // BENEFICIOS DE LA LECTURA
  // ========================================================
  function renderWhyReadSection() {
    const grid = document.querySelector('.why-read-grid');
    if (!grid) return;

    const reasons = [
      {
        icon: 'brain',
        title: 'Neuroplasticidad y Reserva Cognitiva',
        text: 'La lectura activa estimula redes neuronales complejas, fortaleciendo la memoria de trabajo y desacelerando el declive cognitivo.'
      },
      {
        icon: 'compass',
        title: 'Expansión de Criterio',
        text: 'Sumergirse en textos rigurosos permite asimilar modelos mentales diversos y contrastar perspectivas con profundidad.'
      },
      {
        icon: 'target',
        title: 'Enfoque y Atención Sostenida',
        text: 'Contrarresta la dispersión de estímulos inmediatos, cultivando la capacidad de análisis prolongado y pensamiento crítico.'
      },
      {
        icon: 'heart-handshake',
        title: 'Regulación del Sistema Nervioso',
        text: 'Estudios confirman que periodos breves de lectura concentrada reducen pulsaciones y niveles de cortisol fisiológico.'
      }
    ];

    grid.innerHTML = reasons.map(r => `
      <div class="why-card">
        <div class="why-icon"><i data-lucide="${r.icon}"></i></div>
        <h3>${r.title}</h3>
        <p>${r.text}</p>
      </div>
    `).join('');

    refreshIcons();
  }

  // ========================================================
  // REFLEXIÓN EDITORIAL
  // ========================================================
  function renderDailyQuote() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const quote = QUOTES[dayOfYear % QUOTES.length];

    const textEl = document.getElementById('dailyQuoteText');
    const authorEl = document.getElementById('dailyQuoteAuthor');
    if (textEl && quote) textEl.textContent = `"${quote.text}"`;
    if (authorEl && quote) authorEl.textContent = `— ${quote.author}`;
  }

  function renderFooter() {
    const yearEl = document.querySelector('.footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ========================================================
  // NAVEGACIÓN MÓVIL INFERIOR (SCROLL SPY)
  // ========================================================
  function setupMobileBottomNav() {
    const bottomNav = document.getElementById('mobileBottomNav');
    if (!bottomNav) return;

    const navItems = bottomNav.querySelectorAll('.dock-item');

    const sections = [
      { id: 'catalogo', el: document.getElementById('catalog') },
      { id: 'solicitar', el: document.getElementById('pedidos') }
    ];

    function updateActiveTab() {
      if (state.currentFilter === 'Mi biblioteca') return;
      const scrollPos = window.scrollY + 220;
      let activeTab = 'inicio';

      if (scrollPos > 300) {
        activeTab = 'catalogo';
      }

      sections.forEach(s => {
        if (s.el && scrollPos >= s.el.offsetTop) {
          activeTab = s.id;
        }
      });

      navItems.forEach(item => {
        const tab = item.getAttribute('data-tab');
        item.classList.toggle('active', tab === activeTab);
      });
    }

    window.addEventListener('scroll', updateActiveTab, { passive: true });
  }

  function updateStats() {
    const totalBooks = BOOKS.length;
    const totalDownloads = BOOKS.reduce((sum, b) => sum + b.downloads, 0);
    const categories = new Set(BOOKS.map(b => b.category)).size;

    const el1 = document.getElementById('statBooks');
    const el2 = document.getElementById('statDownloads');
    const el3 = document.getElementById('statCategories');

    if (el1) el1.textContent = totalBooks;
    if (el2) el2.textContent = totalDownloads;
    if (el3) el3.textContent = categories;
  }

  // Cierre de modales
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });

  // Exportar funciones globales
  window.openPreviewModal = openPreviewModal;
  window.closePreviewModal = closePreviewModal;
  window.openFullscreenReader = openFullscreenReader;
  window.closeFullscreenReader = closeFullscreenReader;
  window.downloadFromReader = downloadFromReader;
  window.openSocialModal = openSocialModal;
  window.closeSocialModal = closeSocialModal;
  window.openQrModal = openQrModal;
  window.closeQrModal = closeQrModal;
  window.downloadCurrentBook = downloadCurrentBook;
  window.shareCurrentBook = shareCurrentBook;
  window.shareBookDirect = shareBookDirect;
  window.shareViaWhatsApp = shareViaWhatsApp;
  window.getBookShareUrl = getBookShareUrl;
  window.selectCategory = selectCategory;
  window.copyCollectionLink = copyCollectionLink;
  window.shareCollectionWhatsApp = shareCollectionWhatsApp;
  window.getCollectionShareUrl = getCollectionShareUrl;
  window.openCollectionFromModal = function(e) {
    if (e) e.preventDefault();
    closePreviewModal();
    selectCategory('HARVARD LIBROS', true, true);
  };

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.bookId) {
      const book = BOOKS.find(b => b.id === e.state.bookId);
      if (book) openPreviewModal(book, false);
    } else if (e.state && e.state.filter) {
      closePreviewModal();
      selectCategory(e.state.filter, false, false);
    } else {
      closePreviewModal();
      handleInitialUrl();
    }
  });

  init();
});
