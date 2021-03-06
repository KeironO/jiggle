'use strict';

/**
 * Jiggle
 * 
 * © 2020 Jeff Channell
 * 
 * Heavily influenced by https://github.com/davidgodzsak/mouse-shake.js
 */

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const St = imports.gi.St;

const Me = ExtensionUtils.getCurrentExtension();
const PointerWatcher = imports.ui.pointerWatcher.getPointerWatcher();
const JCursor = Me.imports.cursor;
const JHistory = Me.imports.history;
const JSettings = Me.imports.settings;

const INTERVAL_MS = 10;

let jiggling = false;
let pointerIcon;
let pointerImage;
let pointerInterval;
let pointerListener;
let settings;

let growthSpeedID;
let shakeThresholdID;

function getCursor()
{
    if (!pointerImage) {
        pointerImage = JCursor.getCursor().get_image();
    }

    return new St.Icon({
        gicon: pointerImage
    });
}

/**
 * Stop the listeners and clean up any leftover assets.
 */
function disable()
{
    // reset to defaults
    jiggling = false;
    JHistory.clear();
    // remove our pointer listener
    if (pointerListener) {
        PointerWatcher._removeWatch(pointerListener);
    }
    // stop the interval
    removeInterval();
    // disconnect from the settings
    settings.disconnect(growthSpeedID);
    settings.disconnect(shakeThresholdID);
    settings = null;
}

/**
 * Start the listeners.
 */
function enable()
{
    settings = JSettings.settings();

    // sync settings
    let growthSpeedFetch = function () {
        JCursor.speed = Math.max(0.1, Math.min(1.0, parseFloat(settings.get_value('growth-speed').deep_unpack())));
    };
    growthSpeedFetch();
    growthSpeedID = settings.connect('changed::growth-speed', growthSpeedFetch);

    let shakeThresholdFetch = function () {
        JHistory.threshold = Math.max(10, Math.min(500, parseInt(settings.get_value('shake-threshold').deep_unpack(), 10)));
    };
    shakeThresholdFetch();
    shakeThresholdID = settings.connect('changed::shake-threshold', shakeThresholdFetch);

    // start the listeners
    pointerListener = PointerWatcher.addWatch(INTERVAL_MS, mouseMove);
    main();
}

/**
 * Initialize (required by Gnome Shell).
 */
function init()
{
}

/**
 * Main application loop.
 */
function main()
{
    if (JHistory.check()) {
        if (!jiggling) {
            jiggling = true;
            start();
        }
    } else if (jiggling) {
        jiggling = false;
        stop();
    }

    removeInterval();
    pointerInterval = Mainloop.timeout_add(INTERVAL_MS, main);
}

/**
 * Watch for mouse jiggling!
 * 
 * @param {Number} x
 * @param {Number} y
 */
function mouseMove(x, y)
{
    JHistory.push(x, y);
    onUpdate();
}

function onUpdate() {
    if (pointerIcon) {
        pointerIcon.opacity = JCursor.getOpacity();
        pointerIcon.set_icon_size(JCursor.getSize());
        pointerIcon.set_position(JHistory.lastX - pointerIcon.width / 2, JHistory.lastY - pointerIcon.height / 2);
    }
}

function removeInterval()
{
    if (pointerInterval) {
        Mainloop.source_remove(pointerInterval);
        pointerInterval = null;
    }
}

function start()
{   
    if (!pointerIcon) {
        pointerIcon = getCursor();
        Main.uiGroup.add_actor(pointerIcon);
    }

    pointerIcon.opacity = JCursor.getOpacity();
    pointerIcon.set_position(JHistory.lastX, JHistory.lastY);

    JCursor.fadeIn(onUpdate, null);
}

function stop()
{
    JCursor.fadeOut(onUpdate, function () {
        if (pointerIcon) {
            Main.uiGroup.remove_actor(pointerIcon);
            pointerIcon = null;
        }
    });
}
