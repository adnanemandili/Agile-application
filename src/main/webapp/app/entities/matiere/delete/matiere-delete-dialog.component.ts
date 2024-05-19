import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMatiere } from '../matiere.model';
import { MatiereService } from '../service/matiere.service';

@Component({
  standalone: true,
  templateUrl: './matiere-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MatiereDeleteDialogComponent {
  matiere?: IMatiere;

  protected matiereService = inject(MatiereService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.matiereService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
