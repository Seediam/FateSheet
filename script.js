import OBR from "https://esm.sh/@owlbear-rodeo/sdk";

const skillsData = [
    { name: "Arcanismo", attr: "Magia" }, { name: "História", attr: "Magia" }, { name: "Natureza", attr: "Magia" }, { name: "Religião", attr: "Magia" },
    { name: "Intuição", attr: "Sorte" }, { name: "Medicina", attr: "Sorte" }, { name: "Percepção", attr: "Sorte" }, { name: "Sobrevivência", attr: "Sorte" },
    { name: "Atletismo", attr: "Força" }, { name: "Intimidação", attr: "Força" },
    { name: "Acrobacia", attr: "Agilidade" }, { name: "Furtividade", attr: "Agilidade" }, { name: "Prestidigitação", attr: "Agilidade" },
    { name: "Atuação", attr: "Sorte" }, { name: "Enganação", attr: "Sorte" }, { name: "Persuasão", attr: "Sorte" }
];

const grimoiresDb = {
    "Gelo": "❄️ Gelo — Passiva: Zero Absoluto\nSempre que causar dano, aplica Resfriamento (1).\nAo atingir 3 acúmulos no mesmo alvo: ele perde 10ft de movimento e sofre -1 em testes físicos por 1 turno.\nSe congelar um alvo, você ganha +1 Runa temporária no próximo turno.",
    "Fogo": "🔥 Fogo — Passiva: Combustão Persistente\nSempre que causar dano, aplica Queimadura (1).\nQueimadura causa 1d4 no início do turno do alvo.\nSe o alvo já estiver queimando e você causar dano novamente, o dano base aumenta em +1d6.",
    "Vento": "🌪 Vento — Passiva: Corrente Ascendente\nSempre que usar Locomoção, ganha +10ft adicionais.\nSe causar dano após se mover 20ft ou mais no turno, aplica Desequilíbrio (-2 no próximo teste do alvo).",
    "Água": "🌊 Água — Passiva: Fluxo Adaptável\nUma vez por turno, pode converter 50% do dano recebido em redução de Mana ao invés de HP.\nSe terminar o turno sem sofrer dano, recupera 5 Mana.",
    "Planta": "🌱 Planta — Passiva: Enraizar\nQuando atingir o mesmo alvo duas vezes seguidas, ele fica com -10ft de movimento.\nSe o alvo já estiver com redução de movimento, sofre -2 em Agilidade.",
    "Roseira": "🌹 Roseira — Passiva: Espinhos Reativos\nSempre que sofrer dano corpo a corpo, o atacante recebe 1d6 de dano perfurante.\nSe você estiver com menos de 50% de HP, o dano reativo vira 1d10.",
    "Constrição": "🧊 Constrição — Passiva: Pressão Constante\nSe um alvo estiver sob qualquer condição negativa aplicada por você, ele sofre -1 adicional em testes.\nSe tentar remover um efeito seu e falhar, recebe 1d6 de dano.",
    "Fumaça Arcana": "🌫 Fumaça Arcana — Passiva: Forma Intangível\nUma vez por turno, se sofrer dano, pode reduzir em 1d8.\nSe reduzir 6 ou mais, pode se mover 10ft sem gastar ação.",
    "Espinhos": "🌿 Espinhos — Passiva: Terreno Hostil\nAlvos que entrarem em alcance corpo a corpo sofrem 1d4.\nSe ficarem 2 turnos próximos, ficam com -2 em Movimento.",
    "Tecido": "🧵 Tecido — Passiva: Trama Viva\nSempre que usar habilidade defensiva, ganha +1 Runa temporária no próximo turno.\nSe bloquear totalmente um ataque (reduzir a 0), pode aplicar -2 no próximo teste do atacante.",
    "Terra": "🌍 Terra — Passiva: Fortaleza Natural\nSe permanecer parado no turno, ganha +1d6 redução no próximo dano recebido.\nSe usar habilidade defensiva, recebe +1 Runa de Força temporária.",
    "Raio": "⚡ Raio — Passiva: Sobrecarga\nSe tirar 20 natural em qualquer runa ofensiva, causa 1d6 adicional e pode atingir outro alvo a 10ft.\nSe errar (1-4), sofre 1d4 de dano elétrico.",
    "Lama": "🌑 Lama — Passiva: Afundar\nSempre que causar dano, reduz o movimento do alvo em 5ft cumulativo (até -20).\nSe o alvo chegar a 0ft, sofre -2 em testes físicos.",
    "Espelhos": "🪞 Espelhos — Passiva: Reflexão Arcana\nUma vez por turno, se sofrer dano mágico, pode refletir 50% dele.\nSe tirar 20 na defesa, reflete 100%.",
    "Veneno": "☠ Veneno — Passiva: Toxina Progressiva\nSempre que causar dano, aplica Veneno (1).\nA cada turno, Veneno aumenta o dano em +1 cumulativo.\nSe o alvo falhar duas runas seguidas, sofre 2d6 adicionais.",
    "Escudo": "🛡 Escudo — Passiva: Bastilha\nSe usar habilidade defensiva, ganha -2 em dano recebido até o próximo turno.\nSe não sofrer dano no turno, ganha +1 Runa no próximo.",
    "Espada": "⚔ Espada — Passiva: Corte Preciso\nSe tirar 12+ em duas runas no mesmo ataque, adiciona +1d6 extra.\nSe for crítico (20), ignora reduções defensivas.",
    "Tinta": "🖋 Tinta — Passiva: Marca Escrita\nSempre que atingir um alvo, pode “marcá-lo”.\nAlvos marcados sofrem +1d6 do seu próximo ataque.\nSó pode manter 1 marca ativa.",
    "Tempo": "⏳ Tempo — Passiva: Eco Temporal\nUma vez por combate, pode repetir uma rolagem de runa.\nSe tirar 20, ganha +1 Runa extra no próximo turno.",
    "Sangue": "🩸 Sangue — Passiva: Vínculo Carmesim\nSempre que causar dano, cura 50% do valor causado.\nSe estiver com menos de 30% HP, ganha +1 Runa de Força.",
    "Selamento": "🔒 Selamento — Passiva: Marca Restritiva\nSempre que aplicar Selado:\n-2 em testes mentais\nPrimeira habilidade do alvo no turno seguinte custa +5 Mana\nSó pode manter 1 selo ativo.",
    "Morte": "💀 Morte — Passiva: Marca da Decadência\nAlvos abaixo de 40% HP sofrem +1d8 de dano seu.\nSe eliminar um alvo, ganha +1 Runa no próximo turno.",
    "Luz": "✨ Luz — Passiva: Iluminação Purificadora\nAo usar habilidade, remove 1 efeito negativo leve seu.\nSe tirar 20, cega o alvo (-2 testes no próximo turno).",
    "Sombras": "🌑 Sombras — Passiva: Passo Sombrio\nSe não for alvo no turno, ganha +1 Runa de Agilidade.\nPrimeiro ataque após ficar “não alvejado” causa +1d6.",
    "Vida": "🌿 Vida — Passiva: Crescimento Vital\nSempre que curar ou reduzir dano, ganha +1 Runa temporária.\nSe estiver acima de 80% HP, recebe -2 em dano sofrido.",
    "Espaço": "🌀 Espaço — Passiva: Distorção\nPode trocar de posição com um aliado 1x por turno ao usar Locomoção.\nSe tirar 20 em movimento, fica inalvejável até seu próximo turno.",
    "Teleporte": "🧭 Teleporte — Passiva: Salto Instável\nSempre que usar Locomoção, ganha +1d6 no próximo dano.\nSe for alvo após se mover, recebe -2 no dano sofrido.",
    "Negação": "🚫 Negação — Passiva: Cancelamento Absoluto\nUma vez por turno, pode anular o bônus de runa de um inimigo.\nSe tirar 20 na defesa, cancela totalmente a habilidade inimiga.",
    "Criação": "🛠 Criação — Passiva: Manifestação\nPode criar um efeito simples por turno (plataforma, arma, barreira pequena).\nSe tirar 20, o efeito dura +1 turno extra.",
    "Imaginação": "🧠 Imaginação — Passiva: Forma Impossível\nPode declarar um efeito ilusório simples por turno.\nSe o inimigo falhar teste mental, trata como real por 1 turno.",
    "Realidade": "🌌 Realidade — Passiva: Ruptura\nUma vez por combate, pode alterar o resultado de uma runa (sua ou inimiga) em ±3.\nSe tirar 20 natural, ignora qualquer redução.",
    "Sem Grimório": "⚫ Sem Grimório\nSem passiva.\nRecebe +1 Runa base permanente por combate.",
    "Inumório": "🔴 Inumório\nSem passiva."
};

