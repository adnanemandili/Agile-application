import dayjs from 'dayjs/esm';

import { IProfesseur, NewProfesseur } from './professeur.model';

export const sampleWithRequiredData: IProfesseur = {
  id: 8566,
  firstName: 'Dessie',
  lastName: 'Collier',
  email: 'Guillermo44@gmail.com',
};

export const sampleWithPartialData: IProfesseur = {
  id: 111,
  firstName: 'Jasper',
  lastName: 'Rempel',
  email: 'Coby73@hotmail.com',
  phoneNumber: 'inwardly suddenly speaking',
  hireDate: dayjs('2024-05-19'),
};

export const sampleWithFullData: IProfesseur = {
  id: 13974,
  firstName: 'Stefanie',
  lastName: 'Zboncak',
  email: 'Ryley_Windler29@yahoo.com',
  phoneNumber: 'drat brr',
  hireDate: dayjs('2024-05-19'),
};

export const sampleWithNewData: NewProfesseur = {
  firstName: 'Cesar',
  lastName: 'Feil',
  email: 'Julia.Cronin@gmail.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
