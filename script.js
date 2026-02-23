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
let toastTimer = null; // Variável para consertar o bug do clique duplo

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
}

// ------ GERADOR DE PASTAS ------
function renderCharacterList() {
    const container = document.getElementById('character-folders');
    container.innerHTML = '';

    const categories = { "Jogadores": [], "NPCs": [], "Monstros": [] };

    // Organiza as fichas nas pastas
    for (let id in characters) {
        let char = characters[id];
        let cat = char.category || "Jogadores";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ id: id, name: char.name || "Sem Nome", owner: char.ownerName || "?" });
    }

    // Desenha as pastas na tela
    for (let cat in categories) {
        if (categories[cat].length > 0) {
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

    if(Object.keys(characters).length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">Nenhum personagem na mesa ainda.</div>';
    }
}

function createNewCharacter() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", category: "Jogadores", skills: {}, photo: "" };
    openCharacter(newId);
}

function deleteCharacter() {
    if(confirm("Deseja mesmo apagar esta ficha da mesa? Todos perderão o acesso a ela.")) {
        delete characters[currentCharId];
        
        // Apaga da Nuvem da Sala Global
        if (typeof OBR !== 'undefined' && OBR.isReady) {
            OBR.room.setMetadata({ [`fate_char_${currentCharId}`]: undefined });
        }
        
        backToList();
    }
}

function openCharacter(id) {
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
    setPhotoPreview(currentPhoto);
    renderSkills();

    document.getElementById('screen-list').classList.remove('active');
    document.getElementById('screen-sheet').classList.add('active');
}

// ------ SALVAMENTO GLOBAL NA SALA ------
async function saveData() {
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
        photo: "" // Imagem bloqueada de ir pra nuvem pra não pesar o server
    };

    characters[currentCharId] = sheetData;
    
    // Envia o personagem específico para o banco de dados da SALA
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        await OBR.room.setMetadata({ [`fate_char_${currentCharId}`]: sheetData });
    }
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
    playerSkills[skillName] += change;
    if (playerSkills[skillName] < 0) playerSkills[skillName] = 0;
    renderSkills();
    saveData();
}

// ------ A NOTIFICAÇÃO CENTRAL (Com timer corrigido) ------
function showCenterToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.classList.add("show");
    
    // Limpa o timer antigo se o jogador clicar rápido duas vezes
    if(toastTimer) clearTimeout(toastTimer);
    
    toast.onclick = () => toast.classList.remove("show");
    
    toastTimer = setTimeout(() => { 
        toast.classList.remove("show"); 
    }, 4500);
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
    const message = `🎲 ${charName}\n rolou ${skillName} (${attrName})\n [ ${results.join(' | ')} ]`;
    
    // Mostra pra você
    showCenterToast(message);

    // Manda pros outros executarem a mesma notificação central na tela deles
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

// ------ O CÉREBRO DA SALA: SINCRONIZAÇÃO EM TEMPO REAL ------
function processRoomData(metadata) {
    let mudouAlgo = false;
    for (let key in metadata) {
        if (key.startsWith('fate_char_')) {
            const id = key.replace('fate_char_', '');
            
            // Se o metadado for apagado, apagamos daqui
            if (metadata[key] === undefined || metadata[key] === null) {
                if(characters[id]) { delete characters[id]; mudouAlgo = true; }
            } else {
                // Atualiza ou adiciona o personagem
                characters[id] = metadata[key];
                mudouAlgo = true;
            }
        }
    }
    if (mudouAlgo) renderCharacterList();
}

if (typeof OBR !== 'undefined') {
    OBR.onReady(
