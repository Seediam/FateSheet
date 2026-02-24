const skillsData = [
    { name: "Arcanismo", attr: "Magia" }, { name: "História", attr: "Magia" }, { name: "Natureza", attr: "Magia" }, { name: "Religião", attr: "Magia" },
    { name: "Intuição", attr: "Sorte" }, { name: "Medicina", attr: "Sorte" }, { name: "Percepção", attr: "Sorte" }, { name: "Sobrevivência", attr: "Sorte" },
    { name: "Atletismo", attr: "Força" }, { name: "Intimidação", attr: "Força" },
    { name: "Acrobacia", attr: "Agilidade" }, { name: "Furtividade", attr: "Agilidade" }, { name: "Prestidigitação", attr: "Agilidade" },
    { name: "Atuação", attr: "Sorte" }, { name: "Enganação", attr: "Sorte" }, { name: "Persuasão", attr: "Sorte" }
];

let myLocalCharacters = {}; 
let allTableCharacters = []; 
let currentCharId = null;
let currentIsMine = true; 
let playerSkills = {}; 
let playerInventory = [];
let currentPhoto = "";
let folderState = { "Jogadores": true, "NPCs": true, "Monstros": true };
let isOverweight = false;

window.onload = function() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    initExtension();
};

window.openTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

window.backToList = function() {
    if(currentIsMine) window.saveData();
    document.getElementById('screen-sheet').classList.remove('active');
    document.getElementById('screen-list').classList.add('active');
    window.buildGlobalList();
}

window.toggleFolder = function(folderName) {
    folderState[folderName] = !folderState[folderName];
    window.renderCharacterList();
}

window.buildGlobalList = async function() {
    allTableCharacters = [];
    for (let id in myLocalCharacters) {
        allTableCharacters.push({ ...myLocalCharacters[id], id: id, isMine: true, owner: "Local" });
    }
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        try {
            const players = await OBR.party.getPlayers();
            players.forEach(p => {
                let pChars = p.metadata["fatesheet_chars"];
                if (pChars) {
                    for (let id in pChars) {
                        allTableCharacters.push({ ...pChars[id], id: id, isMine: false, owner: p.name });
                    }
                }
            });
        } catch(e) {}
    }
    window.renderCharacterList();
}

window.renderCharacterList = function() {
    const container = document.getElementById('character-folders');
    container.innerHTML = '';
    const categories = { "Jogadores": [], "NPCs": [], "Monstros": [] };

    allTableCharacters.forEach(char => {
        let cat = char.category || "Jogadores";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(char);
    });

    for (let cat in categories) {
        if (categories[cat].length > 0) {
            let isOpen = folderState[cat];
            let html = `
                <div class="folder-header" onclick="toggleFolder('${cat}')">
                    <span class="chevron">${isOpen ? '▼' : '►'}</span> 📁 ${cat}
                </div>
                <div class="folder-content" style="display: ${isOpen ? 'flex' : 'none'};">
            `;
            categories[cat].forEach(char => {
                let badge = char.isMine ? '' : `<span style="font-size:9px; color:#888;">(${char.owner})</span>`;
                html += `<div class="char-list-item" onclick="openCharacter('${char.id}')"><span>${char.name} ${badge}</span></div>`;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
    }
}

// ------ IMPORTAR E EXPORTAR ------
window.exportCharacter = function() {
    if(!currentIsMine) return alert("Você só pode exportar suas próprias fichas.");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(myLocalCharacters[currentCharId]));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", (myLocalCharacters[currentCharId].name || "Ficha") + "_Fate.json");
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
            myLocalCharacters[newId] = importedData;
            window.saveDataLocalOnly();
            window.buildGlobalList();
            alert("Ficha importada com sucesso!");
        } catch(err) { alert("Erro ao ler o arquivo JSON."); }
    };
    reader.readAsText(file);
}

window.saveDataLocalOnly = function() {
    try { localStorage.setItem('fatesheet_db', JSON.stringify(myLocalCharacters)); } catch(e){}
}

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    myLocalCharacters[newId] = { name: "Novo Personagem", category: "Jogadores", classe: "Plebeu", skills: {}, inventory: [], photo: "" };
    window.saveDataLocalOnly();
    window.buildGlobalList();
    window.openCharacter(newId);
}

window.deleteCharacter = function() {
    if(!currentIsMine) return alert("Você só pode apagar as fichas que você criou no seu PC!");
    if(confirm("Apagar esta ficha permanentemente?")) {
        delete myLocalCharacters[currentCharId];
        window.saveDataLocalOnly();
        if (typeof OBR !== 'undefined' && OBR.isReady) {
            OBR.player.setMetadata({ "fatesheet_chars": myLocalCharacters });
        }
        window.backToList();
    }
}

