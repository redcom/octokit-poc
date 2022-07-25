#!/bin/bash

echo -e "\nRemoving docker not running containers and volumes not attached to at least one container "
yarn stop:stack
docker-compose -f docker-compose.yml stop
docker system prune --volumes -f


