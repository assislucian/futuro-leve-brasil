
export const BRAZILIAN_CATEGORIES = {
  INCOME: [
    'Salário',
    'Freelance',
    'Investimentos',
    'Aluguel Recebido',
    'Pensão',
    'Auxílio',
    'Vendas',
    'Aposentadoria',
    'Décimo Terceiro',
    'Férias',
    'PLR',
    'Outros'
  ],
  EXPENSE: [
    'Moradia',
    'Alimentação',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Vestuário',
    'Tecnologia',
    'Financiamento Imóvel',
    'Financiamento Veículo',
    'Cartão de Crédito',
    'Condomínio',
    'IPTU',
    'IPVA',
    'Seguro',
    'Academia',
    'Streaming',
    'Telefone/Internet',
    'Energia Elétrica',
    'Água',
    'Gás',
    'Outros'
  ]
} as const;

export const RECURRENCE_OPTIONS = [
  { value: 'monthly', label: 'Mensal', description: 'Todo mês' },
  { value: 'bimonthly', label: 'Bimestral', description: 'A cada 2 meses' },
  { value: 'quarterly', label: 'Trimestral', description: 'A cada 3 meses' },
  { value: 'semiannual', label: 'Semestral', description: 'A cada 6 meses' },
  { value: 'annual', label: 'Anual', description: 'Uma vez por ano' }
] as const;

export const COMMON_RECURRING_EXPENSES = [
  { category: 'Moradia', examples: ['Aluguel', 'Financiamento Imóvel', 'Condomínio'] },
  { category: 'Financiamento Veículo', examples: ['Prestação do Carro', 'Consórcio'] },
  { category: 'Tecnologia', examples: ['Netflix', 'Spotify', 'Amazon Prime'] },
  { category: 'Saúde', examples: ['Plano de Saúde', 'Academia'] },
  { category: 'Telefone/Internet', examples: ['Internet', 'Celular', 'TV a Cabo'] }
] as const;
