#!/usr/bin/env python3

from pathlib import Path
import json
import re

ROOT=Path("imports/warehouse/generated/component-catalog")
OUT=Path("imports/warehouse/generated/feature-catalog")
OUT.mkdir(parents=True,exist_ok=True)

FEATURES={

"conversation":[
"conversation","thread","chat","message","reply","composer","inbox"
],

"contacts":[
"contact","customer","lead","person","profile"
],

"calendar":[
"calendar","booking","schedule","availability"
],

"automation":[
"automation","workflow","rule","trigger","agent"
],

"dashboard":[
"dashboard","overview","analytics","report","chart","timeline"
],

"settings":[
"setting","config","preference","dialog","modal"
],

"editor":[
"editor","document","article","template","content"
]

}

for file in ROOT.glob("*.json"):

    repo=json.loads(file.read_text())

    result={
        "id":repo["id"],
        "features":{}
    }

    for feature in FEATURES:
        result["features"][feature]=[]

    for c in repo["components"]:

        text=(c["name"]+" "+c["path"]).lower()

        for feature,words in FEATURES.items():

            if any(w in text for w in words):
                result["features"][feature].append(c)

    with open(OUT/file.name,"w") as fp:
        json.dump(result,fp,indent=2)

print("done")
