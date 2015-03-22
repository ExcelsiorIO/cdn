#!/bin/bash

prbar="=========="
i=0
while [ $i -le 100 ]; do
	echo "$i" | dialog --gauge "Please wait" 10 70
  	i=$((i+10))
  	sleep 1
done

clear