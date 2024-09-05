/**
 * @fileoverview
 * 
 * A very simple web component displaying the orignal
 * and generated code next to each other plus the source map.
 */

class Viewer extends HTMLElement {

  async connectedCallback() {
    const originalUrl = this.getAttribute('original');
    const generatedUrl = this.getAttribute('generated');
    const sourceMapUrl = this.getAttribute('source-map');

    const [originalContent, generatedContent, sourceMapContent] = await Promise.all([
      fetch(originalUrl).then(r => r.text()),
      fetch(generatedUrl).then(r => r.text()),
      fetch(sourceMapUrl).then(r => r.json()),
    ]);

    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <style>
        pre {
          margin: 0px;
          padding: 10px;
          text-wrap: wrap;
        }

        .item {
          margin: 10px;
          display: flex;
          flex-direction: column;
        }
        
        .code {
          margin-top: 5px;
          border: 1px solid;
          flex: 1;
        }
      </style>
      <div style="display: flex;">
        <div class="item">
          <strong>Original</strong>
          <div class="code">
            <pre>${originalContent}</pre>
          </div>
        </div>
        <div class="item">
          <strong>Generated</strong>
          <div class="code">
            <pre>${generatedContent}</pre>
          </div>
        </div>
      </div>
      <div class="item">
      <strong>SourceMap (pretty-printed)</strong>
        <div class="code">
          <pre>${JSON.stringify(sourceMapContent, undefined, 2)}</pre>
        </div>
      </div>
    `;
  }
}

customElements.define('source-viewer', Viewer);
