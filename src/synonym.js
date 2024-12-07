import './synonym.css';
import Quill from 'quill';
const Module = Quill.import('core/module');

class Synonym extends Module {
    constructor(quill, options) {
        super(quill, options);
        this.quill = quill;
        this.options = options;
        this.container = document.querySelector(options.container) ?? quill.container;
        
        // Create and inject the dialog HTML
        this.setupDialog();
        
        // Bind methods to maintain 'this' context
        this.showDialog = this.showDialog.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeDialog = this.closeDialog.bind(this);

        this.toolbar = quill.getModule('toolbar');
    
        // Add handler for the synonym button
        if (typeof this.toolbar !== 'undefined') {
            this.toolbar.addHandler('synonym', this.showDialog);
        }

        const synonymBtns = document.getElementsByClassName('ql-synonym');
        if (synonymBtns) {
            [].slice.call(synonymBtns).forEach((btn) => {
                btn.innerHTML = options.buttonIcon;
            });
        }
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

Synonym.DEFAULTS = {
    buttonIcon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-chart-donut" version="1.1" id="svg3" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs3" /><path stroke="none" d="M 0,0 H 24 V 24 H 0 Z" fill="none" id="path1" /><path id="rect3" style="fill:none;stroke:#000000" d="M 6.4044018,0.9071231 2.1602611,5.1493106 V 20.682514 H 13.611433 V 0.9071231 Z" /><path id="rect4" style="fill:#000000;stroke:#000000" d="m 6.6314831,1.6137869 -3.763672,3.7617187 h 3.763672 z" /><text xml:space="preserve" style="fill:#000000;stroke:#000000" x="3.7842846" y="16.136419" id="text4"><tspan id="tspan4" x="3.7842846" y="16.136419">A</tspan></text><path id="path4" style="fill:none;stroke:#000000" d="M 13.611328,2.7851562 V 20.681641 H 9.140625 v 1.878906 H 20.591797 V 2.7851562 Z" /><path style="fill:#000000;stroke:#000000" d="m 14.645554,6.460414 4.355664,-0.0877" id="path5" /><path style="fill:#000000;stroke:#000000" d="m 14.645554,8.828258 4.355664,-0.0877" id="path6" /><path style="fill:#000000;stroke:#000000" d="m 14.645554,11.196102 4.355664,-0.0877" id="path7" /><path style="fill:#000000;stroke:#000000" d="m 14.645554,13.563946 4.355664,-0.0877" id="path8" /><path style="fill:#000000;stroke:#000000" d="m 14.645554,15.93179 4.355664,-0.0877" id="path9" /><path style="fill:#000000;stroke:#000000" d="m 14.645554,18.299634 4.355664,-0.0877" id="path10" /><path style="fill:#000000;stroke:#000000" d="m 14.645554,20.404384 4.355664,-0.0877" id="path11" /></svg>'
};

if (typeof window !== 'undefined' && window.Quill) {
    window.Quill.register('modules/synonym', Synonym);

    window.QuillSynonym = Synonym; 
}

export default Synonym;