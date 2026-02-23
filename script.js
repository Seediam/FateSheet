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
let toastTimer = null;

// Expondo as funções globalmente para o HTML enxergar
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

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", category: "Jogadores", skills: {}, photo: "" };
    window.openCharacter(newId);
}

window.deleteCharacter = function() {
    if(confirm("Deseja mesmo apagar esta ficha da mesa? Todos perderão o acesso a ela.")) {
        delete characters[currentCharId];
        if (typeof OBR !== 'undefined' && OBR.isReady) {
            OBR.room.setMetadata({ [`fate_char_${currentCharId}`]: undefined });
        }
        window.backToList();
        window.renderCharacterList();
    }
}

window.openCharacter = function(id) {
    currentCharId = id;
    const charData = characters[id] || {};
    
    document.getElementById('char-name').value = charData.name || '';
    document.getElementById('char-category').value = charData.category || 'Jogadores';
    document.getElementById('char-age').value = charData.age || '';
    document.getElementById('char-race').value = charData.race || 'Humano';
    document.getElementById('attr-forca').value = charData.forca || 1;
    document.getElementById('attr-magia').value = charData.magia || 1;
    document.getElementById('attr-agilidade').value = charData.agilidade || 1;
    document.getElementById('attr-sorte').value = charData.sorte || 1;
    document.getElementById('grimoire-name').value = charData.grimoire || '';
    document.getElementById('mana-zone').value = charData.mana || '';
    document.getElementById('hab-1').value = charData.hab1 || '';
    document.getElementById('hab-2').value = charData.hab2 || '';
    document.getElementById('hab-3').value = charData.hab3 || '';
    document.getElementById('hab-4').value = charData.hab4 || '';
    
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
        name: document.getElementById('char-name').value,
        category: document.getElementById('char-category').value,
        ownerName: playerName,
        age: document.getElementById('char-age').value,
        race: document.getElementById('char-race').value,
        forca: document.getElementById('attr-forca').value,
        magia: document.getElementById('attr-magia').value,
        agilidade: document.getElementById('attr-agilidade').value,
        sorte: document.getElementById('attr-sorte').value,
        grimoire: document.getElementById('grimoire-name').value,
        mana: document.getElementById('mana-zone').value,
        hab1: document.getElementById('hab-1').value,
        hab2: document.getElementById('hab-2').value,
        hab3: document.getElementById('hab-3').value,
        hab4: document.getElementById('hab-4').value,
        skills: playerSkills,
        photo: "" 
    };

    characters[currentCharId] = sheetData;
    
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        await OBR.room.setMetadata({ [`fate_char_${currentCharId}`]: sheetData });
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

window.showCenterToast = function(msg) {
    const toast = document.getElementById("toast");
    if(!toast) return;
    toast.innerText = msg;
    toast.classList.add("show");
    
    if(toastTimer) clearTimeout(toastTimer);
    toast.onclick = () => toast.classList.remove("show");
    toastTimer = setTimeout(() => { toast.classList.remove("show"); }, 4500);
}

window.rollSkill = function(skillName, attrName) {
    const attrInputId = `attr-${attrName.toLowerCase()}`;
    let diceCount = parseInt(document.getElementById(attrInputId).value) || 1;
    if(diceCount < 1) diceCount = 1;

    let results = [];
    for (let i = 0; i < diceCount; i++) {
        results.push(Math.floor(Math.random() * 20) + 1);
    }

    const charName = document.getElementById('char-name').value || 'Desconhecido';
    const message = `🎲 ${charName}\n rolou ${skillName} (${attrName})\n [ ${results.join(' | ')} ]`;
    
    window.showCenterToast(message);

    if (typeof OBR !== 'undefined' && OBR.isReady) {
        OBR.broadcast.sendMessage("fate-system-rolls", message);
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

document.addEventListener('input', window.saveData);

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

if (typeof OBR !== 'undefined') {
    OBR.onReady(async () => {
        try {
            const initialMeta = await OBR.room.getMetadata();
            processRoomData(initialMeta);
            window.renderCharacterList();

            OBR.room.onMetadataChange((metadata) => {
                processRoomData(metadata);
            });
            
            OBR.broadcast.onMessage("fate-system-rolls", (event) => {
                window.showCenterToast(event.data);
            });
        } catch(e) {
            console.error("Erro ao iniciar a extensão do Owlbear: ", e);
        }
    });
} else {
    // Para rodar localmente caso o OBR não carregue
    window.renderCharacterList();
}
