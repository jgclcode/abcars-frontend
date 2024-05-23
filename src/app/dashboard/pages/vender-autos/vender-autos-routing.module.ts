import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { VenderTuAutoComponent } from './pages/vender-tu-auto/vender-tu-auto.component';

const routes: Routes = [
  { path: '', component: VenderTuAutoComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VenderAutosRoutingModule { }
