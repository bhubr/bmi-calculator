#!/bin/bash
[[ -f build.zip ]] && rm build.zip
[[ -d build ]] && rm -r build
[[ -d coverage ]] && rm -r coverage
[[ -d coverage-output ]] && rm -r coverage-output