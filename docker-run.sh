#!/usr/bin/env bash

# note: reflects in startup.sh!
MONGODB_NAME=lode3_mongodb
NODEJS_NAME=lode3_nodejs

# cd to script directory
cd "$(dirname "$0")"

# load utilities
. docker/utilities.sh


# Check and pull images
checkAndPull 'mongo:3.3'
checkAndPull 'node:6.9.0'

# Delete containers
checkAndDeleteContainer "$MONGODB_NAME"
checkAndDeleteContainer "$NODEJS_NAME"

# Setup
read -p "Mongodb data directory on the host system [~/_LODE3/anndatadir]: " datadir
datadir=${datadir:-~/_LODE3/anndatadir}
checkAndDeleteDirectory "$datadir"

# mongodb
docker run --name "$MONGODB_NAME" -v "$datadir:/data/db" -d -p 27017:27017 mongo:3.3

sleep 5

# load secret keys JWT_SECRET and SENDGRID_API_KEY from the untracked file secret.sh
if [ -f ./docker/secret.sh ]; then
    . ./docker/secret.sh
else
    #
    JWT_SECRET="*"
    SENDGRID_API_KEY="*"
fi

# lode annotation
docker build --rm=true --file=docker/Dockerfile -t "unitn.it/${NODEJS_NAME}_img" .
docker run -e "TZ=Europe/Rome" --rm --name "$NODEJS_NAME" --link "$MONGODB_NAME" -p 8080:8080 -i -t "unitn.it/${NODEJS_NAME}_img"