let characters = {}; 
let combatLog = []; 
let currentCharId = null;
let currentIsMine = true; 
let playerSkills = {}; 
let playerInventory = [];
let playerSpells = []; 
let currentPhoto = "";
let folderState = { "Jogadores": true, "NPCs": true, "Monstros": true };
let isOverweight = false;

window.onload = function() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    initExtension();
};

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
        categories[cat].push({ id: id, name: char.name || "Sem Nome", av: char.avatar || "🧙‍♂️" });
    }

    let hasAny = false;
    for (let cat in categories) {
        if (categories[cat].length > 0) {
            hasAny = true;
            let isOpen = folderState[cat];
            let html = `<div class="folder-header" onclick="toggleFolder('${cat}')"><span class="chevron">${isOpen ? '▼' : '►'}</span> 📁 ${cat}</div><div class="folder-content" style="display: ${isOpen ? 'flex' : 'none'};">`;
            categories[cat].forEach(char => {
                html += `<div class="char-list-item" onclick="openCharacter('${char.id}')"><span>${char.av} ${char.name}</span></div>`;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
    }
    if(!hasAny) container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">A Mesa está vazia.</div>';
}

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", avatar: "🧙‍♂️", category: "Jogadores", classe: "Plebeu", skills: {}, inventory: [], spells: [], photo: "", color: "#d4af37", mov: 30, runas: 0, activeRunes: [], alloc: {f:0, m:0, a:0, s:0} };
    currentCharId = newId;
    window.saveData(); 
    window.openCharacter(newId);
}

window.deleteCharacter = async function() {
    if(confirm("Apagar esta ficha permanentemente para TODOS na mesa?")) {
        const idToDelete = currentCharId;
        delete characters[idToDelete]; 
        try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}
        if (OBR.isAvailable) await OBR.room.setMetadata({ [`fatesheet_char_${idToDelete}`]: undefined });
        window.backToList();
    }
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
            currentCharId = newId;
            characters[newId] = importedData;
            window.saveData();
            alert("Ficha importada com sucesso!");
        } catch(err) { alert("Erro ao ler JSON."); }
    };
    reader.readAsText(file);
}

const safeSetVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };

window.updateSheetColor = function() {
    let color = document.getElementById('char-color').value;
    document.documentElement.style.setProperty('--accent-gold', color);
    window.saveData();
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

window.changeGrimoire = function() {
    let val = document.getElementById('grimoire-select').value;
    document.getElementById('passiva').value = grimoiresDb[val] || "";
    window.saveData();
}

window.openCharacter = function(id) {
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
    safeSetVal('char-prof-desc', c.profDesc || '');
    
    if(c.category === 'Monstros') safeSetVal('char-race-monster', c.race || 'Terrestres');
    else safeSetVal('char-race-player', c.race || 'Humano');

    safeSetVal('val-vida-monster', c.vidaMonster || 100);
    safeSetVal('attr-forca', c.forca || 1);
    safeSetVal('attr-magia', c.magia || 1);
    safeSetVal('attr-agilidade', c.agilidade || 1);
    safeSetVal('attr-sorte', c.sorte || 1);
    
    safeSetVal('grimoire-select', c.grimoireSelect || '');
    safeSetVal('grimoire-dt', c.grimoireDT || 10);
    safeSetVal('mana-zone', c.mana || '');
    safeSetVal('passiva', c.passiva || ''); 
    safeSetVal('char-mov', c.mov || 30);
    safeSetVal('char-runas', c.runas || 0); 
    
    let al = c.alloc || {f:0, m:0, a:0, s:0};
    safeSetVal('alloc-forca', al.f);
    safeSetVal('alloc-magia', al.m);
    safeSetVal('alloc-agilidade', al.a);
    safeSetVal('alloc-sorte', al.s);

    playerSkills = c.skills || {};
    playerInventory = c.inventory || [];
    playerSpells = c.spells || []; 
    
    window.updateCategoryUI();
    window.renderSkills();
    window.renderInventory();
    window.renderGlobalRunes();
    window.renderSpells(); 
    window.calcVitals();

    document.getElementById('screen-list').classList.remove('active');
    document.getElementById('screen-sheet').classList.add('active');
}

window.calcVitals = function() {
    let cat = document.getElementById('char-category').value;
    let forcaBase = parseInt(document.getElementById('attr-forca').value) || 0;
    let magiaBase = parseInt(document.getElementById('attr-magia').value) || 0;
    let sorteBase = parseInt(document.getElementById('attr-sorte').value) || 0;
    let classe = document.getElementById('char-class').value;

    if (cat !== 'Monstros') {
        let extraMana = 0;
        if(classe === 'Andarilho') extraMana = 50;
        if(classe === 'Estrangeiro') extraMana = 75;
        if(classe === 'Nobre') extraMana = 100;
        document.getElementById('val-vida-player').innerText = `${40 + (sorteBase * 5)} / ${40 + (sorteBase * 5)}`;
        document.getElementById('val-mana').innerText = `${25 + extraMana} / ${25 + extraMana}`;
    } else {
        document.getElementById('val-mana').innerText = `25 / 25`;
    }

    document.getElementById('val-def-fisica').innerText = forcaBase * 5;
    document.getElementById('val-def-magica').innerText = magiaBase * 5;

    let maxWeight = forcaBase * 5;
    let currentWeight = playerInventory.reduce((acc, item) => acc + ((parseFloat(item.peso)||0) * (parseInt(item.qtd)||1)), 0);
    document.getElementById('val-peso').innerText = `${currentWeight.toFixed(1)} / ${maxWeight}`;
    
    if (currentWeight > maxWeight) {
        isOverweight = true;
        document.getElementById('box-peso').classList.add('overweight');
        document.getElementById('peso-aviso').style.display = 'block';
    } else {
        isOverweight = false;
        document.getElementById('box-peso').classList.remove('overweight');
        document.getElementById('peso-aviso').style.display = 'none';
    }
}

window.updateAlloc = function() {
    let f = parseInt(document.getElementById('alloc-forca').value) || 0;
    let m = parseInt(document.getElementById('alloc-magia').value) || 0;
    let a = parseInt(document.getElementById('alloc-agilidade').value) || 0;
    let s = parseInt(document.getElementById('alloc-sorte').value) || 0;
    let maxF = parseInt(document.getElementById('attr-forca').value) || 0;
    let maxM = parseInt(document.getElementById('attr-magia').value) || 0;
    let maxA = parseInt(document.getElementById('attr-agilidade').value) || 0;
    let maxS = parseInt(document.getElementById('attr-sorte').value) || 0;

    if(f > maxF) { f = maxF; safeSetVal('alloc-forca', f); }
    if(m > maxM) { m = maxM; safeSetVal('alloc-magia', m); }
    if(a > maxA) { a = maxA; safeSetVal('alloc-agilidade', a); }
    if(s > maxS) { s = maxS; safeSetVal('alloc-sorte', s); }

    if (f + m + a + s > 3) {
        alert("Você só pode alocar até 3 dados por turno!");
        safeSetVal('alloc-forca', 0); safeSetVal('alloc-magia', 0); safeSetVal('alloc-agilidade', 0); safeSetVal('alloc-sorte', 0);
    }
    window.saveData();
}

const getMultFromRoll = (val) => {
    if(val <= 4) return 0;
    if(val <= 11) return 0.5;
    return 1;
};

// ------ ATUALIZADO: Log usa o v2 para não puxar lixo antigo ------
window.addCombatLog = async function(data) {
    combatLog.unshift(data);
    if(combatLog.length > 40) combatLog.pop(); 
    if (OBR.isAvailable) await OBR.room.setMetadata({ "fatesheet_log_v2": combatLog });
}

window.abrirJanelaDeLog = function() {
    if (OBR.isAvailable) {
        // O Date.now() mata o cache do Log para ele nunca ficar com a tela preta
        OBR.popover.open({
            id: "fatesheet-log-popover",
            url: `https://seediam.github.io/FateSheet/log.html?v=${Date.now()}`, 
            width: 360,
            height: 450,
            disableClickAway: true, 
            anchorOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
            transformOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" }
        });
    } else { alert("Log só funciona dentro da mesa do Owlbear!"); }
}

window.rollAttributes = function() {
    let f = parseInt(document.getElementById('alloc-forca').value) || 0;
    let m = parseInt(document.getElementById('alloc-magia').value) || 0;
    let a = parseInt(document.getElementById('alloc-agilidade').value) || 0;
    let s = parseInt(document.getElementById('alloc-sorte').value) || 0;

    if(f+m+a+s === 0) return alert("Aloque algum dado antes de rolar o turno!");

    let rolls = { f: [], m: [], a: [] };
    let c = characters[currentCharId];
    if(!c.activeRunes) c.activeRunes = [];

    const rollD20 = () => Math.floor(Math.random() * 20) + 1;

    for(let i=0; i<f; i++) {
        let v = rollD20() + s; rolls.f.push(v);
        c.activeRunes.push({ type: 'delta', face: 'd4', mult: getMultFromRoll(v), locked: true, fixo: 0, raw: v });
    }
    for(let i=0; i<m; i++) {
        let v = rollD20() + s; rolls.m.push(v);
        c.activeRunes.push({ type: 'alpha', face: 'd4', mult: getMultFromRoll(v), locked: true, fixo: 0, raw: v });
    }
    for(let i=0; i<a; i++) {
        let v = rollD20() + s; rolls.a.push(v);
        c.activeRunes.push({ type: 'beta', face: 'd4', mult: getMultFromRoll(v), locked: true, fixo: 0, raw: v });
    }

    const payload = {
        t: "attr", 
        av: document.getElementById('char-avatar').value,
        c: document.getElementById('char-name').value || 'Desconhecido',
        col: document.getElementById('char-color').value || '#d4af37',
        rF: rolls.f.join(','), rM: rolls.m.join(','), rA: rolls.a.join(','), sorte: s
    };

    window.abrirModalCentral(payload);
    window.addCombatLog(payload);
    if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);

    window.saveData();
    window.renderGlobalRunes();
}

