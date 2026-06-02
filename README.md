# QR-учет посещаемости

QR-учет посещаемости - это компактная система для отметки студентов по QR-коду.

Владелец и администраторы создают классы, студентов и занятия. Студенты входят на сайт, сканируют QR-код занятия и отмечают присутствие в разрешенное время.

## Быстрый запуск

```sh
npm install
npm run demo:db
npm run dev
```

После запуска откройте `http://localhost:3000`.

## Подготовка к рабочему запуску

Система использует внешнюю PostgreSQL-базу через `DATABASE_URL`.

```sh
npm install
npm run production:check
npm run db:push
npm run db:seed
npm run production:db-check
npm run build
```

Если нужно заменить доступ владельца, задайте новые значения в переменных окружения и выполните:

```sh
npm run owner:update-credentials
```

## Проверка

```sh
npm test
npm run lint
npm run build
```

## Документы

- `USER_GUIDE.md` - полная инструкция для обычного пользователя.
- `HANDOVER.md` - краткая передача проекта заказчику.
- `DEPLOYMENT.md` - инструкция по размещению и настройке.
- `.env.example` - пример нужных переменных окружения.
