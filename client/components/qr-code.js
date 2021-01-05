import { html, render } from 'lit-html'
import { BrowserQRCodeSvgWriter } from "@zxing/library";

const codeWriter = new BrowserQRCodeSvgWriter()

class QrCode extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.render();
  }

  render() {
    render(this.template(), this.shadowRoot);
  }

  template() {
    return html`
      <div>
        ${ codeWriter.write(this.value, 300, 300) }
      </div>
    `;
  };

  static get observedAttributes() {
    return ['value']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render()
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newValue) {
    this.setAttribute('value', newValue)
  }

}

customElements.define('qr-code', QrCode);