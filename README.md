## BMI Calculator

[![Build Status](https://travis-ci.com/GermaVinsmoke/bmi-calculator.svg?branch=master)](https://travis-ci.com/GermaVinsmoke/bmi-calculator)
[![Coverage Status](https://coveralls.io/repos/github/GermaVinsmoke/bmi-calculator/badge.svg?branch=master)](https://coveralls.io/github/GermaVinsmoke/bmi-calculator?branch=master)
[![codecov](https://codecov.io/gh/GermaVinsmoke/bmi-calculator/branch/master/graph/badge.svg)](https://codecov.io/gh/GermaVinsmoke/bmi-calculator)

React Hooks app to calculate the BMI of a person. It can store the data for 7 days with the help of LocalStorage.

![](images/1.jpg)

Created with _create-react-app_. See the [full create-react-app guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Install

`npm install`

## Usage

`npm start`

## Enhancement

1. Removing the dependency of Materialize-CSS module

~~2. Chart going crazy on hovering over the old points~~

## Dockerize

We _could_ use a multi-stage Dockerfile to first build the app inside Docker, then copy the build to an Nginx image.

But since we do the build in a Jenkins pipeline, it is ready to copy directly to an Nginx image.

### 1. Build app locally

```
yarn build
```

## 2. Build Docker image

```
docker build \
  --label org.label-schema.name=bhubr/bmi-calculator \
  --label org.label-schema.build-date=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  --label org.label-schema.vcs-ref=$(git rev-parse --short HEAD) \
  --label org.label-schema.version=0.1 \
  -t yourusername/bmi-calculator:0.1 .
```

## 3. Run container

```
docker run -p 8000:80 -d yourusername/bmi-calculator:0.1
```