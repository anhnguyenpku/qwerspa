export const _Main = (tmpl) => {
    BlazeLayout.render('MainLayout', {content: tmpl})
};

export const _NoHeaderNoSideBar = (tmpl) => {
    BlazeLayout.render('noHeaderNoSideBarLayout', {content: tmpl})
};
