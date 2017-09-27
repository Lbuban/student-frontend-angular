import { Component, OnInit, Input } from '@angular/core'; //since we're 2-way data binding the form data, we need the "input" key here. 
import { MdDialog, MdDialogRef } from '@angular/material';//this is pulling in the info needed for the dialog box from angular/material.

import { DataService } from '../data.service' //this is pulling info from the data service
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component' //this is pulling in the deleteConfirm component used to delete a student's record. 
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-student',//each component has it's own selector.
  templateUrl: './student.component.html', //path to find the corresponding HTML file.
  styleUrls: ['./student.component.css'],//path to find the corresponding css file.
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class StudentComponent implements OnInit { //tells the browser to use the StudentComponent upon initialization of page.

  //these describe what kind of data these variables can have - i.e. string, number, array, etc. 
  errorMessage: string;
  successMessage: string;
  students: any[];
  mode = 'Observable';
 
  constructor (private dataService: DataService, public dialog: MdDialog) {} //call the dataService, this is standard syntax.
 
  ngOnInit() { this.getStudents(); } //call "getStudent" function upon initialization of page.
 
  getStudents() { //function to pull the student list.
    this.dataService.getRecords("student")
      .subscribe(
        students => this.students = students,
        error =>  this.errorMessage = <any>error);
  }


  deleteStudent(id:number) { //function to delete a student from the record. 

    let dialogRef = this.dialog.open(DeleteConfirmComponent); 

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.dataService.deleteRecord("student", id)
          .subscribe(
            student => {this.successMessage = "Record(s) deleted successfully"; this.getStudents(); },
            error =>  this.errorMessage = <any>error);
      }
    });
  }

}
