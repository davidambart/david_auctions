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
    .image-button{display:block;width:100%;padding:0;border:0;background:#f4f4f2;cursor:zoom-in;aspect-ratio:1/1;overflow:hidden}
    .image-button img{display:block;width:100%;height:100%;object-fit:contain;transition:transform .6s ease}
    .image-button:hover img{transform:scale(1.015)}
    .meta{display:grid;grid-template-columns:1fr auto;gap:30px;padding-top:18px;border-top:1px solid var(--line);margin-top:18px}
    .meta h2{font:500 clamp(27px,3cqw,42px)/1 "Cormorant Garamond",Georgia,serif;margin:0}
    .year{margin:8px 0 0;color:var(--muted)}
    dl{margin:0;min-width:180px}
    dl div{display:flex;justify-content:space-between;gap:20px;padding:2px 0 5px}
    dt{text-transform:uppercase;letter-spacing:.12em;font-size:8px;color:var(--muted)}
    dd{margin:0;font-size:11px;text-align:right}
    .charity-row dd{line-height:1.45}
    .empty{text-align:center;padding:80px 0;color:var(--muted)}
    :host dialog.viewer{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:transparent;color:#111;overflow:hidden;touch-action:none}
    :host dialog.viewer::backdrop{background:rgba(255,255,255,.95)}
    .viewer-content{width:100%;height:100%;margin:0;display:grid;grid-template-rows:minmax(0,1fr) 62px}
    .viewer-frame{position:relative;min-width:0;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .viewer-frame.is-loading::after{content:"";position:absolute;width:34px;aspect-ratio:1;border:1.5px solid rgba(0,0,0,.12);border-top-color:#374151;border-radius:50%;animation:archiveSpin .78s linear infinite}
    .viewer-frame img{display:block;width:100%;height:100%;max-width:100vw;max-height:calc(100vh - 62px);max-height:calc(100dvh - 62px);object-fit:contain;object-position:center;user-select:none;-webkit-user-drag:none;position:relative;z-index:1;will-change:transform,opacity;transform:translate3d(var(--viewer-drag-x,0),var(--viewer-drag-y,0),0);opacity:var(--viewer-drag-opacity,1)}
    .gallery-outgoing{display:block;position:absolute;inset:0;z-index:2;width:100%;height:100%;max-width:100vw;max-height:calc(100vh - 62px);max-height:calc(100dvh - 62px);object-fit:contain;object-position:center;user-select:none;-webkit-user-drag:none;pointer-events:none}
    .viewer-frame.is-loading img{visibility:hidden}
    .viewer-caption{height:62px;display:grid;place-items:center;padding:0 24px;color:#111}
    .viewer-caption p{margin:0;font:400 22px "Cormorant Garamond",Georgia,serif;text-align:center}
    .viewer-toolbar{position:fixed;inset:0 0 auto;z-index:4;display:flex;height:47px;align-items:center;justify-content:space-between;background:rgba(255,255,255,.75);border-bottom:1px solid rgba(0,0,0,.1);color:#000}
    .image-counter{padding:0 5px;font-size:17px;line-height:46px;font-variant-numeric:tabular-nums}
    .close,.gallery-nav{border:0;outline:none!important;box-shadow:none!important;cursor:pointer;padding:0;color:#000;-webkit-tap-highlight-color:transparent}
    .close{position:relative;z-index:1;display:grid;width:46px;height:46px;place-items:center;border-radius:0!important;background:transparent!important;color:#374151}
    .close svg{display:block;width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:square}
    .gallery-nav{position:fixed;z-index:3;top:50%;display:grid;width:40px;height:40px;place-items:center;border-radius:0!important;background:transparent!important;color:#000;transform:translateY(-50%);transition:background .15s ease,color .15s ease}
    .gallery-nav svg{display:block;width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:square;stroke-linejoin:miter}
    .gallery-nav:hover,.gallery-nav:active{background:rgba(255,255,255,.55)!important}
    .close:hover,.close:active{color:#111}
    :host dialog.viewer .viewer-toolbar button.close:focus,:host dialog.viewer .viewer-toolbar button.close:focus-visible,:host dialog.viewer button.gallery-nav:focus,:host dialog.viewer button.gallery-nav:focus-visible{outline:none!important;border-radius:0!important;box-shadow:none!important}
    .previous{left:12px}.next{right:12px}
    dialog.viewer[open]:not(.is-closing)::backdrop{animation:archiveBackdropIn .35s ease backwards}
    dialog.viewer[open]:not(.is-closing) .viewer-frame{animation:archiveContentIn .2s ease .1s both}
    dialog.viewer[open]:not(.is-closing) .viewer-caption,dialog.viewer[open]:not(.is-closing) .viewer-toolbar,dialog.viewer[open]:not(.is-closing) .gallery-nav{animation:archiveInterfaceIn .25s ease .1s backwards}
    dialog.viewer.is-closing::backdrop{animation:archiveBackdropOut .35s ease forwards}
    dialog.viewer.is-closing .viewer-frame{animation:archiveContentOutDown .2s ease both}
    dialog.viewer.is-closing-up .viewer-frame{animation-name:archiveContentOutUp}
    dialog.viewer.is-closing .viewer-caption,dialog.viewer.is-closing .viewer-toolbar,dialog.viewer.is-closing .gallery-nav{animation:archiveInterfaceOut .15s ease forwards}
    dialog.viewer.is-idle:not(.is-closing) .viewer-toolbar,dialog.viewer.is-idle:not(.is-closing) .gallery-nav{pointer-events:none;animation:archiveInterfaceOut .15s ease-out forwards}
    .viewer-frame.is-dragging img{transition:none}
    .viewer-frame.is-settling img{transition:transform .22s cubic-bezier(.22,.61,.36,1),opacity .22s ease}
    .gallery-enter-next{animation:archiveGalleryEnterNext .3s cubic-bezier(.22,.61,.36,1) both!important}
    .gallery-enter-previous{animation:archiveGalleryEnterPrevious .3s cubic-bezier(.22,.61,.36,1) both!important}
    .gallery-outgoing-next{animation:archiveGalleryExitNext .24s cubic-bezier(.4,0,1,1) both}
    .gallery-outgoing-previous{animation:archiveGalleryExitPrevious .24s cubic-bezier(.4,0,1,1) both}
    :host([data-theme="dark"]) dialog.viewer,:host-context(html[data-da-theme="dark"]) dialog.viewer{background:#000 url("${new URL('assets/starfield.svg', baseUrl).href}") 0 0/700px 700px repeat!important;color:#c1c8c6}
    :host([data-theme="dark"]) dialog.viewer::backdrop,:host-context(html[data-da-theme="dark"]) dialog.viewer::backdrop{background:#000!important}
    :host([data-theme="dark"]) .viewer-toolbar,:host-context(html[data-da-theme="dark"]) .viewer-toolbar{background:rgba(0,0,0,.75)!important;border-color:#303736;color:#b7c2c0}
    :host([data-theme="dark"]) .close,:host([data-theme="dark"]) .gallery-nav,:host-context(html[data-da-theme="dark"]) .close,:host-context(html[data-da-theme="dark"]) .gallery-nav{color:#b7c2c0}
    :host([data-theme="dark"]) .gallery-nav,:host-context(html[data-da-theme="dark"]) .gallery-nav{background:transparent!important}
    :host([data-theme="dark"]) .gallery-nav:hover,:host([data-theme="dark"]) .gallery-nav:active,:host-context(html[data-da-theme="dark"]) .gallery-nav:hover,:host-context(html[data-da-theme="dark"]) .gallery-nav:active{background:rgba(0,0,0,.5)!important;color:#d7e1de}
    :host([data-theme="dark"]) .viewer-frame.is-loading::after,:host-context(html[data-da-theme="dark"]) .viewer-frame.is-loading::after{border-color:rgba(193,200,198,.18);border-top-color:#a3bfbc}
    @keyframes archiveBackdropIn{from{opacity:0}to{opacity:1}}
    @keyframes archiveBackdropOut{to{opacity:0}}
    @keyframes archiveContentIn{from{opacity:0;transform:scale(.975) translate3d(0,16px,0)}to{opacity:1;transform:scale(1) translate3d(0,0,0)}}
    @keyframes archiveContentOutDown{to{opacity:0;transform:scale(.975) translate3d(0,16px,0)}}
    @keyframes archiveContentOutUp{to{opacity:0;transform:scale(.975) translate3d(0,-16px,0)}}
    @keyframes archiveInterfaceIn{from{opacity:0}to{opacity:1}}
    @keyframes archiveInterfaceOut{to{opacity:0}}
    @keyframes archiveGalleryEnterNext{from{opacity:0;transform:translate3d(14vw,0,0) scale(.99)}to{opacity:1;transform:translate3d(0,0,0) scale(1)}}
    @keyframes archiveGalleryEnterPrevious{from{opacity:0;transform:translate3d(-14vw,0,0) scale(.99)}to{opacity:1;transform:translate3d(0,0,0) scale(1)}}
    @keyframes archiveGalleryExitNext{to{opacity:0;transform:translate3d(-14vw,0,0) scale(.99)}}
    @keyframes archiveGalleryExitPrevious{to{opacity:0;transform:translate3d(14vw,0,0) scale(.99)}}
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
      .gallery-nav{width:40px;height:40px}.previous{left:12px}.next{right:12px}.viewer-caption{padding:0 14px}.viewer-caption p{font-size:19px}.image-counter{font-size:15px}
    }
    @media(max-width:430px){.meta{grid-template-columns:minmax(0,50%) minmax(0,50%)}.meta dl>div{gap:4px}.meta dt{font-size:9px}.meta dd{font-size:12px}.meta dl>div:first-child{grid-template-columns:58px minmax(0,1fr)!important;column-gap:6px!important}.meta dl>div:first-child dd{white-space:nowrap!important;overflow-wrap:normal!important;word-break:normal!important}}
    @media(prefers-reduced-motion:reduce){.image-button img{transition:none}.viewer-frame img,.gallery-outgoing,.archive-spinner,dialog.viewer::backdrop,dialog.viewer .viewer-frame,dialog.viewer .viewer-caption,dialog.viewer .viewer-toolbar,dialog.viewer .gallery-nav{animation:none!important}}
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

  class AuctionArchive extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
      this.works = [];
      this.gallery = [];
      this.galleryIndex = 0;
      this.previousBodyOverflow = '';
      this.galleryImageCache = new Map();
      this.galleryPreloadObserver = null;
      this.galleryOpenRequest = 0;
      this.galleryRequest = 0;
      this.galleryClosing = false;
      this.galleryMoving = false;
      this.galleryTitle = '';
      this.viewerIdleTimer = 0;
      this.viewerGesture = null;
      this.viewerClickSuppressedUntil = 0;
      this.viewerSettleTimer = 0;
      this.themeObserver = null;
    }

    connectedCallback() {
      if (this.shadowRoot.children.length) return;
      this.renderShell();
      this.syncTheme();
      this.observeTheme();
      this.bindEvents();
      this.load();
    }

    disconnectedCallback() {
      this.galleryPreloadObserver?.disconnect();
      this.themeObserver?.disconnect();
      window.clearTimeout(this.viewerSettleTimer);
      window.clearTimeout(this.viewerIdleTimer);
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
          <div class="viewer-toolbar"><span class="image-counter" aria-live="polite"></span><button aria-label="Close gallery" class="close" type="button"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="m19.5 4.5-15 15M4.5 4.5l15 15"></path></svg></button></div>
          <button aria-label="Previous image" class="gallery-nav previous" type="button"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M15 3 6 12l9 9"></path></svg></button>
          <figure class="viewer-content"><div class="viewer-frame"><img alt=""></div><figcaption class="viewer-caption"><p></p></figcaption></figure>
          <button aria-label="Next image" class="gallery-nav next" type="button"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M9 3l9 9-9 9"></path></svg></button>
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
      root.querySelector('.previous').addEventListener('click', () => { this.revealViewerControls(); this.moveGallery(-1); });
      root.querySelector('.next').addEventListener('click', () => { this.revealViewerControls(); this.moveGallery(1); });
      const viewer = root.querySelector('.viewer');
      viewer.addEventListener('cancel', event => { event.preventDefault(); this.closeGallery(); });
      viewer.addEventListener('click', event => {
        if (Date.now() < this.viewerClickSuppressedUntil) return;
        const isControl = event.target.closest('button');
        const isImage = event.target.closest('.viewer-frame img');
        if (!isControl && !isImage) this.closeGallery('down');
      });
      viewer.addEventListener('pointerdown', event => this.beginViewerGesture(event));
      viewer.addEventListener('pointermove', event => this.updateViewerGesture(event), {passive: false});
      viewer.addEventListener('pointerup', event => this.endViewerGesture(event));
      viewer.addEventListener('pointercancel', event => this.cancelViewerGesture(event));
      viewer.addEventListener('focusin', () => this.revealViewerControls());
      this.addEventListener('keydown', event => {
        if (!viewer.open) return;
        this.revealViewerControls();
        if (event.key === 'ArrowLeft') this.moveGallery(-1);
        if (event.key === 'ArrowRight') this.moveGallery(1);
      });
    }

    syncTheme() {
      this.dataset.theme = document.documentElement.getAttribute('data-da-theme') === 'dark' ? 'dark' : 'light';
    }

    observeTheme() {
      this.themeObserver = new MutationObserver(() => this.syncTheme());
      this.themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['data-da-theme']});
    }

    beginViewerGesture(event) {
      const viewer = this.shadowRoot.querySelector('.viewer');
      if (!viewer.open || this.galleryClosing || (event.pointerType === 'mouse' && event.button !== 0)) return;
      const isControl = Boolean(event.target.closest('button'));
      this.viewerGesture = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startedAt: Date.now(),
        axis: '',
        moved: false,
        isControl
      };
      if (!isControl) viewer.setPointerCapture?.(event.pointerId);
    }

    updateViewerGesture(event) {
      const gesture = this.viewerGesture;
      if (!gesture || gesture.pointerId !== event.pointerId || gesture.isControl || this.galleryClosing) return;
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (!gesture.axis && Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
      gesture.moved = true;
      gesture.axis ||= Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      const frame = this.shadowRoot.querySelector('.viewer-frame');
      const bounds = frame.getBoundingClientRect();
      if (gesture.axis === 'x') {
        if (this.gallery.length < 2) return;
        const dragX = Math.max(-bounds.width * .42, Math.min(bounds.width * .42, dx));
        this.setViewerDrag(dragX, 0, 1 - Math.min(.28, Math.abs(dragX) / bounds.width * .3));
      } else {
        const dragY = Math.max(-bounds.height * .42, Math.min(bounds.height * .42, dy));
        this.setViewerDrag(0, dragY, 1 - Math.min(.3, Math.abs(dragY) / bounds.height * .34));
      }
      event.preventDefault();
    }

    endViewerGesture(event) {
      const gesture = this.viewerGesture;
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      const viewer = this.shadowRoot.querySelector('.viewer');
      viewer.releasePointerCapture?.(event.pointerId);
      this.viewerGesture = null;
      if (gesture.isControl || !gesture.moved) return;
      const frame = this.shadowRoot.querySelector('.viewer-frame');
      const bounds = frame.getBoundingClientRect();
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      const elapsed = Math.max(1, Date.now() - gesture.startedAt);
      const quickHorizontal = Math.abs(dx) / elapsed > .55;
      const quickVertical = Math.abs(dy) / elapsed > .65;
      this.viewerClickSuppressedUntil = Date.now() + 380;
      if (gesture.axis === 'x' && this.gallery.length > 1 && (Math.abs(dx) > Math.max(62, bounds.width * .15) || quickHorizontal)) {
        this.clearViewerDrag();
        this.moveGallery(dx < 0 ? 1 : -1);
      } else if (gesture.axis === 'y' && (Math.abs(dy) > Math.max(78, bounds.height * .13) || quickVertical)) {
        this.clearViewerDrag();
        this.closeGallery(dy < 0 ? 'up' : 'down');
      } else {
        this.clearViewerDrag(true);
      }
    }

    cancelViewerGesture(event) {
      if (!this.viewerGesture || this.viewerGesture.pointerId !== event.pointerId) return;
      this.viewerGesture = null;
      this.clearViewerDrag(true);
    }

    setViewerDrag(x, y, opacity) {
      const frame = this.shadowRoot.querySelector('.viewer-frame');
      const image = frame.querySelector('img');
      frame.classList.remove('is-settling');
      frame.classList.add('is-dragging');
      image.style.setProperty('--viewer-drag-x', `${x}px`);
      image.style.setProperty('--viewer-drag-y', `${y}px`);
      image.style.setProperty('--viewer-drag-opacity', String(opacity));
    }

    clearViewerDrag(animate = false) {
      const frame = this.shadowRoot.querySelector('.viewer-frame');
      const image = frame.querySelector('img');
      frame.classList.remove('is-dragging');
      if (animate) {
        frame.classList.add('is-settling');
        window.clearTimeout(this.viewerSettleTimer);
        this.viewerSettleTimer = window.setTimeout(() => frame.classList.remove('is-settling'), 240);
      }
      image.style.removeProperty('--viewer-drag-x');
      image.style.removeProperty('--viewer-drag-y');
      image.style.removeProperty('--viewer-drag-opacity');
    }

    setLoaded() {
      const root = this.shadowRoot;
      root.querySelector('.archive-loading').hidden = true;
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
          images: (work.images || work.image).split('|').map(path => path.trim()).filter(Boolean).map(path => new URL(path, baseUrl).href)
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
      root.querySelector('.archive').innerHTML = visible.map((work, position) => this.cardHTML(work, position)).join('');
      root.querySelector('.no-results').hidden = visible.length !== 0;
      this.preloadVisibleGalleries();
    }

    cardHTML(work, position) {
      const index = this.works.indexOf(work);
      const charity = work.charity ? `<div class="charity-row"><dt>Charity</dt><dd>${escapeHTML(work.charity)}</dd></div>` : '';
      const imageTitle = `${work.title}, ${work.year} — David Ambarzumjan`;
      const image = new URL(work.image, baseUrl).href;
      const priority = position < 3;
      return `<article class="artwork">
        <button class="image-button" type="button" data-index="${index}" aria-label="View ${escapeHTML(work.title)} image gallery">
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

    async openGallery(workIndex) {
      const work = this.works[workIndex];
      if (!work || !work.images.length) return;
      const openRequest = ++this.galleryOpenRequest;
      const gallery = [...new Set(work.images)];
      this.gallery = gallery;
      this.galleryIndex = 0;
      this.galleryTitle = work.title;
      this.shadowRoot.querySelector('.viewer-caption p').textContent = work.title;
      await this.preloadGalleryImage(gallery[0]);
      if (openRequest !== this.galleryOpenRequest) return;
      await this.renderGalleryImage();
      if (openRequest !== this.galleryOpenRequest) return;
      void Promise.all(gallery.slice(1).map(image => this.preloadGalleryImage(image)));
      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const viewer = this.shadowRoot.querySelector('.viewer');
      this.galleryClosing = false;
      this.galleryMoving = false;
      viewer.classList.remove('is-closing', 'is-closing-up', 'is-idle');
      viewer.showModal();
      this.revealViewerControls();
    }

    async renderGalleryImage(direction = 0) {
      const root = this.shadowRoot;
      const image = root.querySelector('.viewer-frame img');
      const frame = root.querySelector('.viewer-frame');
      const request = ++this.galleryRequest;
      const source = this.gallery[this.galleryIndex];
      const index = this.galleryIndex;
      root.querySelector('.image-counter').textContent = `${index + 1} / ${this.gallery.length}`;
      root.querySelector('.previous').hidden = this.gallery.length < 2;
      root.querySelector('.next').hidden = this.gallery.length < 2;
      image.classList.remove('gallery-enter-next', 'gallery-enter-previous');
      const currentSource = image.currentSrc || image.getAttribute('src');
      if (!currentSource) frame.classList.add('is-loading');
      const loaded = await this.preloadGalleryImage(source);
      if (request !== this.galleryRequest) return;
      if (!loaded) {
        frame.classList.remove('is-loading');
        return;
      }
      if (direction && currentSource && currentSource !== source) {
        const outgoing = image.cloneNode(true);
        outgoing.className = `gallery-outgoing gallery-outgoing-${direction > 0 ? 'next' : 'previous'}`;
        outgoing.alt = '';
        frame.appendChild(outgoing);
        outgoing.addEventListener('animationend', () => outgoing.remove(), {once: true});
      }
      image.src = source;
      image.alt = `${this.galleryTitle} by David Ambarzumjan, image ${index + 1} of ${this.gallery.length}`;
      image.hidden = false;
      frame.classList.remove('is-loading');
      this.clearViewerDrag();
      void image.offsetWidth;
      if (direction && currentSource !== source) image.classList.add(direction > 0 ? 'gallery-enter-next' : 'gallery-enter-previous');
    }

    moveGallery(step) {
      if (this.galleryClosing || this.galleryMoving || this.gallery.length < 2) return;
      this.galleryMoving = true;
      this.galleryIndex = (this.galleryIndex + step + this.gallery.length) % this.gallery.length;
      this.renderGalleryImage(step).finally(() => {
        window.setTimeout(() => { this.galleryMoving = false; }, this.prefersReducedMotion() ? 0 : 230);
      });
    }

    prefersReducedMotion() {
      return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    }

    revealViewerControls() {
      const viewer = this.shadowRoot.querySelector('.viewer');
      if (!viewer.open || this.galleryClosing) return;
      viewer.classList.remove('is-idle');
      window.clearTimeout(this.viewerIdleTimer);
      if (this.prefersReducedMotion()) return;
      this.viewerIdleTimer = window.setTimeout(() => {
        if (viewer.open && !this.galleryClosing) viewer.classList.add('is-idle');
      }, 2500);
    }

    closeGallery(direction = 'down') {
      const viewer = this.shadowRoot.querySelector('.viewer');
      if (!viewer.open || this.galleryClosing) return;
      this.galleryOpenRequest++;
      this.galleryRequest++;
      this.galleryClosing = true;
      this.galleryMoving = false;
      this.viewerGesture = null;
      window.clearTimeout(this.viewerSettleTimer);
      window.clearTimeout(this.viewerIdleTimer);
      this.clearViewerDrag();
      viewer.classList.remove('is-idle', 'is-closing-up');
      viewer.classList.add('is-closing');
      if (direction === 'up') viewer.classList.add('is-closing-up');
      const finish = () => {
        viewer.close();
        viewer.classList.remove('is-closing', 'is-closing-up');
        const frame = this.shadowRoot.querySelector('.viewer-frame');
        frame.classList.remove('is-loading');
        frame.querySelectorAll('.gallery-outgoing').forEach(outgoing => outgoing.remove());
        const image = frame.querySelector('img');
        image.hidden = true;
        image.removeAttribute('src');
        document.body.style.overflow = this.previousBodyOverflow;
        this.galleryClosing = false;
      };
      if (this.prefersReducedMotion()) finish();
      else window.setTimeout(finish, 350);
    }
  }

  if (!customElements.get('auction-archive')) customElements.define('auction-archive', AuctionArchive);
})();
