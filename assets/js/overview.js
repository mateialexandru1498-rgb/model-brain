'use strict';
(() => {
  const pathways = {
    exposure: ['Exposure & transmission', 'Mechanical energy does not stop at the point of contact.', 'Low-frequency vibration transmitted through seats, platforms and equipment can propagate along the body toward the head. Posture, frequency and the resonance characteristics of the spine influence this transmission.', ['Transportation', 'Construction', 'Agriculture', 'Heavy machinery']],
    microtrauma: ['Repetition & accumulation', 'Small mechanical insults may accumulate over time.', 'Repeated low-intensity stress could contribute to subclinical brain microtrauma without immediate symptoms or abnormalities on conventional CT or MRI. This remains a proposed mechanism for long-term occupational WBV.', ['Low-intensity forces', 'Repeated exposure', 'Subclinical changes']],
    oxidation: ['Oxidative stress', 'Damage can emerge when reactive oxygen species exceed defenses.', 'Excess reactive oxygen species (ROS) can contribute to lipid peroxidation, protein oxidation and DNA damage. Mitochondrial dysfunction and neuroinflammation can reinforce oxidative imbalance.', ['Lipid peroxidation', 'Protein / DNA damage', 'Mitochondrial dysfunction']],
    neural: ['Potential downstream effects', 'Interacting processes may increase neuronal vulnerability.', 'Blood–brain barrier disruption, inflammatory signaling and impaired cellular function may contribute to cumulative neuronal damage. A direct causal pathway from occupational WBV to human neurodegeneration has not been established.', ['Barrier dysfunction', 'Neuroinflammation', 'Possible cumulative damage']]
  };
  const evidence = {
    human: ['Direct human evidence', 'The essential link still needs validation.', 'Fatigue, reduced attention, cognitive changes and balance disturbances have been observed in occupational settings. Direct demonstrations of WBV-induced central nervous system injury in humans remain lacking.', 'Observations cannot establish a causal relationship. Noise, physical workload and psychosocial strain may also influence these outcomes.'],
    indirect: ['Indirect human evidence', 'Related exposures offer clues, not a direct answer.', 'Hand–arm vibration has been linked with vascular dysfunction and oxidative stress. Traumatic brain injury provides insight into the biological processes that may follow mechanical insults.', 'Findings from related exposures and neurological conditions cannot be directly transferred to occupational whole-body vibration.'],
    experimental: ['Experimental evidence', 'Biological effects depend on the exposure conditions.', 'Animal models support possible links between repeated WBV, brain injury and oxidative stress. Controlled vibration can also show protective effects in specific injury models.', 'Different intensities, durations and biological models limit comparisons and translation to human occupational exposure.'],
    mechanistic: ['Mechanistic evidence', 'Several cellular pathways fit the proposed connection.', 'Oxidative stress, mitochondrial dysfunction, neuroinflammation and blood–brain barrier disruption provide a biological basis for investigating possible central effects.', 'Mechanistic plausibility helps define testable questions. It does not prove that occupational WBV causes these outcomes in people.']
  };
  const markers = {
    mda: ['Malondialdehyde · lipid peroxidation', 'MDA reflects oxidative damage to lipids and is a candidate signal of increased oxidative burden. It cannot identify WBV-related brain injury on its own.'],
    sod: ['Superoxide dismutase · antioxidant activity', 'SOD is part of the antioxidant defense system. Its activity may help characterize the cellular response to oxidative stress, but is not a specific diagnostic measure of WBV-related brain injury.'],
    gpx: ['Glutathione peroxidase · antioxidant activity', 'GPx contributes to cellular antioxidant protection. Measuring its activity alongside oxidative damage markers may help characterize redox balance; occupational interpretation requires further validation.'],
    cat: ['Catalase · antioxidant activity', 'CAT is an antioxidant enzyme considered among candidate redox biomarkers. Its measurement alone cannot establish the source, location or clinical significance of oxidative changes.']
  };

  const setPressed = (selector, selected) => document.querySelectorAll(selector).forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
  let galleryZoom = 100;
  const updateGalleryZoom = value => {
    galleryZoom = Math.max(100, Math.min(200, value));
    document.querySelectorAll('.wbv-gallery-visual').forEach(visual => {
      visual.style.width = `${galleryZoom}%`;
    });
    document.querySelector('.wbv-gallery-stage').classList.toggle('is-zoomed', galleryZoom > 100);
    document.getElementById('galleryZoomValue').textContent = `${galleryZoom}%`;
    document.getElementById('galleryZoomOut').disabled = galleryZoom === 100;
    document.getElementById('galleryZoomIn').disabled = galleryZoom === 200;
    if (galleryZoom === 100) document.querySelector('.wbv-gallery-stage').scrollTo(0, 0);
  };
  document.getElementById('galleryZoomIn').addEventListener('click', () => updateGalleryZoom(galleryZoom + 25));
  document.getElementById('galleryZoomOut').addEventListener('click', () => updateGalleryZoom(galleryZoom - 25));
  document.getElementById('galleryFit').addEventListener('click', () => updateGalleryZoom(100));
  document.querySelectorAll('[data-diagram]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.diagram;
    setPressed('[data-diagram]', button);
    document.getElementById('mechanismVisual').hidden = key !== 'mechanism';
    document.getElementById('evidenceVisual').hidden = key !== 'evidence';
    document.getElementById('galleryExpand').dataset.openVisual = key;
    document.getElementById('galleryName').textContent = key === 'mechanism' ? 'Biological mechanism' : 'Evidence hierarchy';
    updateGalleryZoom(100);
    document.querySelector('.wbv-gallery-stage').scrollTo(0, 0);
    document.getElementById('galleryCaption').textContent = key === 'mechanism'
      ? 'Mechanical transmission, oxidative stress and the protective antioxidant response.'
      : 'Mechanistic and experimental support is strongest; direct human evidence remains limited.';
  }));
  const visualDialog = document.getElementById('visualDialog');
  const visualCanvas = document.getElementById('visualCanvas');
  const visualImage = document.getElementById('visualImage');
  const zoomButton = document.getElementById('visualZoom');
  let visualTrigger;
  const visuals = {
    mechanism: {title: 'From vibration to neuronal vulnerability', src: 'assets/figures/mechanism.png', alt: 'Proposed biological mechanism connecting vibration transmission, repetitive brain microtrauma, oxidative damage and antioxidant protection.'},
    evidence: {title: 'The landscape of evidence', src: 'assets/figures/evidence-hierarchy.png', alt: 'Hierarchy of direct human, indirect human, experimental and mechanistic evidence supporting the proposed WBV connection.'}
  };
  document.querySelectorAll('[data-open-visual]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.openVisual;
    const visual = visuals[key];
    visualTrigger = button;
    document.getElementById('visualDialogTitle').textContent = visual.title;
    visualImage.src = visual.src;
    visualImage.alt = visual.alt;
    visualCanvas.classList.toggle('is-hierarchy', key === 'evidence');
    visualCanvas.classList.remove('is-zoomed');
    zoomButton.setAttribute('aria-pressed', 'false');
    zoomButton.textContent = 'Zoom 150%';
    visualDialog.showModal();
    visualDialog.querySelector('.wbv-lightbox-scroll').scrollTo(0, 0);
  }));
  zoomButton.addEventListener('click', () => {
    const zoomed = visualCanvas.classList.toggle('is-zoomed');
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    zoomButton.textContent = zoomed ? 'Fit to screen' : 'Zoom 150%';
  });
  document.getElementById('visualClose').addEventListener('click', () => visualDialog.close());
  visualDialog.addEventListener('click', event => {
    if (event.target !== visualDialog) return;
    const rect = visualDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) visualDialog.close();
  });
  visualDialog.addEventListener('close', () => visualTrigger?.focus());
  document.querySelectorAll('[data-pathway]').forEach(button => button.addEventListener('click', () => {
    const [label, title, description, tags] = pathways[button.dataset.pathway];
    setPressed('[data-pathway]', button);
    document.getElementById('pathwayDetail').innerHTML = `<span class="wbv-detail-label">${label}</span><h3>${title}</h3><p>${description}</p><div class="wbv-tags">${tags.map(tag => `<span>${tag}</span>`).join('')}</div>`;
  }));
  document.querySelectorAll('[data-evidence]').forEach(button => button.addEventListener('click', () => {
    const [label, title, description, boundary] = evidence[button.dataset.evidence];
    setPressed('[data-evidence]', button);
    document.getElementById('evidenceDetail').innerHTML = `<span class="wbv-kicker">${label}</span><h3>${title}</h3><p>${description}</p><div class="wbv-evidence-boundary"><strong>What this means</strong><p>${boundary}</p></div>`;
  }));
  document.querySelectorAll('[data-marker]').forEach(button => button.addEventListener('click', () => {
    const [title, description] = markers[button.dataset.marker];
    setPressed('[data-marker]', button);
    document.getElementById('markerDetail').innerHTML = `<strong>${title}</strong><p>${description}</p>`;
  }));

  const selectPanel = panel => {
    document.querySelectorAll('[data-panel-target]').forEach(button => {
      const active = button.dataset.panelTarget === panel;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-panel]').forEach(section => section.classList.toggle('is-visible', section.dataset.panel === panel));
    document.getElementById('publicationIdentity').hidden = panel !== 'overview';
  };
  document.querySelectorAll('[data-panel-target]').forEach(button => button.addEventListener('click', () => selectPanel(button.dataset.panelTarget)));
  document.querySelector('[data-return-overview]')?.addEventListener('click', () => {
    selectPanel('overview');
    document.querySelector('[data-panel-target="overview"]').focus();
  });
})();
