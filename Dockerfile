FROM nginx:stable-alpine

# Fix vulnerability in xz-libs 5.2.5-r0
RUN apk add xz-libs

# HTML content shold reside in /usr/share/nginx/html
# See https://hub.docker.com/_/nginx?tab=description
COPY build /usr/share/nginx/html