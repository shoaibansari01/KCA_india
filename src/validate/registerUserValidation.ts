export const registerUserValidate = (values: any) => {
    let errors: any = {};
    if (!values.resister_user_mobile_no) {
        errors.resister_user_mobile_no = "Mobile no. can't be blank.";
    } else if (values.resister_user_mobile_no.length !== 10) {
        errors.resister_user_mobile_no = "Mobile no. must be 10 digits long.";
    } else if (!/^[6-9]\d{9}$/.test(values.resister_user_mobile_no)) {
        errors.resister_user_mobile_no = "Invalid Mobile no.";
    }
    if (!values?.country_phone_code) errors.country_phone_code = "can't be blank.";

    if (!values?.resister_user_email) {
        errors.resister_user_email = "Email can't be blank.";
    } else if (!/\S+@\S+\.\S+/.test(values?.resister_user_email)) {
        errors.resister_user_email = 'Email is invalid.';
    } else if ((values.resister_user_email.match(/@/g) || []).length > 1) {
        errors.resister_user_email = 'Email should contain only one "@" symbol.';
    }

    return errors;
}

