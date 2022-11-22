import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { Base64 } from '@ionic-native/base64';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FileTransfer} from '@ionic-native/file-transfer'; // FileUploadOptions, FileTransferObject 
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/auth/register/register';
import { SigninPage } from '../pages/auth/signin/signin';
import { LandingPage } from '../pages/auth/landing/landing';
import { RegisterOtpVerifyPage } from '../pages/auth/register-otp-verify/register-otp-verify';
import { ConfirmationPage } from '../pages/auth/confirmation/confirmation';
import { DeliveryProfilePage } from '../pages/delivery-profile/delivery-profile';
import { ForgetPasswordPage } from '../pages/auth/forget-password/forget-password';
import { CreatePasswordPage } from '../pages/auth/create-password/create-password';
import { OtpVerifyPage } from '../pages/auth/otp-verify/otp-verify';
import { ImageUploadAdvancedPage } from '../pages/image-upload-advanced/image-upload-advanced';

import { NewOrdersPage } from '../pages/orders/new-orders/new-orders';
import { PastOrdersPage } from '../pages/orders/past-orders/past-orders';
import { ActiveOrdersPage } from '../pages/orders/active-orders/active-orders';
import { ActiveOrderDetailsPage } from '../pages/orders/active-order-details/active-order-details';
import { OrderConfirmationPage } from '../pages/orders/order-confirmation/order-confirmation';
import { CancelOrderPage } from '../pages/orders/cancel-order/cancel-order';

import { OrderVerifyPage } from '../pages/orders/order-verify/order-verify';
import { MapLocationPage } from '../pages/map-location/map-location';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DeliveryServiceProvider } from '../providers/delivery-service/delivery-service';
//import { MultiImageUpload } from "../components/multi-image-upload/multi-image-upload";
import { SingleImageUploadComponent } from "../components/single-image-upload/single-image-upload";
import { TempStorageProvider } from '../providers/temp-storage/temp-storage';

@NgModule({
  declarations: [
    MyApp,
  //  MultiImageUpload,
    SingleImageUploadComponent,
    HomePage,
    RegisterPage,
    SigninPage,
    LandingPage,
    RegisterOtpVerifyPage,
    ConfirmationPage,
    DeliveryProfilePage,
    ForgetPasswordPage,
    CreatePasswordPage,
    OtpVerifyPage,
    ImageUploadAdvancedPage,
    NewOrdersPage,
    PastOrdersPage,
    ActiveOrdersPage,
    ActiveOrderDetailsPage,
    MapLocationPage,
    OrderVerifyPage,
    OrderConfirmationPage,
    CancelOrderPage
  ],
  imports: [ 
    MbscModule, 
    FormsModule, 
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      mode: 'md'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
   
    HomePage,
    RegisterPage,
    SigninPage,
    LandingPage,
    RegisterOtpVerifyPage,
    ConfirmationPage,
    DeliveryProfilePage,
    ForgetPasswordPage,
    CreatePasswordPage,
    OtpVerifyPage,
    ImageUploadAdvancedPage,
    NewOrdersPage,
    PastOrdersPage,
    ActiveOrdersPage,
    ActiveOrderDetailsPage,
    MapLocationPage,
    OrderVerifyPage,
    OrderConfirmationPage,
    CancelOrderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Base64,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DeliveryServiceProvider,
    FileTransfer,
   // MultiImageUpload,
    SingleImageUploadComponent,
    TempStorageProvider,
    LaunchNavigator
  ]
})
export class AppModule {}