window.checkRuneLimits = function(typeToAdd) {
    let maxRunes = parseInt(document.getElementById('char-runas').value) || 0;
    let c = characters[currentCharId];
    if(!c.activeRunes) c.activeRunes = [];
    
    if (c.activeRunes.length >= maxRunes) {
        alert(`Limite atingido! Você tem apenas ${maxRunes} runa(s) na ficha.`);
        return false;
    }
    let tCount = c.activeRunes.filter(r => r.type === typeToAdd).length;
    let m = parseInt(document.getElementById('attr-magia').value) || 0;
    let f = parseInt(document.getElementById('attr-forca').value) || 0;
    let a = parseInt(document.getElementById('attr-agilidade').value) || 0;

    if(typeToAdd === 'alpha' && tCount >= m) { alert(`Limite de Alpha! Sua Magia é ${m}.`); return false; }
    if(typeToAdd === 'delta' && tCount >= f) { alert(`Limite de Delta! Sua Força é ${f}.`); return false; }
    if(typeToAdd === 'beta' && tCount >= a) { alert(`Limite de Beta! Sua Agilidade é ${a}.`); return false; }
    return true;
}

window.addGlobalRune = function(type) {
    if(!checkRuneLimits(type)) return;
    characters[currentCharId].activeRunes.push({ type: type, face: "d4", mult: 1, fixo: 0, locked: false });
    window.saveData(); window.renderGlobalRunes();
}

window.updateGlobalRune = function(idx, field, val) {
    characters[currentCharId].activeRunes[idx][field] = val; window.saveData(); window.renderGlobalRunes();
}

window.removeGlobalRune = function(idx) {
    characters[currentCharId].activeRunes.splice(idx, 1); window.saveData(); window.renderGlobalRunes();
}

