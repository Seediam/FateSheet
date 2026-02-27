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
    "Constrição": "🧊 Constrição — Passiva: Pressão Constante\nSe um alvo estiver sob qualquer condition negativa aplicada por você, ele sofre -1 adicional em testes.\nSe tentar remover um efeito seu e falhar, recebe 1d6 de dano.",
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
let isLoadingSheet = false; 
let playerSkills = {}; 
let playerInventory = [];
let playerSpells = []; 
let currentPhoto = "";
let folderState = { "Jogadores": true, "NPCs": true, "Monstros": true };
let isOverweight = false;
let pendingSpellIndex = null; 
let myPlayerName = "Jogador";

// TELA INICIAL
document.getElementById('loading').style.display = 'none';
document.getElementById('app').style.display = 'block';
initExtension();

window.openTab = function(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    if(event) event.currentTarget.classList.add('active');
    if(tabName === 'combate-tab') window.renderCombatTracker();
}

window.backToList = async function() {
    await window.saveData();
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
        categories[cat].push({ id: id, name: char.name || "Sem Nome", av: char.avatar || "🧙‍♂️" });
    }

    let hasAny = false;
    for (let cat in categories) {
        if (categories[cat].length > 0) {
            hasAny = true;
            let isOpen = folderState[cat];
            let html = `<div class="folder-header" onclick="window.toggleFolder('${cat}')"><span class="chevron">${isOpen ? '▼' : '►'}</span> 📁 ${cat}</div><div class="folder-content" style="display: ${isOpen ? 'flex' : 'none'};">`;
            categories[cat].forEach(char => {
                html += `<div class="char-list-item" onclick="window.openCharacter('${char.id}')">
                            <div style="display:flex; align-items:center;">
                                <span style="font-size:18px;">${char.av}</span> 
                                <span style="margin-left:8px;">${char.name}</span>
                            </div>
                         </div>`;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
    }
    if(!hasAny) container.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">A Mesa está vazia.</div>';
}

window.createNewCharacter = function() {
    const newId = 'char_' + Date.now();
    characters[newId] = { name: "Novo Personagem", avatar: "🧙‍♂️", category: "Jogadores", classe: "Plebeu", skills: {}, inventory: [], spells: [], color: "#d4af37", mov: 30, runas: 0, activeRunes: [], alloc: {f:0, m:0, a:0, s:0}, foraCombate: false, inGame: false, hpAtual: 40, mpAtual: 25, hasRolledTurn: false, initiative: 0, shieldFis: 0, shieldMag: 0, playerName: myPlayerName };
    window.saveData(); 
    window.openCharacter(newId);
}

window.deleteCharacter = async function() {
    if(confirm("Apagar esta ficha permanentemente para TODOS na mesa?")) {
        const idToDelete = currentCharId;
        delete characters[idToDelete]; 
        if (OBR.isAvailable) await OBR.room.setMetadata({ [`fatesheet_char_${idToDelete}`]: undefined });
        currentCharId = null;
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
            characters[newId] = importedData;
            window.saveData();
            alert("Ficha importada com sucesso!");
        } catch(err) { alert("Erro ao ler JSON."); }
    };
    reader.readAsText(file);
}

const safeSetVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
const safeSetCheck = (id, val) => { const el = document.getElementById(id); if(el) el.checked = val; };

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
    window.calcVitals(); window.saveData();
}

