let output = "<div style=\"text-align: center; position:relative; top:-10px;\">";
let stat = "";
let names = {
    "soak" : "Soak",
    "wounds" : "Wounds",
    "strain" : "Strain",
    "mdef" : "M Def",
    "rdef" : "R Def",
};
const separator = "&nbsp;&nbsp;<strong>|</strong>&nbsp;&nbsp;"

const isMinion = String(monster.type).localeCompare("minion", undefined, { sensitivity: 'accent'}) === 0;
const isRival = String(monster.type).localeCompare("rival", undefined, { sensitivity: 'accent'}) === 0;

let statDisplay = (targetStat) => {
    let stat = "";
    if (targetStat == undefined || targetStat in monster === false) {
        return "";
    }
    stat = monster[targetStat]
    if (isMinion && names[targetStat] == "Wounds") {
        // Minion wounds are dependent on the quantity
        stat *= monster.qty
    }
    let name = names[targetStat];
    return `<strong>${name}</strong> : ${stat}`;
};

output += statDisplay("soak") + separator;
output += statDisplay("wounds");
if(!isMinion && !isRival) {
    output += separator + statDisplay("strain");
}
output += "<br>&nbsp;";
output += statDisplay("mdef") + separator + statDisplay("rdef") + "<br>";
output += "</div>";
return output.trim();

