export const paymentType = [
    { label: 'Débito', value: 'Débito' },
    { label: 'Pix', value: 'Pix' },
    { label: 'Crédito', value: 'Crédito' },
];

export const recurrent = [
    { label: 'Diário', value: 'Diário' },
    { label: 'Recorrente', value: 'Recorrente' },
];

export const recurrenceInterval = [
    { label: 'Mensal', value: 'Mensal' },
    { label: 'Semanal', value: 'Semanal' },
];

export const status = [
    { label: 'Aguardando Pagamento', value: 'Aguardando' },
    { label: 'Pago', value: 'Pago' },
    { label: 'Atrasado', value: 'Atrasado' },
];

export const paymentPeriod = [
    { label: 'Mensal', value: 'Mensal' },
    { label: 'Pagamento e Adiantamento', value: 'CLT' },
];

export const walletBalance = [
    { label: 'Adicionar Saldo', value: 'add' },
    { label: 'Remover Saldo', value: 'remove' },
];

export const months = [
    { label: 'Janeiro', value: 'Janeiro' },
    { label: 'Fevereiro', value: 'Fevereiro' },
    { label: 'Março', value: 'Março' },
    { label: 'Abril', value: 'Abril' },
    { label: 'Maio', value: 'Maio' },
    { label: 'Junho', value: 'Junho' },
    { label: 'Julho', value: 'Julho' },
    { label: 'Agosto', value: 'Agosto' },
    { label: 'Setembro', value: 'Setembro' },
    { label: 'Outubro', value: 'Outubro' },
    { label: 'Novembro', value: 'Novembro' },
    { label: 'Dezembro', value: 'Dezembro' },
];

export const generateYears = (startYear, extraYears = 1) => {
    const currentYear = new Date().getFullYear();
    const finalYear = currentYear + extraYears;

    let years = [];

    for (let year = startYear; year <= finalYear; year++) {
        years.push({ label: year.toString(), value: year.toString() });
    }

    return years;
};

export const years = generateYears(2024);