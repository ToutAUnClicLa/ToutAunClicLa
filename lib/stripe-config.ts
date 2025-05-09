export const products = {
  'bocadillo-veleno': {
    priceId: 'price_1RMfUJC09Hbp0X9kdV0zfTfz',
    name: 'Bocadillo Veleño El Caribe (250 g)',
    description: 'Dulce tradicional colombiano de guayaba en bloque',
    mode: 'payment' as const
  }
} as const;

export type ProductId = keyof typeof products;