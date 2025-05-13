# Этап сборки
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап запуска (nginx для статики)
FROM nginx:alpine

# Копируем билд из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Заменяем стандартную конфигурацию nginx, если нужно
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
