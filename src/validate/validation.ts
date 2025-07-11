export const validateRegister = (values: any) => {
    let errors: any = {};
    if (!values.name) {
        errors.name = "Full name can't be blank.";
    } else if (/[^a-zA-Z\s]/.test(values.name)) {
        errors.name = "Full name should not contain special characters.";
    }
    if (!values.dialing_prefix) {
        errors.dialing_prefix = "can't be blank.";
    }

    if (!values.mobile_number) {
        errors.mobile_number = "Mobile no. can't be blank.";
    } else if (values.mobile_number.length !== 10) {
        errors.mobile_number = "Mobile no. must be 10 digits long.";
    } else if (!/^[6-9]\d{9}$/.test(values.mobile_number)) {
        errors.mobile_number = "Invalid Mobile no.";
    }

    if (!values?.email) {
        errors.email = "Email can't be blank.";
    } else if (!/\S+@\S+\.\S+/.test(values?.email)) {
        errors.email = 'Email is invalid.';
    } else if ((values.email.match(/@/g) || []).length > 1) {
        errors.email = 'Email should contain only one "@" symbol.';
    }

    if (!values?.password) {
        errors.password = "Password can't be blank.";
    } else if (values?.password?.search(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&])(?!.*\s).{6,}$/)) {
        errors.password = "Password must be minium 6 characters long, alteast one letter, one number and one special character!";
    }

    if (!values?.confirm_password) {
        errors.confirm_password = "Confirm password can't be blank.";
    } else if (values?.password !== values?.confirm_password) {
        errors.confirm_password = 'Both password should match.';
    }

    return errors;
}

