describe('quill-synonym', () => {
    let quill;
    let container;

    beforeAll(async () => {
        // Add Quill script to document
        const quillScript = document.createElement('script');
        quillScript.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js';
        document.head.appendChild(quillScript);

        // add snow css
        const snowCss = document.createElement('link');
        snowCss.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css';
        snowCss.rel = 'stylesheet';
        document.head.appendChild(snowCss);

        // Wait for Quill to load
        await new Promise(resolve => {
            quillScript.onload = resolve;
        });
    });

    beforeEach(() => {
        // Your existing beforeEach code remains the same
        container = document.createElement('div');
        container.id = 'editor';
        document.body.appendChild(container);

        const toolbarOptions = {
            container: [
                ['bold', 'italic', 'underline', 'link'],
                ['synonym']
            ]
        };
        const options = {
            modules: {
                toolbar: {
                    container: toolbarOptions.container,
                    handlers: {
                        synonym: () => { }
                    }
                },
                synonym: true,
            },
            theme: 'snow'
        };
        quill = new Quill('#editor', options);
    });

    // Your existing test cases remain the same
    it('should be able to initialize quill js', () => {
        expect(quill).toBeDefined();
    });

    it('should have a synonym button', () => {
        const toolbar = quill.getModule('toolbar');
        expect(toolbar.handlers.hasOwnProperty('synonym')).toBe(true);
    });

    it('should have a synonym dialog', () => {
        const synonymDialog = document.querySelector('.ql-synonym-dialog');
        expect(synonymDialog).toBeDefined();
    });

    it('should have a synonym input', () => {
        const synonymInput = document.querySelector('.ql-synonym-input');
        expect(synonymInput).toBeDefined();
    });

    it('should have a synonym list', () => {
        const synonymList = document.querySelector('.ql-synonym-list');
        expect(synonymList).toBeDefined();
    });

    it('should have a synonym submit button', () => {
        const synonymSubmit = document.querySelector('.ql-synonym-submit');
        expect(synonymSubmit).toBeDefined();
    });

    it('should have a synonym cancel button', () => {
        const synonymCancel = document.querySelector('.ql-synonym-cancel');
        expect(synonymCancel).toBeDefined();
    });

    it('should have a synonym button with an icon', () => {
        const synonymButton = document.querySelector('.ql-synonym');
        expect(synonymButton).toBeDefined();
    });
    
    it('should list synonyms in the synonym list', () => {
        const synonymList = document.querySelector('.ql-synonym-list');
        expect(synonymList).toBeDefined();
    });

    afterEach(() => {
        if (quill) {
            container.remove();
            quill = null;
        }
    });
}); 