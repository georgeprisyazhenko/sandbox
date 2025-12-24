"use client";

import { useState } from "react";
import OptionSelector from "@/components/OptionSelector";
import WatchList from "@/components/WatchList";
import { WatchedOption, Option } from "@/types/option";
import { getOptionMarketData } from "@/lib/moex-api";
import { MAX_OPTIONS, REFRESH_INTERVAL_MS } from "@/lib/constants";

export default function Page() {
  const [watchedOptions, setWatchedOptions] = useState<WatchedOption[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddOption = (option: Option) => {
    // Проверка лимита
    if (watchedOptions.length >= MAX_OPTIONS) {
      alert(`Достигнут максимум отслеживаемых опционов (${MAX_OPTIONS})`);
      return;
    }

    // Проверка на дубликаты
    const isDuplicate = watchedOptions.some(
      (wo) => wo.option.secid === option.secid,
    );

    if (isDuplicate) {
      alert("Этот опцион уже добавлен в список наблюдения");
      return;
    }

    // Добавляем новый опцион
    const newWatchedOption: WatchedOption = {
      id: `${option.secid}-${Date.now()}`,
      option,
      bid: null,
      impliedVolatility: null,
      theoreticalPrice: null,
      lastUpdate: null,
    };

    setWatchedOptions([...watchedOptions, newWatchedOption]);

    // Автоматически загружаем данные для нового опциона
    loadOptionData(newWatchedOption);
  };

  const handleRemoveOption = (id: string) => {
    setWatchedOptions(watchedOptions.filter((opt) => opt.id !== id));
  };

  // Общая функция для обновления данных опциона
  const updateOptionData = (id: string, marketData: Awaited<ReturnType<typeof getOptionMarketData>>) => {
    setWatchedOptions((prev) =>
      prev.map((opt) =>
        opt.id === id
          ? {
              ...opt,
              bid: marketData.BID,
              impliedVolatility: marketData.IMPLIEDVOLATILITY,
              theoreticalPrice: marketData.THEORPRICE,
              lastUpdate: new Date(),
            }
          : opt,
      ),
    );
  };

  const loadOptionData = async (watchedOption: WatchedOption) => {
    try {
      const marketData = await getOptionMarketData(watchedOption.option.secid);
      updateOptionData(watchedOption.id, marketData);
    } catch (error) {
      console.error(
        `Error loading data for ${watchedOption.option.secid}:`,
        error,
      );
    }
  };

  const handleRefreshAll = async () => {
    if (watchedOptions.length === 0) return;

    setIsRefreshing(true);

    try {
      // Загружаем данные для всех опционов последовательно
      for (const watchedOption of watchedOptions) {
        const marketData = await getOptionMarketData(
          watchedOption.option.secid,
        );
        updateOptionData(watchedOption.id, marketData);

        // Небольшая задержка между запросами
        await new Promise((resolve) =>
          setTimeout(resolve, REFRESH_INTERVAL_MS),
        );
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      alert("Ошибка при обновлении данных");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6" data-oid="in61k2.">
      <div className="max-w-7xl mx-auto" data-oid="qnr.xk_">
        {/* Заголовок */}
        <header className="mb-8" data-oid="frh5au0">
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            data-oid="snei1:i"
          >
            Мониторинг опционов MOEX
          </h1>
          <p className="text-gray-600" data-oid="390bmag">
            Отслеживание call-опционов срочного рынка Московской биржи (FORTS)
          </p>
        </header>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          data-oid=":8-cp-i"
        >
          {/* Селектор опционов */}
          <div className="lg:col-span-1" data-oid="m46t8_s">
            <OptionSelector
              onAddOption={handleAddOption}
              disabled={isRefreshing || watchedOptions.length >= MAX_OPTIONS}
              data-oid="il2tjdu"
            />
          </div>

          {/* Список наблюдения */}
          <div className="lg:col-span-2" data-oid="5gwkr1f">
            <WatchList
              options={watchedOptions}
              onRemove={handleRemoveOption}
              onRefresh={handleRefreshAll}
              isRefreshing={isRefreshing}
              data-oid="v6e3:vx"
            />
          </div>
        </div>

        {/* Информация */}
        <footer
          className="mt-8 text-center text-sm text-gray-500"
          data-oid="3ns:df."
        >
          <p data-oid="ob-3_l6">
            Данные предоставляются через API Московской биржи (ISS API)
          </p>
          <p className="mt-1" data-oid="7xi83bv">
            IV — Implied Volatility | Bid — Лучшая цена покупки | Теор. цена —
            Теоретическая цена
          </p>
        </footer>
      </div>
    </div>
  );
}
