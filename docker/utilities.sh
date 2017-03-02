#!/usr/bin/env bash

# Check and pull image
function checkAndPull {
    echo "Check $1 image"
    if [[ -z "$(docker images -q $1 2> /dev/null)" ]]; then
        echo "Pull $1 image"
        docker pull $1
    else
        echo "$1 image is updated"
    fi
}

# Check and delete container
function checkAndDeleteContainer {
    echo "Check $1 container"
    status=`docker inspect --format='{{.State.Status}}' $1 2> /dev/null`
    if [ -z "$status" ]; then
        echo "The $1 container is not present"
    else
        echo "The $1 container status is $status"
        if [ "$status" = 'running' ]; then
            echo "Stopping..."
            docker stop $1
        fi
        echo "Removing..."
        docker rm $1
    fi
}

# Check and delete data directory
function checkAndDeleteDirectory {
    if [[ (-d $1) && ("$(ls -A $1)") ]]; then
        read -p "The $1 directory is not empty. Do you want to erase data? [no]: " res
        res=`echo "$res" | tr '[:upper:]' '[:lower:]'`
        if [[ ($res = "y") || ($res = "yes") ]]; then
            echo "Removing..."
            rm -R "$1"
            mkdir "$1"
        fi
    fi
}