import { SkhemataSubscription } from './src/SkhemataSubscription.js';
import { SkhemataSubscriptionPlan } from './src/SkhemataSubscriptionPlan.js';

if (!customElements.get('skhemata-subscription')) {
  window.customElements.define('skhemata-subscription', SkhemataSubscription);
}

if (!customElements.get('skhemata-subscription-plan')) {
  window.customElements.define(
    'skhemata-subscription-plan',
    SkhemataSubscriptionPlan
  );
}
