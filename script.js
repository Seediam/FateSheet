// Nenhuma importação de módulos aqui para evitar o erro de SyntaxError!
// Utilizamos o OBR global providenciado pela tag de script no index.html.

const EXT_ID = "br.com.fatesheet";
const META_PREFIX = `${EXT_ID}/char_`;
const LOG_KEY = `${EXT_ID}/log`;
const CHANNEL_ROLLS = `${EXT_ID}/rolls`;

const skillsData = [
    { name: "Arcanismo", attr: "Magia" }, { name: "História", attr: "Magia" }, { name: "Natureza", attr: "Magia" }, { name: "Religião", attr: "Magia" },
    { name: "Intuição", attr: "Sorte" }, { name: "Medicina", attr: "Sorte" }, { name: "Percepção", attr: "Sorte" }, { name: "Sobrevivência", attr: "Sorte" },
    { name: "Atletismo", attr: "Força" }, { name: "Intimidação", attr: "Força" },
    { name: "Acrobacia", attr: "Agilidade" }, { name: "Furtividade", attr: "Agilidade" }, { name: "Prestidigitação", attr: "Agilidade" },
    { name: "Atuação", attr: "Sorte" }, { name: "Enganação", attr: "Sorte" }, { name: "Persuasão", attr: "Sorte" }
];

const grimoiresDb = {
    "Gelo": "❄️ Gelo — Passiva: Zero Absoluto\nSempre que causar dano, aplica Resfriamento (1).\nAo atingir 3 acúmulos no mesmo alvo: ele perde 10ft de movimento e sofre -1 em testes físicos por 1 turno.",
    "Fogo": "🔥 Fogo — Passiva: Combustão Persistente\nSempre que causar dano, aplica Queimadura (1).\nQueimadura causa 1d4 no início do turno.",
    "Vento": "🌪 Vento — Passiva: Corrente Ascendente\nSempre que usar Locomoção, ganha +10ft adicionais.",
    "Água": "🌊 Água — Passiva: Fluxo Adaptável\nUma vez por turno, pode converter 50% do dano recebido em redução de Mana.",
    "Planta": "🌱 Planta — Passiva: Enraizar\nQuando atingir o mesmo alvo duas vezes seguidas, ele fica com -10ft de movimento.",
    "Roseira": "🌹 Roseira — Passiva: Espinhos Reativos\nSempre que sofrer dano corpo a corpo, o atacante recebe 1d6 de dano.",
    "Constrição": "🧊 Constrição — Passiva: Pressão Constante\nSe um alvo estiver sob condition, ele sofre -1 adicional em testes.",
    "Fumaça Arcana": "🌫 Fumaça Arcana — Passiva: Forma Intangível\nUma vez por turno, se sofrer dano, pode reduzir em 1d8.",
    "Espinhos": "🌿 Espinhos — Passiva: Terreno Hostil\nAlvos que entrarem em alcance corpo a corpo sofrem 1d4.",
    "Tecido": "🧵 Tecido — Passiva: Trama Viva\nSempre que usar habilidade defensiva, ganha +1 Runa temporária.",
    "Terra": "🌍 Terra — Passiva: Fortaleza Natural\nSe permanecer parado no turno, ganha +1d6 redução no próximo dano.",
    "Raio": "⚡ Raio — Passiva: Sobrecarga\nSe tirar 20 natural, causa 1d6 adicional e pode atingir outro alvo a 10ft.",
    "Lama": "🌑 Lama — Passiva: Afundar\nSempre que causar dano, reduz o movimento do alvo em 5ft.",
    "Espelhos": "🪞 Espelhos — Passiva: Reflexão Arcana\nUma vez por turno, se sofrer dano mágico, pode refletir 50% dele.",
    "Veneno": "☠ Veneno — Passiva: Toxina Progressiva\nSempre que causar dano, aplica Veneno (1).",
    "Escudo": "🛡 Escudo — Passiva: Bastilha\nSe usar habilidade defensiva, ganha -2 em dano recebido.",
    "Espada": "⚔ Espada — Passiva: Corte Preciso\nSe tirar 12+ em duas runas no mesmo ataque, adiciona +1d6 extra.",
    "Tinta": "🖋 Tinta — Passiva: Marca Escrita\nAlvos marcados sofrem +1d6 do seu próximo ataque.",
    "Tempo": "⏳ Tempo — Passiva: Eco Temporal\nUma vez por combate, pode repetir uma rolagem de runa.",
    "Sangue": "🩸 Sangue — Passiva: Vínculo Carmesim\nSempre que causar dano, cura 50% do valor causado.",
    "Selamento": "🔒 Selamento — Passiva: Marca Restritiva\nPrimeira habilidade do alvo no turno seguinte custa +5 Mana.",
    "Morte": "💀 Morte — Passiva: Marca da Decadência\nAlvos abaixo de 40% HP sofrem +1d8 de dano seu.",
    "Luz": "✨ Luz — Passiva: Iluminação Purificadora\nAo usar habilidade, remove 1 efeito negativo leve seu.",
    "Sombras": "🌑 Sombras — Passiva: Passo Sombrio\nPrimeiro ataque após ficar não alvejado causa +1d6.",
    "Vida": "🌿 Vida — Passiva: Crescimento Vital\nSe estiver acima de 80% HP, recebe -2 em dano sofrido.",
    "Espaço": "🌀 Espaço — Passiva: Distorção\nPode trocar de posição com um aliado 1x por turno.",
    "Teleporte": "🧭 Teleporte — Passiva: Salto Instável\nSempre que usar Locomoção, ganha +1d6 no próximo dano.",
    "Negação": "🚫 Negação — Passiva: Cancelamento Absoluto\nUma vez por turno, pode anular o bônus de runa de um inimigo.",
    "Criação": "🛠 Criação — Passiva: Manifestação\nPode criar um efeito simples por turno.",
    "Imaginação": "🧠 Imaginação — Passiva: Forma Impossível\nPode declarar um efeito ilusório simples por turno.",
    "Realidade": "🌌 Realidade — Passiva: Ruptura\nUma vez por combate, pode alterar o resultado de uma runa em ±3.",
    "Sem Grimório": "⚫ Sem Grimório\nSem passiva.",
    "Inumório": "🔴 Inumório\nSem passiva."
};

let characters = {}; 
let combatLog = []; 
let currentCharId = null;
let isLoadingSheet = false; 
let playerSkills = {}; 
let playerInventory = [];
let playerSpells = []; 
let currentPhoto = "";
let folderState = { "Jogadores": true, "NPCs": true, "Monstros": true };
let isOverweight = false;
let pendingSpellIndex = null; 
let myPlayerName = "Jogador";

// Carregamento Inicial das Variáveis Locais (Backup)
try { 
    const saved = localStorage.getItem('fatesheet_db'); 
    if (saved) characters = JSON.parse(saved); 
} catch(e) {}

document.getElementById('loading').style.display = 'none';
document.getElementById('app').style.display = 'block';

// Retorna se o OBR está Ativo para jogar Online
function isOBR() {
    return typeof window.OBR !== 'undefined' && window.OBR.isAvailable;
}

