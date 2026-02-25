import OBR from "https://esm.sh/@owlbear-rodeo/sdk";

const skillsData = [
    { name: "Arcanismo", attr: "Magia" }, { name: "História", attr: "Magia" }, { name: "Natureza", attr: "Magia" }, { name: "Religião", attr: "Magia" },
    { name: "Intuição", attr: "Sorte" }, { name: "Medicina", attr: "Sorte" }, { name: "Percepção", attr: "Sorte" }, { name: "Sobrevivência", attr: "Sorte" },
    { name: "Atletismo", attr: "Força" }, { name: "Intimidação", attr: "Força" },
    { name: "Acrobacia", attr: "Agilidade" }, { name: "Furtividade", attr: "Agilidade" }, { name: "Prestidigitação", attr: "Agilidade" },
    { name: "Atuação", attr: "Sorte" }, { name: "Enganação", attr: "Sorte" }, { name: "Persuasão", attr: "Sorte" }
];

let characters = {}; 
let currentCharId = null;
let currentIsMine = true; 
let playerSkills = {}; 
let playerInventory = [];
let playerSpells = []; 
let currentPhoto = "";
let folderState = { "Jogadores": true, "NPCs": true, "Monstros": true };
let isOverweight = false;

window.onload = function() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    initExtension();
};

window.openTab = function(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    if(event) event.currentTarget.classList.add('active');
}

window.backToList = function() {
    window.saveData();
    document.getElementById('screen-sheet').classList.remove('active');
    document.getElementById('screen-list').classList.add('active');
}

window.toggleFolder = function(folderName) {
    folderState[folderName] = !folderState[folderName];
    window.renderCharacterList();
}

window.renderCharacterList = function() {
    const container = document.getElementById('character-folders');
    if(!container) return;
    container.innerHTML = '';

    const categories = { "Jogadores": [], "NPCs": [], "Monstros": [] };

    for (let id in characters) {
        let char = characters[id];
        let cat = char.category || "Jogadores";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ id: id, name: char.name || "Sem Nome" });
    }

    let hasAny = false;
    for (let cat in categories) {
        if (categories[cat].length > 0) {
            hasAny = true;
            let isOpen = folderState[cat];
            let html = `
                <div class="folder-header" onclick="toggleFolder('${cat}')">
                    <span class="chevron">${isOpen ? '▼' : '►'}</span> 📁 ${cat}
                </div>
                <div class="folder-content" style="display: ${isOpen ? 'flex' : 'none'};">
            `;
            categories[cat].forEach(char => {
                html += `<div class="char-list-item" onclick="openCharacter('${char.id}')"><span>${char.name}</span></div>`;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
    }

    if(!hasAny) container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">A Mesa está vazia.</div>';
}

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", category: "Jogadores", classe: "Plebeu", skills: {}, inventory: [], spells: [], photo: "", color: "#d4af37", mov: 30, runas: 0 };
    currentCharId = newId;
    window.saveData(); 
    window.openCharacter(newId);
}

window.deleteCharacter = async function() {
    if(confirm("Apagar esta ficha permanentemente para TODOS na mesa?")) {
        const idToDelete = currentCharId;
        delete characters[idToDelete]; 
        try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}
        if (OBR.isAvailable) {
            let metaUpdate = {};
            metaUpdate[`fatesheet_char_${idToDelete}`] = undefined; 
            await OBR.room.setMetadata(metaUpdate);
        }
        window.backToList();
    }
}

window.exportCharacter = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(characters[currentCharId]));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", (characters[currentCharId].name || "Ficha") + "_Fate.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
}

window.importCharacter = function(event) {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            const newId = 'char_' + Date.now();
            currentCharId = newId;
            characters[newId] = importedData;
            window.saveData();
            alert("Ficha importada com sucesso!");
        } catch(err) { alert("Erro ao ler JSON."); }
    };
    reader.readAsText(file);
}

const safeSetVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };

window.updateSheetColor = function() {
    let color = document.getElementById('char-color').value;
    document.documentElement.style.setProperty('--accent-gold', color);
    window.saveData();
}

