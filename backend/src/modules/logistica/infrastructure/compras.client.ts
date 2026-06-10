export class ComprasClient {
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.COMPRAS_API_URL || 'http://localhost:4000';
  }

  private readonly baseUrl: string;

  async getSendedOrders() {
    const res = await fetch(`${this.baseUrl}/api/buy-order/sended`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Compras GET sended failed: ${res.status}`);
    }
    return res.json();
  }

  async updateOrder(id: string, payload: any) {
    const res = await fetch(`${this.baseUrl}/api/buy-order/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Compras PATCH order failed: ${res.status}`);
    }
    return res.json();
  }
}

export default ComprasClient;
