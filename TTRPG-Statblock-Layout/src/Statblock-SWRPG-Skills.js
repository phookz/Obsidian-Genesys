// Change these to match whatever tag you're using for Ability (green) and Proficiency (yellow) dice.
let abilityDiceTag = "#Ability"
let proficiencyDiceTag = "#Proficiency";

const characteristics = {
    Brawn       : { name: "Brawn",      stat: monster.stats[0], abbrev: "BRA" },
    Agility     : { name: "Agility",    stat: monster.stats[1], abbrev: "AGI" },
    Intellect   : { name: "Intellect",  stat: monster.stats[2], abbrev: "INT" },
    Cunning     : { name: "Cunning",    stat: monster.stats[3], abbrev: "CUN" },
    Willpower   : { name: "WillPower",  stat: monster.stats[4], abbrev: "WIL" },
    Presence    : { name: "Presence",   stat: monster.stats[5], abbrev: "PRE" },
};

/**
 * This maps skills in the game.  Add skills to this map and include what characteristic the skill uses.
 * This will allow dice calculations to be automatic.
 * 
 * Format is: 
 *   <key> : { name: <skill name>, characteristic: <skill characteristic> }
 * 
 * key : lowercase value that you use in statblocks to identify the skill
 * name : the name we'll render in the output
 * characteristic : reference to the characteristics above so we can find the correct stat value
 * Skill names can be adjusted for your install, I have each skill with its own page so the links allow easy reference.
 */
const skills = {
    "astrogation"       : { name: "[[Astrogation]]",            characteristic : characteristics.Intellect, },       
    "athletics"         : { name: "[[Athletics]]",              characteristic : characteristics.Brawn, },
    "brawl"             : { name: "[[Brawl]]",                  characteristic : characteristics.Brawn, },
    "charm"             : { name: "[[Charm]]",                  characteristic : characteristics.Presence, },
    "coercion"          : { name: "[[Coercion]]",               characteristic : characteristics.Willpower, },
    "computers"         : { name: "[[Computers]]",              characteristic : characteristics.Intellect, },
    "cool"              : { name: "[[Cool]]",                   characteristic : characteristics.Presence, },
    "coordination"      : { name: "[[Coordination]]",           characteristic : characteristics.Agility, },
    "coreworlds"        : { name: "[[Core Worlds]]",            characteristic : characteristics.Intellect, },
    "cybernetics"       : { name: "[[Cybernetics]]",            characteristic : characteristics.Intellect, },  
    "deception"         : { name: "[[Deception]]",              characteristic : characteristics.Cunning, },
    "discipline"        : { name: "[[Discipline]]",             characteristic : characteristics.Willpower, },
    "education"         : { name: "[[Education]]",              characteristic : characteristics.Intellect, },
    "gunnery"           : { name: "[[Gunnery]]",                characteristic : characteristics.Agility, },
    "leadership"        : { name: "[[Leadership]]",             characteristic : characteristics.Presence, },
    "lightsaber"        : { name: "[[Lightsaber]]",             characteristic : characteristics.Brawn, },
    "lore"              : { name: "[[Lore]]",                   characteristic : characteristics.Intellect, },
    "mechanics"         : { name: "[[Mechanics]]",              characteristic : characteristics.Intellect, },
    "medicine"          : { name: "[[Medicine]]",               characteristic : characteristics.Intellect, },
    "melee"             : { name: "[[Melee]]",                  characteristic : characteristics.Brawn, },
    "negotiation"       : { name: "[[Negotiation]]",            characteristic : characteristics.Presence, },
    "outerrim"          : { name: "[[Outer Rim]]",              characteristic : characteristics.Intellect, },
    "perception"        : { name: "[[Perception]]",             characteristic : characteristics.Cunning, },
    "pilotingplanetary" : { name: "[[Piloting (Planetary)]]",   characteristic : characteristics.Agility, },
    "pilotingspace"     : { name: "[[Piloting (Space)]]",       characteristic : characteristics.Agility, },
    "rangedheavy"       : { name: "[[Ranged (Heavy)]]",         characteristic : characteristics.Agility, },
    "rangedlight"       : { name: "[[Ranged (Light)]]",         characteristic : characteristics.Agility, },
    "resilience"        : { name: "[[Resilience]]",             characteristic : characteristics.Brawn, },
    "skulduggery"       : { name: "[[Skulduggery]]",            characteristic : characteristics.Cunning, },
    "stealth"           : { name: "[[Stealth]]",                characteristic : characteristics.Agility, },
    "streetwise"        : { name: "[[Streetwise]]",             characteristic : characteristics.Cunning, },
    "survival"          : { name: "[[Survival]]",               characteristic : characteristics.Cunning, },
    "underworld"        : { name: "[[Underworld]]",             characteristic : characteristics.Intellect, },
    "vigilance"         : { name: "[[Vigilance]]",              characteristic : characteristics.Willpower, },
    "warfare"           : { name: "[[Warfare]]",                characteristic : characteristics.Intellect, },
    "xenology"          : { name: "[[Xenology]]",               characteristic : characteristics.Intellect, },
};


