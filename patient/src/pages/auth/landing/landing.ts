import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { SigninPage } from '../signin/signin';
import { RegisterOtpVerifyPage } from '../register-otp-verify/register-otp-verify';
import { HomePage } from '../../delivery/home/home';

/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
  }

  takeToLogin(){
    console.log("here"); 
    this.navCtrl.setRoot(SigninPage);
  }
  takeToRegister(){
   
    this.navCtrl.push(RegisterPage,{});
  }
  takeToHome(){
    this.navCtrl.setRoot(HomePage);
  }

}
