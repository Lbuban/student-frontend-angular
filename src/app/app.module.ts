import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AppRoutingModule } from './routing/routing.module';
import { StudentComponent } from './student/student.component';
import { HomeComponent } from './home/home.component';
import { DataService } from './data.service';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { StatusMessageComponent } from './status-message/status-message.component';
import { MajorComponent } from './major/major.component';
import { MajorFormComponent } from './major-form/major-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    StudentComponent,
    HomeComponent,
    DeleteConfirmComponent,
    StudentFormComponent,
    StatusMessageComponent,
    MajorComponent,
    MajorFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  entryComponents: [DeleteConfirmComponent],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
