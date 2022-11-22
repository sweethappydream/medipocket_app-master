import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { AppSettings } from '../app/settings';
import { SigninPage } from '../pages/auth/signin/signin';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
// import { RequestPxPage } from '../pages/delivery/request-px/request-px';
import { PharmacyProfilePage } from '../pages/pharmacy-profile/pharmacy-profile';
import { LandingPage } from '../pages/auth/landing/landing';
import { NewOrdersPage } from '../pages/orders/new-orders/new-orders';
import { ActiveOrdersPage } from '../pages/orders/active-orders/active-orders';
import { PastOrdersPage } from '../pages/orders/past-orders/past-orders';
//import { UploadRxPage } from '../pages/upload-rx/upload-rx';
//import { MembershipCardPage } from '../pages/membership-card/membership-card';
import { DeliveryServiceProvider } from '../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../providers/temp-storage/temp-storage';
// import * as moment from 'moment';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    // make HelloIonicPage the root (or first) page
    rootPage = LandingPage; //HomePage;
    pages                         : Array<{title: string, component: any}>;
    userid                        : any = AppSettings.userid;
    usertype                      : any = AppSettings.usertype;
    userloggedin  : boolean = false;
    pharmacyInfo  : any = {};
    
    constructor(
        public platform: Platform,
        public menu: MenuController,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public events: Events,
        public deliveryService: DeliveryServiceProvider,
        public tempStorage: TempStorageProvider
    ) {
        this.initializeApp();

        // set our app's pages
        this.pages = [
            
        ];

        this.events.subscribe('user:loggedin', (searchData) => {
          this.checkAuth();
        });

        this.events.subscribe('user:loggedout', (searchData) => {
            this.checkAuth();
        });

          
          this.pharmacyInfo = this.tempStorage.pharmacyInfo;
        
       // this.changeDetector.detectChanges();

    }

    checkAuth(loggedData:any=null)
    {
        if(this.tempStorage.authsession.userdata !== null) {
            //logged in
            this.pages = [
                { title: 'Home', component: HomePage },
                { title: 'Profile', component: PharmacyProfilePage },
                { title: 'New Order', component: NewOrdersPage },
                { title: 'Active Order', component: ActiveOrdersPage },
                { title: 'Past Order', component: PastOrdersPage }
            ];
            if(this.tempStorage.authsession.userdata.profileIncompelete) {
                this.nav.setRoot(PharmacyProfilePage);
            }
            else{
                this.nav.setRoot(HomePage);
            }
            
            this.userloggedin                     = true;
        }
        else {
            this.userloggedin                     = false;
            this.nav.setRoot(SigninPage);
        }
    }
    
    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            
        });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        if(page.title === 'Profile'){
            this.nav.push(page.component);
        }
        else if(page.component === "") {

        }
        else{
            this.nav.setRoot(page.component);
        }

    }

    onLogout() {
        this.menu.close();
        this.tempStorage.clearAuthSession();
        this.userloggedin = false;
        this.nav.setRoot(SigninPage);
    }

    login() {

    }
}
