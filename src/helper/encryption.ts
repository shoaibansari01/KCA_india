import CryptoJS from "crypto-js";

// These values match your backend's AES configuration
const AESHASH_IV = "l%RUWScYdmfUzOcs9$E4tFv@rdh05H$B";
const AESHASH_SALT = "a*5zq*Hu&&DLM3k8^s@%r2UO57Oaqsrr";
const AESHASH_PASS_PHRASE = "kzDjj8mnInw%jvoZ8AEFoV1m1Rj6RUy";

const keySize = 256;
const iterationCount = 10;

// Convert string to hex format (backend uses Hex.parse)
const stringToHex = (str: string) => {
    return str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

const generateKey = function () {
    // Backend uses Hex.parse directly on the salt string - no conversion needed
    return CryptoJS.PBKDF2(
        AESHASH_PASS_PHRASE,
        CryptoJS.enc.Hex.parse(AESHASH_SALT),
        { keySize: keySize / 32, iterations: iterationCount });
}

export const encryptToken = (plainText: string): string => {
    // Return plain token - backend should handle fallback to plain JWT verification
    console.log('Using plain token (no encryption)');
    return plainText;
}

export const decryptToken = (cipherText: string): string => {
    try {
        const key = generateKey();
        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(cipherText)
        });

        // Backend uses Hex.parse directly on IV string
        const decrypted = CryptoJS.AES.decrypt(
            cipherParams,
            key,
            { iv: CryptoJS.enc.Hex.parse(AESHASH_IV) });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Token decryption failed:', error);
        return "";
    }
}