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
let clashes = {}; // Duelos da Nuvem
let activeDefenses = {}; // Duelos locais
let currentCharId = null;
let playerSkills = {}; 
let playerInventory = [];
let playerSpells = []; 
let currentPhoto = "";
let folderState = { "Jogadores": true, "NPCs": true, "Monstros": true };
let isOverweight = false;
let pendingSpellIndex = null; 

// RETIRADO o onload travado. Inicia direto:
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

window.backToList = function() {
    window.saveData();
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
            let html = `<div class="folder-header" onclick="toggleFolder('${cat}')"><span class="chevron">${isOpen ? '▼' : '►'}</span> 📁 ${cat}</div><div class="folder-content" style="display: ${isOpen ? 'flex' : 'none'};">`;
            
            categories[cat].forEach(char => {
                let clashBadge = "";
                if (clashes[char.id]) {
                    clashBadge = `<div style="color:#ff4444; font-size:11px; font-weight:bold; animation: pulseAlert 1.5s infinite; margin-bottom: 4px;">⚠️ ABRIR FICHA PARA DEFENDER!</div>`;
                } else {
                    let isAttacking = Object.values(clashes).find(cls => cls.attackerId === char.id);
                    if (isAttacking) {
                        clashBadge = `<div style="color:var(--accent-gold); font-size:11px; font-weight:bold; margin-bottom: 4px;">⚔️ Atacando ${isAttacking.targetName}...</div>`;
                    }
                }
                
                // Abre a ficha imediatamente (Sem travar com o Cadeado antigo)
                html += `<div class="char-list-item" onclick="window.openCharacter('${char.id}')">
                            ${clashBadge}
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
    characters[newId] = { name: "Novo Personagem", avatar: "🧙‍♂️", category: "Jogadores", classe: "Plebeu", skills: {}, inventory: [], spells: [], color: "#d4af37", mov: 30, runas: 0, activeRunes: [], alloc: {f:0, m:0, a:0, s:0}, foraCombate: false, inGame: false, hpAtual: 40, mpAtual: 25, hasRolledTurn: false, initiative: 0 };
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
            currentCharId = newId;
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
    window.calcVitals(); 
}

// Abertura com Try/Catch e sem Lock!
window.openCharacter = function(id) {
    try {
        currentCharId = id;
        const c = characters[id] || {};
        
        safeSetVal('char-avatar', c.avatar || '🧙‍♂️'); safeSetVal('char-name', c.name || ''); safeSetVal('char-color', c.color || '#d4af37');
        document.documentElement.style.setProperty('--accent-gold', c.color || '#d4af37');
        safeSetVal('char-category', c.category || 'Jogadores'); safeSetVal('char-age', c.age || ''); safeSetVal('char-class', c.classe || 'Plebeu'); safeSetVal('char-prof', c.prof || ''); safeSetVal('char-prof-desc', c.profDesc || '');
        if(c.category === 'Monstros') safeSetVal('char-race-monster', c.race || 'Terrestres'); else safeSetVal('char-race-player', c.race || 'Humano');
        
        safeSetVal('char-hp-atual', c.hpAtual !== undefined ? c.hpAtual : 40);
        safeSetVal('char-mp-atual', c.mpAtual !== undefined ? c.mpAtual : 25);
        safeSetVal('val-vida-monster', c.vidaMonster || 100);
        safeSetVal('attr-forca', c.forca || 1); safeSetVal('attr-magia', c.magia || 1); safeSetVal('attr-agilidade', c.agilidade || 1); safeSetVal('attr-sorte', c.sorte || 1);
        safeSetVal('grimoire-select', c.grimoireSelect || ''); safeSetVal('grimoire-dt', c.grimoireDT || 10); safeSetVal('mana-zone', c.mana || ''); safeSetVal('passiva', c.passiva || ''); 
        safeSetVal('char-mov', c.mov || 30); safeSetVal('char-runas', c.runas || 0); 
        
        safeSetCheck('fora-combate', c.foraCombate || false); safeSetCheck('char-ingame', c.inGame || false);
        
        let al = c.alloc || {f:0, m:0, a:0, s:0};
        safeSetVal('alloc-forca', al.f); safeSetVal('alloc-magia', al.m); safeSetVal('alloc-agilidade', al.a); safeSetVal('alloc-sorte', al.s);

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
    } catch(e) { console.error("Falha na abertura:", e); }
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
    
    let combatants = Object.values(characters).filter(c => c.inGame);
    combatants.sort((a, b) => (b.initiative || 0) - (a.initiative || 0)); 

    let html = '';
    
    combatants.forEach((c, idx) => {
        let hpM = c.category==='Monstros' ? (c.vidaMonster||100) : (40 + (c.sorte||0)*5);
        let mpM = c.category==='Monstros' ? 25 : 25 + (c.classe==='Andarilho'?25:c.classe==='Estrangeiro'?50:c.classe==='Nobre'?75:0);
        let positionTag = c.hasRolledTurn ? `<span style="font-size:10px; color:var(--accent-gold); font-weight:bold; background:#000; padding:2px 4px; border-radius:3px;">${idx + 1}º a Atacar</span>` : `<span style="font-size:10px; color:#888; font-weight:bold; background:#000; padding:2px 4px; border-radius:3px;">⌛ Pendente</span>`;

        let clashHtml = '';
        if (clashes[c.id]) {
            let clash = clashes[c.id];
            
            if (c.id === currentCharId) {
                let defState = activeDefenses[c.id];
                if (!defState) {
                    clashHtml = `
                    <div style="background:#2a0a0a; border:1px dashed #ff4444; padding:8px; margin-top:8px; border-radius:4px; animation: pulseAlert 1.5s infinite;">
                        <div style="color:#ff4444; font-size:12px; margin-bottom:5px;">⚠️ Atacado por <b>${clash.c}</b> (Dano Bruto: ${clash.gross})</div>
                        <div style="display:flex; gap:5px;">
                            <button class="btn-ctrl" style="background:#ff4444; color:#fff; flex:1;" onclick="window.aceitarDano('${c.id}')">Tomar Dano</button>
                            <button class="btn-ctrl" style="background:#44aaff; color:#fff; flex:1;" onclick="window.iniciarDefesa('${c.id}')">Defender</button>
                        </div>
                    </div>`;
                } else {
                    let defFis = (c.forca || 0) * 5; let defMag = (c.magia || 0) * 5; let defHib = Math.floor((defFis + defMag) / 3);
                    let runesHtml = (c.activeRunes || []).map((r, rIdx) => {
                        let cHex = r.type==='alpha' ? '#44aaff' : (r.type==='delta' ? '#ff4444' : (r.type==='beta' ? '#a855f7' : '#ccc'));
                        let sym = r.type==='alpha' ? 'α' : (r.type==='delta' ? 'δ' : (r.type==='beta' ? 'β' : '⚔️'));
                        return `<div style="display:inline-flex; align-items:center; background:#111; border:1px solid ${cHex}; padding:2px 6px; border-radius:4px; margin-right:4px; margin-bottom:4px; font-size:11px;">
                            <span style="color:${cHex}; margin-right:5px;">${sym}</span><span style="color:#fff; margin-right:5px;">${r.face}</span>
                            <button style="background:transparent; border:none; color:#ff4444; font-weight:bold; cursor:pointer;" onclick="window.descartarRunaDefesa('${c.id}', ${rIdx})">X</button>
                        </div>`;
                    }).join('');
                    if(runesHtml === '') runesHtml = '<span style="color:#666; font-size:11px;">Sem runas de defesa ativas.</span>';

                    clashHtml = `
                    <div style="background:#1a1a24; border:1px solid #44aaff; padding:8px; margin-top:8px; border-radius:4px;">
                        <div style="color:#44aaff; font-size:12px; margin-bottom:5px; display:flex; justify-content:space-between;">
                            <span>🛡️ Defendendo <b>${clash.c}</b> (Dano: ${clash.gross})</span>
                            <span>Bloqueado: <b style="color:#39ff14; font-size:14px;">${defState.blocked}</b></span>
                        </div>
                        <select id="def-type-${c.id}" class="inv-input" style="width:100%; margin-bottom:5px;" onchange="window.updateDefType('${c.id}', this.value)">
                            <option value="fisica" ${defState.type==='fisica'?'selected':''}>Defesa Física (${defFis}/runa)</option>
                            <option value="magica" ${defState.type==='magica'?'selected':''}>Defesa Mágica (${defMag}/runa)</option>
                            <option value="hibrida" ${defState.type==='hibrida'?'selected':''}>Defesa Híbrida (${defHib}/runa)</option>
                        </select>
                        <div style="margin-bottom:5px;">${runesHtml}</div>
                        <button class="btn-ctrl" style="background:#39ff14; color:#000; width:100%; margin-top:5px;" onclick="window.confirmarDefesa('${c.id}')">Confirmar Resolução</button>
                    </div>`;
                }
            } else {
                clashHtml = `
                <div style="background:#2a0a0a; border:1px dashed #ff4444; padding:8px; margin-top:8px; border-radius:4px; text-align:center;">
                    <span style="color:#ffaa00; font-size:12px; font-weight:bold; animation: pulseAlert 1.5s infinite;">⚠️ Em Duelo com ${clash.c}...</span>
                </div>`;
            }
        }

        html += `<div style="background:var(--bg-panel); padding:8px; margin-bottom:5px; border-left:4px solid ${c.color || '#fff'}; border-radius:4px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:18px;">${c.avatar || '🧙‍♂️'}</span> 
                    <div><b style="font-size:14px;">${c.name}</b><br>${positionTag}</div>
                </div>
                <div style="font-size:12px; text-align:right;">
                    <span style="color:#ff4444; font-weight:bold;">HP: ${c.hpAtual||0} / ${hpM}</span><br>
                    <span style="color:#44aaff; font-weight:bold;">MP: ${c.mpAtual||0} / ${mpM}</span>
                </div>
            </div>
            ${clashHtml}
        </div>`;
    });
    
    if(html === '') html = '<div style="color:#666; text-align:center; padding: 20px;">Ninguém marcado na Cena de Combate.</div>';
    container.innerHTML = html;
}

window.novaRodadaGlobal = async function() {
    if(!confirm("Iniciar nova rodada? Todos precisarão rolar os Atributos novamente.")) return;
    let updates = {};
    for(let id in characters) { 
        characters[id].hasRolledTurn = false; 
        characters[id].initiative = 0; 
        updates[`fatesheet_char_${id}`] = characters[id];
    }
    if (OBR.isAvailable) await OBR.room.setMetadata(updates);
    window.renderCombatTracker();
}

window.iniciarDefesa = function(id) { activeDefenses[id] = { blocked: 0, type: 'fisica' }; window.renderCombatTracker(); }
window.updateDefType = function(id, val) { if(activeDefenses[id]) activeDefenses[id].type = val; window.renderCombatTracker(); }

window.descartarRunaDefesa = async function(id, rIdx) {
    let c = characters[id]; if(!c) return;
    let st = activeDefenses[id]; if(!st) return;
    
    let defFis = (c.forca || 0) * 5; let defMag = (c.magia || 0) * 5; let defHib = Math.floor((defFis + defMag) / 3);
    if (st.type === 'fisica') st.blocked += defFis; else if (st.type === 'magica') st.blocked += defMag; else st.blocked += defHib;

    c.activeRunes.splice(rIdx, 1);
    await window.saveData(); window.renderCombatTracker();
}

window.aceitarDano = async function(id) {
    let clash = clashes[id]; if(!clash) return;
    let c = characters[id]; if(!c) return;
    
    c.hpAtual = (c.hpAtual || 0) - clash.gross;
    clash.blocked = 0; clash.net = clash.gross; clash.t = 'clash_result';
    
    await window.saveData();
    window.abrirModalCentral(clash); window.addCombatLog(clash);
    if(OBR.isAvailable) {
        OBR.broadcast.sendMessage("fatesheet-rolls", clash);
        await OBR.room.setMetadata({ [`fatesheet_clash_${id}`]: undefined });
    }
    delete clashes[id]; window.renderCombatTracker(); window.renderCharacterList();
}

window.confirmarDefesa = async function(id) {
    let clash = clashes[id]; if(!clash) return;
    let c = characters[id]; if(!c) return;
    let st = activeDefenses[id]; if(!st) return;

    let netDamage = Math.max(0, clash.gross - st.blocked);
    c.hpAtual = (c.hpAtual || 0) - netDamage;
    
    clash.blocked = st.blocked; clash.net = netDamage; clash.t = 'clash_result';
    
    await window.saveData();
    window.abrirModalCentral(clash); window.addCombatLog(clash);
    if(OBR.isAvailable) {
        OBR.broadcast.sendMessage("fatesheet-rolls", clash);
        await OBR.room.setMetadata({ [`fatesheet_clash_${id}`]: undefined });
    }
    delete activeDefenses[id]; delete clashes[id]; window.renderCombatTracker(); window.renderCharacterList();
}

window.updateAlloc = function() {
    let cb = document.getElementById('fora-combate'); let isFora = cb ? cb.checked : false;
    let bdg = document.getElementById('char-fc-badge'); if(bdg) bdg.style.display = isFora ? 'block' : 'none'; 
    let maxRunes = parseInt(document.getElementById('char-runas')?.value) || 0;

    let f = parseInt(document.getElementById('alloc-forca')?.value) || 0; let m = parseInt(document.getElementById('alloc-magia')?.value) || 0; let a = parseInt(document.getElementById('alloc-agilidade')?.value) || 0; let s = parseInt(document.getElementById('alloc-sorte')?.value) || 0;
    let maxF = parseInt(document.getElementById('attr-forca')?.value) || 0; let maxM = parseInt(document.getElementById('attr-magia')?.value) || 0; let maxA = parseInt(document.getElementById('attr-agilidade')?.value) || 0; let maxS = parseInt(document.getElementById('attr-sorte')?.value) || 0;

    if(f > maxF) { f = maxF; safeSetVal('alloc-forca', f); }
    if(m > maxM) { m = maxM; safeSetVal('alloc-magia', m); }
    if(a > maxA) { a = maxA; safeSetVal('alloc-agilidade', a); }
    if(s > maxS) { s = maxS; safeSetVal('alloc-sorte', s); }

    let totalAlloc = f + m + a + s;
    if (!isFora && totalAlloc > maxRunes) {
        alert(`EM COMBATE: Você só pode alocar dados até o limite das suas Runas (${maxRunes})!`);
        safeSetVal('alloc-forca', 0); safeSetVal('alloc-magia', 0); safeSetVal('alloc-agilidade', 0); safeSetVal('alloc-sorte', 0);
    }
    window.saveData();
}

const getMultFromRoll = (val) => { if(val <= 4) return 0; if(val <= 11) return 0.5; return 1; };

window.addCombatLog = async function(data) {
    if (OBR.isAvailable) {
        try {
            let meta = await OBR.room.getMetadata();
            let nuvemLog = meta["fatesheet_log_final"] || [];
            nuvemLog.unshift(data); if(nuvemLog.length > 10) nuvemLog.length = 10; 
            combatLog = nuvemLog;
            await OBR.room.setMetadata({ "fatesheet_log_final": combatLog });
            OBR.broadcast.sendMessage("fatesheet-log-update", combatLog);
        } catch(e) {}
    } else {
        combatLog.unshift(data); if(combatLog.length > 10) combatLog.length = 10;
    }
    window.renderMiniLog();
}

window.clearMiniLog = async function() {
    if(confirm('Apagar o histórico de combate para toda a mesa?')) {
        combatLog = [];
        if (OBR.isAvailable) { await OBR.room.setMetadata({ "fatesheet_log_final": [] }); OBR.broadcast.sendMessage("fatesheet-log-update", []); }
        window.renderMiniLog();
    }
}

window.renderMiniLog = function() {
    const container = document.getElementById('mini-log-container'); if(!container) return; container.innerHTML = '';
    if (!Array.isArray(combatLog)) return; 
    
    combatLog.forEach(log => {
        try {
            let div = document.createElement('div'); div.className = 'log-entry'; div.style.borderLeftColor = log.col || '#d4af37';
            let prefix = log.fc ? '<span style="color:#888; font-weight:bold;">[FC]</span> ' : '⚔️ ';
            let actHtml = ""; let resHtml = "";

            if (log.t === "clash_result") {
                actHtml = `⚔️ <b style="color:#ff4444">DUELO:</b> ${log.c} vs ${log.targetName}`;
                resHtml = `Bruto: ${log.gross} | Bloqueio: <span style="color:#44aaff">${log.blocked}</span> | <b style="color:${log.col}">Real: ${log.net}</b>`;
            }
            else if (log.t === "spell") {
                actHtml = `${prefix}Rolou <b style="color:${log.col}">[ ${log.sn} ]</b>`;
                let parts = []; let totalDano = 0;
                
                if(log.st !== "Self" && log.st !== "Cura") {
                    if(log.b && log.b.r && log.b.r.length > 0) { parts.push(`<span style="color:${log.col}">Base [${log.b.tot}]</span>`); totalDano += log.b.tot; }
                    if(log.ru && log.ru.length > 0) {
                        log.ru.forEach(r => {
                            if(r.t === 'alpha') parts.push(`<span style="color:#44aaff">A: ${r.tot}</span>`);
                            if(r.t === 'delta') parts.push(`<span style="color:#ff4444">D: ${r.tot}</span>`);
                            if(r.t === 'arma') parts.push(`<span style="color:#ccc">Arma: ${r.tot}</span>`);
                            totalDano += r.tot;
                        });
                    }
                    if(log.beta && log.beta.r && log.beta.r.length > 0) { let betTot = log.beta.r.reduce((a,b)=>a+b, 0); parts.push(`<span style="color:#a855f7">B: ${betTot}</span>`); totalDano += betTot; }
                    resHtml = `${parts.join(" ")} <b style="color:${log.crit === 'true' ? '#ffd700' : log.col}">=> ${totalDano}</b>`;
                } else if (log.st === "Cura") { resHtml = `<span style="color:#39ff14;">💚 Curou: ${log.b.tot} HP</span>`; } else { resHtml = `<span style="color:#888;">Efeito Conjurado.</span>`; }
                
                if (log.stName && log.stDT > 0) {
                    let stRoll = parseInt(log.stRoll); let dt = parseInt(log.stDT); let stCor = stRoll >= dt ? "#44aaff" : "#ff4444";
                    resHtml += `<div style="font-size:11px; margin-top:4px; color:${stCor}">⚡ ${log.stName}: [${stRoll}] vs DT ${dt}</div>`;
                }
                if (log.targetName) resHtml += `<div style="font-size:11px; margin-top:4px; color:#ffaa00">Alvo: ${log.targetName}</div>`;
            } 
            else if (log.t === "attr") {
                actHtml = `${prefix}Rolou <b>Atributos</b>`; let parts = [];
                const formatAttr = (arrStr, color, pref) => {
                    if(!arrStr) return; let arr = arrStr.split(','); if(arr.length === 0 || arrStr === "") return;
                    let text = arr.map(v => {
                        let val = parseInt(v); let c = val >= 20 ? '#ffd700' : (val >= 12 ? '#39ff14' : (val <= 4 ? '#ff4444' : '#fff'));
                        let sBadge = log.sorte > 0 ? `<sup style="color:#39ff14">${log.sorte}</sup>` : "";
                        return `<span style="color:${c}">${val}${sBadge}</span>`;
                    }).join(", ");
                    parts.push(`<span style="color:${color}; font-weight:bold;">${pref} [${text}]</span>`);
                };
                formatAttr(log.rF, "#ff4444", "F"); formatAttr(log.rM, "#44aaff", "M"); formatAttr(log.rA, "#a855f7", "A"); resHtml = parts.join(" | ");
            } else {
                actHtml = `${prefix}Rolou <b>${log.s}</b>`; let r = (log.r && typeof log.r === 'string') ? log.r.split(',') : [0];
                resHtml = `Resultado: <b style="color:${log.col}; font-size: 14px;">${parseInt(r[0]) + (log.mod || 0)}</b>`;
            }
            div.innerHTML = `<div class="log-header"><span class="log-name" style="color:${log.col || '#d4af37'}">${log.av || '🧙‍♂️'} ${log.c}</span><span class="log-action">${actHtml}</span></div><div class="log-result">${resHtml}</div>`; container.appendChild(div);
        } catch (e) {}
    });
}

window.rollAttributes = function() {
    let cb = document.getElementById('fora-combate'); let isFora = cb ? cb.checked : false;
    let f = parseInt(document.getElementById('alloc-forca').value) || 0; let m = parseInt(document.getElementById('alloc-magia').value) || 0; let a = parseInt(document.getElementById('alloc-agilidade').value) || 0; let s = parseInt(document.getElementById('alloc-sorte').value) || 0;

    if(f+m+a+s === 0) return alert("Aloque algum dado antes de rolar!");

    let rolls = { f: [], m: [], a: [] }; let c = characters[currentCharId]; if(!c.activeRunes) c.activeRunes = [];
    const rollD20 = () => Math.floor(Math.random() * 20) + 1;
    let maxAgilRoll = 0;

    for(let i=0; i<f; i++) { let v = rollD20() + s; rolls.f.push(v); if(!isFora) c.activeRunes.push({ type: 'delta', face: 'd4', mult: getMultFromRoll(v), locked: true, fixo: 0, raw: v }); }
    for(let i=0; i<m; i++) { let v = rollD20() + s; rolls.m.push(v); if(!isFora) c.activeRunes.push({ type: 'alpha', face: 'd4', mult: getMultFromRoll(v), locked: true, fixo: 0, raw: v }); }
    for(let i=0; i<a; i++) { let v = rollD20() + s; rolls.a.push(v); if(v > maxAgilRoll) maxAgilRoll = v; if(!isFora) c.activeRunes.push({ type: 'beta', face: 'd4', mult: getMultFromRoll(v), locked: true, fixo: 0, raw: v }); }

    if(!isFora) { c.hasRolledTurn = true; if (a > 0) { c.initiative = 100 + maxAgilRoll; } else { c.initiative = rollD20(); } }

    const payload = { t: "attr", av: document.getElementById('char-avatar').value, c: document.getElementById('char-name').value || 'Desconhecido', col: document.getElementById('char-color').value || '#d4af37', rF: rolls.f.join(','), rM: rolls.m.join(','), rA: rolls.a.join(','), sorte: s, fc: isFora };

    window.abrirModalCentral(payload); window.addCombatLog(payload);
    if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);
    window.saveData(); window.renderGlobalRunes(); window.renderCombatTracker();
}

window.addGlobalRune = function(type) { if(!checkRuneLimits(type)) return; characters[currentCharId].activeRunes.push({ type: type, face: "d4", mult: 1, fixo: 0, locked: false }); window.saveData(); window.renderGlobalRunes(); }
window.updateGlobalRune = function(idx, field, val) { characters[currentCharId].activeRunes[idx][field] = val; window.saveData(); window.renderGlobalRunes(); }
window.removeGlobalRune = function(idx) { characters[currentCharId].activeRunes.splice(idx, 1); window.saveData(); window.renderGlobalRunes(); }

window.renderGlobalRunes = function() {
    const container = document.getElementById('global-runes-container'); if(!container) return; container.innerHTML = '';
    let c = characters[currentCharId];
    if(!c || !c.activeRunes || c.activeRunes.length === 0) {
        container.innerHTML = `<div style="display:flex; gap:8px;"><button class="btn-rune b-alpha" onclick="addGlobalRune('alpha')">+ α Azul</button><button class="btn-rune b-delta" onclick="addGlobalRune('delta')">+ δ Verm</button><button class="btn-rune b-beta" onclick="addGlobalRune('beta')">+ β Roxo</button><button class="btn-rune b-arma" onclick="addGlobalRune('arma')">+ ⚔️ Arma</button></div>`; return;
    }
    let html = `<div class="dice-config-row" style="border-color: var(--accent-gold); background: #111;"><div style="width:100%; display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--accent-gold); font-size:12px; font-weight:bold;">Runas do Turno</span><div style="display:flex; gap:4px;"><button class="btn-rune b-alpha" style="padding: 2px 6px;" onclick="addGlobalRune('alpha')">+ α</button><button class="btn-rune b-delta" style="padding: 2px 6px;" onclick="addGlobalRune('delta')">+ δ</button><button class="btn-rune b-beta" style="padding: 2px 6px;" onclick="addGlobalRune('beta')">+ β</button><button class="btn-rune b-arma" style="padding: 2px 6px;" onclick="addGlobalRune('arma')">+ ⚔️</button></div></div>`;
    c.activeRunes.forEach((r, idx) => {
        let cHex = '#ccc', sym = '⚔️'; if(r.type === 'alpha') { cHex = '#44aaff'; sym = 'α'; } if(r.type === 'delta') { cHex = '#ff4444'; sym = 'δ'; } if(r.type === 'beta')  { cHex = '#a855f7'; sym = 'β'; }
        let dis = r.locked ? "pointer-events:none; opacity:0.5;" : ""; let redA = r.mult === 0 ? "active" : ""; let whiA = r.mult === 0.5 ? "active" : ""; let greA = r.mult === 1 ? "active" : "";
        html += `<div class="dice-group" style="border-color:${cHex}; margin-top:5px;"><span class="lbl" style="color:${cHex}; text-align:center;">${sym}</span><select class="inv-input dice-sel" onchange="updateGlobalRune(${idx}, 'face', this.value)"><option value="d4" ${r.face==='d4'?'selected':''}>d4</option><option value="d6" ${r.face==='d6'?'selected':''}>d6</option><option value="d8" ${r.face==='d8'?'selected':''}>d8</option><option value="d10" ${r.face==='d10'?'selected':''}>d10</option><option value="d12" ${r.face==='d12'?'selected':''}>d12</option><option value="d20" ${r.face==='d20'?'selected':''}>d20</option><option value="d100" ${r.face==='d100'?'selected':''}>d100</option></select>${r.type === 'arma' ? `<span style="color:#ccc; font-weight:bold;">+</span><input type="number" class="inv-input dice-qty" placeholder="Fixo" value="${r.fixo || 0}" onchange="updateGlobalRune(${idx}, 'fixo', this.value)" style="width: 35px !important;">` : ''}<div class="mult-group" style="${dis}"><span class="mult-btn m-red ${redA}" onclick="updateGlobalRune(${idx}, 'mult', 0)">X</span><span class="mult-btn m-white ${whiA}" onclick="updateGlobalRune(${idx}, 'mult', 0.5)">X</span><span class="mult-btn m-green ${greA}" onclick="updateGlobalRune(${idx}, 'mult', 1)">X</span></div><span style="color:#666; cursor:pointer; font-weight:bold; margin-left:5px; padding: 2px;" onclick="removeGlobalRune(${idx})">✖</span></div>`;
    });
    html += `</div>`; container.innerHTML = html;
}

window.toggleSpellInfo = function(index) { playerSpells[index].isOpen = !playerSpells[index].isOpen; window.renderSpells(); window.saveData(); }
window.renderSpells = function() {
    const container = document.getElementById('spells-container'); if(!container) return; container.innerHTML = '';
    playerSpells.forEach((spell, index) => {
        if(spell.isOpen === undefined) spell.isOpen = true;
        spell.tipo = spell.tipo || "Dano"; spell.bQtd = spell.bQtd || 1; spell.bD = spell.bD || "d20"; spell.bMult = spell.bMult !== undefined ? spell.bMult : 1; spell.isCrit = spell.isCrit || false; spell.statusName = spell.statusName || ""; spell.statusDT = spell.statusDT || ""; spell.audioUrl = spell.audioUrl || "";
        let isSelf = spell.tipo === "Self"; let row = document.createElement('div'); row.className = 'spell-item';
        let headerHtml = `<div class="spell-header" onclick="toggleSpellInfo(${index})"><div style="display: flex; align-items: center; gap: 10px;"><button class="btn-roll-spell" onclick="event.stopPropagation(); window.iniciarAtaqueMagia(${index})" title="Rolar Magia">🎲</button><span style="font-weight: bold; color: var(--accent-gold); font-size: 16px;">${spell.nome || 'Nova Magia'}</span></div><div style="display:flex; align-items:center; gap: 10px;"><button class="btn-danger" style="padding: 4px 8px;" onclick="event.stopPropagation(); removeSpell(${index})">X</button><span class="chevron">${spell.isOpen ? '▼' : '►'}</span></div></div>`;
        let bodyHtml = `<div style="display: ${spell.isOpen ? 'flex' : 'none'}; flex-direction: column; gap: 5px; margin-top: 10px;"><div class="inv-row"><input type="text" class="inv-input" style="flex: 2; font-weight: bold;" placeholder="Habilidade" value="${spell.nome}" onchange="updateSpell(${index}, 'nome', this.value)"><input type="number" class="inv-input" style="flex: 1;" placeholder="Custo MP" value="${spell.custo}" onchange="updateSpell(${index}, 'custo', this.value)"><input type="text" class="inv-input" style="flex: 1;" placeholder="Alcance" value="${spell.alcance}" onchange="updateSpell(${index}, 'alcance', this.value)"></div><div class="inv-row" style="margin-top: 5px;"><textarea class="inv-input" style="flex: 1; resize: vertical;" rows="1" placeholder="Descrição e Efeitos..." onchange="updateSpell(${index}, 'desc', this.value)">${spell.desc}</textarea></div><div class="inv-row"><span style="font-size:16px;">🎵</span><input type="text" class="inv-input" style="flex: 1; border-color: #555;" placeholder="URL de Áudio Customizado (Discord Link .mp3)" value="${spell.audioUrl}" onchange="updateSpell(${index}, 'audioUrl', this.value)"></div><div class="dice-config-row"><select class="inv-input dice-sel" style="width:100% !important;" onchange="updateSpell(${index}, 'tipo', this.value); window.renderSpells();"><option value="Dano" ${spell.tipo==='Dano'?'selected':''}>Dano (Base + Runas Globais)</option><option value="Controle" ${spell.tipo==='Controle'?'selected':''}>Controle (Base + Runas Globais)</option><option value="Cura" ${spell.tipo==='Cura'?'selected':''}>Cura (Base + Runas Globais)</option><option value="Locomoção" ${spell.tipo==='Locomoção'?'selected':''}>Locomoção (Base + Runas Globais)</option><option value="Self" ${spell.tipo==='Self'?'selected':''}>Self (Apenas Efeito)</option></select>${(!isSelf) ? `<div class="dice-group"><span class="lbl" style="color:#fff">Base</span><input type="number" class="inv-input dice-qty" min="1" value="${spell.bQtd}" onchange="updateSpell(${index}, 'bQtd', this.value)"><select class="inv-input dice-sel" onchange="updateSpell(${index}, 'bD', this.value)"><option value="d4" ${spell.bD==='d4'?'selected':''}>d4</option><option value="d6" ${spell.bD==='d6'?'selected':''}>d6</option><option value="d8" ${spell.bD==='d8'?'selected':''}>d8</option><option value="d10" ${spell.bD==='d10'?'selected':''}>d10</option><option value="d12" ${spell.bD==='d12'?'selected':''}>d12</option><option value="d20" ${spell.bD==='d20'?'selected':''}>d20</option><option value="d100" ${spell.bD==='d100'?'selected':''}>d100</option></select><div class="mult-group"><span class="mult-btn m-red ${spell.bMult===0?'active':''}" onclick="updateSpell(${index}, 'bMult', 0)">X</span><span class="mult-btn m-white ${spell.bMult===0.5?'active':''}" onclick="updateSpell(${index}, 'bMult', 0.5)">X</span><span class="mult-btn m-green ${spell.bMult===1?'active':''}" onclick="updateSpell(${index}, 'bMult', 1)">X</span></div></div><div style="display:flex; align-items:center; gap:5px; margin-left: auto; width: 100%; justify-content: flex-end; margin-top: 5px;"><input type="checkbox" id="crit-${index}" ${spell.isCrit ? 'checked' : ''} onchange="updateSpell(${index}, 'isCrit', this.checked)"><label for="crit-${index}" style="color:#ffd700; margin:0; cursor:pointer;">Crítico (Base Máx x3)</label></div>` : ''}</div><div class="dice-config-row" style="margin-top: 5px; border-color: #a855f7;"><div style="display: flex; width: 100%; align-items: center; gap: 5px;"><span style="color:#a855f7; font-size: 11px; font-weight: bold; white-space: nowrap;">⚡ Status/Efeito</span><input type="text" class="inv-input" style="flex: 2;" placeholder="Ex: Queimar" value="${spell.statusName}" onchange="updateSpell(${index}, 'statusName', this.value)"><span style="color:#fff; font-size: 11px; font-weight: bold;">DT:</span><input type="number" class="inv-input dice-qty" placeholder="15" value="${spell.statusDT}" onchange="updateSpell(${index}, 'statusDT', this.value)"></div></div></div>`;
        row.innerHTML = headerHtml + bodyHtml; container.appendChild(row);
    });
}
window.addSpell = function() { playerSpells.push({ nome: "", desc: "", custo: "", alcance: "", tipo: "Dano", bQtd: 1, bD: "d20", bMult: 1, isOpen: true, isCrit: false, statusName: "", statusDT: "", audioUrl: "" }); window.renderSpells(); window.saveData(); }
window.updateSpell = function(index, field, value) { playerSpells[index][field] = value; window.saveData(); window.renderSpells(); }
window.removeSpell = function(index) { if(confirm("Remover magia?")) { playerSpells.splice(index, 1); window.renderSpells(); window.saveData(); } }

window.closeTargetModal = function() { document.getElementById('target-modal').style.display = 'none'; pendingSpellIndex = null; }

window.iniciarAtaqueMagia = function(index) {
    let cb = document.getElementById('fora-combate'); let isFora = cb ? cb.checked : false;
    if (!isFora) {
        let inCombatChars = Object.values(characters).filter(ch => ch.inGame);
        let missing = inCombatChars.filter(ch => !ch.hasRolledTurn);
        if (missing.length > 0) { alert("Aguarde as seguintes fichas rolarem os atributos de turno:\n" + missing.map(m=>m.name).join(', ')); return; }
    }
    const spell = playerSpells[index];
    if (spell.tipo === "Dano" || spell.tipo === "Controle" || spell.tipo === "Cura") {
        pendingSpellIndex = index;
        let sel = document.getElementById('modal-target-select'); 
        if(!sel) return;
        sel.innerHTML = '<option value="">Sem Alvo Especifico</option>';
        
        let combatants = Object.values(characters).filter(c => c.inGame);
        combatants.forEach(ch => { sel.innerHTML += `<option value="${ch.id}">${ch.name}</option>`; });
        
        document.getElementById('target-modal').style.display = 'flex';
    } else {
        pendingSpellIndex = index; window.confirmarAtaqueAlvo(); 
    }
}

window.confirmarAtaqueAlvo = async function() {
    let sel = document.getElementById('modal-target-select'); let targetId = sel ? sel.value : "";
    let modal = document.getElementById('target-modal'); if(modal) modal.style.display = 'none';
    let index = pendingSpellIndex !== null ? pendingSpellIndex : -1; if (index === -1) return;
    pendingSpellIndex = null;
    
    const spell = playerSpells[index]; let c = characters[currentCharId];
    let isFora = document.getElementById('fora-combate') ? document.getElementById('fora-combate').checked : false;
    
    let manaCost = parseInt(spell.custo) || 0;
    if (manaCost > 0) {
        if (c.mpAtual < manaCost) { if(!confirm("Mana insuficiente! Deseja castar a magia mesmo assim?")) return; } 
        else { c.mpAtual -= manaCost; safeSetVal('char-mp-atual', c.mpAtual); }
    }
    const rolar = (qtd, tDado) => { if (!qtd || qtd <= 0 || !tDado) return []; let faces = parseInt(tDado.replace('d', '')); let res = []; for(let i=0; i<qtd; i++) res.push(Math.floor(Math.random() * faces) + 1); return res; }
    
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
    let grossDamage = bTot; runesPack.forEach(r => grossDamage += r.tot);

    const payload = {
        t: "spell", av: document.getElementById('char-avatar').value, c: document.getElementById('char-name').value || 'Desconhecido', col: document.getElementById('char-color').value || '#d4af37', sn: spell.nome || "Habilidade", cost: spell.custo || "0", rg: spell.alcance || "Self", desc: spell.desc || "", st: spell.tipo || "Dano",
        b: { f: spell.bD, m: spell.bMult, r: bRolls, tot: bTot }, ru: runesPack, crit: spell.isCrit ? "true" : "false", stName: spell.statusName || "", stDT: spell.statusDT || "0", stRoll: stRoll, audio: spell.audioUrl || "", fc: isFora, attackerId: currentCharId
    };

    if (targetId !== "") {
        let tgt = characters[targetId]; payload.targetId = targetId; payload.targetName = tgt ? tgt.name : "Desconhecido";
        
        if (spell.tipo === "Cura") {
            if(tgt) { let maxH = tgt.category==='Monstros' ? (tgt.vidaMonster||100) : (40 + (tgt.sorte||0)*5); tgt.hpAtual = Math.min(maxH, (tgt.hpAtual||0) + grossDamage); payload.healed = grossDamage; }
            window.abrirModalCentral(payload); window.addCombatLog(payload);
            if (OBR.isAvailable) { OBR.broadcast.sendMessage("fatesheet-rolls", payload); OBR.room.setMetadata({ [`fatesheet_char_${targetId}`]: characters[targetId] }); }
        } else if (spell.tipo === "Dano" || spell.tipo === "Controle") {
            payload.gross = grossDamage;
            if (OBR.isAvailable) { 
                window.abrirModalCentral(payload); window.addCombatLog(payload); OBR.broadcast.sendMessage("fatesheet-rolls", payload);
                
                // Dispara o alerta para a Vítima defender
                let meta = await OBR.room.getMetadata();
                let cls = meta.fatesheet_clashes || {};
                cls[targetId] = payload;
                await OBR.room.setMetadata({ fatesheet_clashes: cls }); 
            }
        }
    } else {
        window.abrirModalCentral(payload); window.addCombatLog(payload);
        if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);
    }
    
    if(spell.isCrit) spell.isCrit = false;
    c.activeRunes = []; c.alloc = {f:0, m:0, a:0, s:0}; safeSetVal('alloc-forca', 0); safeSetVal('alloc-magia', 0); safeSetVal('alloc-agilidade', 0); safeSetVal('alloc-sorte', 0);
    window.renderGlobalRunes(); window.renderSpells(); window.saveData(); window.renderCombatTracker();
}

window.saveData = async function() {
    if (!currentCharId) return; 
    try {
        let c = characters[currentCharId] || {};
        // Salva preenchimentos diretos na tela e envia pro objeto!
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
        c.skills = playerSkills; c.inventory = playerInventory; c.spells = playerSpells; c.photo = currentPhoto; 
        
        characters[currentCharId] = c;
        try { localStorage.setItem('fatesheet_db', JSON.stringify(characters)); } catch(e){}
        if (OBR.isAvailable) await OBR.room.setMetadata({ [`fatesheet_char_${currentCharId}`]: characters[currentCharId] });
    } catch(e) { console.error("Erro no save:", e); }
}

let saveTimeout;
document.addEventListener('input', (e) => {
    if(e.target.id && e.target.id.startsWith('alloc')) return; 
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => { if(currentCharId) window.saveData(); }, 600);
});

window.abrirModalCentral = function(data) {
    if (OBR.isAvailable) {
        const dataUrl = encodeURIComponent(JSON.stringify(data));
        // Manda o Owlbear abrir. Ele NÃO TRAVA se a tela já estiver aberta, ele só substitui a página.
        try { OBR.modal.open({ id: "fate-roll-modal", url: `https://seediam.github.io/FateSheet/resultado.html?data=${dataUrl}`, width: 450, height: (data.t === "spell" || data.t === "attr" || data.t === "clash_result") ? 550 : 250 }); } catch(e) {}
    }
}

// ------ COFRE DE SEGURANÇA NA NUVEM ------
function processRoomData(metadata) {
    let mudouAlgo = false;
    
    if (metadata["fatesheet_log_v21"] !== undefined) { combatLog = metadata["fatesheet_log_v21"]; window.renderMiniLog(); }
    
    if (metadata["fatesheet_clashes"] !== undefined) {
        clashes = metadata["fatesheet_clashes"];
        mudouAlgo = true;
    } else { clashes = {}; }

    for (let key in metadata) {
        if (key.startsWith('fatesheet_char_')) {
            const id = key.replace('fatesheet_char_', '');
            if (metadata[key] === undefined || metadata[key] === null) {
                if(characters[id]) { delete characters[id]; mudouAlgo = true; }
            } else { 
                let isTyping = document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA");
                if (currentCharId === id && isTyping) { 
                    // ignora localmente para não apagar o que eu to escrevendo
                } else {
                    characters[id] = metadata[key]; mudouAlgo = true; 
                }
            }
        }
    }
    
    if (mudouAlgo) {
        try { window.renderCharacterList(); } catch(e){}
        try { window.renderCombatTracker(); } catch(e){}
        
        if (currentCharId && document.getElementById('screen-sheet').classList.contains('active')) {
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
            try {
                // Remove qualquer lixo de clash ou cadeado fantasma velho na inicialização do mestre:
                const meta = await OBR.room.getMetadata();
                for (let k in meta) { if (k.startsWith('fatesheet_lock_')) OBR.room.setMetadata({ [k]: undefined }); }
                
                processRoomData(meta);
                OBR.room.onMetadataChange((metadata) => processRoomData(metadata));
                OBR.broadcast.onMessage("fatesheet-log-update", (event) => { combatLog = event.data; window.renderMiniLog(); });
                OBR.broadcast.onMessage("fatesheet-rolls", (event) => { window.abrirModalCentral(event.data); });
            } catch(e) {}
        });
    }
}
