import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-major-form',
  templateUrl: './major-form.component.html',
  styleUrls: ['./major-form.component.css']
})
export class MajorFormComponent implements OnInit {

  majorForm: NgForm;
  @ViewChild('majorForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;
  majordata: object;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("major", +params['id'])) //use some data from the params and then call the dataService and make another one. Chaining your asychronis calls together.
      .subscribe(major => this.majordata = major);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => { 
        (+params['id']) ? this.getRecordForEdit() : null; //if parameter called ID, call getRecrodForEdit if not, do nothing.
      });

  }

  saveMajor(major: NgForm){
    if(typeof major.value.major_id === "number"){
      this.dataService.editRecord("major", major.value, major.value.major_id)
          .subscribe(
            major => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("major", major.value)
          .subscribe(
            major => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.majordata = {};
    }

  }



ngAfterViewChecked() {
  this.formChanged();
}

formChanged() {
  //if the form didn't change then do nothing
  if (this.currentForm === this.majorForm) { return; }
  //set the form to the current form for comparison
  this.majorForm = this.currentForm;
  //subscribe to form changes and send the changes to the onValueChanged method
  this.majorForm.valueChanges
    .subscribe(data => this.onValueChanged(data)
    );
}

onValueChanged(data?: any) {
  let form = this.majorForm.form;

  for (const field in this.formErrors) {
    // clear previous error message (if any)
    this.formErrors[field] = '';
    const control = form.get(field);

    if (control && control.dirty && !control.valid) {
      const messages = this.validationMessages[field];
      for (const key in control.errors) {
        this.formErrors[field] += messages[key] + ' ';
      }
    }
  }
}

//start out the errors as an emtpy string
formErrors = {
  'major': '',
  'sat': '',
};

validationMessages = {
  'major': {
    'required': 'This field is required.',
    'maxlength': 'Name must not exceed 30 characters.'
  },
  'sat': {
    'required': 'This field is required.',
    'pattern': 'SAT score must be between 400 and 1600',
    'maxlength': 'SAT score cannot exceed 4 characters long.'
  }

};


}