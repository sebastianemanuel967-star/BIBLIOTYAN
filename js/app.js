// ========================================================
//  BIBLIOTYAN — The Personal Knowledge Archive
//  Motor de Aplicación & Experiencia Editorial Luxury
//  Paleta: #09070D · #171020 · #21172C · #B66AFF
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // ── Estado Global ──
  const PAGE_SIZE = 24;

  const state = {
    currentFilter: 'Todos',
    searchQuery: '',
    sortBy: 'curated',
    visibleCount: PAGE_SIZE,
    currentBook: null,
    currentPdfPage: 1,
    totalPdfPages: 0,
    pdfDoc: null,
    requests: [],
    favorites: [],
    selectedFormat: 'pdf',
    dailyBook: null
  };
  window.state = state;

  const KNOWLEDGE_MATCHERS = {
    'Filosofía': {
      categories: ['Espiritualidad & sabiduría', 'TEOLOGÍA CONTEMPORÁNEA'],
      collections: ['Estoica', 'Teolog'],
      keywords: ['filosof', 'estoic', 'sabidur', 'ética', 'etica', 'pensamiento', 'aristóteles', 'aristoteles', 'platón', 'platon', 'séneca', 'seneca', 'marco aurelio', 'epicteto', 'nietzsche', 'kant', 'sócrates', 'socrates', 'spinoza']
    },
    'Psicología': {
      categories: ['Psicología & Conducta', 'Autoayuda & Mente', 'Neurociencia & Mente', 'Crecimiento Personal', 'Productividad & Hábitos'],
      collections: [],
      keywords: ['psicolog', 'mente', 'cerebro', 'emocion', 'conducta', 'neuro', 'ansiedad', 'cognitiv', 'hábito', 'habito', 'trauma', 'ego', 'conciencia', 'hipno']
    },
    'Negocios': {
      categories: ['Liderazgo & Estrategia', 'Marketing & Ventas', 'HARVARD LIBROS', 'LIBROS EMPRENDEDORES', 'Libros de Administración'],
      collections: ['Emprendedor', 'Administra', 'Harvard'],
      keywords: ['negocio', 'empresa', 'marketing', 'venta', 'liderazgo', 'startup', 'estrategia', 'gerencia', 'marca', 'management', 'cliente', 'productividad']
    },
    'Economía': {
      categories: ['Finanzas & Inversión'],
      collections: [],
      keywords: ['econom', 'finanz', 'dinero', 'invers', 'riqueza', 'capital', 'bolsa', 'mercado', 'macroeconom', 'microeconom', 'bitcoin', 'cripto', 'activo', 'presupuesto', 'impuesto']
    },
    'Historia': {
      categories: ['BREVE HISTORIA'],
      collections: ['Breve Historia', 'National Geographic'],
      keywords: ['historia', 'guerra', 'imperio', 'roma', 'grecia', 'egipto', 'edad media', 'revoluci', 'antigu', 'siglo', 'civilizaci', 'batalla', 'mitolog', 'renacimiento']
    },
    'Ciencia': {
      categories: ['Tecnología & Futuro', 'Salud & Longevidad', 'Neurociencia & Mente'],
      collections: ['National Geographic'],
      keywords: ['ciencia', 'física', 'fisica', 'químic', 'quimic', 'biolog', 'matemát', 'matemat', 'astrono', 'universo', 'cosmos', 'cuántic', 'cuantic', 'genética', 'genetica', 'evoluci', 'inteligencia artificial', 'algoritmo', 'datos', 'programaci', 'tecnolog', 'neurociencia', 'medicina', 'cerebro', 'cuerpo', 'salud', 'ecolog', 'fisiolog', 'epigen']
    }
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

  // Escapa texto para insertarlo de forma segura dentro de innerHTML / atributos
  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Fallback visual sobrio para portadas
  window.handleCoverError = function(img, title) {
    img.onerror = null;
    const bookTitle = title || img.dataset.title || '';
    const initial = encodeURIComponent(escapeHTML((bookTitle || 'B').charAt(0).toUpperCase()));
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
    const shareText = `Lee y descarga "${book.title}" de ${book.author} en BIBLIOTYAN — Tu Biblioteca Digital Abierta:`;

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
    if (categoryName === 'TEOLOGÍA CONTEMPORÁNEA' || categoryName === 'TEOLOGIA' || categoryName === 'CTC') {
      return `${base}?coleccion=teologia`;
    }
    if (categoryName === 'LIBROS EMPRENDEDORES' || categoryName === 'EMPRENDEDORES') {
      return `${base}?coleccion=emprendedores`;
    }
    if (categoryName === 'Libros de Administración' || categoryName === 'ADMINISTRACION' || categoryName === 'administracion') {
      return `${base}?coleccion=administracion`;
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
      const hbrCount = getHarvardBookCount();
      msg = `🏛️ *Colección HARVARD LIBROS en BIBLIOTYAN*\n` +
        `Accede y descarga gratis los ${hbrCount} títulos de Harvard Business Review Press en PDF:\n\n` +
        `• Serie Inteligencia Emocional\n` +
        `• Serie Management en 20 Minutos\n` +
        `• Autoconciencia, Empatía, Productividad y Liderazgo\n\n` +
        `👉 *Enlace directo a la colección:*\n${url}`;
    } else if (cat === 'LIBROS EMPRENDEDORES' || cat === 'EMPRENDEDORES') {
      const eCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => b.category === 'LIBROS EMPRENDEDORES').length : 24;
      msg = `\uD83D\uDE80 *Colecci\u00f3n EMPRENDEDORES en BIBLIOTYAN*\n` +
        `Accede y descarga gratis ${eCount} libros imprescindibles de negocios, startups, finanzas, ventas y liderazgo en PDF:\n\n` +
        `\u2022 El M\u00e9todo Lean Startup (Eric Ries)\n` +
        `\u2022 La Vaca P\u00farpura (Seth Godin)\n` +
        `\u2022 Perdiendo la Virginidad (Richard Branson)\n` +
        `\u2022 Finanzas para Emprendedores (Antonio Manzanera)\n` +
        `\u2022 El Tao de Warren Buffett\n` +
        `\u2022 Y decenas de t\u00edtulos m\u00e1s...\n\n` +
        `\uD83D\uDC49 *Enlace directo a la colecci\u00f3n:*\n${url}`;
    } else if (cat === 'TEOLOGÍA CONTEMPORÁNEA' || cat === 'TEOLOGIA' || cat === 'CTC') {
      const tCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => b.category === 'TEOLOGÍA CONTEMPORÁNEA').length : 38;
      msg = `📖 *Colección TEOLÓGICA CONTEMPORÁNEA en BIBLIOTYAN*\n` +
        `Accede y descarga gratis ${tCount} obras de referencia de Editorial CLIE en PDF:\n\n` +
        `• Teología Sistemática y Exégesis Bíblica\n` +
        `• Comentarios y Hermenéutica Avanzada\n` +
        `• Cristología e Historia de las Doctrinas\n\n` +
        `👉 *Enlace directo a la colección:*\n${url}`;
    } else if (cat === 'PARA DUMMIES') {
      const dummiesCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => b.category === 'PARA DUMMIES').length : 70;
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
      } else if (categoryName === 'Robert Greene' || categoryName === 'Colección Robert Greene') {
        params.set('coleccion', 'robert-greene');
        params.delete('categoria');
        params.delete('cat');
      } else if (categoryName === 'Jacobo Grinberg' || categoryName === 'Colección Jacobo Grinberg') {
        params.set('coleccion', 'jacobo-grinberg');
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
      } else if (categoryName === 'TEOLOGÍA CONTEMPORÁNEA' || categoryName === 'TEOLOGIA' || categoryName === 'CTC') {
        params.set('coleccion', 'teologia');
        params.delete('categoria');
        params.delete('cat');
      } else if (categoryName === 'LIBROS EMPRENDEDORES') {
        params.set('coleccion', 'emprendedores');
        params.delete('categoria');
        params.delete('cat');
      } else if (categoryName === 'Libros de Administración' || categoryName === 'ADMINISTRACION') {
        params.set('coleccion', 'administracion');
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
        : 'BIBLIOTYAN — Tu Biblioteca Digital Abierta';
      window.history.replaceState({ filter: categoryName }, pageTitle, newUrl);
    } catch (e) {}
  }

  function selectCategory(categoryName, shouldScroll = false, updateUrl = true) {
    state.currentFilter = categoryName;
    state.visibleCount = PAGE_SIZE;

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

    // Sincronizar tarjetas de Explora por conocimiento
    document.querySelectorAll('.knowledge-card').forEach(card => {
      const labelEl = card.querySelector('.knowledge-card-label');
      const label = labelEl ? labelEl.textContent.trim() : '';
      card.classList.toggle('active', label === categoryName);
    });

    // Sincronizar chips de colecciones especiales
    document.querySelectorAll('.collection-chip-compact').forEach(btn => {
      const isMatch = (btn.id === 'cardColGreene' && (categoryName === 'Robert Greene' || categoryName === 'Colección Robert Greene')) ||
                      (btn.id === 'cardColGrinberg' && (categoryName === 'Jacobo Grinberg' || categoryName === 'Colección Jacobo Grinberg')) ||
                      (btn.id === 'cardColDummies' && (categoryName === 'PARA DUMMIES' || categoryName === 'Colección Para Dummies')) ||
                      (btn.id === 'cardColHistoria' && (categoryName === 'BREVE HISTORIA' || categoryName === 'Colección Breve Historia')) ||
                      (btn.id === 'cardColHarvard' && (categoryName === 'HARVARD LIBROS' || categoryName === 'Colección Harvard Libros')) ||
                      (btn.id === 'cardColEmprendedores' && (categoryName === 'LIBROS EMPRENDEDORES' || categoryName === 'Colección Emprendedores')) ||
                      (btn.id === 'cardColTeologia' && (categoryName === 'TEOLOGÍA CONTEMPORÁNEA' || categoryName === 'Colección Teológica Contemporánea')) ||
                      (btn.id === 'cardColAdmin' && (categoryName === 'Libros de Administración' || categoryName === 'Colección Libros de Administración'));
      btn.classList.toggle('active', isMatch);
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
    if (name === 'Todos') {
      selectCategory('Todos', true, true);
      return;
    }

    const canonical = Object.keys(KNOWLEDGE_MATCHERS).find(
      k => k.toLowerCase() === String(name || '').trim().toLowerCase()
    );

    if (canonical) {
      selectCategory(canonical, true, true);
      return;
    }

    state.currentFilter = 'Todos';
    state.visibleCount = PAGE_SIZE;
    state.searchQuery = String(name || '').toLowerCase().trim();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = name;
    renderBooks();
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
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
    state.visibleCount = PAGE_SIZE;
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
      openRequestSheet();
    } else if (tab === 'biblioteca') {
      state.currentFilter = 'Mi biblioteca';
      state.visibleCount = PAGE_SIZE;
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
      if (cleanSlug === 'robert-greene' || cleanSlug === 'greene' || cleanSlug.includes('greene')) {
        targetCat = 'Robert Greene';
      } else if (cleanSlug === 'jacobo-grinberg' || cleanSlug === 'grinberg' || cleanSlug.includes('grinberg')) {
        targetCat = 'Jacobo Grinberg';
      } else if (cleanSlug === 'harvard' || cleanSlug === 'harvard-libros' || cleanSlug.includes('harvard')) {
        targetCat = 'HARVARD LIBROS';
      } else if (cleanSlug === 'breve-historia' || cleanSlug === 'historia' || cleanSlug.includes('breve-historia')) {
        targetCat = 'BREVE HISTORIA';
      } else if (cleanSlug === 'dummies' || cleanSlug === 'para-dummies' || cleanSlug.includes('dummies')) {
        targetCat = 'PARA DUMMIES';
      } else if (cleanSlug === 'emprendedores' || cleanSlug === 'libros-emprendedores' || cleanSlug.includes('emprendedor')) {
        targetCat = 'LIBROS EMPRENDEDORES';
      } else if (cleanSlug === 'teologia' || cleanSlug === 'teologica' || cleanSlug === 'ctc' || cleanSlug.includes('teolog')) {
        targetCat = 'TEOLOGÍA CONTEMPORÁNEA';
      } else if (cleanSlug === 'administracion' || cleanSlug === 'libros-de-administracion' || cleanSlug.includes('administra')) {
        targetCat = 'Libros de Administración';
      } else {
        targetCat = CONFIG.categories.find(c => slugify(c) === cleanSlug || slugify(c).includes(cleanSlug) || cleanSlug.includes(slugify(c)));
      }
    } else if (hash.includes('harvard')) {
      targetCat = 'HARVARD LIBROS';
    } else if (hash.includes('dummies')) {
      targetCat = 'PARA DUMMIES';
    } else if (hash.includes('administra')) {
      targetCat = 'Libros de Administración';
    }

    if (targetCat) {
      selectCategory(targetCat, true, false);
      if (targetCat === 'Robert Greene') {
        showToast('Colección Robert Greene', 'Explorando las obras sobre poder, estrategia y maestría');
      } else if (targetCat === 'Jacobo Grinberg') {
        showToast('Colección Jacobo Grinberg', 'Explorando la Teoría Sintérgica, Neuroalgoritmos y Chamanismo');
      } else if (targetCat === 'HARVARD LIBROS') {
        const hbrCount = getHarvardBookCount();
        showToast('Colección Harvard Activa', `Explorando los ${hbrCount} títulos de Harvard Business Review`);
      } else if (targetCat === 'BREVE HISTORIA') {
        showToast('Colección Breve Historia', 'Explorando los 142 títulos de Ediciones Nowtilus');
      } else if (targetCat === 'PARA DUMMIES') {
        const dCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => b.category === 'PARA DUMMIES').length : 70;
        showToast('Colección Para Dummies', `Explorando las ${dCount} guías prácticas en PDF`);
      } else if (targetCat === 'LIBROS EMPRENDEDORES') {
        const eCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => b.category === 'LIBROS EMPRENDEDORES' || (b.collection && b.collection.includes('Emprendedor'))).length : 394;
        showToast('Colección Emprendedores', `Explorando los ${eCount} libros de negocios y startups en PDF`);
      } else if (targetCat === 'Libros de Administración') {
        const aCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => (b.collection && b.collection.includes('Administra')) || b.category === 'Libros de Administración').length : 197;
        showToast('Colección Administración Activa', `Explorando los ${aCount} manuales y tratados de gestión empresarial`);
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
      state.searchQuery = qVal.toLowerCase();
      state.visibleCount = PAGE_SIZE;
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = qVal;
      renderBooks();
      const catalog = document.getElementById('catalog');
      if (catalog) {
        setTimeout(() => catalog.scrollIntoView({ behavior: 'smooth' }), 200);
      }
    }
  }

  /**
   * Calcula el total actual de títulos en la colección HARVARD LIBROS.
   */
  function getHarvardBookCount() {
    if (typeof BOOKS === 'undefined' || !Array.isArray(BOOKS)) return 27;
    return BOOKS.filter(b => b.category === 'HARVARD LIBROS' || (b.collection && b.collection.includes('Harvard'))).length;
  }

  /**
   * Unifica el campo de enlace PDF para entradas antiguas (`pdf`) y nuevas (`pdfUrl`).
   */
  function normalizeBookUrls() {
    if (typeof BOOKS === 'undefined' || !Array.isArray(BOOKS)) return;
    BOOKS.forEach(book => {
      if (!book.pdf && book.pdfUrl) {
        book.pdf = book.pdfUrl;
      }
    });
  }

  // ========================================================
  // INICIALIZACIÓN
  // ========================================================
  function init() {
    normalizeBookUrls();
    setupSearchBar();
    renderFilterButtons();
    renderMostReadShelf();
    renderEditorialShelf();
    // renderDailyRecommendation();
    renderBooks();
    renderSocialLinks();
    renderWhyReadSection();
    renderDailyQuote();
    renderFooter();
    initRequestSheet();
    setupSecretAdminAccess();
    setupMobileBottomNav();
    updateStats();
    updateCollectionShowcaseBadges();
    setupCollectionsCarousel();
    handleInitialUrl();
    initAudioPlayer();
    refreshIcons();
  }

  // ========================================================
  // BÚSQUEDA EN TIEMPO REAL (DEBOUNCE 150 MS)
  // ========================================================
  function setupSearchBar() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    if (!input) return;

    let searchTimer = null;
    input.addEventListener('input', (e) => {
      const nextQuery = e.target.value.toLowerCase().trim();
      if (clearBtn) {
        clearBtn.style.display = nextQuery ? 'inline-flex' : 'none';
      }
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.searchQuery = nextQuery;
        state.visibleCount = PAGE_SIZE;
        renderBooks();
      }, 150);
    });
  }

  // ========================================================
  // LO MÁS LEÍDO & SELECCIÓN EDITORIAL (HORIZONTAL SHELVES)
  // ========================================================
  const MOST_READ_IDS = [2613, 1453, 1519, 1960, 1232, 2089, 1491, 2136, 2240, 1830];
  const EDITORIAL_SELECTION_IDS = [1960, 1087, 1467, 1453, 1519, 1491, 1476, 1411, 603];

  function renderShelfBooks(shelfId, bookIds) {
    const shelf = document.getElementById(shelfId);
    if (!shelf) return;

    const curated = bookIds.map(id => BOOKS.find(b => b.id === id)).filter(Boolean);
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
          <img src="${escapeHTML(book.cover)}" alt="${escapeHTML(book.title)}" data-title="${escapeHTML(book.title)}" loading="lazy" onerror="handleCoverError(this)">
        </div>
        <div class="editorial-mini-info">
          <h4 class="editorial-mini-title">${escapeHTML(book.title)}</h4>
          <p class="editorial-mini-author">${escapeHTML(book.author)}</p>
          <div class="editorial-mini-footer">
            <span class="editorial-mini-badge">${escapeHTML(book.category)}</span>
            <button type="button" class="btn-mini-fav ${isFav ? 'active' : ''}" data-id="${book.id}" onclick="event.stopPropagation(); toggleFavorite(${book.id}, event)" title="${isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}" aria-label="Favorito">
              <i data-lucide="bookmark"></i>
            </button>
          </div>
        </div>
      `;
      card.addEventListener('click', () => openPreviewModal(book));
      shelf.appendChild(card);
    });
  }

  function renderMostReadShelf() {
    renderShelfBooks('mostReadShelf', MOST_READ_IDS);
    refreshIcons();
  }

  function renderEditorialShelf() {
    renderShelfBooks('editorialShelf', EDITORIAL_SELECTION_IDS);
    refreshIcons();
  }

  // ========================================================
  // RECOMENDACION DEL DIA (ELIMINADO A PETICION)
  // ========================================================
  function renderDailyRecommendation() {}
  window.openDailyRecommendation = function() {};
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
      'LIBROS EMPRENDEDORES',
      'Libros de Administración',
      'TEOLOGÍA CONTEMPORÁNEA',
      'National Geographic',
      'E-Books (EPUB)',
      'Audiolibros',
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
      else if (cat === 'LIBROS EMPRENDEDORES') iconHtml = '<i data-lucide="trending-up"></i>';
      else if (cat === 'Libros de Administración') iconHtml = '<i data-lucide="briefcase"></i>';
      else if (cat === 'TEOLOGÍA CONTEMPORÁNEA') iconHtml = '<i data-lucide="scroll"></i>';
      else if (cat === 'Audiolibros') iconHtml = '<i data-lucide="headphones"></i>';
      else if (cat === 'E-Books (EPUB)') iconHtml = '<i data-lucide="book-open"></i>';

      btn.innerHTML = `${iconHtml} <span>${escapeHTML(cat)}</span>`;
      btn.addEventListener('click', () => {
        selectCategory(cat, false, true);
      });
      bar.appendChild(btn);
    });

    refreshIcons();
  }

  // ========================================================
  // BANNER DE COLECCION EN CATALOGO (ELIMINADO A PETICION)
  // ========================================================
  function renderCollectionBanner() {
    const container = document.getElementById('collectionBannerContainer');
    if (container) container.innerHTML = '';
  }
  function matchesKnowledgeArea(book, areaName) {
    const matcher = KNOWLEDGE_MATCHERS[areaName];
    if (!matcher) return false;
    if (matcher.categories.includes(book.category)) return true;
    if (book.collection && matcher.collections.some(c => book.collection.includes(c))) return true;
    const haystack = `${book.title || ''} ${book.author || ''} ${book.category || ''} ${book.collection || ''} ${book.description || ''}`.toLowerCase();
    return matcher.keywords.some(kw => haystack.includes(kw));
  }

  // ========================================================
  // RENDERIZADO DEL CATÁLOGO (24 EN 24 + GRID 2 COLUMNAS)
  // ========================================================
  function renderBooks() {
    const grid = document.getElementById('booksGrid');
    const countEl = document.getElementById('resultsCount');
    const paginationEl = document.getElementById('catalogPagination');
    if (!grid) return;

    renderCollectionBanner();

    let filtered = BOOKS.filter(book => {
      // 1. Filtrado especial, por area de conocimiento o de categoria
      let matchesCategory = false;

      if (state.currentFilter === 'Todos') {
        matchesCategory = true;
      } else if (KNOWLEDGE_MATCHERS[state.currentFilter]) {
        matchesCategory = matchesKnowledgeArea(book, state.currentFilter);
      } else if (state.currentFilter === 'Más leídos') {
        matchesCategory = true;
      } else if (state.currentFilter === 'Nuevos') {
        matchesCategory = true;
      } else if (state.currentFilter === 'Recomendados') {
        matchesCategory = EDITORIAL_SELECTION_IDS.includes(book.id) || (book.downloads >= 400);
      } else if (state.currentFilter === 'Mi biblioteca') {
        matchesCategory = state.favorites.includes(book.id);
      } else if (state.currentFilter === 'National Geographic') {
        matchesCategory = (book.collection === 'National Geographic' || book.category === 'National Geographic');
      } else if (state.currentFilter === 'E-Books (EPUB)') {
        matchesCategory = (book.format === 'epub' || book.format === 'dual' || !!book.epub);
      } else if (state.currentFilter === 'Audiolibros' || state.currentFilter === 'Colección Audiolibros') {
        matchesCategory = (book.format === 'audio' || !!book.audioUrl || !!book.tracks || (book.collection && book.collection.includes('Audiolibro')));
      } else if (state.currentFilter === 'Robert Greene' || state.currentFilter === 'Colección Robert Greene' || state.currentFilter === 'ROBERT GREENE') {
        matchesCategory = (book.author && book.author.toLowerCase().includes('robert greene')) || (book.collection && book.collection.includes('Robert Greene'));
      } else if (state.currentFilter === 'Jacobo Grinberg' || state.currentFilter === 'Colección Jacobo Grinberg' || state.currentFilter === 'JACOBO GRINBERG') {
        matchesCategory = (book.author && book.author.toLowerCase().includes('grinberg')) || (book.collection && book.collection.includes('Grinberg'));
      } else if (state.currentFilter === 'LIBROS EMPRENDEDORES' || state.currentFilter === 'Colección Emprendedores') {
        matchesCategory = (book.collection && book.collection.includes('Emprendedor')) || book.category === 'LIBROS EMPRENDEDORES';
      } else if (state.currentFilter === 'PARA DUMMIES' || state.currentFilter === 'Colección Para Dummies') {
        matchesCategory = (book.collection && book.collection.includes('Dummies')) || book.category === 'PARA DUMMIES';
      } else if (state.currentFilter === 'BREVE HISTORIA' || state.currentFilter === 'Colección Breve Historia') {
        matchesCategory = (book.collection && book.collection.includes('Breve Historia')) || book.category === 'BREVE HISTORIA';
      } else if (state.currentFilter === 'HARVARD LIBROS' || state.currentFilter === 'Colección Harvard Libros') {
        matchesCategory = (book.collection && book.collection.includes('Harvard')) || book.category === 'HARVARD LIBROS';
      } else if (state.currentFilter === 'TEOLOGÍA CONTEMPORÁNEA' || state.currentFilter === 'Colección Teológica Contemporánea') {
        matchesCategory = (book.collection && book.collection.includes('Teolog')) || book.category === 'TEOLOGÍA CONTEMPORÁNEA';
      } else if (state.currentFilter === 'Libros de Administración' || state.currentFilter === 'Colección Libros de Administración' || state.currentFilter === 'LIBROS DE ADMINISTRACIÓN' || state.currentFilter === 'ADMINISTRACION') {
        matchesCategory = (book.collection && book.collection.includes('Administra')) || book.category === 'Libros de Administración';
      } else {
        matchesCategory = book.category === state.currentFilter;
      }

      // 2. Filtrado de búsqueda en tiempo real
      const q = (state.searchQuery || '').toLowerCase();
      const matchesSearch = !q ||
        (book.title && book.title.toLowerCase().includes(q)) ||
        (book.author && book.author.toLowerCase().includes(q)) ||
        (book.category && book.category.toLowerCase().includes(q)) ||
        (book.collection && book.collection.toLowerCase().includes(q)) ||
        (book.description && book.description.toLowerCase().includes(q)) ||
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
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'curated':
        default:
          if (state.currentFilter !== 'Todos' || state.searchQuery) {
            filtered.sort((a, b) => {
              const isEdA = EDITORIAL_SELECTION_IDS.includes(a.id) ? 1 : 0;
              const isEdB = EDITORIAL_SELECTION_IDS.includes(b.id) ? 1 : 0;
              if (isEdA !== isEdB) return isEdB - isEdA;
              const isFeatA = a.featured ? 1 : 0;
              const isFeatB = b.featured ? 1 : 0;
              if (isFeatA !== isFeatB) return isFeatB - isFeatA;
              return (b.downloads || 0) - (a.downloads || 0);
            });
          }
          break;
      }
    }

    if (countEl) {
      const filterLabel = state.currentFilter === 'Todos' ? 'Catálogo' : state.currentFilter;
      countEl.textContent = `${filterLabel} · ${filtered.length} ${filtered.length === 1 ? 'libro' : 'libros'}`;
    }

    grid.innerHTML = '';
    if (paginationEl) paginationEl.innerHTML = '';

    if (filtered.length === 0) {
      if (state.currentFilter === 'Mi biblioteca') {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted)">
            <i data-lucide="bookmark" style="width: 44px; height: 44px; color: var(--purple-primary); margin: 0 auto 1rem; display: block;"></i>
            <h3 style="color: var(--text-main); margin-bottom: 0.5rem; font-size: 1.2rem">Tu biblioteca está vacía</h3>
            <p style="max-width: 440px; margin: 0 auto 1.25rem; line-height: 1.5; color: var(--text-secondary);">
              Aún no has guardado ningún libro. Pulsa el icono de marcador en tus títulos favoritos para verlos aquí reunidos.
            </p>
            <button type="button" class="btn-hero-explore" onclick="selectCategory('Todos', false, true)">
              Explorar Catálogo Completo
            </button>
          </div>
        `;
      } else {
        const queryNotice = state.searchQuery
          ? `No encontramos resultados para "<strong>${escapeHTML(state.searchQuery)}</strong>".`
          : 'No encontramos libros con este filtro.';
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted)">
            <i data-lucide="book-open" style="width: 44px; height: 44px; color: var(--purple-primary); margin: 0 auto 1rem; display: block;"></i>
            <h3 style="color: var(--text-main); margin-bottom: 0.5rem; font-size: 1.2rem">No se encontraron libros</h3>
            <p style="max-width: 460px; margin: 0 auto 1.2rem; line-height: 1.5; color: var(--text-secondary);">
              ${queryNotice} Si buscas un título que aún no figura en el archivo, puedes pedirlo directo al equipo.
            </p>
            <button type="button" class="btn-hero-explore" id="emptyRequestBtn">
              Solicitar este libro
            </button>
          </div>
        `;
        const emptyReqBtn = document.getElementById('emptyRequestBtn');
        if (emptyReqBtn) {
          emptyReqBtn.addEventListener('click', () => openRequestSheet(state.searchQuery));
        }
      }
      refreshIcons();
      return;
    }

    const visibleBooks = filtered.slice(0, state.visibleCount);

    visibleBooks.forEach((book) => {
      const card = document.createElement('div');
      card.className = 'book-card';

      const isFav = state.favorites.includes(book.id);
      let formatIcon = 'file-text';
      let formatText = 'PDF';

      if (book.format === 'audio') {
        formatIcon = 'headphones';
        formatText = 'AUDIO';
      } else if (book.format === 'dual' || (book.pdf && book.epub)) {
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
          <img src="${escapeHTML(book.cover)}" alt="${escapeHTML(book.title)}" data-title="${escapeHTML(book.title)}" loading="lazy" onerror="handleCoverError(this)">
        </div>
        <div class="card-details">
          <h3 class="card-title" title="${escapeHTML(book.title)}">${escapeHTML(book.title)}</h3>
          <p class="card-author">${escapeHTML(book.author)}</p>
          <div class="card-meta-row">
            <span class="card-category-pill" title="Filtrar colección ${escapeHTML(book.category)}">${escapeHTML(book.category)}</span>
            <button type="button" class="card-fav-btn ${isFav ? 'active' : ''}" data-id="${book.id}" onclick="event.stopPropagation(); toggleFavorite(${book.id}, event)" title="${isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}" aria-label="Guardar en favoritos">
              <i data-lucide="bookmark"></i>
            </button>
          </div>
        </div>
      `;

      const catPill = card.querySelector('.card-category-pill');
      if (catPill) {
        catPill.addEventListener('click', (e) => {
          e.stopPropagation();
          selectCategory(book.category, true, true);
        });
      }

      card.addEventListener('click', () => openPreviewModal(book));
      grid.appendChild(card);
    });

    if (paginationEl && filtered.length > state.visibleCount) {
      const remaining = filtered.length - state.visibleCount;
      const nextBatch = Math.min(PAGE_SIZE, remaining);
      paginationEl.innerHTML = `
        <button type="button" class="btn-load-more" onclick="loadMoreBooks()">
          Mostrar ${nextBatch} m&aacute;s (${remaining} restantes)
        </button>
      `;
    }

    refreshIcons();
  }

  function loadMoreBooks() {
    state.visibleCount += PAGE_SIZE;
    renderBooks();
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.visibleCount = PAGE_SIZE;
      renderBooks();
    });
  }

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
      <img src="${escapeHTML(book.cover)}" alt="${escapeHTML(book.title)}" data-title="${escapeHTML(book.title)}" onerror="handleCoverError(this)">
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
        const dCount = (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) ? BOOKS.filter(b => b.category === 'PARA DUMMIES').length : 70;
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
      if (book.format === 'audio') {
        formatBadgeEl.className = 'format-badge audio-badge';
        formatBadgeEl.innerHTML = '<i class="fa-solid fa-headphones"></i> AUDIOLIBRO';
        formatBadgeEl.style.display = 'inline-flex';
      } else if (book.format === 'dual' || (book.pdf && book.epub)) {
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
      aiTagsEl.innerHTML = concepts.map(c => `<span class="ai-tag-item"># ${escapeHTML(c)}</span>`).join('');
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
      if (book.format === 'audio') {
        dlContainer.innerHTML = `
          <div class="modal-direct-actions">
            <button class="btn-direct-read btn-direct-audio" onclick="openAudioPlayer()">
              <i class="fa-solid fa-headphones"></i> Escuchar Audiolibro
            </button>
            <button class="btn-direct-download" onclick="downloadCurrentAudioTrackDirect()">
              <i class="fa-solid fa-download"></i> Descargar Audio
            </button>
          </div>
        `;
      } else if (book.format === 'dual' || (book.pdf && book.epub)) {
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

    // Solo el libro promocional autorizado (ID 2613) sustituye redes del autor
    const promoOverrides = (state.currentBook && state.currentBook.id === 2613) ? {
      instagram: {
        url: state.currentBook.customInstagram,
        label: 'Instagram @brauliohipnocoach',
        subtitle: 'Autor de Hacia Adentro · Promo especial'
      },
      facebook: {
        url: state.currentBook.customFacebook,
        label: 'Facebook del Autor · Braulio Ramírez',
        subtitle: 'Video promocional · Hacia Adentro'
      }
    } : {};

    Object.entries(CONFIG.socialMedia).forEach(([key, social]) => {
      if (!social.active) return;
      const meta = socialMeta[key] || {
        subtitle: 'Comunidad oficial',
        badge: 'Seguir',
        badgeColor: '#B66AFF',
        iconBg: 'linear-gradient(135deg, #B66AFF 0%, #8e3ee8 100%)'
      };

      const override = promoOverrides[key];
      const hasOverride = !!(override && typeof override.url === 'string' && override.url.trim());
      const socialUrl = hasOverride ? override.url.trim() : social.url;
      const socialLabel = hasOverride ? override.label : social.label;
      const socialSub = hasOverride ? override.subtitle : meta.subtitle;

      const a = document.createElement('a');
      a.href = socialUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = `social-follow-card ${key}`;
      a.innerHTML = `
        <div class="social-card-icon-box" style="background: ${meta.iconBg}">
          <i class="${social.icon}"></i>
        </div>
        <div class="social-card-info">
          <span class="social-card-title">${socialLabel}</span>
          <span class="social-card-sub">${socialSub}</span>
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
    updateCollectionShowcaseBadges();
    setupCollectionsCarousel();

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
  // BOTTOM SHEET: SOLICITAR LIBRO (TELEGRAM + WHATSAPP)
  // ========================================================
  function updateRequestSheetLinks(rawTitle) {
    const cleanTitle = String(rawTitle || '').trim();
    const tgBtn = document.getElementById('requestTelegramBtn');
    const waBtn = document.getElementById('requestWhatsappBtn');

    if (tgBtn) {
      tgBtn.href = CONFIG.communityInviteUrl || 'https://t.me/bibliotyan';
    }

    if (waBtn) {
      const msg = cleanTitle
        ? `Hola BIBLIOTYAN, me gustaría solicitar el libro: ${cleanTitle}`
        : 'Hola BIBLIOTYAN, me gustaría solicitar un libro para el catálogo.';
      waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    }
  }

  function initRequestSheet() {
    const input = document.getElementById('requestBookInput');
    if (input) {
      input.addEventListener('input', (e) => {
        updateRequestSheetLinks(e.target.value);
      });
    }
    updateRequestSheetLinks('');
  }

  function openRequestSheet(prefillTitle = '') {
    const modal = document.getElementById('requestSheetModal');
    if (!modal) return;
    const input = document.getElementById('requestBookInput');
    if (input) {
      input.value = String(prefillTitle || '').trim();
      updateRequestSheetLinks(input.value);
    } else {
      updateRequestSheetLinks('');
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeRequestSheet() {
    const modal = document.getElementById('requestSheetModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

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
      { id: 'catalogo', el: document.getElementById('catalog') }
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

  function updateCollectionShowcaseBadges() {
    if (typeof BOOKS === 'undefined' || !Array.isArray(BOOKS)) return;
    const rgCount = BOOKS.filter(b => (b.author && b.author.toLowerCase().includes('robert greene')) || (b.collection && b.collection.includes('Robert Greene'))).length;
    const jgCount = BOOKS.filter(b => (b.author && b.author.toLowerCase().includes('grinberg')) || (b.collection && b.collection.includes('Grinberg'))).length;
    const dCount = BOOKS.filter(b => b.category === 'PARA DUMMIES' || (b.collection && b.collection.includes('Dummies'))).length;
    const hCount = BOOKS.filter(b => b.category === 'BREVE HISTORIA' || (b.collection && b.collection.includes('Breve Historia'))).length;
    const hbrCount = BOOKS.filter(b => b.category === 'HARVARD LIBROS' || (b.collection && b.collection.includes('Harvard'))).length;
    const tCount = BOOKS.filter(b => b.category === 'TEOLOGÍA CONTEMPORÁNEA' || (b.collection && b.collection.includes('Teolog'))).length;
    const eCount = BOOKS.filter(b => b.category === 'LIBROS EMPRENDEDORES' || (b.collection && b.collection.includes('Emprendedor'))).length;
    const aCount = BOOKS.filter(b => (b.collection && b.collection.includes('Administra')) || b.category === 'Libros de Administración').length;

    const elGreene = document.getElementById('colCountGreene');
    const elGrinberg = document.getElementById('colCountGrinberg');
    const elTeologia = document.getElementById('colCountTeologia');
    const elEmprendedores = document.getElementById('colCountEmprendedores');
    const elAdmin = document.getElementById('colCountAdmin');
    const elDummies = document.getElementById('colCountDummies');
    const elHistoria = document.getElementById('colCountHistoria');
    const elHarvard = document.getElementById('colCountHarvard');

    if (elGreene) elGreene.textContent = rgCount;
    if (elGrinberg) elGrinberg.textContent = jgCount;

    if (elTeologia) elTeologia.textContent = tCount;
    if (elEmprendedores) elEmprendedores.textContent = eCount;
    if (elAdmin) elAdmin.textContent = aCount;
    if (elDummies) elDummies.textContent = dCount;
    if (elHistoria) elHistoria.textContent = hCount;
    if (elHarvard) elHarvard.textContent = hbrCount;
  }

  function setupCollectionsCarousel() {
    const grid = document.getElementById('specialCollectionsGrid');
    const dots = document.querySelectorAll('.collections-carousel-dots .c-dot');
    if (!grid || dots.length === 0) return;

    grid.addEventListener('scroll', () => {
      const scrollLeft = grid.scrollLeft;
      const cardWidth = grid.querySelector('.collection-card-item')?.offsetWidth || 280;
      const activeIdx = Math.min(dots.length - 1, Math.max(0, Math.round(scrollLeft / (cardWidth + 10))));
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIdx);
      });
    }, { passive: true });

    window.scrollCollectionCard = function(idx) {
      const cards = grid.querySelectorAll('.collection-card-item');
      if (cards[idx]) {
        cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    };
  }

  // ========================================================
  // REPRODUCTOR DE AUDIOLIBROS INTERACTIVO
  // ========================================================
  let currentAudioBook = null;
  let currentTrackIndex = 0;
  let audioPlayerInitialized = false;

  function initAudioPlayer() {
    if (audioPlayerInitialized) return;
    const audio = document.getElementById('nativeAudioElement');
    if (!audio) return;

    audioPlayerInitialized = true;

    audio.addEventListener('timeupdate', () => {
      const curTime = audio.currentTime || 0;
      const duration = audio.duration || 0;
      const curTimeEl = document.getElementById('audioCurrentTime');
      const durTimeEl = document.getElementById('audioDuration');
      const progressBar = document.getElementById('audioProgressBar');

      if (curTimeEl) curTimeEl.textContent = formatAudioTime(curTime);
      if (durTimeEl && !isNaN(duration) && duration > 0) durTimeEl.textContent = formatAudioTime(duration);
      if (progressBar && duration > 0) {
        progressBar.value = (curTime / duration) * 100;
      }
    });

    audio.addEventListener('play', () => {
      const icon = document.getElementById('audioPlayIcon');
      if (icon) {
        icon.className = 'fa-solid fa-pause';
      }
      const indicator = document.getElementById('audioPulseIndicator');
      if (indicator) indicator.classList.add('playing');
    });

    audio.addEventListener('pause', () => {
      const icon = document.getElementById('audioPlayIcon');
      if (icon) {
        icon.className = 'fa-solid fa-play';
      }
      const indicator = document.getElementById('audioPulseIndicator');
      if (indicator) indicator.classList.remove('playing');
    });

    audio.addEventListener('ended', () => {
      if (currentAudioBook && currentAudioBook.tracks && currentTrackIndex < currentAudioBook.tracks.length - 1) {
        audioNextTrack();
      } else {
        const icon = document.getElementById('audioPlayIcon');
        if (icon) icon.className = 'fa-solid fa-play';
        const indicator = document.getElementById('audioPulseIndicator');
        if (indicator) indicator.classList.remove('playing');
      }
    });

    audio.addEventListener('error', (e) => {
      console.warn('Audio playback error', e);
    });
  }

  function formatAudioTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function openAudioPlayer(book) {
    const target = book || state.currentBook;
    if (!target) return;
    currentAudioBook = target;
    currentTrackIndex = 0;

    initAudioPlayer();

    const modal = document.getElementById('audioPlayerModal');
    const cover = document.getElementById('audioPlayerCover');
    const title = document.getElementById('audioPlayerTitle');
    const author = document.getElementById('audioPlayerAuthor');
    const trackSelect = document.getElementById('audioTrackSelect');
    const trackWrapper = document.getElementById('audioPlaylistWrapper');

    if (cover) cover.src = target.cover || '';
    if (title) title.textContent = target.title || 'Audiolibro';
    if (author) author.textContent = target.author || '';

    // Llenar selector de capítulos
    if (trackSelect) {
      trackSelect.innerHTML = '';
      if (target.tracks && target.tracks.length > 0) {
        if (trackWrapper) trackWrapper.style.display = 'block';
        target.tracks.forEach((tr, idx) => {
          const opt = document.createElement('option');
          opt.value = idx;
          opt.textContent = tr.title || `Pista ${idx + 1}`;
          trackSelect.appendChild(opt);
        });
      } else {
        if (trackWrapper) trackWrapper.style.display = 'none';
      }
    }

    loadTrack(0, true);

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function loadTrack(index, autoplay = false) {
    if (!currentAudioBook) return;
    const audio = document.getElementById('nativeAudioElement');
    if (!audio) return;

    let trackUrl = '';
    let trackName = 'Pista 1';

    if (currentAudioBook.tracks && currentAudioBook.tracks.length > 0) {
      currentTrackIndex = Math.max(0, Math.min(index, currentAudioBook.tracks.length - 1));
      const tr = currentAudioBook.tracks[currentTrackIndex];
      trackUrl = tr.url;
      trackName = tr.title || `Pista ${currentTrackIndex + 1}`;

      const trackSelect = document.getElementById('audioTrackSelect');
      if (trackSelect) trackSelect.value = currentTrackIndex;

      const prevBtn = document.getElementById('audioPrevBtn');
      const nextBtn = document.getElementById('audioNextBtn');
      if (prevBtn) prevBtn.disabled = currentTrackIndex === 0;
      if (nextBtn) nextBtn.disabled = currentTrackIndex === currentAudioBook.tracks.length - 1;
    } else {
      currentTrackIndex = 0;
      trackUrl = currentAudioBook.audioUrl || '';
      trackName = currentAudioBook.title || 'Audiolibro Completo';
      const prevBtn = document.getElementById('audioPrevBtn');
      const nextBtn = document.getElementById('audioNextBtn');
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
    }

    const curTrackNameEl = document.getElementById('audioCurrentTrackName');
    if (curTrackNameEl) curTrackNameEl.textContent = trackName;

    audio.src = trackUrl;
    audio.load();

    const progressBar = document.getElementById('audioProgressBar');
    if (progressBar) progressBar.value = 0;
    const curTimeEl = document.getElementById('audioCurrentTime');
    if (curTimeEl) curTimeEl.textContent = '0:00';
    const durTimeEl = document.getElementById('audioDuration');
    if (durTimeEl) durTimeEl.textContent = '0:00';

    if (autoplay) {
      audio.play().catch(e => {
        console.log('Autoplay status:', e);
      });
    }
  }

  function closeAudioPlayer() {
    const audio = document.getElementById('nativeAudioElement');
    if (audio) {
      audio.pause();
    }
    const modal = document.getElementById('audioPlayerModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleAudioPlay() {
    const audio = document.getElementById('nativeAudioElement');
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(e => console.warn(e));
    } else {
      audio.pause();
    }
  }

  function audioSkip(seconds) {
    const audio = document.getElementById('nativeAudioElement');
    if (!audio) return;
    const targetTime = (audio.currentTime || 0) + seconds;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, targetTime));
  }

  function audioPrevTrack() {
    if (!currentAudioBook || !currentAudioBook.tracks) return;
    if (currentTrackIndex > 0) {
      loadTrack(currentTrackIndex - 1, true);
    }
  }

  function audioNextTrack() {
    if (!currentAudioBook || !currentAudioBook.tracks) return;
    if (currentTrackIndex < currentAudioBook.tracks.length - 1) {
      loadTrack(currentTrackIndex + 1, true);
    }
  }

  function onAudioTrackSelected(indexVal) {
    const idx = parseInt(indexVal, 10);
    if (!isNaN(idx)) {
      loadTrack(idx, true);
    }
  }

  function onAudioSeek(val) {
    const audio = document.getElementById('nativeAudioElement');
    if (!audio || !audio.duration) return;
    const targetSec = (parseFloat(val) / 100) * audio.duration;
    audio.currentTime = targetSec;
  }

  function setAudioSpeed(rate, btn) {
    const audio = document.getElementById('nativeAudioElement');
    if (audio) audio.playbackRate = parseFloat(rate);
    const speedBtns = document.querySelectorAll('.audio-speed-selector .speed-btn');
    speedBtns.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }

  function downloadCurrentAudioTrack() {
    if (!currentAudioBook) return;
    let url = '';
    let filename = '';
    if (currentAudioBook.tracks && currentAudioBook.tracks[currentTrackIndex]) {
      url = currentAudioBook.tracks[currentTrackIndex].url;
      filename = `${currentAudioBook.title} - ${currentAudioBook.tracks[currentTrackIndex].title}.m4a`;
    } else {
      url = currentAudioBook.audioUrl;
      filename = `${currentAudioBook.title}.m4a`;
    }
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Iniciando descarga del audiolibro...', 'success');
    }
  }

  function downloadCurrentAudioTrackDirect(book) {
    const target = book || state.currentBook || currentAudioBook;
    if (!target) return;
    let url = '';
    let filename = '';
    if (target.tracks && target.tracks[0]) {
      url = target.tracks[0].url;
      filename = `${target.title} - ${target.tracks[0].title}.m4a`;
    } else {
      url = target.audioUrl;
      filename = `${target.title}.m4a`;
    }
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Iniciando descarga del audiolibro...', 'success');
    }
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
  window.openRequestSheet = openRequestSheet;
  window.closeRequestSheet = closeRequestSheet;
  window.loadMoreBooks = loadMoreBooks;
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
  window.openAudioPlayer = openAudioPlayer;
  window.closeAudioPlayer = closeAudioPlayer;
  window.toggleAudioPlay = toggleAudioPlay;
  window.audioSkip = audioSkip;
  window.audioPrevTrack = audioPrevTrack;
  window.audioNextTrack = audioNextTrack;
  window.onAudioTrackSelected = onAudioTrackSelected;
  window.onAudioSeek = onAudioSeek;
  window.setAudioSpeed = setAudioSpeed;
  window.downloadCurrentAudioTrack = downloadCurrentAudioTrack;
  window.downloadCurrentAudioTrackDirect = downloadCurrentAudioTrackDirect;

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