// --- SINCRONIZAÇÃO ABSOLUTA DA NUVEM (MULTIPLAYER) ---
async function initExtension() {
    window.renderCharacterList();
    
    if (isOBR()) {
        window.OBR.onReady(async () => {
            try { myPlayerName = await window.OBR.player.getName() || "Jogador"; } catch(e){}
            
            try {
                let meta = await window.OBR.room.getMetadata();
                await syncEngine(meta, true);

                // Fica à escuta de qualquer pessoa que mexa nalguma ficha!
                window.OBR.room.onMetadataChange((newMeta) => syncEngine(newMeta, false));
                
                // Escuta as rolagens para atirar o dado no meio da tela
                window.OBR.broadcast.onMessage(CHANNEL_ROLLS, (event) => { 
                    window.abrirModalCentral(event.data); 
                });
                // Escuta mensagens do histórico
                window.OBR.broadcast.onMessage(CHANNEL_LOG, (event) => { 
                    if (Array.isArray(event.data)) { combatLog = event.data; window.renderMiniLog(); }
                });

            } catch(e) { console.error("Erro no OBR:", e); }
        });
    }
}
initExtension();

// O motor do Multiplayer - Mistura o Local com o Online e avisa a Mesa
async function syncEngine(meta, isFirstLoad) {
    let hasChanges = false;
    
    // 1. Log Global
    if (meta[LOG_KEY]) { combatLog = meta[LOG_KEY]; window.renderMiniLog(); }

    // 2. Se é a primeira vez que abres, atira as tuas fichas criadas offline para a nuvem
    if (isFirstLoad) {
        let missingUpdates = {};
        for(let k in characters) {
            if(meta[META_PREFIX + k] === undefined) {
                missingUpdates[META_PREFIX + k] = characters[k];
            }
        }
        if(Object.keys(missingUpdates).length > 0 && isOBR()) {
            await window.OBR.room.setMetadata(missingUpdates);
        }
    }

    // 3. Lê o que a Nuvem tem (A Verdade Absoluta)
    let cloudChars = {};
    for (let key in meta) {
        if (key.startsWith(META_PREFIX)) {
            let id = key.replace(META_PREFIX, "");
            if (meta[key] !== undefined && meta[key] !== null) {
                cloudChars[id] = meta[key];
            }
        }
    }

    // Aplica as fichas da Nuvem na nossa variável global
    characters = cloudChars;
    try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}

    // Atualiza a Interface para Toda a Gente!
    window.renderCharacterList();
    window.renderCombatTracker();

    // 4. Proteção contra perdas de dados enquanto digitas:
    // Atualiza a ficha que TU tens aberta agora com os dados novos da rede (ex: Dano sofrido)
    if (currentCharId && characters[currentCharId] && !isLoadingSheet) {
        let c = characters[currentCharId];
        updateDOMIfInactive('char-hp-atual', c.hpAtual);
        updateDOMIfInactive('char-mp-atual', c.mpAtual);
        updateDOMIfInactive('char-runas', c.runas);
        
        let cbInGame = document.getElementById('char-ingame');
        if (cbInGame && document.activeElement !== cbInGame) cbInGame.checked = !!c.inGame;
        
        let cbFora = document.getElementById('fora-combate');
        if (cbFora && document.activeElement !== cbFora) cbFora.checked = !!c.foraCombate;

        window.renderGlobalRunes();
    } else if (currentCharId && !characters[currentCharId]) {
        // Alguém apagou a ficha que estavas a usar!
        window.backToList();
    }
}

// Botão Manual de Nuvem (Se a Internet falhar)
window.forceSync = async function() {
    if (isOBR()) {
        let meta = await window.OBR.room.getMetadata();
        await syncEngine(meta, false);
        alert("Sincronização forçada efetuada com sucesso!");
    } else {
        alert("A extensão está em Modo Offline.");
    }
}

function updateDOMIfInactive(id, val) {
    let el = document.getElementById(id);
    if (!el) return;
    if (document.activeElement === el) return; // Não apaga se estiveres a clicar!
    if (el.type === 'checkbox') el.checked = val;
    else el.value = val;
}

window.openTab = function(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    if(event) event.currentTarget.classList.add('active');
    if(tabName === 'combate-tab') window.renderCombatTracker();
}

window.backToList = async function() {
    // Avisa a mesa que FECHASTE a ficha!
    if (currentCharId && characters[currentCharId]) {
        characters[currentCharId].openedBy = "";
        await window.saveData(); 
    }
    currentCharId = null;
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
        categories[cat].push({ id: id, name: char.name || "Sem Nome", av: char.avatar || "🧙‍♂️", opened: char.openedBy });
    }

    let hasAny = false;
    for (let cat in categories) {
        if (categories[cat].length > 0) {
            hasAny = true;
            let isOpen = folderState[cat] !== false;
            let html = `<div class="folder-header" onclick="window.toggleFolder('${cat}')"><span class="chevron">${isOpen ? '▼' : '►'}</span> 📁 ${cat}</div><div class="folder-content" style="display: ${isOpen ? 'flex' : 'none'};">`;
            categories[cat].forEach(char => {
                let openedBadge = char.opened ? `<span style="font-size:10px; color:#44aaff; font-weight:bold; background:#111; padding:2px 6px; border-radius:4px;">👁️ ${char.opened}</span>` : '';
                html += `<div class="char-list-item" onclick="window.openCharacter('${char.id}')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <span style="font-size:18px;">${char.av}</span> 
                                    <span style="margin-left:8px;">${char.name}</span>
                                </div>
                                ${openedBadge}
                            </div>
                         </div>`;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
    }
    if(!hasAny) container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">A Mesa está vazia. Clica no botão acima para criares o teu personagem!</div>';
}

window.createNewCharacter = async function() {
    const newId = Date.now().toString();
    let newChar = { name: "Novo Personagem", avatar: "🧙‍♂️", category: "Jogadores", classe: "Plebeu", skills: {}, inventory: [], spells: [], color: "#d4af37", mov: 30, runas: 0, activeRunes: [], alloc: {f:0, m:0, a:0, s:0}, foraCombate: false, inGame: false, hpAtual: 40, mpAtual: 25, hasRolledTurn: false, initiative: 0, shieldFis: 0, shieldMag: 0, openedBy: myPlayerName };
    characters[newId] = newChar;
    
    try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}
    if (isOBR()) {
        await window.OBR.room.setMetadata({ [META_PREFIX + newId]: characters[newId] });
    }
    
    window.renderCharacterList();
    window.openCharacter(newId);
}

window.deleteCharacter = async function() {
    if(confirm("Desejas APAGAR esta ficha permanentemente para TODOS na mesa?")) {
        const idToDelete = currentCharId;
        currentCharId = null; 
        
        delete characters[idToDelete]; 
        try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}
        
        if (isOBR()) {
            let clearMeta = {};
            clearMeta[META_PREFIX + idToDelete] = undefined; // Envia comando de apagar à nuvem
            await window.OBR.room.setMetadata(clearMeta);
        }
        
        window.backToList();
        window.renderCharacterList();
    }
}

window.exportCharacter = function() {
    if(!currentCharId) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(characters[currentCharId]));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", (characters[currentCharId].name || "Ficha") + "_Fate.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
}