window.updateCategoryUI = function() {
    const cat = document.getElementById('char-category').value;
    const isMonster = (cat === 'Monstros');
    document.getElementById('box-classe-prof').style.display = isMonster ? 'none' : 'block';
    document.getElementById('char-race-player').style.display = isMonster ? 'none' : 'block';
    document.getElementById('char-race-monster').style.display = isMonster ? 'block' : 'none';
    document.getElementById('val-vida-player').style.display = isMonster ? 'none' : 'block';
    document.getElementById('val-vida-monster').style.display = isMonster ? 'block' : 'none';
    window.calcVitals();
    window.saveData();
}

window.openCharacter = function(id) {
    currentCharId = id;
    const c = characters[id] || {};
    currentIsMine = true;
    
    safeSetVal('char-name', c.name || '');
    safeSetVal('char-color', c.color || '#d4af37');
    document.documentElement.style.setProperty('--accent-gold', c.color || '#d4af37');

    safeSetVal('char-category', c.category || 'Jogadores');
    safeSetVal('char-age', c.age || '');
    safeSetVal('char-class', c.classe || 'Plebeu');
    safeSetVal('char-prof', c.prof || '');
    safeSetVal('char-prof-desc', c.profDesc || '');
    
    if(c.category === 'Monstros') safeSetVal('char-race-monster', c.race || 'Terrestres');
    else safeSetVal('char-race-player', c.race || 'Humano');

    safeSetVal('val-vida-monster', c.vidaMonster || 100);
    safeSetVal('attr-forca', c.forca || 1);
    safeSetVal('attr-magia', c.magia || 1);
    safeSetVal('attr-agilidade', c.agilidade || 1);
    safeSetVal('attr-sorte', c.sorte || 1);
    safeSetVal('grimoire-name', c.grimoire || '');
    safeSetVal('mana-zone', c.mana || '');
    safeSetVal('passiva', c.passiva || ''); 
    safeSetVal('char-mov', c.mov || 30);
    safeSetVal('char-runas', c.runas || 0); 
    
    playerSkills = c.skills || {};
    playerInventory = c.inventory || [];
    playerSpells = c.spells || []; 
    currentPhoto = c.photo || '';
    
    window.updateCategoryUI();
    window.setPhotoPreview(currentPhoto);
    window.renderSkills();
    window.renderInventory();
    window.renderSpells(); 
    window.calcVitals();

    document.getElementById('screen-list').classList.remove('active');
    document.getElementById('screen-sheet').classList.add('active');
}

window.calcVitals = function() {
    let cat = document.getElementById('char-category').value;
    let forcaBase = parseInt(document.getElementById('attr-forca').value) || 0;
    let magiaBase = parseInt(document.getElementById('attr-magia').value) || 0;
    let sorteBase = parseInt(document.getElementById('attr-sorte').value) || 0;
    let classe = document.getElementById('char-class').value;

    if (cat !== 'Monstros') {
        let extraMana = 0;
        if(classe === 'Andarilho') extraMana = 50;
        if(classe === 'Estrangeiro') extraMana = 75;
        if(classe === 'Nobre') extraMana = 100;
        document.getElementById('val-vida-player').innerText = `${40 + (sorteBase * 5)} / ${40 + (sorteBase * 5)}`;
        document.getElementById('val-mana').innerText = `${25 + extraMana} / ${25 + extraMana}`;
    } else {
        document.getElementById('val-mana').innerText = `25 / 25`;
    }

    document.getElementById('val-def-fisica').innerText = forcaBase * 5;
    document.getElementById('val-def-magica').innerText = magiaBase * 5;

    let maxWeight = forcaBase * 5;
    let currentWeight = playerInventory.reduce((acc, item) => acc + ((parseFloat(item.peso)||0) * (parseInt(item.qtd)||1)), 0);
    document.getElementById('val-peso').innerText = `${currentWeight.toFixed(1)} / ${maxWeight}`;
    
    if (currentWeight > maxWeight) {
        isOverweight = true;
        document.getElementById('box-peso').classList.add('overweight');
        document.getElementById('peso-aviso').style.display = 'block';
    } else {
        isOverweight = false;
        document.getElementById('box-peso').classList.remove('overweight');
        document.getElementById('peso-aviso').style.display = 'none';
    }
}

