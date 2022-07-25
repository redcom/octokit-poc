#!/bin/bash

source .env
docker compose up \
  --build \
  --remove-orphans \
  --renew-anon-volumes \
  --abort-on-container-exit \
  --force-recreate # in case the stack needs to be recreated
