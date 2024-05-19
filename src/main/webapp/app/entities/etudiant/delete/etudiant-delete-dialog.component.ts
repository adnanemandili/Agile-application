import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEtudiant } from '../etudiant.model';
import { EtudiantService } from '../service/etudiant.service';

@Component({
  standalone: true,
  templateUrl: './etudiant-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EtudiantDeleteDialogComponent {
  etudiant?: IEtudiant;

  protected etudiantService = inject(EtudiantService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.etudiantService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
