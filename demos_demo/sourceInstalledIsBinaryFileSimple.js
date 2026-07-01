// @ts-check

import {openSync,readSync,rmSync,statSync,writeFileSync} from 'node:fs';
import { tmpdir } from 'node:os';

import { isBinaryFileSimple } from 'is-binary-file-simple' ;

/** Reading first line from text file
 *  - Error if given file is binary
 * @example getFirstLine( './file.txt' )
 * @param file - File to read (name / path)
 * @returns -
 * @type {(file:string)=>void}
 */
const getFirstLine = function( file ){
  if( isBinaryFileSimple( file ) ){
    console.log( `\n# Error:\n# Binary file "${ file }" cannot be read by line\n` );
  }
  else{
    const theFile = {
      fd: openSync(file,'r'),
      size: statSync(file).size
    };
    let myBytes='';
    while( myBytes.slice(-1)!=='\n' && myBytes.length <= theFile.size ){
      let myPeek=Buffer.alloc(1);
      readSync(theFile.fd,myPeek,0,1,myBytes.length);
      myBytes += myPeek;
    }
    console.log( `\n# First line of "${ file }":` );
    if(myBytes){
      let myLine=Buffer.alloc((myBytes.length-1));
      readSync(theFile.fd,myLine,0,(myBytes.length-1),0)
      console.log(myLine.toString());
    }
  }
}

/* Test for Hebrew */
// Create testfiles
const myRandomName=crypto.randomUUID().split('-')[0];
const myBuffer=Buffer.alloc(12, '\u0007');
writeFileSync( `${tmpdir()}/random_${myRandomName}_1`, 'אני קובץ טקסט\nבאמת' );
writeFileSync( `${tmpdir()}/random_${myRandomName}_2`, myBuffer );
// Test
getFirstLine( `${tmpdir()}/random_${myRandomName}_1` );
getFirstLine( `${tmpdir()}/random_${myRandomName}_2` );
// Delete testfiles
rmSync( `${tmpdir()}/random_${myRandomName}_1` );
rmSync( `${tmpdir()}/random_${myRandomName}_2` );