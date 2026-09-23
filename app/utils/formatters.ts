/** Funções puras de apresentação, sem dependência da interface. */
export const money = (value: number) =>
  value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

export const date = (value: string) =>
  Number.isFinite(Date.parse(value))
    ? new Date(value + 'T12:00:00').toLocaleDateString('pt-BR')
    : 'Prazo não informado';
