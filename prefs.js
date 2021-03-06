'use strict';

const Gtk = imports.gi.Gtk;

// It's common practice to keep GNOME API and JS imports in separate blocks
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const JSettings = Me.imports.settings;
const JWidget = Me.imports.widget;

let settings;

// Like `extension.js` this is used for any one-time setup like translations.
function init() {
}


// This function is called when the preferences window is first created to build and return a Gtk widget.
function buildPrefsWidget() {
    settings = JSettings.settings();

    // Create a parent widget that we'll return from this function
    let grid = new Gtk.Grid({
        margin: 18,
        column_spacing: 12,
        row_spacing: 12,
        visible: true
    });

    // Add a simple title and add it to the grid
    let title = '<b>' + Me.metadata.name + ' version ' + Me.metadata.version + ' Extension Preferences</b>';
    grid.attach(JWidget.label(title), 0, 0, 2, 1);

    // Create a label for growth speed
    grid.attach(JWidget.label('Growth Speed'), 0, 1, 1, 1);

    // Create a widget for growth speed
    let growth = JWidget.hscale(2, 0.1, 1.0, settings.get_value('growth-speed').deep_unpack());
    grid.attach(growth, 1, 1, 20, 1);

    // connect the change event
    growth.connect('value-changed', (widget) => settings.set_double('growth-speed', widget.get_value()));

    // Create a label for shake threshold
    grid.attach(JWidget.label('Shake Threshold'), 0, 2, 1, 1);

    // Create a widget for shake threshold
    let shake = JWidget.hscale(0, 10, 500, settings.get_value('shake-threshold').deep_unpack());
    grid.attach(shake, 1, 2, 20, 1);

    // connect the change event
    shake.connect('value-changed', (widget) => settings.set_int('shake-threshold', widget.get_value()));

    return grid;
}