window.importCharacter = async function(event) {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            const newId = Date.now().toString();
            importedData.openedBy = ""; // Reseta o estado
            characters[newId] = importedData;
            
            try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}
            if (isOBR()) {
                await window.OBR.room.setMetadata({ [META_PREFIX + newId]: characters[newId] });
            }
            
            window.renderCharacterList();
            alert("Ficha importada com sucesso e sincronizada!");
        } catch(err) { alert("Erro ao ler o ficheiro JSON."); }
    };
    reader.readAsText(file);
}

const safeSetVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
const safeSetCheck = (id, val) => { const el = document.getElementById(id); if(el) el.checked = !!val; };

window.updateSheetColor = function() { let color = document.getElementById('char-color')?.value; document.documentElement.style.setProperty('--accent-gold', color); window.saveData(); }
window.changeGrimoire = function() { let val = document.getElementById('grimoire-select')?.value; if(val) document.getElementById('passiva').value = grimoiresDb[val] || ""; window.saveData(); }

window.updateCategoryUI = function() {
    const cat = document.getElementById('char-category')?.value;
    const isMonster = (cat === 'Monstros');
    const safeDisplay = (id, display) => { let el = document.getElementById(id); if(el) el.style.display = display; };
    safeDisplay('box-classe-prof', isMonster ? 'none' : 'block');
    safeDisplay('char-race-player', isMonster ? 'none' : 'block');
    safeDisplay('char-race-monster', isMonster ? 'block' : 'none');
    safeDisplay('hp-player-wrapper', isMonster ? 'none' : 'flex');
    safeDisplay('val-vida-monster', isMonster ? 'block' : 'none');
    window.calcVitals(); 
}

window.openCharacter = async function(id) {
    try {
        isLoadingSheet = true;
        currentCharId = id;
        const c = characters[id] || {};
        
        safeSetVal('char-avatar', c.avatar || '🧙‍♂️');
        safeSetVal('char-name', c.name || '');
        safeSetVal('char-color', c.color || '#d4af37'); 
        document.documentElement.style.setProperty('--accent-gold', c.color || '#d4af37');
        safeSetVal('char-category', c.category || 'Jogadores');
        safeSetVal('char-age', c.age || '');
        safeSetVal('char-class', c.classe || 'Plebeu');
        safeSetVal('char-prof', c.prof || '');
        if(c.category === 'Monstros') safeSetVal('char-race-monster', c.race || 'Terrestres'); else safeSetVal('char-race-player', c.race || 'Humano');
        
        safeSetVal('char-hp-atual', c.hpAtual !== undefined ? c.hpAtual : 40);
        safeSetVal('char-mp-atual', c.mpAtual !== undefined ? c.mpAtual : 25);
        safeSetVal('val-vida-monster', c.vidaMonster || 100);
        safeSetVal('attr-forca', c.forca || 1); safeSetVal('attr-magia', c.magia || 1); safeSetVal('attr-agilidade', c.agilidade || 1); safeSetVal('attr-sorte', c.sorte || 1);
        safeSetVal('grimoire-select', c.grimoireSelect || ''); safeSetVal('grimoire-dt', c.grimoireDT || 10); safeSetVal('mana-zone', c.mana || ''); safeSetVal('passiva', c.passiva || '');
        safeSetVal('char-mov', c.mov || 30); safeSetVal('char-runas', c.runas || 0);
        
        safeSetCheck('fora-combate', c.foraCombate); 
        safeSetCheck('char-ingame', c.inGame);
        
        let al = c.alloc || {f:0, m:0, a:0, s:0};
        safeSetVal('alloc-forca', al.f); safeSetVal('alloc-magia', al.m); safeSetVal('alloc-agilidade', al.a); safeSetVal('alloc-sorte', al.s);

        playerSkills = c.skills || {}; playerInventory = c.inventory || []; playerSpells = c.spells || []; 
        
        window.updateCategoryUI();
        window.renderSkills();
        window.renderInventory();
        window.renderGlobalRunes();
        window.renderSpells();
        window.calcVitals();
        window.updateAlloc();

        document.getElementById('screen-list').classList.remove('active');
        document.getElementById('screen-sheet').classList.add('active');
        
    } catch(e) { 
        console.error("Falha ao abrir a ficha:", e); 
    } finally {
        setTimeout(() => {
            isLoadingSheet = false;
            // Avisa à mesa que TU abriste a ficha!
            characters[id].openedBy = myPlayerName;
            window.saveData(); 
        }, 100);
    }
}

window.calcVitals = function() {
    let cat = document.getElementById('char-category')?.value; let forcaBase = parseInt(document.getElementById('attr-forca')?.value) || 0; let magiaBase = parseInt(document.getElementById('attr-magia')?.value) || 0; let sorteBase = parseInt(document.getElementById('attr-sorte')?.value) || 0; let classe = document.getElementById('char-class')?.value || 'Plebeu';
    let elVidaM = document.getElementById('val-vida-max'); let elManaM = document.getElementById('val-mana-max');

    if (cat !== 'Monstros') {
        let extraMana = 0; if(classe === 'Andarilho') extraMana = 50; if(classe === 'Estrangeiro') extraMana = 75; if(classe === 'Nobre') extraMana = 100;
        if(elVidaM) elVidaM.innerText = 40 + (sorteBase * 5); if(elManaM) elManaM.innerText = 25 + extraMana;
    } else {
        if(elManaM) elManaM.innerText = 25;
        if(elVidaM) { let mv = document.getElementById('val-vida-monster')?.value || 100; elVidaM.innerText = mv; }
    }

    let dfFis = document.getElementById('val-def-fisica'); let dfMag = document.getElementById('val-def-magica');
    if(dfFis) dfFis.innerText = forcaBase * 5; if(dfMag) dfMag.innerText = magiaBase * 5;

    let maxWeight = forcaBase * 5; let currentWeight = playerInventory.reduce((acc, item) => acc + ((parseFloat(item.peso)||0) * (parseInt(item.qtd)||1)), 0);
    let ep = document.getElementById('val-peso'); if(ep) ep.innerText = `${currentWeight.toFixed(1)} / ${maxWeight}`;
    let bp = document.getElementById('box-peso'); let pa = document.getElementById('peso-aviso');

    if (currentWeight > maxWeight) { isOverweight = true; if(bp) bp.classList.add('overweight'); if(pa) pa.style.display = 'block'; } 
    else { isOverweight = false; if(bp) bp.classList.remove('overweight'); if(pa) pa.style.display = 'none'; }
}

