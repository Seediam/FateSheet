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
    const targetTab = document.getElementById(tabName);
    if(targetTab) targetTab.classList.add('active');
    if(event) event.currentTarget.classList.add('active');
}

// CORREÇÃO DO BUG DE SALVAMENTO: Agora ele espera salvar antes de fechar!
window.backToList = function() {
    window.saveData().then(() => {
        document.getElementById('screen-sheet').classList.remove('active');
        document.getElementById('screen-list').classList.add('active');
        window.renderCharacterList(); // Força a tela a desenhar os personagens salvos
    });
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
        categories[cat].push({ id: id, name: char.name || "Sem Nome", owner: char.ownerName || "?" });
    }

    let hasAny = false;
    for (let cat in categories) {
        if (categories[cat].length > 0) {
            hasAny = true;
            let html = `<div class="folder-title">📁 ${cat}</div><div class="char-list">`;
            categories[cat].forEach(char => {
                html += `<div class="char-list-item" onclick="openCharacter('${char.id}')">
                            <span>${char.name}</span>
                            <span style="font-size: 10px; color: #666; font-weight: normal;">por ${char.owner}</span>
                         </div>`;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
    }

    if(!hasAny) {
        container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">Nenhum personagem na mesa ainda.</div>';
    }
}

window.saveDataLocalOnly = function() {
    try { localStorage.setItem('fate_system_chars_v10', JSON.stringify(characters)); } catch(e){}
}

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", category: "Jogadores", skills: {}, photo: "" };
    window.saveDataLocalOnly();
    window.openCharacter(newId);
}

window.deleteCharacter = function() {
    if(confirm("Deseja mesmo apagar esta ficha da mesa?")) {
        delete characters[currentCharId];
        window.saveDataLocalOnly();
        
        if (typeof OBR !== 'undefined' && OBR.isReady) {
            OBR.room.setMetadata({ [`fate_char_${currentCharId}`]: undefined }).catch(e => console.log(e));
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

window.saveData = async function() {
    if (!currentCharId) return; 

    let playerName = "Mesa";
    if (typeof OBR !== 'undefined' && OBR.isReady) playerName = await OBR.player.getName();

    const sheetData = {
        name: document.getElementById('char-name')?.value || "Sem Nome",
        category: document.getElementById('char-category')?.value || "Jogadores",
        ownerName: playerName,
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
            await OBR.room.setMetadata({ [`fate_char_${currentCharId}`]: sheetData });
        } catch(e) {}
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

// NOVA FUNÇÃO DE ROLAGEM: Usa o Modal no centro da tela!
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
        OBR.broadcast.sendMessage("fate-system-rolls", rollData);
    }
}

function abrirModalCentral(data) {
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        // Envia os dados pelo link do HTML
        const dataUrl = encodeURIComponent(JSON.stringify(data));
        OBR.modal.open({
            id: "fate-roll-modal",
            url: `/FateSheet/resultado.html?data=${dataUrl}`, // <-- ATENÇÃO AQUI!
            width: 400,
            height: 200
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
            window.saveData();
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener('input', () => { if(currentCharId) window.saveData(); });

function processRoomData(metadata) {
    let mudouAlgo = false;
    for (let key in metadata) {
        if (key.startsWith('fate_char_')) {
            const id = key.replace('fate_char_', '');
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
    try {
        const saved = localStorage.getItem('fate_system_chars_v10');
        if (saved) characters = JSON.parse(saved);
    } catch(e) {}

    window.renderCharacterList();

    if (typeof OBR !== 'undefined') {
        OBR.onReady(async () => {
            try {
                const initialMeta = await OBR.room.getMetadata();
                processRoomData(initialMeta);

                OBR.room.onMetadataChange((metadata) => processRoomData(metadata));
                
                // Abre o modal quando outra pessoa jogar
                OBR.broadcast.onMessage("fate-system-rolls", (event) => {
                    abrirModalCentral(event.data);
                });
            } catch(e) {}
        });
    }
}
