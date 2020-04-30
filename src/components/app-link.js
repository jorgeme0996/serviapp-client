import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";

class Link extends navigator(LitElement) {
  static get properties() {
    return {
      href: { type: String }
    };
  }
  static get styles() {
    return css`
      a {
        margin: 5px;
        text-decoration: none;
        color: black;
      }
    `;
  }
  constructor() {
    super();
    this.href = "";
  }
  render() {
    return html`
      <div href="${this.href}" @click="${this.linkClick}">
        <slot></slot>
      </div>
    `;
  }

  linkClick(event) {
    event.preventDefault();
    this.navigate(this.href);
  }
}

window.customElements.define("app-link", Link);