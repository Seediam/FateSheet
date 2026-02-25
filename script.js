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
let playerSkills = {}; 
let playerInventory = [];
let playerSpells = []; // NOVA LISTA DE MAGIAS
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

    if(!hasAny) {
        container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">A Mesa está vazia.</div>';
    }
}

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", category: "Jogadores", classe: "Plebeu", skills: {}, inventory: [], spells: [], photo: "", color: "#d4af37" };
    currentCharId = newId;
    window.saveData(); 
    window.openCharacter(newId);
}

window.deleteCharacter = async function() {
    if(confirm("Apagar esta ficha permanentemente para TODOS na mesa?")) {
        const idToDelete = currentCharId;
        delete characters[idToDelete];
        if (OBR.isAvailable) {
            await OBR.room.setMetadata({ [`fatesheet_char_${idToDelete}`]: undefined });
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

function safeSetVal(id, value) {
    const el = document.getElementById(id);
    if(el) el.value = value;
}

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
    const charData = characters[id] || {};
    
    safeSetVal('char-name', charData.name || '');
    safeSetVal('char-color', charData.color || '#d4af37');
    document.documentElement.style.setProperty('--accent-gold', charData.color || '#d4af37');

    safeSetVal('char-category', charData.category || 'Jogadores');
    safeSetVal('char-age', charData.age || '');
    safeSetVal('char-class', charData.classe || 'Plebeu');
    safeSetVal('char-prof', charData.prof || '');
    safeSetVal('char-prof-desc', charData.profDesc || '');
    
    if(charData.category === 'Monstros') safeSetVal('char-race-monster', charData.race || 'Terrestres');
    else safeSetVal('char-race-player', charData.race || 'Humano');

    safeSetVal('val-vida-monster', charData.vidaMonster || 100);
    safeSetVal('attr-forca', charData.forca || 1);
    safeSetVal('attr-magia', charData.magia || 1);
    safeSetVal('attr-agilidade', charData.agilidade || 1);
    safeSetVal('attr-sorte', charData.sorte || 1);
    safeSetVal('grimoire-name', charData.grimoire || '');
    safeSetVal('mana-zone', charData.mana || '');
    
    playerSkills = charData.skills || {};
    playerInventory = charData.inventory || [];
    playerSpells = charData.spells || []; // CARREGA AS MAGIAS DA FICHA
    currentPhoto = charData.photo || '';
    
    // Migração de segurança: se for uma ficha antiga que usava hab1, hab2... passa pra lista nova
    if (charData.hab1 || charData.hab2 || charData.hab3 || charData.hab4) {
        if(charData.hab1) playerSpells.push({nome: charData.hab1, desc: "", custo: "", alcance: ""});
        if(charData.hab2) playerSpells.push({nome: charData.hab2, desc: "", custo: "", alcance: ""});
        if(charData.hab3) playerSpells.push({nome: charData.hab3, desc: "", custo: "", alcance: ""});
        if(charData.hab4) playerSpells.push({nome: charData.hab4, desc: "", custo: "", alcance: ""});
        // Deleta as antigas do objeto para não recarregar no futuro
        delete characters[id].hab1; delete characters[id].hab2; delete characters[id].hab3; delete characters[id].hab4;
    }

    window.updateCategoryUI();
    window.setPhotoPreview(currentPhoto);
    window.renderSkills();
    window.renderInventory();
    window.renderSpells(); // RENDERIZA A LISTA INFINITA DE MAGIAS
    window.calcVitals();

    document.getElementById('screen-list').classList.remove('active');
    document.getElementById('screen-sheet').classList.add('active');
}

window.calcVitals = function() {
    let cat = document.getElementById('char-category').value;
    let forcaBase = parseInt(document.getElementById('attr-forca').value) || 0;
    let sorteBase = parseInt(document.getElementById('attr-sorte').value) || 0;
    let classe = document.getElementById('char-class').value;

    if (cat !== 'Monstros') {
        let extraMana = 0;
        if(classe === 'Andarilho') extraMana = 25;
        if(classe === 'Estrangeiro') extraMana = 50;
        if(classe === 'Nobre') extraMana = 75;
        document.getElementById('val-vida-player').innerText = `${40 + (sorteBase * 5)} / ${40 + (sorteBase * 5)}`;
        document.getElementById('val-mana').innerText = `${25 + extraMana} / ${25 + extraMana}`;
    } else {
        document.getElementById('val-mana').innerText = `25 / 25`;
    }

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

// ------ SISTEMA DE MAGIAS INFINITAS ------
window.renderSpells = function() {
    const container = document.getElementById('spells-container');
    container.innerHTML = '';
    playerSpells.forEach((spell, index) => {
        let row = document.createElement('div');
        row.className = 'spell-item';
        row.innerHTML = `
            <div class="inv-row">
                <input type="text" class="inv-input" style="flex: 2; font-weight: bold; color: var(--accent-gold);" placeholder="Nome da Habilidade" value="${spell.nome}" onchange="updateSpell(${index}, 'nome', this.value)">
                <input type="text" class="inv-input" style="flex: 1;" placeholder="Custo" value="${spell.custo}" onchange="updateSpell(${index}, 'custo', this.value)">
                <input type="text" class="inv-input" style="flex: 1;" placeholder="Alcance" value="${spell.alcance}" onchange="updateSpell(${index}, 'alcance', this.value)">
                <button class="btn-danger" onclick="removeSpell(${index})">X</button>
            </div>
            <div class="inv-row" style="margin-top: 5px;">
                <textarea class="inv-input" style="flex: 1; resize: vertical;" rows="1" placeholder="Descrição e Efeitos..." onchange="updateSpell(${index}, 'desc', this.value)">${spell.desc}</textarea>
            </div>
        `;
        container.appendChild(row);
    });
}

window.addSpell = function() {
    playerSpells.push({ nome: "", desc: "", custo: "", alcance: "" });
    window.renderSpells();
    window.saveData();
}

window.updateSpell = function(index, field, value) {
    playerSpells[index][field] = value;
    window.saveData(); // Auto salva em tempo real igual o inv
}

window.removeSpell = function(index) {
    if(confirm("Remover esta magia do seu grimório?")) {
        playerSpells.splice(index, 1);
        window.renderSpells();
        window.saveData();
    }
}

window.renderInventory = function() {
    const container = document.getElementById('inventory-container');
    container.innerHTML = '';
    playerInventory.forEach((item, index) => {
        let row = document.createElement('div');
        row.className = 'inv-item';
        row.innerHTML = `
            <div class="inv-row">
                <input type="text" class="inv-input" style="flex: 2;" placeholder="Item" value="${item.nome}" onchange="updateInv(${index}, 'nome', this.value)">
                <input type="number" class="inv-input" style="flex: 1;" placeholder="Peso" value="${item.peso}" onchange="updateInv(${index}, 'peso', this.value)">
                <input type="number" class="inv-input" style="flex: 1;" placeholder="Qtd" value="${item.qtd}" onchange="updateInv(${index}, 'qtd', this.value)">
                <button class="btn-danger" onclick="removeInv(${index})">X</button>
            </div>
            <div class="inv-row" style="margin-top: 5px;">
                <input type="text" class="inv-input" style="flex: 1;" placeholder="Descrição..." value="${item.desc}" onchange="updateInv(${index}, 'desc', this.value)">
            </div>
        `;
        container.appendChild(row);
    });
    window.calcVitals();
}

window.addInventoryItem = function() {
    if(isOverweight) {
        alert("Mochila cheia! Você está muito pesado para carregar novos itens.");
        return;
    }
    playerInventory.push({ nome: "", desc: "", peso: 0, qtd: 1 });
    window.renderInventory();
    window.saveData();
}

window.updateInv = function(index, field, value) {
    playerInventory[index][field] = value;
    window.renderInventory(); 
    window.saveData();
}

window.removeInv = function(index) {
    playerInventory.splice(index, 1);
    window.renderInventory();
    window.saveData();
}

window.saveData = async function() {
    if (!currentCharId) return; 
    let isMonster = document.getElementById('char-category')?.value === 'Monstros';

    const sheetData = {
        name: document.getElementById('char-name')?.value || "Sem Nome",
        color: document.getElementById('char-color')?.value || "#d4af37",
        category: document.getElementById('char-category')?.value || "Jogadores",
        age: document.getElementById('char-age')?.value || "",
        race: isMonster ? document.getElementById('char-race-monster').value : document.getElementById('char-race-player').value,
        classe: document.getElementById('char-class')?.value || "Plebeu",
        prof: document.getElementById('char-prof')?.value || "",
        profDesc: document.getElementById('char-prof-desc')?.value || "",
        vidaMonster: document.getElementById('val-vida-monster')?.value || 100,
        forca: document.getElementById('attr-forca')?.value || 1,
        magia: document.getElementById('attr-magia')?.value || 1,
        agilidade: document.getElementById('attr-agilidade')?.value || 1,
        sorte: document.getElementById('attr-sorte')?.value || 1,
        grimoire: document.getElementById('grimoire-name')?.value || "",
        mana: document.getElementById('mana-zone')?.value || "",
        skills: playerSkills,
        inventory: playerInventory,
        spells: playerSpells, // SALVANDO A LISTA NOVA
        photo: currentPhoto 
    };

    characters[currentCharId] = sheetData;
    
    if (OBR.isAvailable) {
        await OBR.room.setMetadata({ [`fatesheet_char_${currentCharId}`]: sheetData });
    }
}

window.renderSkills = function() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    skillsData.forEach(skill => {
        if (playerSkills[skill.name] === undefined) playerSkills[skill.name] = 0;
        let controls = `
            <button class="btn-ctrl" onclick="updateSkill('${skill.name}', -1, event)">-</button>
            <span style="width: 20px; text-align: center;">${playerSkills[skill.name]}</span>
            <button class="btn-ctrl" onclick="updateSkill('${skill.name}', 1, event)">+</button>
        `;

        let div = document.createElement('div');
        div.className = 'skill-item';
        div.innerHTML = `
            <div onclick="rollSkill('${skill.name}', '${skill.attr}')" style="flex:1;">
                <strong>${skill.name}</strong> <span style="font-size: 10px; color: var(--text-muted);">(${skill.attr})</span>
            </div>
            <div class="skill-controls">${controls}</div>
        `;
        container.appendChild(div);
    });
}

window.updateSkill = function(skillName, change, event) {
    event.stopPropagation(); 
    playerSkills[skillName] += change;
    if (playerSkills[skillName] < 0) playerSkills[skillName] = 0;
    window.renderSkills();
    window.saveData();
}

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
    
    const rollData = {
        c: charName,
        s: skillName,
        a: attrName,
        r: results.join(','),
        pen: isOverweight ? "true" : "false",
        color: charColor,
        mod: skillMod 
    };

    window.abrirModalCentral(rollData);
    if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", rollData);
}

window.abrirModalCentral = function(data) {
    if (OBR.isAvailable) {
        const dataUrl = encodeURIComponent(JSON.stringify(data));
        OBR.modal.open({
            id: "fate-roll-modal",
            url: `https://seediam.github.io/FateSheet/resultado.html?data=${dataUrl}`, 
            width: 450, 
            height: 250
        });
    }
}

window.setPhotoPreview = function(base64Str) {
    const preview = document.getElementById('photo-preview');
    const text = document.getElementById('photo-text');
    if(!preview) return;
    if (base64Str) {
        preview.style.backgroundImage = `url("${base64Str}")`; preview.style.border = 'none'; text.style.display = 'none';
    } else {
        preview.style.backgroundImage = 'none'; preview.style.border = '1px dashed var(--accent-gold)'; text.style.display = 'block';
    }
}

document.getElementById('photo-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentPhoto = event.target.result;
            window.setPhotoPreview(currentPhoto);
            window.saveData();
        };
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
            } else {
                characters[id] = metadata[key];
                mudouAlgo = true;
            }
        }
    }
    if (mudouAlgo) window.renderCharacterList();
}

function initExtension() {
    if (OBR.isAvailable) {
        OBR.onReady(async () => {
            try {
                const meta = await OBR.room.getMetadata();
                processRoomData(meta);
                
                OBR.room.onMetadataChange((metadata) => processRoomData(metadata));
                
                OBR.broadcast.onMessage("fatesheet-rolls", (event) => {
                    window.abrirModalCentral(event.data);
                });
            } catch(e) {}
        });
    } else {
        window.renderCharacterList(); 
    }
}
