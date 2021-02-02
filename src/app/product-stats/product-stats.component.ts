import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-product-stats',
  templateUrl: './product-stats.component.html',
  styleUrls: ['./product-stats.component.css']
})
export class ProductStatsComponent implements OnInit {
  productsList:any;
  category: any;
  subCategory: any;

  productList: any;

  subSubCategory: any;
  isSubsubcategory = false;

  categoryId = '';
  subCategoryId = '';
  subSubCategoryId = '';
  productId = '';

  statusobject = {}

  
  constructor(
    private apiCall: ApiCallService,
  ) { }

  ngOnInit(): void {
    const activeMenu = document.getElementById('orders');
    activeMenu.classList.remove('active');
    const object = { pageNumber: 1 }
    this.getProductList(object)

    this.getCatgoryList();
  }

  pageReload(){
    this.ngOnInit()
  }

  ChnageCategoryStatus(statusVal, value, id){
    const object = {}
    if(statusVal == true){
      object['status'] = 'active'
    } else {
      object['status'] = 'inactive'
    }
    object['type'] = value
      object['id'] = id
      var params = {
        url: 'admin/categoeyStatusChange',
        data: object
      }

      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          // console.log(response.body)
          if (response.body.error == false) {
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
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  onChangeSubCategory(value){
    // console.log(value)
    this.subCategoryId = value

    this.statusobject['category'] = this.categoryId;
    this.statusobject['productCategory'] = this.subCategoryId;
    this.statusobject['subSubCategory'] = this.subSubCategoryId
    this.statusobject['productId'] = this.productId
    this.callProductFilter(this.statusobject)
    var params = {
      url: 'admin/findSubCategory',
      data: {
        id: value
      }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          console.log(response.body)
          if(response.body.isSubcate == 1) {
            this.isSubsubcategory = true;
            this.subSubCategory = response.body.data
            this.productList = []
          } else {
            this.isSubsubcategory = false;
            this.subSubCategory = []
            this.productList = response.body.data
          }
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

  onChangeCategory(id, value){
    if(value === 'Category'){
      this.categoryId = id
      this.productCategoryList(id)
    } else {
      this.subSubCategoryId = id
      const object = { type: 'SUBCATEGORY', id: id }
      this.getCategoryProductList(object)
    }
    this.statusobject['category'] = this.categoryId;
    this.statusobject['productCategory'] = this.subCategoryId;
    this.statusobject['subSubCategory'] = this.subSubCategoryId
    this.statusobject['productId'] = this.productId
    this.callProductFilter(this.statusobject)
  }

  getCategoryProductList(object){
    var params = {
      url: 'admin/getProductList',
      data: object
    }
    // console.log(params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.productList = response.body.data.products
          // console.log(this.productList)
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
  

  productCategoryList(id){
    var params = {
      url: 'admin/getProductCategory',
      data: {
        categoryId: id
      }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == false) {
          this.subCategory = response.body.data
          // console.log(this.subCategory)
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

  getProductList(object){
    var params = {
      url: 'admin/adminProducts',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.productsList = response.body.products
          // console.log(response.body)
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

  onChangeProducts(id){
    this.productId = id
    this.statusobject['category'] = this.categoryId;
    this.statusobject['productCategory'] = this.subCategoryId;
    this.statusobject['subSubCategory'] = this.subSubCategoryId
    this.statusobject['productId'] = this.productId
    this.callProductFilter(this.statusobject)
  }

  callProductFilter(object){
    // console.log(object)
      var params = {
        url: 'admin/adminProductFilter',
        data: object
      }
      // console.log(params)
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          // console.log(response.body)
          if (response.body.error == 'false') {
            this.productsList = response.body.products
            // console.log(this.productList)
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

}
