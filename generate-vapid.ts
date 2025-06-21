import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();

console.log("🔐 VAPID Public Key:\n", keys.publicKey);
console.log("🔒 VAPID Private Key:\n", keys.privateKey);
