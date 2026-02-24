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
let currentPhoto = "";
let folderState = { "Jogadores": true, "NPCs": true, "Monstros": true }; 

window.onload = function() {
    const loading = document.getElementById('loading');
    const app = document.getElementById('app');
    if(loading && app) {
        loading.style.display = 'none';
        app.style.display = 'block';
    }
    initExtension();
};

window.openTab = function(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    if(event) event.currentTarget.classList.add('active');
}

window.backToList = function() {
    window.saveData().then(() => {
        document.getElementById('screen-sheet').classList.remove('active');
        document.getElementById('screen-list').classList.add('active');
        window.renderCharacterList();
    });
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
            let arrow = isOpen ? '▼' : '►';
            let displayStyle = isOpen ? 'flex' : 'none';

            let html = `
                <div class="folder-header" onclick="toggleFolder('${cat}')">
                    <span class="chevron">${arrow}</span> 📁 ${cat}
                </div>
                <div class="folder-content" style="display: ${displayStyle};">
            `;
            
            categories[cat].forEach(char => {
                html += `<div class="char-list-item" onclick="openCharacter('${char.id}')">
                            <span>${char.name}</span>
                         </div>`;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
    }

    if(!hasAny) {
        container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">A Mesa Global está vazia. Crie um personagem!</div>';
    }
}

window.saveDataLocalOnly = function() {
    try { localStorage.setItem('fate_system_chars_v12', JSON.stringify(characters)); } catch(e){}
}

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", category: "Jogadores", skills: {}, photo: "" };
    window.saveDataLocalOnly();
    
    // Já cria na mesa global na hora
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        OBR.room.setMetadata({ "fatesheet/characters": characters });
    }
    
    window.openCharacter(newId);
}

window.deleteCharacter = function() {
    if(confirm("Deseja APAGAR ESTA FICHA DO SERVIDOR? Ela sumirá para todos.")) {
        delete characters[currentCharId];
        window.saveDataLocalOnly();
        
        if (typeof OBR !== 'undefined' && OBR.isReady) {
            OBR.room.setMetadata({ "fatesheet/characters": characters }).catch(e => console.log(e));
        }
        
        document.getElementById('screen-sheet').classList.remove('active');
        document.getElementById('screen-list').classList.add('active');
        window.renderCharacterList();
    }
}

function safeSetVal(id, value) {
    const el = document.getElementById(id);
    if(el) el.value = value;
}

window.openCharacter = function(id) {
    currentCharId = id;
    const charData = characters[id] || {};
    
    safeSetVal('char-name', charData.name || '');
    safeSetVal('char-category', charData.category || 'Jogadores');
    safeSetVal('char-age', charData.age || '');
    safeSetVal('char-race', charData.race || 'Humano');
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
    currentPhoto = charData.photo || '';
    
    window.setPhotoPreview(currentPhoto);
    window.renderSkills();

    document.getElementById('screen-list').classList.remove('active');
    document.getElementById('screen-sheet').classList.add('active');
}

// ------ NOVO SISTEMA DE NUVEM: A Chave "fatesheet/characters" ------
window.saveData = async function() {
    if (!currentCharId) return; 

    const sheetData = {
        name: document.getElementById('char-name')?.value || "Sem Nome",
        category: document.getElementById('char-category')?.value || "Jogadores",
        age: document.getElementById('char-age')?.value || "",
        race: document.getElementById('char-race')?.value || "",
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
        photo: "" 
    };

    characters[currentCharId] = sheetData;
    window.saveDataLocalOnly();
    
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        try {
            // Salva TODOS os personagens juntos em uma única chave blindada
            await OBR.room.setMetadata({ "fatesheet/characters": characters });
        } catch(e) { console.log("Aviso: GM precisa permitir salvar na mesa.", e); }
    }
}

window.renderSkills = function() {
    const container = document.getElementById('skills-container');
    if(!container) return;
    container.innerHTML = '';

    skillsData.forEach(skill => {
        if (playerSkills[skill.name] === undefined) playerSkills[skill.name] = 0;
        const div = document.createElement('div');
        div.className = 'skill-item';
        div.innerHTML = `
            <div onclick="rollSkill('${skill.name}', '${skill.attr}')" style="flex:1;">
                <strong>${skill.name}</strong> <span style="font-size: 10px; color: var(--text-muted);">(${skill.attr})</span>
            </div>
            <div class="skill-controls">
                <button class="btn-ctrl" onclick="updateSkill('${skill.name}', -1, event)">-</button>
                <span style="width: 20px; text-align: center;">${playerSkills[skill.name]}</span>
                <button class="btn-ctrl" onclick="updateSkill('${skill.name}', 1, event)">+</button>
            </div>
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

// ------ ABERTURA DO MODAL (LINK ABSOLUTO DO GITHUB) ------
window.rollSkill = function(skillName, attrName) {
    const attrInputId = `attr-${attrName.toLowerCase()}`;
    const el = document.getElementById(attrInputId);
    let diceCount = el ? parseInt(el.value) : 1;
    if(isNaN(diceCount) || diceCount < 1) diceCount = 1;

    let results = [];
    for (let i = 0; i < diceCount; i++) {
        results.push(Math.floor(Math.random() * 20) + 1);
    }

    const charEl = document.getElementById('char-name');
    const charName = (charEl && charEl.value !== '') ? charEl.value : 'Desconhecido';
    
    const rollData = {
        charName: charName,
        skillName: skillName,
        attrName: attrName,
        results: results
    };

    abrirModalCentral(rollData);

    if (typeof OBR !== 'undefined' && OBR.isReady) {
        OBR.broadcast.sendMessage("fatesheet-rolls", rollData);
    }
}

function abrirModalCentral(data) {
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        const dataUrl = encodeURIComponent(JSON.stringify(data));
        // Link cravado no seu repositório para o Owlbear não se perder
        const modalURL = `https://seediam.github.io/FateSheet/resultado.html?data=${dataUrl}`;
        
        OBR.modal.open({
            id: "fate-roll-modal",
            url: modalURL,
            width: 400,
            height: 250
        });
    }
}

window.setPhotoPreview = function(base64Str) {
    const preview = document.getElementById('photo-preview');
    const text = document.getElementById('photo-text');
    if(!preview || !text) return;

    if (base64Str) {
        preview.style.backgroundImage = `url("${base64Str}")`;
        preview.style.border = 'none';
        text.style.display = 'none';
    } else {
        preview.style.backgroundImage = 'none';
        preview.style.border = '1px dashed var(--accent-gold)';
        text.style.display = 'block';
    }
}

document.getElementById('photo-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentPhoto = event.target.result;
            window.setPhotoPreview(currentPhoto);
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener('input', () => { if(currentCharId) window.saveData(); });

function processRoomData(metadata) {
    // Escuta apenas a nossa chave blindada
    if (metadata["fatesheet/characters"]) {
        characters = metadata["fatesheet/characters"];
        window.renderCharacterList();
    }
}

function initExtension() {
    try {
        const saved = localStorage.getItem('fate_system_chars_v12');
        if (saved) characters = JSON.parse(saved);
    } catch(e) {}

    window.renderCharacterList();

    if (typeof OBR !== 'undefined') {
        OBR.onReady(async () => {
            try {
                const
