import { IProfesseur } from 'app/entities/professeur/professeur.model';

export interface IMatiere {
  id: number;
  subjectName?: string | null;
  description?: string | null;
  professeur?: IProfesseur | null;
}

export type NewMatiere = Omit<IMatiere, 'id'> & { id: null };