window.renderGlobalRunes = function() {
    const container = document.getElementById('global-runes-container'); container.innerHTML = '';
    let c = characters[currentCharId];
    if(!c || !c.activeRunes || c.activeRunes.length === 0) {
        container.innerHTML = `<div style="display:flex; gap:8px;"><button class="btn-rune b-alpha" onclick="addGlobalRune('alpha')">+ α Azul</button><button class="btn-rune b-delta" onclick="addGlobalRune('delta')">+ δ Verm</button><button class="btn-rune b-beta" onclick="addGlobalRune('beta')">+ β Roxo</button><button class="btn-rune b-arma" onclick="addGlobalRune('arma')">+ ⚔️ Arma</button></div>`; return;
    }

    let html = `<div class="dice-config-row" style="border-color: var(--accent-gold); background: #111;"><div style="width:100%; display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--accent-gold); font-size:12px; font-weight:bold;">Runas Ativas do Turno</span><div style="display:flex; gap:4px;"><button class="btn-rune b-alpha" style="padding: 2px 6px;" onclick="addGlobalRune('alpha')">+ α</button><button class="btn-rune b-delta" style="padding: 2px 6px;" onclick="addGlobalRune('delta')">+ δ</button><button class="btn-rune b-beta" style="padding: 2px 6px;" onclick="addGlobalRune('beta')">+ β</button><button class="btn-rune b-arma" style="padding: 2px 6px;" onclick="addGlobalRune('arma')">+ ⚔️</button></div></div>`;

    c.activeRunes.forEach((r, idx) => {
        let cHex = '#ccc', sym = '⚔️';
        if(r.type === 'alpha') { cHex = '#44aaff'; sym = 'α'; }
        if(r.type === 'delta') { cHex = '#ff4444'; sym = 'δ'; }
        if(r.type === 'beta')  { cHex = '#a855f7'; sym = 'β'; }

        let dis = r.locked ? "pointer-events:none; opacity:0.5;" : "";
        let redA = r.mult === 0 ? "active" : ""; let whiA = r.mult === 0.5 ? "active" : ""; let greA = r.mult === 1 ? "active" : "";

        html += `<div class="dice-group" style="border-color:${cHex}; margin-top:5px;"><span class="lbl" style="color:${cHex}; text-align:center;">${sym}</span><select class="inv-input dice-sel" onchange="updateGlobalRune(${idx}, 'face', this.value)"><option value="d4" ${r.face==='d4'?'selected':''}>d4</option><option value="d6" ${r.face==='d6'?'selected':''}>d6</option><option value="d8" ${r.face==='d8'?'selected':''}>d8</option><option value="d10" ${r.face==='d10'?'selected':''}>d10</option><option value="d12" ${r.face==='d12'?'selected':''}>d12</option><option value="d20" ${r.face==='d20'?'selected':''}>d20</option><option value="d100" ${r.face==='d100'?'selected':''}>d100</option></select>${r.type === 'arma' ? `<span style="color:#ccc; font-weight:bold;">+</span><input type="number" class="inv-input dice-qty" placeholder="Fixo" value="${r.fixo || 0}" onchange="updateGlobalRune(${idx}, 'fixo', this.value)" style="width: 35px !important;">` : ''}<div class="mult-group" style="${dis}"><span class="mult-btn m-red ${redA}" onclick="updateGlobalRune(${idx}, 'mult', 0)">X</span><span class="mult-btn m-white ${whiA}" onclick="updateGlobalRune(${idx}, 'mult', 0.5)">X</span><span class="mult-btn m-green ${greA}" onclick="updateGlobalRune(${idx}, 'mult', 1)">X</span></div><span style="color:#666; cursor:pointer; font-weight:bold; margin-left:5px; padding: 2px;" onclick="removeGlobalRune(${idx})">✖</span></div>`;
    });
    html += `</div>`; container.innerHTML = html;
}

window.toggleSpellInfo = function(index) { playerSpells[index].isOpen = !playerSpells[index].isOpen; window.renderSpells(); window.saveData(); }

