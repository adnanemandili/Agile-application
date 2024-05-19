import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IEtudiant } from '../etudiant.model';

@Component({
  standalone: true,
  selector: 'jhi-etudiant-detail',
  templateUrl: './etudiant-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EtudiantDetailComponent {
  etudiant = input<IEtudiant | null>(null);

  previousState(): void {
    window.history.back();
  }
}
