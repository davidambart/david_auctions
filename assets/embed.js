(() => {
  const scriptUrl = document.currentScript?.src || 'https://davidambart.github.io/david_auctions/assets/embed.js';
  const baseUrl = new URL('../', scriptUrl);
  if (!document.querySelector('link[data-auction-archive-fonts]')) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500;600&display=swap';
    fontLink.dataset.auctionArchiveFonts = '';
    document.head.appendChild(fontLink);
  }

  const usdPerEuro = {
    '2018-05-17': 1.1805,
    '2018-05-24': 1.1728,
    '2018-05-31': 1.1699,
    '2018-06-07': 1.1836,
    '2018-06-14': 1.173,
    '2018-06-21': 1.1538,
    '2018-07-19': 1.1588,
    '2018-08-02': 1.1617,
    '2018-08-09': 1.1593,
    '2020-06-05': 1.133
  };

  const styles = `
    @font-face{font-family:"Cormorant Garamond";font-style:normal;font-weight:400;font-display:swap;src:url("https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtKky2F7g.woff2") format("woff2")}
    @font-face{font-family:"Cormorant Garamond";font-style:normal;font-weight:500;font-display:swap;src:url("https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtKky2F7g.woff2") format("woff2")}
    :host{--ink:#111;--muted:#777;--line:#ddd;--paper:#fff;--pad:clamp(20px,4cqw,64px);display:block;width:100%;container-type:inline-size;color:var(--ink);background:var(--paper);font:14px Inter,Arial,sans-serif}
    *{box-sizing:border-box}
    [hidden]{display:none!important}
    .shell{padding:0 0 90px}
    .archive-loading{min-height:clamp(150px,18cqw,250px);display:grid;place-items:center}
    .archive-spinner{width:34px;aspect-ratio:1;border:1.5px solid rgba(94,153,149,.28);border-top-color:#19575c;border-radius:50%;animation:archiveSpin .78s linear infinite}
    .star-loader{display:none;pointer-events:none}
    :host(.da-theme-dark) .archive-loading>.star-loader.is-ready{display:block;width:clamp(104px,14cqw,156px);aspect-ratio:1}
    :host(.da-theme-dark) .archive-loading>.star-loader.is-ready+.archive-spinner{display:none}
    .visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    @keyframes archiveSpin{to{transform:rotate(360deg)}}
    .intro{display:block;padding:0;max-width:none}
    .intro .eyebrow,.intro h1,.intro .description{display:none}
    .eyebrow,.count{text-transform:uppercase;letter-spacing:.17em;font-size:13px;line-height:1.45}
    h1{font:400 clamp(58px,10cqw,140px)/.82 "Cormorant Garamond",Georgia,serif;margin:20px 0 35px;letter-spacing:-.045em}
    .description{font:400 14px/1.5 Inter,Arial,sans-serif;max-width:680px;margin:0}
    .count{margin:0 0 10px;color:var(--muted)}
    .controls{position:sticky;top:0;z-index:5;background:rgba(255,255,255,.94);backdrop-filter:blur(12px);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:15px 0;display:flex;align-items:end;gap:18px;margin-bottom:60px}
    .controls label{display:grid;gap:8px;text-transform:uppercase;letter-spacing:.12em;font-size:11px}
    .controls input,.controls select{border:0;border-bottom:1px solid var(--ink);background:transparent;border-radius:0;padding:8px 2px;color:var(--ink);font:400 14px/1.3 Inter,Arial,sans-serif;min-width:185px}
    .controls select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23111' stroke-width='1.5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 3px center;background-size:12px 7px;padding-right:22px}
    .select-controls{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:end;gap:18px}
    .reset{margin-left:auto;background:transparent;border:0;color:var(--ink);text-transform:uppercase;letter-spacing:.12em;font-size:11px;cursor:pointer;padding:10px}
    .archive{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(65px,8cqw,125px) clamp(24px,4cqw,64px)}
    .artwork{min-width:0;content-visibility:auto;contain-intrinsic-size:620px}
    .image-button{position:relative;display:block;width:100%;padding:0;border:0;background:#f4f4f2;cursor:zoom-in;aspect-ratio:1/1;overflow:hidden}
    :host(.da-theme-dark) .image-button.is-loading>.star-loader.is-ready{position:absolute;z-index:1;top:50%;left:50%;display:block;width:clamp(84px,24%,126px);aspect-ratio:1;transform:translate(-50%,-50%)}
    :host(.da-theme-dark) .image-button.is-loading>img{opacity:0}
    .image-button img{display:block;width:100%;height:100%;object-fit:contain;transition:transform .6s ease}
    .image-button:hover img{transform:scale(1.015)}
    .meta{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:clamp(16px,2.5cqw,30px);padding-top:18px;border-top:1px solid var(--line);margin-top:18px}
    .artwork.is-reveal-pending .image-button:not(.is-loading),.artwork.is-reveal-pending .meta{opacity:0;transform:translateY(14px)}
    .artwork.is-revealed .image-button,.artwork.is-revealed .meta{animation:artworkReveal .72s cubic-bezier(.22,1,.36,1) var(--card-reveal-delay,0ms) both}
    @keyframes artworkReveal{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    .meta>div,.meta dl{min-width:0}
    .meta h2{font:500 clamp(27px,3cqw,42px)/1 "Cormorant Garamond",Georgia,serif;margin:0;overflow-wrap:anywhere}
    .year{margin:8px 0 0;color:var(--muted)}
    dl{width:100%;margin:0;min-width:0}
    dl div{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:start;gap:clamp(8px,1.5cqw,20px);padding:2px 0 5px}
    dt{min-width:0;text-transform:uppercase;letter-spacing:.12em;font-size:8px;line-height:1.35;color:var(--muted);overflow-wrap:anywhere}
    dd{min-width:0;margin:0;font-size:11px;line-height:1.35;text-align:right;overflow-wrap:anywhere}
    .charity-row dd{line-height:1.45}
    .empty{text-align:center;padding:80px 0;color:var(--muted)}
    dialog{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#111;color:#fff;overflow:hidden;touch-action:pan-y}
    dialog::backdrop{background:#111}
    .viewer-content{width:100%;height:100%;margin:0;display:grid;grid-template-rows:minmax(0,1fr) 62px}
    .viewer-frame{position:relative;min-width:0;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .viewer-frame.is-loading::after{content:"";position:absolute;width:34px;aspect-ratio:1;border:1.5px solid rgba(255,255,255,.28);border-top-color:#fff;border-radius:50%;animation:archiveSpin .78s linear infinite}
    :host(.da-theme-dark) .viewer-frame.has-star-loader.is-loading::after{display:none}
    :host(.da-theme-dark) .viewer-frame.is-loading>.star-loader.is-ready{position:absolute;z-index:1;top:50%;left:50%;display:block;width:clamp(118px,19vw,220px);aspect-ratio:1;transform:translate(-50%,-50%)}
    .viewer-frame img{display:block;width:100%;height:100%;max-width:100vw;max-height:calc(100vh - 62px);max-height:calc(100dvh - 62px);object-fit:contain;object-position:center;user-select:none;-webkit-user-drag:none}
    .viewer-frame.is-loading img{visibility:hidden}
    .viewer-caption{height:62px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 24px}
    .viewer-caption p{grid-column:2;margin:0;font:400 22px "Cormorant Garamond",Georgia,serif;text-align:center}
    .image-counter{grid-column:3;justify-self:end;font-size:10px;letter-spacing:.14em;color:#bbb}
    .close{position:fixed;right:20px;top:15px;z-index:3;border:0;background:rgba(0,0,0,.55);color:#fff;width:42px;height:42px;border-radius:50%;font-size:28px;line-height:1;cursor:pointer;padding:0}
    .gallery-nav{position:fixed;z-index:2;top:50%;transform:translateY(-50%);width:56px;height:76px;border:0;background:rgba(0,0,0,.3);color:#fff;font:300 54px/1 Georgia,serif;cursor:pointer;display:grid;place-items:center;padding:0}
    .gallery-nav:hover{background:rgba(0,0,0,.55)}
    .previous{left:14px}.next{right:14px}
    .slide-left{animation:slideLeft .24s ease}.slide-right{animation:slideRight .24s ease}
    @keyframes slideLeft{from{opacity:.35;transform:translateX(18px)}to{opacity:1;transform:none}}
    @keyframes slideRight{from{opacity:.35;transform:translateX(-18px)}to{opacity:1;transform:none}}
    @media(max-width:1100px) and (min-width:761px){.archive{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:760px){
      .archive{grid-template-columns:1fr}
      .controls{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"search reset" "selects selects";align-items:end;gap:9px 14px;padding:9px 0 10px;margin-bottom:34px}
      .controls>label{grid-area:search;width:auto;min-width:0}
      .controls .select-controls{grid-area:selects;width:100%;gap:12px}
      .controls>button{grid-area:reset;align-self:end;margin:0 0 1px;padding:6px 2px 7px}
      .controls label{gap:3px;flex:1;font-size:9px;letter-spacing:.1em}
      .controls input,.controls select{width:100%;min-width:0;min-height:32px;padding:4px 1px;font-size:13px;line-height:1.2}
      .select-controls label{flex:1;min-width:0}
      h1{font-size:70px}.meta{grid-template-columns:minmax(0,50%) minmax(0,50%);gap:0;padding-top:20px}.meta dl{width:100%;max-width:none;min-width:0}.meta dl>div{display:grid;grid-template-columns:minmax(0,35%) minmax(0,1fr);align-items:start;gap:clamp(4px,1cqw,8px);padding:2px 0 7px}.meta dt{font-size:10px;line-height:1.35;padding-top:2px;white-space:nowrap;text-align:left}.meta dd{min-width:0;font-size:13px;line-height:1.35;text-align:right;overflow-wrap:anywhere}.meta h2{font-size:38px}.year{font-size:17px}
      .gallery-nav{width:44px;height:62px;font-size:44px;background:rgba(0,0,0,.18)}.previous{left:4px}.next{right:4px}.viewer-caption{padding:0 14px}.viewer-caption p{font-size:19px}.image-counter{font-size:9px}.close{right:10px;top:10px}
    }
    @media(max-width:430px){.meta{grid-template-columns:minmax(0,50%) minmax(0,50%)}.meta dl>div{gap:4px}.meta dt{font-size:9px}.meta dd{font-size:12px}.meta dl>div:first-child{grid-template-columns:58px minmax(0,1fr)!important;column-gap:6px!important}.meta dl>div:first-child dd{white-space:nowrap!important;overflow-wrap:normal!important;word-break:normal!important}}
    @media(max-width:760px) and (orientation:landscape){
      .archive{grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(28px,6cqw,42px) clamp(16px,3cqw,24px)}
      .meta{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:clamp(16px,2.5cqw,30px);padding-top:18px;margin-top:18px}
      .meta h2{font:500 clamp(27px,3cqw,42px)/1 "Cormorant Garamond",Georgia,serif;margin:0}
      .year{margin:8px 0 0}
      .meta dl{margin:0;width:100%;max-width:none;min-width:0}
      .meta dl>div{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:start;gap:clamp(8px,1.5cqw,20px);padding:2px 0 5px}
      .meta dt{font-size:8px;line-height:1.35;padding-top:0;white-space:normal;text-align:left}
      .meta dd{min-width:0;font-size:11px;line-height:1.35;text-align:right;overflow-wrap:anywhere}
    }
    @media(prefers-reduced-motion:reduce){.image-button img{transition:none}.viewer-frame img,.archive-spinner,.artwork.is-revealed .image-button,.artwork.is-revealed .meta{animation:none!important}.artwork.is-reveal-pending .image-button:not(.is-loading),.artwork.is-reveal-pending .meta{opacity:1;transform:none}}
  `;

  function parseCSV(text) {
    const rows = [];
    let row = [], field = '', quoted = false;
    text = text.replace(/^\uFEFF/, '');
    for (let i = 0; i < text.length; i++) {
      const char = text[i], next = text[i + 1];
      if (quoted) {
        if (char === '"' && next === '"') { field += '"'; i++; }
        else if (char === '"') quoted = false;
        else field += char;
      } else if (char === '"') quoted = true;
      else if (char === ',') { row.push(field); field = ''; }
      else if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (char !== '\r') field += char;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    const headers = rows.shift() || [];
    return rows.filter(values => values.some(value => value !== '')).map(values =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
    );
  }

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function bidValue(value = '') {
    return Number(String(value).replace(/[^0-9]/g, '')) || 0;
  }

  function resultInEuro(work) {
    const amount = bidValue(work.winningBid);
    if (!/\$|\bUSD\b/i.test(work.winningBid)) return amount;
    const rate = usdPerEuro[work.auctionEndISO];
    return rate ? Math.round(amount / rate * 100) / 100 : amount;
  }

  class StarMurmurationLoader {
    constructor(host) {
      this.host = host;
      this.entries = new Map();
      this.frame = 0;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.visibilityObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const state = this.entries.get(entry.target);
          if (state) state.visible = entry.isIntersecting;
        });
        this.schedule();
      }, {rootMargin: '120px'}) : null;
      this.resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(entries => {
        entries.forEach(entry => this.resize(this.entries.get(entry.target)));
        this.drawStatic();
      }) : null;
      this.onThemeChange = () => this.schedule();
      this.onMotionChange = () => this.schedule();
      this.onPageVisibilityChange = () => this.schedule();
      this.themeObserver = new MutationObserver(this.onThemeChange);
      this.themeObserver.observe(host, {attributes: true, attributeFilter: ['class']});
      this.reducedMotion.addEventListener?.('change', this.onMotionChange);
      document.addEventListener('visibilitychange', this.onPageVisibilityChange);
    }

    add(canvas, count) {
      if (!canvas || typeof canvas.getContext !== 'function') return false;
      let state = this.entries.get(canvas);
      if (!state) {
        const context = canvas.getContext('2d', {alpha: true});
        if (!context) return false;
        state = {
          canvas,
          context,
          count,
          stars: this.makeStars(count),
          visible: this.visibilityObserver ? false : true,
          width: 0,
          height: 0,
          pixelRatio: 1
        };
        this.entries.set(canvas, state);
        canvas.classList.add('is-ready');
        this.visibilityObserver?.observe(canvas);
        this.resizeObserver?.observe(canvas);
      }
      canvas.classList.add('is-ready');
      state.visible = this.isVisible(canvas);
      this.resize(state);
      this.schedule();
      return true;
    }

    remove(canvas) {
      const state = this.entries.get(canvas);
      if (!state) return;
      this.visibilityObserver?.unobserve(canvas);
      this.resizeObserver?.unobserve(canvas);
      this.entries.delete(canvas);
      canvas.classList.remove('is-ready');
      this.schedule();
    }

    removeWithin(container) {
      this.entries.forEach((state, canvas) => {
        if (container.contains(canvas)) this.remove(canvas);
      });
    }

    destroy() {
      cancelAnimationFrame(this.frame);
      this.entries.forEach((state, canvas) => this.remove(canvas));
      this.visibilityObserver?.disconnect();
      this.resizeObserver?.disconnect();
      this.themeObserver.disconnect();
      this.reducedMotion.removeEventListener?.('change', this.onMotionChange);
      document.removeEventListener('visibilitychange', this.onPageVisibilityChange);
    }

    makeStars(count) {
      return Array.from({length: count}, (_, index) => {
        const seed = (index * 0.61803398875) % 1;
        return {
          angle: (index / count) * Math.PI * 2,
          band: seed * Math.PI * 2,
          drift: 0.77 + ((index * 17) % 19) / 42,
          glow: 0.46 + ((index * 11) % 23) / 38,
          lane: (((index * 7) % 13) - 6) / 6,
          size: 0.38 + ((index * 29) % 31) / 28,
          sparkle: (index * 1.91) % (Math.PI * 2),
          tone: index % 11 === 0 ? 'warm' : index % 7 === 0 ? 'cool' : 'white'
        };
      });
    }

    resize(state) {
      if (!state) return;
      const rect = state.canvas.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (!width || !height) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      if (state.width === width && state.height === height && state.pixelRatio === pixelRatio) return;
      state.width = width;
      state.height = height;
      state.pixelRatio = pixelRatio;
      state.canvas.width = width * pixelRatio;
      state.canvas.height = height * pixelRatio;
      state.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    isDark() {
      return this.host.classList.contains('da-theme-dark');
    }

    hasVisibleEntries() {
      return [...this.entries.values()].some(state => state.visible && state.canvas.isConnected);
    }

    isVisible(canvas) {
      const rect = canvas.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    }

    schedule() {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      if (!this.isDark() || document.hidden || !this.hasVisibleEntries()) return;
      if (this.reducedMotion.matches) {
        this.drawStatic();
        return;
      }
      this.frame = requestAnimationFrame(time => this.render(time));
    }

    drawStatic() {
      if (!this.isDark()) return;
      this.entries.forEach(state => {
        if (state.visible) this.draw(state, 0);
      });
    }

    render(time) {
      this.frame = 0;
      if (!this.isDark() || document.hidden) return;
      this.entries.forEach(state => {
        if (state.visible && state.canvas.isConnected) this.draw(state, time * 0.001);
      });
      this.schedule();
    }

    draw(state, time) {
      this.resize(state);
      if (!state.width || !state.height) return;
      const {context, width, height, stars} = state;
      context.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height);
      const orbitRadius = scale * 0.31;
      stars.forEach(star => {
        const flockWave = Math.sin(time * 1.12 + star.band) * 0.22;
        const ripple = Math.sin(time * 1.94 + star.band * 2.7) * 0.09;
        const angle = star.angle + time * (0.96 + flockWave * 0.42) * star.drift;
        const radialBreath = Math.sin(time * 1.28 + star.band * 1.6) * scale * 0.038;
        const bandWidth = scale * (0.08 + Math.sin(time * 0.72 + star.band * 2.1) * 0.028);
        const freeLane = star.lane * bandWidth + radialBreath;
        const lane = freeLane < 0 ? freeLane * 0.52 : freeLane * 0.9;
        const rawWobble = Math.sin(angle * 3 + time * 1.38 + star.band) * scale * 0.023;
        const wobble = star.lane < 0 ? rawWobble * 0.34 : rawWobble;
        const x = centerX + Math.cos(angle + ripple) * (orbitRadius + lane + wobble);
        const y = centerY + Math.sin(angle + ripple) * (orbitRadius * 0.82 + lane * 0.82 + wobble * 0.46);
        const pulse = 0.72 + Math.sin(time * 2.2 + star.sparkle) * 0.24;
        const head = 0.42 + 0.58 * Math.max(0, Math.sin(angle - time * 0.85));
        const opacity = star.glow * pulse * (0.62 + head * 0.44);
        this.drawStar(context, x, y, Math.max(0.35, star.size * scale * 0.008 * (0.72 + head * 0.5)), opacity, star.tone);
      });
    }

    drawStar(context, x, y, radius, opacity, tone) {
      const color = tone === 'warm' ? '232,220,198' : tone === 'cool' ? '203,227,230' : '237,242,238';
      context.beginPath();
      context.fillStyle = `rgba(${color},${opacity})`;
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      if (radius > 0.78) {
        context.beginPath();
        context.fillStyle = `rgba(${color},${opacity * 0.19})`;
        context.arc(x, y, radius * 3.2, 0, Math.PI * 2);
        context.fill();
      }
    }
  }

  class AuctionArchive extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
      this.works = [];
      this.gallery = [];
      this.galleryIndex = 0;
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.previousBodyOverflow = '';
      this.galleryImageCache = new Map();
      this.galleryPreloadObserver = null;
      this.galleryRequest = 0;
      this.starLoader = null;
      this.cardRevealRun = 0;
      this.nextCardRevealAt = 0;
    }

    connectedCallback() {
      if (this.shadowRoot.children.length) return;
      this.renderShell();
      this.starLoader = new StarMurmurationLoader(this);
      this.starLoader.add(this.shadowRoot.querySelector('.archive-loader'), 148);
      this.bindEvents();
      this.load();
    }

    disconnectedCallback() {
      this.galleryPreloadObserver?.disconnect();
      this.starLoader?.destroy();
    }

    renderShell() {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <main class="shell" aria-busy="true">
          <header class="intro">
            <p class="eyebrow">Brushstrokes in Time</p>
            <h1>Auction Archive</h1>
            <p class="description">A chronological archive of miniature original paintings and their final auction results.</p>
            <p class="count" aria-live="polite"></p>
          </header>
          <div class="archive-loading" role="status" aria-live="polite">
            <canvas class="star-loader archive-loader" aria-hidden="true"></canvas>
            <span class="archive-spinner" aria-hidden="true"></span>
            <span class="visually-hidden">Loading auction archive</span>
          </div>
          <section class="controls" aria-label="Archive filters" hidden>
            <label>Search<input class="search" placeholder="Title or year" type="search"></label>
            <div class="select-controls">
              <label>Year<select class="year-select"><option value="all">All years</option></select></label>
              <label>Sort<select class="sort-select"><option value="latest">Latest auction</option><option value="earliest">Earliest auction</option><option value="high">Highest auction result</option><option value="low">Lowest auction result</option></select></label>
            </div>
            <button class="reset" type="button">Reset</button>
          </section>
          <section class="archive" aria-live="polite" hidden></section>
          <p class="empty no-results" hidden>No works match those filters.</p>
          <p class="empty load-error" hidden>Archive data could not be loaded.</p>
        </main>
        <dialog class="viewer">
          <button aria-label="Close gallery" class="close" type="button">×</button>
          <button aria-label="Previous image" class="gallery-nav previous" type="button">‹</button>
          <figure class="viewer-content">
            <div class="viewer-frame"><canvas class="star-loader gallery-loader" aria-hidden="true"></canvas><img alt=""></div>
            <figcaption class="viewer-caption"><p></p><span class="image-counter"></span></figcaption>
          </figure>
          <button aria-label="Next image" class="gallery-nav next" type="button">›</button>
        </dialog>`;
    }

    bindEvents() {
      const root = this.shadowRoot;
      root.querySelector('.search').addEventListener('input', () => this.updateCards());
      root.querySelector('.year-select').addEventListener('change', () => this.updateCards());
      root.querySelector('.sort-select').addEventListener('change', () => this.updateCards());
      root.querySelector('.reset').addEventListener('click', () => {
        root.querySelector('.search').value = '';
        root.querySelector('.year-select').value = 'all';
        root.querySelector('.sort-select').value = 'latest';
        this.updateCards();
      });
      root.querySelector('.archive').addEventListener('click', event => {
        const button = event.target.closest('.image-button');
        if (button) this.openGallery(Number(button.dataset.index));
      });
      root.querySelector('.archive').addEventListener('pointerover', event => {
        const button = event.target.closest('.image-button');
        if (button) this.preloadWorkGallery(Number(button.dataset.index));
      });
      root.querySelector('.archive').addEventListener('focusin', event => {
        const button = event.target.closest('.image-button');
        if (button) this.preloadWorkGallery(Number(button.dataset.index));
      });
      root.querySelector('.archive').addEventListener('pointerdown', event => {
        const button = event.target.closest('.image-button');
        if (button) this.preloadWorkGallery(Number(button.dataset.index));
      }, {passive: true});
      root.querySelector('.close').addEventListener('click', () => this.closeGallery());
      root.querySelector('.previous').addEventListener('click', () => this.moveGallery(-1));
      root.querySelector('.next').addEventListener('click', () => this.moveGallery(1));
      const viewer = root.querySelector('.viewer');
      viewer.addEventListener('cancel', event => { event.preventDefault(); this.closeGallery(); });
      viewer.addEventListener('click', event => { if (event.target === viewer) this.closeGallery(); });
      viewer.addEventListener('touchstart', event => {
        const touch = event.changedTouches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
      }, {passive: true});
      viewer.addEventListener('touchend', event => {
        const touch = event.changedTouches[0];
        const dx = touch.clientX - this.touchStartX;
        const dy = touch.clientY - this.touchStartY;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) this.moveGallery(dx < 0 ? 1 : -1);
      }, {passive: true});
      this.addEventListener('keydown', event => {
        if (!viewer.open) return;
        if (event.key === 'ArrowLeft') this.moveGallery(-1);
        if (event.key === 'ArrowRight') this.moveGallery(1);
      });
    }

    setLoaded() {
      const root = this.shadowRoot;
      root.querySelector('.archive-loading').hidden = true;
      this.starLoader.remove(root.querySelector('.archive-loader'));
      root.querySelector('.controls').hidden = false;
      root.querySelector('.archive').hidden = false;
      root.querySelector('.shell').setAttribute('aria-busy', 'false');
    }

    async load() {
      try {
        const response = await fetch(new URL('data/auctions.csv', baseUrl));
        if (!response.ok) throw new Error(response.status);
        this.works = parseCSV(await response.text()).map(work => ({
          ...work,
          resultEUR: resultInEuro(work),
          images: work.images.split('|').map(path => path.trim()).filter(Boolean).map(path => new URL(path, baseUrl).href)
        }));
        const years = [...new Set(this.works.map(work => String(work.year)))].sort((a, b) => Number(b) - Number(a));
        const yearSelect = this.shadowRoot.querySelector('.year-select');
        years.forEach(year => yearSelect.insertAdjacentHTML('beforeend', `<option value="${escapeHTML(year)}">${escapeHTML(year)}</option>`));
        const numericYears = this.works.map(work => Number(work.year)).filter(Number.isFinite);
        this.shadowRoot.querySelector('.count').textContent = `${this.works.length} works · ${Math.min(...numericYears)}–${Math.max(...numericYears)}`;
        this.setLoaded();
        this.updateCards();
      } catch (error) {
        console.error('Auction archive could not load:', error);
        const root = this.shadowRoot;
        root.querySelector('.archive-loading').hidden = true;
        this.starLoader.remove(root.querySelector('.archive-loader'));
        root.querySelector('.shell').setAttribute('aria-busy', 'false');
        root.querySelector('.load-error').hidden = false;
      }
    }

    updateCards() {
      const root = this.shadowRoot;
      const query = root.querySelector('.search').value.trim().toLowerCase();
      const year = root.querySelector('.year-select').value;
      const sort = root.querySelector('.sort-select').value;
      const compare = {
        latest: (a, b) => b.auctionEndISO.localeCompare(a.auctionEndISO) || Number(a.id) - Number(b.id),
        earliest: (a, b) => a.auctionEndISO.localeCompare(b.auctionEndISO) || Number(a.id) - Number(b.id),
        high: (a, b) => b.resultEUR - a.resultEUR || Number(a.id) - Number(b.id),
        low: (a, b) => a.resultEUR - b.resultEUR || Number(a.id) - Number(b.id)
      }[sort];
      const visible = this.works.filter(work => {
        const matchesQuery = !query || work.title.toLowerCase().includes(query) || String(work.year).includes(query);
        return matchesQuery && (year === 'all' || String(work.year) === year);
      }).sort(compare);
      this.galleryPreloadObserver?.disconnect();
      const archive = root.querySelector('.archive');
      this.starLoader.removeWithin(archive);
      this.cardRevealRun += 1;
      this.nextCardRevealAt = performance.now() + 60;
      archive.innerHTML = visible.map((work, position) => this.cardHTML(work, position)).join('');
      root.querySelector('.no-results').hidden = visible.length !== 0;
      this.bindCardLoaders();
      this.preloadVisibleGalleries();
    }

    cardHTML(work, position) {
      const index = this.works.indexOf(work);
      const charity = work.charity ? `<div class="charity-row"><dt>Charity</dt><dd>${escapeHTML(work.charity)}</dd></div>` : '';
      const imageTitle = `${work.title}, ${work.year} — David Ambarzumjan`;
      const image = work.images[0];
      const priority = position < 3;
      return `<article class="artwork is-reveal-pending" data-reveal-position="${position}">
        <button class="image-button is-loading" type="button" data-index="${index}" aria-label="View ${escapeHTML(work.title)} image gallery">
          <canvas class="star-loader card-loader" aria-hidden="true"></canvas>
          <img src="${escapeHTML(image)}" alt="${escapeHTML(imageTitle)}" title="${escapeHTML(imageTitle)}" width="800" height="800" loading="${priority ? 'eager' : 'lazy'}" fetchpriority="${priority ? 'high' : 'low'}" decoding="async">
        </button>
        <div class="meta">
          <div><h2>${escapeHTML(work.title)}</h2><p class="year">${escapeHTML(work.year)}</p></div>
          <dl>
            <div><dt>Medium</dt><dd>${escapeHTML(work.medium)}</dd></div>
            <div><dt>Auction ended</dt><dd><time datetime="${escapeHTML(work.auctionEndISO)}">${escapeHTML(work.auctionEndDisplay)}</time></dd></div>
            <div><dt>Winning bid</dt><dd>${escapeHTML(work.winningBid)}</dd></div>
            ${charity}
          </dl>
        </div>
      </article>`;
    }

    bindCardLoaders() {
      const revealRun = this.cardRevealRun;
      this.shadowRoot.querySelectorAll('.image-button.is-loading').forEach(button => {
        const image = button.querySelector('img');
        const loader = button.querySelector('.card-loader');
        let finished = false;
        const reveal = () => {
          if (finished) return;
          finished = true;
          button.classList.remove('is-loading');
          this.starLoader.remove(loader);
          this.queueCardReveal(button.closest('.artwork'), revealRun);
        };
        const finish = () => {
          if (finished) return;
          if (image.naturalWidth && typeof image.decode === 'function') {
            image.decode().catch(() => {}).then(reveal);
          } else {
            reveal();
          }
        };
        image.addEventListener('load', finish, {once: true});
        image.addEventListener('error', finish, {once: true});
        if (!this.starLoader.add(loader, 64)) button.classList.remove('is-loading');
        if (image.complete) finish();
      });
    }

    queueCardReveal(card, revealRun) {
      if (!card || revealRun !== this.cardRevealRun) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const now = performance.now();
      const revealAt = reduceMotion ? now : Math.max(now + 28, this.nextCardRevealAt);
      this.nextCardRevealAt = reduceMotion ? now : revealAt + 95;
      card.style.setProperty('--card-reveal-delay', `${Math.round(revealAt - now)}ms`);
      requestAnimationFrame(() => {
        if (revealRun !== this.cardRevealRun || !card.isConnected) return;
        card.classList.remove('is-reveal-pending');
        card.classList.add('is-revealed');
      });
    }

    preloadGalleryImage(url) {
      if (this.galleryImageCache.has(url)) return this.galleryImageCache.get(url);
      const preload = new Promise(resolve => {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => {
          const decoded = typeof image.decode === 'function' ? image.decode().catch(() => {}) : Promise.resolve();
          decoded.then(() => resolve(true));
        };
        image.onerror = () => resolve(false);
        image.src = url;
      });
      this.galleryImageCache.set(url, preload);
      return preload;
    }

    preloadWorkGallery(workIndex) {
      const work = this.works[workIndex];
      return work ? Promise.all(work.images.map(image => this.preloadGalleryImage(image))) : Promise.resolve([]);
    }

    preloadVisibleGalleries() {
      if (!('IntersectionObserver' in window)) return;
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          this.preloadWorkGallery(Number(entry.target.dataset.index));
          observer.unobserve(entry.target);
        });
      }, {rootMargin: '600px 0px'});
      this.galleryPreloadObserver = observer;
      this.shadowRoot.querySelectorAll('.image-button').forEach(button => {
        observer.observe(button);
      });
    }

    openGallery(workIndex) {
      const work = this.works[workIndex];
      if (!work || !work.images.length) return;
      const gallery = [...new Set(work.images)];
      this.gallery = gallery;
      this.galleryIndex = 0;
      this.shadowRoot.querySelector('.viewer-caption p').textContent = work.title;
      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      this.shadowRoot.querySelector('.viewer').showModal();
      this.renderGalleryImage();
      this.preloadWorkGallery(workIndex);
    }

    async renderGalleryImage(direction = 0) {
      const root = this.shadowRoot;
      const image = root.querySelector('.viewer-frame img');
      const frame = root.querySelector('.viewer-frame');
      const request = ++this.galleryRequest;
      const source = this.gallery[this.galleryIndex];
      const index = this.galleryIndex;
      const title = root.querySelector('.viewer-caption p').textContent;
      root.querySelector('.image-counter').textContent = `${index + 1} / ${this.gallery.length}`;
      root.querySelector('.previous').hidden = this.gallery.length < 2;
      root.querySelector('.next').hidden = this.gallery.length < 2;
      image.classList.remove('slide-left', 'slide-right');
      frame.classList.add('is-loading');
      frame.classList.toggle('has-star-loader', this.starLoader.add(frame.querySelector('.gallery-loader'), 148));
      image.hidden = true;
      image.removeAttribute('src');
      const loaded = await this.preloadGalleryImage(source);
      if (request !== this.galleryRequest) return;
      if (!loaded) {
        frame.classList.remove('is-loading');
        this.starLoader.remove(frame.querySelector('.gallery-loader'));
        return;
      }
      image.src = source;
      image.alt = `${title} by David Ambarzumjan, image ${index + 1} of ${this.gallery.length}`;
      image.hidden = false;
      frame.classList.remove('is-loading');
      this.starLoader.remove(frame.querySelector('.gallery-loader'));
      void image.offsetWidth;
      if (direction) image.classList.add(direction > 0 ? 'slide-left' : 'slide-right');
    }

    moveGallery(step) {
      if (this.gallery.length < 2) return;
      this.galleryIndex = (this.galleryIndex + step + this.gallery.length) % this.gallery.length;
      this.renderGalleryImage(step);
    }

    closeGallery() {
      const viewer = this.shadowRoot.querySelector('.viewer');
      this.galleryRequest++;
      if (viewer.open) viewer.close();
      const frame = this.shadowRoot.querySelector('.viewer-frame');
      frame.classList.remove('is-loading');
      this.starLoader.remove(frame.querySelector('.gallery-loader'));
      const image = frame.querySelector('img');
      image.hidden = true;
      image.removeAttribute('src');
      document.body.style.overflow = this.previousBodyOverflow;
    }
  }

  if (!customElements.get('auction-archive')) customElements.define('auction-archive', AuctionArchive);
})();
