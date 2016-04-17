RimWorld Save Editor
=======================

RimWorld save game editor, more features including a UI to come later.

Current features:

* Set Colonist skill levels
* Remove filth
* Set colonist equipped items (apparel and weapons) to 100 health and `Superior` quality

##Install

* Download and install the latest [NodeJS][nodejs]
* Clone the repo
* Follow the [Node Gyp setup guide]
* Run `npm install node-gyp -g`
* Run `npm install` from the repo base directory
* Follow the `Usage` instructions below to configure the options
* Run `node app.js`

##Usage:

###Config
| Name | Default | Description |
| ------------- | ------------- |  ------------- |
| saveDir | | Directory of the save files (in the game menu, click Options, and then click "Open save data folder" **REQUIRED** |
| saveName | | The save file name **REQUIRED** |
| playerFaction | Faction_9 | Player's faction ID | 
| skillLevel | 20 | Skill level to set colonists to |
| healthLevel | 100 | Health to set items to |
| qualityLevel | Superior | Item quality to set for equipped items | 
| modifiedName | Edited | String to prefix new save with to prevent overwriting, you can set to an empty string to overwrite the file (not recommended) |

Copy the example [config] file in `/config/example.local.js` to `/config/local.js` and edit the settings `saveDir` and `saveName`

## License

The MIT License (MIT)

Copyright (c) 2016 Enzo Martin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[local]:config/example.local.js
