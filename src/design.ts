import { webURL } from './web-url.js';

const FONT_STACKS = {
  arial: 'Arial, Helvetica, sans-serif',
  verdana: 'Verdana, Geneva, sans-serif',
  tahoma: 'Tahoma, Geneva, sans-serif',
  trebuchet: '"Trebuchet MS", Helvetica, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  times: '"Times New Roman", Times, serif',
  courier: '"Courier New", Courier, monospace',
};

const RESULT_GAPS = {
  compact: '6px',
  standard: '12px',
  roomy: '20px',
};

const CORNER_RADII = { standard: '5px', square: '0px', rounded: '14px' };

export const PAGE_SIZES = [5, 10, 20] as const;

export type DesignSettings = {
  layout: 'list' | 'cards';
  resultSpacing: keyof typeof RESULT_GAPS;
  filterPlacement: 'sidebar' | 'top';
  topFilterStyle: 'list' | 'row';
  relatedPlacement: 'above' | 'below' | 'off';
  profileTabs: boolean;
  languagePicker: boolean;
  filters: boolean;
  showDescriptions: boolean;
  showThumbnails: boolean;
  showSorting: boolean;
  showSuggestions: boolean;
  showSmartAnswersSample: boolean;
  samplePromotions: 'off' | 'indexed' | 'external' | 'both';
  resultsPerPage: typeof PAGE_SIZES[number];
  color: string;
  background: string;
  logoURL: string;
  corners: keyof typeof CORNER_RADII;
  listDividers: boolean;
  underlineTitles: boolean;
  font: keyof typeof FONT_STACKS;
  searchFieldText: string;
  searchButtonText: string;
  noResultsText: string;
};

export const DEFAULT_DESIGN: Readonly<DesignSettings> = {
  layout: 'list',
  resultSpacing: 'standard',
  filterPlacement: 'sidebar',
  topFilterStyle: 'list',
  relatedPlacement: 'below',
  profileTabs: false,
  languagePicker: false,
  filters: true,
  showDescriptions: true,
  showThumbnails: false,
  showSorting: true,
  showSuggestions: false,
  showSmartAnswersSample: true,
  samplePromotions: 'off',
  resultsPerPage: 10,
  color: '#263f58',
  background: '#ffffff',
  logoURL: '',
  corners: 'standard',
  listDividers: true,
  underlineTitles: false,
  font: 'arial',
  searchFieldText: 'Search the website',
  searchButtonText: 'Search',
  noResultsText: 'No matching pages. Try another search or remove a filter.',
};

export function isLayout(value: string | null): value is DesignSettings['layout'] {
  return value === 'list' || value === 'cards';
}

export function isResultSpacing(value: string | null): value is DesignSettings['resultSpacing'] {
  return value !== null && Object.hasOwn(RESULT_GAPS, value);
}

export function readPageSize(value: string | null): DesignSettings['resultsPerPage'] {
  return PAGE_SIZES.find(size => String(size) === value) ?? DEFAULT_DESIGN.resultsPerPage;
}

export function readSamplePromotions(value: string | null): DesignSettings['samplePromotions'] {
  return value === 'indexed' || value === 'external' || value === 'both' ? value : 'off';
}

export function isFont(value: string | null): value is DesignSettings['font'] {
  return value !== null && Object.hasOwn(FONT_STACKS, value);
}

export function isHexColor(value: string): boolean {
  return /^#[\da-f]{6}$/i.test(value);
}

export function readCorners(value: string | null): DesignSettings['corners'] {
  return value !== null && Object.hasOwn(CORNER_RADII, value)
    ? value as DesignSettings['corners'] : DEFAULT_DESIGN.corners;
}

export function readLogoURL(value: string | null): string {
  const url = webURL(value ?? '');
  return url?.startsWith('https:') ? url : '';
}

export function resolveSearchText(value: string | null, fallback: string): string {
  return value?.replace(/[\r\n]+/g, ' ').trim() || fallback;
}

export function readDesignParams(params: URLSearchParams): DesignSettings {
  // Earlier share links and session drafts always wrote these four fields and omitted sorting when off.
  const savedDesign = ['lab_layout', 'lab_color', 'lab_font', 'lab_filters'].every(key => params.has(key));
  const layout = params.get('lab_layout');
  const topStyle = params.get('lab_top_filters');
  const spacing = params.get('lab_spacing');
  const font = params.get('lab_font');
  const color = '#' + (params.get('lab_color') ?? '').toLowerCase();
  const background = '#' + (params.get('lab_background') ?? '').toLowerCase();

  return {
    layout: isLayout(layout) ? layout : DEFAULT_DESIGN.layout,
    resultSpacing: isResultSpacing(spacing) ? spacing : DEFAULT_DESIGN.resultSpacing,
    topFilterStyle: topStyle === 'row' || topStyle === 'tabs' ? 'row' : 'list',
    filterPlacement: params.get('lab_filter_placement') === 'top' ? 'top' : 'sidebar',
    relatedPlacement: params.get('lab_related') === 'above' ? 'above' : params.get('lab_related') === 'off' ? 'off' : 'below',
    languagePicker: params.has('lab_languages') ? params.get('lab_languages') === 'on' : params.get('lab_profile_tabs') === 'on',
    profileTabs: params.get('lab_profile_tabs') === 'on',
    filters: params.get('lab_filters') !== 'off',
    showDescriptions: params.get('lab_descriptions') !== 'off',
    showThumbnails: params.get('lab_thumbnails') === 'on',
    showSorting: params.has('lab_sorting') ? params.get('lab_sorting') === 'on' : !savedDesign && DEFAULT_DESIGN.showSorting,
    showSuggestions: params.get('lab_suggestions') === 'on',
    showSmartAnswersSample: params.get('lab_answer_sample') !== 'off',
    samplePromotions: readSamplePromotions(params.get('lab_promotions')),
    resultsPerPage: readPageSize(params.get('lab_page_size')),
    color: isHexColor(color) ? color : DEFAULT_DESIGN.color,
    background: isHexColor(background) ? background : DEFAULT_DESIGN.background,
    logoURL: readLogoURL(params.get('lab_logo')),
    corners: readCorners(params.get('lab_corners')),
    listDividers: params.get('lab_dividers') !== 'off',
    underlineTitles: params.get('lab_underline') === 'on',
    font: isFont(font) ? font : DEFAULT_DESIGN.font,
    searchFieldText: resolveSearchText(params.get('lab_field_text'), DEFAULT_DESIGN.searchFieldText),
    searchButtonText: resolveSearchText(params.get('lab_button_text'), DEFAULT_DESIGN.searchButtonText),
    noResultsText: resolveSearchText(params.get('lab_no_results_text'), DEFAULT_DESIGN.noResultsText),
  };
}