window.openCharacter = function(id) {
    try {
        isLoadingSheet = true;
        currentCharId = id;
        const c = characters[id] || {};
        
        c.playerName = myPlayerName; // Marca o nome de quem abriu
        
        try{ safeSetVal('char-avatar', c.avatar || '🧙‍♂️'); }catch(e){}
        try{ safeSetVal('char-name', c.name || ''); }catch(e){}
        try{ safeSetVal('char-color', c.color || '#d4af37'); document.documentElement.style.setProperty('--accent-gold', c.color || '#d4af37'); }catch(e){}
        try{ safeSetVal('char-category', c.category || 'Jogadores'); }catch(e){}
        try{ safeSetVal('char-age', c.age || ''); }catch(e){}
        try{ safeSetVal('char-class', c.classe || 'Plebeu'); }catch(e){}
        try{ safeSetVal('char-prof', c.prof || ''); }catch(e){}
        try{ if(c.category === 'Monstros') safeSetVal('char-race-monster', c.race || 'Terrestres'); else safeSetVal('char-race-player', c.race || 'Humano'); }catch(e){}
        
        try{ safeSetVal('char-hp-atual', c.hpAtual !== undefined ? c.hpAtual : 40); }catch(e){}
        try{ safeSetVal('char-mp-atual', c.mpAtual !== undefined ? c.mpAtual : 25); }catch(e){}
        try{ safeSetVal('val-vida-monster', c.vidaMonster || 100); }catch(e){}
        try{ safeSetVal('attr-forca', c.forca || 1); safeSetVal('attr-magia', c.magia || 1); safeSetVal('attr-agilidade', c.agilidade || 1); safeSetVal('attr-sorte', c.sorte || 1); }catch(e){}
        try{ safeSetVal('grimoire-select', c.grimoireSelect || ''); safeSetVal('grimoire-dt', c.grimoireDT || 10); safeSetVal('mana-zone', c.mana || ''); safeSetVal('passiva', c.passiva || ''); }catch(e){}
        try{ safeSetVal('char-mov', c.mov || 30); safeSetVal('char-runas', c.runas || 0); }catch(e){}
        
        try{ safeSetCheck('fora-combate', c.foraCombate || false); safeSetCheck('char-ingame', c.inGame || false); }catch(e){}
        
        try{
            let al = c.alloc || {f:0, m:0, a:0, s:0};
            safeSetVal('alloc-forca', al.f); safeSetVal('alloc-magia', al.m); safeSetVal('alloc-agilidade', al.a); safeSetVal('alloc-sorte', al.s);
        }catch(e){}

        playerSkills = c.skills || {}; playerInventory = c.inventory || []; playerSpells = c.spells || []; 
        
        try{ window.updateCategoryUI(); }catch(e){}
        try{ window.renderSkills(); }catch(e){}
        try{ window.renderInventory(); }catch(e){}
        try{ window.renderCombatTracker(); }catch(e){}
        try{ window.renderGlobalRunes(); }catch(e){}
        try{ window.renderSpells(); }catch(e){}
        try{ window.calcVitals(); }catch(e){}
        try{ window.updateAlloc(); }catch(e){}

        document.getElementById('screen-list').classList.remove('active');
        document.getElementById('screen-sheet').classList.add('active');
        
        window.saveData(); // Salva para a nuvem saber que eu abri
    } catch(e) { console.error("Falha ao abrir ficha:", e); alert("Houve um erro na ficha, verifique o console."); } finally {
        isLoadingSheet = false;
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

// ------ COMBAT TRACKER INLINE (O CORAÇÃO DO COMBATE TÁTICO) ------
window.renderCombatTracker = function() {
    const container = document.getElementById('combat-tracker-list');
    if(!container) return;
    
    let combatants = [];
    for(let k in characters) {
        if(characters[k].inGame) {
            characters[k].id = k; // Injeta a ID para garantir que o ataque ache o alvo!
            combatants.push(characters[k]);
        }
    }
    combatants.sort((a, b) => (b.initiative || 0) - (a.initiative || 0)); 

    let html = '';
    
    combatants.forEach((c, idx) => {
        let hpM = c.category==='Monstros' ? (c.vidaMonster||100) : (40 + (c.sorte||0)*5);
        let mpM = c.category==='Monstros' ? 25 : 25 + (c.classe==='Andarilho'?25:c.classe==='Estrangeiro'?50:c.classe==='Nobre'?75:0);
        let positionTag = c.hasRolledTurn ? `<span style="font-size:10px; color:var(--accent-gold); font-weight:bold; background:#000; padding:2px 4px; border-radius:3px;">${idx + 1}º a Atacar</span>` : `<span style="font-size:10px; color:#888; font-weight:bold; background:#000; padding:2px 4px; border-radius:3px;">⌛ Pendente</span>`;
        let playerNameTag = c.playerName ? `<span style="font-size:10px; color:#888; margin-left:8px;">(🎮 ${c.playerName})</span>` : '';

        // ESCUDOS ATIVOS DO TURNO (A Defesa Manual)
        let shieldFis = c.shieldFis || 0;
        let shieldMag = c.shieldMag || 0;
        let shieldDisplay = '';
        if (shieldFis > 0 || shieldMag > 0) {
            shieldDisplay = `<div style="font-size:11px; color:#aaa; margin-top:4px;">🛡️ <span style="color:#ff4444">${shieldFis} DF</span> | <span style="color:#44aaff">${shieldMag} DM</span></div>`;
        }

        // ESPADINHA RELÂMPAGO DO ATAQUE
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

        // RUNAS NA TELA PARA QUEIMAR E VIRAR ESCUDO (Visíveis para a própria pessoa)
        let runesHtml = '';
        if (c.activeRunes && c.activeRunes.length > 0) {
            runesHtml = `<div style="margin-top: 6px; display: flex; gap: 4px; flex-wrap: wrap;">`;
            c.activeRunes.forEach((r, rIdx) => {
                let color = r.type === 'alpha' ? '#44aaff' : (r.type === 'delta' ? '#ff4444' : '#a855f7');
                let symbol = r.type === 'alpha' ? 'α' : (r.type === 'delta' ? 'δ' : 'β');
                let onClick = (c.id === currentCharId) ? `onclick="window.converterRunaEmDefesa('${c.id}', ${rIdx})"` : '';
                let cursor = (c.id === currentCharId) ? 'cursor:pointer; box-shadow: 0 0 5px '+color+';' : 'cursor:default; opacity:0.7;';
                runesHtml += `<button style="background:#111; color:${color}; border:1px solid ${color}; border-radius:4px; padding:4px 8px; font-size:12px; font-weight:bold; ${cursor} margin-right:4px;" ${onClick} title="${c.id === currentCharId ? 'Clique para queimar e virar Escudo!' : 'Runa Ativa'}">${symbol} ${r.face} ${c.id === currentCharId ? '<span style="color:#ff4444; margin-left:4px;">✖</span>' : ''}</button>`;
            });
            runesHtml += `</div>`;
        }

        html += `<div style="background:var(--bg-panel); padding:10px; margin-bottom:8px; border-left:4px solid ${c.color || '#fff'}; border-radius:4px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">${c.avatar || '🧙‍♂️'}</span> 
                    <div>
                        <b style="font-size:14px; color:var(--accent-gold);">${c.name}</b> ${playerNameTag}<br>${positionTag}
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
        characters[id].hasRolledTurn = false; 
        characters[id].initiative = 0; 
        characters[id].shieldFis = 0;
        characters[id].shieldMag = 0;
        updates[`fatesheet_char_${id}`] = JSON.parse(JSON.stringify(characters[id]));
    }
    if (OBR.isAvailable) await OBR.room.setMetadata(updates);
    window.renderCombatTracker();
}

window.converterRunaEmDefesa = async function(id, rIdx) {
    try {
        let c = characters[id]; if(!c || !c.activeRunes || !c.activeRunes[rIdx]) return;
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
        if (OBR.isAvailable) await OBR.room.setMetadata({ [`fatesheet_char_${id}`]: JSON.parse(JSON.stringify(c)) });

        window.renderCombatTracker();
        window.renderGlobalRunes();
    } catch(e) { console.error(e); }
}

// ------ O ATAQUE DIRETO COM ESPADA ------
window.toggleTargetMode = function(index) {
    let cb = document.getElementById('fora-combate'); let isFora = cb ? cb.checked : false;
    if (!isFora) {
        let inCombatChars = [];
        for(let k in characters) { if(characters[k].inGame) inCombatChars.push(characters[k]); }
        let missing = inCombatChars.filter(ch => !ch.hasRolledTurn);
        if (missing.length > 0) { 
            alert("Aguarde as seguintes fichas rolarem os atributos de turno:\n" + missing.map(m=>m.name).join(', ')); 
            return; 
        }
    }

    const spell = playerSpells[index];
    if (pendingSpellIndex === index) {
        pendingSpellIndex = null; // desmarca se clicar 2x
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
        
        if (!attacker) { alert("Atacante não encontrado!"); return; }
        if (!tgt) { alert("Alvo não encontrado!"); return; }

        let isFora = document.getElementById('fora-combate') ? document.getElementById('fora-combate').checked : false;
        
        let manaCost = parseInt(spell.custo) || 0;
        if (manaCost > 0) {
            if ((attacker.mpAtual||0) < manaCost) { if(!confirm("Mana insuficiente! Deseja castar a magia mesmo assim?")) return; } 
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
            
            // ABATE DOS ESCUDOS DO ALVO
            let totalShield = (tgt.shieldFis || 0) + (tgt.shieldMag || 0); 
            let netDamage = Math.max(0, grossDamage - totalShield);

            if (totalShield > 0) {
                tgt.shieldFis = 0; tgt.shieldMag = 0; // Consome os escudos após defender
            }

            tgt.hpAtual = (tgt.hpAtual || 0) - netDamage;
            payload.gross = grossDamage;
            payload.blocked = Math.min(grossDamage, totalShield);
            payload.net = netDamage;
        } else {
            payload.t = "spell";
        }

        // Limpa runas do atacante
        attacker.activeRunes = []; attacker.alloc = {f:0, m:0, a:0, s:0}; 
        if(currentCharId === attacker.id) {
            safeSetVal('alloc-forca', 0); safeSetVal('alloc-magia', 0); safeSetVal('alloc-agilidade', 0); safeSetVal('alloc-sorte', 0);
        }
        if(spell.isCrit) spell.isCrit = false;
        
        pendingSpellIndex = null;

        // SALVA AMBOS NA NUVEM
        characters[currentCharId] = attacker;
        characters[targetId] = tgt;
        
        let updates = {};
        updates[`fatesheet_char_${currentCharId}`] = JSON.parse(JSON.stringify(attacker));
        if (currentCharId !== targetId) { updates[`fatesheet_char_${targetId}`] = JSON.parse(JSON.stringify(tgt)); }
        
        if (OBR.isAvailable) await OBR.room.setMetadata(updates);

        // EXPLODE O NEON NA TELA PARA TODOS VEREM
        try { window.abrirModalCentral(payload); } catch(e){}
        window.addCombatLog(payload);
        if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);
        
        window.renderGlobalRunes(); window.renderSpells(); window.renderCombatTracker();
        window.openTab('personagem'); 
        
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

window.saveData = async function() {
    if (isLoadingSheet) return; 
    if (!currentCharId) return; 
    
    try {
        let oldC = characters[currentCharId] || {};
        let c = { ...oldC };
        
        if (document.getElementById('screen-sheet').classList.contains('active')) {
            c.hpAtual = parseInt(document.getElementById('char-hp-atual')?.value) || 0;
            c.mpAtual = parseInt(document.getElementById('char-mp-atual')?.value) || 0;
            c.runas = parseInt(document.getElementById('char-runas')?.value) || 0;
            c.inGame = document.getElementById('char-ingame')?.checked || false;
            c.foraCombate = document.getElementById('fora-combate')?.checked || false;
            
            let isMonster = document.getElementById('char-category')?.value === 'Monstros';
            let al = { f: parseInt(document.getElementById('alloc-forca').value)||0, m: parseInt(document.getElementById('alloc-magia').value)||0, a: parseInt(document.getElementById('alloc-agilidade').value)||0, s: parseInt(document.getElementById('alloc-sorte').value)||0 };
            
            c.name = document.getElementById('char-name')?.value || "Sem Nome"; c.avatar = document.getElementById('char-avatar')?.value || "🧙‍♂️"; c.color = document.getElementById('char-color')?.value || "#d4af37"; c.category = document.getElementById('char-category')?.value || "Jogadores";
            c.age = document.getElementById('char-age')?.value || ""; c.race = isMonster ? document.getElementById('char-race-monster').value : document.getElementById('char-race-player').value;
            c.classe = document.getElementById('char-class')?.value || "Plebeu"; c.prof = document.getElementById('char-prof')?.value || ""; c.profDesc = document.getElementById('char-prof-desc')?.value || "";
            c.vidaMonster = document.getElementById('val-vida-monster')?.value || 100; c.forca = document.getElementById('attr-forca')?.value || 1; c.magia = document.getElementById('attr-magia')?.value || 1; c.agilidade = document.getElementById('attr-agilidade')?.value || 1; c.sorte = document.getElementById('attr-sorte')?.value || 1;
            c.grimoireSelect = document.getElementById('grimoire-select')?.value || ""; c.grimoireDT = document.getElementById('grimoire-dt')?.value || 10; c.mana = document.getElementById('mana-zone')?.value || ""; c.passiva = document.getElementById('passiva')?.value || ""; 
            c.mov = document.getElementById('char-mov')?.value || 30; c.alloc = al; 
        }
        
        c.shieldFis = oldC.shieldFis || 0;
        c.shieldMag = oldC.shieldMag || 0;
        c.initiative = oldC.initiative || 0;
        c.hasRolledTurn = oldC.hasRolledTurn || false;
        c.playerName = myPlayerName || "Jogador";
        
        c.skills = playerSkills; c.inventory = playerInventory; c.spells = playerSpells; c.photo = currentPhoto; 
        
        characters[currentCharId] = c;
        try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}
        if (OBR.isAvailable) await OBR.room.setMetadata({ [`fatesheet_char_${currentCharId}`]: JSON.parse(JSON.stringify(characters[currentCharId])) });
    } catch(e) { console.error("Erro no save:", e); }
}

let saveTimeout;
document.addEventListener('input', (e) => {
    if(e.target.id && e.target.id.startsWith('alloc')) return; 
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => { if(currentCharId) window.saveData(); }, 800);
});

window.rollSkill = function(skillName, attrName) {
    let idMapped = attrName.toLowerCase().replace('ç', 'c'); let baseAttr = parseInt(document.getElementById(`attr-${idMapped}`)?.value) || 1;
    let classe = document.getElementById('char-class')?.value || 'Plebeu'; let isMonster = document.getElementById('char-category')?.value === 'Monstros';
    let isFora = document.getElementById('fora-combate') ? document.getElementById('fora-combate').checked : false;

    if (!isFora) {
        let inCombatChars = [];
        for(let k in characters) { if(characters[k].inGame) inCombatChars.push(characters[k]); }
        let missing = inCombatChars.filter(ch => !ch.hasRolledTurn);
        if (missing.length > 0) { alert("Aguarde as seguintes fichas rolarem os atributos de turno:\n" + missing.map(m=>m.name).join(', ')); return; }
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
    if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);
}

window.abrirModalCentral = async function(data) {
    if (OBR.isAvailable) {
        const dataUrl = encodeURIComponent(JSON.stringify(data));
        try { await OBR.modal.close("fate-roll-modal").catch(()=>{}); } catch(e) {}
        setTimeout(() => {
            try { OBR.modal.open({ id: "fate-roll-modal", url: `https://seediam.github.io/FateSheet/resultado.html?data=${dataUrl}`, width: 450, height: (data.t === "spell" || data.t === "attr" || data.t === "clash_result") ? 550 : 250 }); } catch(e) {}
        }, 100);
    }
}

function processRoomData(metadata) {
    let mudouAlgo = false;
    
    if (metadata["fatesheet_log_v28"] !== undefined) { combatLog = metadata["fatesheet_log_v28"]; window.renderMiniLog(); }

    for (let key in metadata) {
        if (key.startsWith('fatesheet_char_')) {
            const id = key.replace('fatesheet_char_', '');
            if (metadata[key] === undefined || metadata[key] === null) {
                if(characters[id]) { delete characters[id]; mudouAlgo = true; }
            } else { 
                let isTyping = document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA");
                if (currentCharId === id && isTyping) { 
                    // Se estiver digitando, puxa da nuvem SOMENTE a vida, mana e runas pra não perder dano!
                    characters[id].hpAtual = metadata[key].hpAtual;
                    characters[id].mpAtual = metadata[key].mpAtual;
                    characters[id].shieldFis = metadata[key].shieldFis;
                    characters[id].shieldMag = metadata[key].shieldMag;
                    characters[id].activeRunes = metadata[key].activeRunes;
                    mudouAlgo = true;
                } else {
                    characters[id] = metadata[key]; mudouAlgo = true; 
                }
            }
        }
    }
    
    if (mudouAlgo) {
        try { window.renderCharacterList(); } catch(e){}
        try { window.renderCombatTracker(); } catch(e){}
        
        if (currentCharId && document.getElementById('screen-sheet').classList.contains('active') && !isLoadingSheet) {
            let hpF = document.getElementById('char-hp-atual'); if (hpF && document.activeElement !== hpF) hpF.value = characters[currentCharId].hpAtual || 0;
            let mpF = document.getElementById('char-mp-atual'); if (mpF && document.activeElement !== mpF) mpF.value = characters[currentCharId].mpAtual || 0;
            let runF = document.getElementById('char-runas'); if (runF && document.activeElement !== runF) runF.value = characters[currentCharId].runas || 0;
        }
    }
}

function initExtension() {
    try { const saved = localStorage.getItem('fatesheet_db'); if (saved) characters = JSON.parse(saved); window.renderCharacterList(); } catch(e) {}
    if (OBR.isAvailable) {
        OBR.onReady(async () => {
            try { myPlayerName = await OBR.player.getName() || "Jogador"; } catch(e){}
            try {
                processRoomData(await OBR.room.getMetadata());
                OBR.room.onMetadataChange((metadata) => processRoomData(metadata));
                OBR.broadcast.onMessage("fatesheet-log-update", (event) => { combatLog = event.data; window.renderMiniLog(); });
                OBR.broadcast.onMessage("fatesheet-rolls", (event) => { window.abrirModalCentral(event.data); });
            } catch(e) {}
        });
    }
}