window.renderCombatTracker = function() {
    const container = document.getElementById('combat-tracker-list');
    if(!container) return;
    
    let combatants = [];
    for(let k in characters) {
        if(characters[k].inGame) {
            combatants.push(characters[k]);
        }
    }
    combatants.sort((a, b) => (b.initiative || 0) - (a.initiative || 0)); 

    let html = '';
    
    combatants.forEach((c, idx) => {
        let hpM = c.category==='Monstros' ? (c.vidaMonster||100) : (40 + (c.sorte||0)*5);
        let mpM = c.category==='Monstros' ? 25 : 25 + (c.classe==='Andarilho'?25:c.classe==='Estrangeiro'?50:c.classe==='Nobre'?75:0);
        let positionTag = c.hasRolledTurn ? `<span style="font-size:10px; color:var(--accent-gold); font-weight:bold; background:#000; padding:2px 4px; border-radius:3px;">${idx + 1}º a Atacar</span>` : `<span style="font-size:10px; color:#888; font-weight:bold; background:#000; padding:2px 4px; border-radius:3px;">⌛ Pendente</span>`;
        // ALERTA VISUAL: QUEM ESTÁ A MEXER NA FICHA NO COMBATE!
        let playerNameTag = c.openedBy ? `<div style="font-size:10px; color:#44aaff; font-weight:bold; margin-top:2px;">👁️ Editando: ${c.openedBy}</div>` : '';

        let shieldFis = c.shieldFis || 0;
        let shieldMag = c.shieldMag || 0;
        let shieldDisplay = '';
        if (shieldFis > 0 || shieldMag > 0) {
            shieldDisplay = `<div style="font-size:11px; color:#aaa; margin-top:4px;">🛡️ <span style="color:#ff4444">${shieldFis} DF</span> | <span style="color:#44aaff">${shieldMag} DM</span></div>`;
        }

        let attackButton = '';
        if (c.id !== currentCharId && pendingSpellIndex !== null) {
            let spell = playerSpells[pendingSpellIndex];
            if (spell && spell.tipo === 'Cura') {
                attackButton = `<button style="background:#39ff14; border:none; border-radius:4px; padding:6px 10px; cursor:pointer; font-size:16px; box-shadow: 0 0 10px #39ff14;" onclick="window.atacarAlvo('${c.id}')" title="Curar Alvo">💚</button>`;
            } else if (spell && spell.tipo !== 'Self') {
                attackButton = `<button style="background:#ff4444; border:none; border-radius:4px; padding:6px 10px; cursor:pointer; font-size:16px; box-shadow: 0 0 10px #ff4444;" onclick="window.atacarAlvo('${c.id}')" title="Atacar Alvo!">⚔️</button>`;
            }
        } else if (c.id === currentCharId && pendingSpellIndex !== null) {
            let spell = playerSpells[pendingSpellIndex];
            if (spell && spell.tipo === 'Cura') {
                attackButton = `<button style="background:#39ff14; border:none; border-radius:4px; padding:6px 10px; cursor:pointer; font-size:16px; box-shadow: 0 0 10px #39ff14;" onclick="window.atacarAlvo('${c.id}')" title="Curar a si mesmo">💚</button>`;
            } else if (spell && spell.tipo === 'Self') {
                attackButton = `<button style="background:#44aaff; border:none; border-radius:4px; padding:6px 10px; cursor:pointer; font-size:16px; box-shadow: 0 0 10px #44aaff;" onclick="window.atacarAlvo('${c.id}')" title="Usar em si">✨</button>`;
            }
        }

        let runesHtml = '';
        if (c.activeRunes && c.activeRunes.length > 0) {
            runesHtml = `<div style="margin-top: 6px; display: flex; gap: 4px; flex-wrap: wrap;">`;
            c.activeRunes.forEach((r, rIdx) => {
                let color = r.type === 'alpha' ? '#44aaff' : (r.type === 'delta' ? '#ff4444' : '#a855f7');
                let symbol = r.type === 'alpha' ? 'α' : (r.type === 'delta' ? 'δ' : 'β');
                let onClick = `onclick="window.converterRunaEmDefesa('${c.id}', ${rIdx})"`;
                runesHtml += `<button style="background:#111; color:${color}; border:1px solid ${color}; border-radius:4px; padding:4px 8px; font-size:12px; font-weight:bold; cursor:pointer; box-shadow: 0 0 5px ${color}; margin-right:4px;" ${onClick} title="Clica para queimar e converter em Defesa!">${symbol} ${r.face} <span style="color:#ff4444; margin-left:4px;">✖</span></button>`;
            });
            runesHtml += `</div>`;
        }

        html += `<div style="background:var(--bg-panel); padding:10px; margin-bottom:8px; border-left:4px solid ${c.color || '#fff'}; border-radius:4px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">${c.avatar || '🧙‍♂️'}</span> 
                    <div>
                        <b style="font-size:14px; color:var(--accent-gold);">${c.name}</b><br>${positionTag}
                        ${playerNameTag}
                        ${shieldDisplay}
                    </div>
                </div>
                <div style="font-size:12px; text-align:right;">
                    <span style="color:#ff4444; font-weight:bold;">HP: ${c.hpAtual||0} / ${hpM}</span><br>
                    <span style="color:#44aaff; font-weight:bold;">MP: ${c.mpAtual||0} / ${mpM}</span>
                </div>
                <div style="margin-left: 10px;">
                    ${attackButton}
                </div>
            </div>
            ${runesHtml}
        </div>`;
    });
    
    if(html === '') html = '<div style="color:#666; text-align:center; padding: 20px;">Ninguém marcado na Cena de Combate.</div>';
    container.innerHTML = html;
}

window.novaRodadaGlobal = async function() {
    if(!confirm("Iniciar nova rodada? Todos perderão os escudos e precisarão rolar os Atributos novamente.")) return;
    let updates = {};
    for(let id in characters) { 
        if (characters[id].inGame) {
            characters[id].hasRolledTurn = false; 
            characters[id].initiative = 0; 
            characters[id].shieldFis = 0;
            characters[id].shieldMag = 0;
            updates[META_PREFIX + id] = characters[id];
        }
    }
    if (isOBR() && Object.keys(updates).length > 0) await window.OBR.room.setMetadata(updates);
    window.renderCombatTracker();
}

window.converterRunaEmDefesa = async function(id, rIdx) {
    try {
        let c = characters[id]; if(!c || !c.activeRunes || !c.activeRunes[rIdx]) return;
        
        if (id !== currentCharId) {
            if(!confirm(`Desejas queimar a runa de ${c.name}?`)) return;
        }

        let r = c.activeRunes[rIdx];
        if(!c.shieldFis) c.shieldFis = 0;
        if(!c.shieldMag) c.shieldMag = 0;

        let defFis = parseInt(c.forca || 0) * 5;
        let defMag = parseInt(c.magia || 0) * 5;

        if (r.type === 'delta') { c.shieldFis += defFis; }
        else if (r.type === 'alpha') { c.shieldMag += defMag; }
        else if (r.type === 'beta') {
            let defHib = Math.floor((defFis + defMag) / 3);
            c.shieldFis += defHib;
            c.shieldMag += defHib;
        }
        
        c.activeRunes.splice(rIdx, 1);
        characters[id] = c;
        if (isOBR()) await window.OBR.room.setMetadata({ [META_PREFIX + id]: c });

        window.renderCombatTracker();
        window.renderGlobalRunes();
    } catch(e) { console.error(e); }
}

window.toggleTargetMode = function(index) {
    let cb = document.getElementById('fora-combate'); let isFora = cb ? cb.checked : false;
    if (!isFora) {
        let inCombatChars = Object.values(characters).filter(ch => ch.inGame);
        let missing = inCombatChars.filter(ch => !ch.hasRolledTurn);
        if (missing.length > 0) { 
            alert("Aguarda que as seguintes fichas rolem os atributos de turno:\n" + missing.map(m=>m.name).join(', ')); 
            return; 
        }
    }

    const spell = playerSpells[index];
    if (pendingSpellIndex === index) {
        pendingSpellIndex = null; 
        window.renderSpells();
        window.renderCombatTracker();
    } else {
        pendingSpellIndex = index;
        if(spell.tipo === "Self" || spell.tipo === "Locomoção") {
             window.atacarAlvo(currentCharId); 
        } else {
             window.renderSpells();
             window.openTab('combate-tab'); 
        }
    }
}

