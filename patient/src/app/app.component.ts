import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events, AlertController } from 'ionic-angular';
import { AppSettings } from '../app/settings';

import { HomePage } from '../pages/delivery/home/home';
import { SigninPage } from '../pages/auth/signin/signin';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { RequestPxPage } from '../pages/delivery/request-px/request-px';
import { PatientProfilePage } from '../pages/delivery/patient-profile/patient-profile';
import { OrdersListPage } from '../pages/orders-list/orders-list';
//import { EPrescriptionListPage } from '../pages/e-prescription/e-prescription';
import { LandingPage } from '../pages/auth/landing/landing';
import { MembershipCardPage } from '../pages/membership-card/membership-card';
//import { OAuthProvidersListPage } from '../pages/oauth/list/oauth-providers.list.page';

//import { UploadRxPage } from '../pages/upload-rx/upload-rx';
//import { MembershipCardPage } from '../pages/membership-card/membership-card';
import { DeliveryServiceProvider } from '../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../providers/temp-storage/temp-storage';
import { TabPage } from '../pages/tab/tab';
//import { FeedbackPage } from '../pages/feedback/feedback';
// import * as moment from 'moment';
import { App } from 'ionic-angular';
import * as moment from 'moment';
import { PinComponent } from '../pages/pin/pin';
import { PinSetupComponent } from '../pages/pinsetup/pinsetup';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    // make HelloIonicPage the root (or first) page
    rootPage: any;// LandingPage; //HomePage;
    // rootPage =  PinSetupComponent; //HomePage;
    pages: Array<{ title: string, component: any }>;
    userid: any = AppSettings.userid;
    usertype: any = AppSettings.usertype;

    userloggedin: boolean = false;
    localpasscode: any;
    constructor(
        public platform: Platform,
        public menu: MenuController,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public events: Events,
        public deliveryService: DeliveryServiceProvider,
        public tempStorage: TempStorageProvider,
        private app: App,
        public alertCtrl: AlertController,
    ) {
        this.initializeApp();
        this.platform.exitApp();
        this.menu.swipeEnable(false);

        // set our app's pages
        this.pages = [

        ];
        let userid = localStorage.getItem('userId');
        this.localpasscode = localStorage.getItem('localpin');
        console.log(this.localpasscode);
        let userData: any;
        if(localStorage.getItem('patientData') !== null) {
            userData = JSON.parse(localStorage.getItem('patientData'));
        } else {
            userData = null;
        }
        console.log(userid);
        if (userid === null) {
            this.rootPage = LandingPage;
        } else {
            if (this.localpasscode === null) {
                this.rootPage = PinSetupComponent;
                
            } else {
                this.rootPage = PinComponent;
            }
        }
        this.events.subscribe('user:loggedin', (searchData) => {
            console.log('hhhhhh');
            this.checkAuth();
        });

        this.events.subscribe('user:loggedout', (searchData) => {
            console.log('sssssss');
            this.checkAuth();
        });
        
    }

    checkAuth() {
        this.localpasscode = localStorage.getItem('localpin');
        if (this.tempStorage.authsession.userdata !== null) {
            //logged in
            this.pages = [
                { title: 'Home', component: HomePage },
                { title: 'Profile', component: PatientProfilePage },
                { title: 'Order History', component: OrdersListPage },
                { title: 'Medipocket Discount Card', component: MembershipCardPage },
                //   { title: 'E-Prescriptions', component: EPrescriptionListPage },
                //  { title: 'Family Members', component: HomePage },
                //   { title: 'Notifications', component: FeedbackPage },

                // { title: 'For Doctors', component: HomePage },
                // { title: 'For Hospitals', component: HomePage },
                // { title: 'For Insurance', component: HomePage }
                // { title: 'Logout', component: HomePage }
            ];

            if (this.localpasscode === null) {
                console.log('pin null');
                this.nav.setRoot(PinSetupComponent);
            } else {
                console.log('pin done');
                if (this.tempStorage.authsession.userdata.profileIncompelete) {
                    // this.nav.setRoot(PatientProfilePage);
                    this.nav.setRoot(TabPage);
                }
                
                else {
    
                    this.nav.setRoot(TabPage);
                    // this.nav.setRoot(HomePage);
                    // this.app.getRootNavs()[0].setRoot(SigninPage);
                }
            }
            
            this.userloggedin = true;
        }
        else {
            this.userloggedin = false;
            this.nav.setRoot(SigninPage);
        }
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

        this.platform.registerBackButtonAction(() => {
            let nav = this.app.getActiveNavs()[0];
            let activeView = nav.getActive();
            // Checks if can go back before show up the alert
            if(activeView.name === 'l') {
                if (nav.canGoBack()){
                    nav.pop();
                } else {
                    const alert = this.alertCtrl.create({
                        title: 'Exit!',
                        message: 'Are you sure you want to exit the app?',
                        buttons: [
                            {
                            text: 'Cancel',
                            role: 'cancel',
                                handler: () => {
                                    console.log('*  App Cancel! *');
                                }
                            },
                            {
                            text: 'Yes',
                                handler: () => {
                                    this.platform.exitApp();
                                }
                            }
                        ]
                    });
                    alert.present();
                }
            }
        });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        if (page.component === HomePage) {
            // this.nav.setRoot(page.component);
            this.nav.setRoot(TabPage);
        } else {
            this.nav.push(page.component);
        }

    }

    onLogout() {
        this.menu.close();
        console.log(this.tempStorage, '**********');
        this.tempStorage.clearAuthSession();
        this.tempStorage.clearCart();
        this.userloggedin = false;
        this.nav.setRoot(SigninPage);
        // this.app.getRootNavs()[0].setRoot(SigninPage);
    }

    doLogin(resultData) {
        this.tempStorage.setAuthSession(resultData);
        // set member ship
        if (resultData.membership !== undefined) {
            let currentTime = moment().format("X");
            if (resultData.membership.membership_end !== undefined && currentTime <= resultData.membership.membership_end) {
                this.tempStorage.setProfileMembership('active', "premium");
            } else {
                this.tempStorage.setProfileMembership('active', "free");
            }
        } else {
            this.tempStorage.setProfileMembership('active', "free");
        }
        // end
        let filterObj: any = {};
        filterObj.is_cart = true;
        filterObj.user_id = resultData.user_id;

        this.deliveryService.checkUserCart(filterObj).then((result: any) => {

            if (result.data !== undefined && result.data.length > 0) {
                let cartData = result.data[0]; // should be always one latest
                let drugs = [];
                let keys = [];
                let pharmacy = "";
                let pharmacy_id = "";
                let remoteId = "";

                //loop to cart times
                /*	for(var i = 0; i < cartData.items.otcdrugs.length; i++){
                        drugs.push(cartData.items.otcdrugs[i]);
                        keys.push(cartData.items.otcdrugs[i].drug.value);
                        pharmacy = cartData.items.otcdrugs[i].pharmacy_id;
                    }
                    for(var j = 0; j < cartData.items.rxdrugs.length; j++){
                        drugs.push(cartData.items.rxdrugs[j]);
                        keys.push(cartData.items.rxdrugs[j].drug.value);	
                        pharmacy = cartData.items.rxdrugs[j].pharmacy_id;
                    }*/
                remoteId = cartData._id;
                this.tempStorage.cart.drugs = drugs;
                this.tempStorage.cart.keys = keys;

                this.tempStorage.cart.pharmacy = cartData.pharmacy;
                this.tempStorage.cart.pharmacy_id = cartData.pharmacy_id;
                this.tempStorage.cart.cartHasControlledMedicine = cartData.cartHasControlledMedicine;

                if (cartData.medications !== undefined && cartData.medications) {
                    let values = Object.keys(cartData.medications).map(key => cartData.medications[key]);

                    let commaJoinedValues = values;
                    // console.log(commaJoinedValues);
                    this.tempStorage.cart.medications = { drugs: commaJoinedValues, byNdc: cartData.medications };
                } else {
                    this.tempStorage.cart.medications = { drugs: [], byNdc: {} };
                }

                // add actvity array 
                if (cartData.activities !== undefined && cartData.activities) {
                    this.tempStorage.cart.activities = cartData.activities;
                }

                // console.log(cartData.rx);
                this.tempStorage.uploadrx = cartData.rx;
                if (cartData.deliveryInfo !== undefined && cartData.deliveryInfo.address !== undefined) {
                    this.tempStorage.cart.deliveryInfo.address = cartData.deliveryInfo.address;

                }
                if (cartData.deliveryInfo !== undefined) {
                    this.tempStorage.cart.deliveryInfo.deliveryOption = cartData.deliveryInfo.deliveryOption;
                }

                if (cartData.fillpxFormData !== undefined) {
                    this.tempStorage.cart.fillpxFormData = cartData.fillpxFormData;
                }

                if (cartData.rxPickup !== undefined) {
                    this.tempStorage.cart.rxPickup = cartData.rxPickup;
                    if (this.tempStorage.cart.rxPickup.address == undefined) {
                        this.tempStorage.cart.rxPickup.address = {};
                    }
                }

                this.tempStorage.cart.remoteId = remoteId;

                // this.tempStorage.cart.drugs         // drugs detail
                // this.tempStorage.cart.keys          // drug.value
                // this.tempStorage.cart.pharmacy     //pharmacy id
                // remoteId     // _id order if exists

            } else {

            }

            let filterObj: any = {};
            filterObj.case = "admin-config";
            filterObj.postData = {

            }
            this.deliveryService.commonUsecase(filterObj).then((result: any) => {

                //console.log(result.data);//service_able_zip
                if (result !== undefined && result.data !== undefined) {
                    this.tempStorage.setAdminConfig(result.data);
                } else {
                    this.tempStorage.setAdminConfig({});
                }

                this.events.publish('user:loggedin', resultData, Date.now());

            });

        });

    }
}