// ------ VERIFICADOR DE LIMITES DE RUNAS E AGILIDADE ------
function checkRuneLimits(spellIndex, typeToVerify, addedQtd = 0) {
    let spell = playerSpells[spellIndex];
    let forca = parseInt(document.getElementById('attr-forca').value) || 0;
    let magia = parseInt(document.getElementById('attr-magia').value) || 0;
    let maxRunas = parseInt(document.getElementById('char-runas').value) || 0;

    let currentTotal = 0;
    let currentTypeTotal = 0;

    spell.runes.forEach(r => {
        currentTotal += parseInt(r.qtd) || 0;
        if(r.type === typeToVerify) currentTypeTotal += parseInt(r.qtd) || 0;
    });

    if (currentTotal + addedQtd > maxRunas) {
        alert(`Limite de Runas Totais atingido! Sua ficha permite usar no máximo ${maxRunas} runa(s) por turno.`);
        return false;
    }

    if (typeToVerify === 'alpha' && (currentTypeTotal + addedQtd > magia)) {
        alert(`Limite de Alpha atingido! Seu atributo de Magia é apenas ${magia}.`);
        return false;
    }
    if (typeToVerify === 'delta' && (currentTypeTotal + addedQtd > forca)) {
        alert(`Limite de Delta atingido! Seu atributo de Força é apenas ${forca}.`);
        return false;
    }
    return true;
}

window.toggleSpellInfo = function(index) {
    playerSpells[index].isOpen = !playerSpells[index].isOpen;
    window.renderSpells();
    window.saveData();
}