window.atacarAlvo = async function(targetId) {
    try {
        let index = pendingSpellIndex;
        if (index === null) { alert("Nenhuma magia selecionada!"); return; }
        
        const spell = playerSpells[index]; 
        let attacker = characters[currentCharId];
        let tgt = characters[targetId];
        
        if (!attacker || !tgt) return;

        let isFora = document.getElementById('fora-combate') ? document.getElementById('fora-combate').checked : false;
        let manaCost = parseInt(spell.custo) || 0;
        if (manaCost > 0) {
            if ((attacker.mpAtual||0) < manaCost) { if(!confirm("Mana insuficiente! Desejas conjurar a magia mesmo assim?")) return; } 
            else { attacker.mpAtual -= manaCost; safeSetVal('char-mp-atual', attacker.mpAtual); }
        }

        const rolar = (qtd, tDado) => { if (!qtd || qtd <= 0 || !tDado) return []; let faces = parseInt(tDado.replace('d', '')); let res = []; for(let i=0; i<qtd; i++) res.push(Math.floor(Math.random() * faces) + 1); return res; }
        
        let bRolls = [], bTot = 0;
        if(spell.tipo !== 'Self') {
            if(spell.isCrit) { let faces = parseInt(spell.bD.replace('d', '')); bRolls = [faces * (parseInt(spell.bQtd)||1) * 3]; } else { bRolls = rolar(spell.bQtd, spell.bD); }
            bTot = Math.floor(bRolls.reduce((a,b)=>a+b, 0) * spell.bMult);
        }

        let runesPack = [];
        if(spell.tipo !== 'Self' && attacker.activeRunes) {
            runesPack = attacker.activeRunes.map(r => {
                let rl = rolar(1, r.face); let somaDados = rl.reduce((a,b)=>a+b, 0); let fixo = parseInt(r.fixo) || 0;
                return { t: r.type, f: r.face, m: r.mult, r: rl, fixo: fixo, tot: Math.floor((somaDados + fixo) * r.mult) };
            });
        }
        let stRoll = (spell.statusName && spell.statusDT > 0) ? Math.floor(Math.random() * 20) + 1 : 0;
        let grossDamage = bTot; (runesPack||[]).forEach(r => grossDamage += r.tot);

        const payload = {
            t: "clash_result", 
            av: attacker.avatar || '🧙‍♂️', c: attacker.name || 'Desconhecido', targetName: tgt.name, col: attacker.color || '#d4af37', sn: spell.nome || "Habilidade", cost: spell.custo || "0", rg: spell.alcance || "Self", desc: spell.desc || "", st: spell.tipo || "Dano",
            b: { f: spell.bD, m: spell.bMult, r: bRolls, tot: bTot }, ru: runesPack, crit: spell.isCrit ? "true" : "false", stName: spell.statusName || "", stDT: spell.statusDT || "0", stRoll: stRoll, audio: spell.audioUrl || "", fc: isFora
        };

        if (spell.tipo === "Cura") {
            let maxH = tgt.category==='Monstros' ? (tgt.vidaMonster||100) : (40 + (tgt.sorte||0)*5); 
            tgt.hpAtual = Math.min(maxH, (tgt.hpAtual||0) + grossDamage); 
            payload.healed = grossDamage;
            payload.t = "spell"; 
        } else if (spell.tipo === "Dano" || spell.tipo === "Controle") {
            let totalShield = (tgt.shieldFis || 0) + (tgt.shieldMag || 0); 
            let netDamage = Math.max(0, grossDamage - totalShield);
            if (totalShield > 0) { tgt.shieldFis = 0; tgt.shieldMag = 0; }
            tgt.hpAtual = (tgt.hpAtual || 0) - netDamage;
            payload.gross = grossDamage;
            payload.blocked = Math.min(grossDamage, totalShield);
            payload.net = netDamage;
        } else {
            payload.t = "spell";
        }

        attacker.activeRunes = []; attacker.alloc = {f:0, m:0, a:0, s:0}; 
        if(currentCharId === attacker.id) {
            safeSetVal('alloc-forca', 0); safeSetVal('alloc-magia', 0); safeSetVal('alloc-agilidade', 0); safeSetVal('alloc-sorte', 0);
        }
        if(spell.isCrit) spell.isCrit = false;
        pendingSpellIndex = null;

        characters[currentCharId] = attacker;
        characters[targetId] = tgt;
        
        let updates = {};
        updates[META_PREFIX + currentCharId] = attacker;
        if (currentCharId !== targetId) { updates[META_PREFIX + targetId] = tgt; }
        
        if (isOBR()) await window.OBR.room.setMetadata(updates);

        window.abrirModalCentral(payload); 
        window.addCombatLog(payload);
        if (isOBR()) window.OBR.broadcast.sendMessage(CHANNEL_ROLLS, payload);
        
        window.renderSpells(); window.renderCombatTracker(); window.openTab('personagem'); 
        
    } catch(e) { console.error("Erro Crítico no Ataque:", e); alert("Erro ao atacar: " + e.message); }
}

