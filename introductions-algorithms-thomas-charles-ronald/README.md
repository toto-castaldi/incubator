introduction to algorithms
==========================

I use software to illustrate what is explained in the book "Introduction to algorithms" by Thoms H.Cormen, Charles E. Leiserson and Rondal L. Rivest

# System requirements

* [pyenv](https://github.com/pyenv/pyenv) (tested with version 1.2.23)

# Python

```
if [ ! -d ".venv" ]
then
    pyenv install 3.9.5
    pyenv local 3.9.5 
    pip install virtualenv
    virtualenv .venv
fi
```

# Execute

```
. .venv/bin/activate
pip install -r requirements.txt
python insertion_sort.py

```