export function writeDesignParams(params: URLSearchParams, design: DesignSettings): void {
  if (design.languagePicker || design.profileTabs) params.set('lab_languages', design.languagePicker ? 'on' : 'off');
  if (design.profileTabs) params.set('lab_profile_tabs', 'on');
  params.set('lab_layout', design.layout);
  params.set('lab_color', design.color.slice(1));
  params.set('lab_font', design.font);
  params.set('lab_filters', design.filters ? 'on' : 'off');
  if (design.topFilterStyle !== 'list') params.set('lab_top_filters', design.topFilterStyle);
  if (design.filterPlacement === 'top') params.set('lab_filter_placement', 'top');
  if (design.relatedPlacement !== 'below') params.set('lab_related', design.relatedPlacement);
  if (design.background !== DEFAULT_DESIGN.background) params.set('lab_background', design.background.slice(1));
  if (design.logoURL) params.set('lab_logo', design.logoURL);
  if (design.corners !== DEFAULT_DESIGN.corners) params.set('lab_corners', design.corners);
  if (!design.listDividers) params.set('lab_dividers', 'off');
  if (design.underlineTitles) params.set('lab_underline', 'on');
  if (design.resultSpacing !== DEFAULT_DESIGN.resultSpacing) {
    params.set('lab_spacing', design.resultSpacing);
  }
  if (!design.showDescriptions) {
    params.set('lab_descriptions', 'off');
  }
  if (design.showThumbnails) {
    params.set('lab_thumbnails', 'on');
  }
  params.set('lab_sorting', design.showSorting ? 'on' : 'off');
  if (design.showSuggestions) {
    params.set('lab_suggestions', 'on');
  }
  if (!design.showSmartAnswersSample) {
    params.set('lab_answer_sample', 'off');
  }
  if (design.samplePromotions !== 'off') {
    params.set('lab_promotions', design.samplePromotions);
  }
  if (design.resultsPerPage !== DEFAULT_DESIGN.resultsPerPage) {
    params.set('lab_page_size', String(design.resultsPerPage));
  }
  if (design.searchFieldText !== DEFAULT_DESIGN.searchFieldText) {
    params.set('lab_field_text', design.searchFieldText);
  }
  if (design.searchButtonText !== DEFAULT_DESIGN.searchButtonText) {
    params.set('lab_button_text', design.searchButtonText);
  }
  if (design.noResultsText !== DEFAULT_DESIGN.noResultsText) {
    params.set('lab_no_results_text', design.noResultsText);
  }
}

function contrastText(color: string) {
  const channels = [1, 3, 5].map(index => {
    const channel = parseInt(color.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const [red, green, blue] = channels;
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
  const contrastOnBlack = (luminance + 0.05) / 0.05;
  const contrastOnWhite = 1.05 / (luminance + 0.05);
  return contrastOnBlack >= contrastOnWhite ? '#000000' : '#ffffff';
}

export function designVariables(design: DesignSettings) {
  const topStyle = design.filterPlacement === 'top' ? design.topFilterStyle : 'list';
  const darkBackground = contrastText(design.background) === '#ffffff';
  return {
    '--search-accent': design.color,
    '--search-accent-text': contrastText(design.color),
    '--search-background': design.background,
    // Keep the original palette on white and choose a contrasting ink for custom colors.
    '--search-ink': design.background === DEFAULT_DESIGN.background ? '#202e3a' : contrastText(design.background),
    '--search-title-ink': design.background === DEFAULT_DESIGN.background ? '#263f58' : contrastText(design.background),
    '--search-divider': design.background === DEFAULT_DESIGN.background ? '#d8dfe3' : (darkBackground ? '#a1aab1' : '#79838a'),
    '--search-corners': CORNER_RADII[design.corners],
    '--search-filter-display': topStyle === 'list' ? 'block' : 'flex',
    '--search-font': FONT_STACKS[design.font],
    '--search-result-gap': RESULT_GAPS[design.resultSpacing],
  };
}
