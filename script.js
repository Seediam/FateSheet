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
let localPlayerName = "Jogador";

function openTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    if(event) event.currentTarget.classList.add('active');
}

function backToList() {
    saveData();
    document.getElementById('screen-sheet').classList.remove('active');
    document.getElementById('screen-list').classList.add('active');
    renderCharacterList();
}

function loadAllCharacters() {
    try {
        const saved = localStorage.getItem('fate_system_chars_v4');
        if (saved) characters = JSON.parse(saved);
    } catch(e) {}
    renderCharacterList();
}

function renderCharacterList() {
    const list = document.getElementById('character-list');
    list.innerHTML = '';
    for (let id in characters) {
        if(id === "temp_gm_view") continue; 
        let name = characters[id].name || "Desconhecido";
        list.innerHTML += `<div class="char-list-item" onclick="openCharacter('${id}')">${name}</div>`;
    }
}

function createNewCharacter() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", skills: {}, photo: "" };
    saveDataLocalOnly();
    openCharacter(newId);
}

function deleteCharacter() {
    if(confirm("Deseja mesmo apagar esta ficha?")) {
        delete characters[currentCharId];
        saveDataLocalOnly();
        syncWithOwlbear(); // Atualiza a rede para avisar o GM que sumiu
        backToList();
    }
}

function openCharacter(id) {
    currentCharId = id;
    const charData = characters[id] || {};
    
    document.getElementById('char-name').value = charData.name || '';
    document.getElementById('char-age').value = charData.age || '';
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
    setPhotoPreview(currentPhoto);
    renderSkills();

    document.getElementById('screen-list').classList.remove('active');
    document.getElementById('screen-sheet').classList.add('active');
}

// O SEGREDO ESTÁ AQUI: Salva na metadata do JOGADOR
async function syncWithOwlbear() {
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        let syncChars = {};
        for(let id in characters) {
            if(id !== "temp_gm_view") {
                syncChars[id] = { ...characters[id] };
                delete syncChars[id].photo; // Tira foto pra não travar o servidor
            }
        }
        await OBR.player.setMetadata({ "fatesystem/sheets": syncChars });
    }
}

function saveDataLocalOnly() {
    let temp = characters["temp_gm_view"];
    delete characters["temp_gm_view"];
    localStorage.setItem('fate_system_chars_v4', JSON.stringify(characters));
    if(temp) characters["temp_gm_view"] = temp;
}

function saveData() {
    if (!currentCharId || currentCharId === "temp_gm_view") return; 

    characters[currentCharId] = {
        name: document.getElementById('char-name').value,
        age: document.getElementById('char-age').value,
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
        photo: currentPhoto
    };

    saveDataLocalOnly();
    syncWithOwlbear(); // Envia para o GM
}

function renderSkills() {
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

function updateSkill(skillName, change, event) {
    event.stopPropagation(); 
    if (currentCharId === "temp_gm_view") return; 
    playerSkills[skillName] += change;
    if (playerSkills[skillName] < 0) playerSkills[skillName] = 0;
    renderSkills();
    saveData();
}

function showLocalToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.classList.add("show");
    toast.onclick = () => toast.classList.remove("show");
    setTimeout(() => { toast.classList.remove("show"); }, 4000);
}

function rollSkill(skillName, attrName) {
    const attrInputId = `attr-${attrName.toLowerCase()}`;
    let diceCount = parseInt(document.getElementById(attrInputId).value) || 1;
    if(diceCount < 1) diceCount = 1;

    let results = [];
    for (let i = 0; i < diceCount; i++) {
        results.push(Math.floor(Math.random() * 20) + 1);
    }

    const charName = document.getElementById('char-name').value || 'Desconhecido';
    const message = `🎲 ${charName} rolou ${skillName} (${attrName}): [ ${results.join(' | ')} ]`;
    
    showLocalToast(message);

    if (typeof OBR !== 'undefined' && OBR.isReady) {
        OBR.broadcast.sendMessage("fate-system-rolls", message);
    }
}

document.getElementById('photo-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentPhoto = event.target.result;
            setPhotoPreview(currentPhoto);
            saveData(); 
        };
        reader.readAsDataURL(file);
    }
});

function setPhotoPreview(base64Str) {
    const preview = document.getElementById('photo-preview');
    const text = document.getElementById('photo-text');
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

document.addEventListener('input', saveData);
document.addEventListener('DOMContentLoaded', loadAllCharacters);

// AQUI O GM ESCUTA TODOS OS JOGADORES DA SALA
if (typeof OBR !== 'undefined') {
    OBR.onReady(async () => {
        localPlayerName = await OBR.player.getName();
        syncWithOwlbear(); // Manda os dados ao entrar na sala
        
        OBR.broadcast.onMessage("fate-system-rolls", (event) => {
            OBR.notification.show(event.data);
        });

        const role = await OBR.player.getRole();
        if (role === "GM") {
            document.getElementById("gm-area").style.display = "block";
            
            // Puxa as fichas de quem já está na sala
            const players = await OBR.party.getPlayers();
            updateGMList(players);

            // Atualiza quando jogadores entram, saem ou salvam
            OBR.party.onChange((updatedPlayers) => { updateGMList(updatedPlayers); });
        }
    });
}

function updateGMList(players) {
    const gmList = document.getElementById('gm-character-list');
    if(!gmList) return;
    gmList.innerHTML = '';
    
    let hasSheets = false;
    
    players.forEach(player => {
        if (player.metadata && player.metadata["fatesystem/sheets"]) {
            const sheets = player.metadata["fatesystem/sheets"];
            for (let charId in sheets) {
                hasSheets = true;
                let charName = sheets[charId].name || "Sem Nome";
                let playerName = player.name || "Desconhecido";
                
                gmList.innerHTML += `<div class="char-list-item gm-item" onclick="openGMCharacter('${player.id}', '${charId}')">👑 ${charName} <span style="font-size:10px; color:#888;">(${playerName})</span></div>`;
            }
        }
    });
    
    if (!hasSheets) gmList.innerHTML = '<span style="color:#666; font-size: 12px;">Nenhuma ficha dos jogadores online encontrada.</span>';
}

async function openGMCharacter(playerId, charId) {
    const players = await OBR.party.getPlayers();
    const player = players.find(p => p.id === playerId);
    if (player && player.metadata["fatesystem/sheets"]) {
        const charData = player.metadata["fatesystem/sheets"][charId];
        if (charData) {
            characters["temp_gm_view"] = charData; 
            openCharacter("temp_gm_view");
        }
    }
}
