'use strict';

let cursor;
let Tweener;

// necessary for tests, but not extension
try {
    Tweener = imports.ui.tweener;
} catch (err) {
    imports.gi.versions.Gdk = '3.0';
    imports.gi.versions.Gtk = '3.0';
    imports.gi.Gtk.init(null);
    Tweener = imports.tweener.tweener;
}

const Gdk = imports.gi.Gdk;

var speed = 0.4;
var min;
try {
    min = getCursor().get_image().get_width();
} catch (err) {
    min = 32;
}
var max = min * 3;

let target = {opacity: 255, size: min};

/**
 * Fade the cursor target.
 * 
 * @param {Number} s size
 * @param {Function} onUpdate update callback
 * @param {Function} onComplete complete callback
 */
function fade(s, onUpdate, onComplete)
{
    let tween = {
        size: s,
        time: speed,
        transition: 'easeOutQuad',
        onUpdate: onUpdate
    };

    if ('function' === typeof onComplete) {
        tween.onComplete = onComplete;
    }

    Tweener.pauseTweens(target);
    Tweener.removeTweens(target);
    Tweener.addTween(target, tween);
}

/**
 * Fade the cursor target in.
 * 
 * @param {Function} onUpdate update callback
 * @param {Function} onComplete complete callback
 */
function fadeIn(onUpdate, onComplete)
{
    fade(max, onUpdate, onComplete);
}

/**
 * Fade the cursor target out.
 * 
 * @param {Function} onUpdate update callback
 * @param {Function} onComplete complete callback
 */
function fadeOut(onUpdate, onComplete)
{
    fade(min, onUpdate, onComplete);
}

/**
 * Get the cursor.
 * 
 * @return {imports.gi.Gdk.Cursor} Gdk cursor
 */
function getCursor()
{
    if (!cursor) {
        let display = Gdk.Display.get_default();
        cursor = Gdk.Cursor.new_from_name(display, 'arrow');
    }

    return cursor;
}

/**
 * Get cursor size.
 * 
 * @return {Number} cursor size
 */
function getSize()
{
    return target.size;
}
