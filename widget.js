'use strict';

// necessary for tests, but not extension
try {
    imports.gi.versions.Gtk = '3.0';
    imports.gi.Gtk.init(null);
} catch (err) {}

const Gtk = imports.gi.Gtk;

/**
 * Get an HScale widget.
 * 
 * @param {Number} digits 
 * @param {Number} min 
 * @param {Number} max 
 * @param {*} value 
 * 
 * @return {imports.gi.Gtk.HScale} HScale widget
 */
function hscale(digits, min, max, value)
{
    let widget = new Gtk.HScale({
        visible: true
    });
    widget.set_digits(digits);
    widget.set_range(min, max);
    widget.set_value(value);

    return widget;
}

/**
 * Get a Label widget.
 * 
 * @param {String} text
 * 
 * @return {imports.gi.Gtk.Label} Label widget
 */
function label(text)
{
    let options = {
        label: text,
        halign: Gtk.Align.START,
        use_markup: true,
        visible: true
    };

    return new Gtk.Label(options);
}
