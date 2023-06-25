# How to use this repo?


### as typescript
import db_parser.ts from src/db_parser.ts

and just one simple function, decrypt(...)


usage:

```typescript
import { decrypt } from "../src/db_parser"


const prefixIndex = 30;
const testCase = "7rKRBAgN/OoFY6iTFFuz6dzRU3zEWqC9RGB71H8ahCUx5ka5gbcQsPB1cUHwZx58NfK+Kmo3L/rcCPoO1ygQuw=="
const myUserId = "8466014366049313279";
const deText = decrypt(testCase, myUserId, prefixIndex)
console.log(deText);
//expect: 텍스트 데이터랑 유저아이디 몇개 보내봐요

```



### as javascript
use require("") function to import this lib

usage:

```javascript
const dbParser = require("../dist/db_parser")

const prefixIndex = 30;
const testCase = "7rKRBAgN/OoFY6iTFFuz6dzRU3zEWqC9RGB71H8ahCUx5ka5gbcQsPB1cUHwZx58NfK+Kmo3L/rcCPoO1ygQuw=="
const myUserId = "8466014366049313279";
const deText = dbParser.decrypt(testCase, myUserId, prefixIndex)
console.log(deText);
//expect: 텍스트 데이터랑 유저아이디 몇개 보내봐요

```


done
