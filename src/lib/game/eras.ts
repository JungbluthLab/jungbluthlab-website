import type { EraId } from './constants';

export interface EraDef {
  id: EraId;
  label: string;
  years: string;
}

export const ERAS: EraDef[] = [
  { id: 'codfish', label: '1880s Codfish', years: '1877–1904' },
  { id: 'navy',    label: '1940s Navy',    years: '1940–1958' },
  { id: 'modern',  label: 'Today',         years: '2017–present' },
];

let currentEra: EraId = 'modern';

export function getEra(): EraId {
  return currentEra;
}

export function setEra(era: EraId) {
  currentEra = era;
}
