import {html, render} from 'lit-html';
import {BrowserQRCodeReader} from '@zxing/library';

const codeReader = new BrowserQRCodeReader();

class QrScanner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.cameras = [];
    this.result = '';
  }

  connectedCallback() {
    this.render();
    this.initCameras();
  }

  render() {
    render(this.template(), this.shadowRoot);
  }

  template() {
    return html`
      <div>
        <div id="sourceSelectPanel">
          <label for="sourceSelect">Select Camera:</label>
          <select id="sourceSelect" @change=${this.cameraChanged.bind(this)}>
            ${this.cameras.map((camera) =>
                html`<option value="${camera.deviceId}">${camera.label}</option>`
            )}
          </select>
        </div>

        <video
          id="video"
          width="300"
          height="200"
          style="border: 1px solid gray"
        ></video>

        <div class="result">${this.result}</div>
      </div>
    `;
  }

  async initCameras() {
    const videoInputDevices = await codeReader.getVideoInputDevices();
    if (videoInputDevices.length == 0) {
      this.result = 'No camera found.';
    } else {
      this.cameras = videoInputDevices;
      this.scan(this.cameras[0].deviceId);
    }
    this.render();
  }

  cameraChanged() {
    const cameraId = this.shadowRoot.querySelector('#sourceSelect').value;
    this.scan(cameraId);
  }

  async scan(cameraId) {
    const videoElement = this.shadowRoot.querySelector('#video');
    const result = await codeReader.decodeFromInputVideoDevice(
      cameraId,
      videoElement
    );
    this.result = result;
    this.render();
  }
}

customElements.define('qr-scanner', QrScanner);
