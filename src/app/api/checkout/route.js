import paypal from '@paypal/checkout-server-sdk';
import { NextResponse } from 'next/server';

// Configuración del cliente PayPal
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST() {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '15.00',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: '15.00'
              }
            }
          },
          items: [
            {
              name: 'T-Shirt',
              unit_amount: {
                currency_code: 'USD',
                value: '10.00',
              },
              quantity: '1',
            },
            {
              name: 'Mug',
              unit_amount: {
                currency_code: 'USD',
                value: '5.00',
              },
              quantity: '1',
            }
          ],
        },
      ],
    });

    const response = await client.execute(request);
    return NextResponse.json({ id: response.result.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json({ error: 'Error creating PayPal order' }, { status: 500 });
  }
}
