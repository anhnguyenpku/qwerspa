let pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: "username",
        required: true,
        minLength: 5,
    },
    {
        _id: 'email',
        type: 'email',
        required: true,
        displayName: "email",
        re: /.+@(.+){2,}\.(.+){2,}/,
        errStr: 'Invalid email',
    },
    pwd
]);


AccountsTemplates.configure({
    showLabels: false,
// Texts
    texts: {
        signInLink_pre: "មានគណនីហើយ?",
        signInLink_link: "ចូលប្រើប្រាស់",
        signUpLink_pre: "មិនទាន់មានគណនី?",
        signUpLink_link: "ចុះឈ្មោះឥឡូវនេះ",
        button: {
            signUp: "ចុះឈ្មោះឥឡូវ",
            signIn: "ចូលប្រើ"
        },
        socialSignUp: "ចុះឈ្មោះឥឡូវ",
        socialIcons: {
            "meteor-developer": "fa fa-rocket"
        },
        title: {
            changePwd: "ប្តូរពាក្យសម្ងាត់",
            enrollAccount: "Enroll Title",
            forgotPwd: "ភ្លេចពាក្យសម្ងាត់",
            resetPwd: "Reset Pwd Title",
            signIn: "",
            signUp: "",
            verifyEmail: "Verify Email Title",
        },
        inputIcons: {
            isValidating: "fa fa-spinner fa-spin",
            hasSuccess: "fa fa-check",
            hasError: "fa fa-times",
        }
    }
})

// AccountsTemplates.configure({
//     texts: {
//         navSignIn: "signIn",
//         navSignOut: "signOut",
//         optionalField: "optional",
//         pwdLink_pre: "",
//         pwdLink_link: "forgotPassword",
//         pwdLink_suff: "",
//         resendVerificationEmailLink_pre: "Verification email lost?",
//         resendVerificationEmailLink_link: "Send again",
//         resendVerificationEmailLink_suff: "",
//         sep: "OR",
//         signInLink_pre: "ifYouAlreadyHaveAnAccount",
//         signInLink_link: "signin",
//         signInLink_suff: "",
//         signUpLink_pre: "dontHaveAnAccount",
//         signUpLink_link: "signUp",
//         signUpLink_suff: "",
//         socialAdd: "add",
//         socialConfigure: "configure",
//         socialIcons: {
//             "meteor-developer": "fa fa-rocket",
//         },
//         socialRemove: "remove",
//         socialSignIn: "signIn",
//         socialSignUp: "signUp",
//         socialWith: "with",
//         termsPreamble: "clickAgree",
//         termsPrivacy: "privacyPolicy",
//         termsAnd: "and",
//         termsTerms: "terms",
//     }
// });