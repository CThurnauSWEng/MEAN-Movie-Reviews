import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AddComponent } from './add/add.component';
import { AddreviewComponent } from './addreview/addreview.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowreviewComponent } from './showreview/showreview.component';
import { UpdatereviewComponent } from './updatereview/updatereview.component';

import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    AddreviewComponent,
    DashboardComponent,
    ShowreviewComponent,
    UpdatereviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