window.renderSpells = function() {
    const container = document.getElementById('spells-container');
    container.innerHTML = '';
    playerSpells.forEach((spell, index) => {
        if(spell.isOpen === undefined) spell.isOpen = true;
        spell.tipo = spell.tipo || "Dano"; 
        spell.bQtd = spell.bQtd || 1; spell.bD = spell.bD || "d20"; spell.bMult = spell.bMult !== undefined ? spell.bMult : 1;
        spell.runes = spell.runes || [];
        spell.betaQtd = spell.betaQtd || 0; spell.betaD = spell.betaD || ""; 
        spell.isCrit = spell.isCrit || false;
        spell.statusName = spell.statusName || ""; spell.statusDT = spell.statusDT || "";

        let isSelf = spell.tipo === "Self";
        let isLoc = spell.tipo === "Locomoção";

        let row = document.createElement('div');
        row.className = 'spell-item';
        
        let headerHtml = `
            <div class="spell-header" onclick="toggleSpellInfo(${index})">
                <div style="display: flex; align-items: center; gap: 10px;">
                   <button class="btn-roll-spell" onclick="event.stopPropagation(); rollSpellMagic(${index})" title="Rolar Magia">🎲</button>
                   <span style="font-weight: bold; color: var(--accent-gold); font-size: 16px;">${spell.nome || 'Nova Magia'}</span>
                </div>
                <div style="display:flex; align-items:center; gap: 10px;">
                   <button class="btn-danger" style="padding: 4px 8px;" onclick="event.stopPropagation(); removeSpell(${index})">X</button>
                   <span class="chevron">${spell.isOpen ? '▼' : '►'}</span>
                </div>
            </div>`;

        let runesHtml = '';
        if(!isSelf && !isLoc) {
            spell.runes.forEach((r, rIdx) => {
                let cHex = '#ccc', sym = '⚔️';
                if(r.type === 'alpha') { cHex = '#44aaff'; sym = 'α'; }
                if(r.type === 'delta') { cHex = '#ff4444'; sym = 'δ'; }
                
                runesHtml += `
                    <div class="dice-group" style="border-color:${cHex}; margin-top:5px;">
                        <span class="lbl" style="color:${cHex}; text-align:center;">${sym}</span>
                        <input type="number" class="inv-input dice-qty" min="1" value="${r.qtd}" onchange="updateRune(${index}, ${rIdx}, 'qtd', this.value)">
                        <select class="inv-input dice-sel" onchange="updateRune(${index}, ${rIdx}, 'face', this.value)">
                            <option value="d4" ${r.face==='d4'?'selected':''}>d4</option><option value="d6" ${r.face==='d6'?'selected':''}>d6</option><option value="d8" ${r.face==='d8'?'selected':''}>d8</option><option value="d10" ${r.face==='d10'?'selected':''}>d10</option><option value="d12" ${r.face==='d12'?'selected':''}>d12</option><option value="d20" ${r.face==='d20'?'selected':''}>d20</option><option value="d100" ${r.face==='d100'?'selected':''}>d100</option>
                        </select>
                        ${r.type === 'arma' ? `<span style="color:#ccc; font-weight:bold;">+</span><input type="number" class="inv-input dice-qty" placeholder="Fixo" value="${r.fixo || 0}" onchange="updateRune(${index}, ${rIdx}, 'fixo', this.value)" style="width: 35px !important;">` : ''}
                        
                        <div class="mult-group">
                            <span class="mult-btn m-red ${r.mult===0?'active':''}" onclick="updateRune(${index}, ${rIdx}, 'mult', 0)">X</span>
                            <span class="mult-btn m-white ${r.mult===0.5?'active':''}" onclick="updateRune(${index}, ${rIdx}, 'mult', 0.5)">X</span>
                            <span class="mult-btn m-green ${r.mult===1?'active':''}" onclick="updateRune(${index}, ${rIdx}, 'mult', 1)">X</span>
                        </div>
                        <span style="color:#666; cursor:pointer; font-weight:bold; margin-left:5px;" onclick="removeRune(${index}, ${rIdx})">✖</span>
                    </div>`;
            });
        }

        let bodyHtml = `
            <div style="display: ${spell.isOpen ? 'flex' : 'none'}; flex-direction: column; gap: 5px; margin-top: 10px;">
                <div class="inv-row">
                    <input type="text" class="inv-input" style="flex: 2; font-weight: bold;" placeholder="Habilidade" value="${spell.nome}" onchange="updateSpell(${index}, 'nome', this.value)">
                    <input type="text" class="inv-input" style="flex: 1;" placeholder="Mana" value="${spell.custo}" onchange="updateSpell(${index}, 'custo', this.value)">
                    <input type="text" class="inv-input" style="flex: 1;" placeholder="Alcance" value="${spell.alcance}" onchange="updateSpell(${index}, 'alcance', this.value)">
                </div>
                <div class="inv-row" style="margin-top: 5px;"><textarea class="inv-input" style="flex: 1; resize: vertical;" rows="1" placeholder="Descrição e Efeitos..." onchange="updateSpell(${index}, 'desc', this.value)">${spell.desc}</textarea></div>
                <div class="dice-config-row">
                    <select class="inv-input dice-sel" style="width:100% !important;" onchange="updateSpell(${index}, 'tipo', this.value); window.renderSpells();">
                        <option value="Dano" ${spell.tipo==='Dano'?'selected':''}>Dano (Base + Runas)</option>
                        <option value="Controle" ${spell.tipo==='Controle'?'selected':''}>Controle (Base + Runas)</option>
                        <option value="Self" ${spell.tipo==='Self'?'selected':''}>Self (Apenas Efeitos/DT)</option>
                        <option value="Locomoção" ${spell.tipo==='Locomoção'?'selected':''}>Locomoção (Base + Beta)</option>
                    </select>
                    
                    ${(!isSelf) ? `
                    <div class="dice-group"><span class="lbl" style="color:#fff">Base</span>
                        <input type="number" class="inv-input dice-qty" min="1" value="${spell.bQtd}" onchange="updateSpell(${index}, 'bQtd', this.value)">
                        <select class="inv-input dice-sel" onchange="updateSpell(${index}, 'bD', this.value)">
                            <option value="d4" ${spell.bD==='d4'?'selected':''}>d4</option><option value="d6" ${spell.bD==='d6'?'selected':''}>d6</option><option value="d8" ${spell.bD==='d8'?'selected':''}>d8</option><option value="d10" ${spell.bD==='d10'?'selected':''}>d10</option><option value="d12" ${spell.bD==='d12'?'selected':''}>d12</option><option value="d20" ${spell.bD==='d20'?'selected':''}>d20</option><option value="d100" ${spell.bD==='d100'?'selected':''}>d100</option>
                        </select>
                        <div class="mult-group">
                            <span class="mult-btn m-red ${spell.bMult===0?'active':''}" onclick="updateSpell(${index}, 'bMult', 0)">X</span>
                            <span class="mult-btn m-white ${spell.bMult===0.5?'active':''}" onclick="updateSpell(${index}, 'bMult', 0.5)">X</span>
                            <span class="mult-btn m-green ${spell.bMult===1?'active':''}" onclick="updateSpell(${index}, 'bMult', 1)">X</span>
                        </div>
                    </div>` : ''}

                    ${runesHtml}

                    ${(!isSelf && !isLoc) ? `
                    <div style="display:flex; gap: 8px; margin-top: 5px; width: 100%;">
                        <button class="btn-rune b-alpha" onclick="addRune(${index}, 'alpha')">+ α Azul</button>
                        <button class="btn-rune b-delta" onclick="addRune(${index}, 'delta')">+ δ Verm</button>
                        <button class="btn-rune b-arma" onclick="addRune(${index}, 'arma')">+ ⚔️ Arma</button>
                    </div>` : ''}

                    ${isLoc ? `
                    <div class="dice-group" style="border-color:#7e22ce"><span class="lbl" style="color:#a855f7">βeta</span>
                        <input type="number" class="inv-input dice-qty" min="0" value="${spell.betaQtd}" onchange="updateSpell(${index}, 'betaQtd', this.value)">
                        <select class="inv-input dice-sel" onchange="updateSpell(${index}, 'betaD', this.value)"><option value="" ${spell.betaD===''?'selected':''}>--</option><option value="d4" ${spell.betaD==='d4'?'selected':''}>d4</option><option value="d6" ${spell.betaD==='d6'?'selected':''}>d6</option><option value="d8" ${spell.betaD==='d8'?'selected':''}>d8</option><option value="d10" ${spell.betaD==='d10'?'selected':''}>d10</option><option value="d12" ${spell.betaD==='d12'?'selected':''}>d12</option><option value="d20" ${spell.betaD==='d20'?'selected':''}>d20</option><option value="d100" ${spell.betaD==='d100'?'selected':''}>d100</option></select>
                    </div>` : ''}

                    ${(!isSelf) ? `
                    <div style="display:flex; align-items:center; gap:5px; margin-left: auto; width: 100%; justify-content: flex-end; margin-top: 5px;">
                        <input type="checkbox" id="crit-${index}" ${spell.isCrit ? 'checked' : ''} onchange="updateSpell(${index}, 'isCrit', this.checked)">
                        <label for="crit-${index}" style="color:#ffd700; margin:0; cursor:pointer;">Crítico (Máx x3)</label>
                    </div>` : ''}
                </div>

                <div class="dice-config-row" style="margin-top: 5px; border-color: #a855f7;">
                    <div style="display: flex; width: 100%; align-items: center; gap: 5px;">
                        <span style="color:#a855f7; font-size: 11px; font-weight: bold; white-space: nowrap;">⚡ Status/Efeito</span>
                        <input type="text" class="inv-input" style="flex: 2;" placeholder="Ex: Queimar" value="${spell.statusName}" onchange="updateSpell(${index}, 'statusName', this.value)">
                        <span style="color:#fff; font-size: 11px; font-weight: bold;">DT:</span>
                        <input type="number" class="inv-input dice-qty" placeholder="15" value="${spell.statusDT}" onchange="updateSpell(${index}, 'statusDT', this.value)">
                    </div>
                </div>
            </div>`;
        row.innerHTML = headerHtml + bodyHtml;
        container.appendChild(row);
    });
}

