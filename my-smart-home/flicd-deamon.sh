#!/bin/bash

while true; do
  $1 -f $2 >>~/.flicd.out 2>&1
  wait
done
