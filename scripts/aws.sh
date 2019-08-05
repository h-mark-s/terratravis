#!/bin/bash

aws configure set aws_acces_key_id $AWS_ACCES_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set default.region $AWS_DEFAULT_REGION
aws s3 cp s3://$BUCKETNAME/.env $TRAVIS_BUILD_DIR/.env
