import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lista } from '../model/lista';

@Injectable({
  providedIn: 'root'
})
export class ListaSeleccionadaService {
  private listaSeleccionadaSubject = new BehaviorSubject<Lista | null>(null);
  listaSeleccionada$ = this.listaSeleccionadaSubject.asObservable();

  constructor() {}

  setListaSeleccionada(lista: Lista) {
    this.listaSeleccionadaSubject.next(lista);
  }
}
