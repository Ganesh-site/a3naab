import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { StoresComponent } from './stores/stores.component';
import { AddStoreComponent } from './add-store/add-store.component';
import { CustomerComponent } from './customer/customer.component';
import { ProductStatsComponent } from './product-stats/product-stats.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DriversComponent } from './drivers/drivers.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { MakeassignmentComponent } from './makeassignment/makeassignment.component';
import { SettingsComponent } from './settings/settings.component';
import { CarsComponent } from './cars/cars.component';
import { SupportComponent } from './support/support.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { RequestComponent } from './request/request.component';
import { OffersComponent } from './offers/offers.component';
import { from } from 'rxjs';



const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent,  canActivate: [AuthGuard] },
      { path: 'products', component: ProductsComponent,  canActivate: [AuthGuard] },
      { path: 'store', component: StoresComponent,  canActivate: [AuthGuard] },
      { path: 'view-store/:id', component: AddStoreComponent,  canActivate: [AuthGuard] },
      { path: 'customer', component: CustomerComponent,  canActivate: [AuthGuard] },
      { path: 'customer/:id', component: CustomerComponent,  canActivate: [AuthGuard] },
      { path: 'product-stats', component: ProductStatsComponent,  canActivate: [AuthGuard] },
      { path: 'orders', component: OrdersComponent,  canActivate: [AuthGuard] },
      { path: 'drivers', component: DriversComponent,  canActivate: [AuthGuard] },
      { path: 'cars', component: CarsComponent,  canActivate: [AuthGuard] },
      { path: 'assignment', component: AssignmentComponent,  canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsComponent,  canActivate: [AuthGuard] },
      { path: 'order-details/:id', component: OrderDetailsComponent,  canActivate: [AuthGuard] },
      { path: 'makeassignment', component: MakeassignmentComponent,  canActivate: [AuthGuard] },
      {path: 'support', component: SupportComponent,  canActivate: [AuthGuard]},
      {path: 'feedback', component: FeedbackComponent,  canActivate: [AuthGuard]},
      {path: 'requests', component: RequestComponent,  canActivate: [AuthGuard]},
      {path: 'offers', component: OffersComponent,  canActivate: [AuthGuard]},
    ],
    canActivate: [AuthGuard]
  }

      
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
