import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { AppSettings } from '../app/settings';
import { SigninPage } from '../pages/auth/signin/signin';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
// import { RequestPxPage } from '../pages/delivery/request-px/request-px';
import { DoctorProfilePage } from '../pages/doctor-profile/doctor-profile';
import { LandingPage } from '../pages/auth/landing/landing';
//import { UploadRxPage } from '../pages/upload-rx/upload-rx';
//import { MembershipCardPage } from '../pages/membership-card/membership-card';
import { DeliveryServiceProvider } from '../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../providers/temp-storage/temp-storage';
import { NewRequestsPage } from '../pages/new-requests/new-requests';
import { PastRequestsPage } from '../pages/past-requests/past-requests';
import { DrugSpecPage } from '../pages/drug-spec/drug-spec';

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
    }

    checkAuth(loggedData:any=null)
    {
        if(this.tempStorage.authsession.userdata !== null) {
            //logged in
            this.pages = [
                { title: 'Home', component: HomePage },
                { title: 'Profile', component: DoctorProfilePage },
                { title: 'New Rx Request', component: NewRequestsPage },
                { title: 'Past Rx Request', component: PastRequestsPage }
            ];
            //console.log(this.tempStorage.authsession.userdata);
            if (this.tempStorage.authsession.userdata.profileIncompelete || !this.tempStorage.authsession.userdata.profileData.phone_verified) {
              //  console.log("is it in");
                this.nav.setRoot(DoctorProfilePage);
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
        if(!this.tempStorage.authsession.userdata.profileData.phone_verified){
            this.deliveryService.mobiToast("Verify your phone number to processed further.", "danger");
            return false;
        }
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
