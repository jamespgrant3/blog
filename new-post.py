import sys
import getopt
from datetime import date
from os import path

today = date.today()

argv = sys.argv[1:]
opts, args = getopt.getopt(argv, "f:l:", 
    ["layout=",
    "file=",
    "title=",
    "tags="])

layout = None
file = None
title = None
tags = None

for opt, arg in opts:
    if opt in ['-f', '--layout']:
        layout = arg
    if opt in ['-f', '--file']:
        file = arg
    if opt in ['-f', '--title']:
        title = arg
    if opt in ['-f', '--tags']:
        tags= arg

fileName = today.isoformat()  + "-" + file + ".md"
fullFileName = path.join('./_posts', fileName)

content = "---\nlayout: " + layout + "\ntitle: " + title + "\ntags: " + tags + "\n---\n### " + title

f = open(fullFileName, "x")
f.write(content)
f.close()
