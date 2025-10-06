const norsk = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];
const monthNames = {
  nb: norsk,
  nn: norsk,
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

type Spraak = "nb" | "nn" | "en";
const prettyPrintDato = (dato: string, locale?: Spraak) => {
  const now = new Date();
  const date = new Date(dato);
  const thisYear = now.getFullYear();
  const year = date.getFullYear();
  const valgtSprak = !locale ? "nb" : (locale as Spraak);
  const month = monthNames[valgtSprak][date.getMonth()];

  if (valgtSprak === "en") {
    return `${month} ${date.getDate()}.${thisYear !== year ? ` ${year}` : ""}`;
  }

  return `${date.getDate()}. ${month}${thisYear !== year ? ` ${year}` : ""}`;
};

export default prettyPrintDato;
