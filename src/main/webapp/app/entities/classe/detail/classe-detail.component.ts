import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IClasse } from '../classe.model';

@Component({
  standalone: true,
  selector: 'jhi-classe-detail',
  templateUrl: './classe-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ClasseDetailComponent {
  classe = input<IClasse | null>(null);

  previousState(): void {
    window.history.back();
  }
}
