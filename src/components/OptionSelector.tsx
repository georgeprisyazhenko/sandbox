"use client";

import { useState } from "react";
import { Option } from "@/types/option";
import {
  getCallOptionsForAsset,
  getExpirationDates,
  getStrikes,
  findOption,
} from "@/lib/moex-api";
import { POPULAR_TICKERS } from "@/lib/constants";

interface OptionSelectorProps {
  onAddOption: (option: Option) => void;
  disabled?: boolean;
}

export default function OptionSelector({
  onAddOption,
  disabled,
}: OptionSelectorProps) {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<Option[]>([]);
  const [expirationDates, setExpirationDates] = useState<string[]>([]);
  const [selectedExpiration, setSelectedExpiration] = useState("");
  const [strikes, setStrikes] = useState<number[]>([]);
  const [selectedStrike, setSelectedStrike] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleTickerSubmit = async (tickerValue?: string) => {
    const tickerToUse = (tickerValue || ticker).trim();
    
    if (!tickerToUse) {
      setError("Введите тикер");
      return;
    }

    setLoading(true);
    setError("");
    setExpirationDates([]);
    setSelectedExpiration("");
    setStrikes([]);
    setSelectedStrike(null);

    try {
      const options = await getCallOptionsForAsset(tickerToUse.toUpperCase());

      if (options.length === 0) {
        setError("Опционы по данному активу не найдены");
        setAvailableOptions([]);
        return;
      }

      setAvailableOptions(options);
      const dates = getExpirationDates(options);
      setExpirationDates(dates);
    } catch (err) {
      setError("Ошибка при загрузке данных");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpirationChange = (date: string) => {
    setSelectedExpiration(date);
    setSelectedStrike(null);

    if (date) {
      const strikesList = getStrikes(availableOptions, date);
      setStrikes(strikesList);
    } else {
      setStrikes([]);
    }
  };

  const handleAddOption = () => {
    if (!selectedExpiration || selectedStrike === null) {
      return;
    }

    const option = findOption(
      availableOptions,
      selectedExpiration,
      selectedStrike,
    );

    if (option) {
      onAddOption(option);
      // Сбрасываем выбор страйка, но оставляем тикер и дату
      setSelectedStrike(null);
    }
  };

  const handleQuickSelect = (tickerValue: string) => {
    setTicker(tickerValue);
    // Автоматически загружаем опционы при клике на быстрый выбор
    if (!loading && !disabled) {
      handleTickerSubmit(tickerValue);
    }
  };

  return (
    <div
      className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm"
      data-oid="gauogw."
    >
      <h2
        className="text-xl font-semibold mb-4 text-gray-900"
        data-oid="hdpdrd_"
      >
        Добавить опцион
      </h2>

      {/* Ввод тикера */}
      <div className="mb-4" data-oid="cvt.:kw">
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
          data-oid="4l15vit"
        >
          Тикер базового актива
        </label>
        <div className="flex gap-2" data-oid="idk7ehp">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleTickerSubmit()}
            placeholder="Например: SBER, GAZP"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={loading || disabled}
            data-oid="egn-:dq"
          />

          <button
            onClick={handleTickerSubmit}
            disabled={loading || disabled || !ticker.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            data-oid="afogmyw"
          >
            {loading ? "Загрузка..." : "Найти"}
          </button>
        </div>

        {/* Популярные тикеры */}
        <div className="mt-3" data-oid="k981pv9">
          <p className="text-xs text-gray-600 mb-2" data-oid="drz5xcc">
            Популярные тикеры:
          </p>
          <div className="flex flex-wrap gap-2" data-oid="bsvoahl">
            {POPULAR_TICKERS.slice(0, 6).map((item) => (
              <button
                key={item.ticker}
                onClick={() => handleQuickSelect(item.ticker)}
                disabled={loading || disabled}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                title={item.name}
                data-oid="6dmmvao"
              >
                {item.ticker}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
          data-oid="bdn_u5b"
        >
          {error}
        </div>
      )}

      {/* Дата экспирации */}
      {expirationDates.length > 0 && (
        <div className="mb-4" data-oid="yvciib5">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            data-oid="-71ev3u"
          >
            Дата экспирации
          </label>
          <select
            value={selectedExpiration}
            onChange={(e) => handleExpirationChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={disabled}
            data-oid="7ab8w8g"
          >
            <option value="" data-oid="5zgi2d1">
              Выберите дату
            </option>
            {expirationDates.map((date) => (
              <option key={date} value={date} data-oid="prdwtno">
                {new Date(date).toLocaleDateString("ru-RU")}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Страйк */}
      {strikes.length > 0 && (
        <div className="mb-4" data-oid="53hii1-">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            data-oid="ch:ihwb"
          >
            Страйк
          </label>
          <select
            value={selectedStrike ?? ""}
            onChange={(e) => setSelectedStrike(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={disabled}
            data-oid="3e2.ijp"
          >
            <option value="" data-oid="m-srswe">
              Выберите страйк
            </option>
            {strikes.map((strike) => (
              <option key={strike} value={strike} data-oid="0ory6s0">
                {strike.toLocaleString("ru-RU")}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Кнопка добавления */}
      {selectedStrike !== null && (
        <button
          onClick={handleAddOption}
          disabled={disabled}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          data-oid="kxs6gb-"
        >
          Добавить в список наблюдения
        </button>
      )}
    </div>
  );
}
