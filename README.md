# Мониторинг опционов MOEX

<p align="center">
  <img src="src/app/favicon.ico" />
</p>

Веб-приложение для отслеживания call-опционов срочного рынка Московской биржи (FORTS). Проект построен на [Next.js](https://nextjs.org/), [React](https://react.dev/), и [TailwindCSS](https://tailwindcss.com/).

## Возможности

- Поиск и добавление call-опционов по базовым активам
- Отслеживание рыночных данных: Bid, Implied Volatility, Теоретическая цена
- Автоматическое обновление данных для всех отслеживаемых опционов
- Ограничение на количество отслеживаемых опционов (максимум 20)

## Требования

- Node.js 18.x или выше
- npm, yarn, pnpm или bun

## Установка

1. Установите зависимости:

```bash
npm install
# или
yarn install
# или
pnpm install
# или
bun install
```

## Запуск

Запустите сервер разработки:

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
# или
bun dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Сборка для продакшена

```bash
npm run build
npm start
```

## Исправленные проблемы

- ✅ Исправлена проблема с `handleQuickSelect` в `OptionSelector.tsx` (убрано использование `setTimeout`)
- ✅ Добавлен `autoprefixer` в конфигурацию PostCSS для лучшей совместимости браузеров
- ✅ Проверены типы TypeScript и импорты

## API

Приложение использует API маршруты Next.js для проксирования запросов к API Московской биржи (ISS API):
- `/api/moex/options` - получение списка опционов
- `/api/moex/marketdata/[secid]` - получение рыночных данных для опциона