window.renderSpells = function() {
    const container = document.getElementById('spells-container'); if(!container) return; container.innerHTML = '';
    playerSpells.forEach((spell, index) => {
        if(spell.isOpen === undefined) spell.isOpen = true;
        spell.tipo = spell.tipo || "Dano"; spell.bQtd = spell.bQtd || 1; spell.bD = spell.bD || "d20"; spell.bMult = spell.bMult !== undefined ? spell.bMult : 1; spell.isCrit = spell.isCrit || false; spell.statusName = spell.statusName || ""; spell.statusDT = spell.statusDT || ""; spell.audioUrl = spell.audioUrl || "";
        
        let isSelected = (pendingSpellIndex === index);
        let btnColor = isSelected ? '#ff4444' : 'rgba(212, 175, 55, 0.1)';
        let btnIcon = isSelected ? '⚔️' : '🎯';
        
        let isSelf = spell.tipo === "Self"; let row = document.createElement('div'); row.className = 'spell-item';
        let headerHtml = `<div class="spell-header" onclick="window.toggleSpellInfo(${index})"><div style="display: flex; align-items: center; gap: 10px;"><button class="btn-roll-spell" style="background:${btnColor}; border-color:${btnColor}; color:${isSelected?'#fff':'var(--accent-gold)'};" onclick="event.stopPropagation(); window.toggleTargetMode(${index})" title="Mirar Magia">${btnIcon}</button><span style="font-weight: bold; color: var(--accent-gold); font-size: 16px;">${spell.nome || 'Nova Magia'}</span></div><div style="display:flex; align-items:center; gap: 10px;"><button class="btn-danger" style="padding: 4px 8px;" onclick="event.stopPropagation(); window.removeSpell(${index})">X</button><span class="chevron">${spell.isOpen ? '▼' : '►'}</span></div></div>`;
        let bodyHtml = `<div style="display: ${spell.isOpen ? 'flex' : 'none'}; flex-direction: column; gap: 5px; margin-top: 10px;"><div class="inv-row"><input type="text" class="inv-input" style="flex: 2; font-weight: bold;" placeholder="Habilidade" value="${spell.nome}" onchange="window.updateSpell(${index}, 'nome', this.value)"><input type="number" class="inv-input" style="flex: 1;" placeholder="Custo MP" value="${spell.custo}" onchange="window.updateSpell(${index}, 'custo', this.value)"><input type="text" class="inv-input" style="flex: 1;" placeholder="Alcance" value="${spell.alcance}" onchange="window.updateSpell(${index}, 'alcance', this.value)"></div><div class="inv-row" style="margin-top: 5px;"><textarea class="inv-input" style="flex: 1; resize: vertical;" rows="1" placeholder="Descrição e Efeitos..." onchange="window.updateSpell(${index}, 'desc', this.value)">${spell.desc}</textarea></div><div class="inv-row"><span style="font-size:16px;">🎵</span><input type="text" class="inv-input" style="flex: 1; border-color: #555;" placeholder="URL de Áudio Customizado" value="${spell.audioUrl}" onchange="window.updateSpell(${index}, 'audioUrl', this.value)"></div><div class="dice-config-row"><select class="inv-input dice-sel" style="width:100% !important;" onchange="window.updateSpell(${index}, 'tipo', this.value); window.renderSpells();"><option value="Dano" ${spell.tipo==='Dano'?'selected':''}>Dano (Base + Runas Globais)</option><option value="Controle" ${spell.tipo==='Controle'?'selected':''}>Controle (Base + Runas Globais)</option><option value="Cura" ${spell.tipo==='Cura'?'selected':''}>Cura (Base + Runas Globais)</option><option value="Locomoção" ${spell.tipo==='Locomoção'?'selected':''}>Locomoção (Base + Runas Globais)</option><option value="Self" ${spell.tipo==='Self'?'selected':''}>Self (Apenas Efeito)</option></select>${(!isSelf) ? `<div class="dice-group"><span class="lbl" style="color:#fff">Base</span><input type="number" class="inv-input dice-qty" min="1" value="${spell.bQtd}" onchange="window.updateSpell(${index}, 'bQtd', this.value)"><select class="inv-input dice-sel" onchange="window.updateSpell(${index}, 'bD', this.value)"><option value="d4" ${spell.bD==='d4'?'selected':''}>d4</option><option value="d6" ${spell.bD==='d6'?'selected':''}>d6</option><option value="d8" ${spell.bD==='d8'?'selected':''}>d8</option><option value="d10" ${spell.bD==='d10'?'selected':''}>d10</option><option value="d12" ${spell.bD==='d12'?'selected':''}>d12</option><option value="d20" ${spell.bD==='d20'?'selected':''}>d20</option><option value="d100" ${spell.bD==='d100'?'selected':''}>d100</option></select><div class="mult-group"><span class="mult-btn m-red ${spell.bMult===0?'active':''}" onclick="window.updateSpell(${index}, 'bMult', 0)">X</span><span class="mult-btn m-white ${spell.bMult===0.5?'active':''}" onclick="window.updateSpell(${index}, 'bMult', 0.5)">X</span><span class="mult-btn m-green ${spell.bMult===1?'active':''}" onclick="window.updateSpell(${index}, 'bMult', 1)">X</span></div></div><div style="display:flex; align-items:center; gap:5px; margin-left: auto; width: 100%; justify-content: flex-end; margin-top: 5px;"><input type="checkbox" id="crit-${index}" ${spell.isCrit ? 'checked' : ''} onchange="window.updateSpell(${index}, 'isCrit', this.checked)"><label for="crit-${index}" style="color:#ffd700; margin:0; cursor:pointer;">Crítico (Base Máx x3)</label></div>` : ''}</div><div class="dice-config-row" style="margin-top: 5px; border-color: #a855f7;"><div style="display: flex; width: 100%; align-items: center; gap: 5px;"><span style="color:#a855f7; font-size: 11px; font-weight: bold; white-space: nowrap;">⚡ Status/Efeito</span><input type="text" class="inv-input" style="flex: 2;" placeholder="Ex: Queimar" value="${spell.statusName}" onchange="window.updateSpell(${index}, 'statusName', this.value)"><span style="color:#fff; font-size: 11px; font-weight: bold;">DT:</span><input type="number" class="inv-input dice-qty" placeholder="15" value="${spell.statusDT}" onchange="window.updateSpell(${index}, 'statusDT', this.value)"></div></div></div>`;
        row.innerHTML = headerHtml + bodyHtml; container.appendChild(row);
    });
}
window.addSpell = function() { playerSpells.push({ nome: "", desc: "", custo: "", alcance: "", tipo: "Dano", bQtd: 1, bD: "d20", bMult: 1, isOpen: true, isCrit: false, statusName: "", statusDT: "", audioUrl: "" }); window.renderSpells(); window.saveData(); }
window.updateSpell = function(index, field, value) { playerSpells[index][field] = value; window.saveData(); window.renderSpells(); }
window.removeSpell = function(index) { if(confirm("Remover magia?")) { playerSpells.splice(index, 1); window.renderSpells(); window.saveData(); } }
window.toggleSpellInfo = function(index) { playerSpells[index].isOpen = !playerSpells[index].isOpen; window.renderSpells(); window.saveData(); }

// --- SAVE SUPER BLINDADO COM OBRIGATORIEDADE DE NUVEM ---
window.saveData = async function() {
    if (isLoadingSheet) return; 
    if (!currentCharId) return; 
    
    try {
        let c = characters[currentCharId] || {};
        
        if (document.getElementById('screen-sheet').classList.contains('active')) {
            let elHp = document.getElementById('char-hp-atual'); if (elHp) c.hpAtual = parseInt(elHp.value) || 0;
            let elMp = document.getElementById('char-mp-atual'); if (elMp) c.mpAtual = parseInt(elMp.value) || 0;
            let elRunas = document.getElementById('char-runas'); if (elRunas) c.runas = parseInt(elRunas.value) || 0;
            
            let elInGame = document.getElementById('char-ingame'); if (elInGame) c.inGame = elInGame.checked;
            let elFora = document.getElementById('fora-combate'); if (elFora) c.foraCombate = elFora.checked;
            
            let isMonster = document.getElementById('char-category')?.value === 'Monstros';
            c.alloc = { 
                f: parseInt(document.getElementById('alloc-forca')?.value)||0, 
                m: parseInt(document.getElementById('alloc-magia')?.value)||0, 
                a: parseInt(document.getElementById('alloc-agilidade')?.value)||0, 
                s: parseInt(document.getElementById('alloc-sorte')?.value)||0 
            };
            
            c.name = document.getElementById('char-name')?.value || "Sem Nome"; 
            c.avatar = document.getElementById('char-avatar')?.value || "🧙‍♂️"; 
            c.color = document.getElementById('char-color')?.value || "#d4af37"; 
            c.category = document.getElementById('char-category')?.value || "Jogadores";
            c.age = document.getElementById('char-age')?.value || ""; 
            c.race = isMonster ? document.getElementById('char-race-monster')?.value : document.getElementById('char-race-player')?.value;
            c.classe = document.getElementById('char-class')?.value || "Plebeu"; 
            c.prof = document.getElementById('char-prof')?.value || ""; 
            c.vidaMonster = document.getElementById('val-vida-monster')?.value || 100; 
            c.forca = document.getElementById('attr-forca')?.value || 1; 
            c.magia = document.getElementById('attr-magia')?.value || 1; 
            c.agilidade = document.getElementById('attr-agilidade')?.value || 1; 
            c.sorte = document.getElementById('attr-sorte')?.value || 1;
            c.grimoireSelect = document.getElementById('grimoire-select')?.value || ""; 
            c.grimoireDT = document.getElementById('grimoire-dt')?.value || 10; 
            c.mana = document.getElementById('mana-zone')?.value || ""; 
            c.passiva = document.getElementById('passiva')?.value || ""; 
            c.mov = document.getElementById('char-mov')?.value || 30; 
        }
        
        c.id = currentCharId;
        c.skills = playerSkills || {}; 
        c.inventory = playerInventory || []; 
        c.spells = playerSpells || []; 
        c.photo = currentPhoto; 
        
        characters[currentCharId] = c;
        try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}
        
        if (isOBR()) {
            await window.OBR.room.setMetadata({ [META_PREFIX + currentCharId]: c });
        }
    } catch(e) { console.error("Erro no save:", e); }
}

