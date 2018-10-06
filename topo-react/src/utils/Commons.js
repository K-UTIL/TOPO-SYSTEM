export function getDefault(vars, defaults) {
    return !defined(vars) ? defaults : vars;
}

export function defined(vars) {
    return !(vars === undefined || vars === null);
}


