import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProfesseur } from '../professeur.model';
import { ProfesseurService } from '../service/professeur.service';

@Component({
  standalone: true,
  templateUrl: './professeur-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProfesseurDeleteDialogComponent {
  professeur?: IProfesseur;

  protected professeurService = inject(ProfesseurService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.professeurService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
