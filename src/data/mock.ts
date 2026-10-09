// Mock data until the API exists. Coordinates are around Av. Kennedy, São Luís – MA.

export const user = {
  name: 'Ana Souza',
  firstName: 'Ana',
  email: 'ana.souza@email.com',
  cpf: '123.456.789-00',
  card: '6062 •••• •••• 4821',
  address: 'Rua Castro Alves, 120 – Coreia',
  cep: '65045-000',
};

export const FARE = 4.2;

export const userLocation = { latitude: -2.5452, longitude: -44.2788 };

export type Stop = {
  id: string;
  name: string;
  direction: string;
  distance: number; // meters
  latitude: number;
  longitude: number;
  lines: { code: string; name: string; eta: number }[]; // eta in minutes
};

export const stops: Stop[] = [
  {
    id: 's1',
    name: 'Justiça do Trabalho',
    direction: 'Sentido Centro',
    distance: 120,
    latitude: -2.5441,
    longitude: -44.2779,
    lines: [
      { code: 'T034', name: 'Quebra Pote / João Paulo', eta: 3 },
      { code: 'T303', name: 'Anjo da Guarda B40', eta: 9 },
    ],
  },
  {
    id: 's2',
    name: 'Av. Kennedy',
    direction: 'Sentido Bairro',
    distance: 260,
    latitude: -2.5466,
    longitude: -44.2762,
    lines: [
      { code: 'T201', name: 'Cohab / Centro', eta: 5 },
      { code: 'T034', name: 'Quebra Pote / João Paulo', eta: 14 },
    ],
  },
  {
    id: 's3',
    name: 'Praça da Coreia',
    direction: 'Sentido Centro',
    distance: 410,
    latitude: -2.5428,
    longitude: -44.2811,
    lines: [{ code: 'T112', name: 'Vila Passos / Deodoro', eta: 7 }],
  },
  {
    id: 's4',
    name: 'Av. Sen. Vitorino Freire',
    direction: 'Sentido Terminal',
    distance: 530,
    latitude: -2.5478,
    longitude: -44.2809,
    lines: [
      { code: 'T303', name: 'Anjo da Guarda B40', eta: 2 },
      { code: 'T410', name: 'Terminal Praia Grande', eta: 11 },
    ],
  },
];

export const rechargeAmounts = [10, 15, 20, 25, 30, 50];

export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number; // negative = debit
  kind: 'fare' | 'topup';
};

export const initialTransactions: Transaction[] = [
  { id: 't1', title: 'T034 · Quebra Pote', subtitle: 'Hoje, 07:42', amount: -FARE, kind: 'fare' },
  { id: 't2', title: 'Recarga via Pix', subtitle: 'Ontem, 19:10', amount: 20, kind: 'topup' },
  { id: 't3', title: 'T303 · Anjo da Guarda', subtitle: 'Ontem, 18:05', amount: -FARE, kind: 'fare' },
  { id: 't4', title: 'T201 · Cohab', subtitle: 'Seg, 07:38', amount: -FARE, kind: 'fare' },
];

export const formatBRL = (value: number) =>
  `R$ ${Math.abs(value).toFixed(2).replace('.', ',')}`;
