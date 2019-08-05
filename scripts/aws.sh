#!/bin/bash

aws configure
aws s3 cp s3://$BUCKETNAME/.env $TRAVIS_BUILD_DIR/.env
