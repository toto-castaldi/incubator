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

## EXAMPLE

```
. .venv/bin/activate
pip install -r requirements.txt
API_KEY=[YOUR API KEY] API_SECRET=[YOUR API SECRET] python example.py
```
