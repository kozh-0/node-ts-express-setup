# Node.js JWT Auth

Написано на typescript, prisma.

Запуск базы - `docker run --name pg-test -p 6666:5432 -e POSTGRES_PASSWORD=test -d postgres`  
Вход в контейнер - `docker exec -ti pg-test bash`  
Создание пользователя в базе в контейнере - `psql -U postgres`  

Выходим из контейнера устанавливаем зависимости в корне проекта - `npm i`  
Накат миграций со schema.prisma - `npx prisma migrate dev --name init`  

Создаем .env файл и вводим

> DATABASE_URL="postgresql://postgres:test@localhost:6666/postgres?schema=public"  
> PORT=3000  
> ACCESS_TOKEN_SECRET={любой секрет}  
> REFRESH_TOKEN_SECRET={другой любой секрет}  

### Запуск проекта - `npm run dev`
