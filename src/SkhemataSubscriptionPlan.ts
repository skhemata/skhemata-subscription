import {
  html,
  css,
  SkhemataBase,
  property,
  CSSResult,
  unsafeHTML,
} from '@skhemata/skhemata-base';
import { FontAwesomeIcon } from '@riovir/wc-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

export class SkhemataSubscriptionPlan extends SkhemataBase {
  static get styles() {
    return <CSSResult[]>[
      ...super.styles,
      css`
        .plan-meta-price {
          background: red;
        }
        .feature-list li {
          border-bottom: 1px solid #e3e3e3;
          padding: 0.3rem 0;
        }
        .feature-list li:hover {
          background: #f9f9f9;
        }
        .feature-list li:first-child {
          border-top: 1px solid #e3e3e3;
        }
        .feature-list li:last-child {
          border-bottom: none;
        }
        .plan {
          border: 1px solid #e3e3e3;
          padding-top: 1.25rem;
          padding-bottom: 1.25rem;
          transition: all 0.6s ease-in-out;
          background: white;
          cursor: pointer;
          margin-bottom: 3rem;
        }
        .plan-name,
        .plan-price {
          margin-bottom: 1rem;
        }
        .box {
          padding: 0px;
        }
        .feature-item {
          margin: auto;
        }
        .bottom-button .button {
          width: 10rem;
        }
        @media screen and (min-width: 500px) {
          .plan.default {
            transform: scale(1.02);
          }
          .plan:hover {
            transform: scale(1.02);
          }
        }
        .plan.default .plan-button {
          border: none;
          color: #fff;
        }
        .plan .plan-button {
          border: 3px solid #e3e3e3;
          color: #b0b0b0;
          background: #fff;
        }
        .plan:hover .plan-button {
          border: none;
          color: #fff;
        }
        @media screen and (min-width: 769px) {
          .plan {
            padding-bottom: 6rem;
            margin-bottom: 0rem;
          }
          .bottom-button .button {
            position: absolute;
            bottom: 1rem;
            transform: translate(-50%, 0);
          }
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      'fa-icon': FontAwesomeIcon,
    };
  }

  // Don't use hover js on mobile
  @property({ type: Boolean }) mobile = false;

  @property({ type: Object }) currency = {
    locale: 'en-US',
    code: 'USD',
  };

  @property({ type: Array }) plans: {
    name: string;
    price: string;
    description: string;
    features: any[];
    interval: string;
    icon: any;
    color: number;
    default: boolean;
    trial: {
      price: number;
      periodType: string;
      periodLength: number;
    } | null;
  }[] = [
    {
      name: '',
      price: '',
      description: '',
      features: [],
      interval: '',
      icon: '',
      color: 777,
      default: false,
      trial: null,
    },
  ];

  openSubscription(index: number) {
    this.dispatchEvent(
      new CustomEvent('select-plan', {
        detail: {
          data: index,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  updateButtonStyle(e: any) {
    if (this.mobile) {
      return;
    }
    // Remove default from all plans
    const plans: HTMLElement[] = Array.from(
      e.target.parentNode.getElementsByClassName('plan')
    );
    plans.forEach(plan => {
      plan.classList.remove('default');
      const button = plan.querySelector('button');
      if (button) button.style.background = 'white';
    });

    const color = e.target.getAttribute('plan-color');
    const button = e.target.querySelector('button');
    button.style.background = color;
  }

  removeButtonStyle(e: InputEvent) {
    if (this.mobile) {
      return;
    }
    // const color = (<HTMLElement> e.target)?.getAttribute('plan-color');
    const button = (<HTMLElement>e.target)?.querySelector('button');
    if (button) button.style.background = 'white';
  }

  async firstUpdated() {
    super.firstUpdated();
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);
    if (isMobile) {
      this.mobile = true;
    }

    this.shadowRoot
      ?.querySelectorAll('a')
      .forEach((link: HTMLAnchorElement) => {
        link.addEventListener('click', event => {
          event.stopPropagation();
        });
      });
  }

  render() {
    return html`
      <div class="tile is-ancestor">
        <div class="tile is-horizontal">
          ${this.plans?.map(
            (plan, index) => html`
              <div
                class="tile plan pt-5 pb-5 ${plan.default ? 'default' : ''}"
                id="plan-${index}-button"
                @mouseenter="${this.updateButtonStyle}"
                @mouseleave="${this.removeButtonStyle}"
                @click=${() => this.openSubscription(index)}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.code === '13') this.openSubscription(index);
                }}
                plan-color="${plan.color}"
              >
                <div class="tile is-child has-background-white">
                  <div
                    class="has-text-centered"
                    style="color:${plan.color}; font-size: 1.5rem;"
                  >
                    <fa-icon .icon=${fas[plan.icon]}></fa-icon>
                  </div>
                  <p
                    class="is-size-4 font-medium mb-2 has-text-centered plan-name plan-${index}"
                    style="color:${plan.color};"
                  >
                    ${plan.name}
                  </p>
                  <p
                    class="is-size-2 has-text-weight-bold has-text-centered mb-2 plan-price"
                  >
                    <span style="color:${plan.color}">
                      ${this.currency
                        ? new Intl.NumberFormat(this.currency.locale, {
                            style: 'currency',
                            currency: this.currency.code,
                          }).format(parseFloat(plan.price))
                        : ''}
                    </span>
                    <span class="has-text-black text-gray-300 is-size-6">
                      / mo
                    </span>
                  </p>
                  <!-- SUBHEADING HERE p class="has-text-grey-dark is-size-7 mt-2">
                  For most businesses that want to optimize web queries.
                  </p-->
                  <ul
                    class="feature-list has-text-grey is-size-6 mt-3 mb-6 has-text-centered"
                  >
                    ${plan.features.map(
                      (feature: any) =>
                        html`
                          <li class="is-flex is-align-items-center ">
                            <p class="feature-item py-1">
                              ${unsafeHTML(feature)}
                            </p>
                          </li>
                        `
                    )}
                  </ul>
                  <div class="bottom-button has-text-centered">
                    <button
                      id="plan-${index}-button"
                      class="button is-primary plan-button plan-${index}-button"
                      style="${plan.default || this.mobile
                        ? `background-color: ${plan.color};`
                        : ''}${this.mobile ? 'border: none;color: #fff;' : ''}"
                      @click=${() => this.openSubscription(index)}
                    >
                      ${plan.trial && plan.trial.price === 0
                        ? 'Free Trial'
                        : 'Choose Plan'}
                    </button>
                  </div>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
