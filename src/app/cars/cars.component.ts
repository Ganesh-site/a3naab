import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
  providers: [DatePipe]
})
export class CarsComponent implements OnInit {
datePickerConfig:Partial<BsDatepickerConfig>;

bsValue: Date = new Date();
addCar: FormGroup;
carList: any;
driverList: any;
assigCar: number;

originalArray: any;

zoom: number = 5;
// initial center position for the map
lat: number = 10.616698;
lng: number = 76.936195;
markers: marker[] = []
previous;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.addCar   = this.formBuilder.group({
      licenseNumber: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      carImage: [''],
      expirationDate: [this.bsValue,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      startingMileage: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      carModel: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    })

    this.getCars();
    this.assignDriverList();
  }

  assignDriverList(){
    var params = {
      url: 'admin/assignDriverList',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          // console.log(response.body)
          this.driverList = response.body.data.driver
          this.originalArray = response.body.data.driver
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }

  searchDriver(value){
    var filterProducts = this.originalArray.filter(function(item) {
      return item.drId.toLowerCase().indexOf(value.toLowerCase()) >= 0
     })
     this.driverList = filterProducts;
  }

  clickedMarker(infowindow){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindow;
  }

  getCars(){

    var params = {
      url: 'admin/getCarList',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          // console.log(response.body)
          this.carList = response.body.data.cars
          this.markers = response.body.data.cars
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }

  assigndri(data){
    this.assignDriverList();
    this.assigCar = data.id
    console.log(this.assigCar)
  }

  handleChange(value){
    const obj = { carId: this.assigCar, driverId: value }

    var params = {
      url: 'admin/assignDriver',
      data: obj
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#assign_dri_btn').modal('hide');
          this.assigCar = null;
          this.ngOnInit();
          // this.router.navigateByUrl('/dashboard');
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }

  onSubmit(){
    if(!this.addCar.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    const postData = this.addCar.value
    postData['expirationDate'] = this.datePipe.transform(this.addCar.value.expirationDate, 'yyyy-MM-dd');

    var params = {
      url: 'admin/addCar',
      data: postData
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_driv_btn').modal('hide');
          this.ngOnInit();
          // this.router.navigateByUrl('/dashboard');
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }

}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
