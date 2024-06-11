import { Component, Input  } from '@angular/core';
import { Lista } from '../model/lista';
import { ListaSeleccionadaService } from '../services/lista-seleccionada-service';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-items-lista',
  templateUrl: './items-lista.component.html',
  styleUrls: ['./items-lista.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonList, IonContent, IonIcon, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, 
    CommonModule 
  ]
})
export class ItemsListaComponent   {

  @Input() lista!: Lista;
  selectedLista: Lista | null = null;

  constructor(private modalCtrl: ModalController) {}

  // Método para cerrar el modal
  dismiss() {
    this.modalCtrl.dismiss();
  }
 
}