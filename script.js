diff --git a/script.js b/script.js
index 5031fb06f51adf236867345fdb7a6fe739df8d3b..140e610dbbe94b9486407143c0cae8f2b72278d3 100644
--- a/script.js
+++ b/script.js
@@ -49,50 +49,58 @@ let combatLog = [];
 let clashes = {}; 
 let activeDefenses = {}; 
 let currentCharId = null;
 let playerSkills = {}; 
 let playerInventory = [];
 let playerSpells = []; 
 let currentPhoto = "";
 let folderState = { "Jogadores": true, "NPCs": true, "Monstros": true };
 let isOverweight = false;
 let pendingSpellIndex = null; 
 let targetOptionsHTML = '<option value="">Sem Alvo / Automático</option>';
 
 // O Código inicia RÁPIDO para não travar no Loading
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
 
+const defenseRuneTypes = ['alpha', 'beta', 'delta'];
+const getDefendableRunes = (charData) => {
+    if(!charData || !Array.isArray(charData.activeRunes)) return [];
+    return charData.activeRunes
+        .map((r, idx) => ({ ...r, sourceIndex: idx }))
+        .filter(r => defenseRuneTypes.includes(r.type));
+};
+
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
 
@@ -242,134 +250,176 @@ window.calcVitals = function() {
     let ep = document.getElementById('val-peso'); if(ep) ep.innerText = `${currentWeight.toFixed(1)} / ${maxWeight}`;
     let bp = document.getElementById('box-peso'); let pa = document.getElementById('peso-aviso');
 
     if (currentWeight > maxWeight) { isOverweight = true; if(bp) bp.classList.add('overweight'); if(pa) pa.style.display = 'block'; } 
     else { isOverweight = false; if(bp) bp.classList.remove('overweight'); if(pa) pa.style.display = 'none'; }
 }
 
 // ------ COMBAT TRACKER COM DEFESA INCORPORADA ------
 window.renderCombatTracker = function() {
     const container = document.getElementById('combat-tracker-list');
     if(!container) return;
     
     let combatants = Object.values(characters).filter(c => c.inGame);
     combatants.sort((a, b) => (b.initiative || 0) - (a.initiative || 0)); 
 
     let html = '';
     targetOptionsHTML = '<option value="">Sem Alvo Especifico</option>';
     
     combatants.forEach((c, idx) => {
         let hpM = c.category==='Monstros' ? (c.vidaMonster||100) : (40 + (c.sorte||0)*5);
         let mpM = c.category==='Monstros' ? 25 : 25 + (c.classe==='Andarilho'?25:c.classe==='Estrangeiro'?50:c.classe==='Nobre'?75:0);
         let positionTag = c.hasRolledTurn ? `<span style="font-size:10px; color:var(--accent-gold); font-weight:bold; background:#000; padding:2px 4px; border-radius:3px;">${idx + 1}º a Atacar</span>` : `<span style="font-size:10px; color:#888; font-weight:bold; background:#000; padding:2px 4px; border-radius:3px;">⌛ Pendente</span>`;
         targetOptionsHTML += `<option value="${c.id}">${c.name}</option>`;
 
         let clashHtml = '';
+        let outgoingClash = Object.values(clashes).find(cl => cl && cl.attackerId === c.id);
         if (clashes[c.id]) {
             let clash = clashes[c.id];
             
             if (c.id === currentCharId) {
                 let defState = activeDefenses[c.id];
                 if (!defState) {
                     clashHtml = `
                     <div style="background:#2a0a0a; border:1px dashed #ff4444; padding:8px; margin-top:8px; border-radius:4px; animation: pulseAlert 1.5s infinite;">
                         <div style="color:#ff4444; font-size:12px; margin-bottom:5px;">⚠️ Atacado por <b>${clash.c}</b> (Dano: ${clash.gross})</div>
                         <div style="display:flex; gap:5px;">
                             <button class="btn-ctrl" style="background:#ff4444; color:#fff; flex:1;" onclick="window.aceitarDano('${c.id}')">Tomar Dano</button>
                             <button class="btn-ctrl" style="background:#44aaff; color:#fff; flex:1;" onclick="window.iniciarDefesa('${c.id}')">Defender</button>
                         </div>
                     </div>`;
                 } else {
                     let defFis = (c.forca || 0) * 5; let defMag = (c.magia || 0) * 5; let defHib = Math.floor((defFis + defMag) / 3);
-                    let runesHtml = (c.activeRunes || []).map((r, rIdx) => {
+                    let runesDeDefesa = getDefendableRunes(c);
+                    let runesHtml = runesDeDefesa.map((r) => {
                         let cHex = r.type==='alpha' ? '#44aaff' : (r.type==='delta' ? '#ff4444' : (r.type==='beta' ? '#a855f7' : '#ccc'));
                         let sym = r.type==='alpha' ? 'α' : (r.type==='delta' ? 'δ' : (r.type==='beta' ? 'β' : '⚔️'));
                         return `<div style="display:inline-flex; align-items:center; background:#111; border:1px solid ${cHex}; padding:2px 6px; border-radius:4px; margin-right:4px; margin-bottom:4px; font-size:11px;">
                             <span style="color:${cHex}; margin-right:5px;">${sym}</span><span style="color:#fff; margin-right:5px;">${r.face}</span>
-                            <button style="background:transparent; border:none; color:#ff4444; font-weight:bold; cursor:pointer;" onclick="window.descartarRunaDefesa('${c.id}', ${rIdx})">X</button>
+                            <button style="background:transparent; border:none; color:#ff4444; font-weight:bold; cursor:pointer;" onclick="window.descartarRunaDefesa('${c.id}', ${r.sourceIndex})">X</button>
                         </div>`;
                     }).join('');
-                    if(runesHtml === '') runesHtml = '<span style="color:#666; font-size:11px;">Sem runas de defesa ativas.</span>';
+                    if(runesHtml === '') runesHtml = '<span style="color:#666; font-size:11px;">Sem runas de atributo (α/β/δ) para queimar na defesa.</span>';
 
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
+        } else if (outgoingClash) {
+            clashHtml = `
+            <div style="background:#1b1220; border:1px dashed #ffaa00; padding:8px; margin-top:8px; border-radius:4px; text-align:center;">
+                <span style="color:#ffaa00; font-size:12px; font-weight:bold; animation: pulseAlert 1.5s infinite;">⚔️ Atacando ${outgoingClash.targetName || 'alvo'} — aguardando defesa.</span>
+            </div>`;
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
+    window.checkClashStatus();
+}
+
+window.checkClashStatus = function() {
+    const holder = document.getElementById('clash-alert-container');
+    if(!holder) return;
+    if(!currentCharId || !characters[currentCharId]) { holder.style.display = 'none'; holder.innerHTML = ''; return; }
+
+    let incoming = clashes[currentCharId];
+    let outgoing = Object.values(clashes).find(cl => cl && cl.attackerId === currentCharId);
+
+    if (incoming) {
+        holder.style.display = 'block';
+        holder.innerHTML = `<div class="clash-alert">
+            <div style="font-weight:bold; color:#ff4444; margin-bottom:6px;">⚠️ ${characters[currentCharId].name || 'Você'} está sofrendo ataque de ${incoming.c}!</div>
+            <div style="font-size:12px; color:#ddd; margin-bottom:10px;">Abra a aba <b>⚔️ Combate</b> para Defender ou Tomar Dano.</div>
+            <button class="btn-ctrl" style="background:#44aaff; color:#fff; width:100%;" onclick="openTab('combate-tab')">Abrir Combate para Defender</button>
+        </div>`;
+        return;
+    }
+
+    if (outgoing) {
+        holder.style.display = 'block';
+        holder.innerHTML = `<div class="clash-alert" style="border-color:#ffaa00; background:#2a1d0a;">
+            <div style="font-weight:bold; color:#ffaa00; margin-bottom:6px;">⚔️ Você está atacando ${outgoing.targetName || 'um alvo'}.</div>
+            <div style="font-size:12px; color:#ddd;">Aguardando o alvo resolver a defesa na própria ficha.</div>
+        </div>`;
+        return;
+    }
+
+    holder.style.display = 'none';
+    holder.innerHTML = '';
 }
 
 window.novaRodadaGlobal = async function() {
     if(!confirm("Iniciar nova rodada? Todos precisarão rolar os Atributos novamente.")) return;
     for(let id in characters) { characters[id].hasRolledTurn = false; characters[id].initiative = 0; }
     await window.saveData(); window.renderCombatTracker();
 }
 
 window.iniciarDefesa = function(id) { activeDefenses[id] = { blocked: 0, type: 'fisica' }; window.renderCombatTracker(); }
 window.updateDefType = function(id, val) { if(activeDefenses[id]) activeDefenses[id].type = val; window.renderCombatTracker(); }
 
 window.descartarRunaDefesa = async function(id, rIdx) {
     let c = characters[id]; if(!c) return;
     let st = activeDefenses[id]; if(!st) return;
     
     let defFis = (c.forca || 0) * 5; let defMag = (c.magia || 0) * 5;
     let defHib = Math.floor((defFis + defMag) / 3);
     
+    let rune = c.activeRunes[rIdx];
+    if(!rune || !defenseRuneTypes.includes(rune.type)) return;
+
     if (st.type === 'fisica') st.blocked += defFis;
     else if (st.type === 'magica') st.blocked += defMag;
     else st.blocked += defHib;
 
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
     delete clashes[id]; window.renderCombatTracker();
 }
 
 window.confirmarDefesa = async function(id) {
@@ -611,57 +661,61 @@ window.confirmarAtaqueAlvo = async function() {
             let rl = rolar(1, r.face); let somaDados = rl.reduce((a,b)=>a+b, 0); let fixo = parseInt(r.fixo) || 0;
             return { t: r.type, f: r.face, m: r.mult, r: rl, fixo: fixo, tot: Math.floor((somaDados + fixo) * r.mult) };
         });
     }
     let stRoll = (spell.statusName && spell.statusDT > 0) ? Math.floor(Math.random() * 20) + 1 : 0;
     let grossDamage = bTot; runesPack.forEach(r => grossDamage += r.tot);
 
     const payload = {
         t: "spell", av: document.getElementById('char-avatar').value, c: document.getElementById('char-name').value || 'Desconhecido', col: document.getElementById('char-color').value || '#d4af37', sn: spell.nome || "Habilidade", cost: spell.custo || "0", rg: spell.alcance || "Self", desc: spell.desc || "", st: spell.tipo || "Dano",
         b: { f: spell.bD, m: spell.bMult, r: bRolls, tot: bTot }, ru: runesPack, crit: spell.isCrit ? "true" : "false", stName: spell.statusName || "", stDT: spell.statusDT || "0", stRoll: stRoll, audio: spell.audioUrl || "", fc: isFora
     };
 
     if (targetId !== "") {
         let tgt = characters[targetId]; payload.targetId = targetId; payload.targetName = tgt ? tgt.name : "Desconhecido";
         
         // MOSTRA A TELA NEON PARA TODO MUNDO PRIMEIRO E GRAVA NO LOG!
         window.abrirModalCentral(payload); 
         window.addCombatLog(payload);
         if (OBR.isAvailable) OBR.broadcast.sendMessage("fatesheet-rolls", payload);
 
         if (spell.tipo === "Cura") {
             if(tgt) { let maxH = tgt.category==='Monstros' ? (tgt.vidaMonster||100) : (40 + (tgt.sorte||0)*5); tgt.hpAtual = Math.min(maxH, (tgt.hpAtual||0) + grossDamage); payload.healed = grossDamage; }
             if (OBR.isAvailable) { OBR.room.setMetadata({ [`fatesheet_char_${targetId}`]: characters[targetId] }); }
         } else if (spell.tipo === "Dano" || spell.tipo === "Controle") {
             payload.gross = grossDamage;
+            payload.attackerId = currentCharId;
+            clashes[targetId] = payload;
+            delete activeDefenses[targetId];
             if (OBR.isAvailable) { 
                 // APENAS DEPOIS DA TELA ROLAR O ATAQUE VAI PRA FICHA DO ALVO
                 let meta = await OBR.room.getMetadata();
                 let cls = meta.fatesheet_clashes || {};
                 cls[targetId] = payload;
                 await OBR.room.setMetadata({ fatesheet_clashes: cls }); 
             } else { alert("O sistema precisa estar online no Owlbear!"); }
+            window.renderCombatTracker();
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
         if (document.getElementById('screen-sheet').classList.contains('active')) {
             c.hpAtual = parseInt(document.getElementById('char-hp-atual')?.value) || 0;
             c.mpAtual = parseInt(document.getElementById('char-mp-atual')?.value) || 0;
             c.runas = parseInt(document.getElementById('char-runas')?.value) || 0;
             c.inGame = document.getElementById('char-ingame')?.checked || false;
             c.foraCombate = document.getElementById('fora-combate')?.checked || false;
             
             let isMonster = document.getElementById('char-category')?.value === 'Monstros';
             let al = { f: parseInt(document.getElementById('alloc-forca').value)||0, m: parseInt(document.getElementById('alloc-magia').value)||0, a: parseInt(document.getElementById('alloc-agilidade').value)||0, s: parseInt(document.getElementById('alloc-sorte').value)||0 };
             
