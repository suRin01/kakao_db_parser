from Crypto.Cipher import AES
import hashlib
import base64
import sys
def genSalt(user_id):
    incept = 'extr.ursra'
    salt = incept + str(user_id)
    
    salt = salt[0:16].encode()
    return salt

def pkcs16adjust(a, aOff, b):
    x = (b[len(b) - 1] & 0xff) + (a[aOff + len(b) - 1] & 0xff) + 1
    a[aOff + len(b) - 1] = x % 256
    x = x >> 8
    for i in range(len(b)-2, -1, -1):
        x = x + (b[i] & 0xff) + (a[aOff + i] & 0xff)
        a[aOff + i] = x % 256
        x = x >> 8

def deriveKey(password, salt, iterations, dkeySize):
    password = (password + b'\0').decode('ascii').encode('utf-16-be')
    hasher = hashlib.sha1()
    v = hasher.block_size
    u = hasher.digest_size

    S = [ 0 ] * v * int((len(salt) + v - 1) / v)
    for i in range(0, len(S)):
        S[i] = salt[i % len(salt)]
    P = [ 0 ] * v * int((len(password) + v - 1) / v)
    for i in range(0, len(P)):
        P[i] = password[i % len(password)]
    I = S + P

    B = [ 0 ] * v
    c = int((dkeySize + u - 1) / u)

    D = [ 1 ] * v
    dKey = [0] * dkeySize
    for i in range(1, c+1):
        hasher = hashlib.sha1()
        hasher.update(bytes(D))
        hasher.update(bytes(I))
        A = hasher.digest()
        for j in range(1, iterations):
            hasher = hashlib.sha1()
            hasher.update(A)
            A = hasher.digest()


        A = list(A)
        for j in range(0, len(B)):
            B[j] = A[j % len(A)]
        
        for j in range(0, int(len(I)/v)):
            pkcs16adjust(I, j * v, B)

        start = (i - 1) * u
        if i == c:
            dKey[start : dkeySize] = A[0 : dkeySize-start]
        else:
            dKey[start : start+len(A)] = A[0 : len(A)]
    return bytes(dKey)

def decrypt(user_id, b64_ciphertext):
    password = b'\x16\x08\x09\x6f\x02\x17\x2b\x08\x21\x21\x0a\x10\x03\x03\x07\x06'
    iv = b'\x0f\x08\x01\x00\x19\x47\x25\xdc\x15\xf5\x17\xe0\xe1\x15\x0c\x35'

    salt = genSalt(user_id)
    key = deriveKey(password, salt, 2, 32)
    Cipher = AES.new(key, AES.MODE_CBC, iv)
    
    ciphertext = base64.b64decode(b64_ciphertext)
    print("ciphertext: ")
    print(ciphertext)
    padded = Cipher.decrypt(ciphertext)
    print("padded: ")
    print(padded)
    plaintext = padded[:-padded[-1]]
    return plaintext.decode('UTF-8')



args = sys.argv[1:]

#userId, textData
dec = decrypt(args[0], args[1])
sys.stdout.write(dec)