window.addSpell = function() {
    playerSpells.push({ nome: "", desc: "", custo: "", alcance: "", tipo: "Dano", bQtd: 1, bD: "d20", bMult: 1, runes: [], isOpen: true, isCrit: false, statusName: "", statusDT: "" });
    window.renderSpells(); window.saveData();
}

window.updateSpell = function(index, field, value) {
    if(field === 'betaQtd') {
        let agil = parseInt(document.getElementById('attr-agilidade').value) || 0;
        if (value > agil) {
            alert(`Limite excedido! Sua Agilidade é apenas ${agil}.`);
            playerSpells[index][field] = agil;
            window.renderSpells(); return;
        }
    }
    playerSpells[index][field] = value; window.saveData(); 
}

window.removeSpell = function(index) {
    if(confirm("Remover magia?")) { playerSpells.splice(index, 1); window.renderSpells(); window.saveData(); }
}

window.addRune = function(spellIndex, type) {
    if(!checkRuneLimits(spellIndex, type, 1)) return;
    playerSpells[spellIndex].runes.push({ type: type, qtd: 1, face: "d4", mult: 1, fixo: 0 });
    window.renderSpells(); window.saveData();
}

window.updateRune = function(sIdx, rIdx, field, val) {
    if (field === 'qtd') {
        let currentQtd = playerSpells[sIdx].runes[rIdx].qtd || 0;
        let diff = parseInt(val) - currentQtd;
        if (diff > 0 && !checkRuneLimits(sIdx, playerSpells[sIdx].runes[rIdx].type, diff)) {
            window.renderSpells(); 
            return;
        }
    }
    playerSpells[sIdx].runes[rIdx][field] = val; window.renderSpells(); window.saveData();
}

