import dayjs from 'dayjs/esm';
import { IClasse } from 'app/entities/classe/classe.model';

export interface IProfesseur {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  classes?: IClasse[] | null;
}

export type NewProfesseur = Omit<IProfesseur, 'id'> & { id: null };
