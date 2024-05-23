import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AbcBlogComponent } from './pages/abc-blog/abc-blog.component';
import { PageBlogComponent } from './pages/page-blog/page-blog.component';
import { AboutComponent } from './pages/about/about.component';
import { CareersComponent } from './pages/careers/careers.component';
import { EarnMoneyComponent } from './pages/earn-money/earn-money.component';
import { ExtendedWarrantyComponent } from './pages/extended-warranty/extended-warranty.component';
import { FinancingComponent } from './pages/financing/financing.component';
import { FinancingFormComponent } from './components/financing-form/financing-form.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'blog', component: AbcBlogComponent },
  { path: 'blog/post/:id/:slug', component: PageBlogComponent },
  { path: 'acerca-de', component: AboutComponent },
  { path: 'empleos', component: CareersComponent },
  { path: 'gana-dinero', component: EarnMoneyComponent }  ,
  { path: 'garantia-extendida', component: ExtendedWarrantyComponent },
  { path: 'financiamiento', component: FinancingComponent },
  { path: 'financiamiento/solicitud/credit', component: FinancingFormComponent },
  { path: 'financiamiento/solicitud/credit/:vin', component: FinancingFormComponent },
  { path: 'financiamiento/solicitud/credit/:vin/:userId', component: FinancingFormComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AbcRoutingModule { }
