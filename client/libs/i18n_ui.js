import {Template} from 'meteor/templating';
import {TAPi18n} from 'meteor/tap:i18n';
import {i18n} from 'meteor/anti:i18n';


import VueI18n from 'vue-i18n'
import Element from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'
import kmLocale from 'element-ui/lib/locale/lang/km'
import locale from 'element-ui/lib/locale'

Vue.use(VueI18n)
Vue.use(Element, {enLocale});
Vue.config.lang = 'en';
locale.use(enLocale);
//Vue.locale('fr', frLocale)


// Page
import './i18n_ui.html';

Template.i18n_ui.events({
    'click .js-i18n-ui'(event, instance) {
        let tag = this.tag;
        TAPi18n.setLanguageAmplify(tag);

        //anti:i18n
        i18n.setLanguage(tag);
        Session.set("lang", tag);

        if (tag == "en") {
            Vue.use(Element, {enLocale});
            Vue.config.lang = 'en';
            locale.use(enLocale);
        } else if (tag == "km") {
            Vue.use(Element, {kmLocale});
            Vue.config.lang = 'km';
            locale.use(kmLocale);
        }
    }
});