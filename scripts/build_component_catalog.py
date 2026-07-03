#!/usr/bin/env python3

from pathlib import Path
import json
import re

ROOT=Path("/mnt/eila-hot-sidecar/factory-xyz/runtime-c-assets/vendor-source")
OUT=Path("imports/warehouse/generated/component-catalog")
OUT.mkdir(parents=True,exist_ok=True)

EXT={".vue",".tsx",".jsx",".ts",".js",".svelte"}

IGNORE={
"node_modules",
".git",
"dist",
"build",
"coverage",
".next",
".turbo",
"vendor",
"tmp"
}

GOOD=re.compile(
r"(Conversation|Inbox|Message|Composer|Chat|Sidebar|Contact|Lead|Customer|Profile|Widget|Card|Calendar|Schedule|Timeline|Editor|Modal|Dialog|Dashboard|Panel|Table|Grid|List|Form|Viewer)",
re.I)

BAD=re.compile(
r"(test|spec|mock|fixture|dto|migration|controller|service|guard|middleware|repository|util|utils|types|interface|schema|config|provider|hook|store|reducer|slice|api|e2e)",
re.I)

for repo in ROOT.glob("*/*"):

    if not repo.is_dir():
        continue

    components=[]

    for f in repo.rglob("*"):

        if not f.is_file():
            continue

        if f.suffix.lower() not in EXT:
            continue

        rel=f.relative_to(repo).as_posix()

        if any(x in rel for x in IGNORE):
            continue

        if BAD.search(rel):
            continue

        if not GOOD.search(f.name):
            continue

        story=(".story." in f.name.lower()) or (".stories." in f.name.lower())

        components.append({
            "name":f.stem,
            "path":rel,
            "story":story
        })

    components.sort(key=lambda x:x["name"].lower())

    with open(OUT/(repo.name+".json"),"w") as fp:
        json.dump({
            "id":repo.name,
            "root":str(repo),
            "count":len(components),
            "components":components
        },fp,indent=2)

print("done")
