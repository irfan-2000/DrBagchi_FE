import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsideRoutingModule } from './inside-routing.module';
import { InsideComponent } from './inside.component';


@NgModule({
  declarations: [
    InsideComponent
  ],
  imports: [
    CommonModule,
    InsideRoutingModule
  ]
})
export class InsideModule { }
