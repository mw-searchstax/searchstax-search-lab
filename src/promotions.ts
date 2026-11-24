import { setupLessonProgress } from './lesson-progress';

const CLINIC_QUERY = 'campus flu clinic';
const UNRELATED_QUERY = 'transit access';
const DEMO_SITE = 'https://mw-searchstax.github.io/university-health-search-demo/';
const DEMO_NEWS = DEMO_SITE + 'news/';
const DEMO_LOCATIONS = DEMO_SITE + 'locations/';

type DemoResult = { title: string; url: string; summary: string };

// These are the first five results for “campus flu clinic” on Nov 19, 2026.
// The shorter “flu clinic” search returned the same first three notices.
// The walkthrough simulates the placement of one indexed promotion.
const baseline: readonly DemoResult[] = [
  {
    title: 'Flu Clinic Updates — 2024 Archive',
    url: DEMO_NEWS + 'flu-clinic-update-2024/',
    summary: 'A fictional 2024 archive notice records a sample flu clinic updates pack of poster headings and document labels.',
  },
  {
    title: 'Flu Clinic Updates — 2025 Archive',
    url: DEMO_NEWS + 'flu-clinic-update-2025/',
    summary: 'A fictional 2025 archive notice describes revised headings and a large-print version of the sample flu clinic updates pack.',
  },
  {
    title: 'Flu Clinic Updates — 2026 Notice',
    url: DEMO_NEWS + 'flu-clinic-update-2026/',
    summary: 'A fictional 2026 notice brings the sample flu clinic updates pack and its historical editions into one reference set.',
  },
  {
    title: 'North Campus Clinic',
    url: DEMO_LOCATIONS + 'north-campus-clinic/',
    summary: 'A fictional northern teaching annex stores Primary Care and Neurology classroom materials.',
  },
  {
    title: 'South Campus Clinic',
    url: DEMO_LOCATIONS + 'south-campus-clinic/',
    summary: 'The South Campus Clinic building houses seminar rooms and teaching displays for Dermatology, Endocrinology, and Women’s Health.',
  },
];

// The first three live results for the unrelated query on Nov 19, 2026.
const unrelatedResults: readonly DemoResult[] = [
  {
    title: 'Transit Access',
    url: DEMO_SITE + 'community/transit-access/',
    summary: 'A fictional campus-map guide explains pedestrian, covered-link and transit symbols without real routes or schedules.',
  },
  {
    title: 'Community at Central County',
    url: DEMO_SITE + 'community/',
    summary: 'Explore enduring programs for reading health information, understanding campus maps and connecting university teaching with public-service subjects.',
  },
  {
    title: 'Accessibility and Language Support',
    url: DEMO_SITE + 'care/resources/accessibility-and-language-support/',
    summary: 'Large-print samples, glossary layouts, and fictional wayfinding symbols are grouped as design references.',
  },
];

const [archive2024, archive2025, currentNotice, northClinic, southClinic] = baseline;

function withPromotion(results: readonly DemoResult[]) {
  return [currentNotice, ...results.filter(result => result !== currentNotice)];
}

// Observed in the live Ranking example for the same query on Nov 19, 2026.
const titleBoost = [northClinic, southClinic, archive2024, archive2025, currentNotice];

function renderClinicComparison(body: HTMLTableSectionElement) {
  const promoted = withPromotion(baseline);

  baseline.forEach((original, index) => {
    const row = body.insertRow();
    const rank = document.createElement('th');
    rank.scope = 'row';
    rank.textContent = String(index + 1);
    row.append(rank);

    for (const result of [original, promoted[index], titleBoost[index]]) {
      const cell = row.insertCell();
      const title = result.title.replace(/^Flu Clinic Updates — /, '');
      if (result === currentNotice) {
        cell.className = 'promotions-lab__current-notice';
        const emphasis = document.createElement('strong');
        emphasis.textContent = title;
        cell.append(emphasis);
      } else {
        cell.textContent = title;
      }
    }
  });
}

function renderResults(list: HTMLElement, results: readonly DemoResult[], featured = false) {
  list.replaceChildren(...results.map(result => {
    const item = document.createElement('li');
    item.className = 'promotions-lab__result';
    const link = document.createElement('a');
    link.href = result.url;
    link.textContent = result.title;
    item.append(link);

    if (featured && result === currentNotice) {
      const marker = document.createElement('span');
      marker.className = 'promotions-lab__promoted';
      marker.textContent = 'Promoted';
      item.append(marker);
    }

    const description = document.createElement('p');
    description.textContent = result.summary;
    item.append(description);
    return item;
  }));
}

function renderClinicOrder(list: HTMLOListElement, results: readonly DemoResult[]) {
  list.replaceChildren(...results.map(result => {
    const item = document.createElement('li');
    item.className = 'promotions-lab__result';
    item.classList.toggle('promotions-lab__current-notice', result === currentNotice);
    const link = document.createElement('a');
    link.href = result.url;
    link.textContent = result.title;
    item.append(link);
    return item;
  }));
}

function setupPromotionWalkthrough(section: HTMLElement) {
  const results = section.querySelector<HTMLOListElement>('[data-promotion-results]')!;
  const feature = section.querySelector<HTMLInputElement>('[data-promotion-feature]')!;
  const query = section.querySelector<HTMLElement>('[data-promotion-query]')!;
  const why = section.querySelector<HTMLElement>('[data-promotion-why]')!;
  const heading = section.querySelector<HTMLElement>('[data-promotion-heading]')!;
  const outcome = section.querySelector<HTMLElement>('[data-promotion-outcome]')!;
  const optional = section.querySelector<HTMLElement>('[data-promotion-optional]')!;
  const switchQuery = section.querySelector<HTMLButtonElement>('[data-promotion-switch]')!;
  const next = section.querySelector<HTMLElement>('[data-promotion-next]')!;
  let checkingTransit = false;

  function render() {
    const promoted = feature.checked && !checkingTransit;
    const sample = checkingTransit ? unrelatedResults : baseline;
    renderResults(results, promoted ? withPromotion(sample) : sample, promoted);
    query.textContent = checkingTransit ? UNRELATED_QUERY : CLINIC_QUERY;
    why.hidden = optional.hidden = !feature.checked;
    heading.textContent = checkingTransit ? 'Why Transit Access is still first' : 'Why the notice moved up';
    outcome.textContent = checkingTransit
      ? 'This search doesn’t contain “flu clinic,” so the promotion has no effect.'
      : 'You chose the 2026 notice for searches containing “flu clinic.” The visitor searched for “campus flu clinic,” so your choice applies. Both archives are still available below it. In Site Search, this is called a promotion.';
    switchQuery.textContent = checkingTransit ? 'Back to “campus flu clinic”' : 'Check “transit access”';
  }

  function showClinicSearch() {
    checkingTransit = false;
    render();
  }

  setupLessonProgress(section, feature, next, showClinicSearch);
  feature.addEventListener('change', showClinicSearch);
  switchQuery.addEventListener('click', () => {
    checkingTransit = !checkingTransit;
    render();
  });
  render();
}

const promotedOrder = document.querySelector<HTMLOListElement>('[data-clinic-promoted-order]');
if (promotedOrder) renderClinicOrder(promotedOrder, withPromotion(baseline).slice(0, 3));

const promotionSection = document.querySelector<HTMLElement>('[data-lab-screen="promotions"]');
if (promotionSection) setupPromotionWalkthrough(promotionSection);

const clinicComparison = document.querySelector<HTMLTableSectionElement>('[data-clinic-comparison]');
if (clinicComparison) renderClinicComparison(clinicComparison);
