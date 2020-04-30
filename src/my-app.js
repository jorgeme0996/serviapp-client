import { LitElement, html, css } from 'lit-element';
import { router } from 'lit-element-router';
import Auth from './guard/auth';
import {connect} from 'pwa-helpers';
import {store} from './redux/store';
import { updateIsLogged, updateRole } from './redux/actions';
const auth = new Auth();

//Componentes
import './components/app-link';
import './components/app-main';
import '@material/mwc-drawer';
import '@material/mwc-icon';
import '@material/mwc-icon-button';
import '@material/mwc-top-app-bar-fixed';

//Pages
import './pages/home-page';
import './pages/login-page';
import './pages/signup-page';
import './pages/not-found-page';
import './pages/profile-page';

//Styles
import {styles} from './my-app-styles';

class App extends connect(store)(router(LitElement)) {
  static get properties() {
    return {
      route: { type: String },
      params: { type: Object },
      query: { type: Object },
      data: {type: Object},
      openSideBar: { type: Boolean },
      isLogged: { type: Boolean },
      role: { type: String }
    };
  }

  stateChanged(state) {
    this.isLogged = state.isLogged;
    this.role = state.role;
  }
 
  static get routes() {
    return [
      {
        name: 'home',
        pattern: '',
        data: { title: 'Home' }
      },
      {
        name: 'login',
        pattern: '/login'
      }, 
      {
        name: 'signup',
        pattern: '/signup'
      },
      {
        name: 'profile',
        pattern: '/profile',
        data: { token: localStorage.getItem('serviT') },
        authentication: {
          unauthenticated: {
            name: "login"
          },
          authenticate: () => {
            return new Promise((resolve, reject) => {
              if(localStorage.getItem('serviT')){
                auth.auth(localStorage.getItem('serviT'))
                  .then(data => {
                    if(data.ok) {
                      resolve(true)
                      store.dispatch(updateIsLogged(true));
                      store.dispatch(updateRole(data.user.role));
                    } else {
                      resolve(false)
                      store.dispatch(updateIsLogged(false));
                    }
                  })
                  .catch(err => {
                    resolve(false)
                    store.dispatch(updateIsLogged(false));
                  })
              } else {

              }
            })
          }
        }
      },
      {
        name: 'not-found',
        pattern: '*'
      }
    ];
  }
  
  static get styles() {
    return [
      styles,
      css`
        .cont-drawer-links {
          display: flex;
          flex-direction: column;
        }
        .link {
          padding: 15px;
          cursor: pointer;
          display: flex;
        }
        .link:hover {
          transition: ease-out 0.5s;
          background: #E0E0E0;
        }
        .link mwc-icon {
          margin-right: 10px;
        }
      `
    ];
  }
 
  constructor() {
    super();
    this.route = '';
    this.params = {};
    this.query = {};
    this.data = {};
    this.openSideBar = false;
    this.authService = new Auth();
  }

  connectedCallback() {
    super.connectedCallback();
    if(localStorage.getItem('serviT')) {
      this.authService.auth(localStorage.getItem('serviT'))
        .then(data => {
          if(data.ok) {
            store.dispatch(updateIsLogged(true));
            store.dispatch(updateRole(data.user.role));
          } else {
            store.dispatch(updateIsLogged(false));
          }
        })
        .catch(err => {
          store.dispatch(updateIsLogged(false));
        }) 
    }
  }
 
  router(route, params, query, data) {
    this.route = route;
    this.params = params;
    this.query = query;
    this.data = data;
  }
 
  render() {
    return html`
      <mwc-drawer hasHeader type="modal">
        <span slot="title">Menú</span>
        <div class="cont-drawer-links">
          <app-link href="/" @click=${this.closeDrawer}>
            <div class="link">
              <mwc-icon>home</mwc-icon>
              Inicio
            </div>
          </app-link>
          ${this.isLogged ? html`
            <app-link href="/profile" @click=${this.logout}>
              <div class="link">
                <mwc-icon>person</mwc-icon>
                Perfil
              </div>
            </app-link>
            ${this.role === 'ADMIN_ROLE' ? html`
              <app-link href="/">
                <div class="link" @click=${this.closeDrawer}>
                  <mwc-icon>computer</mwc-icon>
                  Administración
                </div>
              </app-link>
            `:''}
            <app-link href="/" @click=${this.logout}>
              <div class="link">
                <mwc-icon>exit_to_app</mwc-icon>
                Cerrar sesión
              </div>
            </app-link>
          `: html`          
            <app-link href="/login" @click=${this.closeDrawer}>
              <div class="link">
                <mwc-icon>input</mwc-icon>
                Iniciar sesión
              </div>
            </app-link>
            <app-link href="/signup" @click=${this.closeDrawer}>
              <div class="link">
                <mwc-icon>person_add</mwc-icon>
                Registrarme
              </div>
            </app-link>
          `}
        </div>
        <div slot="appContent">
          <mwc-top-app-bar-fixed centerTitle>
            <mwc-icon-button slot="navigationIcon" icon="menu" @click=${this.openDrawer}></mwc-icon-button>
            <div slot="title">ServiApp</div>
            <mwc-icon-button icon="shopping_cart" slot="actionItems"></mwc-icon-button>
          </mwc-top-app-bar-fixed>

          <app-main active-route=${this.route}>
            ${this.route === "home" ? html`
              <home-page route="home"></home-page>
            `: this.route === "login" ? html`
              <login-page route="login"></login-page>
            `: this.route === 'signup' ? html`
              <signup-page route="signup"></signup-page>
            `: this.route === 'profile'? html`
              <profile-page .data=${this.data} route="profile"></profile-page>
            `:html`
              <not-found-page route="not-found"></not-found-page>
            `}
          </app-main>
        </div>
      </mwc-drawer>
    `;
  }

  openDrawer() {
    this.shadowRoot.querySelector('mwc-drawer').open = true;
  }
  
  closeDrawer() {
    this.shadowRoot.querySelector('mwc-drawer').open = false;
  }

  logout() {
    localStorage.clear();
    store.dispatch(updateIsLogged(false));
    this.closeDrawer();
  }
}
 
customElements.define('my-app', App);