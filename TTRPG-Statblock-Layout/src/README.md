This code is used in the Fantasy Statblocks plugin.

- Statblock-SW-Derived_Stats.js: this provides the Soak, Wounds, Strain, Melee Defense, and Ranged Defense stat values.  It will calculate Wounds for Minions based on the qty setting in the statblock and will omit Strain for Rivals and Minions.
- Statblock-SWRPG-Skills.js: this lists the skills for the statblock, pulling the values from the YAML array "skills".  It contains a mapping of skills to their dependent attribute, and will mark up any skills that are missing from the map so it's clear to the user it's not working properly.