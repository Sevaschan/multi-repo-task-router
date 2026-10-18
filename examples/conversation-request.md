# Conversation request

> Checkout sometimes shows “paid” before the receipt page can load. The payments service owns the payment.completed event. The web app reads that event through the order API, and the mobile app uses the same API. Please fix the race without breaking old mobile versions. We deploy payments before web; mobile releases take several days. Repositories are acme/payments, acme/order-api, acme/web-store, and acme/mobile.

Known evidence:

- acme/payments owns the event producer.
- acme/order-api transforms the event into order status.
- Web and mobile consume the order-status response.
- The mobile owner and exact supported version window were not supplied.
