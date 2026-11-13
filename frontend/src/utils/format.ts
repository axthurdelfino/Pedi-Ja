export const money = (value: number) =>
  Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const brazilTimeZone = "America/Sao_Paulo";

function parseBrazilDate(value: string | Date) {
  if (value instanceof Date) return value;
  // LocalDateTime from the API has no offset; it is already Brazil time.
  return new Date(/[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}-03:00`);
}

export const dateTime = (value: string) =>
  parseBrazilDate(value).toLocaleString("pt-BR", { timeZone: brazilTimeZone });

export const today = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: brazilTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
};

export const brazilDateKeys = (count: number) => {
  const [year, month, day] = today().split("-").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day));
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(base);
    date.setUTCDate(base.getUTCDate() - count + index + 1);
    return date.toISOString().slice(0, 10);
  });
};
