import {Blaze} from 'meteor/blaze';

export const renderTemplate = (template, data) => {
    var node = document.createElement("div");
    node.className = 'box box-default color-palette-box';
    document.body.appendChild(node);
    var instance = Blaze.renderWithData(template, data, node);

    return {
        instance: instance,
        html: node
    };
};