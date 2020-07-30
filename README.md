## SETUP

## DataBase
docker-compose up -d

## Run migrations
adonis migration:run

## Run server localhost:3333
adonis serve --dev

## Run schedule task
adonis run:scheduler


