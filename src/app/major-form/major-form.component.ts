import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
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

}

