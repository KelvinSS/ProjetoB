import { useMemo } from 'react';
import { format, parseISO, addDays, subDays, isBefore, isAfter, differenceInDays } from 'date-fns';

export const useDateUtils = (paymentDay) => {
    // Função para formatar uma data para exibição (ex: dd/MM/yyyy)
    const formatDate = (date) => {
        return format(date, 'dd/MM/yyyy');
    };

    // Função para calcular o início e o fim do mês considerando o paymentDay
    const getBillingPeriod = (baseDate) => {
        const startMonth = baseDate.getMonth();
        const startYear = baseDate.getFullYear();
        const endDate = new Date(baseDate);
        endDate.setMonth(startMonth + 1);
        endDate.setDate(paymentDay - 1);
        const startOfBilling = new Date(startYear, startMonth - 1, paymentDay + 1);
        const endOfBilling = new Date(startYear, startMonth, paymentDay);

        /* const endOfBilling = endDate; */

        return {
            startDate: startOfBilling,
            endDate: endOfBilling,
        };
    };
    /* 
        const getBillingPeriod = (date) => {
            // Obter o ano e mês da data
            const year = date.getFullYear();
            const month = date.getMonth();
        
            // Definir o início do período de faturamento
            const startDate = new Date(year, month, 1); // Primeiro dia do mês
        
            // Definir o final do período de faturamento
            const endDate = new Date(year, month + 1, 0); // Último dia do mês atual
            const endDatePreviousMonth = new Date(year, month, 0); // Último dia do mês anterior
        
            return {
                startDate,
                endDate: endDatePreviousMonth, // Alterado para o último dia do mês anterior
            };
        };
     */
    // Função para verificar se uma data está dentro do intervalo de pagamento
    const isWithinBillingPeriod = (date, startDate, endDate) => {
        return !isBefore(date, startDate) && !isAfter(date, endDate);
    };

    // Função para calcular a diferença de dias entre duas datas
    const getDaysDifference = (date1, date2) => {
        return differenceInDays(new Date(date1), new Date(date2));
    };

    // Função para converter uma string em uma data
    const parseDate = (dateString) => {
        return parseISO(dateString); // Exemplo: transforma "2024-09-16" em objeto Date
    };

    // Uso do hook com memoização para evitar recalcular desnecessariamente
    return useMemo(() => ({
        formatDate,
        getBillingPeriod,
        isWithinBillingPeriod,
        getDaysDifference,
        parseDate,
    }), [paymentDay]);
};
