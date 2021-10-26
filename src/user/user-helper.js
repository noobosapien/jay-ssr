const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = emailRegEx.exec(email);
    if(isValid)
        return true;
    return false;
}

const onlyNumber = (input) => {
    const numberRegEx = /^\d{6,16}$/;
    const isValid = numberRegEx.exec(input);
    if(isValid)
        return true;
    return false;
}

const hasEightCharacters = (input) => {
    return String(input).length >= 8
}

const hasACapital = (input) => {
    const capitalRegEx = /(?=.*[A-Z])/;
    const isValid = capitalRegEx.exec(input);
    if(isValid)
        return true;
    return false;
}
const hasANumber = (input) => {
    const numberRegEx = /(?=.*\d)/;
    const isValid = numberRegEx.exec(input);
    if(isValid)
        return true;
    return false;
}

export {isEmail, onlyNumber, hasEightCharacters, hasACapital, hasANumber}