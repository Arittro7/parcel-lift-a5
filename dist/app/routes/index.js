"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/parcels",
        route: parcel_route_1.parcelRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
// node dist/server.js
