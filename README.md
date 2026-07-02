###### JS scaffold

# Scaffold for providing quick demos of JavaScript code to run in Browser and / or with Node / Bun, utilizing GitHub Pages

For npm packages and other JavaScript projects it is helpful to present executable code demos that can be run interactively in a browser or downloaded to inspect it with Node / Bun.

GitHub Pages is a good place to provide a demo page, and this package provides a simple scaffold for doing so. You could use it without GitHub Pages by simply replacing the "github.io" domain

*[hh lohmann &lt;hh.lohmann@gmail.com&gt;](mailto:hh.lohmann@gmail.com?subject=js-demos-scaffold-gh-pages)*

<!-- see https://hh-lohmann.github.io/github-readme-pages-switch -->
<p align="center" id="github_readme_pages_switch" style="display:none;">
  <b><i>This page may be displayed more optimal in its
  <a href="https://hh-lohmann.github.io/js-demos-scaffold-gh-pages">GitHub Pages view</a>
  </i></b>
</p>


## Synopsis

  * Copy a demo template into the .demos_container in `demos/index.html`

  * Create a demo code file from a demo code file template following file naming scheme `purpose-name` + `Case-name` + `.js`

  * Add the demo code file according to the demo's type to `sourceBrowser.js`, `sourceInstalled.js` or `sourceNode.js`


## Parameters

### purpose
Purpose of demo
  * As part of a demo's code file name (see [Details](#details))

### case
Concrete demo example
  * As part of a demo's code file name (see [Details](#details))


## Examples

### Demo code that can run directly in the browser

  1.  Copy the content of [00_demoTemplate.html](./demos/00_demoTemplate.html) into the `div.demos_container` in [demos/index.html](./demos/index.html) and fill it
      ```html
      <article class="counter">
        <h2>
          Counters
        </h2>
        <p>
          Visualize process
        </p>
        <section class="secondsPassed">
          <h3>
            Seconds passed since last action
          </h3>
          <p>
            May express "still active" or "waiting for instruction"
          </p>
          <div class="demo">
            <span class="placeholder">... loading ...</span>
          </div>
        </section>
      </article>
      ```

  2.  Save [the according `00_sourceBrowserCodeTemplate.js`](./demos/00_sourceBrowserCodeTemplate.js) as `demos/counterSecondsPassed.js` and fill it
      ```js
      // @ts-check

      // "./index-mock.js" here to mimic a "../index.js" in actual usage
      import { repeatMock } from './index-mock.js';

      /** Count from 0 to n for defined duration
      *  - E.g. as visualized timer
      *  - For demonstrating functionality, not for direct application
      * @example counterTimeoutOnly( document.getElementById( 'myOutput' ) )
      * @param targetEl - Existing DOM element to output to
      * @param [onEnd] - Optional: Callback getting (false,passedTime) as following step, default: none
      * @param [duration] - Optional: Timespan in milliseconds to run, default: 5000
      * @param [stepLength] - Optional: Timespan in milliseconds for step, default: 100
      * @returns no return
      * @type {(targetEl:Element, onEnd?:Function, duration?:number, stepLength?:number)=>void }
      */
      export const sourceBrowserSecondsPassed = function(targetEl,onEnd=()=>{},duration=3000,stepLength=1000){
        const myCounter=document.createElement('span');
        myCounter.innerText='-1';
        const myFunc = function(){
          myCounter.innerText=(parseInt(myCounter.innerText)+1).toString();
        }
        const myAsync = repeatMock( myFunc, '', duration, stepLength );
        targetEl.innerHTML=`Asynchronous output = together with start of counter at ${new Date().toLocaleTimeString()}<br>`;
        targetEl.appendChild(myCounter);
        myAsync
        .then(res=>{
          targetEl.innerHTML+=`<br>Synchronous output = after counter finished at ${new Date().toLocaleTimeString()}`;
          return res;
        })
        if(onEnd){myAsync.then(res=>onEnd(res));}
      }
      ```

  3.  Add `counterSecondsPassed.js` to the according register `demos/10_sourceBrowserDemos.js` for example code that can run directly in the browser
      ```js
      // @ts-check

      /* Formal dummy to always constitute a module */
      export const dummy=()=>{};

      /* Directly executable in browser */
      // ... possible other export ...
      export { sourceBrowserSecondsPassed } from './sourceBrowserSecondsPassed.js'
      // ... possible other export ...

      ```

