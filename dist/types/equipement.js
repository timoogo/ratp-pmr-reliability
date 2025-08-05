"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionFrequency = exports.EquipmentTypePrisma = exports.EquipmentType = exports.EquipmentStatus = void 0;
var EquipmentStatus;
(function (EquipmentStatus) {
    EquipmentStatus["DISPONIBLE"] = "DISPONIBLE";
    EquipmentStatus["INDISPONIBLE"] = "INDISPONIBLE";
    EquipmentStatus["EN_MAINTENANCE"] = "EN_MAINTENANCE";
})(EquipmentStatus || (exports.EquipmentStatus = EquipmentStatus = {}));
var EquipmentType;
(function (EquipmentType) {
    EquipmentType["ASCENSEUR"] = "ASCENSEUR";
    EquipmentType["ESCALATOR"] = "ESCALATOR";
    EquipmentType["PORTILLONS"] = "PORTILLONS";
    EquipmentType["CABINES"] = "CABINES";
})(EquipmentType || (exports.EquipmentType = EquipmentType = {}));
var client_1 = require("@prisma/client");
Object.defineProperty(exports, "EquipmentTypePrisma", { enumerable: true, get: function () { return client_1.EquipmentType; } });
Object.defineProperty(exports, "SubscriptionFrequency", { enumerable: true, get: function () { return client_1.SubscriptionFrequency; } });
