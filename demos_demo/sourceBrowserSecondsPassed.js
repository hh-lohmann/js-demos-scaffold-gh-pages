// @ts-check

// "./index-mock.js" here to mimic a "../index.js" in actual usage
//  * Use a tool like
//    https://github.com/cncolder/vscode-source-map-visualization
//    in VS Code to verify that minified "index-mock.js" against
//    "index-mock.js.map" as harmless
import { repeatMock } from './index-mock.js';

/** Count from 0 to n for defined duration
 *  - E.g. as visualized timer
 *  - For demonstrating functionality, not for direct application
 * @example sourceBrowserSecondsPassed( document.getElementById( 'myOutput' ) )
 * @param targetEl - Existing DOM element to output to
 * @param [onEnd] - Optional: Callback getting (false,passedTime) as following step, default: none
 * @param [duration] - Optional: Timespan in milliseconds to run, default: 3000
 * @param [stepLength] - Optional: Timespan in milliseconds for step, default: 1000
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
