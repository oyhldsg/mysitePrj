#!/bin/bash
rm -rf ../../public/static
rm ../../public/index.html
cp dist/index.html ../../public/
cp -r dist/static ../../public/
