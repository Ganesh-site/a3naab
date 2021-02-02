import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [DatePipe]
})
export class OrdersComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;
  orderList: any;
  orderStatus = 'ALL';
  deliveryTime = '0';
  timeList: any
  orderDate = null;

  pages: number;
  page =1;
  showMap = false;
  storeStatus = 'NONE';

  // bsValue: Date = new Date();
  bsValue = null;

  minDate:any;


  zoom: number = 5;
  
  // initial center position for the map
  lat: number = 10.616698;
  lng: number = 76.936195;

  markers: marker[] = [
	  // {
		//   lat: 51.673858,
		//   lng: 7.815982,
		//   label: 'A',
		//   draggable: true
	  // },
	  // {
		//   lat: 51.373858,
		//   lng: 7.215982,
		//   label: 'B',
		//   draggable: false
	  // },
	  // {
		//   lat: 51.723858,
		//   lng: 7.895982,
		//   label: 'C',
		//   draggable: true
	  // }
  ]
  previous;

  constructor(
    private apiCall: ApiCallService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.bsValue = null;
    const today =  new Date();
    // this.minDate =  new Date(today.setDate(today.getDate()));

    const object = { pageNumber: 1, orderStatus: 'ALL', deliveryTime: 0, storeStatus: this.storeStatus }
    this.getOrderList(object)
    this.getTime()
  }

  onchangeMap(values:any){
    this.showMap = values.currentTarget.checked;
  }

  value(event: any) {
    this.orderDate = this.datePipe.transform(event, 'yyyy-MM-dd');

    const object = { pageNumber: 1, orderStatus: 'ALL', deliveryTime: 0, storeStatus: this.storeStatus, orderDate: this.orderDate }
    this.getOrderList(object)
}

  getTime(){
    var params = {
      url: 'admin/getDeliveryTime',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error === 'false') {
          // Success
          // console.log(response.body)
          this.timeList = response.body.data.list
          // console.log(this.timeList)
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

  nextPage(page){
    const object = { pageNumber: page, orderStatus: this.orderStatus, deliveryTime: this.deliveryTime, storeStatus: this.storeStatus }
    this.getOrderList(object)
  }

  onChangeFilter(id, type){
    const object = { pageNumber: 1, storeStatus: this.storeStatus, orderStatus: this.orderStatus, deliveryTime: this.deliveryTime }
    if(type === 'Delivery'){
      this.deliveryTime = id
      this.orderStatus = this.orderStatus
    } else if(type === 'Status') {
      this.orderStatus = id
      this.deliveryTime = this.deliveryTime
    } else {
      console.log(id)
      this.storeStatus = id
      this.storeStatus = this.storeStatus
    }
    object.deliveryTime = this.deliveryTime
    object.orderStatus = this.orderStatus
    object.storeStatus = this.storeStatus
    this.getOrderList(object)
    // this.onChangeStoreFilterAPICall(object)
  }

  onChangeStoreFilter(value){
    var object = { orderStatus: this.orderStatus, storeStatus: value, deliveryTime: this.deliveryTime  }
    this.onChangeStoreFilterAPICall(object)
  }


  onChangeStoreFilterAPICall(value){
    var params = {
      url: 'admin/orderListStoreStatus',
      data: value
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error === 'false') {
          // Success
          // console.log(response.body)
          this.orderList = response.body.data.orders
          this.markers = response.body.data.orders
          // console.log(this.markers)
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

  clickedMarker(infowindow){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindow;
  }

  pageReload() {
    this.ngOnInit();
  }

  getOrderList(object){
    var params = {
      url: 'admin/orderList',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error === 'false') {
          // Success
          // console.log(response.body)
          this.pages = response.body.pages * 10;
          this.orderList = response.body.data.orders
          this.markers = response.body.data.orders
          // console.log(this.markers)
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
