export interface ElementData {
  name: string;
  symbol: string;
  number: number;
  summary: string;
  category: string;
  xpos: number;
  ypos: number;
  "cpk-hex": string;
  bohr_model_3d: string;
  appearance?: string;
  atomic_mass: number;
  bohr_model_image?: string;
  density?: number;
  discovered_by?: string;
  melt?: number;
  boil?: number;
  molar_heat?: number;
  named_by?: string;
  phase?: string;
  period: number;
  group?: number;
  source?: string;
  spectral_img?: string;
  electron_configuration?: string;
  electron_configuration_semantic?: string;
  electron_affinity?: number;
  electronegativity_pauling?: number;
  ionization_energies?: number[];
  shells?: number[];
}

export interface PeriodicTableData {
  elements: ElementData[];
}