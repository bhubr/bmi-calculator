FROM nginx:stable-alpine

# Fix vulnerability in xz-libs 5.2.5-r0
RUN apk add xz-libs=5.2.5-r1 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

# Labels
# https://ocr-d.de/en/spec/docker
# https://cutt.ly/xFkUz87
# name, build-date, vcs-ref and version will be provided on command line
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.vendor="WSO2"
LABEL org.label-schema.description="BMI Calculator React app"
LABEL org.label-schema.url="https://bmicalc.bhu.ovh/"
LABEL org.label-schema.vcs-url="https://github.com/bhubr/bmi-calculator/"
# LABEL org.label-schema.name="bhubr/bmi-calculator"
# LABEL org.label-schema.build-date=$BUILD_DATE
# LABEL org.label-schema.version=$BUILD_VERSION
# LABEL org.label-schema.vcs-ref=$VCS_REF
LABEL org.label-schema.docker.cmd="docker run -p 8080:80 -d benoithubert/bmi-calculator:latest"

# HTML content shold reside in /usr/share/nginx/html
# See https://hub.docker.com/_/nginx?tab=description
COPY build /usr/share/nginx/html