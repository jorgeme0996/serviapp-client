import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";

//Styles
import {styles} from '../my-app-styles';

//Components
import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-snackbar';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import './personal-data-page';
import './addresses-page';


class ProfilePage extends navigator(LitElement) {
  static get properties() {
    return {
        data: {type: Object},
        page: {type: String}
    };
  }

  static get styles() {
    return [
      styles,
      css`
        #cont-options {
            width: 20%;
        }

        #cont-actions {
            width: 80%;
        }

        .cont-all {
            display: flex;
            max-width: 100%;
            flex-wrap: wrap;
        }

        @media screen and (max-width: 700px) {
            #cont-actions {
                width: 100%;
            }

            #cont-options {
                width: 100%;
            }
        }
      `
    ];
  }

  constructor() {
    super();
    this.page = 'personal-data';
    this.data = {}
  }

  connectedCallback() {
    super.connectedCallback();
  }

  updated(changedProps) {
      if(changedProps.has('data')) {
        localStorage.setItem('serviT', this.data.token);
      }
  }

  render() {
    return html`
      <section class="container">
        <h1>Información de perfil</h1>
        <div class="cont-all">
            <div id="cont-options">
                <mwc-list>
                    <mwc-list-item page="personal-data" @click=${this.decideScreen}>Datos personales</mwc-list-item>
                    <mwc-list-item page="addresses" @click=${this.decideScreen}>Direcciones</mwc-list-item>
                    <mwc-list-item page="update-password" @click=${this.decideScreen}>Contraseña</mwc-list-item>
                </mwc-list>
            </div>
            <div id="cont-actions">
                ${this.page === 'personal-data' ? html`
                    <personal-data-page></personal-data-page>
                `: this.page === 'addresses' ? html`
                    <addresses-page></addresses-page>
                `: ''}
            </div>
        </div>
      </section>
      <mwc-snackbar id="message"></mwc-snackbar>
    `;
  }

  decideScreen(e) {
    this.page = e.target.getAttribute('page');
  }

}

window.customElements.define("profile-page", ProfilePage);