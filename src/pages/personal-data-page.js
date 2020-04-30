import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";
import { updateIsLogged, updateRole } from '../redux/actions';
import { store } from '../redux/store';

//Services
import Auth from '../guard/auth';
import UserServices from '../services/userServices';

//Styles
import {styles} from '../my-app-styles';

//Components
import '@polymer/paper-card'
import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-snackbar';
import '@material/mwc-dialog';

class PersonalDataPage extends navigator(LitElement) {
  static get properties() {
    return {
      user: {type: Object}
    };
  }

  static get styles() {
    return [
      styles,
      css`
        paper-card {
            padding: 15px;
            width: 100%;
            height: 100%;
        }
        .card-actions {
            display: flex;
            justify-content: end;
            padding-top: 15px;
        }
        mwc-textfield {
            width: 30%;
            min-width: 200px;
            margin-bottom: 10px;
        }
        .card-content {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
      `
    ];
  }

  constructor() {
    super();
    this.authService = new Auth();
    this.userServices = new UserServices();
    this.user = {}
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated(){
    if(localStorage.getItem('serviT')){
        this.authService.auth(localStorage.getItem('serviT'))
        .then(data => {
            if(data.ok) {
                this.user = data.user;
                store.dispatch(updateIsLogged(true));
                store.dispatch(updateRole(data.user.role));
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
            <h3>Datos personales</h3>

            <paper-card>
                <div class="card-content">
                    <mwc-textfield 
                        id="name"
                        label="Nombre(s)"
                        value=${this.user.name || ''} 
                        helper="Ejem: Miguel Angel"
                    ></mwc-textfield>
                    <mwc-textfield 
                        id="lastName"
                        label="Apellido Paterno"  
                        value=${this.user.lastName || ''} 
                        helper="Ejem: Lopez"
                    ></mwc-textfield>
                    <mwc-textfield 
                        id="middleName" 
                        label="Apellido Materno" 
                        helper="Opcional" 
                        value=${this.user.middleName || ''} 
                    ></mwc-textfield>
                    <mwc-textfield 
                        id="phone"
                        label="Número de teléfono" 
                        helper="Ejem: 5555555555"
                        maxLength=10
                        autoValidate 
                        pattern="[0-9]{10}"
                        charCounter
                        value=${this.user.phone || ''} 
                    ></mwc-textfield>
                    <mwc-textfield 
                        id="phoneTwo"
                        label="Teléfono secundario" 
                        maxLength=10
                        autoValidate 
                        pattern="[0-9]{10}"
                        helper="Opcional" 
                        value=${this.user.phoneTwo || ''} 
                    ></mwc-textfield>
                    <mwc-textfield 
                        label="Email" 
                        id="email"
                        required 
                        autoValidate 
                        helper="ejemplo@dominio.com" 
                        value=${this.user.email || ''} 
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    ></mwc-textfield>
                </div>
                <div class="card-actions">
                    <mwc-button label="Editar" icon="edit" @click=${this.edit}></mwc-button>
                </div>
            </paper-card>
        </section>
        <mwc-snackbar id="message"></mwc-snackbar>
        <mwc-dialog heading="¿Quieres cambiar tu información personal?">
            <div>Tendras que iniciar sesión de enuevo</div>
            <mwc-button @click=${this.save} label="Aceptar" slot="primaryAction"></mwc-button>
            <mwc-button @click=${this.cancel} label="Cancelar" slot="secondaryAction"></mwc-button>
        </mwc-dialog>
    `;
  }

  edit() {
    const emailInput = this.shadowRoot.querySelector('#email');
    const phoneInput = this.shadowRoot.querySelector('#phone');
    const phoneTwoInput = this.shadowRoot.querySelector('#phoneTwo');
    const snackbar = this.shadowRoot.querySelector('#message');
    if(emailInput.checkValidity() && phoneInput.checkValidity() && phoneTwoInput.checkValidity()) {
        this.shadowRoot.querySelector('mwc-dialog').open = true;
    } else {
        console.log(false);
        snackbar.labelText = 'Revisa que los campos esten correctamente ingresados';
        snackbar.open();
    }
  }

  save(){
    this.shadowRoot.querySelector('mwc-dialog').close();
    let updateUser = {};
    this.shadowRoot.querySelectorAll('mwc-textfield').forEach(input => {
        const key = input.getAttribute('id');
        updateUser[key] = input.value
    })
    this.userServices.updateUser(localStorage.getItem('serviT'), updateUser)
        .then(data => {
            if(data.ok) {
                data.user = this.user;
                this.navigate('/login')
            }else {
                if(data.err.code === 11000) {
                    snackbar.labelText = 'El correo que ingresaste ya está en uso';
                    snackbar.open();
                }
            }
        })
        .catch(err => {
            snackbar.labelText = 'Ocurrio un error al actualizar tu usuario';
            snackbar.open();
            console.log(err);
        })
  }

  cancel(){
    this.shadowRoot.querySelector('mwc-dialog').close();
  }
}

window.customElements.define("personal-data-page", PersonalDataPage);