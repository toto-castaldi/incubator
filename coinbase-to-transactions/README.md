COINBASE-TO-TRANSACTIONS
========================

# DEV

## PYTHON

```
if [ ! -d ".venv" ]
then
    pyenv install 3.9.5
    pyenv local 3.9.5 
    pip install virtualenv
    virtualenv .venv
fi
```

## DB

```shell
    $ mkdir -p postgres-data
    $ docker run -it --rm --name some-postgres -v `pwd`/postgres-data:/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_PASSWORD=dbpsql -e POSTGRES_USER=dbpsql -e POSTGRES_DB=dbpsql postgres:11.5
```

### Init DB

run it if something in the schema is changed

```bash
    $ cd postgresql-liquibase
    $ docker run -it -v `pwd`:/drivers -v `pwd`/liquibase.yml:/liquibase.yml --link some-postgres:postgres -e "LIQUIBASE_URL=jdbc:postgresql://postgres/dbpsql" -e "LIQUIBASE_USERNAME=dbpsql" -e "LIQUIBASE_PASSWORD=dbpsql" skillbillsrl/liquibase update
```

## BATCH

```
. .venv/bin/activate
cd application
pip install -r requirements.txt
LOG_LEVEL=DEBUG ENV=DEV python batch_server.py
```
