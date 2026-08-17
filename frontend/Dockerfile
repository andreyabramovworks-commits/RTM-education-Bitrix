FROM node:22-alpine AS build

WORKDIR /app
ARG VITE_APP_ENV
ARG VITE_APP_VERSION
ARG VITE_POSTHOG_ENABLED
ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST
ENV VITE_APP_ENV=$VITE_APP_ENV \
    VITE_APP_VERSION=$VITE_APP_VERSION \
    VITE_POSTHOG_ENABLED=$VITE_POSTHOG_ENABLED \
    VITE_POSTHOG_KEY=$VITE_POSTHOG_KEY \
    VITE_POSTHOG_HOST=$VITE_POSTHOG_HOST
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
