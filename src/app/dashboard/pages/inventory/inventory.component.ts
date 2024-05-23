import {Component} from '@angular/core';

export interface PeriodicElement {
  mark: string;
  id: number;
  model: string;
  vim: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, mark: 'mini', model: 'Cooper', vim: 'WMW51DH9N2R11046',actions:""},
  {id: 2, mark: 'chevrolet', model: 'Beat', vim: 'WMW51DH9N2R11046', actions:""},
  {id: 3, mark: 'chevrolet', model: 'Beat', vim: 'WMW51DH9N2R11046', actions:""},
  {id: 4, mark: 'chevrolet', model: 'Spark', vim: 'WMW51DH9N2R11046', actions:""},
];

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  displayedColumns: string[] = ['id', 'mark', 'model', 'vim','actions'];
  dataSource = ELEMENT_DATA;
}