window.removeRune = function(sIdx, rIdx) {
    playerSpells[sIdx].runes.splice(rIdx, 1); window.renderSpells(); window.saveData();
}

window.rollSpellMagic = function(index) {
    const spell = playerSpells[index];
    if(!spell) return;

    const charName = document.getElementById('char-name').value || 'Desconhecido';
    const charColor = document.getElementById('char-color') ? document.getElementById('char-color').value : '#d4af37';

    const rolar = (qtd, tDado) => {
        if (!qtd || qtd <= 0 || !tDado) return [];
        let faces = parseInt(tDado.replace('d', ''));
        let res = []; for(let i=0; i<qtd; i++) res.push(Math.floor(Math.random() * faces) + 1);
        return res;
    }

    let bRolls = [], bTot = 0;
    if(spell.tipo !== 'Self') {
        if(spell.isCrit) {
            let faces = parseInt(spell.bD.replace('d', ''));
            bRolls = [faces * parseInt(spell.bQtd) * 3]; 
        } else {
            bRolls = rolar(spell.bQtd, spell.bD);
        }
        bTot = Math.floor(bRolls.reduce((a,b)=>a+b, 0) * (spell.tipo==='Locomoção' ? 1 : spell.bMult));
    }

    let runesPack = [];
    if(spell.tipo !== 'Self' && spell.tipo !== 'Locomoção') {
        runesPack = spell.runes.map(r => {
            let rl = rolar(r.qtd, r.face);
            let somaDados = rl.reduce((a,b)=>a+b, 0);
            let fixo = parseInt(r.fixo) || 0;
            let tot = Math.floor((somaDados + fixo) * r.mult);
            return { t: r.type, f: r.face, m: r.mult, r: rl, fixo: fixo, tot: tot };
        });
    }

    let rBeta = [];
    if(spell.tipo === 'Locomoção') rBeta = rolar(spell.betaQtd, spell.betaD);

    let stRoll = (spell.statusName && spell.statusDT > 0) ? Math.floor(Math.random() * 20) + 1 : 0;

    const payload = {
        t: "spell", c: charName, col: charColor,
        sn: spell.nome || "Habilidade", cost: spell.custo || "0", rg: spell.alcance || "Self", desc: spell.desc || "", st: spell.tipo || "Dano",
        b: { f: spell.bD, m: spell.bMult, r: bRolls, tot: bTot },
        ru: runesPack, 
        crit: spell.isCrit ? "true" : "false",
        beta: { f: spell.betaD, r: rBeta },
        stName: spell.statusName || "", stDT: spell.statusDT || "0", stRoll: stRoll
    };

    window.abrirModalCentral(payload);
    if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);
    
    // MAGIA UTILIZADA: RESETA AS RUNAS E DESLIGA O CRITICO
    if(spell.isCrit) spell.isCrit = false;
    spell.runes = []; 
    window.renderSpells();
    window.saveData();
}

