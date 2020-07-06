import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
// Components and services
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { TableComponent } from './home/table/table.component';
import { FormComponent } from './home/form/form.component';
import { OverviewService } from './shared/overview.service';
import { DeleteRequestComponent } from './home/delete-request/delete-request.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, TableComponent, FormComponent, DeleteRequestComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    OverviewService,
    [{ provide: MAT_DATE_LOCALE, useValue: 'en-IN' }],
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
