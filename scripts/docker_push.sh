#!/bin/bash

#echo "$REGISTRY_PASS" | docker login -u "$REGISTRY_USER" --password-stdin
docker push hmarks/quiz_app
