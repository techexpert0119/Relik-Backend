#!/bin/bash

cd ..

zip -r nestjs_relik.zip . -x "node_modules/*" -x "dist/*"