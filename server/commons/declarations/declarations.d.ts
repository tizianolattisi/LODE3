// Typescript declarations for modules
// which haven't one. They prevents error
// outputs at compile time

declare module "socketio-jwt" {
    var socketio: any;
    export = socketio;
}

declare module "express-validation" {
    var validation: any;
    export = validation;
}
declare module "forever-monitor" {
    var forever: any;
    export = forever;
}