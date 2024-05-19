import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IProfesseur } from '../professeur.model';

@Component({
  standalone: true,
  selector: 'jhi-professeur-detail',
  templateUrl: './professeur-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ProfesseurDetailComponent {
  professeur = input<IProfesseur | null>(null);

  previousState(): void {
    window.history.back();
  }
}
