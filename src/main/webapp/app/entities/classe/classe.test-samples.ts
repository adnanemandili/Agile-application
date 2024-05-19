import { IClasse, NewClasse } from './classe.model';

export const sampleWithRequiredData: IClasse = {
  id: 30892,
  className: 'lightly',
};

export const sampleWithPartialData: IClasse = {
  id: 23415,
  className: 'geology',
  filere: 'SSCL',
};

export const sampleWithFullData: IClasse = {
  id: 22021,
  className: 'deep',
  level: 'carelessly however block',
  group: 'G7',
  niveau: 'TroisiemeAnnee',
  filere: 'BI',
};

export const sampleWithNewData: NewClasse = {
  className: 'name',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