function safeSetVal(id, value) {
    const el = document.getElementById(id);
    if(el) el.value = value;
}

window.openCharacter = function(id) {
    currentCharId = id;
    const charData = allTableCharacters.find(c => c.id === id) || {};
    currentIsMine = charData.isMine !== false;
    
    safeSetVal('char-name', charData.name || '');
    safeSetVal('char-category', charData.category || 'Jogadores');
    safeSetVal('char-age', charData.age || '');
    safeSetVal('char-race', charData.race || 'Humano');
    safeSetVal('char-class', charData.classe || 'Plebeu');
    safeSetVal('char-prof', charData.prof || '');
    safeSetVal('char-prof-desc', charData.profDesc || '');
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
    
    window.setPhotoPreview(currentPhoto);
    window.renderSkills();
    window.renderInventory();
    window.calcVitals();

    const inputs = document.querySelectorAll('#screen-sheet input, #screen-sheet select, #screen-sheet textarea');
    inputs.forEach(input => { if(input.id !== 'import-file') input.disabled = !currentIsMine; });

    document.getElementById('screen-list').classList.remove('active');
    document.getElementById('screen-sheet').classList.add('active');
}

// ------ CÁLCULO DE STATUS, CLASSE E MOCHILA ------
window.calcVitals = function() {
    let forcaBase = parseInt(document.getElementById('attr-forca').value) || 0;
    let sorteBase = parseInt(document.getElementById('attr-sorte').value) || 0;
    let classe = document.getElementById('char-class').value;

    let extraMana = 0;
    if(classe === 'Andarilho') extraMana = 50;
    if(classe === 'Estrangeiro') extraMana = 100;
    if(classe === 'Nobre') extraMana = 150;

    let maxMana = 50 + extraMana;
    let maxHealth = 100 + (sorteBase * 50);

    document.getElementById('val-vida').innerText = `${maxHealth} / ${maxHealth}`;
    document.getElementById('val-mana').innerText = `${maxMana} / ${maxMana}`;

    // Peso
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

    if(currentIsMine && currentCharId) window.saveData();
}

window.renderInventory = function() {
    const container = document.getElementById('inventory-container');
    container.innerHTML = '';
    
    playerInventory.forEach((item, index) => {
        let disabled = currentIsMine ? '' : 'disabled';
        let row = document.createElement('div');
        row.className = 'inv-item';
        row.innerHTML = `
            <div class="inv-row">
                <input type="text" class="inv-input" style="flex: 2;" placeholder="Item" value="${item.nome}" onchange="updateInv(${index}, 'nome', this.value)" ${disabled}>
                <input type="number" class="inv-input" style="flex: 1;" placeholder="Peso" value="${item.peso}" onchange="updateInv(${index}, 'peso', this.value)" ${disabled}>
                <input type="number" class="inv-input" style="flex: 1;" placeholder="Qtd" value="${item.qtd}" onchange="updateInv(${index}, 'qtd', this.value)" ${disabled}>
                ${currentIsMine ? `<button class="btn-danger" onclick="removeInv(${index})">X</button>` : ''}
            </div>
            <div class="inv-row" style="margin-top: 5px;">
                <input type="text" class="inv-input" style="flex: 1;" placeholder="Descrição do item..." value="${item.desc}" onchange="updateInv(${index}, 'desc', this.value)" ${disabled}>
            </div>
        `;
        container.appendChild(row);
    });
    window.calcVitals();
}

window.addInventoryItem = function() {
    if(!currentIsMine) return;
    playerInventory.push({ nome: "", desc: "", peso: 0, qtd: 1 });
    window.renderInventory();
}

window.updateInv = function(index, field, value) {
    if(!currentIsMine) return;
    playerInventory[index][field] = value;
    window.calcVitals(); // Auto-salva dentro do calc
}

window.removeInv = function(index) {
    if(!currentIsMine) return;
    playerInventory.splice(index, 1);
    window.renderInventory();
}

