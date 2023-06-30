transpiled from python code, kakaodecrypt(https://github.com/jiru/kakaodecrypt).

### dependency
use crypto, included in node's default libraries


# How to use this repo?


### as typescript
import db_parser.ts from src/db_parser.ts

and just one simple function, decrypt(...)


usage:

```typescript
import { decrypt } from "../src/db_parser"

// create key Cache store, to skip generatking key for known userId
let keyCache:Record<string, number[]> = {};

const prefixIndex = 30;
const testCase = "7rKRBAgN/OoFY6iTFFuz6dzRU3zEWqC9RGB71H8ahCUx5ka5gbcQsPB1cUHwZx58NfK+Kmo3L/rcCPoO1ygQuw=="
const myUserId = "8466014366049313279";
const deText = decrypt(testCase, myUserId, prefixIndex, keyCache);
console.log(deText);
//expect: 텍스트 데이터랑 유저아이디 몇개 보내봐요
console.log(keyCache);
/*expect: {
  '8466014366049313279': [
    253,  40,  55, 146,   8,  96, 158, 134,
    248, 238, 197, 213,  44,  98,  22, 164,
    114,  74, 233, 172,  79, 217,   6, 186,
    142,  59, 163,  16, 224,  23,  72, 172
  ]
}   
*/


```



### as javascript
use require("") function to import this lib

usage:

```javascript
const dbParser = require("../dist/db_parser")

// create key Cache store, to skip generatking key for known userId
let keyCache = {};

const prefixIndex = 30;
const testCase = "7rKRBAgN/OoFY6iTFFuz6dzRU3zEWqC9RGB71H8ahCUx5ka5gbcQsPB1cUHwZx58NfK+Kmo3L/rcCPoO1ygQuw=="
const myUserId = "8466014366049313279";
const deText = decrypt(testCase, myUserId, prefixIndex, keyCache);
console.log(deText);
//expect: 텍스트 데이터랑 유저아이디 몇개 보내봐요
console.log(keyCache);
/*expect: {
  '8466014366049313279': [
    253,  40,  55, 146,   8,  96, 158, 134,
    248, 238, 197, 213,  44,  98,  22, 164,
    114,  74, 233, 172,  79, 217,   6, 186,
    142,  59, 163,  16, 224,  23,  72, 172
  ]
}   
*/

```


done




This project is licensed under the terms of the MIT license.





#### see also:



original code: python kakaotalk db decrypt
https://github.com/jiru/kakaodecrypt