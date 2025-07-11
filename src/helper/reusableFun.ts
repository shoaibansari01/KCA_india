import { Alert, Linking, Share } from "react-native";

export const countryCode = [
    {
        "country": "India",
        "code": "+91"
    },
    {
        "country": "Afghanistan",
        "code": "+93"
    },
    {
        "country": "American Samoa",
        "code": "+1-684"
    },
    {
        "country": "Andorra",
        "code": "+376"
    },
    {
        "country": "Angola",
        "code": "+244"
    },
    {
        "country": "Anguilla",
        "code": "+1-264"
    },
    {
        "country": "Antarctica",
        "code": "+672"
    },
    {
        "country": "Antigua and Barbuda",
        "code": "+1-268"
    },
    {
        "country": "Argentina",
        "code": "+54"
    },
    {
        "country": "Armenia",
        "code": "+374"
    },
    {
        "country": "Aruba",
        "code": "+297"
    },
    {
        "country": "Australia",
        "code": "+61"
    },
    {
        "country": "Austria",
        "code": "+43"
    },
    {
        "country": "Azerbaijan",
        "code": "+994"
    },
    {
        "country": "Bahamas",
        "code": "+1-242"
    },
    {
        "country": "Bahrain",
        "code": "+973"
    },
    {
        "country": "Bangladesh",
        "code": "+880"
    },
    {
        "country": "Barbados",
        "code": "+1-246"
    },
    {
        "country": "Belarus",
        "code": "+375"
    },
    {
        "country": "Belgium",
        "code": "+32"
    },
    {
        "country": "Belize",
        "code": "+501"
    },
    {
        "country": "Benin",
        "code": "+229"
    },
    {
        "country": "Bermuda",
        "code": "+1-441"
    },
    {
        "country": "Bhutan",
        "code": "+975"
    },
    {
        "country": "Bolivia",
        "code": "+591"
    },
    {
        "country": "Bosnia and Herzegovina",
        "code": "+387"
    },
    {
        "country": "Botswana",
        "code": "+267"
    },
    {
        "country": "Brazil",
        "code": "+55"
    },
    {
        "country": "British Indian Ocean Territory",
        "code": "+246"
    },
    {
        "country": "British Virgin Islands",
        "code": "+1-284"
    },
    {
        "country": "Brunei",
        "code": "+673"
    },
    {
        "country": "Bulgaria",
        "code": "+359"
    },
    {
        "country": "Burkina Faso",
        "code": "+226"
    },
    {
        "country": "Burundi",
        "code": "+257"
    },
    {
        "country": "Cambodia",
        "code": "+855"
    },
    {
        "country": "Cameroon",
        "code": "+237"
    },
    {
        "country": "Canada",
        "code": "+1"
    },
    {
        "country": "Cape Verde",
        "code": "+238"
    },
    {
        "country": "Cayman Islands",
        "code": "+1-345"
    },
    {
        "country": "Central African Republic",
        "code": "+236"
    },
    {
        "country": "Chad",
        "code": "+235"
    },
    {
        "country": "Chile",
        "code": "+56"
    },
    {
        "country": "China",
        "code": "+86"
    },
    {
        "country": "Christmas Island",
        "code": "+61"
    },
    {
        "country": "Cocos Islands",
        "code": "+61"
    },
    {
        "country": "Colombia",
        "code": "+57"
    },
    {
        "country": "Comoros",
        "code": "+269"
    },
    {
        "country": "Cook Islands",
        "code": "+682"
    },
    {
        "country": "Costa Rica",
        "code": "+506"
    },
    {
        "country": "Croatia",
        "code": "+385"
    },
    {
        "country": "Cuba",
        "code": "+53"
    },
    {
        "country": "Curacao",
        "code": "+599"
    },
    {
        "country": "Cyprus",
        "code": "+357"
    },
    {
        "country": "Czech Republic",
        "code": "+420"
    },
    {
        "country": "Democratic Republic of the Congo",
        "code": "+243"
    },
    {
        "country": "Denmark",
        "code": "+45"
    },
    {
        "country": "Djibouti",
        "code": "+253"
    },
    {
        "country": "Dominica",
        "code": "+1-767"
    },
    {
        "country": "Dominican Republic",
        "code": "+1-809, 1-829, 1-849"
    },
    {
        "country": "East Timor",
        "code": "+670"
    },
    {
        "country": "Ecuador",
        "code": "+593"
    },
    {
        "country": "Egypt",
        "code": "+20"
    },
    {
        "country": "El Salvador",
        "code": "+503"
    },
    {
        "country": "Equatorial Guinea",
        "code": "+240"
    },
    {
        "country": "Eritrea",
        "code": "+291"
    },
    {
        "country": "Estonia",
        "code": "+372"
    },
    {
        "country": "Ethiopia",
        "code": "+251"
    },
    {
        "country": "Falkland Islands",
        "code": "+500"
    },
    {
        "country": "Faroe Islands",
        "code": "+298"
    },
    {
        "country": "Fiji",
        "code": "+679"
    },
    {
        "country": "Finland",
        "code": "+358"
    },
    {
        "country": "France",
        "code": "+33"
    },
    {
        "country": "French Polynesia",
        "code": "+689"
    },
    {
        "country": "Gabon",
        "code": "+241"
    },
    {
        "country": "Gambia",
        "code": "+220"
    },
    {
        "country": "Georgia",
        "code": "+995"
    },
    {
        "country": "Germany",
        "code": "+49"
    },
    {
        "country": "Ghana",
        "code": "+233"
    },
    {
        "country": "Gibraltar",
        "code": "+350"
    },
    {
        "country": "Greece",
        "code": "+30"
    },
    {
        "country": "Greenland",
        "code": "+299"
    },
    {
        "country": "Grenada",
        "code": "+1-473"
    },
    {
        "country": "Guam",
        "code": "+1-671"
    },
    {
        "country": "Guatemala",
        "code": "+502"
    },
    {
        "country": "Guernsey",
        "code": "+44-1481"
    },
    {
        "country": "Guinea",
        "code": "+224"
    },
    {
        "country": "Guinea-Bissau",
        "code": "+245"
    },
    {
        "country": "Guyana",
        "code": "+592"
    },
    {
        "country": "Haiti",
        "code": "+509"
    },
    {
        "country": "Honduras",
        "code": "+504"
    },
    {
        "country": "Hong Kong",
        "code": "+852"
    },
    {
        "country": "Hungary",
        "code": "+36"
    },
    {
        "country": "Iceland",
        "code": "+354"
    },

    {
        "country": "Indonesia",
        "code": "+62"
    },
    {
        "country": "Iran",
        "code": "+98"
    },
    {
        "country": "Iraq",
        "code": "+964"
    },
    {
        "country": "Ireland",
        "code": "+353"
    },
    {
        "country": "Isle of Man",
        "code": "+44-1624"
    },
    {
        "country": "Israel",
        "code": "+972"
    },
    {
        "country": "Italy",
        "code": "+39"
    },
    {
        "country": "Ivory Coast",
        "code": "+225"
    },
    {
        "country": "Jamaica",
        "code": "+1-876"
    },
    {
        "country": "Japan",
        "code": "+81"
    },
    {
        "country": "Jersey",
        "code": "+44-1534"
    },
    {
        "country": "Jordan",
        "code": "+962"
    },
    {
        "country": "Kazakhstan",
        "code": "+7"
    },
    {
        "country": "Kenya",
        "code": "+254"
    },
    {
        "country": "Kiribati",
        "code": "+686"
    },
    {
        "country": "Kosovo",
        "code": "+383"
    },
    {
        "country": "Kuwait",
        "code": "+965"
    },
    {
        "country": "Kyrgyzstan",
        "code": "+996"
    },
    {
        "country": "Laos",
        "code": "+856"
    },
    {
        "country": "Latvia",
        "code": "+371"
    },
    {
        "country": "Lebanon",
        "code": "+961"
    },
    {
        "country": "Lesotho",
        "code": "+266"
    },
    {
        "country": "Liberia",
        "code": "+231"
    },
    {
        "country": "Libya",
        "code": "+218"
    },
    {
        "country": "Liechtenstein",
        "code": "+423"
    },
    {
        "country": "Lithuania",
        "code": "+370"
    },
    {
        "country": "Luxembourg",
        "code": "+352"
    },
    {
        "country": "Macao",
        "code": "+853"
    },
    {
        "country": "Macedonia",
        "code": "+389"
    },
    {
        "country": "Madagascar",
        "code": "+261"
    },
    {
        "country": "Malawi",
        "code": "+265"
    },
    {
        "country": "Malaysia",
        "code": "+60"
    },
    {
        "country": "Maldives",
        "code": "+960"
    },
    {
        "country": "Mali",
        "code": "+223"
    },
    {
        "country": "Malta",
        "code": "+356"
    },
    {
        "country": "Marshall Islands",
        "code": "+692"
    },
    {
        "country": "Mauritania",
        "code": "+222"
    },
    {
        "country": "Mauritius",
        "code": "+230"
    },
    {
        "country": "Mayotte",
        "code": "+262"
    },
    {
        "country": "Mexico",
        "code": "+52"
    },
    {
        "country": "Micronesia",
        "code": "+691"
    },
    {
        "country": "Moldova",
        "code": "+373"
    },
    {
        "country": "Monaco",
        "code": "+377"
    },
    {
        "country": "Mongolia",
        "code": "+976"
    },
    {
        "country": "Montenegro",
        "code": "+382"
    },
    {
        "country": "Montserrat",
        "code": "+1-664"
    },
    {
        "country": "Morocco",
        "code": "+212"
    },
    {
        "country": "Mozambique",
        "code": "+258"
    },
    {
        "country": "Myanmar",
        "code": "+95"
    },
    {
        "country": "Namibia",
        "code": "+264"
    },
    {
        "country": "Nauru",
        "code": "+674"
    },
    {
        "country": "Nepal",
        "code": "+977"
    },
    {
        "country": "Netherlands",
        "code": "+31"
    },
    {
        "country": "Netherlands Antilles",
        "code": "+599"
    },
    {
        "country": "New Caledonia",
        "code": "+687"
    },
    {
        "country": "New Zealand",
        "code": "+64"
    },
    {
        "country": "Nicaragua",
        "code": "+505"
    },
    {
        "country": "Niger",
        "code": "+227"
    },
    {
        "country": "Nigeria",
        "code": "+234"
    },
    {
        "country": "Niue",
        "code": "+683"
    },
    {
        "country": "North Korea",
        "code": "+850"
    },
    {
        "country": "Northern Mariana Islands",
        "code": "+1-670"
    },
    {
        "country": "Norway",
        "code": "+47"
    },
    {
        "country": "Oman",
        "code": "+968"
    },
    {
        "country": "Pakistan",
        "code": "+92"
    },
    {
        "country": "Palau",
        "code": "+680"
    },
    {
        "country": "Palestine",
        "code": "+970"
    },
    {
        "country": "Panama",
        "code": "+507"
    },
    {
        "country": "Papua New Guinea",
        "code": "+675"
    },
    {
        "country": "Paraguay",
        "code": "+595"
    },
    {
        "country": "Peru",
        "code": "+51"
    },
    {
        "country": "Philippines",
        "code": "+63"
    },
    {
        "country": "Pitcairn",
        "code": "+64"
    },
    {
        "country": "Poland",
        "code": "+48"
    },
    {
        "country": "Portugal",
        "code": "+351"
    },
    {
        "country": "Puerto Rico",
        "code": "+1-787, 1-939"
    },
    {
        "country": "Qatar",
        "code": "+974"
    },
    {
        "country": "Republic of the Congo",
        "code": "+242"
    },
    {
        "country": "Reunion",
        "code": "+262"
    },
    {
        "country": "Romania",
        "code": "+40"
    },
    {
        "country": "Russia",
        "code": "+7"
    },
    {
        "country": "Rwanda",
        "code": "+250"
    },
    {
        "country": "Saint Barthelemy",
        "code": "+590"
    },
    {
        "country": "Saint Helena",
        "code": "+290"
    },
    {
        "country": "Saint Kitts and Nevis",
        "code": "+1-869"
    },
    {
        "country": "Saint Lucia",
        "code": "+1-758"
    },
    {
        "country": "Saint Martin",
        "code": "+590"
    },
    {
        "country": "Saint Pierre and Miquelon",
        "code": "+508"
    },
    {
        "country": "Saint Vincent and the Grenadines",
        "code": "+1-784"
    },
    {
        "country": "Samoa",
        "code": "+685"
    },
    {
        "country": "San Marino",
        "code": "+378"
    },
    {
        "country": "Sao Tome and Principe",
        "code": "+239"
    },
    {
        "country": "Saudi Arabia",
        "code": "+966"
    },
    {
        "country": "Senegal",
        "code": "+221"
    },
    {
        "country": "Serbia",
        "code": "+381"
    },
    {
        "country": "Seychelles",
        "code": "+248"
    },
    {
        "country": "Sierra Leone",
        "code": "+232"
    },
    {
        "country": "Singapore",
        "code": "+65"
    },
    {
        "country": "Sint Maarten",
        "code": "+1-721"
    },
    {
        "country": "Slovakia",
        "code": "+421"
    },
    {
        "country": "Slovenia",
        "code": "+386"
    },
    {
        "country": "Solomon Islands",
        "code": "+677"
    },
    {
        "country": "Somalia",
        "code": "+252"
    },
    {
        "country": "South Africa",
        "code": "+27"
    },
    {
        "country": "South Korea",
        "code": "+82"
    },
    {
        "country": "South Sudan",
        "code": "+211"
    },
    {
        "country": "Spain",
        "code": "+34"
    },
    {
        "country": "Sri Lanka",
        "code": "+94"
    },
    {
        "country": "Sudan",
        "code": "+249"
    },
    {
        "country": "Suriname",
        "code": "+597"
    },
    {
        "country": "Svalbard and Jan Mayen",
        "code": "+47"
    },
    {
        "country": "Swaziland",
        "code": "+268"
    },
    {
        "country": "Sweden",
        "code": "+46"
    },
    {
        "country": "Switzerland",
        "code": "+41"
    },
    {
        "country": "Syria",
        "code": "+963"
    },
    {
        "country": "Taiwan",
        "code": "+886"
    },
    {
        "country": "Tajikistan",
        "code": "+992"
    },
    {
        "country": "Tanzania",
        "code": "+255"
    },
    {
        "country": "Thailand",
        "code": "+66"
    },
    {
        "country": "Togo",
        "code": "+228"
    },
    {
        "country": "Tokelau",
        "code": "+690"
    },
    {
        "country": "Uganda",
        "code": "+256"
    },
    {
        "country": "Ukraine",
        "code": "+380"
    },
    {
        "country": "United Arab Emirates",
        "code": "+971"
    },
    {
        "country": "United Kingdom",
        "code": "+44"
    },
    {
        "country": "United States",
        "code": "+1"
    }
]

