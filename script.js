// Mapeamento das perícias baseadas nos atributos de FATE
const skillsData = [
    { name: "Arcanismo", attr: "Magia" }, { name: "História", attr: "Magia" }, { name: "Natureza", attr: "Magia" }, { name: "Religião", attr: "Magia" },
    { name: "Intuição", attr: "Sorte" }, { name: "Medicina", attr: "Sorte" }, { name: "Percepção", attr: "Sorte" }, { name: "Sobrevivência", attr: "Sorte" },
    { name: "Atletismo", attr: "Força" }, { name: "Intimidação", attr: "Força" },
    { name: "Acrobacia", attr: "Agilidade" }, { name: "Furtividade", attr: "Agilidade" }, { name: "Prestidigitação", attr: "Agilidade" },
    { name: "Atuação", attr: "Sorte" }, { name: "Enganação", attr: "Sorte" }, { name: "Persuasão", attr: "Sorte" }
];

let playerSkills = {}; // Armazena os pontos de cada perícia

function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    skillsData.forEach(skill => {
        if (playerSkills[skill.name] === undefined) playerSkills[skill.name] = 0;

        const div = document.createElement('div');
        div.className = 'skill-item';
        
        // Clicar no nome rola o dado
        div.innerHTML = `
            <div onclick="rollSkill('${skill.name}', '${skill.attr}')" style="flex:1;">
                <strong>${skill.name}</strong> <span style="font-size: 10px; color: #888;">(${skill.attr})</span>
            </div>
            <div class="skill-controls">
                <button class="btn-ctrl" onclick="updateSkill('${skill.name}', -1)">-</button>
                <span style="width: 20px; text-align: center;">${playerSkills[skill.name]}</span>
                <button class="btn-ctrl" onclick="updateSkill('${skill.name}', 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateSkill(skillName, change) {
    playerSkills[skillName] += change;
    if (playerSkills[skillName] < 0) playerSkills[skillName] = 0;
    renderSkills();
    saveData();
}

function rollSkill(skillName, attrName) {
    // Pega o valor do atributo correspondente (Força, Magia, etc)
    const attrInputId = `attr-${attrName.toLowerCase()}`;
    let diceCount = parseInt(document.getElementById(attrInputId).value) || 1;
    
    // Se o valor for menor que 1, rola 1 por padrão
    if(diceCount < 1) diceCount = 1;

    let results = [];
    for (let i = 0; i < diceCount; i++) {
        results.push(Math.floor(Math.random() * 20) + 1);
    }

    const message = `${skillName} (${attrName}): ${results.join(', ')} (Rolou ${diceCount} porque tem ${diceCount} em ${attrName})`;
    
    // Notifica na tela do jogador (e podemos enviar para o Owlbear)
    alert(message); // Teste rápido local
    
    if (OBR.isAvailable) {
        // Envia notificação para todos na sala do Owlbear Rodeo
        OBR.notification.show(message);
    }
}

// Lógica de Salvar/Carregar Local e Integração OBR
function saveData() {
    const sheetData = {
        name: document.getElementById('char-name').value,
        skills: playerSkills
        // Aqui adicionaremos os outros campos depois
    };
    localStorage.setItem('fate_sheet_data', JSON.stringify(sheetData));
    
    // Se o OBR estiver rodando, sincroniza como metadata na sala
    if (OBR.isAvailable) {
        OBR.room.setMetadata({ [`fate_sheet_${OBR.player.id}`]: sheetData });
    }
}

OBR.onReady(async () => {
    // Verifica se é o GM para mostrar a visão global
    const role = await OBR.player.getRole();
    if (role === "GM") {
        document.getElementById("gm-panel").style.display = "block";
        // Lógica futura para ler os metadados de todos os jogadores irá aqui
    }
});

// Inicialização
renderSkills();
