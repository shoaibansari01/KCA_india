export const regxArr = [
    {
        "value": "^[7-9][0-9]{9}$",
        "label": "parent_number"
    },

    {
        "value": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        "label": "parent_email"
    },
    {
        "value": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,16}$/,
        "label": "password"
    },
    {
        "value": /^\d{6}$/,
        "label": "pin_code"
    },

]
export const regexValidate = (label: string) => {
    const value = regxArr?.reduce((acc: any, cur: any) => {
        if (cur?.label == label) acc = cur?.value
        return acc;
    }, "")
    return new RegExp(value);
}