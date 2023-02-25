docker pull mysql
docker pull nginx
docker pull node:16.14.0
docker pull redis
docker network create --subnet=172.1.0.0/16 -d bridge nethelper-network