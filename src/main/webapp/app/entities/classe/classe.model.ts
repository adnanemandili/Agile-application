import { IProfesseur } from 'app/entities/professeur/professeur.model';
import { Groupe } from 'app/entities/enumerations/groupe.model';
import { Niveau } from 'app/entities/enumerations/niveau.model';
import { Filiere } from 'app/entities/enumerations/filiere.model';

export interface IClasse {
  id: number;
  className?: string | null;
  level?: string | null;
  group?: keyof typeof Groupe | null;
  niveau?: keyof typeof Niveau | null;
  filere?: keyof typeof Filiere | null;
  professeurs?: IProfesseur[] | null;
}

export type NewClasse = Omit<IClasse, 'id'> & { id: null };
