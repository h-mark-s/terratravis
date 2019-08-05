#!/bin/bash

scp $TRAVIS_BUILD_DIR/.env $USERNAME@$PUBLICIP:~/app/appenv/
rm $TRAVIS_BUILD_DIR/.env

echo $PASSWORD\n | ssh -T $USERNAME@$PUBLICIP
sleep 120

cd /home/ubuntu/app/docker && docker pull hmarks/quiz_app:latest

docker kill my_quiz_app && docker rm my_quiz_app || echo "No such docker container"

docker run --name my_quiz_app -p 5500:5500 -d hmarks/quiz_app
docker cp /home/ubuntu/app/appenv/.env my_quiz_app:/usr/src/app/
docker restart my_quiz_app

