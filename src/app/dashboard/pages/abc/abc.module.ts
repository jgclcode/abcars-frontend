import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

// Modules
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AbcRoutingModule } from './abc-routing.module';

// Components
import { AboutComponent } from './pages/about/about.component';
import { AbcBlogComponent } from './pages/abc-blog/abc-blog.component';
import { CareersComponent } from './pages/careers/careers.component';
import { ExtendedWarrantyComponent } from './pages/extended-warranty/extended-warranty.component';
import { FinancingComponent } from './pages/financing/financing.component';
import { EarnMoneyComponent } from './pages/earn-money/earn-money.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageBlogComponent } from './pages/page-blog/page-blog.component';
import { FinancingFormComponent } from './components/financing-form/financing-form.component';
import { PostBlogComponent } from './components/post-blog/post-blog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@NgModule({
  declarations: [
    AboutComponent,
    AbcBlogComponent,
    CareersComponent,
    ExtendedWarrantyComponent,
    FinancingComponent,
    EarnMoneyComponent,
    PageBlogComponent,
    FinancingFormComponent,
    PostBlogComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AbcRoutingModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule //this is the module for form incase form validation
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AbcModule { }