window.renderSpells = function() {
    const container = document.getElementById('spells-container'); container.innerHTML = '';
    playerSpells.forEach((spell, index) => {
        if(spell.isOpen === undefined) spell.isOpen = true;
        spell.tipo = spell.tipo || "Dano"; spell.bQtd = spell.bQtd || 1; spell.bD = spell.bD || "d20"; spell.bMult = spell.bMult !== undefined ? spell.bMult : 1;
        spell.isCrit = spell.isCrit || false; spell.statusName = spell.statusName || ""; spell.statusDT = spell.statusDT || ""; spell.audioUrl = spell.audioUrl || "";

        let isSelf = spell.tipo === "Self";
        let row = document.createElement('div'); row.className = 'spell-item';
        let headerHtml = `<div class="spell-header" onclick="toggleSpellInfo(${index})"><div style="display: flex; align-items: center; gap: 10px;"><button class="btn-roll-spell" onclick="event.stopPropagation(); rollSpellMagic(${index})" title="Rolar Magia">🎲</button><span style="font-weight: bold; color: var(--accent-gold); font-size: 16px;">${spell.nome || 'Nova Magia'}</span></div><div style="display:flex; align-items:center; gap: 10px;"><button class="btn-danger" style="padding: 4px 8px;" onclick="event.stopPropagation(); removeSpell(${index})">X</button><span class="chevron">${spell.isOpen ? '▼' : '►'}</span></div></div>`;

        let bodyHtml = `<div style="display: ${spell.isOpen ? 'flex' : 'none'}; flex-direction: column; gap: 5px; margin-top: 10px;"><div class="inv-row"><input type="text" class="inv-input" style="flex: 2; font-weight: bold;" placeholder="Habilidade" value="${spell.nome}" onchange="updateSpell(${index}, 'nome', this.value)"><input type="text" class="inv-input" style="flex: 1;" placeholder="Mana" value="${spell.custo}" onchange="updateSpell(${index}, 'custo', this.value)"><input type="text" class="inv-input" style="flex: 1;" placeholder="Alcance" value="${spell.alcance}" onchange="updateSpell(${index}, 'alcance', this.value)"></div><div class="inv-row" style="margin-top: 5px;"><textarea class="inv-input" style="flex: 1; resize: vertical;" rows="1" placeholder="Descrição e Efeitos..." onchange="updateSpell(${index}, 'desc', this.value)">${spell.desc}</textarea></div><div class="inv-row"><span style="font-size:16px;">🎵</span><input type="text" class="inv-input" style="flex: 1; border-color: #555;" placeholder="URL de Áudio Customizado (Discord Link .mp3)" value="${spell.audioUrl}" onchange="updateSpell(${index}, 'audioUrl', this.value)"></div><div class="dice-config-row"><select class="inv-input dice-sel" style="width:100% !important;" onchange="updateSpell(${index}, 'tipo', this.value); window.renderSpells();"><option value="Dano" ${spell.tipo==='Dano'?'selected':''}>Dano (Base + Runas Globais)</option><option value="Controle" ${spell.tipo==='Controle'?'selected':''}>Controle (Base + Runas Globais)</option><option value="Locomoção" ${spell.tipo==='Locomoção'?'selected':''}>Locomoção (Base + Runas Globais)</option><option value="Self" ${spell.tipo==='Self'?'selected':''}>Self (Apenas Efeito)</option></select>${(!isSelf) ? `<div class="dice-group"><span class="lbl" style="color:#fff">Base</span><input type="number" class="inv-input dice-qty" min="1" value="${spell.bQtd}" onchange="updateSpell(${index}, 'bQtd', this.value)"><select class="inv-input dice-sel" onchange="updateSpell(${index}, 'bD', this.value)"><option value="d4" ${spell.bD==='d4'?'selected':''}>d4</option><option value="d6" ${spell.bD==='d6'?'selected':''}>d6</option><option value="d8" ${spell.bD==='d8'?'selected':''}>d8</option><option value="d10" ${spell.bD==='d10'?'selected':''}>d10</option><option value="d12" ${spell.bD==='d12'?'selected':''}>d12</option><option value="d20" ${spell.bD==='d20'?'selected':''}>d20</option><option value="d100" ${spell.bD==='d100'?'selected':''}>d100</option></select><div class="mult-group"><span class="mult-btn m-red ${spell.bMult===0?'active':''}" onclick="updateSpell(${index}, 'bMult', 0)">X</span><span class="mult-btn m-white ${spell.bMult===0.5?'active':''}" onclick="updateSpell(${index}, 'bMult', 0.5)">X</span><span class="mult-btn m-green ${spell.bMult===1?'active':''}" onclick="updateSpell(${index}, 'bMult', 1)">X</span></div></div><div style="display:flex; align-items:center; gap:5px; margin-left: auto; width: 100%; justify-content: flex-end; margin-top: 5px;"><input type="checkbox" id="crit-${index}" ${spell.isCrit ? 'checked' : ''} onchange="updateSpell(${index}, 'isCrit', this.checked)"><label for="crit-${index}" style="color:#ffd700; margin:0; cursor:pointer;">Crítico (Base Máx x3)</label></div>` : ''}</div><div class="dice-config-row" style="margin-top: 5px; border-color: #a855f7;"><div style="display: flex; width: 100%; align-items: center; gap: 5px;"><span style="color:#a855f7; font-size: 11px; font-weight: bold; white-space: nowrap;">⚡ Status/Efeito</span><input type="text" class="inv-input" style="flex: 2;" placeholder="Ex: Queimar" value="${spell.statusName}" onchange="updateSpell(${index}, 'statusName', this.value)"><span style="color:#fff; font-size: 11px; font-weight: bold;">DT:</span><input type="number" class="inv-input dice-qty" placeholder="15" value="${spell.statusDT}" onchange="updateSpell(${index}, 'statusDT', this.value)"></div></div></div>`;
        row.innerHTML = headerHtml + bodyHtml; container.appendChild(row);
    });
}
window.addSpell = function() { playerSpells.push({ nome: "", desc: "", custo: "", alcance: "", tipo: "Dano", bQtd: 1, bD: "d20", bMult: 1, isOpen: true, isCrit: false, statusName: "", statusDT: "", audioUrl: "" }); window.renderSpells(); window.saveData(); }
window.updateSpell = function(index, field, value) { playerSpells[index][field] = value; window.saveData(); window.renderSpells(); }
window.removeSpell = function(index) { if(confirm("Remover magia?")) { playerSpells.splice(index, 1); window.renderSpells(); window.saveData(); } }

