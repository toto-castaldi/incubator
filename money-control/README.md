MONEY-CONTROL
=============

# SYSTEM REQUIREMENTS

Docker
Nodejs
pyenv

# DEV

## PYTHON

Install pyenv https://github.com/pyenv/pyenv

curl https://pyenv.run | bash
add following lines to top-of-file ~/.profile

```
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
```

add following lines to end-of-file ~/.bashrc

```
eval "$(pyenv init -)"
```

reload of file ~/.profile

```
source ~/.profile
```

```
sudo apt-get update
sudo apt install libpq-dev python3-pip libldap2-dev python-dev libsasl2-dev gcc

if [ ! -d ".venv" ]
then
    pyenv install 3.7.6
    pyenv local 3.7.6
    pip3 install virtualenv
    virtualenv .venv
fi
```
## DB

```
docker run --name moneymap -d -p 5432:5432 -e POSTGRES_PASSWORD=moneymap -e POSTGRES_USER=moneymap -e POSTGRES_DB=moneymap postgres:13.3
```

## Init DB
```
cd postgresql-liquibase
docker run --rm --link moneymap:postgres -v `pwd`:/drivers -v `pwd`/liquibase.yml:/liquibase.yml -e "LIQUIBASE_URL=jdbc:postgresql://postgres/moneymap" -e "LIQUIBASE_USERNAME=moneymap" -e "LIQUIBASE_PASSWORD=moneymap" skillbillsrl/liquibase update
```
