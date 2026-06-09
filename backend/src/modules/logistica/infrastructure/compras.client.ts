import axios from 'axios';

export class ComprasClient {
  private client;

  constructor(baseUrl?: string) {
    const base = baseUrl || process.env.COMPRAS_API_URL || 'http://localhost:4000';
    this.client = axios.create({ baseURL: base, timeout: 5000 });
  }

  async getSendedOrders() {
    const res = await this.client.get('/api/buy-order/sended');
    return res.data;
  }

  async updateOrder(id: string, payload: any) {
    const res = await this.client.patch(`/api/buy-order/${id}`, payload);
    return res.data;
  }
}

export default ComprasClient;
