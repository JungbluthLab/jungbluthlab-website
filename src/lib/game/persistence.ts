import type { EraId } from './constants';

const STORAGE_KEY = 'eos-explore-discoveries';

interface SaveData {
  codfish: string[];
  navy: string[];
  modern: string[];
}

export function saveDiscoveries(discovered: Map<EraId, Set<string>>) {
  const data: SaveData = {
    codfish: [...(discovered.get('codfish') ?? [])],
    navy: [...(discovered.get('navy') ?? [])],
    modern: [...(discovered.get('modern') ?? [])],
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function loadDiscoveries(): Map<EraId, Set<string>> {
  const map = new Map<EraId, Set<string>>([
    ['codfish', new Set()],
    ['navy', new Set()],
    ['modern', new Set()],
  ]);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return map;
    const data: SaveData = JSON.parse(raw);
    if (data.codfish) map.set('codfish', new Set(data.codfish));
    if (data.navy) map.set('navy', new Set(data.navy));
    if (data.modern) map.set('modern', new Set(data.modern));
  } catch {}
  return map;
}
