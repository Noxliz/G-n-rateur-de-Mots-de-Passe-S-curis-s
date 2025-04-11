document.addEventListener('DOMContentLoaded', () => {
    // Fonction helper pour récupérer les éléments
    const getEl = id => document.getElementById(id) || console.error(`Element #${id} non trouvé`);
    
    // Récupération des éléments
    const elements = {
        password: getEl('password'),
        length: getEl('length'),
        uppercase: getEl('uppercase'),
        lowercase: getEl('lowercase'),
        numbers: getEl('numbers'),
        symbols: getEl('symbols'),
        excludeSimilar: getEl('excludeSimilar'),
        generate: getEl('generate'),
        copy: getEl('copy'),
        strength: getEl('strength'),
        history: getEl('history'),
        crackTime: getEl('crackTime'),
        clearHistory: getEl('clearHistory')
    };

    // Vérifier les éléments essentiels
    if (!elements.password || !elements.length || !elements.generate) {
        console.error('Éléments essentiels manquants');
        return;
    }

    // Configuration des caractères
    const charSets = {
        uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
        lowercase: 'abcdefghjkmnpqrstuvwxyz',
        numbers: '23456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const similarChars = {
        uppercase: 'IO',
        lowercase: 'lo',
        numbers: '01'
    };

    let passwordHistory = [];

    // Fonction principale
    function generatePassword() {
        const length = parseInt(elements.length.value) || 16;
        const selectedSets = [];
        
        // Configurer les jeux de caractères
        ['uppercase', 'lowercase', 'numbers'].forEach(type => {
            if (elements[type]?.checked) {
                const base = charSets[type];
                selectedSets.push(elements.excludeSimilar?.checked ? base : base + similarChars[type]);
            }
        });
        
        if (elements.symbols?.checked) selectedSets.push(charSets.symbols);

        if (selectedSets.length === 0) {
            alert('Sélectionnez au moins un type de caractère');
            return;
        }

        // Génération sécurisée
        let password = '';
        const crypto = window.crypto || window.msCrypto;
        const values = new Uint32Array(length);
        crypto.getRandomValues(values);

        // Ajouter au moins un caractère de chaque type
        selectedSets.forEach(set => {
            password += set[Math.floor(Math.random() * set.length)];
        });

        // Compléter le mot de passe
        for (let i = password.length; i < length; i++) {
            const set = selectedSets[values[i] % selectedSets.length];
            password += set[values[i] % set.length];
        }

        // Mélanger et afficher
        elements.password.textContent = password.split('').sort(() => 0.5 - Math.random()).join('');

        // Mettre à jour l'historique
        updateHistory(password);
        
        // Calculer et afficher la force
        const entropy = calculateEntropy(password);
        updateStrength(entropy);
        estimateCrackTime(entropy);
    }

    function updateHistory(password) {
        passwordHistory = [password, ...passwordHistory.slice(0, 4)];
        if (!elements.history) return;
        
        elements.history.innerHTML = passwordHistory
            .map(pwd => `<li>${pwd}</li>`)
            .join('');
    }

    function calculateEntropy(password) {
        let charsetSize = 0;
        if (/[A-Z]/.test(password)) charsetSize += charSets.uppercase.length;
        if (/[a-z]/.test(password)) charsetSize += charSets.lowercase.length;
        if (/[0-9]/.test(password)) charsetSize += charSets.numbers.length;
        if (/[^A-Za-z0-9]/.test(password)) charsetSize += charSets.symbols.length;
        return Math.log2(charsetSize) * password.length;
    }

    function updateStrength(entropy) {
        if (!elements.strength) return;
        
        let strength, color;
        if (entropy > 100) [strength, color] = ['Très fort', '#4CAF50'];
        else if (entropy > 80) [strength, color] = ['Fort', '#8BC34A'];
        else if (entropy > 60) [strength, color] = ['Moyen', '#FFC107'];
        else [strength, color] = ['Faible', '#ff5252'];
        
        elements.strength.textContent = strength;
        elements.strength.style.color = color;
    }

    function estimateCrackTime(entropy) {
        if (!elements.crackTime) return;
        
        const seconds = Math.pow(2, entropy) / 1e12;
        elements.crackTime.textContent = 
            seconds < 1 ? 'Moins d\'une seconde' :
            seconds < 60 ? `${Math.round(seconds)} secondes` :
            seconds < 3600 ? `${Math.round(seconds/60)} minutes` :
            seconds < 86400 ? `${Math.round(seconds/3600)} heures` :
            seconds < 31536000 ? `${Math.round(seconds/86400)} jours` :
            `${Math.round(seconds/31536000)} années`;
    }

    function copyPassword() {
        if (!elements.password.textContent) {
            alert('Générez un mot de passe d\'abord');
            return;
        }
        navigator.clipboard.writeText(elements.password.textContent)
            .then(() => alert('Copié !'))
            .catch(err => console.error('Erreur:', err));
    }

    function clearHistory() {
        passwordHistory = [];
        if (elements.history) {
            elements.history.innerHTML = '';
        }
        alert('Historique effacé');
    }

    // Écouteurs d'événements
    if (elements.generate) elements.generate.addEventListener('click', generatePassword);
    if (elements.copy) elements.copy.addEventListener('click', copyPassword);
    if (elements.excludeSimilar) elements.excludeSimilar.addEventListener('change', generatePassword);
    if (elements.clearHistory) elements.clearHistory.addEventListener('click', clearHistory);
    
    ['uppercase', 'lowercase', 'numbers', 'symbols'].forEach(type => {
        if (elements[type]) elements[type].addEventListener('change', generatePassword);
    });

    if (elements.length) elements.length.addEventListener('input', generatePassword);

    // Génération initiale
    generatePassword();
});