window.saveData = async function() {
    if (!currentCharId || !currentIsMine) return; 

    const sheetData = {
        name: document.getElementById('char-name')?.value || "Sem Nome",
        category: document.getElementById('char-category')?.value || "Jogadores",
        age: document.getElementById('char-age')?.value || "",
        race: document.getElementById('char-race')?.value || "",
        classe: document.getElementById('char-class')?.value || "Plebeu",
        prof: document.getElementById('char-prof')?.value || "",
        profDesc: document.getElementById('char-prof-desc')?.value || "",
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

    myLocalCharacters[currentCharId] = sheetData;
    window.saveDataLocalOnly();
    
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        let syncChars = {};
        for(let id in myLocalCharacters) {
            syncChars[id] = { ...myLocalCharacters[id] };
            delete syncChars[id].photo; // Protege a rede
        }
        await OBR.player.setMetadata({ "fatesheet_chars": syncChars });
    }
}

window.renderSkills = function() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    skillsData.forEach(skill => {
        if (playerSkills[skill.name] === undefined) playerSkills[skill.name] = 0;
        let controls = currentIsMine ? `
            <button class="btn-ctrl" onclick="updateSkill('${skill.name}', -1, event)">-</button>
            <span style="width: 20px; text-align: center;">${playerSkills[skill.name]}</span>
            <button class="btn-ctrl" onclick="updateSkill('${skill.name}', 1, event)">+</button>
        ` : `<span style="width: 40px; text-align: center; color: #d4af37;">${playerSkills[skill.name]}</span>`;

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
    if(!currentIsMine) return;
    playerSkills[skillName] += change;
    if (playerSkills[skillName] < 0) playerSkills[skillName] = 0;
    window.renderSkills();
    window.saveData();
}

// ------ A ROLAGEM COM MODIFICADORES ------
window.rollSkill = function(skillName, attrName) {
    let baseAttr = parseInt(document.getElementById(`attr-${attrName.toLowerCase()}`).value) || 1;
    let classe = document.getElementById('char-class').value;
    
    // Bônus de Classe nos dados
    if (classe === 'Plebeu') { if(attrName === 'Força') baseAttr += 1; if(attrName === 'Magia') baseAttr -= 1; }
    if (classe === 'Andarilho' && attrName === 'Agilidade') baseAttr += 1;
    if (classe === 'Estrangeiro' && attrName === 'Sorte') baseAttr += 1;
    if (classe === 'Nobre' && attrName === 'Magia') baseAttr += 1;
    
    if(baseAttr < 1) baseAttr = 1;

    let results = [];
    for (let i = 0; i < baseAttr; i++) {
        let die = Math.floor(Math.random() * 20) + 1;
        // Aplica a desvantagem da mochila nos resultados
        if (isOverweight && (attrName === 'Força' || attrName === 'Agilidade')) {
            die -= 5;
        }
        results.push(die);
    }

    const charName = document.getElementById('char-name').value || 'Desconhecido';
    
    const rollData = {
        c: charName,
        s: skillName,
        a: attrName,
        r: results.join(','),
        pen: isOverweight && (attrName === 'Força' || attrName === 'Agilidade') ? "true" : "false"
    };

    abrirModalCentral(rollData);
    if (typeof OBR !== 'undefined' && OBR.isReady) OBR.broadcast.sendMessage("fatesheet-rolls", rollData);
}

function abrirModalCentral(data) {
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        // DETECTOR AUTOMÁTICO DO SEU SITE (Nunca mais erra o link)
        const baseUrl = new URL('resultado.html', window.location.href).toString();
        const query = `?c=${encodeURIComponent(data.c)}&s=${encodeURIComponent(data.s)}&a=${encodeURIComponent(data.a)}&r=${encodeURIComponent(data.r)}&pen=${data.pen}`;
        
        OBR.modal.open({
            id: "fate-roll-modal",
            url: baseUrl + query,
            width: 450,
            height: 250
        });
    } else {
        alert(`${data.c} rolou ${data.s} (${data.a}): [ ${data.r} ]`);
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
    if(!currentIsMine) return;
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

document.addEventListener('input', () => { if(currentCharId && currentIsMine) window.saveData(); });

function initExtension() {
    try {
        const saved = localStorage.getItem('fatesheet_db');
        if (saved) myLocalCharacters = JSON.parse(saved);
    } catch(e) {}

    window.buildGlobalList();

    if (typeof OBR !== 'undefined') {
        OBR.onReady(async () => {
            try {
                let syncChars = {};
                for(let id in myLocalCharacters) {
                    syncChars[id] = { ...myLocalCharacters[id] };
                    delete syncChars[id].photo; 
                }
                await OBR.player.setMetadata({ "fatesheet_chars": syncChars });
                window.buildGlobalList();
                OBR.party.onChange(() => window.buildGlobalList());
                OBR.broadcast.onMessage("fatesheet-rolls", (event) => abrirModalCentral(event.data));
            } catch(e) {}
        });
    }
}
