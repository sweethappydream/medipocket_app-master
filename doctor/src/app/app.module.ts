import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { Base64 } from '@ionic-native/base64';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FileTransfer} from '@ionic-native/file-transfer'; // FileUploadOptions, FileTransferObject 
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
import { DoctorProfilePage } from '../pages/doctor-profile/doctor-profile';
import { HomePage } from '../pages/home/home';
import { NewRequestsPage } from '../pages/new-requests/new-requests';
import { PastRequestsPage } from '../pages/past-requests/past-requests';
import { RequestDetailsPage } from '../pages/request-details/request-details';
import { DrugSpecPage } from '../pages/drug-spec/drug-spec';
import { PrescriptionFinalizePage } from '../pages/prescription-finalize/prescription-finalize';
import { RequestConfirmationPage } from '../pages/request-confirmation/request-confirmation';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DeliveryServiceProvider } from '../providers/delivery-service/delivery-service';
import { MultiImageUpload } from "../components/multi-image-upload/multi-image-upload";
import { SingleImageUploadComponent } from "../components/single-image-upload/single-image-upload";
import { TempStorageProvider } from '../providers/temp-storage/temp-storage';

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
    RequestConfirmationPage,
    ForgetPasswordPage,
    CreatePasswordPage,
    OtpVerifyPage,
    DoctorProfilePage,
    ImageUploadAdvancedPage,
    HomePage,
    NewRequestsPage,
    PastRequestsPage,
    RequestDetailsPage,
    DrugSpecPage,
    PrescriptionFinalizePage
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
    RequestConfirmationPage,
    ForgetPasswordPage,
    CreatePasswordPage,
    OtpVerifyPage,
    DoctorProfilePage,
    ImageUploadAdvancedPage,
    HomePage,
    NewRequestsPage,
    PastRequestsPage,
    RequestDetailsPage,
    DrugSpecPage,
    PrescriptionFinalizePage
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
    MultiImageUpload,
    SingleImageUploadComponent,
    TempStorageProvider
  ]
})
export class AppModule {}
