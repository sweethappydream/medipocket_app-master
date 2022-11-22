import { MbscModule } from '../lib/mobiscroll-package';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { Base64 } from '@ionic-native/base64';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FileTransfer} from '@ionic-native/file-transfer'; // FileUploadOptions, FileTransferObject 
import { MyApp } from './app.component';
import { HttpModule, Http  } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

// import { OAuthModule } from '../pages/oauth/oauth.module';


import { HomePage } from '../pages/delivery/home/home';
import { DrugInfoPage } from '../pages/delivery/drug-info/drug-info';
import { CheckoutPage } from '../pages/delivery/checkout/checkout';
import { RequestPxPage } from '../pages/delivery/request-px/request-px';
import { UploadRxPage } from '../pages/upload-rx/upload-rx';
import { ImageSlidePage } from '../pages/image-slide/image-slide';
import { ConfirmationMessagePage } from '../pages/delivery/confirmation-message/confirmation-message';
import { SearchMedicinesPage } from '../pages/delivery/search-medicines/search-medicines';
import { MembershipPlanPage } from '../pages/membership/membership-plan/membership-plan';
import { MembershipSignupPage } from '../pages/membership/membership-signup/membership-signup';
import { MembershipCardPage } from '../pages/membership-card/membership-card';
import { OrderStatusPage } from '../pages/order-status/order-status';
import { OrderVerifyPage } from '../pages/order-verify/order-verify';
import { OrdersListPage } from '../pages/orders-list/orders-list';
import { EPrescriptionListPage } from '../pages/e-prescription/e-prescription';
import { EPrescriptionDetailPage } from '../pages/e-prescription-detail/e-prescription-detail';
import { FeedbackPage } from '../pages/feedback/feedback';
import { Stripe } from '@ionic-native/stripe';
import { RegisterPage } from '../pages/auth/register/register';
import { SigninPage } from '../pages/auth/signin/signin';
import { LandingPage } from '../pages/auth/landing/landing';
import { RegisterOtpVerifyPage } from '../pages/auth/register-otp-verify/register-otp-verify';
import { ConfirmationPage } from '../pages/auth/confirmation/confirmation';
import { PatientProfilePage } from '../pages/delivery/patient-profile/patient-profile';
import { ForgetPasswordPage } from '../pages/auth/forget-password/forget-password';
import { CreatePasswordPage } from '../pages/auth/create-password/create-password';
import { OtpVerifyPage } from '../pages/auth/otp-verify/otp-verify';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DeliveryServiceProvider } from '../providers/delivery-service/delivery-service';
import { MultiImageUpload } from "../components/multi-image-upload/multi-image-upload";
import { SingleImageUploadComponent } from "../components/single-image-upload/single-image-upload";
import { customAutoComplete } from '../components/auto-complete/auto-complete';
import { TempStorageProvider } from '../providers/temp-storage/temp-storage';
import { TabPage } from '../pages/tab/tab';
import { EverytimePasswordPage } from '../pages/auth/everytime-password/everytime-password';
import { LoginProvider } from '../providers/login/login';
import { PinComponent } from '../pages/pin/pin';
import { PinSetupComponent } from '../pages/pinsetup/pinsetup';
import { TouchID } from '@ionic-native/touch-id';
// import { TabPage } from '../pages/tab/tab';
import {ModalPage} from '../pages/delivery/modal-page-popup/model-page';
import { MoreTabPage } from '../pages/more-tab/more-tab';


@NgModule({
  declarations: [
    TabPage,
    MyApp,
    MultiImageUpload,
    SingleImageUploadComponent,
    customAutoComplete,
    HomePage,
    SearchMedicinesPage,
    MembershipPlanPage,
    MembershipSignupPage,
    MembershipCardPage,
    RegisterPage,
    SigninPage,
    LandingPage,
    RegisterOtpVerifyPage,
    ConfirmationPage,
    PatientProfilePage,
    DrugInfoPage,
    CheckoutPage,
    RequestPxPage,
    UploadRxPage,
    ImageSlidePage,
    ConfirmationMessagePage,
    OrderStatusPage,
    OrderVerifyPage,
    OrdersListPage,
    EPrescriptionListPage,
    EPrescriptionDetailPage,
    FeedbackPage,
    ForgetPasswordPage,
    CreatePasswordPage,
    OtpVerifyPage,
    PinComponent,
    PinSetupComponent,
    ModalPage,
    MoreTabPage,
    // EverytimePasswordPage
    
  ],
  imports: [ 
    MbscModule, 
    FormsModule, 
    BrowserModule,
    HttpModule,
   // OAuthModule,
    IonicModule.forRoot(MyApp,{
      mode: 'md'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TabPage,
    MyApp,
    customAutoComplete,
    HomePage,
    SearchMedicinesPage,
    MembershipPlanPage,
    MembershipSignupPage,
    MembershipCardPage,
    RegisterPage,
    SigninPage,
    LandingPage,
    RegisterOtpVerifyPage,
    ConfirmationPage,
    PatientProfilePage,
    DrugInfoPage,
    CheckoutPage,
    RequestPxPage,
    UploadRxPage,
    ImageSlidePage,
    ConfirmationMessagePage,
    OrderStatusPage,
    OrderVerifyPage,
    OrdersListPage,
    EPrescriptionListPage,
    EPrescriptionDetailPage,
    FeedbackPage,
    ForgetPasswordPage,
    CreatePasswordPage,
    OtpVerifyPage,
    PinComponent,
    PinSetupComponent,
    ModalPage,
    MoreTabPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Keyboard,
    Base64,
    Stripe,
    Facebook,
    GooglePlus,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DeliveryServiceProvider,
    FileTransfer,
    MultiImageUpload,
    SingleImageUploadComponent,
    TempStorageProvider,
    SocialSharing,
    LoginProvider,
    TouchID
  ]
})
export class AppModule {}
