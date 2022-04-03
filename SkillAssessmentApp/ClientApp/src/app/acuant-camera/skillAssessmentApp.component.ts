import { Component } from '@angular/core';
import { ICredentials } from '../credentails.component'
import { acuantConfig } from '../app-contants'
import { AcuantJavascriptWebSdk} from '../../assets/websdk/dist/AcuantJavascriptWebSdk.min.js'

acuantConfig.path = "/ClientApp/src/app/webSdk/dist/",
acuantConfig.jpegQuality = 1.0;
const modal = document.getElementById("acuant-modal");
const modalText = document.getElementById('acuant-modal-text');
const player = document.getElementById('acuant-player');

const cameraBtn = document.getElementById('camera-btn');
const camera = document.getElementById('acuant-camera');
const desc = document.getElementById('desc');
const result = document.getElementById('result-id');

const faceCaptureContainer = document.getElementById('acuant-face-capture-container');
const faceDetectionTextDiv = document.getElementById('face-detection-text');
const resultFace = document.getElementById('result-face');

const resultId = document.getElementById('result-id-img');
const resultError = document.getElementById('result-error');

const sharpnessInput = document.getElementById('sharpness');
const glareInput = document.getElementById('glare');
const dpiInput = document.getElementById('dpi');

const loader = document.getElementById('acuant-loader');

var liveCaptureFailed = false
var currentResult = {};

@Component({
  selector: 'skill-assessment-component',
  templateUrl: './skillAssessmentApp.component.html'
})
export class SkillAssesmentApp {
  public currentCount = 0;
  public credentials: ICredentials = {
    passive_username: "keylessUS@lexisnexisrisk.com",
    passive_password: "iH9$7NGyFi2$@eSA",
    id_username: "keylessUS@lexisnexisrisk.com",
    id_password: "iH9$7NGyFi2$@eSA",
    passive_subscriptionId: "",
    acas_endpoint: "https://acas.acuant.net",
    liveness_endpoint: "https://us.passlive.acuant.net"
  }

  public closeCamera() {
    modal.style.display = "none";
    camera.style.display = "none";
    result.style.display = "block";
    cameraBtn.style.display = "block";
    desc.style.display = "block";
  }
  public onAcuantSdkLoaded() {
    //Unexpected errors shouldn't happen with correct usage of the sdk, and should be fine to leave out,
    //but to be safe you can handle it with a callback function like this:
    AcuantJavascriptWebSdk.setUnexpectedErrorCallback(this.unexpectedError("test error")); 
    this.init();
  }
  public unexpectedError(errorMsg) {
    //handle an unexpected or unknown error
    console.error("Got an unexpected error callback:", errorMsg);
  }
  public init() {
    let base64Token = btoa(this.credentials.id_username + ':' + this.credentials.id_password);
    //alternatively AcuantJavascriptWebSdk.initializeWithToken replacing base64Token with the oauth token leaving the rest the same
    AcuantJavascriptWebSdk.initialize(base64Token, this.credentials.acas_endpoint, {
      onSuccess: function () {
        if (!this.isOldiOS) {
          AcuantJavascriptWebSdk.startWorkers(this.initDone); //no list of workers to start means it will start all the workers.
        } else {
          AcuantJavascriptWebSdk.startWorkers(this.initDone, [AcuantJavascriptWebSdk.ACUANT_IMAGE_WORKER]); //old ios devices can struggle running metrics. See readme for more info.
        }
      },
      onFail: function (code, description) {
        console.log("initialize failed " + code + ": " + description);
      }
    });
  }

  public isOldiOS() {
    let ua = navigator.userAgent;
    let keyPhrase = "iPhone OS";
    const keyPhrase2 = "iPad; CPU OS";
    let index = ua.indexOf(keyPhrase);
    if (index < 0) {
      keyPhrase = keyPhrase2;
      index = ua.indexOf(keyPhrase);
    }
    if (index >= 0) {
      let version = ua.substring(index + keyPhrase.length + 1, index + keyPhrase.length + 3);
      try {
        let versionNum = parseInt(version);
        if (versionNum && versionNum < 13) {
          return true;
        } else {
          return false;
        }
      } catch (_) {
        return false;
      }
    } else {
      return false;
    }
  }

  public initDone() {
    this.showCameraButton();
    console.log("initialize succeded");
  }
  public showCameraButton() {
    cameraBtn.style.display = "block";
  }
}
