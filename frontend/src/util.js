import { differenceInWeeks, getWeeksInMonth, startOfMonth } from "date-fns";

export const titleCase = str => {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
};

export const sentenceCase = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const ordinalSuffix = i => {
  let j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
};

export const getOrdinalWeekdayOfMonth = date => {
  const nWeeksDiff = differenceInWeeks(date, startOfMonth(date));

  return nWeeksDiff + 1 === getWeeksInMonth(date)
    ? "last"
    : ordinalSuffix(nWeeksDiff + 1);
};

export const CURRENCIES = {
  AUD: { locale: "en-AU", symbol: "$", label: "AUD ($) - Australian Dollar" },
  USD: { locale: "en-US", symbol: "$", label: "USD ($) - US Dollar" },
  EUR: { locale: "de-DE", symbol: "€", label: "EUR (€) - Euro" },
  GBP: { locale: "en-GB", symbol: "£", label: "GBP (£) - British Pound" },
  CAD: { locale: "en-CA", symbol: "$", label: "CAD ($) - Canadian Dollar" },
  NZD: { locale: "en-NZ", symbol: "$", label: "NZD ($) - New Zealand Dollar" },
};

let activeCurrency = "AUD";

export const setGlobalCurrency = currencyCode => {
  if (CURRENCIES[currencyCode]) {
    activeCurrency = currencyCode;
  }
};

export const getGlobalCurrency = () => activeCurrency;

export const getCurrencySymbol = (currencyCode = activeCurrency) => {
  return CURRENCIES[currencyCode]?.symbol || "$";
};

export const formatCurrency = (amount, currencyCode = activeCurrency) => {
  const code = CURRENCIES[currencyCode] ? currencyCode : "AUD";
  const currencyInfo = CURRENCIES[code];
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currencyInfo.symbol}-.--`;
  }
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: "currency",
    currency: code,
  }).format(amount);
};