export const littleLegs = (milisec: any) => {
    return new Promise((resolve: any) => {
        setTimeout(() => { resolve('') }, milisec);
    })
}

export const handleOpenInChrome = async (url: any) => {
    const _URL = url
    const supported = await Linking.canOpenURL(_URL);
    if (supported) {
        await Linking.openURL(_URL);
    } else {
        console.log("Don't know how to open URI: ", _URL);
    }
};

export const onShare = async (msg: any, link: any) => {
    try {
        await Share.share({
            message: msg,
            url: link
        });
    } catch (error: any) {
        Alert.alert(error.message);
    }
};

export const countryArr = [
    { label: "Afghanistan", value: "AF" },
    { label: "Albania", value: "AL" },
    { label: "Algeria", value: "DZ" },
    { label: "Andorra", value: "AD" },
    { label: "Angola", value: "AO" },
    { label: "Antigua and Barbuda", value: "AG" },
    { label: "Argentina", value: "AR" },
    { label: "Armenia", value: "AM" },
    { label: "Australia", value: "AU" },
    { label: "Austria", value: "AT" },
    { label: "Azerbaijan", value: "AZ" },
    { label: "Bahamas", value: "BS" },
    { label: "Bahrain", value: "BH" },
    { label: "Bangladesh", value: "BD" },
    { label: "Barbados", value: "BB" },
    { label: "Belarus", value: "BY" },
    { label: "Belgium", value: "BE" },
    { label: "Belize", value: "BZ" },
    { label: "Benin", value: "BJ" },
    { label: "Bhutan", value: "BT" },
    { label: "Bolivia", value: "BO" },
    { label: "Bosnia and Herzegovina", value: "BA" },
    { label: "Botswana", value: "BW" },
    { label: "Brazil", value: "BR" },
    { label: "Brunei", value: "BN" },
    { label: "Bulgaria", value: "BG" },
    { label: "Burkina Faso", value: "BF" },
    { label: "Burundi", value: "BI" },
    { label: "Cabo Verde", value: "CV" },
    { label: "Cambodia", value: "KH" },
    { label: "Cameroon", value: "CM" },
    { label: "Canada", value: "CA" },
    { label: "Central African Republic", value: "CF" },
    { label: "Chad", value: "TD" },
    { label: "Chile", value: "CL" },
    { label: "China", value: "CN" },
    { label: "Colombia", value: "CO" },
    { label: "Comoros", value: "KM" },
    { label: "Congo (Congo-Brazzaville)", value: "CG" },
    { label: "Costa Rica", value: "CR" },
    { label: "Croatia", value: "HR" },
    { label: "Cuba", value: "CU" },
    { label: "Cyprus", value: "CY" },
    { label: "Czechia (Czech Republic)", value: "CZ" },
    { label: "Democratic Republic of the Congo", value: "CD" },
    { label: "Denmark", value: "DK" },
    { label: "Djibouti", value: "DJ" },
    { label: "Dominica", value: "DM" },
    { label: "Dominican Republic", value: "DO" },
    { label: "Ecuador", value: "EC" },
    { label: "Egypt", value: "EG" },
    { label: "El Salvador", value: "SV" },
    { label: "Equatorial Guinea", value: "GQ" },
    { label: "Eritrea", value: "ER" },
    { label: "Estonia", value: "EE" },
    { label: "Swaziland", value: "SZ" },
    { label: "Ethiopia", value: "ET" },
    { label: "Fiji", value: "FJ" },
    { label: "Finland", value: "FI" },
    { label: "France", value: "FR" },
    { label: "Gabon", value: "GA" },
    { label: "Gambia", value: "GM" },
    { label: "Georgia", value: "GE" },
    { label: "Germany", value: "DE" },
    { label: "Ghana", value: "GH" },
    { label: "Greece", value: "GR" },
    { label: "Grenada", value: "GD" },
    { label: "Guatemala", value: "GT" },
    { label: "Guinea", value: "GN" },
    { label: "Guinea-Bissau", value: "GW" },
    { label: "Guyana", value: "GY" },
    { label: "Haiti", value: "HT" },
    { label: "Honduras", value: "HN" },
    { label: "Hungary", value: "HU" },
    { label: "Iceland", value: "IS" },
    { label: "India", value: "IN" },
    { label: "Indonesia", value: "ID" },
    { label: "Iran", value: "IR" },
    { label: "Iraq", value: "IQ" },
    { label: "Ireland", value: "IE" },
    { label: "Israel", value: "IL" },
    { label: "Italy", value: "IT" },
    { label: "Jamaica", value: "JM" },
    { label: "Japan", value: "JP" },
    { label: "Jordan", value: "JO" },
    { label: "Kazakhstan", value: "KZ" },
    { label: "Kenya", value: "KE" },
    { label: "Kiribati", value: "KI" },
    { label: "Kuwait", value: "KW" },
    { label: "Kyrgyzstan", value: "KG" },
    { label: "Laos", value: "LA" },
    { label: "Latvia", value: "LV" },
    { label: "Lebanon", value: "LB" },
    { label: "Lesotho", value: "LS" },
    { label: "Liberia", value: "LR" },
    { label: "Libya", value: "LY" },
    { label: "Liechtenstein", value: "LI" },
    { label: "Lithuania", value: "LT" },
    { label: "Luxembourg", value: "LU" },
    { label: "Madagascar", value: "MG" },
    { label: "Malawi", value: "MW" },
    { label: "Malaysia", value: "MY" },
    { label: "Maldives", value: "MV" },
    { label: "Mali", value: "ML" },
    { label: "Malta", value: "MT" },
    { label: "Marshall Islands", value: "MH" },
    { label: "Mauritania", value: "MR" },
    { label: "Mauritius", value: "MU" },
    { label: "Mexico", value: "MX" },
    { label: "Micronesia", value: "FM" },
    { label: "Moldova", value: "MD" },
    { label: "Monaco", value: "MC" },
    { label: "Mongolia", value: "MN" },
    { label: "Montenegro", value: "ME" },
    { label: "Morocco", value: "MA" },
    { label: "Mozambique", value: "MZ" },
    { label: "Myanmar (Burma)", value: "MM" },
    { label: "Namibia", value: "NA" },
    { label: "Nauru", value: "NR" },
    { label: "Nepal", value: "NP" },
    { label: "Netherlands", value: "NL" },
    { label: "New Zealand", value: "NZ" },
    { label: "Nicaragua", value: "NI" },
    { label: "Niger", value: "NE" },
    { label: "Nigeria", value: "NG" },
    { label: "North Korea", value: "KP" },
    { label: "North Macedonia", value: "MK" },
    { label: "Norway", value: "NO" },
    { label: "Oman", value: "OM" },
    { label: "Pakistan", value: "PK" },
    { label: "Palau", value: "PW" },
    { label: "Palestine State", value: "PS" },
    { label: "Panama", value: "PA" },
    { label: "Papua New Guinea", value: "PG" },
    { label: "Paraguay", value: "PY" },
    { label: "Peru", value: "PE" },
    { label: "Philippines", value: "PH" },
    { label: "Poland", value: "PL" },
    { label: "Portugal", value: "PT" },
    { label: "Qatar", value: "QA" },
    { label: "Romania", value: "RO" },
    { label: "Russia", value: "RU" },
    { label: "Rwanda", value: "RW" },
    { label: "Saint Kitts and Nevis", value: "KN" },
    { label: "Saint Lucia", value: "LC" },
    { label: "Saint Vincent and the Grenadines", value: "VC" },
    { label: "Samoa", value: "WS" },
    { label: "San Marino", value: "SM" },
    { label: "Sao Tome and Principe", value: "ST" },
    { label: "Saudi Arabia", value: "SA" },
    { label: "Senegal", value: "SN" },
    { label: "Serbia", value: "RS" },
    { label: "Seychelles", value: "SC" },
    { label: "Sierra Leone", value: "SL" },
    { label: "Singapore", value: "SG" },
    { label: "Slovakia", value: "SK" },
    { label: "Slovenia", value: "SI" },
    { label: "Solomon Islands", value: "SB" },
    { label: "Somalia", value: "SO" },
    { label: "South Africa", value: "ZA" },
    { label: "South Korea", value: "KR" },
    { label: "South Sudan", value: "SS" },
    { label: "Spain", value: "ES" },
    { label: "Sri Lanka", value: "LK" },
    { label: "Sudan", value: "SD" },
    { label: "Suriname", value: "SR" },
    { label: "Sweden", value: "SE" },
    { label: "Switzerland", value: "CH" },
    { label: "Syria", value: "SY" },
    { label: "Tajikistan", value: "TJ" },
    { label: "Tanzania", value: "TZ" },
    { label: "Thailand", value: "TH" },
    { label: "Timor-Leste", value: "TL" },
    { label: "Togo", value: "TG" },
    { label: "Tonga", value: "TO" },
    { label: "Trinidad and Tobago", value: "TT" },
    { label: "Tunisia", value: "TN" },
    { label: "Turkey", value: "TR" },
    { label: "Turkmenistan", value: "TM" },
    { label: "Tuvalu", value: "TV" },
    { label: "Uganda", value: "UG" },
    { label: "Ukraine", value: "UA" },
    { label: "United Arab Emirates", value: "AE" },
    { label: "United Kingdom", value: "UK" },
    { label: "United States of America", value: "US" },
    { label: "Uruguay", value: "UY" },
    { label: "Uzbekistan", value: "UZ" },
    { label: "Vanuatu", value: "VU" },
    { label: "Vatican City", value: "VA" },
    { label: "Venezuela", value: "VE" },
    { label: "Vietnam", value: "VN" },
    { label: "Yemen", value: "YE" },
    { label: "Zambia", value: "ZM" },
    { label: "Zimbabwe", value: "ZW" },
]