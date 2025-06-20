# Quill Synonym Module
<!-- GitAds-Verify: CRAQ1LR4D8B7JXTSKEAWH1H62KW68YV9 -->
A Quill.js module that adds synonym lookup functionality to your editor.

## Installation

```bash
npm install quill-synonym
```

## Usage

To use the module, simply import it into your project and initialize it with the desired options.

```javascript
import Quill from 'quill';
import QuillSynonym from 'quill-synonym';
import 'quill-synonym/dist/synonym.css';

// Register the module
Quill.register('modules/synonym', QuillSynonym);

// Initialize Quill with the synonym module
const quill = new Quill('#editor', {
    modules: {
        toolbar: [
            ['bold', 'italic'],
            ['synonym'] // Add synonym button to the toolbar
        ],
            synonym: {
                container: '#editor'
            }
        },
    theme: 'snow'
});

```

## Demo
[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=uluumbch/quill-synonym@github)](https://gitads.dev/v1/ad-track?source=uluumbch/quill-synonym@github)


![Demo](./docs/images/demo.gif)

See the [demo](https://uluumbch.github.io/quill-synonym/demos/) for live examples.

## Features
- Adds a synonym lookup button to the toolbar
- Uses Datamuse API for synonym suggestions
- Easy word replacement with click selection
