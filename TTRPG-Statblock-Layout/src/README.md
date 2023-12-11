

# TTRPG-Statblock-Layout / src
This code is used in the Fantasy Statblocks plugin.

## Usage
The javascript files in this folder are used in the Fantasy Statblock plugin layout manager to provide visibility for key features of Star Wars RPG statblocks.
- Statblock-SW-Derived_Stats.js: this provides the Soak, Wounds, Strain, Melee Defense, and Ranged Defense stat values.  It will calculate Wounds for Minions based on the qty setting in the statblock and will omit Strain for Rivals and Minions.
- Statblock-SWRPG-Skills.js: this lists the skills for the statblock, pulling the values from the YAML array "skills".  It contains a mapping of skills to their dependent attribute, and will mark up any skills that are missing from the map so it's clear to the user it's not working properly.

### Dice Rendering
`Statblock-SWRPG-Skills.js` includes variables for Star Wars Ability and Proficiency dice.  By default, these dice are rendered as tags, and take advantage of the Dice-Snippets feature.  The dice tags must match the tags you're using in your Dice-Snippets - for myself I have removed the StarWars prefix, so Ability dice are tagged #Ability and Proficiency dice are tagged #Proficiency.  You can customize this by editing the `abilityDiceTag` and `proficiencyDiceTag` variables in `Statblock-SWRPG-Skills.js`

### Skills in Statblocks
Skills are entered in the statblock YAML as a list called `skills`.  The following example represents three skills: Athletics, Discipline, Melee, and Ranged (Heavy).
```
skills:
  - athletics: 1
  - discipline: 0
  - melee: 1
  - rangedheavy: 2
```

### Custom Skills
The script will render any skills you enter under the `skills` list YAML.  However, if a skill is not found in the `skills` mapping, it will render the skill as **\_Unknown (`<skill key>`)**, where `<skill key>` is the name you entered in the YAML.  If you wish to add a custom skill, enter it into the `skills` mapping in `Statblock-SWRPG-Skills.js`.


### Minions and Rivals
By default, Minions and Rivals don't have Strain.  The `Statblock-SWRPG-Skills.js` will not render Strain for these types, even if you enter a value for `strain` in the YAML.  Additionally, for Minions, the Wounds and Skill Ranks will be based on the value of `qty` in the YAML.  Recall that Minions base their skill ranks on group size minus one, with a maximum ranking of 5.  So increasing the `qty` value will increase the skill ranks for Minions - otherwise they are considered 0 *even if you enter other values for them*.


### Example Statblock
````
```statblock
layout: SWRPG
name: Imperial Stormtrooper
monster: Imperial Stormtrooper
desc: Standard Imperial Canonfodder
qty: 3
image: https://static.wikia.nocookie.net/starwars/images/c/ca/Anovos_Stormtrooper.png/revision/latest/top-crop/width/360/height/360?cb=20160407220950
type: Minion
soak: 3
wounds: 5
strain: null
rdef: 0
mdef: 0
stats: [3,3,2,2,3,1]
abilities:
  - name: Example Ability
    desc: Stormtroopers don't actually have abilities
skills:
  - athletics: 1
  - discipline: null 
  - melee: 
  - rangedheavy
equipment:
  - name: "Blaster Rifle"
    desc: "Ranged Heavy, Damage +9, Critical 3, Long Range, Stun"
  - name: "Light repeating blaster"
    desc: "Ranged Heavy, Damage +11, Critical 3, Long Range, Auto-fire, Cumbersome 4, Pierce 1, Weapon Sling."
  - name: "Vibro Knife"
    desc: "Melee, Damage +4, Crit 2, Engaged, Pierce 2, Vicious 1"
  - name: "Frag Grenade"
    desc: "Ranged Light, Damage +8, Crit 4, Short Range, Blast 6, Limited Ammo 1"
  - name: "Other Gear"
    desc: "Utility belt, Extra reloads, Stormtrooper armor, 2 frag grenades"
```
````
