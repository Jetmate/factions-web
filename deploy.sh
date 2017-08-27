#!/bin/bash

npm run-script build
sftp anton@104.131.40.228 <<EOF
cd factions
put -r www
EOF
