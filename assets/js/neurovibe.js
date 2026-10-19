'use strict';
(() => {
  const root = document.getElementById('neurovibeLab');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const defaults = { hours: 4, years: 10, intensity: 1, equipment: 'normal', posture: 'standard', breaks: 'regular' };
  let scenario = { ...defaults }, mode = 'exposure', paused = false;
  const measures = new Set();
  const ranges = [
    { key: 'hours', name: 'Hours of exposure / day', max: 12, step: .5, unit: 'h', labels: ['0', '6', '12 h'] },
    { key: 'years', name: 'Years of exposure', max: 40, step: 1, unit: 'years', labels: ['0', '20', '40 years'] },
    { key: 'intensity', name: 'Vibration intensity', max: 3, step: .1, unit: '×', labels: ['None', 'Moderate', 'Higher'], hint: 'Relative input, not measured acceleration' }
  ];
  const segments = [
    { key: 'equipment', name: 'Equipment condition', choices: [['maintained', 'Maintained'], ['normal', 'Normal'], ['worn', 'Worn']] },
    { key: 'posture', name: 'Posture / seating quality', choices: [['optimized', 'Optimized'], ['standard', 'Standard'], ['poor', 'Poor']] },
    { key: 'breaks', name: 'Breaks / work organization', choices: [['few', 'Few'], ['regular', 'Regular'], ['structured', 'Structured']] }
  ];
  const interventions = [
    ['suspension', 'Improved seat suspension', 'Minimize transmission of mechanical forces.', 'Transmission', 'engineering', 'The article prioritizes improved seat suspension systems to minimize transmission of mechanical forces.'],
    ['damping', 'Vibration damping', 'Minimize transmission of mechanical forces.', 'Transmission', 'engineering', 'The article prioritizes vibration-damping technologies to minimize transmission of mechanical forces.'],
    ['maintenance', 'Equipment maintenance', 'Maintain machinery as part of exposure reduction.', 'Equipment', 'ergonomics', 'The article states that regular maintenance of machinery may further reduce exposure.'],
    ['posture', 'Posture optimization', 'Use appropriate seating alignment and posture.', 'Ergonomics', 'ergonomics', 'The article states that ergonomic optimization, including appropriate seating alignment and posture, may further reduce exposure.'],
    ['rotation', 'Task rotation', 'Help limit cumulative exposure.', 'Exposure pattern', 'organization', 'The article identifies task rotation as a strategy that may help limit cumulative exposure.'],
    ['rest', 'Scheduled rest periods', 'Help limit cumulative exposure.', 'Exposure pattern', 'organization', 'The article identifies scheduled rest periods as a strategy that may help limit cumulative exposure.']
  ];
  const interventionGroups = [
    ['engineering', 'Engineering controls', 'Act at the source or seat interface'],
    ['ergonomics', 'Equipment & ergonomics', 'Improve operating conditions and alignment'],
    ['organization', 'Work organization', 'Change the pattern of continuous exposure']
  ];
  const stages = [
    ['Mechanical Load', 'Repeated WBV transmission', 'waveform', 'Mechanical energy can propagate through seats and platforms toward the head. Frequency, posture and spinal resonance influence transmission.'],
    ['Microtrauma', 'Proposed subclinical stress', 'brain', 'Repeated low-intensity mechanical insults may contribute to subtle brain stress. Occupational WBV-induced microtrauma in humans has not been directly established.'],
    ['ROS', 'Reactive oxygen species', 'atom', 'Excess reactive oxygen species can challenge antioxidant defenses. Mitochondrial dysfunction may reinforce oxidative imbalance.'],
    ['Oxidative Stress', 'Damage / defense imbalance', 'dna', 'Oxidative imbalance can affect lipids, proteins and DNA. The Nrf2–Keap1 response provides a potential antioxidant and cytoprotective counterbalance.'],
    ['BBB Disruption', 'Potential barrier effects', 'wall', 'Blood–brain barrier disruption contributes to neuroinflammation, vascular dysregulation and progressive neuronal damage in brain-injury pathophysiology. A comparable occupational WBV effect remains biologically plausible but unconfirmed.'],
    ['Neuroinflammation', 'Potential neuronal effects', 'share-network', 'Inflammatory signaling and impaired cellular function could increase neuronal vulnerability. This does not establish WBV-induced neurodegeneration in people.']
  ];
  const evidence = [
    ['Mechanistic evidence', 'Biological plausibility', 'Oxidative stress, mitochondrial dysfunction, vascular changes and barrier disruption offer a plausible framework. Mechanisms do not prove occupational WBV causes brain injury in humans.'],
    ['Experimental evidence', 'Context-dependent models', 'Experimental models support investigating biological responses. Effects depend on exposure conditions; controlled WBV can also have protective effects in specific injury models.'],
    ['Indirect human evidence', 'Related conditions', 'Hand–arm vibration and traumatic brain injury research provide clues. These findings cannot be directly transferred to occupational whole-body vibration.'],
    ['Direct human evidence', 'Still limited', 'Occupational observations include fatigue, attention and balance changes, but direct demonstrations of WBV-induced human CNS injury are lacking. Noise, workload and psychosocial stress can confound observations.']
  ];
  $('#nvExposureControls').innerHTML = ranges.map(r => `<div class="nv-control"><div class="nv-control-header"><label for="nv-${r.key}">${r.name}</label><output id="nv-${r.key}-value" for="nv-${r.key}"></output></div><input id="nv-${r.key}" type="range" min="0" max="${r.max}" step="${r.step}" value="${defaults[r.key]}" ${r.hint ? 'aria-describedby="nv-intensity-hint"' : ''}><div class="nv-range-labels">${r.labels.map(x => `<span>${x}</span>`).join('')}</div>${r.hint ? `<p class="nv-control-note" id="nv-intensity-hint">${r.hint}</p>` : ''}</div>`).join('') + segments.map(s => `<div class="nv-control"><fieldset><legend>${s.name}</legend><div class="nv-segments">${s.choices.map(([key, name]) => `<button type="button" data-nv-setting="${s.key}" data-value="${key}" aria-pressed="${key === defaults[s.key]}">${name}</button>`).join('')}</div></fieldset></div>`).join('');
  $('#nvMeasures').innerHTML = interventionGroups.map(([group, title, caption]) => `<section class="nv-measure-group"><header><span>${title}</span><small>${caption}</small></header><div class="nv-measure-grid">${interventions.filter(item => item[4] === group).map(([key, name, description, category]) => `<article class="nv-measure"><label><span><em>${category}</em><strong>${name}</strong><small>${description}</small></span><input type="checkbox" data-nv-measure="${key}" aria-label="${name}"></label><button type="button" class="nv-measure-more" data-nv-explain="${key}" aria-expanded="false"><span>Article rationale</span><i class="ph ph-arrow-right" aria-hidden="true"></i></button></article>`).join('')}</div></section>`).join('');
  ranges.forEach(r => {
    const input = $(`#nv-${r.key}`);
    const wrap = document.createElement('div'); wrap.className = 'nv-range-wrap';
    input.before(wrap);
    const progress = document.createElement('progress');
    progress.max = r.max; progress.value = scenario[r.key]; progress.setAttribute('aria-hidden', 'true');
    wrap.append(progress, input);
  });
  $('#nvStages').innerHTML = stages.map(([name, caption, icon], i) => `<button class="nv-stage" type="button" data-nv-stage="${i}" aria-pressed="${i === 0}"><i class="ph ph-${icon}" aria-hidden="true"></i><strong>${name}</strong><small>${caption}</small></button>`).join('');
  $('#nvEvidenceTabs').innerHTML = evidence.map(([name, caption], i) => `<button type="button" data-nv-evidence="${i}" aria-pressed="${i === 3}">${name}<span>${caption}</span></button>`).join('');
  root.querySelectorAll('[data-nv-stage]').forEach((b, i) => {
    if (i === stages.length - 1) return;
    const icon = document.createElement('i'); icon.className = 'ph ph-arrow-right nv-rail-arrow';
    icon.setAttribute('aria-hidden', 'true'); b.append(icon);
  });
  const emphasize = (selector, chosen) => root.querySelectorAll(selector).forEach(b => b.setAttribute('aria-pressed', String(b === chosen)));
  const selectStage = i => {
    emphasize('[data-nv-stage]', $(`[data-nv-stage="${i}"]`));
    $('#nvStageDetail').innerHTML = `<strong>${stages[i][0]}</strong><p>${stages[i][3]}</p>`;
  };
  const selectEvidence = i => {
    emphasize('[data-nv-evidence]', $(`[data-nv-evidence="${i}"]`));
    $('#nvEvidenceDetail').textContent = evidence[i][2];
  };
  // Pedagogical weights only. No published or clinically validated coefficients.
  const calculate = (s, preventive) => {
    const equipment = { maintained: .8, normal: 1, worn: 1.25 }[s.equipment];
    const posture = { optimized: .8, standard: 1, poor: 1.2 }[s.posture];
    const breaks = { few: 1, regular: .85, structured: .7 }[s.breaks];
    let transmission = s.intensity / 3 * equipment * posture;
    let duration = s.hours / 12 * breaks;
    if (preventive) {
      if (measures.has('suspension')) transmission *= .8;
      if (measures.has('damping')) transmission *= .8;
      if (measures.has('maintenance')) transmission *= .85;
      if (measures.has('posture')) transmission *= .85;
      if (measures.has('rotation')) duration *= .8;
      if (measures.has('rest')) duration *= .8;
    }
    if (s.hours === 0 || s.years === 0 || s.intensity === 0) return { load: 0, burden: 0 };
    const load = Math.min(1, transmission * (.5 + .5 * duration));
    const burden = Math.min(1, transmission * duration * (s.years / 40) * 3);
    return { load, burden };
  };
  const word = value => value === 0 ? 'No simulated exposure' : value < .2 ? 'Lower' : value < .5 ? 'Moderate' : 'Higher';
  const settingLabel = key => segments.find(segment => segment.key === key).choices.find(([value]) => value === scenario[key])[1];
  let baseline = calculate(scenario, false), current = baseline;
  const update = () => {
    baseline = calculate(scenario, false); current = calculate(scenario, mode === 'intervention');
    ranges.forEach(r => {
      $(`#nv-${r.key}`).value = scenario[r.key];
      $(`#nv-${r.key}`).parentElement.querySelector('progress').value = scenario[r.key];
      const formatted = r.key === 'intensity' ? scenario[r.key].toFixed(1) : String(scenario[r.key]);
      $(`#nv-${r.key}-value`).textContent = `${formatted} ${r.unit}`;
      $(`#nv-${r.key}`).setAttribute('aria-valuetext', `${formatted} ${r.unit}${r.key === 'intensity' ? ', relative illustrative intensity' : ''}`);
    });
    segments.forEach(s => root.querySelectorAll(`[data-nv-setting="${s.key}"]`).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === scenario[s.key]))));
    $('#nvTransmission').textContent = `${word(current.load)}${current.load ? ' transmission' : ''}`;
    $('#nvHistory').textContent = `${scenario.hours} h/day · ${scenario.years} years`;
    const comparing = mode === 'intervention';
    const leftValue = comparing ? baseline.load : current.load;
    const rightValue = comparing ? current.load : current.burden;
    $('#nvLoadLabel').textContent = comparing ? 'BEFORE · TRANSMITTED VIBRATION' : 'TRANSMITTED VIBRATION';
    $('#nvBurdenLabel').textContent = comparing ? 'AFTER · TRANSMITTED VIBRATION' : 'CUMULATIVE EXPOSURE EMPHASIS';
    $('#nvLoadReadout').textContent = word(leftValue); $('#nvBurdenReadout').textContent = word(rightValue);
    $('#nvLoadBar').value = leftValue; $('#nvBurdenBar').value = rightValue;
    $('#nvLoadBar').setAttribute('aria-label', comparing ? 'Before baseline transmitted vibration' : 'Illustrative transmitted vibration, not a medical risk');
    $('#nvBurdenBar').setAttribute('aria-label', comparing ? 'After transmitted vibration with selected preventive measures' : 'Illustrative cumulative exposure emphasis, not a biological measurement');
    const narrative = current.burden === 0 ? 0 : Math.ceil(current.burden * 6);
    root.querySelectorAll('[data-nv-stage]').forEach((b, i) => b.classList.toggle('is-emphasized', i < narrative));
    const image = $('#nvMainScene > img');
    image.style.filter = `brightness(${.85 + current.load * .25}) saturate(${.75 + current.load * .4})`;
    $('[data-nv-side="after"] > img').style.filter = `brightness(${.8 + current.load * .3}) saturate(${.6 + current.load * .5})`;
    $('[data-nv-side="before"] > img').style.filter = `brightness(${.8 + baseline.load * .3}) saturate(${.6 + baseline.load * .5})`;
    $('#nvBeforeLabel').textContent = `${word(baseline.load)} transmission · ${word(baseline.burden).toLowerCase()} cumulative emphasis`;
    $('#nvBeforeSettings').textContent = `${scenario.hours} h/day · ${scenario.years} years · ${scenario.intensity.toFixed(1)}× · ${settingLabel('equipment')} equipment · ${settingLabel('posture')} seating · ${settingLabel('breaks')} breaks`;
    $('#nvAfterLabel').textContent = measures.size ? `${word(current.load)} transmission · ${measures.size} measure${measures.size > 1 ? 's' : ''} applied` : 'Same baseline · choose preventive measures';
    $('#nvMeasureSummary').textContent = measures.size ? `${measures.size} preventive measure${measures.size > 1 ? 's' : ''} applied to AFTER.` : 'No measures selected · AFTER matches the baseline.';
    const selectedNames = interventions.filter(([key]) => measures.has(key)).map(([, name]) => name);
    $('#nvAfterSettings').textContent = selectedNames.length ? selectedNames.join(' · ') : 'No preventive measures applied';
    $('#nvSelectedMeasures').hidden = selectedNames.length === 0;
    $('#nvSelectedMeasures').innerHTML = selectedNames.map(name => `<span>${name}</span>`).join('');
  };
  const setMode = value => {
    mode = value; const prevention = mode === 'intervention';
    emphasize('[data-nv-mode]', $(`[data-nv-mode="${value}"]`));
    $('#nvMainScene').hidden = prevention; $('#nvComparison').hidden = !prevention;
    $('#nvExposureControls').hidden = prevention; $('#nvInterventionControls').hidden = !prevention;
    $('.nv-insight-module').hidden = prevention;
    $('.nv-method').hidden = prevention;
    $('#nvControlTitle').textContent = prevention ? 'Preventive measures' : 'Exposure conditions';
    update();
  };
  ranges.forEach(r => $(`#nv-${r.key}`).addEventListener('input', e => { scenario[r.key] = Number(e.target.value); update(); }));
  root.querySelectorAll('[data-nv-setting]').forEach(b => b.addEventListener('click', () => { scenario[b.dataset.nvSetting] = b.dataset.value; update(); }));
  root.querySelectorAll('[data-nv-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.nvMode)));
  root.querySelectorAll('[data-nv-measure]').forEach(input => input.addEventListener('change', () => { input.checked ? measures.add(input.dataset.nvMeasure) : measures.delete(input.dataset.nvMeasure); update(); }));
  root.querySelectorAll('[data-nv-explain]').forEach(button => button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    root.querySelectorAll('[data-nv-explain]').forEach(item => item.setAttribute('aria-expanded', 'false'));
    if (expanded) {
      $('#nvExplanationTitle').textContent = 'Select a measure';
      $('#nvExplanationText').textContent = 'Use “Article rationale” to inspect how the review describes each preventive measure.';
      return;
    }
    const measure = interventions.find(([key]) => key === button.dataset.nvExplain);
    button.setAttribute('aria-expanded', 'true');
    $('#nvExplanationTitle').textContent = measure[1];
    $('#nvExplanationText').textContent = measure[5];
  }));
  $('#nvRecommended').addEventListener('click', () => {
    measures.clear(); interventions.forEach(([key]) => measures.add(key));
    root.querySelectorAll('[data-nv-measure]').forEach(input => input.checked = measures.has(input.dataset.nvMeasure));
    update();
  });
  root.querySelectorAll('[data-nv-stage]').forEach(b => b.addEventListener('click', () => selectStage(Number(b.dataset.nvStage))));
  root.querySelectorAll('[data-nv-focus]').forEach(b => b.addEventListener('click', () => {
    selectStage(Number(b.dataset.nvFocus));
  }));
  root.querySelectorAll('[data-nv-evidence]').forEach(b => b.addEventListener('click', () => selectEvidence(Number(b.dataset.nvEvidence))));
  $('#nvAdjustBaseline').addEventListener('click', () => setMode('exposure'));
  $('#nvReset').addEventListener('click', () => {
    scenario = { ...defaults }; measures.clear();
    root.querySelectorAll('[data-nv-measure]').forEach(input => input.checked = false);
    selectStage(0); selectEvidence(3); setMode('exposure');
  });
  ['#nvPause', '#nvComparePause'].forEach(selector => $(selector).addEventListener('click', () => {
    paused = !paused;
    ['#nvPause', '#nvComparePause'].forEach(id => {
      $(id).setAttribute('aria-pressed', String(paused));
      $(id).setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation');
      $(id).querySelector('span').textContent = paused ? 'Resume motion' : id === '#nvPause' ? 'Pause motion' : 'Pause comparison';
      $(id).querySelector('i').className = `ph ph-${paused ? 'play' : 'pause'}`;
    });
  }));
  // Dynamic signal overlays are conceptual visual cues, not measured anatomy or tissue response.
  const canvases = [...root.querySelectorAll('.nv-particles')].map(canvas => ({ canvas, ctx: canvas.getContext('2d') }));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const route = [[.24, .76], [.35, .77], [.48, .76], [.52, .66], [.56, .47], [.55, .29], [.53, .14], [.61, .13], [.7, .26], [.84, .36]];
  const pointAt = position => {
    const offset = position * (route.length - 1), index = Math.min(route.length - 2, Math.floor(offset));
    const fraction = offset - index, a = route[index], b = route[index + 1];
    return [a[0] + (b[0] - a[0]) * fraction, a[1] + (b[1] - a[1]) * fraction];
  };
  let last = 0, clock = 0;
  const draw = timestamp => {
    const elapsed = last ? Math.min(50, timestamp - last) : 0; last = timestamp;
    // Panel is outside root; keep inactive workbench from consuming animation work.
    const active = document.getElementById('explorerPanel').classList.contains('is-visible');
    if (!paused && !reducedMotion.matches && active && !document.hidden) clock += elapsed / 1000;
    if (active && !document.hidden) canvases.forEach(({ canvas, ctx }) => {
      const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height || !ctx) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(rect.width * ratio), height = Math.round(rect.height * ratio);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      ctx.clearRect(0, 0, width, height);
      const load = canvas.closest('[data-nv-side="before"]') ? baseline.load : current.load;
      const burden = canvas.closest('[data-nv-side="before"]') ? baseline.burden : current.burden;
      if (!load) return;
      const illustration = canvas.parentElement.querySelector('img');
      const imageBox = illustration.getBoundingClientRect();
      const fit = getComputedStyle(illustration).objectFit === 'contain' ? Math.min : Math.max;
      const scale = fit(imageBox.width / 1536, imageBox.height / 1024);
      const renderedWidth = 1536 * scale, renderedHeight = 1024 * scale;
      const positionX = canvas.closest('.nv-compare-scene') && window.innerWidth > 540 ? .43 : .5;
      const cropX = (renderedWidth - imageBox.width) * positionX;
      const cropY = (renderedHeight - imageBox.height) * .5;
      const scenePoint = ([x, y]) => [(x * renderedWidth - cropX) * ratio, (y * renderedHeight - cropY) * ratio];

      // Mechanical waves radiate from the seat/platform.
      const [seatX, seatY] = scenePoint([.255, .79]);
      for (let ring = 0; ring < 4; ring++) {
        const phase = (clock * (.48 + load * .9) + ring / 4) % 1;
        const radius = (14 + phase * (54 + load * 42)) * ratio;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,196,55,${(1 - phase) * (.15 + load * .55)})`;
        ctx.lineWidth = (1.2 + load * 2.2) * ratio;
        ctx.ellipse(seatX, seatY, radius, radius * .28, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // A traveling illuminated rail makes transmission through the body readable.
      ctx.save();
      ctx.beginPath();
      route.forEach((point, index) => {
        const [x, y] = scenePoint(point);
        index ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = `rgba(255,204,61,${.12 + load * .42})`;
      ctx.lineWidth = (1.2 + load * 3.5) * ratio;
      ctx.setLineDash([16 * ratio, 11 * ratio]);
      ctx.lineDashOffset = -clock * (28 + load * 75) * ratio;
      ctx.shadowColor = '#ffc83d'; ctx.shadowBlur = (5 + load * 15) * ratio;
      ctx.stroke();
      ctx.restore();

      // Local pulses show resonance along the spinal section.
      [3, 4, 5, 6].forEach((routeIndex, index) => {
        const [x, y] = scenePoint(route[routeIndex]);
        const pulse = .5 + .5 * Math.sin(clock * (3.2 + load * 4.5) - index * .9);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,224,139,${.12 + pulse * load * .5})`;
        ctx.lineWidth = (1 + load * 1.5) * ratio;
        ctx.arc(x, y, (4 + pulse * (5 + load * 8)) * ratio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // A synchronized arrival pulse marks the cranial compartment.
      const [brainX, brainY] = scenePoint([.535, .145]);
      for (let pulseIndex = 0; pulseIndex < 2; pulseIndex++) {
        const phase = (clock * (.35 + load * .6) + pulseIndex * .5) % 1;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,181,50,${(1 - phase) * (.1 + load * .45)})`;
        ctx.lineWidth = (1.2 + load * 1.7) * ratio;
        ctx.arc(brainX, brainY, (10 + phase * 46) * ratio, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Cellular-response sparks orbit the neuron inset as cumulative emphasis rises.
      const [rosX, rosY] = scenePoint([.835, .36]);
      const rosCount = Math.ceil(3 + burden * 20);
      for (let i = 0; i < rosCount; i++) {
        const angle = i * 2.399 + clock * (.24 + burden * .55) * (i % 2 ? 1 : -1);
        const orbit = (16 + (i % 5) * 9 + Math.sin(clock * 1.7 + i) * 4) * ratio;
        const x = rosX + Math.cos(angle) * orbit;
        const y = rosY + Math.sin(angle) * orbit * .72;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,91,55,${.2 + burden * .65})`;
        ctx.shadowColor = '#ff5538'; ctx.shadowBlur = (4 + burden * 10) * ratio;
        ctx.arc(x, y, (1.2 + burden * 2.2 + (i % 3) * .35) * ratio, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      const count = Math.ceil(4 + load * 18);
      for (let i = 0; i < count; i++) {
        const t = (clock * (.1 + load * .12 + burden * .05) + i / count) % 1;
        const [x, y] = pointAt(t);
        ctx.beginPath(); ctx.fillStyle = `rgba(255,214,104,${.25 + load * .65})`;
        ctx.shadowColor = '#ffbd32'; ctx.shadowBlur = 12 * ratio;
        ctx.arc((x * renderedWidth - cropX) * ratio, (y * renderedHeight - cropY) * ratio, (1.4 + load * 1.8) * ratio, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
    });
    window.requestAnimationFrame(draw);
  };
  selectStage(0); selectEvidence(3); update(); requestAnimationFrame(draw);
  if (window.location.hash === '#neurovibe') {
    document.querySelector('[data-panel-target="explorer"]').click();
    root.scrollIntoView({ block: 'start' });
  }
})();
