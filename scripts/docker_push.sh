#!/bin/bash

#echo "$REGISTRY_PASS" | docker login -u "$REGISTRY_USER" --password-stdin
docker login
docker push hmarks/quiz_app
