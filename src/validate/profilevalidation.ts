export default function validateProfile(values) {
    let errors = {};
    // Validate mobile number
    if (!values.mobile_no.trim()) {
        errors.mobile_no = "Mobile no. can't be blank.";
    } else if (values.mobile_no.trim().length !== 10) {
        errors.mobile_no = "Mobile no. must be 10 digits long.";
    } else if (!/^[6-9]\d{9}$/.test(values.mobile_no.trim())) {
        errors.mobile_no = "Invalid Mobile no.";
    }

    // Validate email
    if (!values?.email) {
        errors.email = "Email can't be blank.";
    } else if (!/\S+@\S+\.\S+/.test(values?.email)) {
        errors.email = 'Email is invalid.';
    } else if ((values.email.match(/@/g) || []).length > 1) {
        errors.email = 'Email should contain only one "@" symbol.';
    }

    if (/[^a-zA-Z\s]/.test(values.name)) {
        errors.name = "Full name should not contain special characters.";
    }

    return errors;
}