let saveTimeout;
document.addEventListener('input', (e) => {
    if(e.target.id && e.target.id.startsWith('alloc')) return; 
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => { if(currentCharId) window.saveData(); }, 800);
});

// Adiciona evento instantâneo na checkbox do combate
document.addEventListener('change', (e) => {
    if(e.target.id === 'char-ingame') {
        window.saveData(); // Salva IMEDIATAMENTE ao clicar no combate
    }
});

// --- PERÍCIAS E ITENS ---
window.renderSkills = function() {
    const container = document.getElementById('skills-container');
    if(!container) return;
    let html = '';
    skillsData.forEach(sk => {
        let mod = playerSkills[sk.name] || 0;
        html += `<div class="skill-item" onclick="window.rollSkill('${sk.name}', '${sk.attr}')">
            <div>
                <span style="font-weight:bold; color:var(--text-main);">${sk.name}</span>
                <span style="font-size:10px; color:#666; margin-left:5px;">(${sk.attr})</span>
            </div>
            <div class="skill-controls" onclick="event.stopPropagation()">
                <button class="btn-ctrl" onclick="window.updateSkill('${sk.name}', -1)">-</button>
                <span style="width:20px; text-align:center; color:var(--accent-gold); font-weight:bold;">${mod}</span>
                <button class="btn-ctrl" onclick="window.updateSkill('${sk.name}', 1)">+</button>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

window.updateSkill = function(name, delta) {
    if(!playerSkills[name]) playerSkills[name] = 0;
    playerSkills[name] += delta;
    window.renderSkills();
    window.saveData();
}

window.renderInventory = function() {
    const container = document.getElementById('inventory-container');
    if(!container) return;
    container.innerHTML = '';
    playerInventory.forEach((item, index) => {
        container.innerHTML += `
        <div class="inv-item">
            <div class="inv-row">
                <input type="text" class="inv-input" style="flex: 2;" placeholder="Nome do Item" value="${item.nome || ''}" onchange="window.updateInventoryItem(${index}, 'nome', this.value)">
                <input type="number" class="inv-input" style="flex: 1;" placeholder="Peso" value="${item.peso || 0}" onchange="window.updateInventoryItem(${index}, 'peso', this.value)">
                <input type="number" class="inv-input" style="flex: 1;" placeholder="Qtd" value="${item.qtd || 1}" onchange="window.updateInventoryItem(${index}, 'qtd', this.value)">
                <button class="btn-danger" onclick="window.removeInventoryItem(${index})">X</button>
            </div>
            <div class="inv-row">
                <textarea class="inv-input" rows="1" style="flex: 1; resize: vertical;" placeholder="Descrição..." onchange="window.updateInventoryItem(${index}, 'desc', this.value)">${item.desc || ''}</textarea>
            </div>
        </div>`;
    });
    window.calcVitals();
}

window.addInventoryItem = function() { playerInventory.push({ nome: "", peso: 1, qtd: 1, desc: "" }); window.renderInventory(); window.saveData(); }
window.updateInventoryItem = function(index, field, value) { playerInventory[index][field] = value; window.renderInventory(); window.saveData(); }
window.removeInventoryItem = function(index) { if(confirm("Remover este item?")) { playerInventory.splice(index, 1); window.renderInventory(); window.saveData(); } }

window.updateAlloc = function() {
    let f = parseInt(document.getElementById('alloc-forca').value) || 0; let m = parseInt(document.getElementById('alloc-magia').value) || 0; let a = parseInt(document.getElementById('alloc-agilidade').value) || 0; let s = parseInt(document.getElementById('alloc-sorte').value) || 0;
    let maxF = parseInt(document.getElementById('attr-forca').value) || 1; let maxM = parseInt(document.getElementById('attr-magia').value) || 1; let maxA = parseInt(document.getElementById('attr-agilidade').value) || 1; let maxS = parseInt(document.getElementById('attr-sorte').value) || 1;
    if (f > maxF) { document.getElementById('alloc-forca').value = maxF; f = maxF; } if (m > maxM) { document.getElementById('alloc-magia').value = maxM; m = maxM; } if (a > maxA) { document.getElementById('alloc-agilidade').value = maxA; a = maxA; } if (s > maxS) { document.getElementById('alloc-sorte').value = maxS; s = maxS; }
    window.saveData();
}

window.rollAttributes = async function() {
    let f = parseInt(document.getElementById('alloc-forca').value) || 0; let m = parseInt(document.getElementById('alloc-magia').value) || 0; let a = parseInt(document.getElementById('alloc-agilidade').value) || 0; let s = parseInt(document.getElementById('alloc-sorte').value) || 0;
    let rolar = (qtd) => { let res = []; for(let i=0; i<qtd; i++) res.push(Math.floor(Math.random() * 20) + 1); return res.join(','); };
    
    let rF = rolar(f); let rM = rolar(m); let rA = rolar(a);
    let isFora = document.getElementById('fora-combate') ? document.getElementById('fora-combate').checked : false;
    
    let payload = { t: "attr", av: document.getElementById('char-avatar').value, c: document.getElementById('char-name').value || "Desconhecido", col: document.getElementById('char-color').value || "#d4af37", fc: isFora, rF: rF, rM: rM, rA: rA, sorte: s };
    
    let activeRunes = [];
    let processRunes = (rollStr, typeLabel) => {
        if(!rollStr) return;
        rollStr.split(',').forEach(v => {
            let val = parseInt(v);
            if (val >= 20) activeRunes.push({ type: typeLabel, face: 'd20', mult: 2, fixo: s });
            else if (val >= 12) activeRunes.push({ type: typeLabel, face: 'd10', mult: 1, fixo: s });
            else if (val <= 4) activeRunes.push({ type: typeLabel, face: 'd4', mult: 0.5, fixo: s });
            else activeRunes.push({ type: typeLabel, face: 'd6', mult: 1, fixo: s });
        });
    };
    processRunes(rF, 'delta'); processRunes(rM, 'alpha'); processRunes(rA, 'beta');
    
    if (currentCharId && characters[currentCharId]) {
        characters[currentCharId].activeRunes = activeRunes;
        characters[currentCharId].hasRolledTurn = true;
        let init = 0; if (rA) init = Math.max(...rA.split(',').map(Number));
        characters[currentCharId].initiative = init;
        await window.saveData();
    }
    
    window.renderGlobalRunes();
    window.abrirModalCentral(payload);
    window.addCombatLog(payload);
    if (isOBR()) window.OBR.broadcast.sendMessage(CHANNEL_ROLLS, payload);
}

window.renderGlobalRunes = function() {
    const container = document.getElementById('global-runes-container');
    if(!container) return;
    
    if(!currentCharId || !characters[currentCharId] || !characters[currentCharId].activeRunes || characters[currentCharId].activeRunes.length === 0) {
        container.innerHTML = '<div style="font-size:11px; color:#666; text-align:center;">Nenhuma runa gerada neste turno. Role os atributos na aba Ficha.</div>';
        return;
    }
    
    let html = '<div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">';
    html += '<span style="font-size:12px; color:#aaa; font-weight:bold;">Suas Runas: </span>';
    characters[currentCharId].activeRunes.forEach(r => {
        let color = r.type === 'alpha' ? '#44aaff' : (r.type === 'delta' ? '#ff4444' : '#a855f7');
        let symbol = r.type === 'alpha' ? 'α' : (r.type === 'delta' ? 'δ' : 'β');
        html += `<div style="background:#111; color:${color}; border:1px solid ${color}; border-radius:4px; padding:4px 8px; font-size:12px; font-weight:bold; box-shadow: 0 0 5px ${color};">${symbol} ${r.face}</div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

window.abrirJanelaDeLog = function() {
    if (isOBR()) {
        window.OBR.popover.open({ id: "fatesheet-log-popover", url: "./log.html", height: 500, width: 350, anchorOrigin: { horizontal: "RIGHT", vertical: "CENTER" }, transformOrigin: { horizontal: "RIGHT", vertical: "CENTER" } });
    } else {
        alert("O histórico persistente só funciona dentro da plataforma Owlbear Rodeo.");
    }
}

window.addCombatLog = async function(logEntry) {
    combatLog.unshift(logEntry);
    if(combatLog.length > 50) combatLog.pop();
    window.renderMiniLog();
    if (isOBR()) {
        await window.OBR.room.setMetadata({ [LOG_KEY]: combatLog });
        window.OBR.broadcast.sendMessage(CHANNEL_LOG, combatLog);
    }
}

window.renderMiniLog = function() {
    const container = document.getElementById('mini-log-container');
    if(!container) return;
    
    if(!Array.isArray(combatLog)) combatLog = [];
    
    container.innerHTML = combatLog.map(log => {
        let actHtml = "Ação";
        let resHtml = "";
        if (log.t === "spell") {
            actHtml = `Magia: <b style="color:${log.col}">${log.sn}</b>`;
            resHtml = `Dano/Cura: ${log.net || log.healed || log.gross || 0}`;
        } else if (log.t === "clash_result") {
            actHtml = `Atacou: <b>${log.targetName}</b>`;
            resHtml = `Causou <b style="color:var(--danger)">${log.net}</b> de Dano`;
        } else if (log.t === "attr") {
            actHtml = `Rolou <b>Atributos</b>`;
            resHtml = `Turno Definido`;
        } else {
            actHtml = `Rolou <b>${log.s}</b>`;
            let r = log.r ? log.r.split(',') : [0];
            let v = parseInt(r[0]) + (log.mod || 0);
            resHtml = `Total: <b style="color:${log.col}">${v}</b>`;
        }
        return `<div class="log-entry" style="border-left-color:${log.col}">
            <div class="log-header">
                <span class="log-name" style="color:${log.col}">${log.av} ${log.c}</span>
            </div>
            <div style="font-size:11px; color:#aaa;">${actHtml}</div>
            <div class="log-result">${resHtml}</div>
        </div>`;
    }).join('');
}

window.clearMiniLog = async function() {
    if(confirm("Apagar o histórico para todos os jogadores na mesa?")) {
        combatLog = [];
        window.renderMiniLog();
        if (isOBR()) await window.OBR.room.setMetadata({ [LOG_KEY]: [] });
    }
}

window.rollSkill = function(skillName, attrName) {
    let idMapped = attrName.toLowerCase().replace('ç', 'c'); let baseAttr = parseInt(document.getElementById(`attr-${idMapped}`)?.value) || 1;
    let classe = document.getElementById('char-class')?.value || 'Plebeu'; let isMonster = document.getElementById('char-category')?.value === 'Monstros';
    let isFora = document.getElementById('fora-combate') ? document.getElementById('fora-combate').checked : false;

    if (!isFora) {
        let inCombatChars = [];
        for(let k in characters) { if(characters[k].inGame) inCombatChars.push(characters[k]); }
        let missing = inCombatChars.filter(ch => !ch.hasRolledTurn);
        if (missing.length > 0) { alert("Aguarda que as seguintes fichas rolem os atributos de turno:\n" + missing.map(m=>m.name).join(', ')); return; }
    }
    if(!isMonster) {
        if (classe === 'Plebeu') { if(attrName === 'Força') baseAttr += 1; if(attrName === 'Magia') baseAttr -= 1; }
        if (classe === 'Andarilho' && attrName === 'Agilidade') baseAttr += 1;
        if (classe === 'Estrangeiro' && attrName === 'Sorte') baseAttr += 1;
        if (classe === 'Nobre' && attrName === 'Magia') baseAttr += 1;
    }
    if(baseAttr < 1) baseAttr = 1;
    let results = []; for (let i = 0; i < baseAttr; i++) { let die = Math.floor(Math.random() * 20) + 1; if (isOverweight) die -= 5; results.push(die); }
    
    const payload = { t: "skill", av: document.getElementById('char-avatar')?.value, c: document.getElementById('char-name')?.value || 'Desconhecido', s: skillName, a: attrName, r: results.join(','), pen: isOverweight ? "true" : "false", col: document.getElementById('char-color')?.value || '#d4af37', mod: playerSkills[skillName] || 0, fc: isFora };

    window.abrirModalCentral(payload); window.addCombatLog(payload);
    if (isOBR()) window.OBR.broadcast.sendMessage(CHANNEL_ROLLS, payload);
}

// ------ BLINDAGEM DO MODAL: Rola o dado com o Link correto para evitar bug! ------
window.abrirModalCentral = async function(data) {
    if (isOBR()) {
        const dataUrl = encodeURIComponent(JSON.stringify(data));
        try { await window.OBR.modal.close("fate-roll-modal"); } catch(e){}
        
        setTimeout(() => {
            try { 
                // O link tem que apontar para a tua página exata no Github para evitar 404 (Tela de Erro)!
                window.OBR.modal.open({ 
                    id: "fate-roll-modal", 
                    url: `https://seediam.github.io/FateSheet/resultado.html?data=${dataUrl}`, 
                    width: 450, 
                    height: (data.t === "spell" || data.t === "attr" || data.t === "clash_result") ? 550 : 250 
                }); 
            } catch(e) {}
        }, 50);
    }
}
