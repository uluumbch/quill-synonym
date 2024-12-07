import './synonym.css';

class Synonym {
    constructor(quill, options) {
        this.quill = quill;
        this.options = options;
        this.container = document.querySelector(options.container) ?? quill.container;
        
        // Create and inject the dialog HTML
        this.setupDialog();
        
        // Bind methods to maintain 'this' context
        this.showDialog = this.showDialog.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        
        this.quill.getModule('toolbar').addHandler('synonym', this.showDialog);

    }

    setupDialog() {
        this.dialog = document.createElement('div');
        this.dialog.className = 'ql-synonym-dialog';
        this.dialog.style.display = 'none';
        this.dialog.innerHTML = `
            <div class="ql-synonym-dialog-content">
                <input type="text" class="ql-synonym-input" placeholder="Enter word">
                <div class="ql-synonym-list"></div>
                <div class="ql-synonym-buttons">
                    <button class="ql-synonym-submit">Find Synonyms</button>
                    <button class="ql-synonym-cancel">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.dialog);

        // Add event listeners
        const submitButton = this.dialog.querySelector('.ql-synonym-submit');
        submitButton.addEventListener('click', () => this.handleSubmit());

        this.dialog.querySelector('.ql-synonym-cancel').addEventListener('click', () => this.closeDialog());

        this.dialog.querySelector('.ql-synonym-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.handleSubmit();
            if (e.key === 'Escape') this.closeDialog();
        });
    }

    showDialog() {
        const range = this.quill.getSelection();
        if (range) {
            const text = this.quill.getText(range.index, range.length);
            this.currentRange = range;
            this.dialog.querySelector('.ql-synonym-input').value = text;
        }
        this.dialog.style.display = 'block';
        this.dialog.querySelector('.ql-synonym-input').focus();
    }

    async handleSubmit() {
        const word = this.dialog.querySelector('.ql-synonym-input').value.trim();
        if (!word) return;

        try {
            const synonymSubmitBtn = this.dialog.querySelector('.ql-synonym-submit');
            synonymSubmitBtn.disabled = true;
            synonymSubmitBtn.textContent = 'Finding synonyms...';
            const synonyms = await this.fetchSynonyms(word);
            this.showSynonymsList(synonyms);
            synonymSubmitBtn.disabled = false;
            synonymSubmitBtn.textContent = 'Find Synonyms';
        } catch (error) {
            console.error('Error fetching synonyms:', error);
            synonymSubmitBtn.disabled = false;
            synonymSubmitBtn.textContent = 'Find Synonyms';
        }
    }

    async fetchSynonyms(word) {
        const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
        const data = await response.json();
        return data.map(item => item.word);
    }

    showSynonymsList(synonyms) {
        const listContainer = this.dialog.querySelector('.ql-synonym-list');
        listContainer.innerHTML = synonyms.map(syn => `
            <div class="ql-synonym-item" data-word="${syn}">${syn}</div>
        `).join('');

        // Add click handlers for synonym selection
        listContainer.querySelectorAll('.ql-synonym-item').forEach(item => {
            item.addEventListener('click', () => this.replaceSynonym(item.dataset.word));
        });
    }

    replaceSynonym(synonym) {
        if (this.currentRange) {
            this.quill.deleteText(this.currentRange.index, this.currentRange.length);
            this.quill.insertText(this.currentRange.index, synonym);
            this.closeDialog();
        }
    }

    closeDialog() {
        this.dialog.style.display = 'none';
        this.dialog.querySelector('.ql-synonym-list').innerHTML = '';
        this.dialog.querySelector('.ql-synonym-input').value = '';
    }
}

if (typeof window !== 'undefined' && window.Quill) {
    window.Quill.register('modules/synonym', Synonym);

    window.QuillSynonym = Synonym; 
}

export default Synonym;