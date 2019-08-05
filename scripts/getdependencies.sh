#!/bin/bash

bash /tmp/getdocker.sh
sudo apt update -y && sudo apt upgrade -y && sudo apt full-upgrade -y && sudo apt clean -y && sudo apt autoremove -y
cd /home/ubuntu && mkdir app
cd /home/ubuntu/app && mkdir docker && mkdir appenv

