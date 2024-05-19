import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 23,
  login: 'b@h4Xcf\\t1n\\3aGQ\\:lEN',
};

export const sampleWithPartialData: IUser = {
  id: 3223,
  login: 'u@u2r\\&M\\eLFX\\$7',
};

export const sampleWithFullData: IUser = {
  id: 25534,
  login: 'edpx',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
