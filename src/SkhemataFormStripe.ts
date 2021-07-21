import '@power-elements/stripe-elements';
import { CSSResult, html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Bulma } from '@skhemata/skhemata-css';

export class SkhemataFormStripe extends LitElement {
  static styles = <CSSResult[]>[
    Bulma,
    css`
      stripe-elements {
        --stripe-elements-base-line-height: 1.57rem;
        --stripe-elements-border: 1px solid #dbdbdb;
      }
    `,
  ];

  @property({ type: Object }) error: any;

  @property({ type: Object }) source: any;

  @property({ type: Boolean }) submitDisabled = false;

  @property({ type: String, attribute: 'publishable-key' }) publishableKey = '';

  @property({ type: Object }) stripeElements?: HTMLElement | null;

  onChange(e: any) {
    this.submitDisabled = !(e.target.complete && !e.target.hasError);
  }

  onClick() {
    const stripe: any = this.shadowRoot?.querySelector('stripe-elements');
    stripe?.createSource();
  }

  onSource(e: any) {
    this.source = e.detail.source;
  }

  onError(e: any) {
    this.error = e.target.error;
  }

  firstUpdated() {
    this.stripeElements = this.shadowRoot?.querySelector('stripe-elements');
  }

  render() {
    return html`
    <div class="field">
      <label class="label"></label>
      <div class="control">
        <stripe-elements
          hide-postal-code = "true"
          publishable-key=${this.publishableKey}
        ></stripe-elements>
      </div>
    </div>
  </div>
    `;
  }
}
