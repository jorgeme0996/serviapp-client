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


class LoginPage extends navigator(LitElement) {
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
      password: ''
    }
  }

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(updateIsLogged(false));
    store.dispatch(updateRole('CLIENT_ROLE'));
    localStorage.clear();
  }

  render() {
    return html`
      <section class="container">
        <div id="cont-login">
          <h1>Ingresar</h1>
          <div id="cont-login-form">
            <mwc-textfield 
              label="Correo electrónico" 
              id="email" 
              iconTrailing="email" 
              required 
              autoValidate 
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            ></mwc-textfield>
            <br>
            <br>
            <mwc-textfield 
              label="Contraseña" 
              id="password" 
              iconTrailing="lock" 
              type="password" 
              required 
              autoValidate
            ></mwc-textfield>
            <br>
            <br>
            <mwc-button label="Entrar" raised @click=${this.login}></mwc-button>
          </div>
        </div>
      </section>
      <mwc-snackbar id="message"></mwc-snackbar>
    `;
  }

  login() {
    this.user.email = this.shadowRoot.querySelector('#email').value;
    this.user.password = this.shadowRoot.querySelector('#password').value;
    if(this.user.email === '' || this.user.password === ''){
      const snackbar = this.shadowRoot.querySelector('#message');
      snackbar.labelText = 'Ingresa tus datos';
      snackbar.open();
    } else {
      this.loginService.login(this.user)
      .then(data => {
        if(data.ok) {
          localStorage.setItem('serviT', data.token);
          store.dispatch(updateIsLogged(true));
          store.dispatch(updateRole(data.user.role));
          this.navigate('/');
        } else {
          store.dispatch(updateIsLogged(false));
          const snackbar = this.shadowRoot.querySelector('#message');
          snackbar.labelText = data.err.message;
          snackbar.open();
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
}

window.customElements.define("login-page", LoginPage);