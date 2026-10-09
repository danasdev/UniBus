const digits = (v: string) => v.replace(/\D/g, '');

export const maskCPF = (v: string) =>
  digits(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export const maskCEP = (v: string) => digits(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

export const maskCard = (v: string) =>
  digits(v)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
