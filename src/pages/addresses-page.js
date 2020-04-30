import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";

//Styles
import {styles} from '../my-app-styles';

//Services
import AddressesService from '../services/addressService';

//Components
import '@polymer/paper-card'
import '@material/mwc-button'

class AddressesPage extends navigator(LitElement) {
  static get properties() {
    return {
        addresses: {type: Array}
    };
  }

  static get styles() {
    return [
      styles,
      css`
        .card-actions {
            display: flex;
            justify-content: end;
        }

        paper-card {
            max-width: 300px;
            min-width: 300px;
            min-height: 250px;
        }

        h4 {
            margin-top: 10px;
        }

        #cont-addresses {
            text-align: center;
            justify-content: space-around;
            flex-wrap: wrap;
            margin-top: 20px;
        }

        #cont-title {
            display: flex;
            justify-content: space-between;
        }
        #add {
            margin-top: 15px;
        }
      `
    ];
  }

  constructor() {
    super();
    this.addresses = [];
    this.addressesService = new AddressesService();
  }

  connectedCallback() {
    super.connectedCallback();
    
  }

  firstUpdated(){
    if(localStorage.getItem('serviT')){
        this.addressesService.getAddresses(localStorage.getItem('serviT'))
            .then(data => {
                if(data.ok) {
                    this.addresses = data.addresses;
                } else {
                    localStorage.clear();
                    store.dispatch(updateIsLogged(false));
                    store.dispatch(updateRole('CLIENT_ROLE'));
                    this.navigate('/login')
                }
            })
            .catch(err => {
                localStorage.clear();
                store.dispatch(updateIsLogged(false));
                store.dispatch(updateRole('CLIENT_ROLE'));
                this.navigate('/login')
            })
    }
  }

  render() {
    return html`
        <section class="container">
            <div id="cont-title">
                <h3>Direcciones</h3>
                <mwc-button id="add" icon="add" label="Agregar"></mwc-button>
            </div>
            
            <div id="cont-addresses">
                ${this.addresses.length === 0 ? html`
                    <h4>No hay direcciones registradas</h4>
                `: ''}
                ${this.addresses.map(address => html`
                    <paper-card>
                    <div class="card-content">
                        <h4>${address.alias || address.street}</h4>
                        <p>Calle: ${address.street} num. ${address.numExt} ${address.numInt ? html`numInt. ${address.numInt}`: ''} col. ${address.streetTwo}</p>
                        <p>Delegación: ${address.city} cp. ${address.zipCode}</p>
                        <p>Estado: ${address.state}</p>
                    </div>
                    <div class="card-actions">
                        <mwc-button icon="edit" label="Editar"></mwc-button>
                        <mwc-button icon="delete" label="Borrar"></mwc-button>
                    </div>
                    </paper-card>
                `)}
            </div>
        </section>
    `;
  }
}

window.customElements.define("addresses-page", AddressesPage);