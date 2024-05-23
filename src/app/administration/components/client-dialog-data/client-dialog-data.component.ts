import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/dialog';

// Interfaces
interface Client {
  id: number;
  user_id: number;
  phone1: number;
  phone2: number;
  curp: string;
  points: number;
  source_id: number;
  user?: {
    id: number;
    name: string;
    surname: string;
    email: string;
    gender: string;
    picture: string;
    created_at: string;
    updated_at: string;
  }
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-client-dialog-data',
  templateUrl: './client-dialog-data.component.html'
})

export class ClientDialogDataComponent implements OnInit {

  // References
  public client!: Client;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.client = this.data.client;
  }

}