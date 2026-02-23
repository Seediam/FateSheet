const skillsData = [
    { name: "Arcanismo", attr: "Magia" }, { name: "História", attr: "Magia" }, { name: "Natureza", attr: "Magia" }, { name: "Religião", attr: "Magia" },
    { name: "Intuição", attr: "Sorte" }, { name: "Medicina", attr: "Sorte" }, { name: "Percepção", attr: "Sorte" }, { name: "Sobrevivência", attr: "Sorte" },
    { name: "Atletismo", attr: "Força" }, { name: "Intimidação", attr: "Força" },
    { name: "Acrobacia", attr: "Agilidade" }, { name: "Furtividade", attr: "Agilidade" }, { name: "Prestidigitação", attr: "Agilidade" },
    { name: "Atuação", attr: "Sorte" }, { name: "Enganação", attr: "Sorte" }, { name: "Persuasão", attr: "Sorte" }
];

let playerSkills = {}; 
let currentPhoto = "";

function openTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    if(event) event.currentTarget.classList.add('active');
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

function rollSkill(skillName, attrName) {
    const attrInputId = `attr-${attrName.toLowerCase()}`;
    let diceCount = parseInt(document.getElementById(attrInputId).value) || 1;
    if(diceCount < 1) diceCount = 1;

    let results = [];
    for (let i = 0; i < diceCount; i++) {
        results.push(Math.floor(Math.random() * 20) + 1);
    }

    const message = `🎲 ${skillName} (${attrName}): [ ${results.join(' | ')} ]`;
    
    if (typeof OBR !== 'undefined' && OBR.isAvailable) {
        OBR.notification.show(message);
    } else {
        alert(message);
    }
}

function saveData() {
    try {
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
        localStorage.setItem('fate_sheet_data', JSON.stringify(sheetData));
    } catch (e) {
        console.error("Erro ao salvar (talvez a imagem seja muito grande):", e);
    }
}

function loadData() {
    try {
        const saved = localStorage.getItem('fate_sheet_data');
        if (saved) {
            const sheetData = JSON.parse(saved);
            document.getElementById('char-name').value = sheetData.name || '';
            document.getElementById('char-age').value = sheetData.age || '';
            document.getElementById('attr-forca').value = sheetData.forca || 1;
            document.getElementById('attr-magia').value = sheetData.magia || 1;
            document.getElementById('attr-agilidade').value = sheetData.agilidade || 1;
            document.getElementById('attr-sorte').value = sheetData.sorte || 1;
            document.getElementById('grimoire-name').value = sheetData.grimoire || '';
            document.getElementById('mana-zone').value = sheetData.mana || '';
            document.getElementById('hab-1').value = sheetData.hab1 || '';
            document.getElementById('hab-2').value = sheetData.hab2 || '';
            document.getElementById('hab-3').value = sheetData.hab3 || '';
            document.getElementById('hab-4').value = sheetData.hab4 || '';
            
            if (sheetData.skills) playerSkills = sheetData.skills;
            
            if (sheetData.photo) {
                currentPhoto = sheetData.photo;
                setPhotoPreview(currentPhoto);
            }
        }
    } catch (e) {
        console.error("Dados corrompidos encontrados. Limpando memória...", e);
        localStorage.removeItem('fate_sheet_data'); // Limpa o erro para a ficha voltar a funcionar
    }
    
    renderSkills(); // Agora isso vai rodar de qualquer jeito!
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
        preview.style.border = 'none'; // Tira a borda tracejada quando tem foto
        text.style.display = 'none';
    }
}

document.addEventListener('input', saveData);
document.addEventListener('DOMContentLoaded', loadData);

if (typeof OBR !== 'undefined') {
    OBR.onReady(async () => {
        const role = await OBR.player.getRole();
        if (role === "GM") {
            document.getElementById("gm-panel").style.display = "block";
        }
    });
}
