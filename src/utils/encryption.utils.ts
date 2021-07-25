import * as crypto from 'crypto';

const ALGORITHM = "aes-256-cbc";

function getPassphraseAndIv (key: string): { iv: string, passphrase: string } {
    let iv = "";
    let passphrase = "";

    for (let i = 0; i < 32; i++) {
        const candidateChar = key[i] || "0";
        if (iv.length < 16) iv += candidateChar;
        passphrase += candidateChar;
    }

    return { iv, passphrase }
}

export function encryptString (key: string, text: string): string {
    const { iv, passphrase } = getPassphraseAndIv(key);
    const cipher = crypto.createCipheriv(ALGORITHM, passphrase, iv);
    const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}

export function decryptString (key: string, encrypted: string): string {
    const { iv, passphrase } = getPassphraseAndIv(key);
    const decipher = crypto.createDecipheriv(ALGORITHM, passphrase, iv);
    const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}

export function generateKeyPair(): Promise<{
    publicKey: string;
    privateKey: string;
}> {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair(
            'rsa',
            {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                },
            },
            (err, publicKey: string, privateKey: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ publicKey, privateKey });
                }
            },
        );
    });
}
