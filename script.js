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
let currentPhoto = "";
let folderState = { "Jogadores": true, "NPCs": true, "Monstros": true };
let isOverweight = false;
let modalTimer = null;

// Expor tudo no window porque é type="module"
window.openTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const target = document.getElementById(tabName);
    if(target) target.classList.add('active');
    event.currentTarget.classList.add('active');
}

window.backToList = function() {
    window.saveData();
    document.getElementById('screen-sheet').classList.remove('active');
    document.getElementById('screen-list').classList.add('active');
    window.renderCharacterList();
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
        categories[cat].push({ ...char, id: id });
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
                let badge = char.isMine ? '' : `<span style="font-size:9px; color:#888;">(Global)</span>`;
                html += `<div class="char-list-item" onclick="openCharacter('${char.id}')"><span>${char.name} ${badge}</span></div>`;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
    }

    if(!hasAny) container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">Nenhuma ficha criada.</div>';
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
            characters[newId] = importedData;
            window.saveDataLocalOnly();
            window.syncToOwlbear();
            window.renderCharacterList();
            alert("Ficha importada com sucesso!");
        } catch(err) { alert("Erro ao ler o arquivo JSON."); }
    };
    reader.readAsText(file);
}

window.saveDataLocalOnly = function() {
    try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}
}

window.syncToOwlbear = async function() {
    if (OBR.isAvailable) {
        // Envia tudão pra mesa
        await OBR.room.setMetadata({ "fatesheet_chars": characters });
    }
}

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", category: "Jogadores", classe: "Plebeu", skills: {}, inventory: [], photo: "" };
    window.saveDataLocalOnly();
    window.syncToOwlbear();
    window.openCharacter(newId);
}

window.deleteCharacter = async function() {
    if(confirm("Apagar esta ficha permanentemente?")) {
        delete characters[currentCharId];
        window.saveDataLocalOnly();
        await window.syncToOwlbear();
        window.backToList();
    }
}

