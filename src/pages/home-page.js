import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";

//Styles
import {styles} from '../my-app-styles';

//Components
import '@polymer/paper-card'

class HomePage extends navigator(LitElement) {
  static get properties() {
    return {
      products: { type: Array }
    };
  }

  static get styles() {
    return [
      styles,
      css`

      `
    ];
  }

  constructor() {
    super();
    this.href = "";
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
        <section class="container">
            <h1>Productos</h1>

            <paper-card>
                Hola
            </paper-card>
        </section>
    `;
  }

  linkClick(event) {
    event.preventDefault();
    this.navigate(this.href);
  }
}

window.customElements.define("home-page", HomePage);