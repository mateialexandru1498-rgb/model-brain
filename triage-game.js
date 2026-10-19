'use strict';

(() => {
  const CASES = [
    {
      id: 'case-1', name: 'Case A', age: 52, context: 'Recently started adjuvant treatment. Reports persistent worry, poor sleep and difficulty concentrating.',
      concern: '“I cannot stop thinking that the cancer will progress.”',
      scores: { anxiety: 12, depression: 7, fop: 36, helplessness: 19, acceptance: 12, benefits: 13 },
      correct: { priority: 'high', action: 'refer', evidence: 'screening' },
      rationale: 'Anxiety is in the moderate band, FoP-12 is above the dysfunctional threshold and helplessness is high. The pattern supports timely psychological assessment, not a diagnosis.'
    },
    {
      id: 'case-2', name: 'Case B', age: 67, context: 'Attending a routine oncology appointment. Describes occasional worry but remains engaged in daily activities.',
      concern: '“Some days are difficult, but I can usually regain my balance.”',
      scores: { anxiety: 9, depression: 8, fop: 29, helplessness: 15, acceptance: 17, benefits: 16 },
      correct: { priority: 'planned', action: 'focused', evidence: 'borderline' },
      rationale: 'Both HADS scores are borderline, while FoP-12 and ICQ high-burden thresholds are not reached. A planned conversation and focused follow-up are proportionate.'
    },
    {
      id: 'case-3', name: 'Case C', age: 59, context: 'Stable follow-up visit. Reports good family support and no current psychological concern.',
      concern: '“I know difficult days may return, but at present I feel supported.”',
      scores: { anxiety: 5, depression: 4, fop: 22, helplessness: 9, acceptance: 20, benefits: 21 },
      correct: { priority: 'monitor', action: 'rescreen', evidence: 'future' },
      rationale: 'No screening threshold is reached. Routine monitoring is appropriate, while recognising that a low current score cannot guarantee future wellbeing.'
    },
    {
      id: 'case-4', name: 'Case D', age: 63, context: 'Reports reduced motivation and withdrawal from usual activities during treatment.',
      concern: '“I no longer feel interested in the things that normally matter to me.”',
      scores: { anxiety: 6, depression: 13, fop: 32, helplessness: 18, acceptance: 13, benefits: 12 },
      correct: { priority: 'high', action: 'refer', evidence: 'diagnosis' },
      rationale: 'Depression is in the moderate HADS band and helplessness is high. These are screening signals requiring assessment; HADS alone does not establish a clinical diagnosis.'
    },
    {
      id: 'case-5', name: 'Case E', age: 46, context: 'Maintains strong acceptance and identifies positive life changes, but reports intense recurrence-related fear.',
      concern: '“I have learned what matters to me, yet the possibility of progression overwhelms me.”',
      scores: { anxiety: 7, depression: 5, fop: 38, helplessness: 12, acceptance: 20, benefits: 19 },
      correct: { priority: 'high', action: 'refer', evidence: 'coexist' },
      rationale: 'FoP-12 exceeds the dysfunctional threshold even though acceptance and perceived benefits are high. Protective cognitions and psychological burden can coexist.'
    },
    {
      id: 'case-6', name: 'Case F', age: 71, context: 'Mentions increasing concern before each investigation and seeks clarification about the result.',
      concern: '“The days before a scan are becoming harder to manage.”',
      scores: { anxiety: 10, depression: 9, fop: 34, helplessness: 16, acceptance: 16, benefits: 15 },
      correct: { priority: 'high', action: 'refer', evidence: 'inclusive' },
      rationale: 'A FoP-12 score of exactly 34 meets the article’s dysfunctional threshold. The cut-off is inclusive, so timely assessment is appropriate.'
    },
    {
      id: 'case-7', name: 'Case G', age: 56, context: 'Reports feeling powerless in relation to illness decisions despite HADS scores in the normal band.',
      concern: '“Whatever I do, I feel the illness is controlling everything.”',
      scores: { anxiety: 7, depression: 6, fop: 30, helplessness: 20, acceptance: 10, benefits: 11 },
      correct: { priority: 'high', action: 'refer', evidence: 'whole' },
      rationale: 'Helplessness is high even though HADS scores are normal. Triage should consider the complete pattern rather than a single instrument.'
    },
    {
      id: 'case-8', name: 'Case H', age: 64, context: 'Describes mild worry and asks for practical strategies for difficult days.',
      concern: '“I would like a plan for the moments when worry starts to build.”',
      scores: { anxiety: 8, depression: 7, fop: 31, helplessness: 14, acceptance: 17, benefits: 17 },
      correct: { priority: 'planned', action: 'focused', evidence: 'borderline' },
      rationale: 'Anxiety is at the lower boundary of the borderline band without another high-burden threshold. Focused support and planned reassessment fit this pattern.'
    }
  ];

  const PRIORITIES = [
    { id: 'high', label: 'Timely assessment', detail: 'Prompt psycho-oncological follow-up' },
    { id: 'planned', label: 'Planned follow-up', detail: 'Explore concerns and reassess soon' },
    { id: 'monitor', label: 'Routine monitoring', detail: 'Continue regular screening' }
  ];

  const ACTIONS = [
    { id: 'refer', label: 'Offer psycho-oncology referral', detail: 'Specialist assessment and appropriate support' },
    { id: 'focused', label: 'Start a focused support conversation', detail: 'Clarify needs, resources and follow-up timing' },
    { id: 'rescreen', label: 'Continue routine rescreening', detail: 'Document the current result and monitor' }
  ];

  const EVIDENCE_OPTIONS = {
    'case-1': [
      { id: 'screening', label: 'The scores flag needs for assessment; they do not diagnose a disorder.' },
      { id: 'cause', label: 'The scores prove that treatment caused an anxiety disorder.' },
      { id: 'age', label: 'Age explains the entire psychological pattern.' }
    ],
    'case-2': [
      { id: 'borderline', label: 'Borderline scores are signals for discussion, not proof of a diagnosis.' },
      { id: 'ignore', label: 'Borderline scores should always be ignored.' },
      { id: 'severe', label: 'The patient has severe anxiety and depression.' }
    ],
    'case-3': [
      { id: 'future', label: 'Low scores describe the current assessment and do not guarantee future wellbeing.' },
      { id: 'never', label: 'No further psychological screening will ever be needed.' },
      { id: 'protected', label: 'High acceptance prevents all future distress.' }
    ],
    'case-4': [
      { id: 'diagnosis', label: 'An elevated HADS score supports assessment but is not itself a clinical diagnosis.' },
      { id: 'confirmed', label: 'HADS alone confirms a depressive disorder.' },
      { id: 'stage', label: 'The result identifies the patient’s cancer stage.' }
    ],
    'case-5': [
      { id: 'coexist', label: 'High acceptance can coexist with dysfunctional fear of progression.' },
      { id: 'cancel', label: 'High acceptance cancels the FoP-12 result.' },
      { id: 'contradiction', label: 'The scores are contradictory and therefore invalid.' }
    ],
    'case-6': [
      { id: 'inclusive', label: 'The FoP-12 threshold is inclusive: 34 or above is dysfunctional.' },
      { id: 'below', label: 'A score of 34 is below the dysfunctional threshold.' },
      { id: 'causal', label: 'The score proves that upcoming investigations caused the fear.' }
    ],
    'case-7': [
      { id: 'whole', label: 'The complete score pattern matters; normal HADS scores do not erase high helplessness.' },
      { id: 'hads-only', label: 'Only HADS can be used in psychological triage.' },
      { id: 'no-need', label: 'Normal HADS scores mean there is no support need.' }
    ],
    'case-8': [
      { id: 'borderline', label: 'A borderline signal supports proportionate follow-up and shared discussion.' },
      { id: 'diagnose', label: 'A HADS-A score of 8 confirms an anxiety disorder.' },
      { id: 'urgent', label: 'Every borderline score requires emergency intervention.' }
    ]
  };

  const state = {
    index: 0,
    answers: [],
    selection: { priority: null, action: null, evidence: null },
    submitted: false,
    showIntro: true,
    showResults: false
  };

  const esc = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const scoreBand = (key, value) => {
    if (key === 'anxiety' || key === 'depression') {
      if (value <= 7) return { label: 'Normal', tone: 'low' };
      if (value <= 10) return { label: 'Borderline', tone: 'watch' };
      if (value <= 14) return { label: 'Moderate', tone: 'high' };
      return { label: 'Severe', tone: 'high' };
    }
    if (key === 'fop') return value >= 34 ? { label: 'Dysfunctional', tone: 'high' } : { label: 'Below threshold', tone: 'low' };
    return value >= 18 ? { label: 'High', tone: key === 'helplessness' ? 'high' : 'positive' } : { label: 'Below high band', tone: 'low' };
  };

  const scoreLabels = {
    anxiety: ['HADS-A', 'Anxiety'], depression: ['HADS-D', 'Depression'], fop: ['FoP-12', 'Fear of progression'],
    helplessness: ['ICQ', 'Helplessness'], acceptance: ['ICQ', 'Acceptance'], benefits: ['ICQ', 'Perceived benefits']
  };

  function competencyScores() {
    const answered = state.answers.length;
    const correct = { priority: 0, action: 0, evidence: 0 };
    state.answers.forEach(answer => {
      Object.keys(correct).forEach(key => { if (answer.correct[key]) correct[key] += 1; });
    });
    return { answered, correct };
  }

  function meterMarkup() {
    const { answered, correct } = competencyScores();
    const meters = [
      ['priority', 'Screening'], ['action', 'Clinical reasoning'], ['evidence', 'Evidence caution']
    ];
    return `<div class="triage-competencies" aria-label="Competency progress">${meters.map(([key, label]) => {
      const pct = answered ? Math.round((correct[key] / CASES.length) * 100) : 0;
      return `<div><p><strong>${label}</strong><span>${correct[key]}/${CASES.length}</span></p><span class="triage-meter"><i style="width:${pct}%"></i></span></div>`;
    }).join('')}</div>`;
  }

  function introMarkup() {
    return `<section class="triage-intro" aria-labelledby="triageIntroTitle">
      <div class="triage-intro-main">
        <p class="triage-overline">Interactive evidence game</p>
        <h2 id="triageIntroTitle">Psycho-Oncology Triage</h2>
        <p>Review eight fictional screening profiles. For each case, choose a priority, a proportionate next step and the interpretation that stays within the article’s evidence.</p>
        <button type="button" class="triage-primary" data-triage-start>Start triage <i class="ph ph-arrow-right"></i></button>
      </div>
      <aside class="triage-how" aria-label="How the game works">
        <h3>Three decisions per case</h3>
        <ol><li><span>1</span>Read the six screening scores.</li><li><span>2</span>Select priority and support action.</li><li><span>3</span>Check the evidence boundary.</li></ol>
        <p><i class="ph ph-shield-check"></i> Educational simulation only. It does not diagnose or replace clinical judgement.</p>
      </aside>
    </section>`;
  }

  function scoreMarkup(caseItem) {
    return `<div class="triage-score-list">${Object.entries(caseItem.scores).map(([key, value]) => {
      const [instrument, label] = scoreLabels[key];
      const band = scoreBand(key, value);
      return `<div class="triage-score-row"><span><small>${instrument}</small><strong>${label}</strong></span><b>${value}</b><em class="is-${band.tone}">${band.label}</em></div>`;
    }).join('')}</div>`;
  }

  function choiceGroup(name, title, subtitle, options) {
    return `<fieldset class="triage-choice-group"><legend><span>${title}</span><small>${subtitle}</small></legend>
      <div class="triage-choices">${options.map(option => {
        const checked = state.selection[name] === option.id;
        const resultClass = state.submitted ? (option.id === CASES[state.index].correct[name] ? ' is-correct' : checked ? ' is-wrong' : '') : '';
        return `<label class="triage-choice${checked ? ' is-selected' : ''}${resultClass}"><input type="radio" name="${name}" value="${option.id}" ${checked ? 'checked' : ''} ${state.submitted ? 'disabled' : ''}><span><strong>${esc(option.label)}</strong>${option.detail ? `<small>${esc(option.detail)}</small>` : ''}</span><i class="ph ${option.id === CASES[state.index].correct[name] && state.submitted ? 'ph-check-circle' : 'ph-circle'}"></i></label>`;
      }).join('')}</div></fieldset>`;
  }

  function progressMarkup() {
    return `<div class="triage-case-progress" aria-label="Case progress"><strong>Case ${state.index + 1} of ${CASES.length}</strong><div>${CASES.map((item, index) => `<span class="${index < state.index ? 'is-complete' : index === state.index ? 'is-current' : ''}">${index < state.index ? '<i class="ph ph-check"></i>' : index + 1}</span>`).join('')}</div><em>Fictional learning case</em></div>`;
  }

  function caseMarkup() {
    const item = CASES[state.index];
    const evidence = EVIDENCE_OPTIONS[item.id].map(option => ({ ...option, detail: '' }));
    return `<section class="triage-game" aria-labelledby="triageTitle">
      <header class="triage-game-header"><div><p class="triage-overline">Evidence-based practice game</p><h2 id="triageTitle">Psycho-Oncology Triage</h2></div><button type="button" class="triage-text-button" data-triage-restart><i class="ph ph-arrow-clockwise"></i> Restart</button></header>
      ${progressMarkup()}
      <div class="triage-workspace">
        <article class="triage-case-card">
          <header><div><span>${esc(item.name)}</span><h3>Screening profile</h3></div><strong>Age ${item.age}</strong></header>
          <p class="triage-context">${esc(item.context)}</p>
          <blockquote>${esc(item.concern)}</blockquote>
          <h4>Psychological measures</h4>
          ${scoreMarkup(item)}
          <div class="triage-caution"><i class="ph ph-info"></i><p><strong>Evidence reminder</strong>Use screening thresholds to guide assessment. Do not infer diagnosis, causality or individual risk from demographic characteristics.</p></div>
        </article>
        <form class="triage-decision" data-triage-form>
          <div class="triage-decision-heading"><span>Your decision</span><strong>${state.submitted ? 'Feedback ready' : 'Complete all three choices'}</strong></div>
          ${choiceGroup('priority', '1. Choose a priority', 'How soon should this profile receive follow-up?', PRIORITIES)}
          ${choiceGroup('action', '2. Choose the next step', 'Select the most proportionate support action.', ACTIONS)}
          ${choiceGroup('evidence', '3. Check the evidence', 'Which interpretation is justified?', evidence)}
          <div class="triage-form-feedback ${state.submitted ? 'is-visible' : ''}" aria-live="polite">${state.submitted ? `<strong>${Object.values(state.answers.at(-1).correct).filter(Boolean).length}/3 decisions correct</strong><p>${esc(item.rationale)}</p>` : ''}</div>
          <p class="triage-form-error" aria-live="polite"></p>
          <div class="triage-form-actions">${state.submitted
            ? `<button type="button" class="triage-primary" data-triage-next>${state.index === CASES.length - 1 ? 'View results' : 'Next case'} <i class="ph ph-arrow-right"></i></button>`
            : '<button type="submit" class="triage-primary">Submit decision <i class="ph ph-arrow-right"></i></button>'}</div>
        </form>
      </div>
      ${meterMarkup()}
    </section>`;
  }

  function resultsMarkup() {
    const { correct } = competencyScores();
    const totalCorrect = Object.values(correct).reduce((sum, value) => sum + value, 0);
    const overall = Math.round((totalCorrect / (CASES.length * 3)) * 100);
    const rows = [['priority', 'Screening'], ['action', 'Clinical reasoning'], ['evidence', 'Evidence caution']];
    return `<section class="triage-results" aria-labelledby="triageResultsTitle">
      <div class="triage-results-hero"><div class="triage-result-ring" style="--result:${overall}"><span><strong>${overall}%</strong><small>overall</small></span></div><div><p class="triage-overline">Eight cases completed</p><h2 id="triageResultsTitle">Triage report</h2><p>You made ${totalCorrect} evidence-aligned decisions out of ${CASES.length * 3}.</p></div></div>
      <div class="triage-result-grid">${rows.map(([key, label]) => { const pct = Math.round((correct[key] / CASES.length) * 100); return `<article><div><strong>${label}</strong><span>${correct[key]}/${CASES.length}</span></div><span class="triage-result-bar"><i style="width:${pct}%"></i></span><p>${pct >= 75 ? 'Strong evidence-aligned judgement.' : pct >= 50 ? 'Developing; review the case feedback.' : 'Review thresholds and evidence limits.'}</p></article>`; }).join('')}</div>
      <div class="triage-review-list"><h3>Case review</h3>${state.answers.map((answer, index) => `<details ${index === 0 ? 'open' : ''}><summary><span>${CASES[index].name}</span><strong>${Object.values(answer.correct).filter(Boolean).length}/3 correct</strong><i class="ph ph-caret-down"></i></summary><p>${esc(CASES[index].rationale)}</p></details>`).join('')}</div>
      <div class="triage-results-actions"><button type="button" class="triage-primary" data-triage-restart><i class="ph ph-arrow-clockwise"></i> Play again</button></div>
      <p class="triage-disclaimer">This educational game uses fictional profiles and article-derived thresholds. It is not a clinical decision-support system.</p>
    </section>`;
  }

  function reset() {
    state.index = 0;
    state.answers = [];
    state.selection = { priority: null, action: null, evidence: null };
    state.submitted = false;
    state.showIntro = true;
    state.showResults = false;
    render();
  }

  function render() {
    const root = document.getElementById('scenarioContent');
    if (!root) return;
    root.innerHTML = state.showIntro ? introMarkup() : state.showResults ? resultsMarkup() : caseMarkup();
    bind(root);
  }

  function bind(root) {
    root.querySelector('[data-triage-start]')?.addEventListener('click', () => { state.showIntro = false; render(); });
    root.querySelectorAll('[data-triage-restart]').forEach(button => button.addEventListener('click', reset));
    root.querySelectorAll('input[type="radio"]').forEach(input => input.addEventListener('change', () => {
      state.selection[input.name] = input.value;
      render();
      root.querySelector(`input[name="${input.name}"][value="${input.value}"]`)?.focus({ preventScroll: true });
    }));
    root.querySelector('[data-triage-form]')?.addEventListener('submit', event => {
      event.preventDefault();
      if (Object.values(state.selection).some(value => !value)) {
        const error = root.querySelector('.triage-form-error');
        error.textContent = 'Choose one response in every section before submitting.';
        error.scrollIntoView({ block: 'nearest' });
        return;
      }
      const correctAnswers = CASES[state.index].correct;
      const correct = Object.fromEntries(Object.keys(correctAnswers).map(key => [key, state.selection[key] === correctAnswers[key]]));
      state.answers.push({ selection: { ...state.selection }, correct });
      state.submitted = true;
      render();
    });
    root.querySelector('[data-triage-next]')?.addEventListener('click', () => {
      if (state.index === CASES.length - 1) {
        state.showResults = true;
      } else {
        state.index += 1;
        state.selection = { priority: null, action: null, evidence: null };
        state.submitted = false;
      }
      render();
      document.getElementById('scenarioPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  window.PsychoOncologyTriage = { render, reset };
})();