window.rollSpellMagic = function(index) {
    const spell = playerSpells[index];
    if(!spell) return;
    const charName = document.getElementById('char-name').value || 'Desconhecido';
    const charColor = document.getElementById('char-color') ? document.getElementById('char-color').value : '#d4af37';
    let c = characters[currentCharId];
    const rolar = (qtd, tDado) => {
        if (!qtd || qtd <= 0 || !tDado) return []; let faces = parseInt(tDado.replace('d', ''));
        let res = []; for(let i=0; i<qtd; i++) res.push(Math.floor(Math.random() * faces) + 1); return res;
    }
    let bRolls = [], bTot = 0;
    if(spell.tipo !== 'Self') {
        if(spell.isCrit) { let faces = parseInt(spell.bD.replace('d', '')); bRolls = [faces * parseInt(spell.bQtd) * 3]; } else { bRolls = rolar(spell.bQtd, spell.bD); }
        bTot = Math.floor(bRolls.reduce((a,b)=>a+b, 0) * spell.bMult);
    }
    let runesPack = [];
    if(spell.tipo !== 'Self' && c.activeRunes) {
        runesPack = c.activeRunes.map(r => {
            let rl = rolar(1, r.face); let somaDados = rl.reduce((a,b)=>a+b, 0); let fixo = parseInt(r.fixo) || 0;
            return { t: r.type, f: r.face, m: r.mult, r: rl, fixo: fixo, tot: Math.floor((somaDados + fixo) * r.mult) };
        });
    }
    let stRoll = (spell.statusName && spell.statusDT > 0) ? Math.floor(Math.random() * 20) + 1 : 0;

    const payload = {
        t: "spell", av: document.getElementById('char-avatar').value, c: charName, col: charColor, sn: spell.nome || "Habilidade", cost: spell.custo || "0", rg: spell.alcance || "Self", desc: spell.desc || "", st: spell.tipo || "Dano",
        b: { f: spell.bD, m: spell.bMult, r: bRolls, tot: bTot }, ru: runesPack, crit: spell.isCrit ? "true" : "false", stName: spell.statusName || "", stDT: spell.statusDT || "0", stRoll: stRoll, audio: spell.audioUrl || ""
    };

    window.abrirModalCentral(payload);
    window.addCombatLog(payload);
    if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);
    
    if(spell.isCrit) spell.isCrit = false;
    c.activeRunes = []; c.alloc = {f:0, m:0, a:0, s:0};
    safeSetVal('alloc-forca', 0); safeSetVal('alloc-magia', 0); safeSetVal('alloc-agilidade', 0); safeSetVal('alloc-sorte', 0);
    window.renderGlobalRunes(); window.renderSpells(); window.saveData();
}

window.renderInventory = function() {
    const container = document.getElementById('inventory-container'); container.innerHTML = '';
    playerInventory.forEach((item, index) => {
        let row = document.createElement('div'); row.className = 'inv-item';
        row.innerHTML = `<div class="inv-row"><input type="text" class="inv-input" style="flex: 2;" placeholder="Item" value="${item.nome}" onchange="updateInv(${index}, 'nome', this.value)"><input type="number" class="inv-input" style="flex: 1;" placeholder="Peso" value="${item.peso}" onchange="updateInv(${index}, 'peso', this.value)"><input type="number" class="inv-input" style="flex: 1;" placeholder="Qtd" value="${item.qtd}" onchange="updateInv(${index}, 'qtd', this.value)"><button class="btn-danger" onclick="removeInv(${index})">X</button></div><div class="inv-row" style="margin-top: 5px;"><input type="text" class="inv-input" style="flex: 1;" placeholder="Descrição..." value="${item.desc}" onchange="updateInv(${index}, 'desc', this.value)"></div>`;
        container.appendChild(row);
    });
    window.calcVitals();
}
window.addInventoryItem = function() { if(isOverweight) return alert("Sua mochila está pesada!"); playerInventory.push({ nome: "", desc: "", peso: 0, qtd: 1 }); window.renderInventory(); window.saveData(); }
window.updateInv = function(index, field, value) { playerInventory[index][field] = value; window.renderInventory(); window.saveData(); }
window.removeInv = function(index) { playerInventory.splice(index, 1); window.renderInventory(); window.saveData(); }

window.saveData = async function() {
    if (!currentCharId) return; 
    let isMonster = document.getElementById('char-category')?.value === 'Monstros';
    
    let al = { f: parseInt(document.getElementById('alloc-forca').value)||0, m: parseInt(document.getElementById('alloc-magia').value)||0, a: parseInt(document.getElementById('alloc-agilidade').value)||0, s: parseInt(document.getElementById('alloc-sorte').value)||0 };
    const sheetData = {
        name: document.getElementById('char-name')?.value || "Sem Nome", avatar: document.getElementById('char-avatar')?.value || "🧙‍♂️", color: document.getElementById('char-color')?.value || "#d4af37", category: document.getElementById('char-category')?.value || "Jogadores",
        age: document.getElementById('char-age')?.value || "", race: isMonster ? document.getElementById('char-race-monster').value : document.getElementById('char-race-player').value,
        classe: document.getElementById('char-class')?.value || "Plebeu", prof: document.getElementById('char-prof')?.value || "", profDesc: document.getElementById('char-prof-desc')?.value || "",
        vidaMonster: document.getElementById('val-vida-monster')?.value || 100, forca: document.getElementById('attr-forca')?.value || 1, magia: document.getElementById('attr-magia')?.value || 1, agilidade: document.getElementById('attr-agilidade')?.value || 1, sorte: document.getElementById('attr-sorte')?.value || 1,
        grimoireSelect: document.getElementById('grimoire-select')?.value || "", grimoireDT: document.getElementById('grimoire-dt')?.value || 10, mana: document.getElementById('mana-zone')?.value || "", passiva: document.getElementById('passiva')?.value || "", 
        mov: document.getElementById('char-mov')?.value || 30, runas: document.getElementById('char-runas')?.value || 0,
        skills: playerSkills, inventory: playerInventory, spells: playerSpells, photo: currentPhoto, activeRunes: characters[currentCharId] ? characters[currentCharId].activeRunes : [], alloc: al
    };
    characters[currentCharId] = sheetData;
    try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}

    if (OBR.isAvailable) await OBR.room.setMetadata({ [`fatesheet_char_${currentCharId}`]: sheetData });
}

