import { Component } from '@angular/core';

import { NavController, LoadingController} from 'ionic-angular';

import { Transfer, SocialSharing } from 'ionic-native';

import {VideoService} from '../../providers/video-service';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  providers: [ VideoService ]
})
 
 
export class Page1 {


  public data: any;
  //public host: string = "http://192.168.2.2"; 
  public host: string = "http://192.168.42.1:9000"; 
  public videos: any;

  public vid: HTMLVideoElement;
  public playing: boolean[] = [];
  public progressBar: boolean[] = [];
  public progress: any = 50;
  public currentTime: any = 0;

  public loading: any;

  public users = [
     "151515115151" ,
     "151516115151" ,
     "151517115151" ,
     "151518115151" ,
     "151519115151" ,
     "151520115151" ,
     "151521115151" ,
     "151522115151" ,
     "151523115151" ,
     "151524115151" 
   ];


  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

      this.videoService.load(this.host)
      .then(data => {
        this.videos = data
        refresher.complete();
      }); 

  } 

  play(vidoeId) {

    this.vid = <HTMLVideoElement> document.getElementById('v' + vidoeId); 
    this.playing[vidoeId] = true;   
    this.vid.play();  


    setInterval(() => {
      this.currentTime = this.vid.currentTime;
    }, 500);


  }
  pause(vidoeId) {

    this.vid = <HTMLVideoElement> document.getElementById('v' + vidoeId); 
    this.playing[vidoeId] = false;
    this.vid.pause();

  }


  toDate(timeStamp) {
    if (!timeStamp)
      return '';

    var d = new Date(timeStamp * 1000);

    return d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();

  }
  

  shareVideo(vidoeId) {

    this.download(vidoeId)

  }


  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });

    this.loading.present(); 
  }

  dismissLoanding(){
    this.loading.dismiss();
  }

  download(vidoeId){


    this.showLoading();
  
    const fileTransfer = new Transfer();

    let url = this.host + '/modules/video/clip/' + vidoeId + '.mp4';
    fileTransfer.download(url, cordova.file.dataDirectory + 'tmpSharedClips.').then((entry) => {
      console.log('download complete: ' + entry.toURL());

      this.uploadToDrideNetwork(entry.toURL());

    }, (error) => {
      // handle error
      console.log(error);
    });
  }

  uploadToDrideNetwork(filePath){
    const fileTransfer = new Transfer();
    var options: any;

    options = {
       fileKey: 'file',
       fileName: 'name.jpg',
       headers: {}
    }
    fileTransfer.upload(filePath, "http://getcardigan.com/upload.php", options)
     .then((data) => {
       // success
       console.log("Upload completed > " + data.response)
       this.dismissLoanding();
       this.shareToSocial('https://getcardigan.com/embeded.php?id=' + data.response)
     }, (err) => {
       // error
       console.log(err)
     })
  }


  shareToSocial(url){
    var options = {
      subject: 'dride event', 
      url: url,
      chooserTitle: 'Share an event' // Android only, you can override the default share sheet title
    }

    // Share via share sheet
    SocialSharing.shareWithOptions(options).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

 // doInfinite(infiniteScroll) {
 //    console.log('Begin async operation');

 //    setTimeout(() => {
 //      for (var i = 0; i < 4; i++) {
 //        this.users.push( this.users.length );
 //      }

 //      console.log('Async operation has ended');
 //      infiniteScroll.complete();
 //    }, 500);
 //  }



  constructor(public navCtrl: NavController, public videoService: VideoService, public loadingCtrl: LoadingController) {

      this.videoService.load(this.host)
      .then(data => {
        this.videos = data
      }); 

   }

}