window.renderInventory = function() {
    const container = document.getElementById('inventory-container');
    container.innerHTML = '';
    playerInventory.forEach((item, index) => {
        let row = document.createElement('div'); row.className = 'inv-item';
        row.innerHTML = `
            <div class="inv-row">
                <input type="text" class="inv-input" style="flex: 2;" placeholder="Item" value="${item.nome}" onchange="updateInv(${index}, 'nome', this.value)">
                <input type="number" class="inv-input" style="flex: 1;" placeholder="Peso" value="${item.peso}" onchange="updateInv(${index}, 'peso', this.value)">
                <input type="number" class="inv-input" style="flex: 1;" placeholder="Qtd" value="${item.qtd}" onchange="updateInv(${index}, 'qtd', this.value)">
                <button class="btn-danger" onclick="removeInv(${index})">X</button>
            </div>
            <div class="inv-row" style="margin-top: 5px;"><input type="text" class="inv-input" style="flex: 1;" placeholder="Descrição..." value="${item.desc}" onchange="updateInv(${index}, 'desc', this.value)"></div>
        `;
        container.appendChild(row);
    });
    window.calcVitals();
}

window.addInventoryItem = function() {
    if(isOverweight) return alert("Sua mochila está muito pesada!");
    playerInventory.push({ nome: "", desc: "", peso: 0, qtd: 1 });
    window.renderInventory(); window.saveData();
}
window.updateInv = function(index, field, value) { playerInventory[index][field] = value; window.renderInventory(); window.saveData(); }
window.removeInv = function(index) { playerInventory.splice(index, 1); window.renderInventory(); window.saveData(); }

window.saveData = async function() {
    if (!currentCharId) return; 
    let isMonster = document.getElementById('char-category')?.value === 'Monstros';

    const sheetData = {
        name: document.getElementById('char-name')?.value || "Sem Nome", color: document.getElementById('char-color')?.value || "#d4af37", category: document.getElementById('char-category')?.value || "Jogadores",
        age: document.getElementById('char-age')?.value || "", race: isMonster ? document.getElementById('char-race-monster').value : document.getElementById('char-race-player').value,
        classe: document.getElementById('char-class')?.value || "Plebeu", prof: document.getElementById('char-prof')?.value || "", profDesc: document.getElementById('char-prof-desc')?.value || "",
        vidaMonster: document.getElementById('val-vida-monster')?.value || 100, forca: document.getElementById('attr-forca')?.value || 1, magia: document.getElementById('attr-magia')?.value || 1, agilidade: document.getElementById('attr-agilidade')?.value || 1, sorte: document.getElementById('attr-sorte')?.value || 1,
        grimoire: document.getElementById('grimoire-name')?.value || "", mana: document.getElementById('mana-zone')?.value || "", passiva: document.getElementById('passiva')?.value || "", 
        mov: document.getElementById('char-mov')?.value || 30, runas: document.getElementById('char-runas')?.value || 0,
        skills: playerSkills, inventory: playerInventory, spells: playerSpells, photo: currentPhoto 
    };

    characters[currentCharId] = sheetData;
    try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}

    if (OBR.isAvailable) {
        let metaUpdate = {};
        metaUpdate[`fatesheet_char_${currentCharId}`] = sheetData;
        await OBR.room.setMetadata(metaUpdate);
    }
}

window.renderSkills = function() {
    const container = document.getElementById('skills-container'); container.innerHTML = '';
    skillsData.forEach(skill => {
        if (playerSkills[skill.name] === undefined) playerSkills[skill.name] = 0;
        let controls = `<button class="btn-ctrl" onclick="updateSkill('${skill.name}', -1, event)">-</button><span style="width: 20px; text-align: center;">${playerSkills[skill.name]}</span><button class="btn-ctrl" onclick="updateSkill('${skill.name}', 1, event)">+</button>`;
        let div = document.createElement('div'); div.className = 'skill-item';
        div.innerHTML = `<div onclick="rollSkill('${skill.name}', '${skill.attr}')" style="flex:1;"><strong>${skill.name}</strong> <span style="font-size: 10px; color: var(--text-muted);">(${skill.attr})</span></div><div class="skill-controls">${controls}</div>`;
        container.appendChild(div);
    });
}
window.updateSkill = function(skillName, change, event) { event.stopPropagation(); playerSkills[skillName] += change; if (playerSkills[skillName] < 0) playerSkills[skillName] = 0; window.renderSkills(); window.saveData(); }

