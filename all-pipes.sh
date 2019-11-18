#!/bin/bash
set -e
./index.js ../src/agent/safe-html.pipe.ts
./index.js ../src/oneview-common/oneview-string-mask/oneview-string-mask.pipe.ts
./index.js ../src/oneview-common/phone-number.pipe.ts
./index.js ../src/oneview-common/safe-html.pipe.ts
