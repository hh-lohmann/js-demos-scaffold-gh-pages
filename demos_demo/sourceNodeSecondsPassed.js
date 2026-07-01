// @ts-check

let _passedTime=0;

/** Count from 0 to n for defined duration
 *  - E.g. as visualized command line timer
 *  - For demonstrating functionality, not for direct application
 * @example sourceNodeSecondsPassed( document.getElementById( 'myOutput' ) )
 * @param [duration] - Optional: Timespan in milliseconds to run, default: 3000
 * @param [stepLength] - Optional: Timespan in milliseconds for step, default: 1000
 * @returns no return
 * @type {(duration?:number, stepLength?:number)=>void }
 */
export const sourceNodeSecondsPassed = function(duration=3000,stepLength=1000){
  let myCounter=0;
  const myFunc = function(){
    console.clear();
    console.log(++myCounter);
    return myCounter;
  }
  myRepeat( myFunc, 3, duration, stepLength )
}

sourceNodeSecondsPassed(5000);


/** @type{(functionToCall:Function, expectedValue:bigint | boolean | number | string | undefined, timeout:number, interval:number, whenInterval?:Function ) => Promise<{match:boolean,passedTime:number}>} */
function myRepeat(functionToCall, expectedValue, timeout, interval, whenInterval=undefined){
  return new Promise((resolve)=>{
  /** @type{(functionToCall:Function, expectedValue:bigint | boolean | number | string | undefined, timeout:number, interval:number, whenInterval?:Function ) => any} */
    const _repeat=function( _functionToCall, _expectedValue, _timeout, _interval, _whenInterval=undefined){
      if(_passedTime>=_timeout){
        resolve({match:false,passedTime:_passedTime});
        _passedTime=0;
        return false;
      }
      if(_functionToCall()===_expectedValue){
        resolve({match:true,passedTime:_passedTime});
        _passedTime=0;
        return true;
      }
      if(_whenInterval) _whenInterval(_passedTime);
      _passedTime+=_interval;
      setTimeout(()=>_repeat(_functionToCall, _expectedValue,_timeout, _interval, _whenInterval),_interval);
    }
    _repeat(functionToCall, expectedValue, timeout, interval, whenInterval);
  })
}