window.rollSkill = function(skillName, attrName) {
    let idMapped = attrName.toLowerCase().replace('ç', 'c');
    let baseAttr = parseInt(document.getElementById(`attr-${idMapped}`).value) || 1;
    let classe = document.getElementById('char-class').value;
    let isMonster = document.getElementById('char-category').value === 'Monstros';
    
    if(!isMonster) {
        if (classe === 'Plebeu') { if(attrName === 'Força') baseAttr += 1; if(attrName === 'Magia') baseAttr -= 1; }
        if (classe === 'Andarilho' && attrName === 'Agilidade') baseAttr += 1;
        if (classe === 'Estrangeiro' && attrName === 'Sorte') baseAttr += 1;
        if (classe === 'Nobre' && attrName === 'Magia') baseAttr += 1;
    }
    if(baseAttr < 1) baseAttr = 1;

    let results = [];
    for (let i = 0; i < baseAttr; i++) {
        let die = Math.floor(Math.random() * 20) + 1;
        if (isOverweight) die -= 5;
        results.push(die);
    }

    const charName = document.getElementById('char-name').value || 'Desconhecido';
    const charColor = document.getElementById('char-color') ? document.getElementById('char-color').value : '#d4af37';
    let skillMod = playerSkills[skillName] || 0;
    
    const payload = { t: "skill", c: charName, s: skillName, a: attrName, r: results.join(','), pen: isOverweight ? "true" : "false", col: charColor, mod: skillMod };

    window.abrirModalCentral(payload);
    if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);
}

window.abrirModalCentral = function(data) {
    if (OBR.isAvailable) {
        const dataUrl = encodeURIComponent(JSON.stringify(data));
        OBR.modal.open({ id: "fate-roll-modal", url: `https://seediam.github.io/FateSheet/resultado.html?data=${dataUrl}`, width: 450, height: data.t === "spell" ? 480 : 250 });
    }
}

window.setPhotoPreview = function(base64Str) {
    const preview = document.getElementById('photo-preview'); const text = document.getElementById('photo-text');
    if(!preview) return;
    if (base64Str) { preview.style.backgroundImage = `url("${base64Str}")`; preview.style.border = 'none'; text.style.display = 'none';
    } else { preview.style.backgroundImage = 'none'; preview.style.border = '1px dashed var(--accent-gold)'; text.style.display = 'block'; }
}

document.getElementById('photo-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) { currentPhoto = event.target.result; window.setPhotoPreview(currentPhoto); window.saveData(); };
        reader.readAsDataURL(file);
    }
});

document.addEventListener('input', () => { if(currentCharId) window.saveData(); });

function processRoomData(metadata) {
    let mudouAlgo = false;
    for (let key in metadata) {
        if (key.startsWith('fatesheet_char_')) {
            const id = key.replace('fatesheet_char_', '');
            if (metadata[key] === undefined || metadata[key] === null) {
                if(characters[id]) { delete characters[id]; mudouAlgo = true; }
            } else { characters[id] = metadata[key]; mudouAlgo = true; }
        }
    }
    if (mudouAlgo) window.renderCharacterList();
}

function initExtension() {
    try {
        const saved = localStorage.getItem('fatesheet_db');
        if (saved) characters = JSON.parse(saved);
        window.renderCharacterList();
    } catch(e) {}

    if (OBR.isAvailable) {
        OBR.onReady(async () => {
            try {
                const meta = await OBR.room.getMetadata();
                processRoomData(meta);
                OBR.room.onMetadataChange((metadata) => processRoomData(metadata));
                OBR.broadcast.onMessage("fatesheet-rolls", (event) => { window.abrirModalCentral(event.data); });
            } catch(e) {}
        });
    }
}
