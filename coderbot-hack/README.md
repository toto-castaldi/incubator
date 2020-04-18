CODERBOT HACK
=============

## System

Raspberry PI 3 Model B V 1.2


## Linux

Create an image with (this)[https://github.com/toto-castaldi/pi-gen]

Log into the system an set (actually is already set but does not work out of the box) Wifi Country :

```
    > sudo raspi-config
    > //4 Localisation Options
    > //I4 Change WIFI Country
    > //search and set IT
    > //OK
    > sudo apt-get install python3-venv pigpio
```

## Program

```
    > sudo pigpiod
    > python3 -m venv .
    > source bin/activate
    > pip3 install -r requirements.txt
```
