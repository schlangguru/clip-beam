import {html, render} from 'lit-html';
import {v4 as uuidv4} from 'uuid';

// Components
import './components/qr-code.js';

class ClipBeamApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    this.uuid = uuidv4();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    render(this.template(), this.shadowRoot);
  }

  template() {
    return html`
      <div class="wrapper">
        <div class="content">
            <qr-code value="${this.uuid}"></qr-code>
            <button type="button">Scan</button>
        </div>
      </div>

      <style>
        .wrapper {
          width: 100vw;
          height: 100vh;

          display: grid;
          grid-template-columns: auto max-content auto;
          grid-template-rows: 35px max-content auto;
          grid-template-areas:
            ". . ."
            ". content ."
            ". . .";

          background-image: url('/assets/background.jpg');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;

        }

        .wrapper .content {
          grid-area: content;
          background-color: #fff;
          border-radius: 10px;
          padding: 10px;
          text-align: center;
        }
      </style>
    `;
  }
}

customElements.define('clip-beam-app', ClipBeamApp);

// document.querySelector('qr-code').setAttribute('value', uuid);

// export function waitForConnetion() {
//   // Create WebSocket connection.
//   const socket = new WebSocket("ws://localhost:9090");

//   // Connection opened
//   socket.addEventListener("open", function (event) {
//     const data = {
//       uuid: uuidv4(),
//     };
//     socket.send(JSON.stringify(data));
//   });

//   // Listen for messages
//   socket.addEventListener("message", function (event) {
//     console.log("Message from server ", event.data);
//   });
// }

// export function connect() {
//   console.log("Todo")
// }
