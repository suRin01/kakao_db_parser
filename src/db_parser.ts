import Crypto from 'node:crypto'

const range = (start:number, stop:number, step:number = 1)=>{
    if (typeof stop == 'undefined') {
        stop = start;
        start = 0;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    let result:number[] = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

const genSalt = (prefixString:string, userId: string)=>{
    const salt = prefixString + userId;
    const reusltSalt = salt.slice(0, 16);
    return reusltSalt;
}

const pkcs16adjust = (a:number[], aOff:number, b:number[])=>{
    let x = (b[b.length-1] & 0xff) + (a[aOff + b.length - 1] & 0xff) + 1
    a[aOff + b.length - 1] = x % 256;
    x = x >> 8;
    range(b.length-2, -1, -1).forEach((i)=>{
        x = x + (b[i] & 0xff) + (a[aOff + i] & 0xff);
        a[aOff + i] = x % 256;
        x = x >> 8;
    })

}

const deriveKey = (password:number[], salt:string, iteration:number = 2, dkeySize:number = 32)=>{
    let hasher = Crypto.createHash("sha1");
    const v = 64;
    const u = 20;

    let S = Array(v * Math.trunc((salt.length + v - 1)/v)).fill(0);
    range(0, S.length).forEach((i)=>{
        S[i] = salt.split("")[i % salt.length];
    })
    let S_CCA = S.map(char=> char.charCodeAt())
    let P = Array(v * Math.trunc((password.length + v - 1) / v)).fill(0);
    range(0, P.length).forEach((i)=>{
        P[i] = password[i % password.length]
    })

    let I = S_CCA.concat(P) as number[];

    let B = Array(v).fill(0);
    let c = Math.trunc((dkeySize + u - 1) / u);

    let D = Array(v).fill(1);
    let dKey = Array(dkeySize).fill(0) as number[];

    range(1, c+1).forEach((i)=>{
        hasher = Crypto.createHash("sha1");
        hasher.update(Buffer.from(D));
        hasher.update(Buffer.from(I));
        let A = hasher.digest();

        range(1, iteration).forEach((j)=>{
            hasher = Crypto.createHash("sha1");
            hasher.update(A);
            A = hasher.digest();
        })

        let AList: number[] = []
        A.forEach(v => AList.push(v))
        range(0, B.length).forEach((j)=>{
            B[j] = AList[j % AList.length]
        })

        range(0, Math.trunc(I.length / v)).forEach((j)=>{
            pkcs16adjust(I, j * v, B)
        })

        let start = (i - 1) * u;
        if( i == c ){
            let temp:number[] = []
            A.forEach(v => temp.push(v))

            let newDKey:number[] = []
            let newAsubArr: number[] = [];
            A.subarray(0, dkeySize-start+1).forEach(v => newAsubArr.push(v));
            newDKey = newDKey.concat(dKey.slice(0, start))
            newDKey = newDKey.concat(newAsubArr)
            newDKey = newDKey.concat(dKey.slice(dkeySize))
            dKey = newDKey.slice(0, -1);

        }else{
            let newDKey:number[] = []
            
            let newAsubArr: number[] = [];
            A.subarray(0, A.length).forEach(v => newAsubArr.push(v));

            newDKey = newDKey.concat(dKey.slice(0, start));
            newDKey = newDKey.concat(newAsubArr)
            newDKey = newDKey.concat(dKey.slice(A.length-1-1, -1))

            dKey = newDKey.slice(0, -1);
        }

        
    })

    return dKey;
}
/**
 * 작성일: 2023. 06. 26
 * 작성자: suRin01 @ github.com
 * repo: 
 * 카카오톡 db에서 불러온 메세지를 복호화해주는 함스
 * 
 * @param textData 메세지 텍스트 값
 * @param userId 유저 고유 id
 * @param prefixIndex 카카오에서 사용하는 프리픽스, 기본값은 30
 * @returns 
 */
export const decrypt = (textData: string, userId: string, prefixIndex:number = 30)=>{
    const prefixes = ["", "", "12", "24", "18", "30", "36", "12", "48", "7", "35", "40", "17", "23", "29", "isabel", "kale", "sulli", "van", "merry", "kyle", "james", "maddux", "tony", "hayden", "paul", "elijah", "dorothy", "sally", "bran", "extr.ursra"];
    const gen_password = [0, 22, 0, 8, 0, 9, 0, 111, 0, 2, 0, 23, 0, 43, 0, 8, 0, 33, 0, 33, 0, 10, 0, 16, 0, 3, 0, 3, 0, 7, 0, 6, 0, 0]
    const iv = [15, 8, 1, 0, 25, 71, 37, -36, 21, -11, 23, -32, -31, 21, 12, 53];
    
    const salt = genSalt(prefixes[prefixIndex], userId);
    const key = deriveKey(gen_password, salt, 2, 32);
    
    const decipher = Crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
    const decrypted = decipher.update(textData, 'base64', 'utf8') + decipher.final('utf8')

    return decrypted
}