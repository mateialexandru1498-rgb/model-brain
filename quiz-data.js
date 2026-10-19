'use strict';

window.QUIZ_CONFIG = {
  title: 'Breast Cancer Adaptation Challenge',
  resultsTitle: 'Your evidence interpretation profile',
  visuals: {
    'instrument-map': `
      <div class="quiz-visual mechanism-map" aria-label="Three study instruments leading to six psychological scores">
        <div class="mechanism-inputs"><span>HADS</span><span>ICQ</span><span>FoP-12</span></div>
        <i class="ph ph-arrow-right"></i><div class="mechanism-core">6 psychological scores<br><small>One assessment per patient</small></div>
        <i class="ph ph-arrow-right"></i><div class="mechanism-output">Corrected comparisons</div>
      </div>`,
    'correlation-map': `
      <div class="quiz-visual gene-pathway" aria-label="Hidden value in the strongest psychological score correlation">
        <div class="gene-node">Anxiety</div><i class="ph ph-arrows-left-right"></i><div class="gene-node gene-missing">?</div><i class="ph ph-arrow-right"></i>
        <div class="gene-outcomes"><span>Strongest reported score association</span><span>Spearman rho = .767</span><span>Positive direction</span></div>
      </div>`
  },
  questions: [
    {
      id: 'q-design', type: 'single', topic: 'Study design', difficulty: 'Easy', points: 100,
      prompt: 'Which description best matches the study reported in article 36?',
      hint: 'Focus on whether the investigators assigned a treatment or followed change over time.',
      options: [
        { id: 'design-a', text: 'Randomised longitudinal intervention study' },
        { id: 'design-b', text: 'Observational, cross-sectional, multicentre and non-interventional study' },
        { id: 'design-c', text: 'Single-centre qualitative interview study' },
        { id: 'design-d', text: 'Retrospective case-control study' }
      ],
      correctOptionId: 'design-b',
      explanation: 'The researchers assessed each participant once in two Romanian hospitals without assigning an intervention, making the study observational, cross-sectional, multicentre and non-interventional.'
    },
    {
      id: 'q-instruments', type: 'matching', topic: 'Measures', difficulty: 'Medium', points: 150,
      prompt: 'Match each instrument with the outcomes it measured.',
      hint: 'Separate emotional symptoms, illness cognitions and fear of disease progression.',
      pairs: [
        { id: 'inst-hads', label: 'HADS', matchId: 'im-hads', match: 'Anxiety and depression', feedback: 'HADS has separate 7-item anxiety and depression subscales.' },
        { id: 'inst-icq', label: 'ICQ', matchId: 'im-icq', match: 'Helplessness, acceptance and perceived benefits', feedback: 'The 18-item ICQ contains three 6-item illness-cognition subscales.' },
        { id: 'inst-fop', label: 'FoP-12', matchId: 'im-fop', match: 'Fear of progression', feedback: 'FoP-12 is the 12-item short form used to assess fear of progression.' }
      ],
      explanation: 'HADS measured anxiety and depression, ICQ measured three dimensions of illness cognition, and FoP-12 measured fear of progression.'
    },
    {
      id: 'q-visual-instruments', type: 'visual-single', visual: 'instrument-map', topic: 'Measures', difficulty: 'Medium', points: 150,
      prompt: 'How many psychological scores were analysed from the three instruments shown?',
      hint: 'Count two HADS subscales, three ICQ subscales and one FoP-12 total.',
      options: [
        { id: 'vi-a', text: 'Three' },
        { id: 'vi-b', text: 'Four' },
        { id: 'vi-c', text: 'Six' },
        { id: 'vi-d', text: 'Nine' }
      ],
      correctOptionId: 'vi-c',
      explanation: 'The analysis used six scores: anxiety, depression, helplessness, acceptance, perceived benefits and fear of progression.'
    },
    {
      id: 'q-thresholds', type: 'matching', topic: 'Measures', difficulty: 'Hard', points: 200,
      prompt: 'Match each threshold with its interpretation in the study.',
      hint: 'HADS used both band distributions and a stricter high-burden definition; ICQ and FoP-12 used different ranges.',
      pairs: [
        { id: 'thr-hads8', label: 'HADS score 8-10', matchId: 'tm-border', match: 'Borderline band', feedback: 'Scores 8-10 formed the borderline HADS band.' },
        { id: 'thr-hads11', label: 'HADS score 11 or more', matchId: 'tm-elevated', match: 'Elevated anxiety or depression', feedback: 'The dichotomised high-burden indicator used the stricter threshold of 11 or more on either HADS subscale.' },
        { id: 'thr-icq18', label: 'ICQ subscale score 18-24', matchId: 'tm-high', match: 'High illness-cognition subscale', feedback: 'Scores from 18 to 24 were treated as high on helplessness, acceptance or perceived benefits.' },
        { id: 'thr-fop34', label: 'FoP-12 score 34 or more', matchId: 'tm-dysfunctional', match: 'Dysfunctional fear of progression', feedback: 'A FoP-12 total of at least 34 indicated dysfunctional fear of progression.' }
      ],
      explanation: 'The measures used distinct cut-offs, so the borderline HADS distribution should not be confused with the stricter high-burden HADS definition.'
    },
    {
      id: 'q-distributions', type: 'multi', topic: 'Results', difficulty: 'Medium', points: 150,
      prompt: 'Which score-distribution statements are correct? Select all that apply.',
      hint: 'Compare the number of patients in each category with the full sample of 120.',
      options: [
        { id: 'dist-a', text: 'Anxiety reached at least the borderline band in 58 patients (48.3%).', feedback: 'The article reports 58 patients at or above the borderline anxiety band.' },
        { id: 'dist-b', text: 'Depression reached at least the borderline band in 59 patients (49.2%).', feedback: 'The article reports 59 patients at or above the borderline depression band.' },
        { id: 'dist-c', text: 'Dysfunctional fear of progression was present in 46 patients (38.3%).', feedback: 'FoP-12 was dysfunctional in 46 of 120 patients.' },
        { id: 'dist-d', text: 'High helplessness was found in more than half the sample.', feedback: 'High helplessness was uncommon: 10 patients, or 8.3%.' },
        { id: 'dist-e', text: 'Severe anxiety and depression were common.', feedback: 'Only 5 patients had severe anxiety and 2 had severe depression, so severe scores were rare.' }
      ],
      correctOptionIds: ['dist-a', 'dist-b', 'dist-c'],
      explanation: 'About half reached at least borderline anxiety or depression, 38.3% had dysfunctional fear of progression, and severe scores and high helplessness were uncommon.'
    },
    {
      id: 'q-workflow', type: 'order', topic: 'Methods', difficulty: 'Hard', points: 200,
      prompt: 'Arrange the study process in the correct methodological order.',
      hint: 'Move from recruitment and measurement to test selection, multiplicity correction and cautious interpretation.',
      items: [
        { id: 'wf-1', text: 'Recruit eligible adults with confirmed breast cancer who provided consent', feedback: 'Eligibility and informed consent necessarily came before collecting questionnaire data.' },
        { id: 'wf-2', text: 'Administer HADS, ICQ and FoP-12 once to each participant', feedback: 'The cross-sectional assessment generated the six psychological scores.' },
        { id: 'wf-3', text: 'Use score distribution and factor levels to select the statistical test', feedback: 'Normality and the number of comparison levels governed the test choice.' },
        { id: 'wf-4', text: 'Adjust p values within pre-specified families using Benjamini-Hochberg FDR', feedback: 'Multiplicity correction was applied within each defined comparison family.' },
        { id: 'wf-5', text: 'Interpret surviving findings as exploratory and hypothesis-generating', feedback: 'The cross-sectional design, sample size and many tests limit confirmatory claims.' }
      ],
      correctOrder: ['wf-1', 'wf-2', 'wf-3', 'wf-4', 'wf-5'],
      explanation: 'The study progressed from eligible recruitment through one-time measurement and planned analysis to FDR correction and cautious exploratory interpretation.'
    },
    {
      id: 'q-significant', type: 'multi', topic: 'Results', difficulty: 'Hard', points: 200,
      prompt: 'Which group differences remained significant after correction for multiple testing? Select all that apply.',
      hint: 'Only four full-sample comparisons survived correction.',
      options: [
        { id: 'sig-a', text: 'Acceptance by age group', feedback: 'Acceptance was higher below age 65 and survived correction with q = .029.' },
        { id: 'sig-b', text: 'Perceived benefits by age group', feedback: 'Perceived benefits were higher below age 65 and survived correction with q = .012.' },
        { id: 'sig-c', text: 'Helplessness by ECOG performance status', feedback: 'Helplessness differed across ECOG groups with q = .023.' },
        { id: 'sig-d', text: 'Fear of progression by study centre', feedback: 'Fear of progression was higher in Galati and survived correction with FDR p = .003.' },
        { id: 'sig-e', text: 'Anxiety by disease stage', feedback: 'Disease stage was not significantly associated with anxiety or any other psychological score after adjustment.' },
        { id: 'sig-f', text: 'Depression by study centre', feedback: 'The centre difference in depression was significant before adjustment but not after it.' }
      ],
      correctOptionIds: ['sig-a', 'sig-b', 'sig-c', 'sig-d'],
      explanation: 'The four surviving differences concerned age with acceptance and perceived benefits, ECOG with helplessness, and centre with fear of progression.'
    },
    {
      id: 'q-sample-classify', type: 'classify', topic: 'Sample', difficulty: 'Medium', points: 150,
      prompt: 'Classify each sample fact into its correct category.',
      hint: 'Use the labels as reported in the sample-characteristics table.',
      groups: [
        { id: 'centre', label: 'Study centre' },
        { id: 'stage', label: 'Disease stage' },
        { id: 'ecog', label: 'ECOG status' },
        { id: 'molecular', label: 'NCCN molecular group' }
      ],
      items: [
        { id: 'sc-galati', text: 'Galati: 70 patients (58.3%)', groupId: 'centre', feedback: 'Galati is one of the two recruitment centres.' },
        { id: 'sc-stage4', text: 'Stage IV: 35 patients (29.2%)', groupId: 'stage', feedback: 'Stage IV is a disease-stage category.' },
        { id: 'sc-ecog01', text: 'Status 0 or 1: 102 patients (85.0%)', groupId: 'ecog', feedback: 'Scores 0 and 1 describe performance status.' },
        { id: 'sc-luminal', text: 'HR+/Luminal: 72 patients (60.0%)', groupId: 'molecular', feedback: 'HR+/Luminal was the largest NCCN molecular group.' }
      ],
      explanation: 'The sample table separates recruitment centre, disease stage, ECOG performance status and NCCN molecular classification.'
    },
    {
      id: 'q-correlation-visual', type: 'visual-single', visual: 'correlation-map', topic: 'Associations', difficulty: 'Easy', points: 100,
      prompt: 'Which score completes the strongest reported association shown in the diagram?',
      hint: 'Look for the pair with Spearman rho close to .77.',
      options: [
        { id: 'cv-a', text: 'Depression' },
        { id: 'cv-b', text: 'Acceptance' },
        { id: 'cv-c', text: 'Perceived benefits' },
        { id: 'cv-d', text: 'Fear of progression' }
      ],
      correctOptionId: 'cv-a',
      explanation: 'Anxiety and depression had the strongest reported association, with Spearman rho = .767 and a 95% confidence interval from .67 to .84.'
    },
    {
      id: 'q-correlation-direction', type: 'matching', topic: 'Associations', difficulty: 'Hard', points: 200,
      prompt: 'Match each pair of scores with the direction and strength reported.',
      hint: 'Acceptance moved opposite to helplessness but in the same direction as perceived benefits.',
      pairs: [
        { id: 'corr-ad', label: 'Anxiety and depression', matchId: 'cm-ad', match: 'Strong positive, rho = .767', feedback: 'This was the strongest association among the six scores.' },
        { id: 'corr-ah', label: 'Acceptance and helplessness', matchId: 'cm-ah', match: 'Moderate negative, rho = -.443', feedback: 'Greater acceptance was associated with less helplessness.' },
        { id: 'corr-ap', label: 'Acceptance and perceived benefits', matchId: 'cm-ap', match: 'Strong positive, rho = .642', feedback: 'Acceptance and perceived benefits moved together.' },
        { id: 'corr-af', label: 'Anxiety and fear of progression', matchId: 'cm-af', match: 'Positive, rho = .349', feedback: 'Higher anxiety was associated with higher fear of progression.' }
      ],
      explanation: 'The correlation matrix shows both burden-related positive associations and protective cognition patterns involving acceptance.'
    },
    {
      id: 'q-high-burden', type: 'single', topic: 'Associations', difficulty: 'Medium', points: 150,
      prompt: 'Which pair of high-burden states had the largest reported odds ratio?',
      hint: 'Compare the three reported odds ratios: 6.52, 3.30 and 4.25.',
      options: [
        { id: 'hb-a', text: 'Abnormal anxiety or depression with high helplessness' },
        { id: 'hb-b', text: 'Abnormal anxiety or depression with dysfunctional fear of progression' },
        { id: 'hb-c', text: 'High helplessness with dysfunctional fear of progression' },
        { id: 'hb-d', text: 'High acceptance with high perceived benefits' }
      ],
      correctOptionId: 'hb-a',
      explanation: 'Abnormal anxiety or depression with high helplessness had the largest odds ratio, 6.52, although the confidence interval was wide.'
    },
    {
      id: 'q-age-findings', type: 'single', topic: 'Results', difficulty: 'Medium', points: 150,
      prompt: 'Which interpretation of the age-group findings is accurate?',
      hint: 'The study compared women below 65 with women aged 65 or older.',
      options: [
        { id: 'age-a', text: 'Acceptance and perceived benefits were higher in women under 65.' },
        { id: 'age-b', text: 'Anxiety and depression were higher in women under 65.' },
        { id: 'age-c', text: 'Fear of progression was higher in women aged 65 or older.' },
        { id: 'age-d', text: 'All six psychological scores differed significantly by age.' }
      ],
      correctOptionId: 'age-a',
      explanation: 'Only acceptance and perceived benefits differed significantly by age group after correction, and both were higher among women younger than 65.'
    },
    {
      id: 'q-hads-order', type: 'order', topic: 'Measures', difficulty: 'Medium', points: 150,
      prompt: 'Arrange the HADS severity bands from lowest to highest score.',
      hint: 'Each band begins where the previous range ends.',
      items: [
        { id: 'ho-1', text: 'Normal: 0-7', feedback: 'The normal band begins at 0 and ends at 7.' },
        { id: 'ho-2', text: 'Borderline: 8-10', feedback: 'The borderline band follows the normal range.' },
        { id: 'ho-3', text: 'Moderate: 11-14', feedback: 'The moderate band begins at 11, also the study threshold for elevated HADS burden.' },
        { id: 'ho-4', text: 'Severe: 15-21', feedback: 'The severe band contains the highest HADS subscale scores.' }
      ],
      correctOrder: ['ho-1', 'ho-2', 'ho-3', 'ho-4'],
      explanation: 'Each HADS subscale ranges from 0 to 21: normal 0-7, borderline 8-10, moderate 11-14 and severe 15-21.'
    },
    {
      id: 'q-limits', type: 'multi', topic: 'Evidence', difficulty: 'Hard', points: 200,
      prompt: 'Which limitations or cautions are supported by the article? Select all that apply.',
      hint: 'Consider causal direction, statistical power, multiple testing and differences between centres.',
      options: [
        { id: 'lim-a', text: 'The cross-sectional design does not establish causal direction or change over time.', feedback: 'Each patient was assessed once, so causal and temporal claims are unsupported.' },
        { id: 'lim-b', text: 'The modest sample limited power for subgroup analyses.', feedback: 'Smaller categories were especially vulnerable to limited power.' },
        { id: 'lim-c', text: 'Only 4 of 126 testable full-sample group comparisons survived correction.', feedback: 'This small number of positive findings supports a hypothesis-generating interpretation.' },
        { id: 'lim-d', text: 'Residual confounding and differences in case mix between centres may remain.', feedback: 'The article explicitly notes possible residual confounding and centre differences.' },
        { id: 'lim-e', text: 'The study proved psycho-oncological support improves adaptation.', feedback: 'The study recommended support but did not test whether it improves quality of life or adaptation.' }
      ],
      correctOptionIds: ['lim-a', 'lim-b', 'lim-c', 'lim-d'],
      explanation: 'The evidence is exploratory because of the cross-sectional design, modest sample, many tests and possible residual confounding or centre case-mix differences.'
    },
    {
      id: 'q-conclusion', type: 'single', topic: 'Evidence', difficulty: 'Medium', points: 150,
      prompt: 'Which conclusion stays within what the study actually demonstrated?',
      hint: 'Distinguish a recommendation based on symptom frequency from proof of treatment effectiveness.',
      options: [
        { id: 'con-a', text: 'Routine psychological assessment is supported so symptoms can be identified and psycho-oncological support offered.' },
        { id: 'con-b', text: 'Psycho-oncological support was proven to improve quality of life.' },
        { id: 'con-c', text: 'Age, disease stage and molecular subtype are established causal risk factors.' },
        { id: 'con-d', text: 'Severe anxiety and depression affected most participants.' }
      ],
      correctOptionId: 'con-a',
      explanation: 'The symptom frequency supports routine assessment and access to support, but intervention effectiveness and causal risk factors were not tested.'
    }
  ]
};
