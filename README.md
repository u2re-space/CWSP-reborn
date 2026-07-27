# CWSP-reborn

**CWSP-reborn** — кроссплатформенный проект для синхронизации буферов обмена
между несколькими устройствами. Основной сценарий: скопировать текст или
изображение на одном устройстве и получить его в clipboard выбранных получателей.

## Что синхронизируется

- **Текст** — обычное текстовое содержимое буфера обмена.
- **Изображения** — передаются в компактном `DataAsset`-конверте с хешем,
  MIME-типом, размером и данными или ссылкой на данные.
- **Несколько устройств** — одно обновление можно направить одному, нескольким
  или всем доступным получателям по их логическим идентификаторам.

Текстовые сообщения сохраняют совместимость с существующими клиентами.
Для изображений конечный клиент применяет подходящий API системного clipboard;
доступность зависит от разрешений и возможностей целевой платформы.

## Как это работает

1. Платформенный мост обнаруживает изменение локального буфера обмена.
2. Изменение нормализуется в пакет CWSP v2, например `clipboard:update`.
3. Пакет маршрутизируется к `nodes` / `destinations` напрямую либо через
   endpoint/gateway.
4. Получатель записывает данные в свой системный clipboard; защита от дублей и
   эхо-повторов предотвращает циклическую синхронизацию.

Стабильные действия: `clipboard:update`, `clipboard:write`, `clipboard:read`,
`clipboard:get`, `clipboard:clear` и `clipboard:isReady`.

## Платформы и структура

- **Android** — Capacitor-интерфейс и Java/native bridge.
- **Windows/Linux** — desktop shell и Node-платформенные адаптеры.
- `src/` — канонический исходный код и общие протокольные фасады.
- `app/` — проекции платформ и корни упаковки.
- `docs/` — спецификация продукта, протокол и описание драйверов.

## Команды

Из каталога `apps/CWSP-reborn`:

```bash
npm run check:clipboard-backend
npm run check:ws-loopback
npm run build:capacitor
npm run build:webnative
npm run build:gateway:web
```

### L-200 Gateway UI

`build:gateway:web` produces the browser shell at
`build/gateway/web`. The server-v2 endpoint serves that directory (auto-discovered
from the workspace, or via `CWS_GATEWAY_WEB_ROOT`) at host root `/` so the
browser address stays `https://host:8434/` / `/network` (not `/gateway/...`).
Unauthenticated WAN visits keep the address on `/` and render the login form
there (auth not required on LAN with the default `optional` policy serves the
app shell at `/` immediately). Auth/BFF APIs remain under `/gateway/auth/*` and
`/gateway/api/*`. WAN access is protected by the hashed gateway credential
configured through private environment/configuration; the LAN policy supports
`off`, `optional`, or `required`.

The gateway cookie is only a human UI session. It is not a CWSP peer token and
does not authorize `/ws`, `/socket.io`, or machine-to-machine HTTP routes.

Мои используемые команды:

```bash
npm run deploy:200:node
npm run start:pm2:node
pm2 restart cwsp
pm2 restart cwsp-reborn-node
npm run build:neutralino:windows
npm run deploy:110:neutralino
npm run build:capacitor
```

## Документация

- [Спецификация продукта](docs/Specification.md)
- [Протокол CWSP v2](docs/Protocol.md)
- [Драйверы и платформенные возможности](docs/Drivers.md)
- [Текущее состояние и проверенная матрица](../../.progress/CWSP-reborn/STATE.json)
