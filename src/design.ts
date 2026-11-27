import { webURL } from './web-url.js';
import { readMetadataStyles, type MetadataStyle } from './card-metadata.js';
import { readFacetGroupStyles, type FacetGroupStyle } from './facet-groups.js';

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
  thumbnailSize: 'small' | 'standard' | 'large';
  thumbnailPlacement: 'above' | 'leading';
  ribbonColor: string;
  ribbonShape: 'ribbon' | 'pill' | 'square';
  cardMetadata: MetadataStyle[];
  facetMode: 'or' | 'and' | 'tabs' | 'showUnavailable';
  facetDesktop: number;
  facetMobile: number;
  facetGroups: FacetGroupStyle[];
  highlightStyle: 'default' | 'bold' | 'italic' | 'color' | 'plain';
  promotionBadge: string;
  promotionHeading: string;
  badgeStyle: 'text' | 'pill';
  bannerStyle: 'tinted' | 'outline';
  bannerPlacement: 'above' | 'below';
  highlightText: string;
  highlightBackground: string;
  previewSource: 'app' | 'fictional';
  layout: 'list' | 'cards';
  resultSpacing: keyof typeof RESULT_GAPS;
  filterPlacement: 'sidebar' | 'top';
  topFilterStyle: 'list' | 'row';
  resultLinkTarget: '_self' | '_blank';
  relatedPlacement: 'above' | 'below' | 'off';
  relatedHeading: string;
  relatedItemStyle: 'buttons' | 'chips';
  relatedSpacing: 'standard' | 'compact';
  profileTabs: boolean;
  languagePicker: boolean;
  filters: boolean;
  showDescriptions: boolean;
  showThumbnails: boolean;
  showSorting: boolean;
  sortLabel: string;
  summaryMode: 'count' | 'range';
  summaryPlacement: 'above' | 'below';
  autoCorrect: boolean | null;
  sortPlacement: 'above' | 'below';
  startingSort: string;
  showSuggestions: boolean;
  suggestionMinChars: number | null;
  suggestionRowSpacing: 'standard' | 'compact';
  emphasizeSuggestionText: boolean;
  showSmartAnswersSample: boolean;
  smartAnswerHeading: string;
  smartAnswerCardStyle: 'accent' | 'outline';
  smartAnswerSourceStyle: 'inline' | 'cards';
  smartAnswerWordLimit: number;
  samplePromotions: 'off' | 'indexed' | 'external' | 'both';
  paginationMode: 'paged' | 'loadMore';
  paginationPlacement: 'above' | 'below' | 'both';
  loadMoreText: string;
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
  thumbnailSize: 'standard',
  thumbnailPlacement: 'above',
  ribbonColor: '',
  ribbonShape: 'ribbon',
  cardMetadata: [],
  facetMode: 'or',
  facetDesktop: 20,
  facetMobile: 20,
  facetGroups: [],
  highlightStyle: 'default',
  promotionBadge: 'Promoted',
  promotionHeading: 'Featured link',
  badgeStyle: 'text',
  bannerStyle: 'tinted',
  bannerPlacement: 'above',
  highlightText: '#202020',
  highlightBackground: '#ffec99',
  previewSource: 'app',
  layout: 'list',
  resultSpacing: 'standard',
  filterPlacement: 'sidebar',
  topFilterStyle: 'list',
  resultLinkTarget: '_self',
  relatedPlacement: 'below',
  relatedHeading: '',
  relatedItemStyle: 'buttons',
  relatedSpacing: 'standard',
  profileTabs: false,
  languagePicker: false,
  filters: true,
  showDescriptions: true,
  showThumbnails: false,
  showSorting: true,
  sortLabel: 'Sort by',
  summaryMode: 'count',
  summaryPlacement: 'above',
  autoCorrect: null,
  sortPlacement: 'above',
  startingSort: '',
  showSuggestions: false,
  suggestionMinChars: null,
  suggestionRowSpacing: 'standard',
  emphasizeSuggestionText: false,
  showSmartAnswersSample: true,
  smartAnswerHeading: '',
  smartAnswerCardStyle: 'accent',
  smartAnswerSourceStyle: 'inline',
  smartAnswerWordLimit: 100,
  samplePromotions: 'off',
  paginationMode: 'paged',
  paginationPlacement: 'below',
  loadMoreText: 'Load more',
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

