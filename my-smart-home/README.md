MY-SMART-HOME
=============

With [Flic library](https://github.com/50ButtonsEach/fliclib-linux-hci)


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