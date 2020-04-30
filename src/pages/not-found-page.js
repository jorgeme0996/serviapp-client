import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";

//Components
import '@material/mwc-button';

//Styles
import {styles} from '../my-app-styles';

class NotFoundPage extends navigator(LitElement) {
  static get styles() {
    return [
      styles,
      css`
        .four_zero_four_bg{
            background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
            height: 400px;
            background-position: center;
            text-align: center
        }
 
 
        .four_zero_four_bg h1{
            font-size:80px;
        }
 
        .four_zero_four_bg h3{
            font-size:55px;
            top: 145px;
            position: relative;
        }
      `
    ];
  }

  render() {
    return html`
      <section class="container">
        <div class="four_zero_four_bg">
          <h1 class="text-center ">404</h1>
          <h3>Parece que te perdiste</h3>
        </div>
      </section>
    `;
  }

  linkClick() {
    this.navigate('/');
  }
}

window.customElements.define("not-found-page", NotFoundPage);