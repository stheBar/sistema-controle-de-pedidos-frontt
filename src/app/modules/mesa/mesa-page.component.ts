import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

import { MesaService } from '../../core/services/mesa.service';
import { Mesa } from '../../core/models/mesa';
import { MesaDialogComponent } from './mesa-dialog.component/mesa-dialog.component';

@Component({
  selector: 'app-mesa-page',
  standalone: true,
  templateUrl: './mesa-page.component.html',
  styleUrls: ['./mesa-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class MesaPageComponent implements OnInit {

  displayedColumns = ['numero', 'disponivel', 'acoes'];
  mesas: Mesa[] = [];
  loading = false;

  constructor(
    private mesaService: MesaService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.cd.markForCheck();

    this.mesaService.listar()
      .pipe(finalize(() => {
        this.loading = false;
        this.cd.markForCheck();
      }))
      .subscribe({
        next: res => {
          this.mesas = res;
          this.cd.markForCheck();
        },
        error: () => {
          this.snack.open('Erro ao carregar mesas', 'Fechar', { duration: 2500 });
        }
      });
  }

  abrirModal(mesa?: Mesa) {
    const ref = this.dialog.open(MesaDialogComponent, {
      width: '350px',
      data: mesa ?? null
    });

    ref.afterClosed().subscribe(result => {
      if (result === 'refresh') this.carregar();
    });
  }

  excluir(mesa: Mesa) {
    if (!confirm(`Excluir mesa número ${mesa.numero}?`)) return;

    this.mesaService.excluir(mesa.id!)
      .subscribe({
        next: () => {
          this.snack.open('Mesa excluída!', 'Fechar', { duration: 2500 });
          this.carregar();
        },
        error: () => {
          this.snack.open('Erro ao excluir mesa', 'Fechar', { duration: 2500 });
        }
      });
  }
}
