import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.css'],
  providers: [DatePipe]
})
export class AddStoreComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;
  storeForm: FormGroup;
  storeManager: FormGroup;
  addVendor : FormGroup;
  storeStockUpdateFrom: FormGroup;
  bsValue: Date = new Date();

  submitted = false;
  vendorFormSubmit = false;
  storeSubmit = false;
  stockSubmit = false;
  billObject = {}

  storeManagerList: any;
  storeStock : any;

  storeId: number;
  storeID: string;
  imagePreview: string;
  storeOrder: any;
  storeproducts: any;

  storeDue: any;
  managerId: number;
  vendorList: any;
  sroreProductId: number;
  storeViewStock: any;
  storeDueDate: number;
  totalStoreOrder: number;
  overAllRevenue: number;
  fileUpload: any;
  storeImage: string;
  fileBillUpload: any;
  category: any;

  fromDate = ''
  toDate = ''
  categoryId = ''

  graphFrom = ''
  graphTo = ''

  isEdit = false;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public orderChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public orderChartData: ChartDataSets[] = [
    { data: [], label: 'Orders' },
  ];

  public revenueChartLabels: Label[] = [];

  public revenueChartData: ChartDataSets[] = [
    { data: [], label: 'Orders' },
  ];

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.storeId = params.id);

    this.storeForm   = this.formBuilder.group({
      storeName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      managerFname: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      managerLname: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      email: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      mobileNumber: ['',  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.minLength(6), Validators.maxLength(15)]],
      storeAddress: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      storeImage: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      latitude: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      longitude: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      dueDay: ['',  [Validators.required, Validators.pattern(/\b(0?[1-9]|[12][0-9]|3[01])\b/)]],
      storeRadius: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]]
      // storeImage: ['http://15.184.21.76/admin/assets/img/product1.png',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]]
    });

    this.storeManager   = this.formBuilder.group({
      firstName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      lastName: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      storeId: [this.storeId,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      post: ['Store Manager',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      mobileNumber: ['',  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.minLength(6), Validators.maxLength(15)]]
    });

    this.storeStockUpdateFrom   = this.formBuilder.group({
      vendorId: ['ADD',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      productId: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      storeId: [this.storeId,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      stockType: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      units: ['',  [ Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      StockReason: [''],
      expiryDate: [''],
      currentStock : ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
     });

    this.addVendor   = this.formBuilder.group({
      vendorName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]]
    });

    this.getStoreDetails({storeId:this.storeId, fromDate: this.graphFrom, toDate: this.graphTo, year: 2021})


    // this.getStoreDetails(this.storeId)
    this.storeStockList(this.storeId)
    this.storeOrdersList({storeId:this.storeId, fromDate: this.fromDate, toDate: this.toDate})
    this.storeProductList({storeId: this.storeId, categoryId: this.categoryId})
    this.getVendorList(this.storeId)
    this.getCatgoryList();
    
  }

  graphvalueFrom(event: any){
    this.graphFrom= this.datePipe.transform(event, 'yyyy-MM-dd');

    this.getStoreDetails({storeId:this.storeId, fromDate: this.graphFrom, toDate: this.graphTo, year: 2021})
  }

  graphvalueTo(event: any){
    this.graphTo = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.getStoreDetails({storeId:this.storeId, fromDate: this.graphFrom, toDate: this.graphTo, year: 2021})
  }

  valuefrom(event: any) {
    this.fromDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.storeOrdersList({storeId:this.storeId, fromDate: this.fromDate, toDate: this.toDate})
  }

  valueTo(event: any) {
    this.toDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.storeOrdersList({storeId:this.storeId, fromDate: this.fromDate, toDate: this.toDate})
  }

  onChangeCategory(id){
    this.categoryId = id
    this.storeProductList({storeId: this.storeId, categoryId: this.categoryId})
  }

  getCatgoryList(){
    var params = {
      url: 'admin/getAllCategory',
      data: {
      }
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.category = response.body.data
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Errors !!', 'Oops', 'errorToastr')
      }
    )
  }

  

  getVendorList(id){
    var params = {
      url: 'admin/storeVendorList',
      data: { storeId: id }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // console.log(response.body.data.vendor)
          this.vendorList = response.body.data.vendor
          // console.log(this.storeStock)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr') 
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  addManager(){
    this.submitted = false
    this.storeManager.reset();
    this.storeManager.get('storeId').setValue(this.storeId);
    this.storeManager.get('post').setValue('Store Manager');
    this.isEdit = false;
  }

  editManager(item){
    this.submitted = false
    this.isEdit = true;
    this.managerId = item.id
    this.storeManager   = this.formBuilder.group({
      firstName: [item.firstName,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      lastName: [item.lastName,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      storeId: [this.storeId,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      post: ['Store Manager',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      mobileNumber: [item.mobileNumber,  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.minLength(6), Validators.maxLength(15)]]
    });
  }

  DeleteManager(data){
    const object = { id: data.id }

    var params = {
      url: 'admin/deleteStoreManager',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.ngOnInit();
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr') 
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  storeOrdersList(object){
    var params = {
      url: 'admin/storeOrderList',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.storeOrder = response.body.data.store
          // console.log(this.storeStock)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr') 
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  storeProductList(object){
    // console.log(object)
    var params = {
      url: 'admin/viewStoreProducts',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.storeproducts = response.body.data.store
          // console.log(this.storeproducts)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr') 
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  storeStockList(id){
    var params = {
      url: 'admin/viewStoreStock',
      data: { storeId: id }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.storeStock = response.body.data.store
          // console.log(this.storeStock)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr') 
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  uploadImageFile(event){
    
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]); 
    this.fileUpload = event.target.files[0]
  
}

uploadBillFile(event, item){
  this.billObject = {}
  var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]); 
    this.fileBillUpload = event.target.files[0]
    this.billObject = item
}

async upload_btn_file(){
  // console.log(this.billObject)
  // console.log(this.fileBillUpload)

  if(this.fileBillUpload){
    const formData = new FormData();
    formData.append('uploaded_file', this.fileBillUpload); 
    const image = await this.apiCall.imageuploadFunctions(formData);
    // this.billObject['document'] = image['uploadUrl']
    // console.log(this.billObject)

    const uploadObject = { storeId: this.billObject['storeId'], fromDate: this.billObject['from'], toDate: this.billObject['to'], paidStatus: this.billObject['isPaid'], document: image['uploadUrl'] }

    var params = {
      url: 'admin/uploadStoreBillingCyle',
      data: uploadObject
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          // $('#add_mem').modal('hide');
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

  } else {
    this.apiCall.showToast('Please choose the file', 'Error', 'errorToastr')
    return false;
  }
}

  getStoreDetails(object){
    var params = {
      url: 'admin/viewStoreDetails',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == 'false') {

          // console.log(response.body.data.orderResult.year)
          this.orderChartLabels = response.body.data.orderResult.year;

          this.orderChartData = [
            { data: response.body.data.orderResult.orders, label: 'Orders' },
          ];

          this.revenueChartLabels = response.body.data.revenueResult.year;

          this.revenueChartData = [
            { data: response.body.data.revenueResult.amount, label: 'Orders' },
          ];

          this.storeDue = response.body.data.dueResult

          this.totalStoreOrder = response.body.data.totalOrders
          this.overAllRevenue = response.body.data.overAllRevenue.amount

          this.storeManagerList = response.body.data.storeManager
          this.storeID = response.body.data.storeDetails[0].storeID
          this.storeDueDate = response.body.data.storeDetails[0].dueDay

          this.imagePreview = response.body.data.storeDetails[0].storeImage

          this.storeImage = response.body.data.storeDetails[0].storeImage

          this.storeForm   = this.formBuilder.group({
            storeName: [response.body.data.storeDetails[0].storeName,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
            managerFname: [response.body.data.storeDetails[0].managerFname,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
            managerLname: [response.body.data.storeDetails[0].managerLname,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
            email: [response.body.data.storeDetails[0].email,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
            mobileNumber: [response.body.data.storeDetails[0].mobileNumber,  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.minLength(6), Validators.maxLength(15)]],
            storeAddress: [response.body.data.storeDetails[0].storeAddress,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
            storeImage: [''],
            latitude: [response.body.data.storeDetails[0].latitude,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
            longitude: [response.body.data.storeDetails[0].longitude,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
            dueDay: [response.body.data.storeDetails[0].dueDay,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
            storeRadius: [response.body.data.storeDetails[0].storeRadius,  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]]

            // storeImage: ['http://15.184.21.76/admin/assets/img/product1.png',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]]
          });
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  async onSubmitStore(){
    this.storeSubmit = true;
    // console.log(this.storeForm.value)
    if(!this.storeForm.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    const storeData = this.storeForm.value
    storeData['storeImage'] = this.storeImage
    storeData['id'] = this.storeId

    if(this.fileUpload){
      const formData = new FormData();
      formData.append('uploaded_file', this.fileUpload); 
      const image = await this.apiCall.imageuploadFunctions(formData);
      storeData['storeImage'] = image['uploadUrl']
    }

    var params = {
      url: 'admin/editNewStore',
      data: storeData
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          // $('#add_mem').modal('hide');
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
    this.submitted = true;
    // console.log(this.storeManager.value)
    // console.log(this.storeManager.valid)
    if (!this.storeManager.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
     }

     if(this.isEdit === false){
      var params = {
        url: 'admin/addStoreManager',
        data: this.storeManager.value
      }
     } else {
       const updateData = this.storeManager.value
       updateData['id'] = this.managerId
      var params = {
        url: 'admin/editStoreManager',
        data: updateData
      }
     }
     
     this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_mem').modal('hide');
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

  vendorSubmit(){
    this.vendorFormSubmit = true;
    if (!this.addVendor.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
     }

     const vendorData = this.addVendor.value
     vendorData['storeId'] = this.storeId

     var params = {
      url: 'admin/adminAddVendor',
      data: vendorData
    }

     this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_vend_btn').modal('hide');
          this.addVendor.reset();
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

  getProductStockValue(data){
    // console.log(data.productId)
    this.sroreProductId = data.productId
    this.storeStockUpdateFrom.reset();
    this.storeStockUpdateFrom.get('productId').setValue(data.productId);
    this.storeStockUpdateFrom.get('currentStock').setValue(data.storeStock);
    this.storeStockUpdateFrom.get('storeId').setValue(this.storeId);

    this.getVendorViewStock(this.storeId, this.sroreProductId)
    // this.storeStockUpdateFrom   = this.formBuilder.group({
    //   vendorId: ['ADD',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   productId: [data.productId,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   storeId: [this.storeId,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   stockType: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   units: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //   StockReason: [''],
    //   expiryDate: [''],
    //   currentStock : [data.storeStock,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    //  });
  }

  getVendorViewStock(id, productId){
    var params = {
      url: 'admin/adminViewStockHistory',
      data: { storeId: id, productId: productId }
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // console.log(response.body.data.vendor)
          this.storeViewStock = response.body.data.product
          // console.log(this.storeViewStock)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr') 
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  stockSubmitChange(){
    this.stockSubmit = true;
    if (!this.storeStockUpdateFrom.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
     }

     const stockData = this.storeStockUpdateFrom.value
     stockData['expiryDate'] = this.datePipe.transform(this.storeStockUpdateFrom.value.expiryDate, 'yyyy-MM-dd');
     var params = {
      url: 'admin/adminUpdateStoreStock',
      data: this.storeStockUpdateFrom.value
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#view_det').modal('hide');
          this.ngOnInit();
          this.storeStockUpdateFrom.reset();
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

  ngOnDestroy() {
    $('#add_mem').modal('hide');
  }

}
