#!/bin/bash

cd backend && npm install --omit=dev
cd ../frontend && npm install --omit=dev && npm install -g serve && npm install react-scripts && npm run prod-build && npm uninstall react-scripts