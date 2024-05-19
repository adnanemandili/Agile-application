import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '9a778697-7c88-4d7f-b761-df093fa5e2b9',
};

export const sampleWithPartialData: IAuthority = {
  name: '6170a411-966d-4a67-a36d-8398269ffe5f',
};

export const sampleWithFullData: IAuthority = {
  name: '761adc43-a43d-4d5e-b4ad-319aa9687b4b',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
