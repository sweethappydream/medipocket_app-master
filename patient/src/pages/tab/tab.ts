import { Component } from '@angular/core';
import { NavController, PopoverController, App } from 'ionic-angular';
import { HomePage } from '../../pages/delivery/home/home';
import { PatientProfilePage } from '../../pages/delivery/patient-profile/patient-profile';
import { SearchMedicinesPage } from '../../pages/delivery/search-medicines/search-medicines';
import { OrdersListPage } from '../../pages/orders-list/orders-list';
import { MembershipCardPage } from '../../pages/membership-card/membership-card';
import { MoreTabPage } from '../more-tab/more-tab';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { SigninPage } from '../auth/signin/signin';

@Component({
	selector: 'page-tab',
	templateUrl: 'tab.html'
})
export class TabPage {
	notifybadge: number = 0;

	tab1Root = HomePage;
	tab2Root = MembershipCardPage;
	tab3Root = SearchMedicinesPage;
	tab4Root = OrdersListPage;
	// tab5Root = MoreTabPage;
	//tab6Root = AddNewEventPage;

	constructor(
		public nav: NavController,
		public popoverCtrl: PopoverController,
		public tempStorage: TempStorageProvider,
		public navCtrl: NavController,
		private app: App
	) {
		// var badge = JSON.parse(localStorage.getItem('badges'));
		// console.log(badge);
		// if(badge) {
		//   this.notifybadge = badge;
		// }
	}
	// ionViewDidEnter(){
	//   this.notify();
	// }

	// notify() {
	//   this.userService.notify_badge().subscribe(res => {
	//     console.log(res);
	//     //this.notify_badge;
	//     var count = 0;
	//     for(let item of res.data){
	//       if(item.isSeen === false || item.isSeen === 'false'){
	//           console.log('count:-',count)
	//           count = count + 1;
	//         this.userService.Badges = count;
	//       }
	//     }
	//   //  console.log(count)
	//     console.log(this.notifybadge);
	//   });
	// }

	viewMore() {
		console.log('more');
		let popover = this.popoverCtrl.create(
			MoreTabPage,
			{},
			{ cssClass: 'more-tab-option-popover' }
		);
		popover.present();
	}
	onLogout() {
		console.log(this.tempStorage);
		this.tempStorage.clearAuthSession();
		this.tempStorage.clearCart();
		this.navCtrl.setRoot(SigninPage);
		this.app.getRootNavs()[0].setRoot(SigninPage);
	}
}
