"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActive = exports.Divisions = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["SENDER"] = "SENDER";
    Role["RECEIVER"] = "RECEIVER";
})(Role || (exports.Role = Role = {}));
var Divisions;
(function (Divisions) {
    Divisions["DHAKA"] = "DHAKA";
    Divisions["CHITTAGONG"] = "CHITTAGONG";
    Divisions["KHULNA"] = "KHULNA";
    Divisions["RAJSHAHI"] = "RAJSHAHI";
    Divisions["BARISHAL"] = "BARISHAL";
    Divisions["SYLHET"] = "SYLHET";
    Divisions["RANGPUR"] = "RANGPUR";
    Divisions["MYMENSINGH"] = "MYMENSINGH";
})(Divisions || (exports.Divisions = Divisions = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
