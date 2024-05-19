import dayjs from 'dayjs/esm';
import { IClasse } from 'app/entities/classe/classe.model';
import { Niveau } from 'app/entities/enumerations/niveau.model';
import { Filiere } from 'app/entities/enumerations/filiere.model';

export interface IEtudiant {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  apogee?: string | null;
  niveau?: keyof typeof Niveau | null;
  filere?: keyof typeof Filiere | null;
  enrollmentDate?: dayjs.Dayjs | null;
  classe?: IClasse | null;
}

export type NewEtudiant = Omit<IEtudiant, 'id'> & { id: null };
