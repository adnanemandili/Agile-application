import { IMatiere, NewMatiere } from './matiere.model';

export const sampleWithRequiredData: IMatiere = {
  id: 175,
  subjectName: 'meanwhile',
};

export const sampleWithPartialData: IMatiere = {
  id: 2754,
  subjectName: 'jolly',
};

export const sampleWithFullData: IMatiere = {
  id: 3656,
  subjectName: 'bland',
  description: 'funding into times',
};

export const sampleWithNewData: NewMatiere = {
  subjectName: 'rig',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
