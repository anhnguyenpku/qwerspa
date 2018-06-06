import  './notFound.html';


Template.Wb_notFound.helpers({
    currentRoute(){
        return FlowRouter.current() && FlowRouter.current().path;
    }
});