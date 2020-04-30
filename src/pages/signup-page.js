import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";
import { updateIsLogged, updateRole } from '../redux/actions';
import { store } from '../redux/store';

//Services
import LoginService from "../services/loginService";

//Styles
import {styles} from '../my-app-styles';

//Components
import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-snackbar';


class SignUpPage extends navigator(LitElement) {
  static get properties() {
    return {
      user: {type: Object}
    };
  }

  static get styles() {
    return [
      styles,
      css`
        #cont-login {
          margin: 0 auto;;
          text-align: center;
          margin-top: 4rem;
        }
        #cont-login-form mwc-textfield {
          max-width: 400px;
          min-width: 300px;
        }
      `
    ];
  }

  constructor() {
    super();
    this.loginService = new LoginService();
    this.user = {
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: ''
    }
  }

  connectedCallback() {
    super.connectedCallback();
    localStorage.clear();
  }

  render() {
    return html`
      <section class="container">
        <div id="cont-login">
          <h1>Crear cuenta</h1>
          <div id="cont-login-form">
            <mwc-textfield label="Correo electrónico" id="email" iconTrailing="email" required autoValidate pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"></mwc-textfield>
            <br>
            <br>
            <mwc-textfield label="Confirmar correo" id="confirmEmail" iconTrailing="email" required autoValidate pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"></mwc-textfield>
            <br>
            <br>
            <mwc-textfield label="Contraseña" id="password" iconTrailing="lock" type="password" required autoValidate></mwc-textfield>
            <br>
            <br>
            <mwc-textfield label="Confirmar contraseña" id="confirmPassword" iconTrailing="lock" type="password" required autoValidate></mwc-textfield>
            <br>
            <br>
            <mwc-button label="Crear cuenta" raised @click=${this.createAccount}></mwc-button>
          </div>
        </div>
      </section>
      <mwc-snackbar id="message"></mwc-snackbar>
    `;
  }

  createAccount() {
    const snackbar = this.shadowRoot.querySelector('#message');
    this.user = {
      email: this.shadowRoot.querySelector('#email').value,
      confirmEmail: this.shadowRoot.querySelector('#confirmEmail').value,
      password: this.shadowRoot.querySelector('#password').value,
      confirmPassword: this.shadowRoot.querySelector('#confirmPassword').value
    }
    if(this.user.email === '' || this.user.password === '' || this.password === '' || this.confirmPassword === ''){
      snackbar.labelText = 'Asegurate de llenar los campos';
      snackbar.open();
    } else {
      if(this.user.email !== this.user.confirmEmail) {
        snackbar.labelText = 'Los correos no coinciden';
        snackbar.open();
      } else if(this.user.password !== this.user.confirmPassword) {
        snackbar.labelText = 'Las contraseñas no coinciden';
        snackbar.open();
      } else{
        if(this.user.password.length < 8) {
          snackbar.labelText = 'La contraseña debe contener por lo menos 8 caracteres';
          snackbar.open();
        } else {
          this.loginService.signup({email: this.user.email, password: this.user.password})
            .then(data => {
              if(data.ok) {
                store.dispatch(updateIsLogged(true));
                store.dispatch(updateRole(data.user.role));
                localStorage.setItem('serviT', data.token);
                this.navigate('/')
              } else if(data.err.code === 11000 ){
                store.dispatch(updateIsLogged(false));
                snackbar.labelText = 'El correo que tratas de registrar ya esta registrado';
                snackbar.open();
              } else {
                store.dispatch(updateIsLogged(false));
                snackbar.labelText = 'Ocurrio un error al crear tu usuario';
                snackbar.open();
              }
            })
            .catch(err => {
              store.dispatch(updateIsLogged(false));
              snackbar.labelText = 'Ocurrio un error al crear tu usuario';
              snackbar.open();
            })
        }
      }
    }
  }
}

window.customElements.define("signup-page", SignUpPage);