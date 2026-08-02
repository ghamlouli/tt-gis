import * as L from 'leaflet';
import { AccesType } from '../app/models/gis-cloud.model';

/**
 * Icônes Leaflet réutilisant EXACTEMENT les mêmes symboles que
 * AccesSymbolComponent (tableau de visualisation), pour garder une
 * cohérence visuelle entre le tableau et la carte.
 *
 * Un seul point d'entrée par type d'accès -> facile à étendre pour un
 * futur type de réseau (il suffit d'ajouter une entrée dans SYMBOLS).
 */
const SYMBOLS: Record<AccesType, string> = {
  GSM: `
    <img src="assets/gsm-symbol.png" width="30" height="30" alt="GSM"/>`,
  FO: `
    <img src="assets/fo-symbol.png" width="30" height="30" alt="FO"/>`,
  MSAN: `
    <img src="assets/msan-symbol.png" width="30" height="30" alt="MSAN"/>`
};

/**
 * Ajouter ici le symbole d'un futur type de réseau suffit à le rendre
 * visualisable sur la carte, sans toucher au composant carte lui-même.
 */
export function getMarkerIcon(acces: AccesType): L.DivIcon {
  const svg = SYMBOLS[acces] ?? SYMBOLS.GSM;

  return L.divIcon({
    className: 'gis-marker-icon',
    html: svg,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    tooltipAnchor: [0, -15]
  });
}