let output = "";  // this is what we're writing html into

// convenience to identify if the current monster is a minion type or not
const isMinion = String(monster.type).localeCompare("minion", undefined, { sensitivity: 'accent'}) === 0;
const skillList = []; // we'll push skills into this list and sort prior to presentation

if (monster.skills !== undefined && monster.skills.length != 0) {
    monster.skills.forEach(element => { 

        let skill = getSkillData(element);
        // strip out empty skill elements; this seems to be messing up the sorting
        if (skill.label === undefined || skill.label === "") return;
        skillList.push(skill);
    });   

    // sort the skills alphabetically
    skillList.sort((a, b) => {
        // trim out the wiki link characters
        const labelA = /[^\[\]]+/.exec(a.label.toLowerCase());
        const labelB = /[^\[\]]+/.exec(b.label.toLowerCase());
        if (labelA < labelB) {
            return -1;
        }
        if (labelA > labelB) {
            return 1;
        }
        return 0;
    });

    // there's an annoying space on the first line, since I can't figure out how to 
    // get rid of it add an &nbsp; to every line *after* the first
    let skillCount = 0;
    skillList.forEach(element => {
        let result = "";
        if (element.label === undefined || element.label === "") {
            // empty label, skip it
            return;
        }
        if (skillCount++ > 0) {
            output += "&nbsp;"
        }
        // minions don't have ranks, so don't output them
        let rankString = isMinion ? `` : `${element.ranks}`;
        // build the dice pool
        let dicePool = proficiencyDiceTag.repeat(element.proficiency) + abilityDiceTag.repeat(element.ability);
        // rendered output
        output += `<strong>${element.label}</strong>: ${rankString} ( ${dicePool} )<br>`;
    });
}

return output.trim();

/**
 * Looks up skill labels, checks if this is a minion and returns the appropriate Proficiency and Ability dice.
 * Format of the return is an object of prototype: 
 *   key : the key to lookup the skill
 *   label : the label to render the skill name
 *   charactersitic : the characteristic name the skill uses
 *   charAbbrev : abbreviated characteristic name
 *   ranks : ranks in the skill
 *   proficiency : number of proficiency dice
 *   ability : number of ability dice
 * NOTE: if the skill name is not found in the skills list we'll still render the skill, but can't trust the dice
 *       output as we don't know what characteristic to use for it
 * @param skillEntry - expected to be { name : ranks } where name is string and ranks is integer.  
 * @returns an object with the Skill Label, characteristic, Ranks, Proficiency, and Ability dice counts.
 */
function getSkillData(skillEntry) {
    let result = {
        key : "",               // the key to lookup the skill
        label : "",             // the label to render the skill name
        characteristic : "",    // the characteristic name the skill uses
        charAbbrev : "",        // abbreviated characteristic name
        ranks : 0,              // ranks in the skill
        proficiency : 0,        // number of proficiency dice
        ability : 0,            // number of ability dice
    };

    let skillCharRating = 0;    // the numeric value of the characteristic

    // parameter checking
    if (!skillEntry) {
        // an empty element - probably bad data but let's return something rather than crash
        result.label = "";
        return result;
    }

    if (typeof skillEntry === 'string') {
        // we have a key but no value, so set ranks to 0
        result.key = skillEntry;
    } else if (typeof skillEntry === 'object' && skillEntry !== null && Object.keys(skillEntry).length === 1) {
        // we have key : value
        result.key = Object.keys(skillEntry)[0];
        result.ranks = skillEntry[result.key];
    } else {
        // we have some other type of object.  Log it and bail
        console.log('Input is neither string nor object with single key-value pair.');
    }

    // check if this is a Minion; Minion ranks ignore the text and are based on group size - 1, max of 5
    if(isMinion) {
        result.ranks = Math.min(5, monster.qty - 1);
    }

    // now look up the skill so we can get the characteristic
    let skill = skills[result.key.toLowerCase()];
    if (skill) {
        result.label = skill.name;
        result.characteristic = skill.characteristic.name;
        skillCharRating = skill.characteristic.stat;  
        result.charAbbrev = skill.characteristic.abbrev;
    } else {
        // we don't have an entry in the skillMap.  Just return the item key but make it obvious we don't know if the data is valid
        // this is important - we can't find the attribute for this skill
        result.label = "_Unknown (" + result.key + ")";
    }

    // finally, set the ability and proficiency dice
    result.ability = Math.max(skillCharRating, result.ranks) - Math.min(skillCharRating, result.ranks);
    result.proficiency = Math.min(skillCharRating, result.ranks);
    result.ranks = result.ranks;
    
    return result;
}

