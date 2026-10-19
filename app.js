'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const state = {panel: 'overview', figure: 0};
  let returnFocus = null;

  const esc = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  function keywords() {
    return `<div class="keyword-row">${ARTICLE.keywords.map(keyword => `<span>${esc(keyword)}</span>`).join('')}</div>`;
  }

  function renderSummary() {
    return `
      <section class="paper-hero" id="summarySection" aria-labelledby="paperHeroTitle">
        <div class="hero-copy">
          <h2 id="paperHeroTitle">${esc(ARTICLE.title)}</h2>
          <p>The article reports a cross-sectional Romanian study of 120 women with breast cancer, focused on anxiety, depression, fear of progression and illness adaptation.</p>
          <div class="template-source-actions">
            <a class="article-link-button" href="https://doi.org/${ARTICLE.doi}" target="_blank" rel="noopener noreferrer">Source Article</a>
          </div>
        </div>
        <aside class="hero-facts" aria-label="Research details">
          <dl>
            <div><dt>Research scope</dt><dd>Observational, cross-sectional, multicentre and non-interventional study in two Romanian hospitals.</dd></div>
            <div><dt>Core focus</dt><dd>Symptoms were frequent, but corrected subgroup differences were few and modest.</dd></div>
          </dl>
        </aside>
      </section>

      <section class="overview-section compact-section">
        <div class="section-heading"><span>01</span><h2>Study Design</h2></div>
        <div class="lens-grid">
          ${ARTICLE.methods.map(([label, text]) => `<article class="lens-card"><h3>${esc(label)}</h3><p>${esc(text)}</p></article>`).join('')}
        </div>
        ${keywords()}
      </section>

      <section class="overview-section compact-section" id="resultsSection">
        <div class="section-heading"><span>02</span><h2>Sample Snapshot</h2></div>
        <div class="data-grid">
          ${ARTICLE.sample.map(([label, text]) => `<div><strong>${esc(label)}</strong><span>${esc(text)}</span></div>`).join('')}
        </div>
      </section>
    `;
  }

  function renderResults() {
    return `
      <section class="overview-section compact-section">
        <div class="section-heading"><span>03</span><h2>Score Distributions</h2></div>
        <div class="burden-grid">
          ${ARTICLE.burden.map(item => `
            <article class="burden-card">
              <strong>${esc(item.pct)}</strong>
              <h3>${esc(item.label)}</h3>
              <p>${esc(item.value)} of 120 patients. ${esc(item.note)}.</p>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="overview-section compact-section">
        <div class="section-heading"><span>04</span><h2>Corrected Group Differences</h2></div>
        <div class="finding-grid">
          ${ARTICLE.significantFindings.map(item => `
            <article class="finding-card">
              <span>${esc(item.tag)}</span>
              <h3>${esc(item.title)}</h3>
              <p>${esc(item.text)}</p>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="overview-section bottom-grid">
        <article class="section-card">
          <div class="section-heading small-heading"><span>05</span><h2>Psychological Score Associations</h2></div>
          <ul>${ARTICLE.correlations.map(([label, text]) => `<li><strong>${esc(label)}:</strong> ${esc(text)}</li>`).join('')}</ul>
        </article>
        <article class="section-card">
          <div class="section-heading small-heading"><span>06</span><h2>High-Burden Co-occurrence</h2></div>
          <ul>${ARTICLE.coOccurrence.map(([label, text]) => `<li><strong>${esc(label)}:</strong> ${esc(text)}</li>`).join('')}</ul>
        </article>
      </section>
    `;
  }

  function figureMarkup(index) {
    const figure = ARTICLE.figures[index];
    return `
      <article class="evidence-card">
        <div class="evidence-visual"><img src="${esc(figure.src)}" alt="${esc(figure.title)}"></div>
        <header class="figure-header">
          <div class="figure-heading">
            <h3>Figure ${figure.number}. ${esc(figure.title)}</h3>
            <p>${esc(figure.caption)}</p>
          </div>
          <div class="figure-actions">
            <button class="primary" type="button" data-enlarge="${index}">View full size</button>
          </div>
        </header>
      </article>
    `;
  }

  function renderFigures() {
    return `
      <section class="overview-section visual-section" id="figuresSection">
        <div class="section-heading"><span>07</span><h2>Article Figures</h2></div>
        <div class="evidence-stack">
          <div class="figure-selector" role="group" aria-label="Select figure">
            ${ARTICLE.figures.map((figure, index) => `
              <button class="figure-choice" type="button" data-figure="${index}" aria-pressed="${index === state.figure}">
                <span class="figure-number">F${figure.number}</span>
                <span class="figure-choice-copy"><strong>${esc(figure.title)}</strong></span>
              </button>
            `).join('')}
          </div>
          <div id="selectedFigure">${figureMarkup(state.figure)}</div>
        </div>
      </section>
    `;
  }

  function renderLimits() {
    return `
      <section class="overview-section conclusion-section" id="scopeSection">
        <article class="section-card">
          <div class="section-heading small-heading"><span>08</span><h2>Conclusions</h2></div>
          <ul>${ARTICLE.conclusions.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        </article>
      </section>
    `;
  }

  function renderOverview() {
    $('overviewContent').innerHTML = renderSummary() + renderResults() + renderFigures() + renderLimits();
  }

  function renderScenario() {
    window.PsychoOncologyTriage?.render();
  }

  function activatePanel(target) {
    state.panel = target;
    document.querySelectorAll('[data-panel]').forEach(panel => {
      const active = panel.dataset.panel === target;
      panel.classList.toggle('is-visible', active);
      panel.hidden = !active;
    });
    document.querySelectorAll('[data-panel-target]').forEach(button => {
      const active = button.dataset.panelTarget === target;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const panelTitle = target === 'scenario' ? 'Psycho-Oncology Triage' : target === 'quiz' ? 'Quiz' : 'Overview';
    document.title = `Breast Cancer Adaptation Study - ${panelTitle}`;
    if (target === 'overview') renderOverview();
    if (target === 'scenario') renderScenario();
  }

  function enlarge(index, button) {
    const figure = ARTICLE.figures[index];
    returnFocus = button;
    $('dialogTitle').textContent = `Figure ${figure.number}. ${figure.title}`;
    $('dialogFigure').innerHTML = `<img src="${esc(figure.src)}" alt="${esc(figure.title)}">`;
    $('dialogCaption').textContent = figure.caption;
    $('figureDialog').showModal();
    $('closeDialog').focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderOverview();
    renderScenario();
    document.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.panelTarget) activatePanel(button.dataset.panelTarget);
      if (button.dataset.figure !== undefined) {
        state.figure = Number(button.dataset.figure);
        renderOverview();
      }
      if (button.dataset.enlarge !== undefined) enlarge(Number(button.dataset.enlarge), button);
    });
    $('closeDialog').addEventListener('click', () => $('figureDialog').close());
    $('figureDialog').addEventListener('close', () => returnFocus?.focus({preventScroll: true}));
  });
})();
