#! /bin/bash

cd engine
docker build . -t money-control-engine
cd ..
cd postgresql-liquibase
docker build . -t money-control-liquibase
cd ..
