#!/bin/bash

username=$1

sudo chmod 777 /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/g' /etc/ssh/sshd_config
sudo echo "AllowUsers ubuntu $username" >> /etc/ssh/sshd_config
sudo chmod 644 /etc/ssh/sshd_config
sudo systemctl restart ssh
