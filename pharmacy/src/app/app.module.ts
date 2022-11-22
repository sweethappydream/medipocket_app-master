import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { Base64 } from '@ionic-native/base64';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FileTransfer} from '@ionic-native/file-transfer'; // FileUploadOptions, FileTransferObject 
import { File } from '@ionic-native/file';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { Stripe } from '@ionic-native/stripe';
import { RegisterPage } from '../pages/auth/register/register';
import { SigninPage } from '../pages/auth/signin/signin';
import { LandingPage } from '../pages/auth/landing/landing';
import { RegisterOtpVerifyPage } from '../pages/auth/register-otp-verify/register-otp-verify';
import { ConfirmationPage } from '../pages/auth/confirmation/confirmation';
import { ImageUploadAdvancedPage } from '../pages/image-upload-advanced/image-upload-advanced';
import { ForgetPasswordPage } from '../pages/auth/forget-password/forget-password';
import { CreatePasswordPage } from '../pages/auth/create-password/create-password';
import { OtpVerifyPage } from '../pages/auth/otp-verify/otp-verify';
import { PharmacyProfilePage } from '../pages/pharmacy-profile/pharmacy-profile';
import { HomePage } from '../pages/home/home';
import { NewOrdersPage } from '../pages/orders/new-orders/new-orders';
import { PastOrdersPage } from '../pages/orders/past-orders/past-orders';
import { ActiveOrdersPage } from '../pages/orders/active-orders/active-orders';
import { OrderDetailsPage } from '../pages/orders/order-details/order-details';
import { OrderStatusPage } from '../pages/order-status/order-status';
import { OrderVerifyPage } from '../pages/orders/order-verify/order-verify';
import { OrderConfirmationPage } from '../pages/orders/order-confirmation/order-confirmation';
import { ImageOriginalPage } from '../pages/image-original/image-original';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DeliveryServiceProvider } from '../providers/delivery-service/delivery-service';
import { MultiImageUpload } from "../components/multi-image-upload/multi-image-upload";
import { SingleImageUploadComponent } from "../components/single-image-upload/single-image-upload";
import { TempStorageProvider } from '../providers/temp-storage/temp-storage';
import { PickupDetailsPage } from '../pages/pickup-details/pickup-details';

@NgModule({
  declarations: [
    MyApp,
    MultiImageUpload,
    SingleImageUploadComponent,
    RegisterPage,
    SigninPage,
    LandingPage,
    RegisterOtpVerifyPage,
    ConfirmationPage,
    ForgetPasswordPage,
    CreatePasswordPage,
    OtpVerifyPage,
    PharmacyProfilePage,
    ImageUploadAdvancedPage,
    HomePage,
    NewOrdersPage,
    OrderDetailsPage,
    PastOrdersPage,
    OrderVerifyPage,
    OrderConfirmationPage,
    ActiveOrdersPage,
    OrderStatusPage,
    ImageOriginalPage,
    PickupDetailsPage
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
    RegisterPage,
    SigninPage,
    LandingPage,
    RegisterOtpVerifyPage,
    ConfirmationPage,
    ForgetPasswordPage,
    CreatePasswordPage,
    OtpVerifyPage,
    PharmacyProfilePage,
    ImageUploadAdvancedPage,
    HomePage,
    NewOrdersPage,
    OrderDetailsPage,
    PastOrdersPage,
    OrderVerifyPage,
    OrderConfirmationPage,
    ActiveOrdersPage,
    OrderStatusPage,
    ImageOriginalPage,
    PickupDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Base64,
    Stripe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DeliveryServiceProvider,
    FileTransfer,
    File,
    MultiImageUpload,
    SingleImageUploadComponent,
    TempStorageProvider
  ]
})
export class AppModule {}
