import dayjs from 'dayjs/esm';

import { IEtudiant, NewEtudiant } from './etudiant.model';

export const sampleWithRequiredData: IEtudiant = {
  id: 23421,
  firstName: 'Haleigh',
  lastName: "O'Hara",
  email: 'Gregoria62@hotmail.com',
  apogee: 'of',
};

export const sampleWithPartialData: IEtudiant = {
  id: 1517,
  firstName: 'Lilyan',
  lastName: 'Gleichner',
  email: 'Marlin.Koepp68@gmail.com',
  apogee: 'salami tennis huzzah',
  enrollmentDate: dayjs('2024-05-18'),
};

export const sampleWithFullData: IEtudiant = {
  id: 11278,
  firstName: 'Camylle',
  lastName: 'Volkman',
  email: 'Reyes_Roob49@yahoo.com',
  apogee: 'for',
  niveau: 'TroisiemeAnnee',
  filere: 'SSE',
  enrollmentDate: dayjs('2024-05-19'),
};

export const sampleWithNewData: NewEtudiant = {
  firstName: 'Marcellus',
  lastName: 'Kozey',
  email: 'Kane51@gmail.com',
  apogee: 'misapply thoroughly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
