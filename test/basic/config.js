module.exports = {
    // "stylesheet_encoding": "utf-8"
    // "stylesheet": [
    //     "path/to/style.css",
    //     "https://example.org/stylesheet.css",
    // ],
    // "css": "body { color: tomato; }",
    // "body_class": "markdown-body",
    // "highlight_style": "monokai",
    // "marked_options": {
    //     "headerIds": false,
    //     "smartypants": true,
    // },
    "pdf_options": {
        "format": "A4",
        "margin": "30mm 25mm",
        "printBackground": true,
        "displayHeaderFooter": true,
        // NOTE: It seems that header and footer doesn't support 'style: background-color'
        "headerTemplate": "<div style='margin:30px 60px 0; width: 100%; font-size: 11px; border-bottom: solid lightgray 1px;'>  <span class='title'></span>  <div class='date' style='float: right'></div>  </div>" ,
        "footerTemplate": "<div style='margin:0 60px 30px; width: 100%; font-size: 9px; border-top: solid lightgray 1px;'> <div style='margin: 0 auto; width: fit-content;'>  <span class='pageNumber'></span> / <span class='totalPages'></span>  </div>  </div>" ,
    },
};



// Also could put the following in md file:
// ---
// pdf_options:
//   format: A4
//   margin: 30mm 20mm
//   printBackground: true
//   displayHeaderFooter: true
//   headerTemplate: |-
//     <style>
//       section {
//         margin: 0 auto;
//         font-family: system-ui;
//         font-size: 11px;
//       }
//     </style>
//     <section>
//       <span class="date"></span>
//     </section>
//   footerTemplate: |-
//     <section>
//       <div>
//         Page <span class="pageNumber"></span>
//         of <span class="totalPages"></span>
//       </div>
//     </section>
// ---
