#!/bin/bash

python ../manage.py makemigrations chatApi
python ../manage.py migrate


python ../manage.py makemigrations products
python ../manage.py migrate

