export type ILog = {
  id: number;
  level: string;
  logDate: string;
  message: string;
  data?: unknown;
  [key: string]: unknown;
};

export const parse = async (rows: string[]) => {
  const jsonRows = rows
    .filter(Boolean)
    .map((row) => {
      try {
        return JSON.parse(row);
      } catch (error) {
        console.log("failed parse", error);
      }
    })
    .filter(Boolean);
  return jsonRows.map(processRow);
};

const formatDate = (dateISO: string) => {
  return new Date(dateISO).toLocaleString("ru-RU");
};

const parseData = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
};

const valueConverter: Record<string, (...args: any[]) => unknown> = {
  logDate: formatDate,
  data: parseData,
};

let idCounter = 0;

const processRow = (row: Record<string, unknown>) => {
  const result: ILog = {
    id: idCounter++,
    level: "info",
    logDate: new Date().toLocaleString(),
    message: "",
  };

  for (const key in row) {
    if (Object.hasOwnProperty.call(row, key)) {
      let value = row[key];
      const converter = valueConverter[key];

      if (converter) {
        value = converter(value);
      }

      result[key] = value;
    }
  }

  return result;
};
