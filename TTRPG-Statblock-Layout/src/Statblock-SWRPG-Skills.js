// Change these to match whatever tag you're using for Ability (green) and Proficiency (yellow) dice.
let abilityDiceTag = "#Ability"
let proficiencyDiceTag = "#Proficiency";

const characteristics = {
    Bra : { name: "Brawn",      stat: monster.stats[0], abbrev: "Br" },
    Agi : { name: "Agility",    stat: monster.stats[1], abbrev: "Ag" },
    Int : { name: "Intellect",  stat: monster.stats[2], abbrev: "In" },
    Cun : { name: "Cunning",    stat: monster.stats[3], abbrev: "Cu" },
    Wil : { name: "Willpower",  stat: monster.stats[4], abbrev: "Wi" },
    Pre : { name: "Presence",   stat: monster.stats[5], abbrev: "Pr" },
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
    "astrogation"       : { name: "Astrogation",            characteristic : characteristics.Int, },       
    "athletics"         : { name: "Athletics",              characteristic : characteristics.Bra, },
    "brawl"             : { name: "Brawl",                  characteristic : characteristics.Bra, },
    "charm"             : { name: "Charm",                  characteristic : characteristics.Pre, },
    "coercion"          : { name: "Coercion",               characteristic : characteristics.Wil, },
    "computers"         : { name: "Computers",              characteristic : characteristics.Int, },
    "cool"              : { name: "Cool",                   characteristic : characteristics.Pre, },
    "coordination"      : { name: "Coordination",           characteristic : characteristics.Agi, },
    "coreworlds"        : { name: "Core Worlds",            characteristic : characteristics.Int, },
    "cybernetics"       : { name: "Cybernetics",            characteristic : characteristics.Int, },  
    "deception"         : { name: "Deception",              characteristic : characteristics.Cun, },
    "discipline"        : { name: "Discipline",             characteristic : characteristics.Wil, },
    "education"         : { name: "Education",              characteristic : characteristics.Int, },
    "gunnery"           : { name: "Gunnery",                characteristic : characteristics.Agi, },
    "leadership"        : { name: "Leadership",             characteristic : characteristics.Pre, },
    "lightsaber"        : { name: "Lightsaber",             characteristic : characteristics.Bra, },
    "lightsaber-agi"    : { name: "Lightsaber",             characteristic : characteristics.Agi, },
    "lightsaber-bra"    : { name: "Lightsaber",             characteristic : characteristics.Bra, },
    "lightsaber-cun"    : { name: "Lightsaber",             characteristic : characteristics.Cun, },
    "lightsaber-int"    : { name: "Lightsaber",             characteristic : characteristics.Int, },
    "lightsaber-pre"    : { name: "Lightsaber",             characteristic : characteristics.Pre, },
    "lightsaber-wil"    : { name: "Lightsaber",             characteristic : characteristics.Wil, },
    "lore"              : { name: "Lore",                   characteristic : characteristics.Int, },
    "mechanics"         : { name: "Mechanics",              characteristic : characteristics.Int, },
    "medicine"          : { name: "Medicine",               characteristic : characteristics.Int, },
    "melee"             : { name: "Melee",                  characteristic : characteristics.Bra, },
    "negotiation"       : { name: "Negotiation",            characteristic : characteristics.Pre, },
    "outerrim"          : { name: "Outer Rim",              characteristic : characteristics.Int, },
    "perception"        : { name: "Perception",             characteristic : characteristics.Cun, },
    "pilotingplanetary" : { name: "Piloting (Planetary)",   characteristic : characteristics.Agi, },
    "pilotingspace"     : { name: "Piloting (Space)",       characteristic : characteristics.Agi, },
    "rangedheavy"       : { name: "Ranged (Heavy)",         characteristic : characteristics.Agi, },
    "rangedlight"       : { name: "Ranged (Light)",         characteristic : characteristics.Agi, },
    "resilience"        : { name: "Resilience",             characteristic : characteristics.Bra, },
    "skulduggery"       : { name: "Skulduggery",            characteristic : characteristics.Cun, },
    "stealth"           : { name: "Stealth",                characteristic : characteristics.Agi, },
    "streetwise"        : { name: "Streetwise",             characteristic : characteristics.Cun, },
    "survival"          : { name: "Survival",               characteristic : characteristics.Cun, },
    "underworld"        : { name: "Underworld",             characteristic : characteristics.Int, },
    "vigilance"         : { name: "Vigilance",              characteristic : characteristics.Wil, },
    "warfare"           : { name: "Warfare",                characteristic : characteristics.Int, },
    "xenology"          : { name: "Xenology",               characteristic : characteristics.Int, },
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
        output += `<strong>[[${element.label}|${element.label}]]</strong> (${element.charAbbrev}): ${rankString} ${dicePool}<br>`;
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

