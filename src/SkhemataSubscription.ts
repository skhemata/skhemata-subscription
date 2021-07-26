import { html, css, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { loadStripe } from '@stripe/stripe-js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
// import { get } from 'lit-translate';
import { SkhemataBase } from '@skhemata/skhemata-base';

import {
  SkhemataForm,
  SkhemataFormTextbox,
  SkhemataFormTextarea,
  SkhemataFormDropdown,
  SkhemataFormCheckbox,
  SkhemataFormButton,
  SkhemataFormAutocomplete,
} from '@skhemata/skhemata-form';
import { SkhemataSubscriptionPlan } from './SkhemataSubscriptionPlan';

import { SkhemataFormStripe } from './SkhemataFormStripe';

import { genId } from './directives';

export class SkhemataSubscription extends SkhemataBase {
  static get styles() {
    return <CSSResult[]>[
      ...super.styles,
      css`
        :host {
          display: block;
          padding: 25px;
          color: var(--skhemata-subscription-text-color, #000);
          --stripe-elements-width: 0px;
        }
        .panel .panel-block {
          flex-direction: column;
          align-items: normal;
          padding: 1rem;
        }

        .panel .column {
          padding: 0rem 0.75rem;
        }
        .panel .columns {
          padding: 0rem;
          margin-top: 0rem;
        }
        .left-column {
          background: #f3f4f6;
          border: 1px solid #e6e6e6;
        }

        .column.right {
          text-align: right;
        }

        #terms-checkbox {
          margin-top: 1rem;
        }
        .review-container {
          box-shadow: none;
        }
        .total-payment {
          color: var(--skhemata-subscription-summary-color, #00c4a7);
        }
        hr {
          background-color: #e2e2e2;
          margin-top: 0;
          margin-bottom: 2rem;
        }
        .dropdown-trigger button {
          color: #d0d0d0;
        }
        .modal-button {
          margin: auto;
          width: 30%;
          height: 1.5rem;
        }
        .review-message {
          margin: 2rem 0;
          font-size: 0.8em;
        }
        .back-button {
          margin-top: 0.5rem;
        }
        .button.is-primary {
          background-color: var(
            --skhemata-subscription-button-background-color,
            #00c4a7
          );
          color: var(--skhemata-subscription-button-text-color, #ffffff);
        }
        .button.is-primary:hover {
          background-color: var(
            --skhemata-subscription-button-background-color,
            #00c4a7
          );
          color: var(--skhemata-subscription-button-text-color, #ffffff);
          opacity: 75%;
        }
        a.text-link {
          color: var(--skhemata-subscription-link-color, rgb(50, 115, 220));
        }
        a.text-link:hover {
          opacity: 75%;
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      'skhemata-form': SkhemataForm,
      'skhemata-form-textbox': SkhemataFormTextbox,
      'skhemata-form-textarea': SkhemataFormTextarea,
      'skhemata-form-dropdown': SkhemataFormDropdown,
      'skhemata-form-checkbox': SkhemataFormCheckbox,
      'skhemata-form-button': SkhemataFormButton,
      'skhemata-form-stripe': SkhemataFormStripe,
      'skhemata-form-autocomplete': SkhemataFormAutocomplete,
      'skhemata-subscription-plan': SkhemataSubscriptionPlan,
    };
  }

  @property({}) elements: any;

  @property({}) cardNumberElement: any;

  @property({}) cardExpiryElement: any;

  @property({}) cardCvcElement: any;

  @property({ type: Object }) formData = {
    first_name: '',
    last_name: '',
    email: '',
    mail_code: '',
    city_id: 1,
    address_city: '',
    address_country: '',
    address_state: '',
    street1: '',
    portal_name: '',
    subscription_plan_id: -1,
    source: '',
    currency: 'usd',
    terms: false,
    token: '',
    use_sca: 1,
    create_sample_data: 0,
  };

  @property({ type: String }) thankYouTitle = 'Thank you for the subscription.';

  @property({ type: String }) thankYouMessage =
    'We will be in touch to get you started!';

  @property({ type: Number }) total = 0.0;

  @property({ type: Number }) tax: any;

  @property({ type: Object }) stripe: any;

  @property({ type: String }) stripeKeySelected = '';

  @property({ type: Object, attribute: 'stripe-public-keys' })
  stripePublicKeys: any;

  @property({ type: Number }) defaultPlan?: number;

  @property({ type: Number }) selectedPlanIndex = -1;

  @property({ type: Boolean, attribute: false }) isLoading = false;

  @property({ type: Object }) currency = {
    locale: 'en-US',
    code: 'USD',
  };

  async handleSubmit() {
    this.isLoading = true;
    const skhemataFormStripe: any = this.shadowRoot?.getElementById(
      'skhemata-form-stripe'
    );
    const { stripeElements } = skhemataFormStripe;
    stripeElements
      ?.createToken()
      .then((response: any) => response)
      .then((response: any) => {
        const cardToken = response.token.id;
        const subscription = this.skhemata?.createSubscription({
          ...this.formData,
          portal_name: genId(12),
        });
        subscription
          ?.payWithStripe(this.stripe, cardToken)
          .then(data => {
            dispatchEvent(
              new CustomEvent('payment', {
                detail: {
                  status: 'success',
                  data,
                },
              })
            );
            this.isLoading = false;
            this.openThankYouModal();
            this.selectedPlanIndex = -1;
            this.formData = {
              first_name: '',
              last_name: '',
              email: '',
              mail_code: '',
              city_id: 1,
              address_city: '',
              address_country: '',
              address_state: '',
              street1: '',
              portal_name: '',
              subscription_plan_id: -1,
              source: '',
              currency: 'usd',
              terms: false,
              token: '',
              use_sca: 1,
              create_sample_data: 0,
            };
          })
          .catch(error => {
            this.isLoading = false;
            this.dispatchEvent(
              new CustomEvent('payment', {
                detail: {
                  status: 'error',
                  data: error,
                },
              })
            );
          });
      });
  }

  handleChange(event: any) {
    if (!event || !event.detail || !event.detail.data) return;
    const inputData = event.detail.data;
    if (inputData['first-name'])
      this.formData.first_name = inputData['first-name'];
    if (inputData['last-name'])
      this.formData.last_name = inputData['last-name'];
    if (inputData.email) this.formData.email = inputData.email;
    if (inputData['street-address'])
      this.formData.street1 = inputData['street-address'];
    if (inputData['mail-code'])
      this.formData.mail_code = inputData['mail-code'];
    if (inputData.city) this.formData.city_id = inputData.city;
    if (inputData['portal-name'])
      this.formData.portal_name = inputData['portal-name'];
    if (inputData.plan || inputData.plan === '')
      this.selectedPlanIndex = inputData.plan
        ? parseInt(inputData.plan, 10)
        : -1;
    this.formData.subscription_plan_id =
      this.configData[this.selectedPlanIndex]?.id;
    if (inputData.source) this.formData.source = inputData.source;
    if (inputData.terms) this.formData.terms = inputData.terms;
  }

  async firstUpdated() {
    await super.firstUpdated();
    this.stripe = await loadStripe(this.stripePublicKeys.CA);
    if (this.defaultPlan) {
      this.selectPlan(
        new CustomEvent('select-plan', {
          detail: {
            data: this.defaultPlan,
          },
        })
      );
    }
  }

  submitForm() {
    const paymentForm: any = this.shadowRoot?.getElementById('payment-form');
    paymentForm.handleSubmit();
  }

  selectPlan(e: any) {
    this.selectedPlanIndex = e.detail.data;
    this.requestUpdate();
    window.scrollTo({ top: 0 });
  }

  displayPlans() {
    this.selectedPlanIndex = -1;
    this.requestUpdate();
    window.scrollTo({ top: 0 });
  }

  // TODO: move tax logic to backend and SDK
  async getTaxRate(e?: any) {
    const cityElement: SkhemataFormAutocomplete | null | undefined =
      this.shadowRoot?.querySelector('[name="city"]');
    const selected: string | undefined = cityElement?.selected
      .trim()
      .replace(/,/g, '');
    if (selected) {
      const locales = await fetch(
        `${this.api.url}/locale/city/${selected}`
      ).then(res => res.json());
      const locale = locales[0];
      if (locale.country_id === 33) {
        this.stripe = await loadStripe(this.stripePublicKeys.CA);
        this.stripeKeySelected = this.stripePublicKeys.CA;
        const subcountryTax = await fetch(
          `${this.api.url}/locale/subcountry-tax/33`
        ).then(res => res.json());
        this.tax = JSON.parse(
          subcountryTax.filter(
            (tax: any) => tax.subcountry_id === locale.subcountry_id
          )[0].rate
        );
        this.tax.rateTotal = this.tax.gst + this.tax.pst + this.tax.hst;
        this.tax.feeTotal =
          0.01 *
          this.tax.rateTotal *
          this.configData[this.selectedPlanIndex]?.price;
        this.total =
          this.configData[this.selectedPlanIndex]?.price + this.tax.feeTotal;
        return;
      }
    }
    this.tax = undefined;
    this.stripe = await loadStripe(this.stripePublicKeys.US);
    this.stripeKeySelected = this.stripePublicKeys.US;
    if (e)
      this.total =
        this.configData &&
        this.shadowRoot?.getElementById('plans')?.getAttribute('value')
          ? this.configData[this.selectedPlanIndex]?.price
          : 0;

    // use trial price if trial is defined
    if (
      typeof this.configData[this.selectedPlanIndex]?.trial?.price === 'number'
    ) {
      this.total = this.configData[this.selectedPlanIndex].trial.price;
    }
  }

  openThankYouModal() {
    this.shadowRoot
      ?.getElementById('thank-you-modal')
      ?.classList.add('is-active');
  }

  closeThankYouModal() {
    this.shadowRoot
      ?.getElementById('thank-you-modal')
      ?.classList.remove('is-active');
  }

  render() {
    const selectedPlan = this.configData
      ? this.configData[this.selectedPlanIndex]
      : undefined;

    const billingDate = new Date();
    if (selectedPlan?.trial) {
      let days = selectedPlan.trial.periodLength;
      if (selectedPlan.periodType === 'month') {
        days *= 30;
      } else if (selectedPlan.periodType === 'year') {
        days *= 365;
      }
      billingDate.setDate(billingDate.getDate() + days);
    }

    const plans = html`<div
      class="plans-grid ui five column stackable doubling container grid plans-grid--center"
    >
      <skhemata-subscription-plan
        .plans="${this.configData}"
        .currency=${this.currency}
        @select-plan=${this.selectPlan}
      ></skhemata-subscription-plan>
    </div>`;

    const accountInfo = html`
      <p class="label">Account Information</p>
      <div class="columns is-desktop">
        <skhemata-form-textbox
          class="column"
          name="first-name"
          placeholder="First Name"
          value="${this.formData.first_name}"
          required
        ></skhemata-form-textbox>
        <skhemata-form-textbox
          class="column"
          name="last-name"
          placeholder="Last Name"
          value="${this.formData.last_name}"
          required
        ></skhemata-form-textbox>
      </div>
      <div class="columns">
        <skhemata-form-textbox
          type="email"
          class="column"
          name="email"
          placeholder="Email Address"
          value="${this.formData.email}"
          required
        ></skhemata-form-textbox>
      </div>
    `;

    const otherInfo = html`
      <p class="label">Other Information</p>
      <div class="columns">
        <skhemata-form-textbox
          class="column"
          name="source"
          placeholder="How did you hear about us?"
          value="${this.formData.source}"
          required
        ></skhemata-form-textbox>
      </div>
    `;

    const paymentInfo = html`
      <p class="label mt-2">Payment Information</p>
      <div class="columns is-desktop">
        <skhemata-form-textbox
          class="column is-two-thirds-desktop"
          name="street-address"
          placeholder="Street Address"
          value="${this.formData.street1}"
          required
        ></skhemata-form-textbox>
        <skhemata-form-textbox
          class="column"
          name="mail-code"
          placeholder="Mail Code"
          value="${this.formData.mail_code}"
          required
        ></skhemata-form-textbox>
      </div>
      <div class="columns">
        <skhemata-form-autocomplete
          class="column"
          placeholder="City"
          name="city"
          .api=${this.api}
          maplabel="name"
          mapvalue="id"
          value="${this.formData.address_city}"
          required
          @change=${() => this.getTaxRate()}
        ></skhemata-form-autocomplete>
      </div>
      <div class="columns">
        <skhemata-form-stripe
          class="column"
          id="skhemata-form-stripe"
          publishable-key=${this.stripeKeySelected
            ? this.stripeKeySelected
            : this.stripePublicKeys.CA}
        ></skhemata-form-stripe>
      </div>
    `;

    const taxes = () => {
      if (this.tax?.hst) {
        return html`
          <div class="columns">
            <div class="column">
              <div class="total-price">HST</div>
            </div>
            <div class="column right">
              <div class="price-total">${this.tax.hst}%</div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="total-price">Sales Tax</div>
            </div>
            <div class="column right">
              <div class="price-total">
                $${this.tax?.feeTotal?.toFixed(2)} (${this.tax.rateTotal}%)
              </div>
            </div>
          </div>
        `;
      }
      if (this.tax?.gst || this.tax?.pst) {
        return html`
          ${this.tax?.gst
            ? html`
                <div class="columns">
                  <div class="column">
                    <div class="total-price">GST</div>
                  </div>
                  <div class="column right">
                    <div class="price-total">${this.tax.gst}%</div>
                  </div>
                </div>
              `
            : null}
          ${this.tax?.pst
            ? html`
                <div class="columns">
                  <div class="column">
                    <div class="total-price">PST</div>
                  </div>
                  <div class="column right">
                    <div class="price-total">${this.tax.pst}%</div>
                  </div>
                </div>
              `
            : null}
          <div class="columns">
            <div class="column">
              <div class="total-price">Sales Tax</div>
            </div>
            <div class="column right">
              <div class="price-total">
                $${this.tax?.feeTotal?.toFixed(2)} (${this.tax.rateTotal}%)
              </div>
            </div>
          </div>
        `;
      }
      return html``;
    };

    const reviewPayment = html`
      <div class="panel review-container">
        <p class="label">Review Payment</p>
        <div class="panel-block">
          <div class="title is-6">
            <div class="columns">
              <div class="column">Select Plan</div>
              <div class="column right">Price</div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              ${this.configData?.length
                ? html`
                    <skhemata-form-dropdown
                      id="plans"
                      name="plan"
                      required
                      placeholder=""
                      value="${`${this.selectedPlanIndex}`}"
                      @change=${this.getTaxRate}
                    >
                      ${this.configData.map((plan: any, index: number) =>
                        unsafeHTML(`
                      <option value="${index}">${plan.name}</option>
                    `)
                      )}
                    </skhemata-form-dropdown>
                  `
                : html``}
            </div>
            <div class="column right">
              $${this.configData &&
              this.shadowRoot?.getElementById('plans')?.getAttribute('value')
                ? selectedPlan?.price
                : '0.00'}
            </div>
          </div>
        </div>
        <div class="panel-block">
          ${taxes()}

          <div class="columns">
            <div class="column">
              <div class="total-price total-payment">
                <b>Total Payment</b>
                ${this.configData && selectedPlan?.trial
                  ? `(${selectedPlan.trial.price === 0 ? 'Free' : ''} ${
                      selectedPlan.trial.periodLength
                    } ${selectedPlan.trial.periodType} trial)`
                  : ''}
              </div>
            </div>
            <div class="column right">
              <div class="price-total">$${this.total?.toFixed(2)}</div>
            </div>
          </div>
          <div>
            ${this.configData && selectedPlan?.trial
              ? `Your next billing will start on ${billingDate.toLocaleDateString()}`
              : ''}
          </div>
          <div class="mt-3 review-message">
            Thrinacia plans are available for purchase worldwide. Once you
            subscribe to the selected plan we will start deployment of your new
            website.
          </div>

          <div class="columns mt-3">
            <skhemata-form-checkbox
              class="column"
              name="terms"
              value="${this.formData.terms}"
              required
              >I agree to
              <a href="/terms" target="_blank" class="text-link"
                >Terms of Service</a
              >,
              <a href="/privacy" target="_blank" class="text-link">Privacy</a>,
              <a class="text-link" href="/cookies">Cookies</a> and
              <a
                href="/faq/post/what-is-thrinacia-atlas-refund-policy"
                target="_blank"
                class="text-link"
                >Refund Policy</a
              >
            </skhemata-form-checkbox>
          </div>
        </div>
        <div class="panel-block">
          <button
            class="button is-primary ${this.isLoading ? 'is-loading' : ''}"
            @click=${this.submitForm}
          >
            Subscribe
          </button>
          <button
            class="button is-light mt-2 back-button"
            @click="${this.displayPlans}"
          >
            Back
          </button>
        </div>
      </div>
    `;

    const modal = html`
      <div id="thank-you-modal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title label">${this.thankYouTitle}</p>
          </header>
          <section class="modal-card-body">${this.thankYouMessage}</section>
          <footer class="modal-card-foot has-text-centered">
            <button
              class="button is-success modal-button is-three-quarters"
              @click=${this.closeThankYouModal}
            >
              Close
            </button>
          </footer>
        </div>
      </div>
    `;

    const form = html`
      <skhemata-form
        id="payment-form"
        @submit=${this.handleSubmit}
        @change=${this.handleChange}
      >
        <div class="container">
          <div class="column">
            <div class="columns is-desktop">
              <div class="column is-two-thirds-desktop">
                <div class="panel left-column">
                  <div class="panel-block">
                    ${accountInfo} ${paymentInfo} ${otherInfo}
                  </div>
                </div>
              </div>
              <div class="column">${reviewPayment}</div>
            </div>
          </div>
        </div>
      </skhemata-form>
    `;
    return html` <div>${this.configData && selectedPlan ? form : plans}</div>
      ${modal}`;
  }
}
