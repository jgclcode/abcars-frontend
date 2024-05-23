import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestqComponent } from './components/requestq/requestq.component';

const routes: Routes = [
  { path: '', component: RequestqComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestQuoteRoutingModule { }
