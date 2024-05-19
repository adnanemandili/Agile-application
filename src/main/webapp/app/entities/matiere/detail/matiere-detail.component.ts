import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IMatiere } from '../matiere.model';

@Component({
  standalone: true,
  selector: 'jhi-matiere-detail',
  templateUrl: './matiere-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class MatiereDetailComponent {
  matiere = input<IMatiere | null>(null);

  previousState(): void {
    window.history.back();
  }
}