export function readFacetLimit(value: string | null): number {
  const n = Number(value);
  return [3, 5, 10, 20].includes(n) ? n : 20;
}

export function readSuggestionMinimum(value: string | null): number | null {
  const minimum = Number(value);
  return Number.isSafeInteger(minimum) && minimum > 0 ? minimum : null;
}

export function readSmartAnswerWordLimit(value: string | null): number {
  const limit = Number(value);
  return Number.isSafeInteger(limit) && limit > 0 ? limit : DEFAULT_DESIGN.smartAnswerWordLimit;
}

export function readFacetMode(value: string | null): DesignSettings['facetMode'] {
  return value === 'and' || value === 'tabs' || value === 'showUnavailable' ? value : 'or';
}

export function readPageSize(value: string | null): DesignSettings['resultsPerPage'] {
  return PAGE_SIZES.find(size => String(size) === value) ?? DEFAULT_DESIGN.resultsPerPage;
}

export function readPaginationPlacement(value: string | null): DesignSettings['paginationPlacement'] {
  return value === 'above' || value === 'both' ? value : 'below';
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

export function readHighlightStyle(value: string | null): DesignSettings['highlightStyle'] {
  return value === 'bold' || value === 'italic' || value === 'color' || value === 'plain' ? value : 'default';
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

export function readDesignParams(params: URLSearchParams, allowFictionalPreview = false): DesignSettings {
  // Earlier share links and session drafts always wrote these four fields and omitted sorting when off.
  const savedDesign = ['lab_layout', 'lab_color', 'lab_font', 'lab_filters'].every(key => params.has(key));
  const layout = params.get('lab_layout');
  const topStyle = params.get('lab_top_filters');
  const spacing = params.get('lab_spacing');
  const font = params.get('lab_font');
  const color = '#' + (params.get('lab_color') ?? '').toLowerCase();
  const background = '#' + (params.get('lab_background') ?? '').toLowerCase();

  return {
    thumbnailSize: params.get('lab_image_size') === 'small' ? 'small' : params.get('lab_image_size') === 'large' ? 'large' : 'standard',
    thumbnailPlacement: params.get('lab_image_position') === 'leading' ? 'leading' : 'above',
    ribbonColor: readHighlightColor(params.get('lab_ribbon_color'), ''),
    ribbonShape: params.get('lab_ribbon_shape') === 'pill' ? 'pill' : params.get('lab_ribbon_shape') === 'square' ? 'square' : 'ribbon',
    cardMetadata: readMetadataStyles(params.get('lab_card_metadata')),
    facetMode: readFacetMode(params.get('lab_facet_mode')),
    facetDesktop: readFacetLimit(params.get('lab_facet_desktop')),
    facetMobile: readFacetLimit(params.get('lab_facet_mobile')),
    facetGroups: readFacetGroupStyles(params.get('lab_facet_groups')),
    promotionBadge: resolveSearchText(params.get('lab_badge'), DEFAULT_DESIGN.promotionBadge),
    promotionHeading: resolveSearchText(params.get('lab_promo_heading'), DEFAULT_DESIGN.promotionHeading),
    badgeStyle: params.get('lab_badge_style') === 'pill' ? 'pill' : 'text',
    bannerStyle: params.get('lab_banner_style') === 'outline' ? 'outline' : 'tinted',
    bannerPlacement: params.get('lab_banner_placement') === 'below' ? 'below' : 'above',
    highlightStyle: readHighlightStyle(params.get('lab_highlight')),
    highlightText: readHighlightColor(params.get('lab_hit_text'), DEFAULT_DESIGN.highlightText),
    highlightBackground: readHighlightColor(params.get('lab_hit_bg'), DEFAULT_DESIGN.highlightBackground),
    previewSource: allowFictionalPreview && params.get('lab_source') === 'fictional' ? 'fictional' : 'app',
    layout: isLayout(layout) ? layout : DEFAULT_DESIGN.layout,
    resultSpacing: isResultSpacing(spacing) ? spacing : DEFAULT_DESIGN.resultSpacing,
    topFilterStyle: topStyle === 'row' || topStyle === 'tabs' ? 'row' : 'list',
    filterPlacement: params.get('lab_filter_placement') === 'top' ? 'top' : 'sidebar',
    resultLinkTarget: params.get('lab_result_link_target') === '_blank' ? '_blank' : '_self',
    relatedPlacement: params.get('lab_related') === 'above' ? 'above' : params.get('lab_related') === 'off' ? 'off' : 'below',
    relatedHeading: resolveSearchText(params.get('lab_related_heading'), DEFAULT_DESIGN.relatedHeading),
    relatedItemStyle: params.get('lab_related_style') === 'chips' ? 'chips' : 'buttons',
    relatedSpacing: params.get('lab_related_spacing') === 'compact' ? 'compact' : 'standard',
    languagePicker: params.has('lab_languages') ? params.get('lab_languages') === 'on' : params.get('lab_profile_tabs') === 'on',
    profileTabs: params.get('lab_profile_tabs') === 'on',
    filters: params.get('lab_filters') !== 'off',
    showDescriptions: params.get('lab_descriptions') !== 'off',
    showThumbnails: params.get('lab_thumbnails') === 'on',
    showSorting: params.has('lab_sorting') ? params.get('lab_sorting') === 'on' : !savedDesign && DEFAULT_DESIGN.showSorting,
    sortLabel: resolveSearchText(params.get('lab_sort_label'), DEFAULT_DESIGN.sortLabel),
    summaryMode: params.get('lab_summary') === 'range' ? 'range' : 'count',
    summaryPlacement: params.get('lab_summary_placement') === 'below' ? 'below' : 'above',
    autoCorrect: params.get('lab_autocorrect') === 'on' ? true : params.get('lab_autocorrect') === 'off' ? false : null,
    sortPlacement: params.get('lab_sort_placement') === 'below' ? 'below' : 'above',
    startingSort: params.get('lab_starting_sort') ?? '',
    showSuggestions: params.get('lab_suggestions') === 'on',
    suggestionMinChars: readSuggestionMinimum(params.get('lab_suggestion_minimum')),
    suggestionRowSpacing: params.get('lab_suggestion_spacing') === 'compact' ? 'compact' : 'standard',
    emphasizeSuggestionText: params.get('lab_suggestion_emphasis') === 'on',
    showSmartAnswersSample: params.get('lab_answer_sample') !== 'off',
    smartAnswerHeading: resolveSearchText(params.get('lab_answer_heading'), DEFAULT_DESIGN.smartAnswerHeading),
    smartAnswerCardStyle: params.get('lab_answer_style') === 'outline' ? 'outline' : 'accent',
    smartAnswerSourceStyle: params.get('lab_answer_source_style') === 'cards' ? 'cards' : 'inline',
    smartAnswerWordLimit: readSmartAnswerWordLimit(params.get('lab_answer_word_limit')),
    samplePromotions: readSamplePromotions(params.get('lab_promotions')),
    paginationMode: params.get('lab_pagination') === 'loadMore' ? 'loadMore' : 'paged',
    paginationPlacement: readPaginationPlacement(params.get('lab_pagination_placement')),
    loadMoreText: resolveSearchText(params.get('lab_load_more_text'), DEFAULT_DESIGN.loadMoreText),
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
  for (const [key, value] of [
    ['lab_image_size', design.thumbnailSize !== 'standard' && design.thumbnailSize],
    ['lab_image_position', design.thumbnailPlacement !== 'above' && design.thumbnailPlacement],
    ['lab_ribbon_color', design.ribbonColor.slice(1)],
    ['lab_ribbon_shape', design.ribbonShape !== 'ribbon' && design.ribbonShape],
    ['lab_card_metadata', design.cardMetadata.length && JSON.stringify(design.cardMetadata)],
    ['lab_facet_groups', design.facetGroups.length && JSON.stringify(design.facetGroups)],
    ['lab_result_link_target', design.resultLinkTarget === '_blank' && '_blank'],
    ['lab_related_heading', design.relatedHeading],
    ['lab_related_style', design.relatedItemStyle === 'chips' && 'chips'],
    ['lab_related_spacing', design.relatedSpacing === 'compact' && 'compact'],
    ['lab_suggestion_spacing', design.suggestionRowSpacing === 'compact' && 'compact'],
    ['lab_suggestion_emphasis', design.emphasizeSuggestionText && 'on'],
    ['lab_answer_heading', design.smartAnswerHeading],
    ['lab_answer_style', design.smartAnswerCardStyle === 'outline' && 'outline'],
    ['lab_answer_source_style', design.smartAnswerSourceStyle === 'cards' && 'cards'],
  ] as const) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  if (design.smartAnswerWordLimit !== DEFAULT_DESIGN.smartAnswerWordLimit) {
    params.set('lab_answer_word_limit', String(design.smartAnswerWordLimit));
  } else {
    params.delete('lab_answer_word_limit');
  }
  if (design.facetMode !== DEFAULT_DESIGN.facetMode) params.set('lab_facet_mode', design.facetMode);
  if (design.facetDesktop !== DEFAULT_DESIGN.facetDesktop) params.set('lab_facet_desktop', String(design.facetDesktop));
  if (design.facetMobile !== DEFAULT_DESIGN.facetMobile) params.set('lab_facet_mobile', String(design.facetMobile));
  if (design.promotionBadge !== DEFAULT_DESIGN.promotionBadge) params.set('lab_badge', design.promotionBadge);
  if (design.promotionHeading !== DEFAULT_DESIGN.promotionHeading) params.set('lab_promo_heading', design.promotionHeading);
  if (design.badgeStyle !== DEFAULT_DESIGN.badgeStyle) params.set('lab_badge_style', design.badgeStyle);
  if (design.bannerStyle !== DEFAULT_DESIGN.bannerStyle) params.set('lab_banner_style', design.bannerStyle);
  if (design.bannerPlacement !== DEFAULT_DESIGN.bannerPlacement) params.set('lab_banner_placement', design.bannerPlacement);
  if (design.highlightStyle !== 'default') params.set('lab_highlight', design.highlightStyle);
  else params.delete('lab_highlight');
  for (const [key, value, fallback] of [
    ['lab_hit_text', design.highlightText, DEFAULT_DESIGN.highlightText],
    ['lab_hit_bg', design.highlightBackground, DEFAULT_DESIGN.highlightBackground],
  ]) {
    if (value !== fallback) params.set(key, value.slice(1));
    else params.delete(key);
  }
  if (design.previewSource === 'fictional') params.set('lab_source', 'fictional');
  else params.delete('lab_source');
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
  if (design.sortLabel !== DEFAULT_DESIGN.sortLabel) params.set('lab_sort_label', design.sortLabel);
  if (design.summaryMode === 'range') params.set('lab_summary', 'range');
  if (design.summaryPlacement === 'below') params.set('lab_summary_placement', 'below');
  if (design.autoCorrect === true) params.set('lab_autocorrect', 'on');
  else if (design.autoCorrect === false) params.set('lab_autocorrect', 'off');
  else params.delete('lab_autocorrect');
  if (design.sortPlacement !== DEFAULT_DESIGN.sortPlacement) params.set('lab_sort_placement', design.sortPlacement);
  if (design.startingSort) params.set('lab_starting_sort', design.startingSort);
  if (design.showSuggestions) {
    params.set('lab_suggestions', 'on');
  }
  if (design.suggestionMinChars !== null) params.set('lab_suggestion_minimum', String(design.suggestionMinChars));
  else params.delete('lab_suggestion_minimum');
  if (!design.showSmartAnswersSample) {
    params.set('lab_answer_sample', 'off');
  }
  if (design.samplePromotions !== 'off') {
    params.set('lab_promotions', design.samplePromotions);
  }
  if (design.paginationMode === 'loadMore') params.set('lab_pagination', design.paginationMode);
  if (design.paginationPlacement !== 'below') params.set('lab_pagination_placement', design.paginationPlacement);
  if (design.loadMoreText !== DEFAULT_DESIGN.loadMoreText) params.set('lab_load_more_text', design.loadMoreText);
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

function readHighlightColor(value: string | null, fallback: string) {
  return value && isHexColor('#' + value) ? '#' + value.toLowerCase() : fallback;
}

function relativeLuminance(color: string) {
  const channels = [1, 3, 5].map(index => {
    const channel = parseInt(color.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const [red, green, blue] = channels;
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

export function contrastRatio(foreground: string, background: string) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function contrastText(color: string) {
  const luminance = relativeLuminance(color);
  const contrastOnBlack = (luminance + 0.05) / 0.05;
  const contrastOnWhite = 1.05 / (luminance + 0.05);
  return contrastOnBlack >= contrastOnWhite ? '#000000' : '#ffffff';
}

export function designVariables(design: DesignSettings) {
  const topStyle = design.filterPlacement === 'top' ? design.topFilterStyle : 'list';
  const darkBackground = contrastText(design.background) === '#ffffff';
  return {
    '--card-thumbnail-width': { small: '6rem', standard: '12rem', large: '18rem' }[design.thumbnailSize],
    '--card-thumbnail-float': design.thumbnailPlacement === 'leading' ? 'inline-start' : 'none',
    '--card-thumbnail-limit': design.thumbnailPlacement === 'leading' ? '38%' : '100%',
    '--card-thumbnail-gap': design.thumbnailPlacement === 'leading' ? '1rem' : '0px',
    '--card-ribbon-color': design.ribbonColor || design.color,
    '--card-ribbon-ink': contrastText(design.ribbonColor || design.color),
    '--card-ribbon-radius': design.ribbonShape === 'pill' ? '999px' : '0px',
    '--card-ribbon-notch': design.ribbonShape === 'ribbon' ? '.6rem' : '0px',
    '--promotion-badge-padding': design.badgeStyle === 'pill' ? '2px 10px' : '0',
    '--promotion-badge-border': design.badgeStyle === 'pill' ? '1px solid currentColor' : '0',
    '--promotion-banner-background': design.bannerStyle === 'outline' ? 'transparent' : '#f3f7f4',
    '--promotion-banner-ink': design.bannerStyle === 'outline' ? 'inherit' : '#253a34',
    '--search-hit-weight': design.highlightStyle === 'bold' ? 'bold' : 'inherit',
    '--search-hit-style': design.highlightStyle === 'italic' ? 'italic' : 'inherit',
    '--search-hit-ink': design.highlightStyle === 'color'
      ? (contrastRatio(design.highlightText, design.highlightBackground) >= 4.5 ? design.highlightText : contrastText(design.highlightBackground))
      : design.highlightStyle === 'default' ? 'MarkText' : 'inherit',
    '--search-hit-background': design.highlightStyle === 'color' ? design.highlightBackground
      : design.highlightStyle === 'default' ? 'Mark' : 'transparent',
    '--search-hit-forced-ink': ['color', 'default'].includes(design.highlightStyle) ? 'HighlightText' : 'inherit',
    '--search-hit-forced-background': ['color', 'default'].includes(design.highlightStyle) ? 'Highlight' : 'transparent',
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
