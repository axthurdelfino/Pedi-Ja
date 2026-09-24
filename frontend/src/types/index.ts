export type OrderStatus = "PENDENTE" | "PAGO" | "ENVIADO" | "CANCELADO";
export type PaymentMethod = "PIX" | "CARTAO" | "DINHEIRO";

export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
}

export interface Client {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  dataCadastro: string;
}

export interface OrderItem {
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Order {
  id: number;
  clienteId: number;
  clienteNome: string;
  dataPedido: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  valorTotal: number;
  items: OrderItem[];
}

export interface User {
  id: number;
  login: string;
  dataCriacao: string;
  role: "USER" | "ADMIN";
}
