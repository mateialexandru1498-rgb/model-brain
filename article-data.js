'use strict';

const ARTICLE = {
  title: 'Anxiety, Depression, Fear of Progression and Illness Adaptation in Breast Cancer Patients',
  doi: '10.70594/brain/17.3/36',
  keywords: ['breast cancer', 'anxiety', 'depression', 'fear of progression', 'illness adaptation'],
  methods: [
    ['Design', 'Observational, cross-sectional, multicentre, non-interventional study.'],
    ['Setting', 'Two hospitals in Romania: M Hospital Bucharest and "St. Apostol Andrei" Hospital, Galati, during one month, July 2026.'],
    ['Participants', '120 women with breast cancer; complete socio-demographic data, treatment data and questionnaire totals were available for all participants.'],
    ['Measures', 'Hospital Anxiety and Depression Scale (HADS), Illness Cognition Questionnaire (ICQ) and Short Fear of Progression Questionnaire (FoP-12).'],
    ['Analysis', 'Group comparisons and Spearman associations with Benjamini-Hochberg false discovery rate adjustment; high-burden co-occurrence tested with Fisher exact tests.']
  ],
  sample: [
    ['Sample size', '120 women'],
    ['Mean age', '64.03 years (SD 12.94)'],
    ['Study centres', 'Galati 70 (58.3%); Bucharest 50 (41.7%)'],
    ['Age group', '<65: 52 (43.3%); >=65: 68 (56.7%)'],
    ['Disease stage', 'I: 18 (15.0%); II: 36 (30.0%); III: 31 (25.8%); IV: 35 (29.2%)'],
    ['ECOG status', '0 or 1 in 102 patients (85.0%)'],
    ['Largest NCCN group', 'HR+/Luminal: 72 (60.0%)']
  ],
  burden: [
    {label: 'Anxiety at least borderline', value: 58, pct: '48.3%', note: '34 borderline, 19 moderate, 5 severe'},
    {label: 'Depression at least borderline', value: 59, pct: '49.2%', note: '39 borderline, 18 moderate, 2 severe'},
    {label: 'Dysfunctional fear of progression', value: 46, pct: '38.3%', note: 'Reported as dysfunctional in the article'},
    {label: 'High helplessness', value: 10, pct: '8.3%', note: 'Comparatively uncommon in this sample'},
    {label: 'High acceptance', value: 64, pct: '53.3%', note: 'About half the sample'},
    {label: 'High perceived benefits', value: 61, pct: '50.8%', note: 'About half the sample'}
  ],
  significantFindings: [
    {
      tag: 'Age group',
      title: 'Acceptance was higher below age 65',
      text: '<65 median 18.0 [17.0, 20.0] versus >=65 median 16.0 [14.0, 19.0]; Mann-Whitney U = 2296.0, p = .005, q = .029, rank-biserial r = .30.'
    },
    {
      tag: 'Age group',
      title: 'Perceived benefits were higher below age 65',
      text: '<65 mean 18.75 (SD 3.52) versus >=65 mean 16.81 (SD 3.06); Welch t(101.20) = 3.17, p = .002, q = .012, Hedges g = .59.'
    },
    {
      tag: 'ECOG',
      title: 'Helplessness varied by performance status',
      text: 'Kruskal-Wallis H(2) = 11.14, p = .004, q = .023, epsilon squared = .09. Dunn-Bonferroni located contrasts between ECOG 0 and ECOG 1 (p = .007) and between ECOG 0 and ECOG >=2 (p = .045); ECOG 1 and ECOG >=2 were not distinguished by the test (p = 1.000).'
    },
    {
      tag: 'Centre',
      title: 'Fear of progression was higher in Galati',
      text: 'Galati median 32.0, mean 33.40 (SD 9.35) versus Bucharest median 27.0, mean 26.20 (SD 11.08); U = 2410.50, p < .001, FDR p = .003, rank-biserial r = .38.'
    }
  ],
  correlations: [
    ['Anxiety and depression', 'rho = .767, 95% CI [.67, .84], p < .001'],
    ['Acceptance and helplessness', 'rho = -.443'],
    ['Acceptance and perceived benefits', 'rho = .642'],
    ['Anxiety and fear of progression', 'rho = .349'],
    ['Depression and helplessness', 'rho = .472'],
    ['Depression and fear of progression', 'rho = .265']
  ],
  coOccurrence: [
    ['Abnormal anxiety or depression with high helplessness', '7 patients had both; OR 6.52, 95% CI [1.58, 26.9], p = .008, q = .012, phi = .26'],
    ['Abnormal anxiety or depression with dysfunctional fear of progression', '21 patients had both; OR 3.30, 95% CI [1.47, 7.43], p = .004, q = .012, phi = .27'],
    ['High helplessness with dysfunctional fear of progression', '7 patients had both; OR 4.25, 95% CI [1.04, 17.4], p = .043, q = .043, phi = .20']
  ],
  figures: [
    {
      number: 1,
      title: 'Group differences that reached significance after correction for multiple testing',
      src: 'assets/figures/figure-1.png',
      caption: '(A) Acceptance by age group; (B) perceived benefits by age group; (C) helplessness by ECOG performance status; (D) fear of progression by study centre. The horizontal line marks the group median, the box spans the interquartile range, the whiskers extend to 1.5 times the interquartile range and the circles are individual values beyond that span; group sizes are given on the horizontal axis. The diamond in panel B marks the group mean. Panels A-C belong to the pre-specified patient family and panel D to the separate study-centre family.'
    },
    {
      number: 2,
      title: 'Spearman correlation matrix of the six psychological scores',
      src: 'assets/figures/figure-2.svg',
      caption: 'Cell shading is proportional to the coefficient; positive values indicate that the two scores increase together.'
    }
  ],
  conclusions: [
    'Anxiety and depression were common in this group of 120 women with breast cancer; about half reached at least the borderline band on each HADS subscale.',
    'Fear of progression was dysfunctional in 38.3%, although severe anxiety and depression scores were rare.',
    'The psychological measures were closely related to one another, including strong anxiety-depression association and links between acceptance, helplessness and perceived benefits.',
    'Few patient characteristics distinguished groups after correction for multiple testing; the surviving differences are exploratory and hypothesis-generating.',
    'The study supports routine psychological assessment and psycho-oncological support, but it did not test whether such support improves quality of life or adaptation.'
  ],
  scopeNotes: [
    'Cross-sectional design: each patient was assessed once, so temporal ordering and causal effects were not established.',
    'The results identify exploratory associations in this sample rather than established risk factors.',
    'No game or scenario in this app should be read as a real patient case unless explicitly marked as source data from the article.',
    'The article reports no external funding and no conflicts of interest.'
  ],
  scenarioConcepts: [
    {
      title: 'Screening Triage Board',
      type: 'Decision scenario with fictional patient profiles.',
      connection: 'Uses the article conclusion that anxiety, depression and fear of progression were common enough to support routine psychological assessment.',
      learning: 'Users learn to prioritize screening follow-up without treating demographics as deterministic risk factors.',
      complexity: 'Medium'
    },
    {
      title: 'High-Burden Pattern Mapper',
      type: 'Interactive association map based on fictional cases.',
      connection: 'Reflects the reported co-occurrence of abnormal anxiety/depression, high helplessness and dysfunctional fear of progression.',
      learning: 'Users learn how psychological burdens can overlap and why combined assessment matters.',
      complexity: 'Low to medium'
    },
    {
      title: 'Evidence Interpretation Challenge',
      type: 'Official-style quiz using article statements and source-backed feedback.',
      connection: 'Centres on corrected comparisons, exploratory findings and limits of cross-sectional inference.',
      learning: 'Users practice distinguishing significant associations, non-significant comparisons, exploratory findings and unsupported causal claims.',
      complexity: 'Low'
    },
    {
      title: 'Clinic Support Pathway',
      type: 'Branching fictional care-planning scenario.',
      connection: 'Builds on the article recommendation for psychological assessment and psycho-oncological support while avoiding claims about treatment efficacy.',
      learning: 'Users learn to match screening signals to appropriate support steps and documentation.',
      complexity: 'Medium to high'
    }
  ]
};
