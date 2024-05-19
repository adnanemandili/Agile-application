import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IClasse } from '../classe.model';
import { ClasseService } from '../service/classe.service';

@Component({
  standalone: true,
  templateUrl: './classe-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClasseDeleteDialogComponent {
  classe?: IClasse;

  protected classeService = inject(ClasseService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.classeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
