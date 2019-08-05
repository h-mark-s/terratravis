#!/bin/bash

username=$1
password=$2

sudo mkdir /home/$username

sudo useradd -p $(openssl passwd -1 $password) -d /home/$username -s /bin/bash $username

sudo groupadd docker
sudo usermod -aG docker $username
