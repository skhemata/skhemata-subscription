import { html, TemplateResult } from '@skhemata/skhemata-base';
import '../skhemata-subscription.js';

export default {
  title: 'E-commerce/SkhemataSubscription',
  component: 'skhemata-subscription',
  argTypes: {
    thankYouTitle: {
      name: 'thank-you-title',
      control: 'text',
      description: 'Title for the modal on successful payment',
      table: {
        category: 'HTML Attributes',
        type: 'string',
      },
    },
    thankYouMessage: {
      name: 'thank-you-message',
      control: 'text',
      description: 'Message for the modal on successful payment',
      table: {
        category: 'HTML Attributes',
        type: 'string',
      },
    },
    stripePublicKeys: {
      name: 'stripe-public-keys',
      control: 'object',
      description: 'List of stripe public keys for each locale',
      table: {
        category: 'HTML Attributes',
        type: {
          summary: 'object',
          detail: JSON.stringify(
            {
              LocaleCode: 'string',
            },
            null,
            2
          ),
        },
      },
    },
    configData: {
      name: 'config-data',
      control: 'object',
      description: 'Array of plans',
      table: {
        category: 'HTML Attributes',
        type: {
          summary: 'object',
          detail: JSON.stringify(
            [
              {
                name: 'string',
                raw_name: 'string',
                key: 'string',
                id: 'number',
                price: 'number',
                color: 'string',
                icon: 'string',
                class_name: 'string',
                description: 'string',
                features: 'string[]',
                interval: 'string',
              },
            ],
            null,
            2
          ),
        },
      },
    },
    api: {
      description: 'URL for Skhemata API',
      defaultValue: '',
      table: {
        category: 'HTML Attributes',
        type: {
          summary: 'object',
          detail: JSON.stringify(
            {
              url: 'string',
            },
            null,
            2
          ),
        },
      },
    },
    payment: {
      description: 'Fires on payment success or failure',
      table: {
        category: 'Events',
        type: {
          summary: 'event',
          detail: JSON.stringify(
            {
              detail: {
                status: 'string',
                data: 'object',
              },
            },
            null,
            2
          ),
        },
      },
    },
    skhemataSubscriptionLinkColor: {
      name: '--skhemata-subscription-link-color',
      description: 'Color of the Terms of Service link',
      defaultValue: 'rgb(50, 115, 220)',
      control: 'color',
      table: {
        category: 'CSS Properties',
        type: 'string',
      },
    },
    skhemataSubscriptionButtonBackgroundColor: {
      name: '--skhemata-subscription-button-background-color',
      description: 'Color of the subscribe button',
      defaultValue: '#00c4a7',
      control: 'color',
      table: {
        category: 'CSS Properties',
        type: 'string',
      },
    },
    skhemataSubscriptionButtonTextColor: {
      name: '--skhemata-subscription-button-text-color',
      description: 'Color of the subscribe button text',
      defaultValue: '#ffffff',
      control: 'color',
      table: {
        category: 'CSS Properties',
        type: 'string',
      },
    },
    skhemataSubscriptionSummaryColor: {
      name: '--skhemata-subscription-summary-color',
      description: 'Color of the summary',
      defaultValue: '#00c4a7',
      control: 'color',
      table: {
        category: 'CSS Properties',
        type: 'string',
      },
    },
  },
  parameters: {
    widgetCode: `
    <skhemata-subscription 
    .title="Thrinacia Atlas Pricing!"
    .thankYouTitle="Thank you for the subscription."
    .thankYouMessage="We will be in touch to get you started!"
    config-src="https://cdn.jsdelivr.net/gh/alexey432/test-subscription/data.json"         
    api='{"url":"https://origin.thrinacia.com/api/service/restv1"}'
    stripe-public-keys='{"CA": "pk_test_zSY68rEPOZJ669tvgiDa406w", "US": "pk_test_fj0ml5oHvtPT4GUl2eZKQjMK"}'
    ></skhemata-subscription>

    <script type="module" src="https://cdn.jsdelivr.net/npm/@skhemata/skhemata-subscription@latest/build/index.js"></script> 
    `,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  thankYouTitle?: string;
  thankYouMessage?: string;
  configData?: any;
  stripePublicKeys?: any;
  api?: any;
  skhemataSubscriptionLinkColor?: string;
  skhemataSubscriptionButtonTextColor?: string;
  skhemataSubscriptionButtonBackgroundColor?: string;
  skhemataSubscriptionSummaryColor?: string;
}

const defaultArgs = {
  thankYouTitle: 'Thank you for the subscription',
  thankYouMessage: 'We will be in touch to get you started!',
  configData: [
    {
      name: 'Micro Plan',
      raw_name: 'micro',
      key: 'thrinacia-plan-micro',
      id: 9,
      price: 9.99,
      color: '#fbae5c',
      icon: 'faCloud',
      class_name: 'yellow',
      description: 'Test description',
      features: [
        'feature 1',
        'feature 2',
        'feature 3',
        'feature 4',
        'feature 5',
      ],
      interval: 'monthly',
    },
    {
      name: 'Discover Plan',
      raw_name: 'regular',
      key: 'discover-plan-regular',
      id: 7,
      price: 39.99,
      color: '#2c9be2',
      icon: 'faSearch',
      class_name: 'orange',
      description: 'Test description',
      features: [
        'feature 1',
        'feature 2',
        'feature 3',
        'feature 4',
        'feature 5',
        'feature 6',
        'feature 7',
        'feature 8',
      ],
      interval: 'monthly',
      default: true,
      trial: {
        price: 0,
        periodType: 'day',
        periodLength: 14,
      },
    },
    {
      name: 'Scale Plan',
      raw_name: 'scale',
      key: 'thrinacia-plan-scale',
      id: 3,
      price: 269.99,
      color: '#00b5ac',
      icon: 'faLightbulb',
      class_name: 'red',
      description: 'Test description',
      features: [
        'feature 1',
        'feature 2',
        'feature 3',
        'feature 4',
        'feature 5',
        'feature 6',
        'feature 7',
        'feature 8',
        'feature 9',
        'feature 10',
        'feature 11',
      ],
      interval: 'monthly',
    },
  ],
  stripePublicKeys: {
    CA: 'pk_test_zSY68rEPOZJ669tvgiDa406w',
    US: 'pk_test_fj0ml5oHvtPT4GUl2eZKQjMK',
  },
  api: {
    url: 'https://coral.thrinacia.com/api',
  },
};

const Template: Story<ArgTypes> = ({
  thankYouTitle = defaultArgs.thankYouTitle,
  thankYouMessage = defaultArgs.thankYouMessage,
  configData = defaultArgs.configData,
  stripePublicKeys = defaultArgs.stripePublicKeys,
  api = defaultArgs.api,
  skhemataSubscriptionLinkColor,
  skhemataSubscriptionButtonTextColor,
  skhemataSubscriptionButtonBackgroundColor,
  skhemataSubscriptionSummaryColor,
}: ArgTypes) => html`
  <style>
    body {
      --skhemata-subscription-link-color: ${skhemataSubscriptionLinkColor};
      --skhemata-subscription-button-text-color: ${skhemataSubscriptionButtonTextColor};
      --skhemata-subscription-button-background-color: ${skhemataSubscriptionButtonBackgroundColor};
      --skhemata-subscription-summary-color: ${skhemataSubscriptionSummaryColor};
    }
  </style>
  <skhemata-subscription
    .thankYouTitle=${thankYouTitle}
    .thankYouMessage=${thankYouMessage}
    .configData=${configData}
    .api=${api}
    .stripePublicKeys=${stripePublicKeys}
  >
  </skhemata-subscription>
`;

export const Example = Template.bind({});
Example.args = defaultArgs;
