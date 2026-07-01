// @ts-check

/** type { string } */
import * as demos from './_list.js';

/** Disable buttons while one demo is running
 *  - I.e. make running demo exclusive
 *  - As a function of its own to act as callback
 * @param disable - disable: true or false
 * @param callingEl - Element that called function: to adapt tooltip
 * @type {(disable:boolean,callingEl:Element)=>any}
 */
const buttonsDisable = function(disable,callingEl){
  document.querySelectorAll('button').forEach((value)=>{
    value.disabled=disable;
    if(disable){
      let another=' another ';
      if(value==callingEl){
        another=' ';
      }
      value.style.cursor='wait';
      value.title=`Disabled while${another}demo is running`;
    }
    else{
      value.style.cursor='unset';
      value.title='';
    }
  });
  return true;
}

/** @type {(elem:Element,demo:string)=>void} */
const createDemo = function(elem,demo){
  const elemOutputArea=createDemoOutput();
  elem.replaceChildren(elemOutputArea,createDemoButtonStart(demo,elemOutputArea),createDemoButtonCode(demo));
}

/** @type {(demo:string)=>Element} */
const createDemoButtonCode = function(demo){
  const myEl=document.createElement('button');
  myEl.innerText='See / Download Code';
  myEl.onclick=()=>document.location.href='./_seeDownloadCodeFile.html?file=./'+demo+'.js';
  return myEl;
}

/** @type {(demo:string,outputArea:Element)=>Element} */
const createDemoButtonStart = function(demo,outputArea){
  const myEl=document.createElement('button');
  myEl.innerText='Start Demo';
  myEl.onclick=()=>{
    buttonsDisable(true,myEl);
    // @ts-ignore
    demos.sourceBrowser[demo](outputArea,()=>buttonsDisable(false,myEl));
  }
  return myEl;
}

/** @type {()=>Element} */
const createDemoOutput = function(){
  const myEl=document.createElement('div');
  const myPlaceholder=document.createElement('span');
  myPlaceholder.className='placeholder';
  myPlaceholder.innerText='Demo output goes here';
  myEl.appendChild(myPlaceholder);
  return myEl;
}

const getDemoType=function(demo=''){
  const myTypes=[
    ['sourceBrowser','function'],
    ['sourceNode','array'],
    ['sourceInstalled','array']
  ]
  for(let i=0;i<myTypes.length;i++){
    if(!Object.hasOwn(demos,myTypes[i][0])) continue;
    if(myTypes[i][1]==='function'){
      // @ts-ignore
      if(Object.hasOwn(demos[myTypes[i][0]],demo)) return myTypes[i][0];
    }
    if(myTypes[i][1]==='array'){
      // @ts-ignore
      if(demos[myTypes[i][0]].includes(`./${demo}.js`)) return myTypes[i][0];
    }
  }
  return '';
}

/** @type {(demoCanvas:Element,demoName:string,type:string)=>void} */
const showSourcecode=function(demoCanvas,demoName,demoType){
  const myContent=document.createElement('div');
  myContent.className='info';
  const myOutput=document.createElement('div'); 
  // @ts-ignore
  myOutput.appendChild(document.querySelector('.demo .placeholder').cloneNode(true)); 
  demoCanvas.replaceChildren(myContent,myOutput);
  fetch(`./${demoName}.js`)
  .then(res=>res.text())
  .then(res=>{
    const myChild=document.createElement('pre');
    myChild.innerText=res;
    myChild.className='demoCode';
    myOutput.replaceChildren(myChild);
    return res;
  })
  .then(res=>{
    const myBtn=document.createElement('button');
    myBtn.innerText='Download Code';
    myBtn.onclick=()=>save_as_file(`${demoName}.js`,res);
    if(demoType==='sourceNode'){
      myContent.appendChild(myBtn);
    }
    if(demoType==='sourceInstalled'){
      myContent.innerHTML=`This code requires <a href="#" onclick="document.querySelector(\'#github_readme_demos_switch>a\').click();">...repo-name...</a> to be installed. `;
      myContent.appendChild(myBtn);
      myContent.appendChild(document.createTextNode(' to an appropriate environment'));
    }
    myContent.appendChild(document.createTextNode(' and run it with Node / Bun'));
  })
}

const hydrateDemosPage = function(){
  document.querySelectorAll('body>.demos_container>article')
  .forEach((value)=>{
    const purposeName=value.className;
    document.querySelectorAll('article>section')
    .forEach((value)=>{
      const caseName=value.className;
      const demoCanvas=document.querySelector('.'+purposeName+'>.'+caseName+'>.demo');
      const demoName=purposeName+caseName.charAt(0).toUpperCase()+caseName.slice(1);
      if(!demoCanvas) return;
      const demoType=getDemoType(demoName);
      if(demoType===''){
        demoCanvas.innerHTML='demo not found';
        return;
      }
      if(demoType==='sourceBrowser'){
        createDemo(demoCanvas,demoName);
        return;
      }
      showSourcecode(demoCanvas,demoName,demoType);
    })
  })
}

/** Trigger "Save as file" for given data or current HTML document
 *  - Throws an error if used outside browser (= no document object)
 * @example
 *  - save_as_file()
 *  - save_as_file( 'demo.json', '{ "key": "val" }' )
 *  - save_as_file( 'demo.txt', 'First line\nSecond line' )
 * @param [ file_name ] - file name to suggest for file to save, defaults to title of current HTML document + '.html'
 * @param [ data ] - data to save, defaults to current HTML document
 * @param [ mime_type ] - MIME type for data to save as, defaults to trying to guess from file_name's extension, falling back to "text/html"
 * @returns true on success, undefined false
 * @see {@link https://hh-lohmann.github.io/browser-save-data-as-file/}
 * @version 1.1.1
 * @type { ( file_name?:string, data?: string, mime_type?: string ) => boolean | undefined }
 */
const save_as_file = function( file_name, data, mime_type ) {
  if( typeof document === 'undefined' ) throw Error( 'save_as_file: Can only be run in browsers (with document object)' )
  if( ! file_name ) file_name = `${ document.title }.html`
  if( ! data ) data = '<!DOCTYPE html>\\n' + document.documentElement.innerHTML
  if( ! mime_type ) {
    let extension = file_name.split( '.' ).slice( -1 )[ 0 ]
    if( extension === 'html' ) mime_type = 'text/html'
    if( extension === 'json' ) mime_type = 'application/json'
    if( extension === 'txt' ) mime_type = 'text/plain'
  }
  let hidden_a = document.createElement( 'a' )
  hidden_a.download = file_name
  hidden_a.href = URL.createObjectURL( new Blob( [ data ], { type: mime_type } ) )
  hidden_a.click()
  return true
}

hydrateDemosPage();
