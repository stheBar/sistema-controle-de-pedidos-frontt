import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Mesa } from '../../../core/models/mesa';
import { MesaService } from '../../../core/services/mesa.service';

@Component({
  selector: 'app-mesa-dialog',
  standalone: true,
  templateUrl: './mesa-dialog.component.html',
  styleUrls: ['./mesa-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class MesaDialogComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: MesaService,
    private ref: MatDialogRef<MesaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Mesa | null
  ) {
    this.form = this.fb.group({
      numero: [data?.numero ?? '', Validators.required],
      disponivel: [data?.disponivel ?? true, Validators.required]
    });
  }

  salvar() {
    if (this.form.invalid) return;

    const mesa: Mesa = {
      id: this.data?.id,
      ...this.form.value
    };

    const req = mesa.id
      ? this.service.atualizar(mesa)
      : this.service.cadastrar(mesa);

    req.subscribe({
      next: () => this.ref.close('refresh'),
      error: () => alert('Erro ao salvar mesa')
    });
  }

  fechar() {
    this.ref.close();
  }
}
