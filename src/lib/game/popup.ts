import type { EraId } from './constants';
import type { BuildingDef } from './buildings';
import { ERAS } from './eras';
import { loadDiscoveries, saveDiscoveries } from './persistence';

// DOM element references (cached on first use)
let popupEl: HTMLElement | null = null;
let titleEl: HTMLElement | null = null;
let eraInfoEl: HTMLElement | null = null;
let descEl: HTMLElement | null = null;
let factTextEl: HTMLElement | null = null;
let countEl: HTMLElement | null = null;
let totalEl: HTMLElement | null = null;

function getEls() {
  if (!popupEl) {
    popupEl = document.getElementById('game-popup');
    titleEl = document.getElementById('popup-title');
    eraInfoEl = document.getElementById('popup-era-info');
    descEl = document.getElementById('popup-desc');
    factTextEl = document.getElementById('popup-fact-text');
    countEl = document.getElementById('discovery-count');
    totalEl = document.getElementById('discovery-total');
  }
}

// Track discoveries per era (loaded from localStorage)
const discovered = loadDiscoveries();

export function showPopup(building: BuildingDef, era: EraId): boolean {
  getEls();
  const content = building.eras[era];
  if (!content.visible || !popupEl || !titleEl || !descEl || !factTextEl || !eraInfoEl) return false;

  titleEl.textContent = content.name;

  const eraDef = ERAS.find((e) => e.id === era);
  const eraLabel = eraDef ? `${eraDef.label} (${eraDef.years})` : '';
  eraInfoEl.textContent = building.number ? `Bldg ${building.number} · ${eraLabel}` : eraLabel;

  descEl.textContent = content.description;
  factTextEl.textContent = content.funFact;

  popupEl.style.display = 'flex';

  // Track discovery
  discovered.get(era)!.add(building.id);
  saveDiscoveries(discovered);

  return true;
}

export function hidePopup() {
  getEls();
  if (popupEl) popupEl.style.display = 'none';
}

export function isPopupOpen(): boolean {
  getEls();
  return popupEl ? popupEl.style.display !== 'none' : false;
}

export function getDiscoveredCount(era: EraId): number {
  return discovered.get(era)?.size ?? 0;
}

export function updateDiscoveryDisplay(era: EraId, total: number) {
  getEls();
  if (countEl) countEl.textContent = String(getDiscoveredCount(era));
  if (totalEl) totalEl.textContent = String(total);
}

export function getDiscoveredSet(era: EraId): Set<string> {
  return discovered.get(era) ?? new Set();
}

export function isEraComplete(era: EraId, total: number): boolean {
  return (discovered.get(era)?.size ?? 0) >= total;
}

export function setupPopupListeners(onClose: () => void) {
  getEls();
  const closeBtn = document.getElementById('popup-close');
  const backdrop = document.getElementById('popup-backdrop');

  if (closeBtn) closeBtn.addEventListener('click', () => { hidePopup(); onClose(); });
  if (backdrop) backdrop.addEventListener('click', () => { hidePopup(); onClose(); });
}
