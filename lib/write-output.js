const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);
const puppeteer = require('puppeteer');

const getOutputFilePath = require('./get-output-file-path');
const isHttpUrl = require('./is-http-url');

/**
 * Create a PDF and write it to disk.
 *
 * @param {string} mdFilePath path to the source markdown file
 * @param {string} html HTML document as a string
 * @param {Object} config configuration object
 * @param {string} [config.dest] path to write the output to
 * @param {number} config.port port that the server runs on
 * @param {string[]} config.stylesheet list of stylesheets (urls or paths)
 * @param {string} config.css string with CSS rules
 * @param {Object} config.pdf_options PDF options for Puppeteer
 * @param {boolean} config.as_html whether to save the output as HTML instead
 * @param {boolean} config.devtools show the Devtools instead of saving the PDF
 * @param {puppeteer.LaunchOptions} config.launch_options browser launch options
 *
 * @returns a promise that resolves once the file is written
 */
module.exports = async(mdFilePath, html, config) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], devtools: config.devtools, ...config.launch_options });

    const page = await browser.newPage();

    // this makes sure that relative paths are resolved properly
    await page.goto(`http://localhost:${config.port}`);

    // overwrite the content with what was generated from the markdown
    await page.setContent(html);

    // add all the stylesheets and custom css
    await Promise.all([
        ...config.stylesheet.map(async stylesheet =>
            page.addStyleTag(isHttpUrl(stylesheet) ? { url: stylesheet } : { path: stylesheet }),
        ),
        page.addStyleTag({ content: config.css }),
    ]);

    /**
     * Wait for network to be idle.
     *
     * @todo replace with page.waitForNetworkIdle once exposed
     * @see https://github.com/GoogleChrome/puppeteer/issues/3083
     */
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.evaluate(() => history.pushState(null, null, '#')), // eslint-disable-line no-undef
    ]);

    /**
     * @todo should it be `getOutputFilePath(config.dest || mdFilePath, config)`?
     */
    const outputFilePath = config.dest || getOutputFilePath(mdFilePath, config);

    if (config.devtools) {
        await new Promise(resolve => page.on('close', resolve));
    } else if (config.as_html) {
        const content = await page.content();
        await writeFile(outputFilePath, content);
    } else {
        await page.emulateMediaType('screen');
        //console.log('pdf_options:', config.pdf_options);
        await page.pdf({ path: outputFilePath, ...config.pdf_options });
    }

    browser.close();

    return config.devtools ? {} : { filename: outputFilePath };
};