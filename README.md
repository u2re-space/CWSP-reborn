# CWSP-transfer

Передача буфера обмена и контента между устройствами. Пакет npm по-прежнему `cwsp-reborn`; путь-синоним: `apps/CWSP-reborn`.

Сценарий: скопировать текст или изображение на одном узле и получить его в clipboard выбранных получателей. Текстовые пакеты совместимы со старыми клиентами; картинки идут в `DataAsset` (хеш, MIME, размер, данные или ссылка).

## Как устроено

1. Платформенный мост видит смену локального clipboard.
2. Нормализация в CWSP v2 (`clipboard:update` и соседние действия).
3. Маршрутизация к `nodes` / `destinations` напрямую или через endpoint / gateway.
4. Получатель пишет в свой системный clipboard; защита от эха рвёт циклы.

Действия: `clipboard:update`, `clipboard:write`, `clipboard:read`, `clipboard:get`, `clipboard:clear`, `clipboard:isReady`.

Gateway cookie — только сессия человеческой UI. Это не peer-токен и не доступ к `/ws`, `/socket.io` и машинным HTTP-маршрутам.

## Платформы

- Android — Capacitor + Java bridge.
- Windows / Linux — Neutralino / WebNative.
- Браузер — control SPA и gateway UI (`/` на endpoint, не `/gateway/...`).

## Команды

```bash
cd apps/CWSP-transfer   # или apps/CWSP-reborn
npm run check:clipboard-backend
npm run check:ws-loopback
npm run build:capacitor
npm run build:webnative
npm run build:cwsp-control:web
npm run build:gateway:web
```

Деплой на узлы desk / gateway: `deploy:110`, `deploy:200` и их `*:node` / `*:java` / `*:neutralino` варианты. Адреса и секреты не сюда — только `private/connectivity.md`.

## Документация

- [Спецификация](docs/Specification.md)
- [Протокол CWSP v2](docs/Protocol.md)
- [Драйверы](docs/Drivers.md)
