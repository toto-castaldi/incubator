#!/bin/bash

PIDFILE=~/.flicd.pid


if test -f "$PIDFILE"; then exit; fi
echo $$ > "$PIDFILE"
trap "rm '$PIDFILE'" EXIT SIGTERM
while true; do
  $1 -f $2 >>~/.flicd.out 2>&1 &
  wait
done
