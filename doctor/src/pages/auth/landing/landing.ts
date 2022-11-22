import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { SigninPage } from '../signin/signin';
import { RegisterOtpVerifyPage } from '../register-otp-verify/register-otp-verify';

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
    // var html = "||ADHD & Autism||Addiction Medicine||Aerospace Medicine||Aesthetic Medicine||Anesthesiology||Anti-Aging Medicine||Bariatrics||Breast Surgery||Cardiology - Cardiac Electrophysiology||Cardiothoracic Surgery||Clinical Genetics||Clinical Lipidology||Clinical Neurophysiology||Clinical Psychology||Cosmetic Surgery||Critical Care||Cytopathology||Dentistry||Dentistry - Cosmetic||Dentistry - Endodontics||Dentistry - Orthodontics||Dentistry - Pediatric||Dentistry - Periodontics||Dentistry - Prosthodontics||Dermatology||Dermatopathology||Diagnostic Radiology||ENT - Head & Neck Surgery||ENT - Head & Neck Surgery - Pediatric||Ear, Nose, and Throat Surgery||Emergency Medicine||Environmental Health||Eye Surgery||Facial Plastic Surgery||Family Medicine||Fertility Medicine||Functional Medicine||General (Internal) Medicine||General Medicine||General Practice||Genetics Counseling||Gynecology||Gynecology - Oncology||Hair Restoration||Healthcare Professional||Histopathology||Holistic Medicine||Integrative Medicine||Intensive Care Medicine||Internal Medicine||Internal Medicine & Pediatrics||Internal Medicine - Allergy||Internal Medicine - Allergy & Immunology||Internal Medicine - Cardiology||Internal Medicine - Diabetology||Internal Medicine - Endocrinology||Internal Medicine - Gastroenterology||Internal Medicine - Geriatrics||Internal Medicine - Hematology||Internal Medicine - Hematology & Oncology||Internal Medicine - Hepatology||Internal Medicine - Hospital-based practice||Internal Medicine - Immunology||Internal Medicine - Infectious Disease||Internal Medicine - Nephrology & Dialysis||Internal Medicine - Obstetric Medicine||Internal Medicine - Oncology||Internal Medicine - Pulmonary Critical Care||Internal Medicine - Pulmonology||Internal Medicine - Rheumatology||Internal Medicine - Sleep Medicine||Interventional Cardiology||Interventional Pulmonology||Legal Medicine||Medical Ophthalmology||Medical Psychotherapy||Neurology||Neuromuscular Medicine||Neuropathology||Neuroradiology||Neurosurgery||Nuclear Medicine||Obstetrics & Gynecology||Obstetrics & Gynecology - Maternal Fetal Medicine||Obstetrics & Gynecology - Urogynecology||Occupational Medicine||Oncology||Oncoradiology||Ophthalmology||Ophthalmology - LASIK Surgery||Ophthalmology - Pediatric||Ophthalmology - Retinal Surgery||Oral Facial Pain Management||Oral Surgery||Orthopedic Surgery||Orthopedic Surgery - Foot & Ankle||Orthopedic Surgery - Pediatric||Orthopedic Surgery - Reconstruction||Orthopedic Surgery - Spine||Pain Management||Palliative Care||Pathology||Pediatric Anesthesiology||Pediatric Electrophysiology||Pediatric Rehabilitation Medicine||Pediatric Rheumatology||Pediatrics||Pediatrics - Adolescent Medicine||Pediatrics - Allergy||Pediatrics - Allergy & Asthma||Pediatrics - Cardiology||Pediatrics - Critical Care||Pediatrics - Dermatology||Pediatrics - Developmental & Behavioral||Pediatrics - Emergency Medicine||Pediatrics - Endocrinology||Pediatrics - Gastroenterology||Pediatrics - Hematology & Oncology||Pediatrics - Infectious Disease||Pediatrics - Neonatology||Pediatrics - Nephrology & Dialysis||Pediatrics - Neurology||Pediatrics - Oncology||Pediatrics - Psychiatry||Pediatrics - Pulmonology||Pediatrics - Sports Medicine||Pediatrics - Urology||Pharmacology||Phlebology||Physical & Rehabilitation Medicine||Podiatric Surgery||Podiatry||Preventive Medicine||Proctology||Psychiatry||Psychiatry - Geriatric||Public Health||Radiation Oncology||Radiology||Radiology - Interventional||Renal Medicine||Respiratory Medicine||Sexual Health Practitioner||Sports Medicine||Surgery||Surgery - Colorectal||Surgery - Hand Surgery||Surgery - Head & Neck||Surgery - Oncology||Surgery - Oral & Maxillofacial||Surgery - Pediatric||Surgery - Plastics||Surgery - Thoracic||Surgery - Transplant||Surgery - Trauma||Surgery - Vascular||Toxicology||Transfusion Medicine||Trauma & Orthopaedic Surgery||Travel Medicine||Undersea and Hyperbaric Medicine||Urgent Care||Urology||Urology - Oncology||Wilderness Medicine||Wound care";
    /* var html = "||MD||DO||MBBS||MBChB||DMD||DDS||DPM||EdD||PsyD||PhD||PharmD";
    var res = html.split("||");
    var result  = [];
    for(var x = 1; x <= res.length-1; x++) {
      let item : any = {value: x, text: res[x]};
        result.push(item);
      }
      console.log(JSON.stringify(result)); */
      
    /* var result  = [];
    for (var x = 2019; x >= 1930; x--) {
      // console.log(x);
      let item : any = {value: x, text: x};
      result.push(item);
    }
    console.log(JSON.stringify(result)); */
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

}
