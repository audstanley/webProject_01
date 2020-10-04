#!/bin/bash
git pull;
docker stop web-project1_web-project1_1 \
        && docker rm web-project1_web-project1_1 \
        && docker rmi web-project1_web-project1 \
        && docker-compose up -d;