function safeSetVal(id, value) {
    const el = document.getElementById(id);
    if(el) el.value = value;
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
    currentIsMine = true;
    
    safeSetVal('char-name', charData.name || '');
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
    safeSetVal('hab-1', charData.hab1 || '');
    safeSetVal('hab-2', charData.hab2 || '');
    safeSetVal('hab-3', charData.hab3 || '');
    safeSetVal('hab-4', charData.hab4 || '');
    
    playerSkills = charData.skills || {};
    playerInventory = charData.inventory || [];
    currentPhoto = charData.photo || '';
    
    window.updateCategoryUI();
    window.setPhotoPreview(currentPhoto);
    window.renderSkills();
    window.renderInventory();
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
        if(classe === 'Andarilho') extraMana = 50;
        if(classe === 'Estrangeiro') extraMana = 100;
        if(classe === 'Nobre') extraMana = 150;

        document.getElementById('val-vida-player').innerText = `${100 + (sorteBase * 50)} / ${100 + (sorteBase * 50)}`;
        document.getElementById('val-mana').innerText = `${50 + extraMana} / ${50 + extraMana}`;
    } else {
        document.getElementById('val-mana').innerText = `50 / 50`;
    }

    let maxWeight = forcaBase * 5;
    let currentWeight = playerInventory.reduce((acc, item) => acc + ((parseFloat(item.peso)||0) * (parseInt(item.qtd)||1)), 0);
    
    let pesoEl = document.getElementById('val-peso');
    let boxPeso = document.getElementById('box-peso');
    let avisoPeso = document.getElementById('peso-aviso');
    
    pesoEl.innerText = `${currentWeight.toFixed(1)} / ${maxWeight}`;
    
    if (currentWeight > maxWeight) {
        isOverweight = true;
        boxPeso.classList.add('overweight');
        avisoPeso.style.display = 'block';
    } else {
        isOverweight = false;
        boxPeso.classList.remove('overweight');
        avisoPeso.style.display = 'none';
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
                <input type="text" class="inv-input" style="flex: 1;" placeholder="Descrição do item..." value="${item.desc}" onchange="updateInv(${index}, 'desc', this.value)">
            </div>
        `;
        container.appendChild(row);
    });
    window.calcVitals();
}

window.addInventoryItem = function() {
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
        hab1: document.getElementById('hab-1')?.value || "",
        hab2: document.getElementById('hab-2')?.value || "",
        hab3: document.getElementById('hab-3')?.value || "",
        hab4: document.getElementById('hab-4')?.value || "",
        skills: playerSkills,
        inventory: playerInventory,
        photo: currentPhoto 
    };

    characters[currentCharId] = sheetData;
    window.saveDataLocalOnly();
    window.syncToOwlbear();
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
    let baseAttr = parseInt(document.getElementById(`attr-${attrName.toLowerCase()}`).value) || 1;
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
    let teveCritico = false;
    for (let i = 0; i < baseAttr; i++) {
        let die = Math.floor(Math.random() * 20) + 1;
        if (isOverweight && (attrName === 'Força' || attrName === 'Agilidade')) die -= 5;
        if (die >= 20) teveCritico = true;
        results.push(die);
    }

    const charName = document.getElementById('char-name').value || 'Desconhecido';
    
    const rollData = {
        c: charName,
        s: skillName,
        a: attrName,
        r: results.join(','),
        pen: isOverweight && (attrName === 'Força' || attrName === 'Agilidade') ? "true" : "false",
        crit: teveCritico
    };

    window.mostrarRolagem(rollData);
    if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", rollData);
}

// ------ A ROLAGEM DENTRO DA PRÓPRIA EXTENSÃO ------
window.mostrarRolagem = function(data) {
    const modal = document.getElementById('overlay-modal');
    const box = document.getElementById('modal-content-box');
    
    document.getElementById('modal-name').innerText = data.c;
    document.getElementById('modal-action').innerHTML = `ROLOU <b>${data.s}</b> <span style="font-size:11px;">(${data.a})</span>`;
    
    let resArray = data.r.split(',');
    let formattedResults = resArray.map(v => {
        let num = parseInt(v);
        if (num >= 20) return `<span style="color:#ffd700;">${v}</span>`;
        if (num <= 4) return `<span style="color:#ff4444;">${v}</span>`;
        return v;
    }).join(' <span style="color:#666;">|</span> ');

    document.getElementById('modal-roll').innerHTML = `[ ${formattedResults} ]`;
    document.getElementById('modal-pen').style.display = data.pen === "true" ? "block" : "none";

    modal.style.display = 'flex';
    
    if (data.crit) {
        box.classList.add('crit-anim');
    } else {
        box.classList.remove('crit-anim');
    }

    if(modalTimer) clearTimeout(modalTimer);
    modalTimer = setTimeout(() => { window.closeModal(); }, 5000);
}

window.closeModal = function() {
    document.getElementById('overlay-modal').style.display = 'none';
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

// Inicialização com OBR Local + Módulo ESM
window.onload = function() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    try {
        const saved = localStorage.getItem('fatesheet_db');
        if (saved) characters = JSON.parse(saved);
        window.renderCharacterList();
    } catch(e) {}

    if (OBR.isAvailable) {
        OBR.onReady(async () => {
            try {
                // Recupera a lista global real do servidor
                let meta = await OBR.room.getMetadata();
                if(meta && meta["fatesheet_chars"]) {
                    characters = meta["fatesheet_chars"];
                }
                window.renderCharacterList();
                
                OBR.room.onMetadataChange((metadata) => {
                    if (metadata["fatesheet_chars"]) {
                        characters = metadata["fatesheet_chars"];
                        window.renderCharacterList();
                        // Se a ficha aberta for apagada por outro
                        if(currentCharId && !characters[currentCharId]) window.backToList();
                    }
                });
                
                OBR.broadcast.onMessage("fatesheet-rolls", (event) => {
                    window.mostrarRolagem(event.data);
                });
            } catch(e) {}
        });
    }
};
