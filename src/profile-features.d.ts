import type { CustomerConnection, CustomerPage } from './customer-search';
import type { DesignSettings } from './design';
import type { Experience } from './profile-experiences';
export const spanishPromotionQuery: string;
export function orderDirectoryResults<T extends { url: string }>(items: T[], sort: string, query: string, setting: DesignSettings['samplePromotions']): (T & { promoted?: boolean })[];
export function setupProfileFeatures(panel: HTMLElement, submit: (term: string) => void): {
  clear(): void;
  update(design: DesignSettings, app: CustomerConnection | null, active: Experience, query: string): void;
  showExternalPromotions(promotions: CustomerPage['externalPromotions']): void;
};
