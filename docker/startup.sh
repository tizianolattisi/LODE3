#!/usr/bin/env bash

# ensure to apply the proper configuration
if [ ! -f /usr/src/app/LODE3-configured ]
then
   /usr/src/app/config.sh && touch /usr/src/app/LODE3-configured || exit 1
fi

export MONGODB_URL="mongodb://$LODE3_MONGODB_PORT_27017_TCP_ADDR:$LODE3_MONGODB_PORT_27017_TCP_PORT/"
exec node bin/forever.js
