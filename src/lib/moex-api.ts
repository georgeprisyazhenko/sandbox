// Клиент для работы с API Московской биржи (ISS API)

import { Option, MOEXMarketData } from "@/types/option";

// Используем локальные API routes для обхода возможных CORS проблем
const USE_PROXY = typeof window !== "undefined"; // Используем прокси только на клиенте
const MOEX_BASE_URL = "https://iss.moex.com/iss";
const API_BASE_URL = "/api/moex";

interface MOEXResponse {
  securities?: {
    columns: string[];
    data: any[][];
  };
  marketdata?: {
    columns: string[];
    data: any[][];
  };
}

// Вспомогательная функция для преобразования массива данных в объект
function parseRow(columns: string[], row: any[]): any {
  const result: any = {};
  columns.forEach((col, index) => {
    result[col] = row[index];
  });
  return result;
}

/**
 * Получить список всех call-опционов для базового актива
 */
export async function getCallOptionsForAsset(
  ticker: string,
): Promise<Option[]> {
  try {
    const url = USE_PROXY
      ? `${API_BASE_URL}/options?asset=${ticker}`
      : `${MOEX_BASE_URL}/engines/futures/markets/options/securities.json?asset=${ticker}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MOEXResponse = await response.json();

    if (!data.securities || !data.securities.data) {
      return [];
    }

    const columns = data.securities.columns;
    const options: Option[] = [];

    for (const row of data.securities.data) {
      const parsed = parseRow(columns, row);

      // Фильтруем только call-опционы
      if (parsed.OPTIONTYPE === "C" || parsed.OPTIONTYPE === "Call") {
        options.push({
          secid: parsed.SECID,
          underlyingAsset: parsed.ASSETCODE || ticker,
          strike: parseFloat(parsed.STRIKE),
          expirationDate: parsed.LASTDELDATE,
          optionType: "Call",
        });
      }
    }

    return options;
  } catch (error) {
    console.error("Error fetching options:", error);
    return [];
  }
}

/**
 * Получить уникальные даты экспирации из списка опционов
 */
export function getExpirationDates(options: Option[]): string[] {
  const dates = new Set<string>();
  options.forEach((opt) => dates.add(opt.expirationDate));
  return Array.from(dates).sort();
}

/**
 * Получить список страйков для выбранной даты экспирации
 */
export function getStrikes(
  options: Option[],
  expirationDate: string,
): number[] {
  const strikes = options
    .filter((opt) => opt.expirationDate === expirationDate)
    .map((opt) => opt.strike);

  return Array.from(new Set(strikes)).sort((a, b) => a - b);
}

/**
 * Найти опцион по параметрам
 */
export function findOption(
  options: Option[],
  expirationDate: string,
  strike: number,
): Option | undefined {
  return options.find(
    (opt) => opt.expirationDate === expirationDate && opt.strike === strike,
  );
}

/**
 * Получить рыночные данные для опциона
 */
export async function getOptionMarketData(
  secid: string,
): Promise<MOEXMarketData> {
  try {
    const url = USE_PROXY
      ? `${API_BASE_URL}/marketdata/${secid}`
      : `${MOEX_BASE_URL}/engines/futures/markets/options/securities/${secid}.json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MOEXResponse = await response.json();

    if (
      !data.marketdata ||
      !data.marketdata.data ||
      data.marketdata.data.length === 0
    ) {
      return {
        BID: null,
        IMPLIEDVOLATILITY: null,
        THEORPRICE: null,
      };
    }

    const columns = data.marketdata.columns;
    const parsed = parseRow(columns, data.marketdata.data[0]);

    return {
      BID:
        parsed.BID !== null && parsed.BID !== undefined
          ? parseFloat(parsed.BID)
          : null,
      IMPLIEDVOLATILITY:
        parsed.IMPLIEDVOLATILITY !== null &&
        parsed.IMPLIEDVOLATILITY !== undefined
          ? parseFloat(parsed.IMPLIEDVOLATILITY)
          : null,
      THEORPRICE:
        parsed.THEORPRICE !== null && parsed.THEORPRICE !== undefined
          ? parseFloat(parsed.THEORPRICE)
          : null,
    };
  } catch (error) {
    console.error(`Error fetching market data for ${secid}:`, error);
    return {
      BID: null,
      IMPLIEDVOLATILITY: null,
      THEORPRICE: null,
    };
  }
}