window.renderSkills = function() {
    const container = document.getElementById('skills-container'); container.innerHTML = '';
    skillsData.forEach(skill => {
        if (playerSkills[skill.name] === undefined) playerSkills[skill.name] = 0;
        let controls = `<button class="btn-ctrl" onclick="updateSkill('${skill.name}', -1, event)">-</button><span style="width: 20px; text-align: center;">${playerSkills[skill.name]}</span><button class="btn-ctrl" onclick="updateSkill('${skill.name}', 1, event)">+</button>`;
        let div = document.createElement('div'); div.className = 'skill-item';
        div.innerHTML = `<div onclick="rollSkill('${skill.name}', '${skill.attr}')" style="flex:1;"><strong>${skill.name}</strong> <span style="font-size: 10px; color: var(--text-muted);">(${skill.attr})</span></div><div class="skill-controls">${controls}</div>`;
        container.appendChild(div);
    });
}
window.updateSkill = function(skillName, change, event) { event.stopPropagation(); playerSkills[skillName] += change; if (playerSkills[skillName] < 0) playerSkills[skillName] = 0; window.renderSkills(); window.saveData(); }

window.rollSkill = function(skillName, attrName) {
    let idMapped = attrName.toLowerCase().replace('ç', 'c'); let baseAttr = parseInt(document.getElementById(`attr-${idMapped}`).value) || 1;
    let classe = document.getElementById('char-class').value; let isMonster = document.getElementById('char-category').value === 'Monstros';
    
    if(!isMonster) {
        if (classe === 'Plebeu') { if(attrName === 'Força') baseAttr += 1; if(attrName === 'Magia') baseAttr -= 1; }
        if (classe === 'Andarilho' && attrName === 'Agilidade') baseAttr += 1;
        if (classe === 'Estrangeiro' && attrName === 'Sorte') baseAttr += 1;
        if (classe === 'Nobre' && attrName === 'Magia') baseAttr += 1;
    }
    if(baseAttr < 1) baseAttr = 1;
    let results = []; for (let i = 0; i < baseAttr; i++) { let die = Math.floor(Math.random() * 20) + 1; if (isOverweight) die -= 5; results.push(die); }
    
    const payload = { t: "skill", av: document.getElementById('char-avatar').value, c: document.getElementById('char-name').value || 'Desconhecido', s: skillName, a: attrName, r: results.join(','), pen: isOverweight ? "true" : "false", col: document.getElementById('char-color').value || '#d4af37', mod: playerSkills[skillName] || 0 };

    window.abrirModalCentral(payload);
    window.addCombatLog(payload);
    if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);
}

window.abrirModalCentral = function(data) {
    if (OBR.isAvailable) {
        const dataUrl = encodeURIComponent(JSON.stringify(data));
        OBR.modal.open({ id: "fate-roll-modal", url: `https://seediam.github.io/FateSheet/resultado.html?data=${dataUrl}`, width: 450, height: (data.t === "spell" || data.t === "attr") ? 550 : 250 });
    }
}

function processRoomData(metadata) {
    let mudouAlgo = false;
    
    // --- NOVO BANCO DE LOG (v2) PRA LIMPAR O CORROMPIDO ---
    if (metadata["fatesheet_log_v2"] !== undefined) {
        combatLog = metadata["fatesheet_log_v2"];
    }

    for (let key in metadata) {
        if (key.startsWith('fatesheet_char_')) {
            const id = key.replace('fatesheet_char_', '');
            if (metadata[key] === undefined || metadata[key] === null) {
                if(characters[id]) { delete characters[id]; mudouAlgo = true; }
            } else { characters[id] = metadata[key]; mudouAlgo = true; }
        }
    }
    if (mudouAlgo) window.renderCharacterList();
}

function initExtension() {
    try {
        const saved = localStorage.getItem('fatesheet_db');
        if (saved) characters = JSON.parse(saved);
        window.renderCharacterList();
    } catch(e) {}

    if (OBR.isAvailable) {
        OBR.onReady(async () => {
            try {
                const meta = await OBR.room.getMetadata();
                processRoomData(meta);
                OBR.room.onMetadataChange((metadata) => processRoomData(metadata));
            } catch(e) {}
        });
    }
}
