// ========================================================
//  BIBLIOTYAN — Motor de Aplicación
//  Gestión de Libros, Diagnóstico de Géneros y Peticiones (10h)
//  Estética: Editorial Minimalista (Obsidian Violeta)
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
    requests: []
  };

  // Fallback visual sobrio para portadas que garantiza que nunca se repita otra portada
  window.handleCoverError = function(img, title) {
    img.onerror = null;
    const initial = (title || 'B').charAt(0).toUpperCase();
    img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='420' viewBox='0 0 300 420'><rect width='100%' height='100%' fill='%23120b1e'/><rect x='10' y='10' width='280' height='400' fill='none' stroke='%239333ea' stroke-width='2' stroke-opacity='0.4'/><circle cx='150' cy='180' r='45' fill='%23180f27' stroke='%23b469fc' stroke-width='2'/><text x='150' y='192' font-family='sans-serif' font-size='32' fill='%23b469fc' font-weight='bold' text-anchor='middle'>" + initial + "</text><text x='150' y='260' font-family='sans-serif' font-size='14' fill='%23e9d5ff' text-anchor='middle'>BIBLIOTYAN</text><text x='150' y='285' font-family='sans-serif' font-size='11' fill='%23a855f7' text-anchor='middle'>Edici%C3%B3n Digital</text></svg>";
  };

  // ======================================================== INICIALIZACIÓN ═══════
    // ======================================================== SISTEMA DE ENLACES PROFUNDOS Y COMPARTIR ═══════
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
    const shareText = `Lee y descarga "${book.title}" de ${book.author} en la Biblioteca Digital BIBLIOTYAN:`;

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
        showToast('¡Enlace Copiado!', `El enlace de "${title}" está en tu portapapeles listo para enviar.`);
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

  function shareViaWhatsApp(bookOverride) {
    const book = bookOverride || state.currentBook;
    if (!book) return;
    const shareUrl = getBookShareUrl(book);
    const catText = book.category ? ` [${book.category}]` : '';
    const pagesText = book.pages ? ` · 📖 ${book.pages} págs.` : '';
    let synopsisSnippet = '';
    if (book.synopsis) {
      synopsisSnippet = `\n\n"${book.synopsis.slice(0, 140).trim()}..."`;
    }
    const msg = `📚 *${book.title}*\n✍️ ${book.author}${catText}${pagesText}${synopsisSnippet}\n\n📥 *Léelo y descárgalo libremente en BIBLIOTYAN:*\n${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  function handleInitialUrlBook() {
    const params = new URLSearchParams(window.location.search);
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
    } else if (window.location.hash && window.location.hash.startsWith('#libro-')) {
      const hashId = parseInt(window.location.hash.replace('#libro-', ''), 10);
      targetBook = BOOKS.find(b => b.id === hashId);
    }

    if (targetBook) {
      setTimeout(() => {
        openPreviewModal(targetBook, false);
        showToast('Libro Seleccionado', `Mostrando "${targetBook.title}"`);
        const catalog = document.getElementById('catalogo');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }
  }

  function init() {
    setupNavbar();
    setupThemeToggle();
    setupHeroQuote();
    setupSearchBar();
    renderFilterButtons();
    renderBooks();
    renderSocialLinks();
    renderWhyReadSection();
    renderDailyQuote();
    renderFooter();
    initRequestsSystem();
    setupSecretAdminAccess();
    setupMobileBottomNav();
    updateStats();
    handleInitialUrlBook();
  }

  // ======================================================== NAVBAR ═══════
  function setupNavbar() {
    const navbar = document.querySelector('.navbar');
    const brandName = document.querySelector('.brand-name');
    if (brandName) brandName.textContent = CONFIG.libraryName;

    // Enlaces de redes sociales en la barra superior
    const navSocial = document.querySelector('.nav-social-links');
    if (navSocial) {
      navSocial.innerHTML = '';
      Object.entries(CONFIG.socialMedia).forEach(([key, social]) => {
        if (!social.active) return;
        const a = document.createElement('a');
        a.href = social.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'nav-social-link';
        a.innerHTML = `<i class="${social.icon}"></i>`;
        a.title = social.label;
        navSocial.appendChild(a);
      });
    }

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ======================================================== TEMA (OSCURO / CLARO MINIMALISTA) ═══════
  function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const saved = localStorage.getItem('bibliotyan-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(btn, saved);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bibliotyan-theme', next);
      updateThemeIcon(btn, next);
    });
  }

  function updateThemeIcon(btn, theme) {
    btn.innerHTML = theme === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }

  // ======================================================== HERO: CITA ROTATIVA SOBRIA ═══════
  function setupHeroQuote() {
    const el = document.getElementById('heroQuote');
    if (!el) return;
    let index = Math.floor(Math.random() * QUOTES.length);

    function showQuote() {
      const q = QUOTES[index];
      el.style.opacity = '0';
      setTimeout(() => {
        el.innerHTML = `"${q.text}" <span class="quote-author">— ${q.author}</span>`;
        el.style.opacity = '1';
      }, 400);
      index = (index + 1) % QUOTES.length;
    }

    showQuote();
    setInterval(showQuote, 9000);
  }

  // ======================================================== BÚSQUEDA EN TIEMPO REAL ═══════
  function setupSearchBar() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderBooks();
    });
  }

  // ======================================================== FILTROS DE GÉNERO ═══════
  function renderFilterButtons() {
    const bar = document.getElementById('filterBar');
    if (!bar) return;
    bar.innerHTML = '';

    CONFIG.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `filter-btn ${cat === state.currentFilter ? 'active' : ''}`;
      let labelHtml = cat;
      if (cat === 'Todos') labelHtml = '<i class="fa-solid fa-border-all"></i> Todos';
      else if (cat === 'HARVARD LIBROS') labelHtml = '<i class="fa-solid fa-building-columns"></i> HARVARD LIBROS';
      else if (cat === 'National Geographic') labelHtml = '<i class="fa-solid fa-earth-americas"></i> National Geographic';
      btn.innerHTML = labelHtml;
      btn.addEventListener('click', () => {
        state.currentFilter = cat;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderBooks();
      });
      bar.appendChild(btn);
    });
  }

  // ======================================================== RENDERIZADO DEL CATÁLOGO ═══════
  function renderBooks() {
    const grid = document.getElementById('booksGrid');
    const countEl = document.getElementById('resultsCount');
    if (!grid) return;

    let filtered = BOOKS.filter(book => {
      const matchesCategory = state.currentFilter === 'Todos' ||
        book.category === state.currentFilter ||
        (state.currentFilter === 'National Geographic' && (book.collection === 'National Geographic' || book.category === 'National Geographic')) ||
        (state.currentFilter === 'E-Books (EPUB)' && (book.format === 'epub' || book.format === 'dual' || !!book.epub));
      const matchesSearch = !state.searchQuery ||
        book.title.toLowerCase().includes(state.searchQuery) ||
        book.author.toLowerCase().includes(state.searchQuery) ||
        book.category.toLowerCase().includes(state.searchQuery) ||
        (book.collection && book.collection.toLowerCase().includes(state.searchQuery)) ||
        book.description.toLowerCase().includes(state.searchQuery) ||
        (book.aiAnalysis && book.aiAnalysis.keyConcepts && book.aiAnalysis.keyConcepts.some(k => k.toLowerCase().includes(state.searchQuery)));
      return matchesCategory && matchesSearch;
    });

    const sortSelect = document.getElementById('sortSelect');
    const sortBy = sortSelect ? sortSelect.value : 'recent';
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

    if (countEl) {
      countEl.textContent = `${filtered.length} título${filtered.length !== 1 ? 's' : ''} en ${state.currentFilter}`;
    }

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4.5rem 1rem; color: var(--text-muted)">
          <i class="fa-solid fa-book-open" style="font-size: 3rem; color: var(--accent-light); margin-bottom: 1.2rem; display: block;"></i>
          <h3 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.35rem">No se encontraron libros</h3>
          <p style="max-width: 480px; margin: 0 auto; line-height: 1.55;">
            Si el título que buscas no figura en nuestro catálogo, puedes pedirlo en la sección de
            <a href="#pedidos" style="color: var(--accent-light); font-weight: 500; text-decoration: underline;">Solicitudes Express</a> y lo subiremos en máximo 10 horas.
          </p>
        </div>
      `;
      return;
    }

    filtered.forEach((book) => {
      const card = document.createElement('div');
      card.className = 'book-card';

      const analysis = book.aiAnalysis || AIClassifier.analyze(book);
      const catColor = CONFIG.categoryColors[book.category] || '#9333ea';

      let formatBadgeHtml = '';
      if (book.format === 'dual' || (book.pdf && book.epub)) {
        formatBadgeHtml = '<span class="format-badge dual-badge" title="Disponible en PDF y EPUB"><i class="fa-solid fa-layer-group"></i> PDF + EPUB</span>';
      } else if (book.format === 'epub' || (!book.pdf && book.epub)) {
        formatBadgeHtml = '<span class="format-badge epub-badge" title="E-Book digital"><i class="fa-solid fa-book-open-reader"></i> EPUB</span>';
      } else {
        formatBadgeHtml = '<span class="format-badge" title="Documento digital"><i class="fa-solid fa-file-pdf"></i> PDF</span>';
      }

      card.innerHTML = `
        <div class="card-cover">
          <div class="card-ai-badge">
            <i class="fa-solid fa-brain"></i> Análisis IA
          </div>
          <img src="${book.cover}" alt="${book.title}" loading="lazy" onerror="handleCoverError(this, '${(book.title || '').replace(/'/g, "\\'")}')">
          <div class="cover-overlay">
            ${book.pdf ? `
              <button class="btn-cover-action btn-preview-primary" onclick="event.stopPropagation(); openFullscreenReader(BOOKS.find(b => b.id === ${book.id}))">
                <i class="fa-solid fa-book-open"></i> Leer en Pantalla
              </button>
            ` : `
              <button class="btn-cover-action btn-preview-primary" onclick="event.stopPropagation(); openPreviewModal(BOOKS.find(b => b.id === ${book.id}))">
                <i class="fa-solid fa-book-open-reader"></i> Vista EPUB
              </button>
            `}
            <button class="btn-cover-action btn-preview-secondary" onclick="event.stopPropagation(); openPreviewModal(BOOKS.find(b => b.id === ${book.id}))">
              <i class="fa-solid fa-circle-info"></i> Ficha y Vista Previa
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="card-tags-row">
            <span class="card-category" style="background: ${catColor}24; color: ${catColor}; border: 1px solid ${catColor}44;">${book.category}</span>
            ${formatBadgeHtml}
            <button class="card-share-btn" title="Compartir enlace de este libro" onclick="event.stopPropagation(); shareBookDirect(${book.id})">
              <i class="fa-solid fa-share-nodes"></i>
            </button>
          </div>
          <h3 class="card-title">${book.title}</h3>
          <p class="card-author">${book.author}</p>
          <div class="card-ai-vibe">
            <i class="fa-solid fa-compass"></i>
            <span>${analysis.vibe || 'Selección Editorial'}</span>
          </div>
          <div class="card-meta">
            <span title="Extensión del ejemplar"><i class="fa-solid fa-file-lines"></i> ${book.pages || 220} págs.</span>
            <span class="card-downloads">
              <i class="fa-solid fa-download"></i> ${book.downloads}
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openPreviewModal(book));
      const pBtn = card.querySelector('.preview-btn');
      if (pBtn) pBtn.addEventListener('click', () => openPreviewModal(book));

      grid.appendChild(card);
    });
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.addEventListener('change', () => renderBooks());

  // ======================================================== MODAL VISTA PREVIA Y DIAGNÓSTICO IA ═══════
  function openPreviewModal(book, updateUrl = true) {
    if (!book) return;
    state.currentBook = book;
    if (updateUrl) {
      try {
        const shareUrl = getBookShareUrl(book);
        window.history.replaceState({ bookId: book.id }, book.title, shareUrl);
      } catch (e) {}
    }
    state.currentBook = book;
    const modal = document.getElementById('previewModal');
    const catColor = CONFIG.categoryColors[book.category] || '#9333ea';
    const analysis = book.aiAnalysis || AIClassifier.analyze(book);

    document.getElementById('previewCover').innerHTML = `
      <img src="${book.cover}" alt="${book.title}" onerror="handleCoverError(this, '${(book.title || '').replace(/'/g, "\\'")}')">
    `;

    const catEl = document.getElementById('previewCategory');
    if (catEl) {
      catEl.textContent = book.category;
      catEl.style.background = catColor + '24';
      catEl.style.color = catColor;
      catEl.style.borderColor = catColor + '55';
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
      aiTargetEl.textContent = analysis.targetAudience || 'Lectores que valoran el desarrollo intelectual.';
    }

    // ── Lector / Ficha de Acceso al Documento ──
    const pdfFrame = document.getElementById('previewPdfFrame');
    const epubPlaceholder = document.getElementById('epubPreviewPlaceholder');
    const btnExpand = document.getElementById('btnExpandReader');

    const isMobile = window.innerWidth <= 768;
    const isExternalUrl = book.pdf && book.pdf.startsWith('http');

    if (book.pdf) {
      if (isMobile || isExternalUrl) {
        if (pdfFrame) {
          pdfFrame.style.display = 'none';
          pdfFrame.src = '';
        }
        if (epubPlaceholder) {
          epubPlaceholder.style.display = 'block';
          epubPlaceholder.innerHTML = `
            <div class="reading-access-card">
              <div class="reading-access-badge">
                <i class="fa-solid fa-file-pdf"></i>
                <span>Edición Digital en Alta Calidad</span>
              </div>
              <p class="reading-access-desc">
                Ejemplar con maquetación completa y texto optimizado para visualización en pantalla, lectores electrónicos y dispositivos móviles.
              </p>
              <div class="reading-access-actions">
                <button class="btn-read-online" onclick="openFullscreenReader()">
                  <i class="fa-solid fa-book-open"></i> Visualizar Ejemplar
                </button>
              </div>
            </div>
          `;
        }
      } else {
        if (pdfFrame) {
          pdfFrame.style.display = 'block';
          pdfFrame.src = book.pdf;
        }
        if (epubPlaceholder) {
          epubPlaceholder.style.display = 'none';
        }
      }
      if (btnExpand) {
        btnExpand.style.display = 'inline-flex';
      }
    } else {
      if (pdfFrame) {
        pdfFrame.style.display = 'none';
        pdfFrame.src = '';
      }
      if (btnExpand) {
        btnExpand.style.display = 'none';
      }
      if (epubPlaceholder) {
        epubPlaceholder.style.display = 'block';
        epubPlaceholder.innerHTML = `
          <div class="pdf-loading" style="padding: 2.4rem 1.2rem; text-align: center;">
            <i class="fa-solid fa-book-open-reader" style="font-size: 2.8rem; color: #10b981; margin-bottom: 0.8rem; display: block;"></i>
            <strong style="color: var(--text-primary); font-size: 1.05rem; display: block; margin-bottom: 0.3rem;">Libro Digital en Formato EPUB</strong>
            <span style="color: var(--text-secondary); font-size: 0.85rem; max-width: 320px; line-height: 1.5; display: inline-block;">Optimizado para lectura en lectores de tinta electrónica (Kindle, Kobo), Apple Books, tabletas y teléfonos móviles.</span>
          </div>
        `;
      }
    }

    // Botones de descarga según formato
    const dlContainer = document.getElementById('previewDownloadContainer');
    if (dlContainer) {
      if (book.format === 'dual' || (book.pdf && book.epub)) {
        dlContainer.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-top: 1.2rem;">
            <button class="btn-download-action" style="margin-top: 0;" onclick="openSocialModal('pdf')">
              <i class="fa-solid fa-file-pdf"></i> Descargar PDF
            </button>
            <button class="btn-download-action" style="margin-top: 0; background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-color: rgba(16, 185, 129, 0.4);" onclick="openSocialModal('epub')">
              <i class="fa-solid fa-book-open-reader"></i> Descargar EPUB
            </button>
          </div>
        `;
      } else if (book.format === 'epub' || (!book.pdf && book.epub)) {
        dlContainer.innerHTML = `
          <button class="btn-download-action" style="margin-top: 1.2rem; background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-color: rgba(16, 185, 129, 0.4);" onclick="openSocialModal('epub')">
            <i class="fa-solid fa-book-open-reader"></i> Descargar Ejemplar Completo (EPUB)
          </button>
        `;
      } else {
        dlContainer.innerHTML = `
          <button class="btn-download-action" style="margin-top: 1.2rem;" onclick="openSocialModal('pdf')">
            <i class="fa-solid fa-file-pdf"></i> Descargar Ejemplar Completo (PDF)
          </button>
        `;
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    if (modal) modal.classList.remove('active');
    const pdfFrame = document.getElementById('previewPdfFrame');
    if (pdfFrame) pdfFrame.src = '';
    document.body.style.overflow = '';
    try {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } catch (e) {}
  }

  // ======================================================== LECTOR EN PANTALLA COMPLETA EN LA MISMA PÁGINA ═══════
  function openFullscreenReader(book) {
    const target = book || state.currentBook;
    if (!target) return;
    state.currentBook = target;

    // Si es un enlace CDN externo o estamos en móvil, abrir directamente en nueva pestaña para lectura nativa limpia
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

  // ======================================================== MODAL DE DESCARGA / REDES SOCIALES ═══════
  function openSocialModal(format) {
    closePreviewModal();
    closeFullscreenReader();

    state.selectedFormat = format || (state.currentBook && state.currentBook.epub && !state.currentBook.pdf ? 'epub' : 'pdf');

    const modal = document.getElementById('socialModal');
    const container = document.getElementById('socialButtonsContainer');
    container.innerHTML = '';

    Object.entries(CONFIG.socialMedia).forEach(([key, social]) => {
      if (!social.active) return;
      const a = document.createElement('a');
      a.href = social.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'social-follow-btn';
      a.style.background = social.color;
      a.innerHTML = `<i class="${social.icon}"></i> ${social.label}`;
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
    handleInitialUrlBook();

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

  // ======================================================== MODAL QR DE SOLICITUD (10 HORAS) ═══════
  function openQrModal(ticketId, bookTitle) {
    const modal = document.getElementById('qrModal');
    if (!modal) return;

    const titleEl = document.getElementById('qrTicketId');
    const bookEl = document.getElementById('qrBookTitle');
    const qrImg = document.getElementById('qrCodeImage');

    if (titleEl) titleEl.textContent = `Ticket #${ticketId}`;
    if (bookEl) bookEl.textContent = `«${bookTitle}»`;

    // Código QR apuntando a la invitación de Telegram/Comunidad
    const encodedUrl = encodeURIComponent(CONFIG.communityInviteUrl || "https://t.me/+OhqKLNF35gY1Mjkx");
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

  // ======================================================== SISTEMA DE PETICIONES (ENTREGA EN 10 HORAS) ═══════
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
    const readyAt = now + (CONFIG.deliveryHours * 3600 * 1000); // 10 horas exactas
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

    // Limpiar formulario
    titleInput.value = '';
    authorInput.value = '';
    contactInput.value = '';
    if (noteInput) noteInput.value = '';

    renderRequestsList();

    // Mostrar modal con código QR e instrucciones para seguir la entrega
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

  // ======================================================== ACCESO ADMIN OCULTO (Ctrl + Shift + A o Triple Click) ═══════
  function setupSecretAdminAccess() {
    // 1. Atajo de teclado: Ctrl + Shift + A
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = 'admin.html';
      }
    });

    // 2. Triple clic en el texto de derechos del footer
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

  // ======================================================== INSPECTOR IA DE LIBROS ═══════
  window.openAiInspector = function(bookId) {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return;
    openPreviewModal(book);
  };

  // ======================================================== NOTIFICACIÓN TOAST ═══════
  function showToast(title, message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastTitle = toast.querySelector('.toast-text strong');
    const toastMsg = toast.querySelector('.toast-text span');
    toastTitle.textContent = title;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3800);
  }

  // ======================================================== REDES SOCIALES FOOTER ═══════
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
        a.innerHTML = `<i class="${social.icon}"></i>`;
        a.title = social.label;
        footerSocial.appendChild(a);
      });
    }
  }

  // ======================================================== SECCIÓN BENEFICIOS DE LA LECTURA ═══════
  function renderWhyReadSection() {
    const grid = document.querySelector('.why-read-grid');
    if (!grid) return;

    const reasons = [
      {
        icon: 'fa-solid fa-brain',
        title: 'Neuroplasticidad y Reserva Cognitiva',
        text: 'La lectura activa estimula redes neuronales complejas, fortaleciendo la memoria de trabajo y desacelerando el declive cognitivo.'
      },
      {
        icon: 'fa-solid fa-compass',
        title: 'Expansión de Criterio',
        text: 'Sumergirse en textos rigurosos permite asimilar modelos mentales diversos y contrastar perspectivas con profundidad.'
      },
      {
        icon: 'fa-solid fa-bullseye',
        title: 'Enfoque y Atención Sostenida',
        text: 'Contrarresta la dispersión de estímulos inmediatos, cultivando la capacidad de análisis prolongado y pensamiento crítico.'
      },
      {
        icon: 'fa-solid fa-shield-heart',
        title: 'Regulación del Sistema Nervioso',
        text: 'Estudios confirman que periodos breves de lectura concentrada reducen pulsaciones y niveles de cortisol fisiológico.'
      }
    ];

    grid.innerHTML = reasons.map(r => `
      <div class="why-card">
        <div class="why-icon"><i class="${r.icon}"></i></div>
        <h3>${r.title}</h3>
        <p>${r.text}</p>
      </div>
    `).join('');
  }

  // ======================================================== CITA DEL DÍA ═══════
  function renderDailyQuote() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const quote = QUOTES[dayOfYear % QUOTES.length];

    const textEl = document.getElementById('dailyQuoteText');
    const authorEl = document.getElementById('dailyQuoteAuthor');
    if (textEl) textEl.textContent = `"${quote.text}"`;
    if (authorEl) authorEl.textContent = `— ${quote.author}`;
  }

  function renderFooter() {
    const yearEl = document.querySelector('.footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ======================================================== NAVEGACIÓN MÓVIL INFERIOR ═══════
  function setupMobileBottomNav() {
    const bottomNav = document.getElementById('mobileBottomNav');
    if (!bottomNav) return;

    const navItems = bottomNav.querySelectorAll('.mobile-nav-item');
    const searchTrigger = document.getElementById('mobileSearchTrigger');
    const searchInput = document.getElementById('searchInput');

    if (searchTrigger && searchInput) {
      searchTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    const sections = [
      { id: 'catalog', el: document.getElementById('catalog') },
      { id: 'pedidos', el: document.getElementById('pedidos') },
      { id: 'beneficios', el: document.getElementById('beneficios') }
    ];

    function updateActiveTab() {
      const scrollPos = window.scrollY + 220;
      let activeTarget = 'top';

      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s.el && scrollPos >= s.el.offsetTop) {
          activeTarget = s.id;
          break;
        }
      }

      navItems.forEach(item => {
        const target = item.getAttribute('data-target');
        if (target === activeTarget) {
          item.classList.add('active');
        } else if (target) {
          item.classList.remove('active');
        }
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

  init();

  // Exponer métodos globales para compartir y acceso externo
  window.shareCurrentBook = shareCurrentBook;
  window.shareBookDirect = shareBookDirect;
  window.shareViaWhatsApp = shareViaWhatsApp;
  window.getBookShareUrl = getBookShareUrl;
  window.openPreviewModal = openPreviewModal;
  window.closePreviewModal = closePreviewModal;

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.bookId) {
      const book = BOOKS.find(b => b.id === e.state.bookId);
      if (book) openPreviewModal(book, false);
    } else {
      closePreviewModal();
    }
  });

});