const skillsData = [
    { name: "Arcanismo", attr: "Magia" }, { name: "História", attr: "Magia" }, { name: "Natureza", attr: "Magia" }, { name: "Religião", attr: "Magia" },
    { name: "Intuição", attr: "Sorte" }, { name: "Medicina", attr: "Sorte" }, { name: "Percepção", attr: "Sorte" }, { name: "Sobrevivência", attr: "Sorte" },
    { name: "Atletismo", attr: "Força" }, { name: "Intimidação", attr: "Força" },
    { name: "Acrobacia", attr: "Agilidade" }, { name: "Furtividade", attr: "Agilidade" }, { name: "Prestidigitação", attr: "Agilidade" },
    { name: "Atuação", attr: "Sorte" }, { name: "Enganação", attr: "Sorte" }, { name: "Persuasão", attr: "Sorte" }
];

let myLocalCharacters = {}; // Fichas criadas neste PC
let allTableCharacters = []; // Fichas de todo mundo da mesa
let currentCharId = null;
let currentIsMine = true; // Define se posso editar ou só visualizar
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
    if(currentIsMine) window.saveData();
    document.getElementById('screen-sheet').classList.remove('active');
    document.getElementById('screen-list').classList.add('active');
    window.buildGlobalList();
}

window.toggleFolder = function(folderName) {
    folderState[folderName] = !folderState[folderName];
    window.renderCharacterList();
}

// ------ NOVO SISTEMA GLOBAL: Junta suas fichas com a dos amigos ------
window.buildGlobalList = async function() {
    allTableCharacters = [];
    
    // 1. Adiciona as SUAS fichas (que estão no seu site/PC)
    for (let id in myLocalCharacters) {
        let char = myLocalCharacters[id];
        allTableCharacters.push({ ...char, id: id, isMine: true, owner: "Você" });
    }

    // 2. Se estiver no Owlbear, pega as fichas dos OUTROS jogadores
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
    if(!container) return;
    container.innerHTML = '';

    const categories = { "Jogadores": [], "NPCs": [], "Monstros": [] };

    allTableCharacters.forEach(char => {
        let cat = char.category || "Jogadores";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(char);
    });

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
                let badge = char.isMine ? '' : `<span style="font-size:9px; color:#888;">(${char.owner})</span>`;
                html += `<div class="char-list-item" onclick="openCharacter('${char.id}')">
                            <span>${char.name} ${badge}</span>
                         </div>`;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
    }

    if(!hasAny) {
        container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">Nenhuma ficha criada ainda.</div>';
    }
}

window.saveDataLocalOnly = function() {
    try { localStorage.setItem('fatesheet_db', JSON.stringify(myLocalCharacters)); } catch(e){}
}

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    myLocalCharacters[newId] = { name: "Novo Personagem", category: "Jogadores", skills: {}, photo: "" };
    window.saveDataLocalOnly();
    window.buildGlobalList();
    window.openCharacter(newId);
}

window.deleteCharacter = function() {
    if(!currentIsMine) {
        alert("Você só pode apagar as fichas que você mesmo criou!");
        return;
    }
    if(confirm("Apagar esta ficha permanentemente?")) {
        delete myLocalCharacters[currentCharId];
        window.saveDataLocalOnly();
        
        if (typeof OBR !== 'undefined' && OBR.isReady) {
            OBR.player.setMetadata({ "fatesheet_chars": myLocalCharacters });
        }
        
        document.getElementById('screen-sheet').classList.remove('active');
        document.getElementById('screen-list').classList.add('active');
        window.buildGlobalList();
    }
}

function safeSetVal(id, value) {
    const el = document.getElementById(id);
    if(el) el.value = value;
}

window.openCharacter = function(id) {
    currentCharId = id;
    
    // Procura na lista global
    const charData = allTableCharacters.find(c => c.id === id) || {};
    currentIsMine = charData.isMine !== false; // True por padrão se for local
    
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

    // TRAVA DE SEGURANÇA: Se a ficha não é sua, bloqueia os inputs (Modo Leitura)
    const inputs = document.querySelectorAll('#screen-sheet input, #screen-sheet select');
    inputs.forEach(input => {
        if(input.id !== 'photo-upload') input.disabled = !currentIsMine;
    });

    document.getElementById('screen-list').classList.remove('active');
    document.getElementById('screen-sheet').classList.add('active');
}

// ------ SALVA NO SEU PERFIL DO OWLBEAR ------
window.saveData = async function() {
    if (!currentCharId || !currentIsMine) return; 

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

    myLocalCharacters[currentCharId] = sheetData;
    window.saveDataLocalOnly();
    
    // Manda pro seu perfil no Owlbear, os outros vão ler de você!
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        try {
            await OBR.player.setMetadata({ "fatesheet_chars": myLocalCharacters });
        } catch(e) {}
    }
}

window.renderSkills = function() {
    const container = document.getElementById('skills-container');
    if(!container) return;
    container.innerHTML = '';

    skillsData.forEach(skill => {
        if (playerSkills[skill.name] === undefined) playerSkills[skill.name] = 0;
        
        // Se for Modo Leitura, esconde os botões de + e -
        let controls = '';
        if(currentIsMine) {
            controls = `
                <button class="btn-ctrl" onclick="updateSkill('${skill.name}', -1, event)">-</button>
                <span style="width: 20px; text-align: center;">${playerSkills[skill.name]}</span>
                <button class="btn-ctrl" onclick="updateSkill('${skill.name}', 1, event)">+</button>
            `;
        } else {
            controls = `<span style="width: 40px; text-align: center; color: #d4af37;">${playerSkills[skill.name]} pts</span>`;
        }

        const div = document.createElement('div');
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

// ------ A MÁGICA DA ROLAGEM NO MEIO DA TELA ------
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
    
    // Empacota os dados limpos para a URL
    const rollData = {
        c: charName,
        s: skillName,
        a: attrName,
        r: results.join(',')
    };

    abrirModalCentral(rollData);

    if (typeof OBR !== 'undefined' && OBR.isReady) {
        OBR.broadcast.sendMessage("fatesheet-rolls", rollData);
    }
}

function abrirModalCentral(data) {
    if (typeof OBR !== 'undefined' && OBR.isReady) {
        // LINK ABSOLUTO DIRETO DO SEU GITHUB: É impossível o Owlbear se perder agora
        const baseUrl = "https://seediam.github.io/FateSheet/resultado.html";
        const query = `?c=${encodeURIComponent(data.c)}&s=${encodeURIComponent(data.s)}&a=${encodeURIComponent(data.a)}&r=${encodeURIComponent(data.r)}`;
        
        OBR.modal.open({
            id: "fate-roll-modal",
            url: baseUrl + query,
            width: 450,
            height: 250
        });
    } else {
        // Se estiver testando direto no site, dá um alert
        alert(`${data.c} rolou ${data.s} (${data.a}): [ ${data.r} ]`);
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
                // Ao entrar na sala, espelha suas fichas locais na nuvem para os outros verem
                await OBR.player.setMetadata({ "fatesheet_chars": myLocalCharacters });
                
                // Reconstrói a lista puxando a de todo mundo
                window.buildGlobalList();

                // Fica ouvindo se os outros alterarem algo
                OBR.party.onChange((updatedPlayers) => {
                    window.buildGlobalList();
                });
                
                // Fica ouvindo as rolagens
                OBR.broadcast.onMessage("fatesheet-rolls", (event) => {
                    abrirModalCentral(event.data);
                });
            } catch(e) {
                console.error("Erro no OBR:", e);
            }
        });
    }
}
