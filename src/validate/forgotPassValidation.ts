export const validatepassword = (values: any) => {
    let errors: any = {};
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

