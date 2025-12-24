"use client";

import { WatchedOption } from "@/types/option";

interface WatchListProps {
  options: WatchedOption[];
  onRemove: (id: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function WatchList({
  options,
  onRemove,
  onRefresh,
  isRefreshing,
}: WatchListProps) {
  const formatValue = (value: number | null): string => {
    if (value === null || value === undefined) {
      return "—";
    }
    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("ru-RU");
    } catch {
      return dateString;
    }
  };

  if (options.length === 0) {
    return (
      <div
        className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm"
        data-oid="p5ijocd"
      >
        <p className="text-center text-gray-500" data-oid="lj0:r0:">
          Список наблюдения пуст. Добавьте опционы для отслеживания.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-gray-300 rounded-lg shadow-sm"
      data-oid="f9xoo3."
    >
      <div
        className="p-4 border-b border-gray-200 flex justify-between items-center"
        data-oid="l4lzg4y"
      >
        <h2 className="text-xl font-semibold text-gray-900" data-oid="x95eol-">
          Список наблюдения ({options.length}/20)
        </h2>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          data-oid="brwr0mj"
        >
          {isRefreshing ? "Обновление..." : "Обновить"}
        </button>
      </div>

      <div className="overflow-x-auto" data-oid="1jkt82l">
        <table className="w-full" data-oid="hwifzp5">
          <thead
            className="bg-gray-50 border-b border-gray-200"
            data-oid="v4hm-34"
          >
            <tr data-oid="3jtd7jh">
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                data-oid="u8c0ygw"
              >
                Актив
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                data-oid="x.sd93s"
              >
                Экспирация
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                data-oid="lfwz09_"
              >
                Страйк
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                data-oid="-sb:qrt"
              >
                Bid
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                data-oid="-o::9_u"
              >
                IV
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                data-oid=":uo2_:u"
              >
                Теор. цена
              </th>
              <th
                className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                data-oid="6vam6kj"
              >
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200" data-oid="6p4-vjt">
            {options.map((opt) => (
              <tr
                key={opt.id}
                className="hover:bg-gray-50 transition-colors"
                data-oid="_s73:d8"
              >
                <td
                  className="px-4 py-3 text-sm font-medium text-gray-900"
                  data-oid="h3fc6ke"
                >
                  {opt.option.underlyingAsset}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-700"
                  data-oid="ud3nzic"
                >
                  {formatDate(opt.option.expirationDate)}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-700 text-right"
                  data-oid="k-ljidg"
                >
                  {opt.option.strike.toLocaleString("ru-RU")}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900 font-medium text-right"
                  data-oid="c..ejxv"
                >
                  {formatValue(opt.bid)}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900 font-medium text-right"
                  data-oid="2ezih1f"
                >
                  {formatValue(opt.impliedVolatility)}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900 font-medium text-right"
                  data-oid="w0mrpe6"
                >
                  {formatValue(opt.theoreticalPrice)}
                </td>
                <td className="px-4 py-3 text-center" data-oid="a63kn-3">
                  <button
                    onClick={() => onRemove(opt.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    data-oid="48fjw8q"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {options.length > 0 && options[0].lastUpdate && (
        <div
          className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600"
          data-oid="6w6u--x"
        >
          Последнее обновление:{" "}
          {options[0].lastUpdate.toLocaleTimeString("ru-RU")}
        </div>
      )}
    </div>
  );
}
