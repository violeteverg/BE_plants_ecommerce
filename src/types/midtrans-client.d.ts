declare module 'midtrans-client' {
    export class Snap {
      constructor(options: {
        isProduction: boolean;
        serverKey: string;
        clientKey?: string;
      });
  
      createTransaction(parameter: {
        transaction_details: {
          order_id: string;
          gross_amount: number;
        };
        credit_card?: {
          secure: boolean;
        };

      }): Promise<any>;
    }
  
    export class CoreApi {
      constructor(options: {
        isProduction: boolean;
        serverKey: string;
        clientKey?: string;
      });
  
      transactionStatus(orderId: string): Promise<any>;
    }
  }
  