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
        const saved = localStorage.getItem('fate_system_chars_v3');
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
        // Apaga da nuvem também
        if (typeof OBR !== 'undefined' && OBR.isReady) {
            OBR.room.setMetadata({ [`fatesystem/sheet-${currentCharId}`]: undefined });
        }
        saveDataLocalOnly();
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

// SALVA NA NUVEM DA SALA PARA O GM VER SEMPRE
async function syncWithOwlbear() {
    if (typeof OBR !== 'undefined' && OBR.isReady && currentCharId && currentCharId !== "temp_gm_view") {
        const syncData = {
            ...characters[currentCharId],
            ownerName: localPlayerName, 
            photo: "" // Remove foto para não pesar o servidor da sala
        };
        await OBR.room.setMetadata({
            [`fatesystem/sheet-${currentCharId}`]: syncData
        });
    }
}

function saveDataLocalOnly() {
    let temp = characters["temp_gm_view"];
    delete characters["temp_gm_view"];
    localStorage.setItem('fate_system_chars_v3', JSON.stringify(characters));
    if(temp) characters["temp_gm_view"] = temp;
}

function saveData() {
    if (!currentCharId || currentCharId === "temp_gm_view") return; 

    const sheetData = {
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

    characters[currentCharId] = sheetData;
    saveDataLocalOnly();
    syncWithOwlbear();
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