### Demo code that requires the full current project to be installed

  * see [Demos](#demo)

### Demo code that needs Node / Bun to run

  * see [Demos](#demo)


## Demo

  * See [demo for demos](./demos_demo/index.html)


## Caveats

Meant for quick demos that do not require specific resources or environments besides a current browser and / or a current version of Node / Bun. You may try yourself how far you could stretch it, possibly with some modifications.


## Installation

  * Activate GitHub Pages for the repo that should host the demos (if not active yet)

  * Copy the folder `demos` from here to your repo the repo to host the demos
    * E.g. with the npm package [git-copy-file-folder](#npm-package-git-copy-file-folder):
      ```js
        gitCopyFileFolder( 'https://github.com/hh-lohmann/js-demos-scaffold-gh-pages', 'demos' )
      ```

  * Copy the corresponding [GitHub README demos switch](#hh-lohmann-github-readme-demos-switch) to the "Demo" section in the README of the project the demos are for

  * Replace placeholders over the new 'demos' folder and the extended project's README

    * `...repo-owner...` with the GitHub user / organisation of the repo that hosts the demos
      * e.g.: `joe-doe`

    * `...repo-name...` with the name of the repo that hosts the demos
      * e.g.: `my-fantastic-project`

    * `...project-title...` with the title (typically the README's top heading) of the repo that hosts the demos
      * May be identical to the "description" field in the package.json the repo and / or the project name (see above) or a rephrashing of it
      * e.g.: `Approach fantastic things without losing time for planning`


## Details

  * The prefix `00_` marks scaffold files that should not be changed

  * The prefix `10_` marks scaffold files where demo entries have to be added
    * Note that `index.html` can not be marked in this way due its technically required name

  * Demos are defined by purposes and cases
    * A purpose can have one or more cases
    * A case belongs to exactly one purpose

  * Demos are implemented by demo code and briefly described by demo descriptions

  * Demo descriptions are created in the demo folder's index.html as `article` elements for purposes containing `section` elements for cases with purpose name and case name as respective class name
    * "class" instead of "id" allows to express similarity between cases for different purposes
    * purpose name and case name should be in [Hungarion notation](#wikipedia-hungarian-notation) (lowerCamelCase)
    * NB: "class" instead of "id" also for usual reasons: class pathes are less prone to same name conflicts as ids

  * Demo code is written as JavaScript files that are called by index.html to populate according `section` elements with means to run and view or download them

  * Naming demo code files as "purpose-nameCase-name.js", e.g. according to purpose and case names, lets index.html know where to apply them
    * "purpose-name" and "Case-name" are to replaced by the respective class names used in index.html

  * Demo code files are registered in one of three demo type files to let index.html know how to present them
    * `10_sourceBrowserDemos.js`
      * To present example code that can run directly in the browser
      * Renders buttons "Start Demo" and "See / Download Code" and an output area for the demo 
    * `10_sourceInstalledDemos.js`
      * To present example code that requires the full current project (for which the demo is utilized) to be installed
      * Renders an information with a link to the project's homepage and a button to download code to run it with Node / Bun
    * `10_sourceNodeDemos.js`
      * To present example code that needs Node / Bun to run
      * Renders link to download code to run it with Node / Bun



## Source Code

  * GitHub: <https://github.com/hh-lohmann/js-demos-scaffold-gh-pages>


## License

  * MIT (see [LICENSE.txt](LICENSE.txt))


## References

### Demos for npm package predefined-test-files
  * Predefined files of certain types to test functions working with them
  * <https://hh-lohmann.github.io/predefined-test-files/demos/>

### Demos for npm package repeat-function-call-timer
  * Repeat or retry a function call until it returns a specific value or a timeout is reached
  * <https://hh-lohmann.github.io/repeat-function-call-timer/demos/>

### hh lohmann: GitHub README demos switch
  * Markdown snippet to switch demos link to local dev version instead of display on GitHub Pages
  * <https://hh-lohmann.github.io/github-readme-demos-switch/>

### npm package: git-copy-file-folder
  * Copy file / folder from Git repo without cloning
  * <https://hh-lohmann.github.io/git-copy-file-folder/>

### Wikipedia: Hungarian notation
  * <https://en.wikipedia.org/wiki/Hungarian_notation>


<!-- see https://hh-lohmann.github.io/html-endspacer -->
<p id="endspacer" data-version="0.2.0" title="Endspacer - helps to align scrolling and positioning link targets | Scroll up to content or click / touch to jump to page top" align="center"><a href="#top"><img alt="Endspacer: './markdown-assets/endspacer.png' missing - see https://hh-lohmann.github.io/html-endspacer" src="./markdown-assets/endspacer.png" height="1000" width="100%"><br>[top]</a></p>
