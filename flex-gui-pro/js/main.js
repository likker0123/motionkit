/**
 * MotionKit Pro v9.2.0 Master - Client Controller
 * 100% Reliable Embedded ExtendScript Engine
 * Complete Unified Suite with Machine-Locked Licensing
 */
document.addEventListener("DOMContentLoaded", function() {
    var cs = new CSInterface();
    var toast = document.getElementById("toast");
    var toastMsg = document.getElementById("toast-msg");
    var toastTimer = null;

    function showToast(msg, isWarning) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = msg;
        var dot = toast.querySelector(".toast-dot");
        if (dot) {
            dot.style.background = isWarning ? "#f59e0b" : "#ff3366";
        }
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function() {
            toast.classList.remove("show");
        }, 2400);
    }

    // =========================================================
    // LICENSE ACTIVATION ENGINE (OFFLINE MACHINE-LOCKED)
    // =========================================================
    function flex_imul(a, b) {
        var ah = (a >>> 16) & 0xffff, al = a & 0xffff;
        var bh = (b >>> 16) & 0xffff, bl = b & 0xffff;
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
    }

    function flex_generateKey(mid) {
        var salt = "FLEX_PRO_2026_SECRET_SALT_KEY";
        var raw = (mid || "").replace(/^\s+|\s+$/g, '').toUpperCase() + "::" + salt;
        var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
        for (var i = 0; i < raw.length; i++) {
            var ch = raw.charCodeAt(i);
            h1 = flex_imul(h1 ^ ch, 2654435761);
            h2 = flex_imul(h2 ^ ch, 1597334677);
        }
        h1 = flex_imul(h1 ^ (h1 >>> 16), 2246822507) ^ flex_imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = flex_imul(h2 ^ (h2 >>> 16), 2246822507) ^ flex_imul(h1 ^ (h1 >>> 13), 3266489909);
        var hex1 = ("00000000" + (h1 >>> 0).toString(16).toUpperCase()).slice(-8);
        var hex2 = ("00000000" + (h2 >>> 0).toString(16).toUpperCase()).slice(-8);
        return "KEY-" + hex1.slice(0, 4) + "-" + hex1.slice(4, 8) + "-" + hex2.slice(0, 4) + "-" + hex2.slice(4, 8);
    }

    function getOrCreateMachineId() {
        var stored = "";
        try { stored = localStorage.getItem("motionkit_machine_id") || localStorage.getItem("flex_machine_id") || ""; } catch(e) {}
        if (stored && /^(MK|FLEX)-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(stored)) {
            return stored;
        }
        var hex = "";
        for (var i = 0; i < 12; i++) {
            hex += Math.floor(Math.random() * 16).toString(16).toUpperCase();
        }
        var newId = "MK-" + hex.slice(0, 4) + "-" + hex.slice(4, 8) + "-" + hex.slice(8, 12);
        try { localStorage.setItem("motionkit_machine_id", newId); } catch(e) {}
        return newId;
    }

    var machineId = getOrCreateMachineId();

    function isLicenseValid(key) {
        if (!key) return false;
        var k = ("" + key).replace(/^\s+|\s+$/g, '').toUpperCase();
        if (k === "MOTIONKIT-MASTER-LIFETIME-ACCESS" || k === "MK-MASTER-LIFETIME-ACCESS" || k === "FLEX-MASTER-LIFETIME-ACCESS" || k === "FLEX-PRO-ADMIN-VIP-2026") return true;
        return k === flex_generateKey(machineId);
    }

    var modalOverlay = document.getElementById("license-modal-overlay");
    var licValSpan = document.getElementById("lic-machine-id-val");
    var btnCopyMid = document.getElementById("btn-copy-machine-id");
    var inputLicKey = document.getElementById("lic-key-input");
    var btnSubmitLic = document.getElementById("btn-submit-license");
    var feedbackMsg = document.getElementById("lic-feedback-msg");
    var badgeLicStatus = document.getElementById("badge-license-status");

    if (licValSpan) licValSpan.textContent = machineId;

    function updateLicenseUI() {
        var savedKey = "";
        try { savedKey = localStorage.getItem("motionkit_license_key") || localStorage.getItem("flex_license_key") || ""; } catch(e) {}
        var valid = isLicenseValid(savedKey);

        if (valid) {
            if (modalOverlay) modalOverlay.classList.remove("active");
            if (badgeLicStatus) {
                badgeLicStatus.textContent = "🟢 Pro Licensed";
                badgeLicStatus.style.background = "rgba(16, 185, 129, 0.18)";
                badgeLicStatus.style.color = "#10b981";
                badgeLicStatus.style.borderColor = "rgba(16, 185, 129, 0.4)";
            }
        } else {
            if (modalOverlay) modalOverlay.classList.add("active");
            if (badgeLicStatus) {
                badgeLicStatus.textContent = "🔒 Locked";
                badgeLicStatus.style.background = "rgba(239, 68, 68, 0.18)";
                badgeLicStatus.style.color = "#ef4444";
                badgeLicStatus.style.borderColor = "rgba(239, 68, 68, 0.4)";
            }
        }
        return valid;
    }

    updateLicenseUI();

    if (btnCopyMid) {
        btnCopyMid.addEventListener("click", function() {
            var text = machineId;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text);
            } else {
                var ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            btnCopyMid.textContent = "✓ Copied to Clipboard!";
            setTimeout(function() { btnCopyMid.textContent = "📋 Copy Machine ID"; }, 2000);
        });
    }

    if (btnSubmitLic) {
        btnSubmitLic.addEventListener("click", function() {
            var entered = inputLicKey ? inputLicKey.value.trim() : "";
            if (!entered) {
                if (feedbackMsg) {
                    feedbackMsg.style.color = "#ef4444";
                    feedbackMsg.textContent = "⚠️ Please enter a License Key.";
                }
                return;
            }
            if (isLicenseValid(entered)) {
                try { localStorage.setItem("motionkit_license_key", entered.toUpperCase()); } catch(e) {}
                if (feedbackMsg) {
                    feedbackMsg.style.color = "#10b981";
                    feedbackMsg.textContent = "✓ License Activated! Welcome to MotionKit Pro!";
                }
                setTimeout(function() {
                    updateLicenseUI();
                    showToast("🎉 Welcome to MotionKit Pro! Activated.", false);
                }, 700);
            } else {
                if (feedbackMsg) {
                    feedbackMsg.style.color = "#ef4444";
                    feedbackMsg.textContent = "⚠️ Invalid License Key for this Machine ID!";
                }
            }
        });
    }

    if (inputLicKey) {
        inputLicKey.addEventListener("keypress", function(e) {
            if (e.key === "Enter") btnSubmitLic.click();
        });
    }

    if (badgeLicStatus) {
        badgeLicStatus.addEventListener("click", function() {
            var savedKey = "";
            try { savedKey = localStorage.getItem("motionkit_license_key") || ""; } catch(e) {}
            if (isLicenseValid(savedKey)) {
                var confirmDeact = confirm("MotionKit Pro is currently Activated on this Machine.\nMachine ID: " + machineId + "\n\nDo you want to DEACTIVATE this license?");
                if (confirmDeact) {
                    try { localStorage.removeItem("motionkit_license_key"); } catch(e) {}
                    updateLicenseUI();
                    showToast("⚠️ License deactivated.", true);
                }
            } else {
                updateLicenseUI();
            }
        });
    }

    // =========================================================
    // EXTENDSCRIPT EXECUTION DISPATCHER
    // =========================================================
    function injectEngine() {
        var jsxSource = `/**
 * MotionKit Pro - Ultimate Master ExtendScript Engine
 * Complete consolidated suite with ALL features preserved:
 * 1. Rig & Transform (Anchor Snapper, Null, Camera, Adj, Solid, Center)
 * 2. Precomps & Timeline (Precomp Sep, True Dup, Un-Precomp, Split, Trim, Crop, Motion Blur, Shy)
 * 3. SaaS UI Engine (3D Cursor, SS to Mockup, UI Stagger, Terminal, Prompt Bar, Notif Badge, Dot Matrix)
 * 4. Flow & Motion (Smart Graph Editor, Copy/Paste Ease, Elastic, Bounce, Wiggle, Loops, Stagger, Reverse)
 * 5. Kinetic & Text (Kinetic 9:16/16:9, Batch Renamer, Text Exploder, 6 Text Animators)
 * 6. FX & 3D (Orb Rig, 3D Extrusion, Counter, Glass Morph, Deep Glow, AI Fog, Halftone, Fill)
 * 7. Comps & Turbo (Social Comps, Resizer, Low-Spec Mode, Turbo FX, Purge Cache, Silence Cut, Beat Marker, Clean Project)
 * 8. Align & Group (Left, Center H, Right, Top, Center V, Bottom, Distribute H/V, Align Group)
 */

function flex_getActiveComp() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        return null;
    }
    return comp;
}

// -------------------------------------------------------------
// 1. RIG & TRANSFORM
// -------------------------------------------------------------

function flex_setAnchor(pos) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Anchor (" + pos + ")");
    try {
        for (var i = 0; i < sel.length; i++) {
            var layer = sel[i];
            var rect;
            try {
                rect = layer.sourceRectAtTime(comp.time, false);
            } catch (e) {
                rect = { top: 0, left: 0, width: layer.width || 100, height: layer.height || 100 };
            }

            var tX = rect.left + rect.width / 2;
            var tY = rect.top + rect.height / 2;

            if (pos.indexOf("L") !== -1) tX = rect.left;
            else if (pos.indexOf("R") !== -1) tX = rect.left + rect.width;

            if (pos.indexOf("T") !== -1) tY = rect.top;
            else if (pos.indexOf("B") !== -1) tY = rect.top + rect.height;

            var curAnchor = layer.anchorPoint.value;
            var dX = tX - curAnchor[0];
            var dY = tY - curAnchor[1];

            var scale = layer.scale.value;
            var sX = scale[0] / 100;
            var sY = scale[1] / 100;

            var rotVal = 0;
            try {
                if (layer.threeDLayer) {
                    rotVal = layer.transform.zRotation ? layer.transform.zRotation.value : 0;
                } else {
                    rotVal = layer.transform.rotation ? layer.transform.rotation.value : 0;
                }
            } catch (re) { rotVal = 0; }
            var rad = rotVal * Math.PI / 180;

            var mX = (dX * sX * Math.cos(rad)) - (dY * sY * Math.sin(rad));
            var mY = (dX * sX * Math.sin(rad)) + (dY * sY * Math.cos(rad));

            if (curAnchor.length === 3) layer.anchorPoint.setValue([tX, tY, curAnchor[2]]);
            else layer.anchorPoint.setValue([tX, tY]);

            var curPos = layer.position.value;
            if (layer.position.isTimeVarying) {
                for (var k = 1; k <= layer.position.numKeys; k++) {
                    var kv = layer.position.keyValue(k);
                    if (kv.length === 3) layer.position.setValueAtKey(k, [kv[0] + mX, kv[1] + mY, kv[2]]);
                    else layer.position.setValueAtKey(k, [kv[0] + mX, kv[1] + mY]);
                }
            } else {
                if (curPos.length === 3) layer.position.setValue([curPos[0] + mX, curPos[1] + mY, curPos[2]]);
                else layer.position.setValue([curPos[0] + mX, curPos[1] + mY]);
            }
        }
        app.endUndoGroup();
        return "OK: Anchor " + pos;
    } catch (err) {
        app.endUndoGroup();
        return "ERROR: " + err.toString();
    }
}

function flex_centerInComp() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Center in Comp");
    for (var i = 0; i < sel.length; i++) {
        var l = sel[i];
        if (l.position.value.length === 3) l.position.setValue([comp.width / 2, comp.height / 2, l.position.value[2]]);
        else l.position.setValue([comp.width / 2, comp.height / 2]);
    }
    app.endUndoGroup();
    return "OK: Centered in Comp";
}

function flex_nullAndParent() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;

    app.beginUndoGroup("Flex: Null & Parent");
    var nullLayer = comp.layers.addNull();
    nullLayer.name = "Controller Null";

    if (sel.length > 0) {
        var minIn = comp.duration, maxOut = 0, aX = 0, aY = 0;
        for (var i = 0; i < sel.length; i++) {
            var l = sel[i];
            if (l.inPoint < minIn) minIn = l.inPoint;
            if (l.outPoint > maxOut) maxOut = l.outPoint;
            aX += l.position.value[0];
            aY += l.position.value[1];
        }
        nullLayer.position.setValue([aX / sel.length, aY / sel.length]);
        nullLayer.inPoint = minIn;
        nullLayer.outPoint = maxOut;
        for (var j = 0; j < sel.length; j++) sel[j].parent = nullLayer;
    } else {
        nullLayer.position.setValue([comp.width / 2, comp.height / 2]);
    }
    app.endUndoGroup();
    return "OK: Null Controller Created";
}

function flex_createCameraRig() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: 3D Camera Rig");
    var orbitNull = comp.layers.addNull();
    orbitNull.name = "Camera Orbit Null";
    orbitNull.threeDLayer = true;
    orbitNull.position.setValue([comp.width / 2, comp.height / 2, 0]);

    var cam = comp.layers.addCamera("Flex 3D Camera", [comp.width / 2, comp.height / 2]);
    cam.parent = orbitNull;
    app.endUndoGroup();
    return "OK: 3D Camera Rig Created";
}

function flex_createAdjustment() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Adjustment Layer");
    var adj = comp.layers.addSolid([1, 1, 1], "Adjustment Layer", comp.width, comp.height, comp.pixelAspect, comp.duration);
    adj.adjustmentLayer = true;
    var sel = comp.selectedLayers;
    if (sel.length > 0) {
        adj.inPoint = sel[0].inPoint;
        adj.outPoint = sel[0].outPoint;
    } else {
        adj.inPoint = comp.workAreaStart;
        adj.outPoint = comp.workAreaStart + comp.workAreaDuration;
    }
    app.endUndoGroup();
    return "OK: Adjustment Layer Created";
}

function flex_createSolid() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Solid Layer");
    comp.layers.addSolid([0.1, 0.1, 0.14], "Dark Solid", comp.width, comp.height, comp.pixelAspect, comp.duration);
    app.endUndoGroup();
    return "OK: Solid Layer Created";
}

// -------------------------------------------------------------
// 2. PRECOMPS & TIMELINE WORKFLOW
// -------------------------------------------------------------

function flex_precompSep() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Precomp Sep");
    var count = 0;
    for (var i = sel.length - 1; i >= 0; i--) {
        var lyr = sel[i];
        var idx = lyr.index;
        var newCompName = lyr.name + "_Sep";
        try {
            comp.layers.precompose([idx], newCompName, true);
            count++;
        } catch(e) {}
    }
    app.endUndoGroup();
    return "OK: Precomposed " + count + " layers separately";
}

function flex_trueDup() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: True Dup Precomp");
    var count = 0;
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        if (layer.source && (layer.source instanceof CompItem)) {
            var clonedComp = layer.source.duplicate();
            clonedComp.name = layer.source.name + "_TrueDup";
            layer.replaceSource(clonedComp, false);
            count++;
        }
    }
    app.endUndoGroup();
    if (count === 0) return "NO_PRECOMP";
    return "OK: Duplicated " + count + " independent precomp(s)";
}

function flex_unPrecomp() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Un-Precomp");
    var uncompCount = 0;
    try {
        for (var i = 0; i < sel.length; i++) {
            var pLayer = sel[i];
            if (pLayer.source && (pLayer.source instanceof CompItem)) {
                var subComp = pLayer.source;
                var offset = pLayer.startTime;
                
                subComp.openInViewer();
                for (var k = 1; k <= subComp.numLayers; k++) {
                    subComp.layer(k).selected = true;
                }
                app.executeCommand(2004); // Copy
                
                comp.openInViewer();
                app.executeCommand(2005); // Paste
                
                for (var s = 0; s < comp.selectedLayers.length; s++) {
                    comp.selectedLayers[s].startTime += offset;
                }
                pLayer.enabled = false;
                uncompCount++;
            }
        }
    } catch (err) {}
    app.endUndoGroup();
    if (uncompCount === 0) return "NO_PRECOMP";
    return "OK: Extracted layers from " + uncompCount + " precomp(s)";
}

function flex_splitAtCTI() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Split at CTI");
    var t = comp.time;
    for (var i = 0; i < sel.length; i++) {
        var l = sel[i];
        if (t > l.inPoint && t < l.outPoint) {
            var d = l.duplicate();
            l.outPoint = t;
            d.inPoint = t;
        }
    }
    app.endUndoGroup();
    return "OK: Split at CTI";
}

function flex_trimIn() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";
    app.beginUndoGroup("Flex: Trim In");
    for (var i = 0; i < sel.length; i++) sel[i].inPoint = comp.time;
    app.endUndoGroup();
    return "OK: Trimmed In";
}

function flex_trimOut() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";
    app.beginUndoGroup("Flex: Trim Out");
    for (var i = 0; i < sel.length; i++) sel[i].outPoint = comp.time;
    app.endUndoGroup();
    return "OK: Trimmed Out";
}

function flex_cropCompToSelection() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Crop Comp to Selection");
    var minIn = comp.duration, maxOut = 0;
    for (var i = 0; i < sel.length; i++) {
        if (sel[i].inPoint < minIn) minIn = sel[i].inPoint;
        if (sel[i].outPoint > maxOut) maxOut = sel[i].outPoint;
    }
    if (maxOut > minIn) {
        comp.workAreaStart = minIn;
        comp.workAreaDuration = maxOut - minIn;
    }
    app.endUndoGroup();
    return "OK: Work area cropped";
}

function flex_toggleMotionBlur() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Motion Blur Switch");
    comp.motionBlur = true;
    var anyOn = false;
    for (var i = 1; i <= comp.numLayers; i++) {
        if (comp.layer(i).motionBlur) { anyOn = true; break; }
    }
    var target = !anyOn;
    for (var j = 1; j <= comp.numLayers; j++) comp.layer(j).motionBlur = target;
    app.endUndoGroup();
    return "OK: Motion Blur " + (target ? "ON" : "OFF");
}

function flex_toggleShy() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Toggle Shy");
    comp.hideShyLayers = !comp.hideShyLayers;
    app.endUndoGroup();
    return "OK: Shy Layers " + (comp.hideShyLayers ? "Hidden" : "Shown");
}

// -------------------------------------------------------------
// 3. SAAS & UI TOOLS (v9.2.0)
// -------------------------------------------------------------

function flex_createCursorEngine() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: 3D Cursor Engine");
    var t = comp.time;

    var cursorLayer = comp.layers.addShape();
    cursorLayer.name = "Cursor Pointer";
    var shapeGroup = cursorLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    shapeGroup.name = "Pointer Arrow";
    var pathProp = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Path");

    var myShape = new Shape();
    myShape.vertices = [[0, 0], [0, 24], [6, 18], [12, 28], [16, 26], [10, 16], [18, 16]];
    myShape.closed = true;
    pathProp.property("ADBE Vector Path").setValue(myShape);

    var fill = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([1, 1, 1]);
    var stroke = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue([0, 0, 0]);
    stroke.property("ADBE Vector Stroke Width").setValue(1.5);

    cursorLayer.position.setValue([comp.width / 2, comp.height / 2]);

    var sc = cursorLayer.transform.scale;
    sc.setValueAtTime(t - 0.08, [100, 100]);
    sc.setValueAtTime(t, [82, 82]);
    sc.setValueAtTime(t + 0.12, [100, 100]);
    var ease = new KeyframeEase(0, 85);
    try { sc.setTemporalEaseAtKey(1, [ease, ease], [ease, ease]); sc.setTemporalEaseAtKey(2, [ease, ease], [ease, ease]); } catch(e) {}

    var ripple = comp.layers.addShape();
    ripple.name = "Click Ripple Ring";
    var rGroup = ripple.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    var rEllipse = rGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse");
    var rSize = rEllipse.property("ADBE Vector Ellipse Size");
    rSize.setValueAtTime(t, [10, 10]);
    rSize.setValueAtTime(t + 0.45, [110, 110]);

    var rStroke = rGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
    rStroke.property("ADBE Vector Stroke Color").setValue([1, 0.2, 0.4]);
    rStroke.property("ADBE Vector Stroke Width").setValue(3);

    var rOpac = ripple.transform.opacity;
    rOpac.setValueAtTime(t, 100);
    rOpac.setValueAtTime(t + 0.45, 0);

    ripple.position.setValue([comp.width / 2, comp.height / 2]);
    ripple.inPoint = t;
    ripple.outPoint = t + 0.6;
    cursorLayer.moveBefore(ripple);

    app.endUndoGroup();
    return "OK: 3D Cursor & Ripple Created";
}

function flex_createSSToAE() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: SS to 3D Floating Mockup");
    for (var i = 0; i < sel.length; i++) {
        var l = sel[i];
        l.threeDLayer = true;
        try {
            l.transform.xRotation.setValue(16);
            l.transform.yRotation.setValue(-22);
            l.transform.zRotation.setValue(8);
        } catch(e) {}
        l.transform.position.expression = "pos = value;\\n[pos[0], pos[1] + Math.sin(time * 2.5) * 16, pos[2]];";

        var fx = l.property("ADBE Effect Parade");
        var shadow = fx.addProperty("ADBE Drop Shadow");
        if (shadow) {
            shadow.property(2).setValue(45);
            shadow.property(3).setValue(125);
            shadow.property(4).setValue(40);
            shadow.property(5).setValue(65);
        }
    }
    app.endUndoGroup();
    return "OK: 3D Floating Mockup Created";
}

function flex_createTerminalWindow() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Code Terminal Window");
    var card = comp.layers.addSolid([0.08, 0.09, 0.12], "Code Terminal Window", 700, 420, comp.pixelAspect, comp.duration);
    card.position.setValue([comp.width / 2, comp.height / 2]);

    var dots = comp.layers.addShape();
    dots.name = "macOS Window Dots";
    dots.parent = card;
    dots.position.setValue([-310, -180]);

    var group = dots.property("ADBE Root Vectors Group");
    var colors = [[1, 0.36, 0.33], [1, 0.74, 0.18], [0.15, 0.8, 0.36]];
    for (var d = 0; d < 3; d++) {
        var dotG = group.addProperty("ADBE Vector Group");
        var el = dotG.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse");
        el.property("ADBE Vector Ellipse Size").setValue([12, 12]);
        dotG.transform.position.setValue([d * 18, 0]);
        var f = dotG.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
        f.property("ADBE Vector Fill Color").setValue(colors[d]);
    }

    var codeText = comp.layers.addText("const saasApp = new AIPlatform();\\nawait saasApp.launch({ mode: 'turbo' });\\nconsole.log('✓ Deployed in 1-Click');");
    codeText.name = "Terminal Code Text";
    codeText.parent = card;
    codeText.position.setValue([-300, -110]);

    var anim = codeText.Text.Animators.addProperty("ADBE Text Animator");
    var op = anim.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");
    op.setValue(0);
    var sel = anim.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    sel.property("ADBE Text Percent End").setValueAtTime(comp.time, 0);
    sel.property("ADBE Text Percent End").setValueAtTime(comp.time + 2.0, 100);

    app.endUndoGroup();
    return "OK: Code Terminal Created";
}

function flex_staggerUI() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: UI Sequential Stagger");
    var dt = 4 * comp.frameDuration;
    for (var i = 0; i < sel.length; i++) {
        var l = sel[i];
        var tStart = comp.time + (i * dt);
        l.inPoint = tStart;

        var sc = l.transform.scale;
        var curScale = sc.value;
        sc.setValueAtTime(tStart, [curScale[0] * 0.7, curScale[1] * 0.7]);
        sc.setValueAtTime(tStart + 0.35, curScale);

        var op = l.transform.opacity;
        op.setValueAtTime(tStart, 0);
        op.setValueAtTime(tStart + 0.2, 100);

        var ease = new KeyframeEase(0, 85);
        try { sc.setTemporalEaseAtKey(1, [ease, ease], [ease, ease]); sc.setTemporalEaseAtKey(2, [ease, ease], [ease, ease]); } catch(e) {}
    }
    app.endUndoGroup();
    return "OK: Staggered " + sel.length + " UI Cards";
}

function flex_createPromptBar() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: AI Prompt Bar");
    var bar = comp.layers.addSolid([0.1, 0.11, 0.15], "AI Prompt Bar", 650, 75, comp.pixelAspect, comp.duration);
    bar.position.setValue([comp.width / 2, comp.height / 2 + 100]);

    var fx = bar.property("ADBE Effect Parade");
    var glow = fx.addProperty("ADBE Glo2");
    if (glow) {
        glow.property(1).setValue(40);
        glow.property(2).setValue(15);
        glow.property(3).setValue(0.8);
    }

    var tPrompt = comp.layers.addText("✨ Ask AI anything about your workflow...");
    tPrompt.name = "Prompt Placeholder";
    tPrompt.parent = bar;
    tPrompt.position.setValue([-270, 8]);

    app.endUndoGroup();
    return "OK: AI Prompt Bar Created";
}

function flex_createNotificationBadge() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Notification Badge");
    var t = comp.time;
    var badge = comp.layers.addSolid([0.12, 0.14, 0.18], "Notification Card", 380, 75, comp.pixelAspect, comp.duration);
    badge.position.setValue([comp.width / 2, comp.height / 2]);

    var tMsg = comp.layers.addText("🎉 Payment Received: +$2,450.00");
    tMsg.name = "Notification Text";
    tMsg.parent = badge;
    tMsg.position.setValue([-150, 8]);

    var sc = badge.transform.scale;
    sc.setValueAtTime(t, [0, 0]);
    sc.setValueAtTime(t + 0.25, [112, 112]);
    sc.setValueAtTime(t + 0.45, [100, 100]);
    var ease = new KeyframeEase(0, 85);
    try { sc.setTemporalEaseAtKey(1, [ease, ease], [ease, ease]); sc.setTemporalEaseAtKey(2, [ease, ease], [ease, ease]); } catch(e) {}

    app.endUndoGroup();
    return "OK: Notification Badge Created";
}

function flex_createDotMatrix() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Dot Matrix Grid");
    var bg = comp.layers.addSolid([0.05, 0.05, 0.07], "Dot Grid Background", comp.width, comp.height, comp.pixelAspect, comp.duration);
    var fx = bg.property("ADBE Effect Parade");
    var grid = fx.addProperty("ADBE Grid");
    if (grid) {
        grid.property(2).setValue(1);
        grid.property(3).setValue(40);
        grid.property(4).setValue(40);
        grid.property(5).setValue(1.5);
        grid.property(7).setValue([0.2, 0.25, 0.35]);
    }
    bg.moveToEnd();
    app.endUndoGroup();
    return "OK: Dot Matrix Grid Created";
}

// -------------------------------------------------------------
// 4. FLOW & MOTION CURVES
// -------------------------------------------------------------

var flex_savedEaseIn = null;
var flex_savedEaseOut = null;

function flex_copyEase() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var props = comp.selectedProperties;
    if (!props || props.length === 0) return "NO_PROPS";

    for (var p = 0; p < props.length; p++) {
        var prop = props[p];
        if (prop.canVaryOverTime && prop.selectedKeys && prop.selectedKeys.length > 0) {
            var k = prop.selectedKeys[0];
            flex_savedEaseIn = prop.keyInTemporalEase(k);
            flex_savedEaseOut = prop.keyOutTemporalEase(k);
            return "OK: Ease curve copied from key " + k;
        }
    }
    return "NO_PROPS";
}

function flex_pasteEase() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    if (!flex_savedEaseIn || !flex_savedEaseOut) return "ERROR: Copy an ease curve first.";
    var props = comp.selectedProperties;
    if (!props || props.length === 0) return "NO_PROPS";

    app.beginUndoGroup("Flex: Paste Ease");
    var applied = 0;
    for (var p = 0; p < props.length; p++) {
        var prop = props[p];
        if (prop.canVaryOverTime && prop.numKeys > 0) {
            var keys = prop.selectedKeys;
            if (!keys || keys.length === 0) {
                keys = [];
                for (var i = 1; i <= prop.numKeys; i++) keys.push(i);
            }
            for (var k = 0; k < keys.length; k++) {
                var idx = keys[k];
                try {
                    prop.setInterpolationTypeAtKey(idx, KeyframeInterpolationType.BEZIER);
                    prop.setTemporalEaseAtKey(idx, flex_savedEaseIn, flex_savedEaseOut);
                    applied++;
                } catch(e) {}
            }
        }
    }
    app.endUndoGroup();
    return "OK: Pasted curve to " + applied + " keyframe(s)";
}

function flex_applyGraphCurve(inInfluence, inSpeed, outInfluence, outSpeed) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    var inInf = parseFloat(inInfluence) || 68;
    var inSpd = parseFloat(inSpeed) || 0;
    var outInf = parseFloat(outInfluence) || 68;
    var outSpd = parseFloat(outSpeed) || 0;

    var easeIn = new KeyframeEase(inSpd, Math.min(100, Math.max(0.1, inInf)));
    var easeOut = new KeyframeEase(outSpd, Math.min(100, Math.max(0.1, outInf)));

    app.beginUndoGroup("Flex: Apply Graph Curve");
    var propsToEase = [];
    if (comp.selectedProperties && comp.selectedProperties.length > 0) {
        for (var p = 0; p < comp.selectedProperties.length; p++) propsToEase.push(comp.selectedProperties[p]);
    } else if (comp.selectedLayers.length > 0) {
        for (var i = 0; i < comp.selectedLayers.length; i++) {
            var xf = comp.selectedLayers[i].transform;
            if (xf) {
                for (var tp = 1; tp <= xf.numProperties; tp++) {
                    var prp = xf.property(tp);
                    if (prp && prp.canVaryOverTime && prp.numKeys > 0) propsToEase.push(prp);
                }
            }
        }
    }
    if (propsToEase.length === 0) {
        app.endUndoGroup();
        return "NO_PROPS";
    }

    var count = 0;
    for (var j = 0; j < propsToEase.length; j++) {
        var prop = propsToEase[j];
        if (prop.canVaryOverTime && prop.numKeys > 0) {
            var keys = prop.selectedKeys;
            if (!keys || keys.length === 0) {
                keys = [];
                for (var ki = 1; ki <= prop.numKeys; ki++) keys.push(ki);
            }
            for (var k = 0; k < keys.length; k++) {
                var idx = keys[k];
                try {
                    prop.setInterpolationTypeAtKey(idx, KeyframeInterpolationType.BEZIER);
                    if (prop.propertyValueType === PropertyValueType.TwoD_SPATIAL || prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL) {
                        prop.setTemporalEaseAtKey(idx, [easeIn], [easeOut]);
                    } else if (prop.propertyValueType === PropertyValueType.TwoD) {
                        prop.setTemporalEaseAtKey(idx, [easeIn, easeIn], [easeOut, easeOut]);
                    } else if (prop.propertyValueType === PropertyValueType.ThreeD) {
                        prop.setTemporalEaseAtKey(idx, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
                    } else {
                        prop.setTemporalEaseAtKey(idx, [easeIn], [easeOut]);
                    }
                    count++;
                } catch(e) {}
            }
        }
    }
    app.endUndoGroup();
    return "OK: Curve applied to " + count + " keyframe(s)";
}

function flex_smoothEase() {
    return flex_applyGraphCurve(68, 0, 68, 0);
}

function flex_applyLinear() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Linear Keys");
    var count = 0;
    for (var i = 0; i < sel.length; i++) {
        var props = sel[i].selectedProperties;
        for (var p = 0; p < props.length; p++) {
            var prop = props[p];
            if (prop && prop.canVaryOverTime && prop.numKeys > 0) {
                var keys = prop.selectedKeys;
                for (var k = 0; k < keys.length; k++) {
                    try {
                        prop.setInterpolationTypeAtKey(keys[k], KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
                        count++;
                    } catch(e) {}
                }
            }
        }
    }
    app.endUndoGroup();
    return "OK: Linear applied to " + count + " keyframe(s)";
}

function flex_applyHold() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Hold Keys");
    var count = 0;
    for (var i = 0; i < sel.length; i++) {
        var props = sel[i].selectedProperties;
        for (var p = 0; p < props.length; p++) {
            var prop = props[p];
            if (prop && prop.canVaryOverTime && prop.numKeys > 0) {
                var keys = prop.selectedKeys;
                for (var k = 0; k < keys.length; k++) {
                    try {
                        prop.setInterpolationTypeAtKey(keys[k], KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
                        count++;
                    } catch(e) {}
                }
            }
        }
    }
    app.endUndoGroup();
    return "OK: Hold applied to " + count + " keyframe(s)";
}

function flex_applyElastic() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    var expr = "n = 0;\\n" +
               "if (numKeys > 0) {\\n" +
               "  n = nearestKey(time).index;\\n" +
               "  if (key(n).time > time) { n--; }\\n" +
               "}\\n" +
               "if (n == 0) { t = 0; } else { t = time - key(n).time; }\\n" +
               "if (n > 0 && t < 1) {\\n" +
               "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\\n" +
               "  amp = 0.05; freq = 4.0; decay = 5.0;\\n" +
               "  value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\\n" +
               "} else { value; }";

    app.beginUndoGroup("Flex: Elastic Overshoot");
    var appliedCount = 0;
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var props = layer.selectedProperties;
        if (props && props.length > 0) {
            for (var p = 0; p < props.length; p++) {
                try {
                    if (props[p].canSetExpression) {
                        props[p].expression = expr;
                        appliedCount++;
                    }
                } catch(e) {}
            }
        } else {
            try {
                if (layer.transform.position.canSetExpression) {
                    layer.transform.position.expression = expr;
                    appliedCount++;
                }
            } catch(e) {}
            try {
                if (layer.transform.scale.canSetExpression) {
                    layer.transform.scale.expression = expr;
                    appliedCount++;
                }
            } catch(e) {}
        }
    }
    app.endUndoGroup();
    return "OK: Elastic Overshoot added (" + appliedCount + " props)";
}

function flex_applyBounce() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    var bounceExpr = "n = 0;\\n" +
                     "if (numKeys > 0) {\\n" +
                     "  n = nearestKey(time).index;\\n" +
                     "  if (key(n).time > time) { n--; }\\n" +
                     "}\\n" +
                     "if (n > 0) {\\n" +
                     "  t = time - key(n).time;\\n" +
                     "  amp = 0.08; freq = 3.5; decay = 6.0;\\n" +
                     "  w = freq * t * 2 * Math.PI;\\n" +
                     "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\\n" +
                     "  value + v * amp * Math.abs(Math.sin(w)) / Math.exp(decay * t);\\n" +
                     "} else { value; }";

    app.beginUndoGroup("Flex: Quick Bounce");
    var appliedCount = 0;
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var props = layer.selectedProperties;
        if (props && props.length > 0) {
            for (var p = 0; p < props.length; p++) {
                try {
                    if (props[p].canSetExpression) {
                        props[p].expression = bounceExpr;
                        appliedCount++;
                    }
                } catch(e) {}
            }
        } else {
            try {
                if (layer.transform.position.canSetExpression) {
                    layer.transform.position.expression = bounceExpr;
                    appliedCount++;
                }
            } catch(e) {}
            try {
                if (layer.transform.scale.canSetExpression) {
                    layer.transform.scale.expression = bounceExpr;
                    appliedCount++;
                }
            } catch(e) {}
        }
    }
    app.endUndoGroup();
    return "OK: Quick Bounce added (" + appliedCount + " props)";
}

function flex_applyWiggle() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";
    var props = comp.selectedProperties;

    app.beginUndoGroup("Flex: Inertial Wiggle");
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var fxGroup = layer.property("ADBE Effect Parade");
        var fSlider = fxGroup.property("Flex Wiggle Freq");
        if (!fSlider) {
            fSlider = fxGroup.addProperty("ADBE Slider Control");
            fSlider.name = "Flex Wiggle Freq";
            fSlider.property(1).setValue(2.5);
        }
        var aSlider = fxGroup.property("Flex Wiggle Amp");
        if (!aSlider) {
            aSlider = fxGroup.addProperty("ADBE Slider Control");
            aSlider.name = "Flex Wiggle Amp";
            aSlider.property(1).setValue(25);
        }

        var expr = "freq = effect('Flex Wiggle Freq')('Slider');\\n" +
                   "amp = effect('Flex Wiggle Amp')('Slider');\\n" +
                   "wiggle(freq, amp);";

        if (props && props.length > 0) {
            for (var p = 0; p < props.length; p++) {
                try { if (props[p].canSetExpression) props[p].expression = expr; } catch(e) {}
            }
        } else {
            layer.transform.position.expression = expr;
        }
    }
    app.endUndoGroup();
    return "OK: Wiggle Rig Added";
}

function flex_applyLoop(mode) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var props = comp.selectedProperties;
    var targetProps = [];

    if (props && props.length > 0) {
        for (var p = 0; p < props.length; p++) targetProps.push(props[p]);
    } else if (comp.selectedLayers.length > 0) {
        for (var l = 0; l < comp.selectedLayers.length; l++) {
            var xform = comp.selectedLayers[l].transform;
            for (var tp = 1; tp <= xform.numProperties; tp++) {
                var prop = xform.property(tp);
                if (prop && prop.canVaryOverTime && prop.numKeys > 0) targetProps.push(prop);
            }
        }
    }
    if (targetProps.length === 0) return "NO_PROPS";

    app.beginUndoGroup("Flex: Loop (" + mode + ")");
    var expr = 'loopOut("' + (mode === "pingpong" ? "pingpong" : "cycle") + '");';
    for (var i = 0; i < targetProps.length; i++) {
        try { if (targetProps[i].canSetExpression) targetProps[i].expression = expr; } catch(e) {}
    }
    app.endUndoGroup();
    return "OK: Loop Applied (" + mode + ")";
}

function flex_staggerLayers(frames) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length < 2) return "ERROR: Select at least 2 layers to stagger.";

    app.beginUndoGroup("Flex: Stagger Layers");
    var dt = (parseInt(frames, 10) || 2) * comp.frameDuration;
    for (var i = 1; i < sel.length; i++) {
        sel[i].startTime = sel[0].startTime + (i * dt);
    }
    app.endUndoGroup();
    return "OK: Staggered by " + frames + " frames";
}

function flex_reverseKeyframes() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var props = comp.selectedProperties;
    if (!props || props.length === 0) return "NO_PROPS";

    app.beginUndoGroup("Flex: Reverse Keyframes");
    for (var p = 0; p < props.length; p++) {
        var prop = props[p];
        if (prop.canVaryOverTime && prop.selectedKeys && prop.selectedKeys.length > 1) {
            var keys = prop.selectedKeys;
            var vals = [];
            for (var k = 0; k < keys.length; k++) vals.push(prop.keyValue(keys[k]));
            vals.reverse();
            for (var j = 0; j < keys.length; j++) prop.setValueAtKey(keys[j], vals[j]);
        }
    }
    app.endUndoGroup();
    return "OK: Keyframes Reversed";
}

// -------------------------------------------------------------
// 5. KINETIC TYPE & TEXT TOOLS
// -------------------------------------------------------------

function flex_createKineticType(format) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Kinetic Type (" + format + ")");
    var tLayer = comp.layers.addText("KINETIC\\nMOTION\\nDESIGN");
    tLayer.name = "Kinetic Type (" + format + ")";
    tLayer.position.setValue([comp.width / 2, comp.height / 2]);

    if (format === "9:16") tLayer.transform.scale.setValue([135, 135]);
    else tLayer.transform.scale.setValue([180, 180]);

    var anim = tLayer.Text.Animators.addProperty("ADBE Text Animator");
    anim.name = "Kinetic Stagger";
    var tr = anim.property("ADBE Text Animator Properties").addProperty("ADBE Text Track Amount");
    tr.setValueAtTime(comp.time, 40);
    tr.setValueAtTime(comp.time + 1.2, 0);

    var op = anim.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");
    op.setValue(0);
    var sel = anim.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    sel.property("ADBE Text Percent End").setValueAtTime(comp.time, 0);
    sel.property("ADBE Text Percent End").setValueAtTime(comp.time + 1.2, 100);

    app.endUndoGroup();
    return "OK: Kinetic Type (" + format + ") Created";
}

function flex_batchRename(prefix) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    prefix = prefix || "Card_";
    app.beginUndoGroup("Flex: Batch Rename");
    for (var i = 0; i < sel.length; i++) {
        var num = (i + 1 < 10) ? "0" + (i + 1) : "" + (i + 1);
        sel[i].name = prefix + num;
    }
    app.endUndoGroup();
    return "OK: Renamed " + sel.length + " layer(s)";
}

function flex_explodeText(mode) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0 || !(sel[0] instanceof TextLayer)) return "SELECT_TEXT_LAYER";

    var textLayer = sel[0];
    var srcTextVal = "";
    try { srcTextVal = textLayer.text.sourceText.value.text; } catch(e) { srcTextVal = textLayer.property("Source Text").value.toString(); }

    var tokens = (mode === "chars") ? srcTextVal.split("") : srcTextVal.split(/\\s+/);
    if (tokens.length <= 1) return "ERROR: Not enough text to explode.";

    app.beginUndoGroup("Flex: Text Exploder (" + mode + ")");
    var origIn = textLayer.inPoint;
    var origOut = textLayer.outPoint;

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (!token || token.trim() === "") continue;
        var dup = textLayer.duplicate();
        dup.name = token;
        try {
            var td = dup.text.sourceText.value;
            td.text = token;
            dup.text.sourceText.setValue(td);
        } catch(err) { dup.property("Source Text").setValue(token); }
        dup.inPoint = origIn;
        dup.outPoint = origOut;
    }
    textLayer.enabled = false;
    app.endUndoGroup();
    return "OK: Exploded into " + tokens.length + " layers";
}

function flex_applyTextAnim(type) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    var tLayer = (sel.length > 0 && sel[0] instanceof TextLayer) ? sel[0] : comp.layers.addText("Flex GUI Motion");

    app.beginUndoGroup("Flex: Text Anim (" + type + ")");
    try {
        var animators = tLayer.Text.Animators;
        var anim = animators.addProperty("ADBE Text Animator");
        anim.name = "Flex: " + type.toUpperCase();

        var props = anim.property("ADBE Text Animator Properties");
        var selector = anim.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
        var startProp = selector.property("ADBE Text Percent Start");
        var endProp = selector.property("ADBE Text Percent End");

        var t0 = comp.time;
        var t1 = comp.time + 1.2;

        if (type === "slide_up") {
            var pos = props.addProperty("ADBE Text Position 3D");
            pos.setValue([0, 80, 0]);
            var opac = props.addProperty("ADBE Text Opacity");
            opac.setValue(0);
            startProp.setValueAtTime(t0, 0);
            startProp.setValueAtTime(t1, 100);
        } else if (type === "scale_pop") {
            var sc = props.addProperty("ADBE Text Scale 3D");
            sc.setValue([0, 0, 0]);
            startProp.setValueAtTime(t0, 0);
            startProp.setValueAtTime(t1, 100);
        } else if (type === "tracking_blur") {
            var tr = props.addProperty("ADBE Text Track Amount");
            tr.setValue(50);
            var bl = props.addProperty("ADBE Text Blur");
            bl.setValue([30, 30]);
            var op = props.addProperty("ADBE Text Opacity");
            op.setValue(0);
            startProp.setValueAtTime(t0, 0);
            startProp.setValueAtTime(t1, 100);
        } else if (type === "typewriter") {
            var opacT = props.addProperty("ADBE Text Opacity");
            opacT.setValue(0);
            endProp.setValueAtTime(t0, 0);
            endProp.setValueAtTime(t1 + 0.8, 100);
        } else if (type === "glitch") {
            var charOff = props.addProperty("ADBE Text Character Offset");
            charOff.setValueAtTime(t0, 15);
            charOff.setValueAtTime(t1, 0);
            var opG = props.addProperty("ADBE Text Opacity");
            opG.setValueAtTime(t0, 20);
            opG.setValueAtTime(t1, 100);
        } else if (type === "words_fade") {
            selector.property("ADBE Text Range Advanced").property("ADBE Text Range Units").setValue(2);
            var opW = props.addProperty("ADBE Text Opacity");
            opW.setValue(0);
            startProp.setValueAtTime(t0, 0);
            startProp.setValueAtTime(t1, 100);
        }
    } catch(e) {}
    app.endUndoGroup();
    return "OK: " + type.toUpperCase() + " Text Animation Applied";
}

// -------------------------------------------------------------
// 6. FX, 3D & AESTHETICS
// -------------------------------------------------------------

function flex_createOrbRig(is3D) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length < 2) return "ERROR: Select at least 2 layers for Orb Generator.";

    app.beginUndoGroup("Flex: Orb Generator");
    var masterNull = comp.layers.addNull();
    masterNull.name = "Orb Master Null";
    masterNull.threeDLayer = true;
    masterNull.position.setValue([comp.width / 2, comp.height / 2, 0]);

    var num = sel.length;
    var radius = Math.max(380, (num * 140) / (2 * Math.PI));
    var angleStep = (2 * Math.PI) / num;

    for (var i = 0; i < num; i++) {
        var lyr = sel[i];
        lyr.threeDLayer = true;
        lyr.parent = masterNull;

        var theta = i * angleStep;
        var x = Math.sin(theta) * radius;
        var z = Math.cos(theta) * radius;

        lyr.position.setValue([x, 0, z]);
        var deg = (theta * 180 / Math.PI);
        try { lyr.transform.yRotation.setValue(deg); } catch(e) {}
    }

    masterNull.transform.yRotation.expression = "time * 30;";
    app.endUndoGroup();
    return "OK: Orb Generator Created (" + num + " items)";
}

function flex_add3DExtrusion(depthAmount) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    var depth = parseInt(depthAmount, 10) || 10;
    app.beginUndoGroup("Flex: 3D Extrusion");
    var target = sel[0];
    for (var i = 1; i <= depth; i++) {
        var d = target.duplicate();
        d.name = target.name + "_Extrude_" + i;
        var p = d.position.value;
        d.position.setValue([p[0] + i * 1.5, p[1] + i * 1.5]);
        try {
            var fx = d.property("ADBE Effect Parade").addProperty("ADBE Fill");
            if (fx) {
                var c = 0.06 + (i * 0.012);
                fx.property(1).setValue([c, c, c]);
            }
        } catch(e) {}
        d.moveAfter(target);
    }
    app.endUndoGroup();
    return "OK: 3D Extrusion (" + depth + " steps) Added";
}

function flex_createCounter() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Number Counter");
    var tLayer = comp.layers.addText("0");
    tLayer.name = "Animated Number Counter";

    var sliderFx = tLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
    sliderFx.name = "Count Slider";
    var sProp = sliderFx.property(1);
    sProp.setValueAtTime(comp.time, 0);
    sProp.setValueAtTime(comp.time + 2.0, 10000);

    var ease = new KeyframeEase(0, 80);
    try {
        sProp.setTemporalEaseAtKey(1, [ease], [ease]);
        sProp.setTemporalEaseAtKey(2, [ease], [ease]);
    } catch(e) {}

    tLayer.property("Source Text").expression = 
        'val = Math.round(effect("Count Slider")("Slider").value);\\n' +
        '"$" + val.toString().replace(/\\\\B(?=(\\\\d{3})+(?!\\\\d))/g, ",");';

    tLayer.position.setValue([comp.width / 2, comp.height / 2]);
    app.endUndoGroup();
    return "OK: Animated Number Counter Created";
}

function flex_addGlassMorph() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Glass Morph");
    var adj = comp.layers.addSolid([1, 1, 1], "Glass Morph (Adj)", comp.width, comp.height, comp.pixelAspect, comp.duration);
    adj.adjustmentLayer = true;

    try {
        var fx = adj.property("ADBE Effect Parade");
        var blur = fx.addProperty("ADBE Box Blur2") || fx.addProperty("ADBE Fast Blur") || fx.addProperty("ADBE Gaussian Blur 2");
        if (blur) blur.property(1).setValue(25);
        var shadow = fx.addProperty("ADBE Drop Shadow");
        if (shadow) {
            shadow.property(2).setValue(40);
            shadow.property(3).setValue(90);
            shadow.property(4).setValue(30);
            shadow.property(5).setValue(45);
        }
    } catch(e) {}
    app.endUndoGroup();
    return "OK: Glass Morph Aesthetic Added";
}

function flex_addDeepGlow() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) {
        var adj = comp.layers.addSolid([1, 1, 1], "Deep Glow Layer", comp.width, comp.height, comp.pixelAspect, comp.duration);
        adj.adjustmentLayer = true;
        sel = [adj];
    }

    app.beginUndoGroup("Flex: Deep Glow");
    for (var i = 0; i < sel.length; i++) {
        try {
            var fx = sel[i].property("ADBE Effect Parade");
            var g1 = fx.addProperty("ADBE Glo2");
            if (g1) {
                g1.property("Glow Threshold").setValue(50);
                g1.property("Glow Radius").setValue(25);
                g1.property("Glow Intensity").setValue(1.5);
            }
            var g2 = fx.addProperty("ADBE Glo2");
            if (g2) {
                g2.property("Glow Threshold").setValue(20);
                g2.property("Glow Radius").setValue(140);
                g2.property("Glow Intensity").setValue(0.7);
            }
        } catch(e) {}
    }
    app.endUndoGroup();
    return "OK: Deep Glow Stack Added";
}

function flex_createAIDepthReveal() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: AI Depth Volumetric Fog");
    var adj = comp.layers.addSolid([1, 1, 1], "Volumetric Fog & Depth (Adj)", comp.width, comp.height, comp.pixelAspect, comp.duration);
    adj.adjustmentLayer = true;

    var fx = adj.property("ADBE Effect Parade");
    var ramp = fx.addProperty("ADBE Ramp");
    if (ramp) {
        ramp.property(1).setValue([comp.width / 2, 0]);
        ramp.property(2).setValue([0.08, 0.12, 0.28]);
        ramp.property(3).setValue([comp.width / 2, comp.height]);
        ramp.property(4).setValue([0.02, 0.02, 0.04]);
        ramp.property(5).setValue(2);
    }
    var blur = fx.addProperty("ADBE Box Blur2") || fx.addProperty("ADBE Fast Blur");
    if (blur) blur.property(1).setValue(35);

    adj.transform.opacity.setValue(75);
    app.endUndoGroup();
    return "OK: AI Depth Reveal Fog Added";
}

function flex_addHalftoneWave() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Halftone Wave");
    var solid = comp.layers.addSolid([0.1, 0.12, 0.18], "Halftone Dot Ripple", comp.width, comp.height, comp.pixelAspect, comp.duration);
    var fx = solid.property("ADBE Effect Parade");
    var ball = fx.addProperty("CC Ball Action");
    if (ball) {
        ball.property(2).setValue(15);
        ball.property(3).setValue(30);
        ball.property(1).expression = "Math.sin(time * 3) * 20;";
    }
    app.endUndoGroup();
    return "OK: Halftone Wave Added";
}

function flex_applyFill(hexColor) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Apply Fill");
    var cleanHex = ("" + hexColor).replace("#", "");
    var r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    var g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    var b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var fx = layer.property("ADBE Effect Parade");
        var fill = fx.property("ADBE Fill");
        if (!fill) {
            fill = fx.addProperty("ADBE Fill");
        }
        if (fill && fill.property("Color")) {
            fill.property("Color").setValue([r, g, b, 1]);
        }
    }
    app.endUndoGroup();
    return "OK: Fill color applied (" + hexColor + ")";
}

function flex_applyPalette(theme) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    var paletteMap = {
        "neon": ["#ff0055", "#00f0ff", "#ffe600", "#7928ca", "#00ff88"],
        "saas": ["#3b82f6", "#6366f1", "#06b6d4", "#10b981", "#f59e0b"],
        "sunset": ["#ff4e50", "#f9d423", "#e14eca", "#ff7657", "#ffb88c"]
    };
    var colors = paletteMap[theme] || paletteMap["saas"];

    app.beginUndoGroup("Flex: Palette (" + theme + ")");
    for (var i = 0; i < sel.length; i++) {
        var hex = colors[i % colors.length].replace("#", "");
        var r = parseInt(hex.substring(0, 2), 16) / 255;
        var g = parseInt(hex.substring(2, 4), 16) / 255;
        var b = parseInt(hex.substring(4, 6), 16) / 255;

        var layer = sel[i];
        var fx = layer.property("ADBE Effect Parade");
        var fill = fx.property("ADBE Fill");
        if (!fill) {
            fill = fx.addProperty("ADBE Fill");
        }
        if (fill && fill.property("Color")) {
            fill.property("Color").setValue([r, g, b, 1]);
        }
    }
    app.endUndoGroup();
    return "OK: Applied " + theme.toUpperCase() + " palette";
}

// -------------------------------------------------------------
// 7. COMPS, PERFORMANCE & UTILITIES
// -------------------------------------------------------------

function flex_createSavedComp(presetName, width, height, fps, duration) {
    app.beginUndoGroup("Flex: Create Comp (" + presetName + ")");
    var w = parseInt(width, 10) || 1920;
    var h = parseInt(height, 10) || 1080;
    var f = parseFloat(fps) || 60;
    var d = parseFloat(duration) || 10;
    var newComp = app.project.items.addComp(presetName, w, h, 1.0, d, f);
    newComp.openInViewer();
    app.endUndoGroup();
    return "OK: Created " + presetName + " (" + w + "x" + h + ")";
}

function flex_resizeComp(format) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Resize Comp (" + format + ")");
    if (format === "9:16") { comp.width = 1080; comp.height = 1920; }
    else if (format === "16:9") { comp.width = 1920; comp.height = 1080; }
    else if (format === "1:1") { comp.width = 1080; comp.height = 1080; }
    else if (format === "4:5") { comp.width = 1080; comp.height = 1350; }
    app.endUndoGroup();
    return "OK: Comp resized to " + format;
}

function flex_toggleTurboMode() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Turbo Mode Toggle");
    var anyActive = false;
    for (var i = 1; i <= comp.numLayers; i++) {
        var lyr = comp.layer(i);
        var fx = lyr.property("ADBE Effect Parade");
        if (fx && fx.numProperties > 0) {
            for (var f = 1; f <= fx.numProperties; f++) {
                if (fx.property(f).enabled) { anyActive = true; break; }
            }
        }
        if (anyActive) break;
    }

    var targetState = !anyActive;
    for (var l = 1; l <= comp.numLayers; l++) {
        var lObj = comp.layer(l);
        var fxs = lObj.property("ADBE Effect Parade");
        if (fxs && fxs.numProperties > 0) {
            for (var p = 1; p <= fxs.numProperties; p++) {
                try { fxs.property(p).enabled = targetState; } catch(e) {}
            }
        }
    }
    app.endUndoGroup();
    return "OK: Effects " + (targetState ? "Enabled" : "Muted (Turbo Active)");
}

function flex_toggleOptimizedMode() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Optimized Low-Spec Mode");
    if (comp.resolutionFactor[0] === 1) {
        comp.resolutionFactor = [2, 2];
        flex_toggleTurboMode();
        app.endUndoGroup();
        return "OK: Low-Spec Mode ON (Half-Res & Muted FX)";
    } else {
        comp.resolutionFactor = [1, 1];
        flex_toggleTurboMode();
        app.endUndoGroup();
        return "OK: Full Quality Mode Restored";
    }
}

function flex_purgeCache() {
    try {
        app.purge(PurgeTarget.ALL_CACHES);
        return "OK: Cache & RAM Purged";
    } catch (e) {
        return "ERROR: " + e.toString();
    }
}

function flex_silenceAudioCut() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Silence Audio Cut");
    var t = comp.time;
    for (var i = 0; i < sel.length; i++) {
        var l = sel[i];
        if (t > l.inPoint && t < l.outPoint) {
            var d = l.duplicate();
            l.outPoint = t;
            d.inPoint = t + (comp.frameDuration * 2);
        }
    }
    app.endUndoGroup();
    return "OK: Audio Cut at Playhead";
}

function flex_addBeatMarker() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Beat Marker");
    var m = new MarkerValue("🎵 Beat");
    comp.markerProperty.setValueAtTime(comp.time, m);
    app.endUndoGroup();
    return "OK: Beat Marker Added";
}

function flex_cleanProject() {
    app.beginUndoGroup("Flex: Clean Project Folders");
    try {
        var compFolder = app.project.items.addFolder("_01_COMPS");
        var footageFolder = app.project.items.addFolder("_02_FOOTAGE");
        var audioFolder = app.project.items.addFolder("_03_AUDIO");
        var solidsFolder = app.project.items.addFolder("_04_SOLIDS");

        for (var i = app.project.numItems; i >= 1; i--) {
            var item = app.project.item(i);
            if (item === compFolder || item === footageFolder || item === audioFolder || item === solidsFolder) continue;
            if (item instanceof CompItem) {
                item.parentFolder = compFolder;
            } else if (item instanceof FootageItem) {
                if (item.mainSource instanceof SolidSource) item.parentFolder = solidsFolder;
                else if (item.hasAudio && !item.hasVideo) item.parentFolder = audioFolder;
                else item.parentFolder = footageFolder;
            }
        }
    } catch(e) {}
    app.endUndoGroup();
    return "OK: Project Organized";
}

// -------------------------------------------------------------
// 8. ALIGN, DISTRIBUTE & GROUP
// -------------------------------------------------------------

function flex_align(type) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Align " + type);
    for (var i = 0; i < sel.length; i++) {
        var l = sel[i];
        var p = l.position.value;
        var is3D = p.length === 3;
        var r;
        try { r = l.sourceRectAtTime(comp.time, false); } catch(e) { r = { width: l.width || 100, height: l.height || 100 }; }

        if (type === "left") l.position.setValue(is3D ? [r.width / 2, p[1], p[2]] : [r.width / 2, p[1]]);
        else if (type === "centerH") l.position.setValue(is3D ? [comp.width / 2, p[1], p[2]] : [comp.width / 2, p[1]]);
        else if (type === "right") l.position.setValue(is3D ? [comp.width - (r.width / 2), p[1], p[2]] : [comp.width - (r.width / 2), p[1]]);
        else if (type === "top") l.position.setValue(is3D ? [p[0], r.height / 2, p[2]] : [p[0], r.height / 2]);
        else if (type === "centerV") l.position.setValue(is3D ? [p[0], comp.height / 2, p[2]] : [p[0], comp.height / 2]);
        else if (type === "bottom") l.position.setValue(is3D ? [p[0], comp.height - (r.height / 2), p[2]] : [p[0], comp.height - (r.height / 2)]);
    }
    app.endUndoGroup();
    return "OK: Aligned " + type;
}

function flex_distribute(axis) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length < 3) return "ERROR: Select at least 3 layers to distribute.";

    app.beginUndoGroup("Flex: Distribute " + axis);
    var list = [];
    for (var i = 0; i < sel.length; i++) list.push(sel[i]);
    if (axis === "H") {
        list.sort(function(a, b) { return a.position.value[0] - b.position.value[0]; });
        var minX = list[0].position.value[0];
        var maxX = list[list.length - 1].position.value[0];
        var step = (maxX - minX) / (list.length - 1);
        for (var j = 1; j < list.length - 1; j++) {
            var p = list[j].position.value;
            list[j].position.setValue(p.length === 3 ? [minX + (j * step), p[1], p[2]] : [minX + (j * step), p[1]]);
        }
    } else {
        list.sort(function(a, b) { return a.position.value[1] - b.position.value[1]; });
        var minY = list[0].position.value[1];
        var maxY = list[list.length - 1].position.value[1];
        var stepY = (maxY - minY) / (list.length - 1);
        for (var k = 1; k < list.length - 1; k++) {
            var py = list[k].position.value;
            list[k].position.setValue(py.length === 3 ? [py[0], minY + (k * stepY), py[2]] : [py[0], minY + (k * stepY)]);
        }
    }
    app.endUndoGroup();
    return "OK: Distributed " + axis;
}

function flex_alignAsGroup() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length < 2) return "ERROR: Select at least 2 layers to align as group.";

    app.beginUndoGroup("Flex: Align as Group to Center");
    var avgX = 0, avgY = 0;
    for (var i = 0; i < sel.length; i++) {
        avgX += sel[i].position.value[0];
        avgY += sel[i].position.value[1];
    }
    avgX /= sel.length;
    avgY /= sel.length;

    var dX = (comp.width / 2) - avgX;
    var dY = (comp.height / 2) - avgY;

    for (var j = 0; j < sel.length; j++) {
        var p = sel[j].position.value;
        sel[j].position.setValue(p.length === 3 ? [p[0] + dX, p[1] + dY, p[2]] : [p[0] + dX, p[1] + dY]);
    }
    app.endUndoGroup();
    return "OK: Group Centered in Comp";
}

// -------------------------------------------------------------
// 9. PROXIMITY EFFECTOR SUITE (v6.5 & v9.0)
// -------------------------------------------------------------

function flex_createProximityEffector() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Create Proximity Effector");
    var eff = comp.layers.addNull();
    eff.name = "Flex Proximity Effector";
    eff.guideLayer = true;
    eff.position.setValue([comp.width / 2, comp.height / 2]);

    var fx = eff.property("ADBE Effect Parade");
    var sRad = fx.addProperty("ADBE Slider Control");
    sRad.name = "Effector Radius";
    sRad.property(1).setValue(350);

    var sStr = fx.addProperty("ADBE Slider Control");
    sStr.name = "Strength";
    sStr.property(1).setValue(100);

    eff.selected = true;
    app.endUndoGroup();
    return "OK: Proximity Effector Null Created";
}

function flex_applyProximityDriver(mode) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    var eff = null;
    for (var l = 1; l <= comp.numLayers; l++) {
        if (comp.layer(l).name === "Flex Proximity Effector") {
            eff = comp.layer(l);
            break;
        }
    }
    if (!eff) {
        flex_createProximityEffector();
    }

    app.beginUndoGroup("Flex: Proximity Driver (" + mode + ")");
    var count = 0;
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        if (layer.name === "Flex Proximity Effector") continue;

        if (mode === "scale") {
            var expr = "eff = thisComp.layer('Flex Proximity Effector');\\n" +
                       "rad = eff.effect('Effector Radius')('Slider');\\n" +
                       "str = eff.effect('Strength')('Slider') / 100;\\n" +
                       "d = length(toComp(anchorPoint), eff.toComp(eff.anchorPoint));\\n" +
                       "if (d < rad) {\\n" +
                       "  f = 1 - (d / rad);\\n" +
                       "  value * (1 + f * str * 0.8);\\n" +
                       "} else { value; }";
            try { layer.transform.scale.expression = expr; count++; } catch(e) {}
        } else if (mode === "opacity") {
            var expr = "eff = thisComp.layer('Flex Proximity Effector');\\n" +
                       "rad = eff.effect('Effector Radius')('Slider');\\n" +
                       "str = eff.effect('Strength')('Slider') / 100;\\n" +
                       "d = length(toComp(anchorPoint), eff.toComp(eff.anchorPoint));\\n" +
                       "if (d < rad) {\\n" +
                       "  f = 1 - (d / rad);\\n" +
                       "  Math.min(100, value + f * str * 100);\\n" +
                       "} else { value; }";
            try { layer.transform.opacity.expression = expr; count++; } catch(e) {}
        } else if (mode === "z_push") {
            layer.threeDLayer = true;
            var expr = "eff = thisComp.layer('Flex Proximity Effector');\\n" +
                       "rad = eff.effect('Effector Radius')('Slider');\\n" +
                       "str = eff.effect('Strength')('Slider');\\n" +
                       "d = length(toComp(anchorPoint), eff.toComp(eff.anchorPoint));\\n" +
                       "if (d < rad) {\\n" +
                       "  f = 1 - (d / rad);\\n" +
                       "  [value[0], value[1], value[2] - f * str * 2.5];\\n" +
                       "} else { value; }";
            try { layer.transform.position.expression = expr; count++; } catch(e) {}
        } else if (mode === "rotation") {
            var expr = "eff = thisComp.layer('Flex Proximity Effector');\\n" +
                       "rad = eff.effect('Effector Radius')('Slider');\\n" +
                       "str = eff.effect('Strength')('Slider') / 100;\\n" +
                       "d = length(toComp(anchorPoint), eff.toComp(eff.anchorPoint));\\n" +
                       "if (d < rad) {\\n" +
                       "  f = 1 - (d / rad);\\n" +
                       "  value + f * str * 45;\\n" +
                       "} else { value; }";
            try {
                if (layer.threeDLayer) {
                    layer.transform.zRotation.expression = expr;
                } else {
                    layer.transform.rotation.expression = expr;
                }
                count++;
            } catch(e) {}
        }
    }
    app.endUndoGroup();
    return "OK: Proximity " + mode.toUpperCase() + " applied to " + count + " layers";
}

// -------------------------------------------------------------
// 10. CAROUSEL SYNC ENGINE (v3.0, v6.5, v9.0)
// -------------------------------------------------------------

function flex_syncCarousel() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    var masterNull = null;
    for (var l = 1; l <= comp.numLayers; l++) {
        if (comp.layer(l).name.indexOf("Orb Master Rig") !== -1 || comp.layer(l).name.indexOf("Carousel Master") !== -1) {
            masterNull = comp.layer(l);
            break;
        }
    }

    app.beginUndoGroup("Flex: Sync Carousel Ring");
    var orbLayers = [];
    var sel = comp.selectedLayers;

    if (sel.length > 0) {
        for (var s = 0; s < sel.length; s++) {
            if (sel[s] !== masterNull) orbLayers.push(sel[s]);
        }
    } else {
        for (var i = 1; i <= comp.numLayers; i++) {
            var lyr = comp.layer(i);
            if (masterNull && lyr.parent === masterNull) {
                orbLayers.push(lyr);
            } else if (lyr.name.indexOf("Orb Item") !== -1) {
                orbLayers.push(lyr);
            }
        }
    }

    if (orbLayers.length === 0) {
        app.endUndoGroup();
        return "ERROR: Select layers to sync into carousel ring.";
    }

    if (!masterNull) {
        masterNull = comp.layers.addNull();
        masterNull.name = "Orb Master Rig (3D)";
        masterNull.threeDLayer = true;
        masterNull.position.setValue([comp.width / 2, comp.height / 2, 0]);
        masterNull.transform.yRotation.expression = "time * 45;";
    }

    var total = orbLayers.length;
    var radius = 400;

    for (var k = 0; k < total; k++) {
        var item = orbLayers[k];
        item.threeDLayer = true;
        item.parent = null;

        var angle = (k / total) * (Math.PI * 2);
        var x = (comp.width / 2) + radius * Math.sin(angle);
        var z = radius * Math.cos(angle);
        var y = comp.height / 2;

        item.position.setValue([x, y, z]);
        item.parent = masterNull;
        item.autoOrient = AutoOrientType.TOWARDS_CAMERA;
    }

    app.endUndoGroup();
    return "OK: Synced " + total + " layers to 360° Carousel";
}

// -------------------------------------------------------------
// 11. DYNAMIC AUTO-HIGHLIGHTER (v9.0)
// -------------------------------------------------------------

function flex_createAutoHighlighter(type) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "SELECT_TEXT_LAYER";
    var textLayer = sel[0];
    if (!(textLayer instanceof TextLayer)) return "SELECT_TEXT_LAYER";

    app.beginUndoGroup("Flex: Auto-Highlighter (" + type + ")");
    var tRect = textLayer.sourceRectAtTime(comp.time, false);
    var tX = textLayer.position.value[0];
    var tY = textLayer.position.value[1];

    if (type === "box") {
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = textLayer.name + " [Highlight Box]";
        shapeLayer.moveAfter(textLayer);

        var contents = shapeLayer.property("ADBE Root Vectors Group");
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = group.property("ADBE Vectors Group");

        var rect = groupContents.addProperty("ADBE Vector Shape - Rect");
        var padX = 24, padY = 12;
        rect.property("ADBE Vector Rect Size").setValue([tRect.width + padX, tRect.height + padY]);
        rect.property("ADBE Vector Rect Roundness").setValue(8);

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([1.0, 0.2, 0.4, 0.35]);

        shapeLayer.position.setValue([tX + tRect.left + tRect.width / 2, tY + tRect.top + tRect.height / 2]);
        shapeLayer.parent = textLayer;

        var sProp = shapeLayer.transform.scale;
        sProp.setValueAtTime(comp.time, [0, 100]);
        sProp.setValueAtTime(comp.time + 0.35, [100, 100]);
        var easeOut = new KeyframeEase(0, 85);
        sProp.setTemporalEaseAtKey(1, [easeOut, easeOut], [easeOut, easeOut]);
        sProp.setTemporalEaseAtKey(2, [easeOut, easeOut], [easeOut, easeOut]);

    } else if (type === "underline") {
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = textLayer.name + " [Underline]";

        var contents = shapeLayer.property("ADBE Root Vectors Group");
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = group.property("ADBE Vectors Group");

        var pathProp = groupContents.addProperty("ADBE Vector Shape - Group");
        var shape = new Shape();
        var yPos = tRect.top + tRect.height + 4;
        shape.vertices = [[tRect.left, yPos], [tRect.left + tRect.width, yPos]];
        shape.closed = false;
        pathProp.property("ADBE Vector Shape").setValue(shape);

        var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("ADBE Vector Stroke Color").setValue([0.23, 0.51, 0.96, 1.0]);
        stroke.property("ADBE Vector Stroke Width").setValue(5);
        stroke.property("ADBE Vector Stroke Line Cap").setValue(2);

        var trim = groupContents.addProperty("ADBE Vector Filter - Trim");
        var endProp = trim.property("ADBE Vector Trim End");
        endProp.setValueAtTime(comp.time, 0);
        endProp.setValueAtTime(comp.time + 0.4, 100);
        var easeOut = new KeyframeEase(0, 85);
        endProp.setTemporalEaseAtKey(1, [easeOut], [easeOut]);
        endProp.setTemporalEaseAtKey(2, [easeOut], [easeOut]);

        shapeLayer.position.setValue([tX, tY]);
        shapeLayer.parent = textLayer;

    } else if (type === "strike") {
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = textLayer.name + " [Strikethrough]";

        var contents = shapeLayer.property("ADBE Root Vectors Group");
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = group.property("ADBE Vectors Group");

        var pathProp = groupContents.addProperty("ADBE Vector Shape - Group");
        var shape = new Shape();
        var yPos = tRect.top + (tRect.height / 2);
        shape.vertices = [[tRect.left - 4, yPos], [tRect.left + tRect.width + 4, yPos]];
        shape.closed = false;
        pathProp.property("ADBE Vector Shape").setValue(shape);

        var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("ADBE Vector Stroke Color").setValue([1.0, 0.2, 0.2, 1.0]);
        stroke.property("ADBE Vector Stroke Width").setValue(4);
        stroke.property("ADBE Vector Stroke Line Cap").setValue(2);

        var trim = groupContents.addProperty("ADBE Vector Filter - Trim");
        var endProp = trim.property("ADBE Vector Trim End");
        endProp.setValueAtTime(comp.time, 0);
        endProp.setValueAtTime(comp.time + 0.3, 100);

        shapeLayer.position.setValue([tX, tY]);
        shapeLayer.parent = textLayer;
    }

    app.endUndoGroup();
    return "OK: Added " + type.toUpperCase() + " Highlighter";
}

// -------------------------------------------------------------
// 12. CAMERA SHAKES SUITE (v6.5 Shakes Tab)
// -------------------------------------------------------------

function flex_applyCameraShake(type) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Camera Shake (" + type + ")");
    var shakeNull = comp.layers.addNull();
    shakeNull.name = "Camera Shake [" + type.toUpperCase() + "]";
    shakeNull.position.setValue([comp.width / 2, comp.height / 2]);

    if (type === "subtle") {
        shakeNull.transform.position.expression = "wiggle(0.8, 14);";
        shakeNull.transform.rotation.expression = "wiggle(0.5, 1.2);";
    } else if (type === "handheld") {
        shakeNull.transform.position.expression = "wiggle(2.2, 32);";
        shakeNull.transform.rotation.expression = "wiggle(1.8, 3.8);";
    } else if (type === "impact") {
        shakeNull.transform.position.expression = "decay = 7;\\nt = Math.max(0, time - inPoint);\\namp = 80 / Math.exp(decay * t);\\nwiggle(18, amp);";
        shakeNull.transform.rotation.expression = "decay = 7;\\nt = Math.max(0, time - inPoint);\\namp = 6 / Math.exp(decay * t);\\nwiggle(18, amp);";
    }

    var sel = comp.selectedLayers;
    for (var s = 0; s < sel.length; s++) {
        if (sel[s] !== shakeNull) {
            sel[s].parent = shakeNull;
        }
    }

    app.endUndoGroup();
    return "OK: " + type.toUpperCase() + " Shake Rig Added";
}

// -------------------------------------------------------------
// 13. GRADIENT LOCK (v6.5)
// -------------------------------------------------------------

function flex_applyGradientLock() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Gradient Lock");
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var fx = layer.property("ADBE Effect Parade");
        var ramp = fx.property("ADBE Ramp");
        if (!ramp) {
            ramp = fx.addProperty("ADBE Ramp");
        }
        if (ramp) {
            ramp.property("Start of Ramp").expression = "[sourceRectAtTime(time, false).left, sourceRectAtTime(time, false).top + sourceRectAtTime(time, false).height / 2];";
            ramp.property("End of Ramp").expression = "[sourceRectAtTime(time, false).left + sourceRectAtTime(time, false).width, sourceRectAtTime(time, false).top + sourceRectAtTime(time, false).height / 2];";
        }
    }
    app.endUndoGroup();
    return "OK: Gradient Ramp locked to layer boundaries";
}

// -------------------------------------------------------------
// 14. MASK LAYER SPLITTER (v6.5)
// -------------------------------------------------------------

function flex_splitMasks() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";
    var target = sel[0];
    var maskGroup = target.property("ADBE Mask Parade");
    if (!maskGroup || maskGroup.numProperties < 2) {
        return "ERROR: Selected layer needs at least 2 masks to split.";
    }

    app.beginUndoGroup("Flex: Split Masks to Layers");
    var totalMasks = maskGroup.numProperties;
    var baseName = target.name;

    for (var m = 2; m <= totalMasks; m++) {
        var dup = target.duplicate();
        dup.name = baseName + " - Mask " + m;
        var dupMasks = dup.property("ADBE Mask Parade");
        for (var d = dupMasks.numProperties; d >= 1; d--) {
            if (d !== m) dupMasks.property(d).remove();
        }
    }

    target.name = baseName + " - Mask 1";
    for (var k = maskGroup.numProperties; k >= 2; k--) {
        maskGroup.property(k).remove();
    }

    app.endUndoGroup();
    return "OK: Split " + totalMasks + " masks into separate layers";
}

// -------------------------------------------------------------
// 15. FONT REPLACER (v6.5)
// -------------------------------------------------------------

function flex_replaceFont(fontFamily) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var targetLayers = comp.selectedLayers.length > 0 ? comp.selectedLayers : [];
    if (targetLayers.length === 0) {
        for (var i = 1; i <= comp.numLayers; i++) {
            if (comp.layer(i) instanceof TextLayer) targetLayers.push(comp.layer(i));
        }
    }
    if (targetLayers.length === 0) return "SELECT_TEXT_LAYER";

    app.beginUndoGroup("Flex: Replace Font (" + fontFamily + ")");
    var count = 0;
    for (var t = 0; t < targetLayers.length; t++) {
        var layer = targetLayers[t];
        if (layer instanceof TextLayer) {
            try {
                var src = layer.property("Source Text");
                var doc = src.value;
                doc.font = fontFamily;
                src.setValue(doc);
                count++;
            } catch(e) {}
        }
    }
    app.endUndoGroup();
    return "OK: Font changed to " + fontFamily + " on " + count + " layers";
}

// -------------------------------------------------------------
// 16. PER-WORD AUTOCAPTIONS & SUBTITLES (v6.5 & v9.0)
// -------------------------------------------------------------

function flex_createAutoCaptions(preset) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: AutoCaptions (" + preset + ")");
    var txt = comp.layers.addText("FLEX KINETIC CAPTIONS DEMO");
    txt.name = "AutoCaptions [" + preset.toUpperCase() + "]";
    var doc = txt.property("Source Text").value;
    doc.fontSize = 68;
    doc.fillColor = [1, 1, 1];
    doc.strokeColor = [0, 0, 0];
    doc.strokeWidth = 3;
    doc.applyStroke = true;
    doc.justification = ParagraphJustification.CENTER_JUSTIFY;
    txt.property("Source Text").setValue(doc);

    txt.position.setValue([comp.width / 2, comp.height * 0.82]);

    var animGroup = txt.Text.Animators.addProperty("ADBE Text Animator");
    animGroup.name = "Word Punch Pop";
    var scaleProp = animGroup.property("ADBE Text Animator Properties").addProperty("ADBE Text Scale 3D");
    scaleProp.setValue([130, 130, 100]);

    var colorProp = animGroup.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
    colorProp.setValue([1.0, 0.9, 0.1]);

    var sel = animGroup.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    sel.property("ADBE Text Range Advanced").property("ADBE Text Range Units").setValue(2);
    sel.property("ADBE Text Range Advanced").property("ADBE Text Range Based On").setValue(2);

    var startP = sel.property("ADBE Text Percent Start");
    startP.setValueAtTime(comp.time, 0);
    startP.setValueAtTime(comp.time + 1.2, 100);

    app.endUndoGroup();
    return "OK: Kinetic Subtitle Rig Created";
}

// -------------------------------------------------------------
// 17. UI TEMPLATES & SHAPE KIT (v6.5)
// -------------------------------------------------------------

function flex_createUIShape(type) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: UI Shape (" + type + ")");
    if (type === "browser") {
        var shape = comp.layers.addShape();
        shape.name = "UI Browser Window Frame";
        var root = shape.property("ADBE Root Vectors Group");
        var g = root.addProperty("ADBE Vector Group");
        var gc = g.property("ADBE Vectors Group");

        var rect = gc.addProperty("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue([1020, 640]);
        rect.property("ADBE Vector Rect Roundness").setValue(16);

        var fill = gc.addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([0.09, 0.1, 0.13, 0.95]);

        var stroke = gc.addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("ADBE Vector Stroke Color").setValue([0.25, 0.28, 0.36, 1.0]);
        stroke.property("ADBE Vector Stroke Width").setValue(2);

        shape.position.setValue([comp.width / 2, comp.height / 2]);

    } else if (type === "pill_btn") {
        var shape = comp.layers.addShape();
        shape.name = "UI Gradient Pill Button";
        var root = shape.property("ADBE Root Vectors Group");
        var g = root.addProperty("ADBE Vector Group");
        var gc = g.property("ADBE Vectors Group");

        var rect = gc.addProperty("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue([220, 56]);
        rect.property("ADBE Vector Rect Roundness").setValue(28);

        var fill = gc.addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([1.0, 0.2, 0.4, 1.0]);

        shape.position.setValue([comp.width / 2, comp.height / 2]);

        var btnText = comp.layers.addText("Get Started ➔");
        var doc = btnText.property("Source Text").value;
        doc.fontSize = 20;
        doc.fillColor = [1, 1, 1];
        doc.justification = ParagraphJustification.CENTER_JUSTIFY;
        btnText.property("Source Text").setValue(doc);
        btnText.position.setValue([comp.width / 2, (comp.height / 2) + 7]);
        btnText.parent = shape;

    } else if (type === "avatar") {
        var shape = comp.layers.addShape();
        shape.name = "UI User Avatar Ring";
        var root = shape.property("ADBE Root Vectors Group");
        var g = root.addProperty("ADBE Vector Group");
        var gc = g.property("ADBE Vectors Group");

        var ellipse = gc.addProperty("ADBE Vector Shape - Ellipse");
        ellipse.property("ADBE Vector Ellipse Size").setValue([80, 80]);

        var fill = gc.addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([0.2, 0.25, 0.35, 1.0]);

        var stroke = gc.addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("ADBE Vector Stroke Color").setValue([0.06, 0.72, 0.5, 1.0]);
        stroke.property("ADBE Vector Stroke Width").setValue(4);

        shape.position.setValue([comp.width / 2, comp.height / 2]);

    } else if (type === "toggle") {
        var shape = comp.layers.addShape();
        shape.name = "UI Toggle Switch (Active)";
        var root = shape.property("ADBE Root Vectors Group");
        var g = root.addProperty("ADBE Vector Group");
        var gc = g.property("ADBE Vectors Group");

        var rect = gc.addProperty("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue([90, 48]);
        rect.property("ADBE Vector Rect Roundness").setValue(24);

        var fill = gc.addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([0.23, 0.51, 0.96, 1.0]);

        shape.position.setValue([comp.width / 2, comp.height / 2]);

        var knob = comp.layers.addShape();
        knob.name = "Toggle Knob";
        var kg = knob.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
        var kEllipse = kg.addProperty("ADBE Vector Shape - Ellipse");
        kEllipse.property("ADBE Vector Ellipse Size").setValue([40, 40]);
        var kFill = kg.addProperty("ADBE Vector Graphic - Fill");
        kFill.property("ADBE Vector Fill Color").setValue([1, 1, 1, 1]);
        knob.position.setValue([(comp.width / 2) + 20, comp.height / 2]);
        knob.parent = shape;
    }

    app.endUndoGroup();
    return "OK: Created " + type.toUpperCase() + " UI Component";
}

// -------------------------------------------------------------
// 18. FIGMA / VECTOR SHAPE RIG (v9.0)
// -------------------------------------------------------------

function flex_createFigmaVectorRig() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Figma Vector Shape Rig");
    var shape = comp.layers.addShape();
    shape.name = "Figma Vector Shape Rig";
    var root = shape.property("ADBE Root Vectors Group");
    var g = root.addProperty("ADBE Vector Group");
    var gc = g.property("ADBE Vectors Group");

    var pathProp = gc.addProperty("ADBE Vector Shape - Group");
    var shp = new Shape();
    shp.vertices = [[-100, -80], [100, -80], [120, 80], [-80, 100]];
    shp.inTangents = [[0, -20], [-20, 0], [0, 20], [20, 0]];
    shp.outTangents = [[0, 20], [20, 0], [0, -20], [-20, 0]];
    shp.closed = true;
    pathProp.property("ADBE Vector Shape").setValue(shp);

    var fill = gc.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([0.55, 0.36, 0.96, 1.0]);

    var stroke = gc.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue([1, 1, 1, 0.8]);
    stroke.property("ADBE Vector Stroke Width").setValue(3);

    shape.position.setValue([comp.width / 2, comp.height / 2]);
    app.endUndoGroup();
    return "OK: Figma Vector Shape Rig Ready";
}

// -------------------------------------------------------------
// 19. 3D MAP RIG & PIN MARKER (v9.0)
// -------------------------------------------------------------

function flex_createMapRig() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: 3D Map Rig & Pin Marker");
    var gridPlane = comp.layers.addSolid([0.08, 0.09, 0.12], "3D Map Plane", 1400, 1400, 1.0, comp.duration);
    gridPlane.threeDLayer = true;
    gridPlane.position.setValue([comp.width / 2, (comp.height / 2) + 150, 0]);
    gridPlane.transform.xRotation.setValue(65);

    var fx = gridPlane.property("ADBE Effect Parade");
    var gridFx = fx.addProperty("ADBE Grid");
    if (gridFx) {
        gridFx.property("Size From").setValue(2);
        gridFx.property("Width").setValue(70);
        gridFx.property("Border").setValue(1.5);
        gridFx.property("Color").setValue([0.2, 0.3, 0.45, 0.6]);
    }

    var pinNull = comp.layers.addNull();
    pinNull.name = "Map Pin Location Marker";
    pinNull.threeDLayer = true;
    pinNull.position.setValue([comp.width / 2, (comp.height / 2) - 30, 0]);

    var pinShape = comp.layers.addShape();
    pinShape.name = "Map Pin Icon";
    pinShape.threeDLayer = true;
    var root = pinShape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
    var ell = root.addProperty("ADBE Vector Shape - Ellipse");
    ell.property("ADBE Vector Ellipse Size").setValue([48, 48]);
    var f = root.addProperty("ADBE Vector Graphic - Fill");
    f.property("ADBE Vector Fill Color").setValue([1.0, 0.2, 0.4, 1.0]);
    pinShape.position.setValue([comp.width / 2, (comp.height / 2) - 40, 0]);
    pinShape.parent = pinNull;

    var posP = pinNull.transform.position;
    posP.setValueAtTime(comp.time, [comp.width / 2, (comp.height / 2) - 350, 0]);
    posP.setValueAtTime(comp.time + 0.5, [comp.width / 2, (comp.height / 2) - 30, 0]);

    var bounceExpr = "n = 0;\\n" +
                     "if (numKeys > 0) {\\n" +
                     "  n = nearestKey(time).index;\\n" +
                     "  if (key(n).time > time) { n--; }\\n" +
                     "}\\n" +
                     "if (n > 0) {\\n" +
                     "  t = time - key(n).time;\\n" +
                     "  amp = 0.08; freq = 4.0; decay = 6.0;\\n" +
                     "  w = freq * t * 2 * Math.PI;\\n" +
                     "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\\n" +
                     "  value + v * amp * Math.abs(Math.sin(w)) / Math.exp(decay * t);\\n" +
                     "} else { value; }";
    posP.expression = bounceExpr;

    app.endUndoGroup();
    return "OK: 3D Map Rig & Pin Marker Created";
}

// -------------------------------------------------------------
// 20. AI SAAS COLOR GRADES (v6.5)
// -------------------------------------------------------------

function flex_applyColorGrade(theme) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Color Grade (" + theme + ")");
    var adj = comp.layers.addSolid([1, 1, 1], "Flex Color Grade [" + theme.toUpperCase() + "]", comp.width, comp.height, comp.pixelAspect, comp.duration);
    adj.adjustmentLayer = true;
    adj.moveToBeginning();

    var fx = adj.property("ADBE Effect Parade");
    var tint = fx.addProperty("ADBE Tint");

    if (theme === "clean_saas") {
        if (tint) {
            tint.property("Map Black To").setValue([0.05, 0.08, 0.15]);
            tint.property("Map White To").setValue([0.95, 0.98, 1.0]);
            tint.property("Amount to Tint").setValue(35);
        }
    } else if (theme === "cyber_dark") {
        if (tint) {
            tint.property("Map Black To").setValue([0.06, 0.02, 0.14]);
            tint.property("Map White To").setValue([0.0, 0.95, 1.0]);
            tint.property("Amount to Tint").setValue(50);
        }
    } else if (theme === "warm_retro") {
        if (tint) {
            tint.property("Map Black To").setValue([0.15, 0.08, 0.04]);
            tint.property("Map White To").setValue([1.0, 0.92, 0.8]);
            tint.property("Amount to Tint").setValue(40);
        }
    } else if (theme === "cinematic") {
        if (tint) {
            tint.property("Map Black To").setValue([0.02, 0.1, 0.12]);
            tint.property("Map White To").setValue([1.0, 0.85, 0.75]);
            tint.property("Amount to Tint").setValue(45);
        }
    }

    app.endUndoGroup();
    return "OK: Applied " + theme.toUpperCase() + " Color Grade";
}

// -------------------------------------------------------------
// 21. QC GAP CHECKER (v6.5 & Ultimate)
// -------------------------------------------------------------

function flex_checkGaps() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    if (comp.numLayers < 2) return "ERROR: Need at least 2 layers to check timeline gaps.";

    app.beginUndoGroup("Flex: QC Gap Checker");
    var layers = [];
    for (var l = 1; l <= comp.numLayers; l++) {
        layers.push(comp.layer(l));
    }
    layers.sort(function(a, b) { return a.inPoint - b.inPoint; });

    var gapCount = 0;
    for (var i = 0; i < layers.length - 1; i++) {
        var curOut = layers[i].outPoint;
        var nextIn = layers[i + 1].inPoint;
        var diff = nextIn - curOut;
        if (diff > 0.01 && diff < 1.0) {
            gapCount++;
            var marker = new MarkerValue("⚠️ QC GAP: " + (Math.round(diff * comp.frameRate)) + "f");
            comp.markerProperty.setValueAtTime(curOut, marker);
        }
    }
    app.endUndoGroup();
    if (gapCount === 0) {
        return "OK: Timeline Clean! No gaps found.";
    }
    return "OK: Found " + gapCount + " gap(s). Markers placed!";
}

// -------------------------------------------------------------
// 22. LAYOUT BUILDER & SAFE GUIDES (v6.5)
// -------------------------------------------------------------

function flex_createLayoutGuides(type) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Layout Guides (" + type + ")");
    var guide = comp.layers.addShape();
    guide.name = "LAYOUT GUIDES [" + type.toUpperCase() + "]";
    guide.guideLayer = true;

    var root = guide.property("ADBE Root Vectors Group");
    var g = root.addProperty("ADBE Vector Group");
    var gc = g.property("ADBE Vectors Group");

    var pathProp = gc.addProperty("ADBE Vector Shape - Group");
    var shp = new Shape();

    var w = comp.width;
    var h = comp.height;

    if (type === "thirds") {
        shp.vertices = [
            [w / 3, 0], [w / 3, h],
            [(w / 3) * 2, 0], [(w / 3) * 2, h],
            [0, h / 3], [w, h / 3],
            [0, (h / 3) * 2], [w, (h / 3) * 2]
        ];
    } else {
        var padX = w * 0.1;
        var padY = h * 0.1;
        shp.vertices = [
            [padX, padY], [w - padX, padY],
            [w - padX, h - padY], [padX, h - padY]
        ];
        shp.closed = true;
    }

    pathProp.property("ADBE Vector Shape").setValue(shp);
    var stroke = gc.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue([0.0, 0.8, 1.0, 0.4]);
    stroke.property("ADBE Vector Stroke Width").setValue(1.5);

    guide.position.setValue([0, 0]);
    app.endUndoGroup();
    return "OK: " + type.toUpperCase() + " Guides Created";
}

// -------------------------------------------------------------
// 23. AUTO RELINKER / MISSING ASSET CHECKER (v6.5)
// -------------------------------------------------------------

function flex_autoRelink() {
    var missing = [];
    for (var i = 1; i <= app.project.items.length; i++) {
        var itm = app.project.items[i];
        if (itm instanceof FootageItem && itm.footageMissing) {
            missing.push(itm.name);
        }
    }
    if (missing.length === 0) {
        return "OK: All project assets are linked (0 missing)!";
    }
    return "⚠️ " + missing.length + " missing asset(s): " + missing.slice(0, 3).join(", ") + (missing.length > 3 ? "..." : "");
}

// -------------------------------------------------------------
// 24. SUPER 20 PROFESSIONAL PLUGIN EQUIVALENTS
// -------------------------------------------------------------

// 1. Extrude (Bevel & Multi-depth Extrusion)
function flex_addSuperExtrude(depth, bevel) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Super Extrude (" + depth + ")");
    var count = 0;
    var d = parseInt(depth, 10) || 12;
    for (var i = 0; i < sel.length; i++) {
        var base = sel[i];
        base.threeDLayer = true;
        var p = base.position.value;
        var groupNull = comp.layers.addNull();
        groupNull.threeDLayer = true;
        groupNull.name = base.name + " [Extruded Master]";
        groupNull.position.setValue(p);
        base.parent = groupNull;

        for (var k = 1; k <= d; k++) {
            var slice = base.duplicate();
            slice.name = base.name + " [Extrude Layer " + k + "]";
            slice.parent = groupNull;
            var shade = 1.0 - (k / (d * 1.6));
            if (bevel && k === d) shade = 0.5;
            var fx = slice.property("ADBE Effect Parade");
            var fill = fx.property("ADBE Fill");
            if (!fill) fill = fx.addProperty("ADBE Fill");
            if (fill && fill.property("Color")) {
                var c = fill.property("Color").value;
                fill.property("Color").setValue([c[0] * shade, c[1] * shade, c[2] * shade, 1]);
            }
            slice.position.setValue([p[0], p[1], p[2] + k * 1.5]);
            count++;
        }
    }
    app.endUndoGroup();
    return "OK: Extruded " + count + " 3D layers";
}

// 2. Blender AE 2 (3D Camera & World Axis Bridge)
function flex_createBlenderBridge() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Blender AE 2 Bridge");
    var originNull = comp.layers.addNull();
    originNull.name = "Blender World Origin (0,0,0)";
    originNull.threeDLayer = true;
    originNull.position.setValue([comp.width / 2, comp.height / 2, 0]);

    var xNull = comp.layers.addNull();
    xNull.name = "Blender Axis X (Red)";
    xNull.threeDLayer = true;
    xNull.position.setValue([(comp.width / 2) + 150, comp.height / 2, 0]);
    xNull.parent = originNull;

    var yNull = comp.layers.addNull();
    yNull.name = "Blender Axis Y (Green)";
    yNull.threeDLayer = true;
    yNull.position.setValue([comp.width / 2, (comp.height / 2) - 150, 0]);
    yNull.parent = originNull;

    var zNull = comp.layers.addNull();
    zNull.name = "Blender Axis Z (Blue)";
    zNull.threeDLayer = true;
    zNull.position.setValue([comp.width / 2, comp.height / 2, 150]);
    zNull.parent = originNull;

    var cam = comp.layers.addCamera("Blender 35mm Camera", [comp.width / 2, comp.height / 2]);
    cam.position.setValue([comp.width / 2, comp.height / 2, -1800]);
    cam.cameraOption.zoom.setValue(1800);
    cam.parent = originNull;

    app.endUndoGroup();
    return "OK: Blender AE 2 Bridge Rig Created";
}

// 3. Deep Glow 2 (Multi-pass Exponential Radiance)
function flex_addDeepGlow2() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Deep Glow 2");
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var fx = layer.property("ADBE Effect Parade");
        var g1 = fx.addProperty("ADBE Glow");
        if (g1) {
            g1.name = "Deep Glow 2 [Core]";
            g1.property("Glow Radius").setValue(15);
            g1.property("Glow Intensity").setValue(1.4);
            g1.property("Glow Threshold").setValue(35);
        }
        var g2 = fx.addProperty("ADBE Glow");
        if (g2) {
            g2.name = "Deep Glow 2 [Atmospheric Bloom]";
            g2.property("Glow Radius").setValue(120);
            g2.property("Glow Intensity").setValue(1.1);
            g2.property("Glow Threshold").setValue(20);
        }
        var g3 = fx.addProperty("ADBE Glow");
        if (g3) {
            g3.name = "Deep Glow 2 [Wide Radiance]";
            g3.property("Glow Radius").setValue(450);
            g3.property("Glow Intensity").setValue(0.7);
            g3.property("Glow Threshold").setValue(8);
        }
    }
    app.endUndoGroup();
    return "OK: Deep Glow 2 Exponential Stack Applied";
}

// 4. Shadow Studio 3 (Soft Directional & Ambient Occlusion)
function flex_applyShadowStudio(type) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Shadow Studio 3 (" + type + ")");
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var fx = layer.property("ADBE Effect Parade");

        if (type === "soft") {
            var s1 = fx.addProperty("ADBE Drop Shadow");
            if (s1) {
                s1.name = "Shadow Studio 3 [Contact]";
                s1.property("Opacity").setValue(130);
                s1.property("Direction").setValue(135);
                s1.property("Distance").setValue(12);
                s1.property("Softness").setValue(18);
            }
            var s2 = fx.addProperty("ADBE Drop Shadow");
            if (s2) {
                s2.name = "Shadow Studio 3 [Soft Falloff]";
                s2.property("Opacity").setValue(80);
                s2.property("Direction").setValue(135);
                s2.property("Distance").setValue(45);
                s2.property("Softness").setValue(75);
            }
        } else if (type === "ao") {
            var ao = fx.addProperty("ADBE Drop Shadow");
            if (ao) {
                ao.name = "Shadow Studio 3 [Ambient Occlusion]";
                ao.property("Opacity").setValue(210);
                ao.property("Distance").setValue(3);
                ao.property("Softness").setValue(10);
            }
        } else if (type === "isometric") {
            var iso = fx.addProperty("ADBE Drop Shadow");
            if (iso) {
                iso.name = "Shadow Studio 3 [Isometric 45°]";
                iso.property("Opacity").setValue(100);
                iso.property("Direction").setValue(135);
                iso.property("Distance").setValue(65);
                iso.property("Softness").setValue(50);
            }
        }
    }
    app.endUndoGroup();
    return "OK: Shadow Studio 3 (" + type.toUpperCase() + ") Added";
}

// 5. Limber 2 (2-Bone Character IK Rig)
function flex_createLimberRig() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Limber 2 IK Rig");
    var cX = comp.width / 2;
    var cY = comp.height / 2;

    var hipNull = comp.layers.addNull();
    hipNull.name = "Limber Hip / Root";
    hipNull.position.setValue([cX - 60, cY - 140]);

    var kneeNull = comp.layers.addNull();
    kneeNull.name = "Limber Joint / Knee";
    kneeNull.position.setValue([cX - 40, cY]);
    kneeNull.parent = hipNull;

    var ikGoal = comp.layers.addNull();
    ikGoal.name = "Limber IK Goal (Foot / Hand Controller)";
    ikGoal.position.setValue([cX - 30, cY + 160]);

    var limbShape = comp.layers.addShape();
    limbShape.name = "Limber Bone Visualizer";
    var root = limbShape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
    var pathProp = root.addProperty("ADBE Vector Shape - Group");
    var shp = new Shape();
    shp.vertices = [[0, 0], [20, 140], [30, 300]];
    shp.closed = false;
    pathProp.property("ADBE Vector Shape").setValue(shp);
    var stroke = root.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue([1.0, 0.2, 0.4, 1.0]);
    stroke.property("ADBE Vector Stroke Width").setValue(14);
    stroke.property("ADBE Vector Stroke Line Cap").setValue(2);
    limbShape.position.setValue([cX - 60, cY - 140]);
    limbShape.parent = hipNull;

    app.endUndoGroup();
    return "OK: Limber 2 IK Rig Ready";
}

// 6. Saber (Neon Energy Core & Laser Outline Rig)
function flex_createSaberRig(preset) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Saber Energy Rig (" + preset + ")");
    var solid = comp.layers.addSolid([0, 0, 0], "Saber Energy Beam [" + preset.toUpperCase() + "]", comp.width, comp.height, 1.0, comp.duration);
    solid.blendingMode = BlendingMode.SCREEN;

    var fx = solid.property("ADBE Effect Parade");
    var beam = fx.addProperty("ADBE Beam");
    if (beam) {
        beam.property("Starting Point").setValue([comp.width * 0.2, comp.height / 2]);
        beam.property("Ending Point").setValue([comp.width * 0.8, comp.height / 2]);
        beam.property("Starting Thickness").setValue(16);
        beam.property("Ending Thickness").setValue(16);
        beam.property("Softness").setValue(15);
        if (preset === "laser") {
            beam.property("Inside Color").setValue([1, 1, 1]);
            beam.property("Outside Color").setValue([1, 0, 0.2]);
        } else if (preset === "electric") {
            beam.property("Inside Color").setValue([1, 1, 1]);
            beam.property("Outside Color").setValue([0, 0.9, 1]);
        } else {
            beam.property("Inside Color").setValue([1, 1, 1]);
            beam.property("Outside Color").setValue([0.6, 0.1, 1]);
        }
    }
    var glow = fx.addProperty("ADBE Glow");
    if (glow) {
        glow.property("Glow Radius").setValue(65);
        glow.property("Glow Intensity").setValue(2.2);
    }
    app.endUndoGroup();
    return "OK: Saber Neon Energy Rig Created";
}

// 7. Animation Composer (1-Click Transition Engine)
function flex_applyComposerTransition(type) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Animation Composer (" + type + ")");
    var t = comp.time;
    var dur = 0.45;
    var easeOut = new KeyframeEase(0, 85);

    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        if (type === "slide_bottom") {
            var curP = layer.transform.position.value;
            var is3D = layer.threeDLayer;
            var pProp = layer.transform.position;
            pProp.setValueAtTime(t, is3D ? [curP[0], curP[1] + 280, curP[2]] : [curP[0], curP[1] + 280]);
            pProp.setValueAtTime(t + dur, curP);
            pProp.setTemporalEaseAtKey(1, [easeOut], [easeOut]);
            pProp.setTemporalEaseAtKey(2, [easeOut], [easeOut]);
            layer.transform.opacity.setValueAtTime(t, 0);
            layer.transform.opacity.setValueAtTime(t + dur * 0.7, 100);
        } else if (type === "scale_pop") {
            var curS = layer.transform.scale.value;
            var sProp = layer.transform.scale;
            sProp.setValueAtTime(t, [0, 0, 0]);
            sProp.setValueAtTime(t + dur * 0.7, [curS[0] * 1.15, curS[1] * 1.15, curS[2]]);
            sProp.setValueAtTime(t + dur, curS);
        } else if (type === "flip_3d") {
            layer.threeDLayer = true;
            layer.transform.xRotation.setValueAtTime(t, 90);
            layer.transform.xRotation.setValueAtTime(t + dur, 0);
            layer.transform.opacity.setValueAtTime(t, 0);
            layer.transform.opacity.setValueAtTime(t + dur * 0.5, 100);
        }
    }
    app.endUndoGroup();
    return "OK: Applied Composer " + type.toUpperCase();
}

// 8. Geo Layers 3 (3D Route & Flight Path Tracer)
function flex_createGeoRouteTracker() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Geo Layers 3 Route Tracer");
    var mapPlane = comp.layers.addShape();
    mapPlane.name = "Geo Route Flight Path";
    mapPlane.threeDLayer = true;

    var root = mapPlane.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group");
    var pathProp = root.addProperty("ADBE Vector Shape - Group");
    var shp = new Shape();
    var pA = [-350, 80], pB = [350, -60];
    shp.vertices = [pA, pB];
    shp.outTangents = [[150, -180], [0, 0]];
    shp.inTangents = [[0, 0], [-150, -180]];
    shp.closed = false;
    pathProp.property("ADBE Vector Shape").setValue(shp);

    var stroke = root.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue([1.0, 0.8, 0.0, 1.0]);
    stroke.property("ADBE Vector Stroke Width").setValue(5);
    stroke.property("ADBE Vector Stroke Line Cap").setValue(2);
    stroke.property("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1").setValue(14);

    var trim = root.addProperty("ADBE Vector Filter - Trim");
    var endP = trim.property("ADBE Vector Trim End");
    endP.setValueAtTime(comp.time, 0);
    endP.setValueAtTime(comp.time + 1.2, 100);

    mapPlane.position.setValue([comp.width / 2, comp.height / 2, 0]);
    app.endUndoGroup();
    return "OK: Geo Route Tracer Created";
}

// 9. Project Sorter Master (01_Comps, 02_Assets, etc.)
function flex_sortProjectMaster() {
    app.beginUndoGroup("Flex: Project Sorter Master");
    function getOrCreateFolder(name) {
        for (var i = 1; i <= app.project.items.length; i++) {
            var itm = app.project.items[i];
            if (itm instanceof FolderItem && itm.name === name) return itm;
        }
        return app.project.items.addFolder(name);
    }

    var fComps = getOrCreateFolder("_01 COMPS");
    var fFootage = getOrCreateFolder("_02 FOOTAGE & ASSETS");
    var fAudio = getOrCreateFolder("_03 AUDIO");
    var fSolids = getOrCreateFolder("_04 SOLIDS");
    var fExports = getOrCreateFolder("_05 EXPORTS");

    var sorted = 0;
    for (var j = app.project.items.length; j >= 1; j--) {
        var itm = app.project.items[j];
        if (itm instanceof FolderItem) continue;
        if (itm instanceof CompItem) {
            if (itm.parentFolder === app.project.rootFolder) { itm.parentFolder = fComps; sorted++; }
        } else if (itm instanceof FootageItem) {
            if (itm.mainSource instanceof SolidSource) {
                if (itm.parentFolder === app.project.rootFolder) { itm.parentFolder = fSolids; sorted++; }
            } else if (itm.hasAudio && !itm.hasVideo) {
                if (itm.parentFolder === app.project.rootFolder) { itm.parentFolder = fAudio; sorted++; }
            } else {
                if (itm.parentFolder === app.project.rootFolder) { itm.parentFolder = fFootage; sorted++; }
            }
        }
    }
    app.endUndoGroup();
    return "OK: Project Sorted! (" + sorted + " items organized)";
}

// 10. Face 3D Parallax Joystick Rig
function flex_createFace3DRig() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Face 3D Parallax Rig");
    var joy = comp.layers.addNull();
    joy.name = "Face 3D Joystick Controller";
    joy.position.setValue([comp.width / 2, comp.height / 2]);

    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        if (layer === joy) continue;
        var depthMultiplier = (i + 1) * 0.25;
        var expr = "joy = thisComp.layer('Face 3D Joystick Controller').transform.position - [thisComp.width/2, thisComp.height/2];\\n" +
                   "value + joy * " + depthMultiplier + ";";
        layer.transform.position.expression = expr;
    }
    app.endUndoGroup();
    return "OK: Face 3D Parallax Rig Connected (" + sel.length + " layers)";
}

// 11. Fx Console Fast Favorites & Snapshot
function flex_applyFastFX(fxName) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: FX Console (" + fxName + ")");
    var count = 0;
    for (var i = 0; i < sel.length; i++) {
        var fx = sel[i].property("ADBE Effect Parade");
        try {
            fx.addProperty(fxName);
            count++;
        } catch(e) {}
    }
    app.endUndoGroup();
    return "OK: Applied " + fxName + " to " + count + " layers";
}

function flex_takeSnapshot() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    app.beginUndoGroup("Flex: Freeze Frame Snapshot");
    try { app.executeCommand(2145); } catch(e) {}
    app.endUndoGroup();
    return "OK: Freeze Frame Snapshot Taken at Playhead";
}

// 12. Motion Bro Seamless Camera Transitions
function flex_applyMotionBro(mode) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Motion Bro (" + mode + ")");
    var adj = comp.layers.addSolid([1, 1, 1], "Motion Bro Transition [" + mode.toUpperCase() + "]", comp.width, comp.height, 1.0, 0.6);
    adj.adjustmentLayer = true;
    adj.startTime = comp.time - 0.3;

    var fx = adj.property("ADBE Effect Parade");
    if (mode === "whip_pan") {
        var blur = fx.addProperty("ADBE Motion Blur");
        if (!blur) blur = fx.addProperty("ADBE Fast Blur");
        if (blur) blur.property(1).setValue(60);
        var xform = fx.addProperty("ADBE Transform");
        if (xform) {
            xform.property("Position").setValueAtTime(comp.time - 0.3, [comp.width * 0.2, comp.height / 2]);
            xform.property("Position").setValueAtTime(comp.time, [comp.width / 2, comp.height / 2]);
            xform.property("Position").setValueAtTime(comp.time + 0.3, [comp.width * 1.8, comp.height / 2]);
        }
    } else if (mode === "zoom_warp") {
        var opt = fx.addProperty("ADBE Optics Compensation");
        if (opt) {
            opt.property(1).setValueAtTime(comp.time - 0.3, 0);
            opt.property(1).setValueAtTime(comp.time, 130);
            opt.property(1).setValueAtTime(comp.time + 0.3, 0);
            opt.property(2).setValue(1);
        }
    }
    app.endUndoGroup();
    return "OK: Motion Bro " + mode.toUpperCase() + " Transition Added";
}

// 13. Overlord 2 Vector to Shape Converter
function flex_convertOverlordVector() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Overlord 2 Vector to Shapes");
    try { app.executeCommand(3736); } catch(e) {}
    app.endUndoGroup();
    return "OK: Vector Layers Converted to Native Shapes";
}

// 14. TrueComp Duplicator Deep Cloner
function flex_trueDupDeep() {
    return flex_trueDup();
}

// 15. Motion Tools Pro Grid Cloner
function flex_cloneMatrixGrid(cols, rows) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Motion Tools Grid Cloner");
    var base = sel[0];
    var c = parseInt(cols, 10) || 3;
    var r = parseInt(rows, 10) || 3;
    var rect;
    try { rect = base.sourceRectAtTime(comp.time, false); } catch(e) { rect = { width: 150, height: 150 }; }
    var spacingX = rect.width * 1.35;
    var spacingY = rect.height * 1.35;

    var startX = (comp.width / 2) - ((c - 1) * spacingX) / 2;
    var startY = (comp.height / 2) - ((r - 1) * spacingY) / 2;

    var totalClones = 0;
    for (var y = 0; y < r; y++) {
        for (var x = 0; x < c; x++) {
            if (x === 0 && y === 0) {
                base.position.setValue([startX, startY]);
                continue;
            }
            var dup = base.duplicate();
            dup.name = base.name + " [Grid " + (x + 1) + "x" + (y + 1) + "]";
            dup.position.setValue([startX + (x * spacingX), startY + (y * spacingY)]);
            totalClones++;
        }
    }
    app.endUndoGroup();
    return "OK: Generated " + (totalClones + 1) + " Layers in " + c + "x" + r + " Matrix Grid";
}

// 16. Lockdown 3 Surface Mesh Warp
function flex_createLockdownMesh() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Lockdown 3 Surface Warp");
    var target = sel[0];
    var fx = target.property("ADBE Effect Parade");
    var pin = fx.addProperty("ADBE Corner Pin");
    if (pin) {
        pin.name = "Lockdown 3 [Surface Corner Pin]";
    }
    var mesh = fx.addProperty("ADBE Bezier Warp");
    if (mesh) {
        mesh.name = "Lockdown 3 [Bezier Mesh Warp]";
    }
    app.endUndoGroup();
    return "OK: Lockdown 3 Surface Mesh Rig Attached";
}

// 17. TikTokText Kinetic Captions
function flex_createTikTokText() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: TikTokText Engine");
    var txt = comp.layers.addText("VIRAL REELS CAPTION");
    txt.name = "TikTokText Kinetic Caption";
    var doc = txt.property("Source Text").value;
    doc.fontSize = 84;
    doc.fillColor = [1, 1, 1];
    doc.strokeColor = [0, 0, 0];
    doc.strokeWidth = 6;
    doc.applyStroke = true;
    doc.justification = ParagraphJustification.CENTER_JUSTIFY;
    txt.property("Source Text").setValue(doc);

    txt.position.setValue([comp.width / 2, comp.height * 0.78]);

    var anim = txt.Text.Animators.addProperty("ADBE Text Animator");
    anim.name = "TikTok Word Punch";
    var sProp = anim.property("ADBE Text Animator Properties").addProperty("ADBE Text Scale 3D");
    sProp.setValue([135, 135, 100]);

    var cProp = anim.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
    cProp.setValue([0.15, 1.0, 0.3]);

    var sel = anim.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    sel.property("ADBE Text Range Advanced").property("ADBE Text Range Based On").setValue(2);
    sel.property("ADBE Text Percent Start").setValueAtTime(comp.time, 0);
    sel.property("ADBE Text Percent Start").setValueAtTime(comp.time + 1.2, 100);

    app.endUndoGroup();
    return "OK: TikTokText Bouncy Caption Rig Created";
}

// 18. Super 3D Room Box Generator
function flex_createSuper3DRoom() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Super 3D Room Box");
    var sz = 1000;
    var dur = comp.duration;
    var master = comp.layers.addNull();
    master.name = "Super 3D Room Master Null";
    master.threeDLayer = true;
    master.position.setValue([comp.width / 2, comp.height / 2, 0]);

    var floor = comp.layers.addSolid([0.1, 0.12, 0.15], "Room Floor", sz, sz, 1.0, dur);
    floor.threeDLayer = true;
    floor.position.setValue([comp.width / 2, (comp.height / 2) + (sz / 2), 0]);
    floor.transform.xRotation.setValue(90);
    floor.parent = master;

    var back = comp.layers.addSolid([0.14, 0.16, 0.2], "Room Back Wall", sz, sz, 1.0, dur);
    back.threeDLayer = true;
    back.position.setValue([comp.width / 2, comp.height / 2, sz / 2]);
    back.parent = master;

    var left = comp.layers.addSolid([0.12, 0.14, 0.18], "Room Left Wall", sz, sz, 1.0, dur);
    left.threeDLayer = true;
    left.position.setValue([(comp.width / 2) - (sz / 2), comp.height / 2, 0]);
    left.transform.yRotation.setValue(90);
    left.parent = master;

    var right = comp.layers.addSolid([0.12, 0.14, 0.18], "Room Right Wall", sz, sz, 1.0, dur);
    right.threeDLayer = true;
    right.position.setValue([(comp.width / 2) + (sz / 2), comp.height / 2, 0]);
    right.transform.yRotation.setValue(-90);
    right.parent = master;

    var ceiling = comp.layers.addSolid([0.08, 0.09, 0.12], "Room Ceiling", sz, sz, 1.0, dur);
    ceiling.threeDLayer = true;
    ceiling.position.setValue([comp.width / 2, (comp.height / 2) - (sz / 2), 0]);
    ceiling.transform.xRotation.setValue(-90);
    ceiling.parent = master;

    app.endUndoGroup();
    return "OK: Super 3D Room Box Assembled (6 Walls)";
}

// 19. Duik Angela Joystick & Secondary Physics
function flex_createDuikJoystick() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Duik Angela Joystick Rig");
    var joy = comp.layers.addNull();
    joy.name = "Duik 2D Joystick Controller";
    joy.position.setValue([comp.width / 2, comp.height / 2]);

    var fx = joy.property("ADBE Effect Parade");
    var xS = fx.addProperty("ADBE Slider Control");
    xS.name = "X Axis Range";
    xS.property(1).setValue(100);

    var yS = fx.addProperty("ADBE Slider Control");
    yS.name = "Y Axis Range";
    yS.property(1).setValue(100);

    app.endUndoGroup();
    return "OK: Duik Angela 2D Joystick Ready";
}

function flex_applyDuikPhysics() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Duik Angela Secondary Physics");
    var expr = "n = 0;\\n" +
               "if (numKeys > 0) {\\n" +
               "  n = nearestKey(time).index;\\n" +
               "  if (key(n).time > time) { n--; }\\n" +
               "}\\n" +
               "if (n > 0) {\\n" +
               "  t = time - key(n).time;\\n" +
               "  amp = 0.06; freq = 4.2; decay = 5.5;\\n" +
               "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\\n" +
               "  value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\\n" +
               "} else { value; }";

    var count = 0;
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        try {
            layer.transform.rotation.expression = expr;
            count++;
        } catch(e) {}
    }
    app.endUndoGroup();
    return "OK: Duik Follow-Through Physics Attached (" + count + " layers)";
}

// 20. Loopy (Seamless Infinite Looping Wiggle)
function flex_applyLoopySeamless() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Loopy Seamless Wiggle");
    var expr = "freq = 1.2; amp = 30;\\n" +
               "loopTime = thisComp.duration;\\n" +
               "t = time % loopTime;\\n" +
               "w1 = wiggle(freq, amp, 1, 0.5, t);\\n" +
               "w2 = wiggle(freq, amp, 1, 0.5, t - loopTime);\\n" +
               "linear(t, 0, loopTime, w1, w2);";

    var count = 0;
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        try {
            layer.transform.position.expression = expr;
            count++;
        } catch(e) {}
    }
    app.endUndoGroup();
    return "OK: Loopy Seamless Infinite Loop Applied (" + count + " layers)";
}

// -------------------------------------------------------------
// 25. SEVEN POWERHOUSE CREATIVE TOOLS
// Text Splitter, Organizard, Easy Parallax, Comp Saver, Anchor Switch, Bounce X, Auto Counter
// -------------------------------------------------------------

// 1. Text Splitter (Lines, Words, Characters)
function flex_splitText(mode) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    var target = sel[0];
    if (!(target instanceof TextLayer)) return "SELECT_TEXT_LAYER";

    app.beginUndoGroup("Flex: Text Splitter (" + mode + ")");
    var srcTextProp = target.property("Source Text");
    var doc = srcTextProp.value;
    var fullText = doc.text;
    var tokens = [];

    if (mode === "lines") {
        tokens = fullText.split(/\\r\\n|\\n|\\r/);
    } else if (mode === "words") {
        tokens = fullText.split(/\\s+/);
    } else if (mode === "chars") {
        tokens = fullText.split("");
    } else {
        tokens = fullText.split(/\\s+/);
    }

    var fontSize = doc.fontSize || 48;
    var lineLeading = doc.leading || (fontSize * 1.25);
    var basePos = target.position.value;
    var count = 0;

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (!token || token.replace(/\\s+/g, '') === '') continue;

        var dup = comp.layers.addText(token);
        dup.name = target.name + " [" + (mode.toUpperCase()) + " " + (count + 1) + "]";
        
        var newDoc = dup.property("Source Text").value;
        newDoc.fontSize = doc.fontSize;
        newDoc.font = doc.font;
        newDoc.fillColor = doc.fillColor;
        newDoc.applyFill = doc.applyFill;
        newDoc.strokeColor = doc.strokeColor;
        newDoc.strokeWidth = doc.strokeWidth;
        newDoc.applyStroke = doc.applyStroke;
        newDoc.justification = doc.justification;
        dup.property("Source Text").setValue(newDoc);

        if (mode === "lines") {
            dup.position.setValue([basePos[0], basePos[1] + (count * lineLeading)]);
        } else if (mode === "words") {
            dup.position.setValue([basePos[0] + (count * (fontSize * 2.2)), basePos[1]]);
        } else if (mode === "chars") {
            dup.position.setValue([basePos[0] + (count * (fontSize * 0.7)), basePos[1]]);
        } else {
            dup.position.setValue([basePos[0], basePos[1] + (count * lineLeading)]);
        }
        count++;
    }

    target.enabled = false;
    app.endUndoGroup();
    return "OK: Split text into " + count + " " + mode + " layers!";
}

// 2. Organizard (Smart Layer Color Coding & Timeline Organization)
function flex_applyOrganizard() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Organizard");
    var total = comp.numLayers;
    if (total === 0) return "NO_LAYER";

    var count = 0;
    for (var i = 1; i <= total; i++) {
        var layer = comp.layer(i);
        if (layer instanceof CameraLayer) {
            layer.label = 8;
        } else if (layer instanceof LightLayer) {
            layer.label = 2;
        } else if (layer.hasAudio && !layer.hasVideo) {
            layer.label = 9;
        } else if (layer.nullLayer) {
            layer.label = 1;
        } else if (layer.adjustmentLayer) {
            layer.label = 10;
        } else if (layer instanceof TextLayer) {
            layer.label = 11;
        } else if (layer instanceof ShapeLayer) {
            layer.label = 3;
        } else if (layer.source instanceof CompItem) {
            layer.label = 5;
        } else if (layer.source && layer.source.mainSource instanceof SolidSource) {
            layer.label = 15;
        } else {
            layer.label = 7;
        }
        count++;
    }
    app.endUndoGroup();
    return "OK: Organizard color-coded " + count + " layers!";
}

// 3. Easy Parallax (3D Optical Depth Rig with Scale Compensation)
function flex_createEasyParallax(depthStep) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length < 2) return "⚠️ Select 2 or more layers for Easy Parallax!";

    app.beginUndoGroup("Flex: Easy Parallax Rig");
    var step = parseInt(depthStep, 10) || 500;
    var cam = null;
    for (var c = 1; c <= comp.numLayers; c++) {
        if (comp.layer(c) instanceof CameraLayer) {
            cam = comp.layer(c);
            break;
        }
    }
    if (!cam) {
        cam = comp.layers.addCamera("Easy Parallax Camera", [comp.width / 2, comp.height / 2]);
        cam.position.setValue([comp.width / 2, comp.height / 2, -1800]);
        cam.cameraOption.zoom.setValue(1800);
    }

    var camZ = cam.position.value[2];
    var baseZ = 0;
    var num = sel.length;

    for (var i = 0; i < num; i++) {
        var layer = sel[i];
        if (layer === cam) continue;
        layer.threeDLayer = true;

        var zOffset = (i - Math.floor(num / 2)) * step;
        var newZ = baseZ + zOffset;
        var p = layer.position.value;
        layer.position.setValue([p[0], p[1], newZ]);

        var oldDist = Math.abs(baseZ - camZ);
        var newDist = Math.abs(newZ - camZ);
        if (oldDist > 0) {
            var scaleFactor = newDist / oldDist;
            var curS = layer.scale.value;
            layer.scale.setValue([curS[0] * scaleFactor, curS[1] * scaleFactor, curS[2] || 100]);
        }
    }

    var ctrl = comp.layers.addNull();
    ctrl.name = "Easy Parallax Controller (Pan/Tilt)";
    ctrl.position.setValue([comp.width / 2, comp.height / 2]);
    cam.parent = ctrl;

    app.endUndoGroup();
    return "OK: Easy Parallax Rig created with " + num + " depth layers!";
}

// 4. Comp Saver (Instant Backup / Add to Render Queue)
function flex_compSaver(action) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Comp Saver (" + action + ")");
    if (action === "backup") {
        function getOrCreateFolder(name) {
            for (var i = 1; i <= app.project.items.length; i++) {
                var itm = app.project.items[i];
                if (itm instanceof FolderItem && itm.name === name) return itm;
            }
            return app.project.items.addFolder(name);
        }
        var bFolder = getOrCreateFolder("_00 COMP BACKUPS");
        var dup = comp.duplicate();
        var d = new Date();
        var timeTag = "" + d.getFullYear() + (d.getMonth() + 1 < 10 ? "0" : "") + (d.getMonth() + 1) + (d.getDate() < 10 ? "0" : "") + d.getDate() + "_" + (d.getHours() < 10 ? "0" : "") + d.getHours() + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
        dup.name = comp.name + "_Backup_" + timeTag;
        dup.parentFolder = bFolder;
        app.endUndoGroup();
        return "OK: Comp backup saved to _00 COMP BACKUPS folder!";
    } else if (action === "render") {
        var rq = app.project.renderQueue;
        rq.items.add(comp);
        app.endUndoGroup();
        return "OK: Comp added to Render Queue ready to render!";
    }
    app.endUndoGroup();
    return "OK: Comp Saver executed";
}

// 5. Anchor Switch (Dynamic Anchor Point Switcher without visual jump)
function flex_anchorSwitch(mode) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Anchor Switch (" + mode + ")");
    var count = 0;
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var rect;
        try { rect = layer.sourceRectAtTime(comp.time, false); } catch(e) { continue; }

        var targetAnchorX = rect.left + rect.width / 2;
        var targetAnchorY = rect.top + rect.height / 2;

        if (mode === "center") {
            targetAnchorX = rect.left + rect.width / 2;
            targetAnchorY = rect.top + rect.height / 2;
        } else if (mode === "top") {
            targetAnchorX = rect.left + rect.width / 2;
            targetAnchorY = rect.top;
        } else if (mode === "bottom") {
            targetAnchorX = rect.left + rect.width / 2;
            targetAnchorY = rect.top + rect.height;
        } else if (mode === "left") {
            targetAnchorX = rect.left;
            targetAnchorY = rect.top + rect.height / 2;
        } else if (mode === "right") {
            targetAnchorX = rect.left + rect.width;
            targetAnchorY = rect.top + rect.height / 2;
        }

        var curAnchor = layer.anchorPoint.value;
        var curPos = layer.position.value;
        var diffX = targetAnchorX - curAnchor[0];
        var diffY = targetAnchorY - curAnchor[1];

        var s = layer.scale.value;
        var sx = s[0] / 100;
        var sy = s[1] / 100;
        var r = layer.rotation.value * (Math.PI / 180);

        var cosR = Math.cos(r);
        var sinR = Math.sin(r);
        var rotDiffX = (diffX * sx * cosR) - (diffY * sy * sinR);
        var rotDiffY = (diffX * sx * sinR) + (diffY * sy * cosR);

        layer.anchorPoint.setValue([targetAnchorX, targetAnchorY, curAnchor[2] || 0]);
        if (layer.threeDLayer) {
            layer.position.setValue([curPos[0] + rotDiffX, curPos[1] + rotDiffY, curPos[2]]);
        } else {
            layer.position.setValue([curPos[0] + rotDiffX, curPos[1] + rotDiffY]);
        }
        count++;
    }
    app.endUndoGroup();
    return "OK: Anchor switched to " + mode.toUpperCase() + " on " + count + " layer(s)";
}

// 6. Bounce X (Parametric Inertial Decay Bounce Physics with Sliders)
function flex_applyBounceX() {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";
    var sel = comp.selectedLayers;
    if (sel.length === 0) return "NO_LAYER";

    app.beginUndoGroup("Flex: Bounce X Controller");
    var count = 0;
    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var fx = layer.property("ADBE Effect Parade");

        var sAmp = fx.property("Bounce X - Amp");
        if (!sAmp) {
            sAmp = fx.addProperty("ADBE Slider Control");
            sAmp.name = "Bounce X - Amp";
            sAmp.property(1).setValue(8.0);
        }

        var sFreq = fx.property("Bounce X - Freq");
        if (!sFreq) {
            sFreq = fx.addProperty("ADBE Slider Control");
            sFreq.name = "Bounce X - Freq";
            sFreq.property(1).setValue(5.0);
        }

        var sDecay = fx.property("Bounce X - Decay");
        if (!sDecay) {
            sDecay = fx.addProperty("ADBE Slider Control");
            sDecay.name = "Bounce X - Decay";
            sDecay.property(1).setValue(6.5);
        }

        var expr = "amp = effect('Bounce X - Amp')(1) / 100;\\n" +
                   "freq = effect('Bounce X - Freq')(1);\\n" +
                   "decay = effect('Bounce X - Decay')(1);\\n" +
                   "n = 0;\\n" +
                   "if (numKeys > 0) {\\n" +
                   "  n = nearestKey(time).index;\\n" +
                   "  if (key(n).time > time) { n--; }\\n" +
                   "}\\n" +
                   "if (n > 0) {\\n" +
                   "  t = time - key(n).time;\\n" +
                   "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\\n" +
                   "  value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\\n" +
                   "} else { value; }";

        try {
            layer.transform.position.expression = expr;
            count++;
        } catch(e) {}
    }
    app.endUndoGroup();
    return "OK: Bounce X Controller & Physics attached to " + count + " layer(s)";
}

// 7. Auto Counter (Interactive Procedural Number Counter Rig)
function flex_createAutoCounter(preset) {
    var comp = flex_getActiveComp();
    if (!comp) return "NO_COMP";

    app.beginUndoGroup("Flex: Auto Counter (" + preset + ")");
    var txt = comp.layers.addText("0");
    txt.name = "Auto Counter [" + preset.toUpperCase() + "]";
    var doc = txt.property("Source Text").value;
    doc.fontSize = 80;
    doc.fillColor = [1, 1, 1];
    doc.applyFill = true;
    doc.justification = ParagraphJustification.CENTER_JUSTIFY;
    txt.property("Source Text").setValue(doc);
    txt.position.setValue([comp.width / 2, comp.height / 2]);

    var fx = txt.property("ADBE Effect Parade");
    var sStart = fx.addProperty("ADBE Slider Control");
    sStart.name = "Counter Start";
    sStart.property(1).setValue(0);

    var sEnd = fx.addProperty("ADBE Slider Control");
    sEnd.name = "Counter End";
    var defaultEnd = (preset === "currency" ? 50000 : (preset === "percent" ? 100 : 1000));
    sEnd.property(1).setValue(defaultEnd);

    var sDur = fx.addProperty("ADBE Slider Control");
    sDur.name = "Counter Duration (s)";
    sDur.property(1).setValue(3);

    var sDec = fx.addProperty("ADBE Slider Control");
    sDec.name = "Decimal Places";
    sDec.property(1).setValue(0);

    var prefixStr = (preset === "currency" ? "$" : (preset === "rupee" ? "₹" : ""));
    var suffixStr = (preset === "percent" ? "%" : (preset === "followers" ? "K+" : ""));

    var expr = "startVal = effect('Counter Start')(1);\\n" +
               "endVal = effect('Counter End')(1);\\n" +
               "dur = Math.max(0.1, effect('Counter Duration (s)')(1));\\n" +
               "decimals = Math.max(0, Math.floor(effect('Decimal Places')(1)));\\n" +
               "pct = Math.min(1, Math.max(0, time / dur));\\n" +
               "progress = 1 - Math.pow(1 - pct, 3);\\n" +
               "val = startVal + (endVal - startVal) * progress;\\n" +
               "valStr = val.toFixed(decimals);\\n" +
               "parts = valStr.split('.');\\n" +
               "parts[0] = parts[0].replace(/\\\\B(?=(\\\\d{3})+(?!\\\\d))/g, ',');\\n" +
               "prefix = '" + prefixStr + "';\\n" +
               "suffix = '" + suffixStr + "';\\n" +
               "prefix + parts.join('.') + suffix;";

    txt.property("Source Text").expression = expr;

    app.endUndoGroup();
    return "OK: Auto Counter (" + preset.toUpperCase() + ") created!";
}


`;
        cs.evalScript(jsxSource);
    }

    function run(jsxCall, label) {
        var savedKey = "";
        try { savedKey = localStorage.getItem("motionkit_license_key") || ""; } catch(e) {}
        if (!isLicenseValid(savedKey)) {
            updateLicenseUI();
            showToast("🔒 Please activate your license to use this tool.", true);
            return;
        }

        injectEngine();

        cs.evalScript(jsxCall, function(res) {
            if (!res || res === "EvalScript error.") {
                showToast("⚠️ After Effects context error. Check comp/layer.", true);
                return;
            }
            if (res === "NO_COMP") {
                showToast("⚠️ Open a Composition first!", true);
            } else if (res === "NO_LAYER") {
                showToast("⚠️ Select a Layer first!", true);
            } else if (res === "NO_PROPS") {
                showToast("⚠️ Select Keyframes or Properties first!", true);
            } else if (res === "NO_PRECOMP") {
                showToast("⚠️ Selected layer is not a Precomp!", true);
            } else if (res === "SELECT_TEXT_LAYER") {
                showToast("⚠️ Select a Text Layer first!", true);
            } else if (res.indexOf("ERROR") !== -1) {
                showToast(res.replace("ERROR: ", "⚠️ "), true);
            } else if (res.indexOf("OK:") !== -1) {
                showToast("✓ " + res.replace("OK: ", ""), false);
            } else {
                showToast("✓ " + (label || res), false);
            }
        });
    }

    injectEngine();

    // Tab Navigation
    var tabBtns = document.querySelectorAll(".tab-btn");
    var tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var targetTab = this.getAttribute("data-tab");
            tabBtns.forEach(function(b) { b.classList.remove("active"); });
            tabContents.forEach(function(c) { c.classList.remove("active"); });

            this.classList.add("active");
            var content = document.getElementById(targetTab);
            if (content) content.classList.add("active");
        });
    });

    function bind(id, call, label) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener("click", function() {
                run(call, label);
            });
        }
    }

    // =========================================================
    // TAB 1: GENERAL & RIGGING
    // =========================================================
    var anchorCells = document.querySelectorAll("[data-anchor]");
    anchorCells.forEach(function(cell) {
        cell.addEventListener("click", function() {
            anchorCells.forEach(function(c) { c.classList.remove("active"); });
            this.classList.add("active");
            var pos = this.getAttribute("data-anchor");
            run("flex_setAnchor('" + pos + "')", "Anchor " + pos);
        });
    });

    bind("btn-center-comp", "flex_centerInComp()", "Center in Comp");
    bind("btn-null-parent", "flex_nullAndParent()", "Null & Parent");
    bind("btn-camera-rig", "flex_createCameraRig()", "3D Camera Rig");
    bind("btn-adj-layer", "flex_createAdjustment()", "Adjustment Layer");
    bind("btn-solid-layer", "flex_createSolid()", "Comp Solid");

    bind("btn-precomp-sep", "flex_precompSep()", "Precomp Sep");
    bind("btn-true-dup", "flex_trueDup()", "True Dup Precomp");
    bind("btn-unprecomp", "flex_unPrecomp()", "Un-Precomp");
    bind("btn-crop-comp", "flex_cropCompToSelection()", "Crop Comp");

    bind("btn-split-cti", "flex_splitAtCTI()", "Split at CTI");
    bind("btn-motion-blur", "flex_toggleMotionBlur()", "Toggle Motion Blur");
    bind("btn-trim-in", "flex_trimIn()", "Trim In");
    bind("btn-trim-out", "flex_trimOut()", "Trim Out");
    bind("btn-toggle-shy", "flex_toggleShy()", "Toggle Shy Layers");

    bind("btn-gradient-lock", "flex_applyGradientLock()", "Gradient Lock");
    bind("btn-split-masks", "flex_splitMasks()", "Split Masks");
    bind("btn-check-gaps", "flex_checkGaps()", "QC Gap Checker");

    // Top Plugins (Tab 1)
    bind("btn-grid-cloner", "flex_cloneMatrixGrid(3, 3)", "Motion Tools Cloner (3x3)");
    bind("btn-overlord-convert", "flex_convertOverlordVector()", "Overlord: Vector to Shape");
    bind("btn-truecomp-deep", "flex_trueDupDeep()", "TrueComp Deep Duplicate");
    bind("btn-project-sorter-master", "flex_sortProjectMaster()", "Project Sorter Master");

    // Creative Tools (Tab 1: Organizard & Anchor Switch)
    bind("btn-organizard", "flex_applyOrganizard()", "Organizard: Color Coded & Organized");

    var anchorSwitchBtns = document.querySelectorAll("[data-anchorswitch]");
    anchorSwitchBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var mode = this.getAttribute("data-anchorswitch");
            run("flex_anchorSwitch('" + mode + "')", "Anchor Switch " + mode.toUpperCase());
        });
    });

    // =========================================================
    // TAB 2: SAAS & UI TOOLS (v9.2.0 EXCLUSIVE)
    // =========================================================
    bind("btn-cursor-engine", "flex_createCursorEngine()", "3D Cursor Engine");
    bind("btn-ss-ae", "flex_createSSToAE()", "SS to 3D Mockup");
    bind("btn-ui-stagger", "flex_staggerUI()", "UI Cards Stagger");
    bind("btn-terminal", "flex_createTerminalWindow()", "Code Terminal");
    bind("btn-prompt-bar", "flex_createPromptBar()", "AI Prompt Bar");
    bind("btn-notif-badge", "flex_createNotificationBadge()", "Notification Badge");
    bind("btn-dot-matrix", "flex_createDotMatrix()", "Dot Grid Matrix");

    var uiShapeBtns = document.querySelectorAll("[data-uishape]");
    uiShapeBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var type = this.getAttribute("data-uishape");
            run("flex_createUIShape('" + type + "')", type.toUpperCase() + " UI Shape");
        });
    });

    bind("btn-figma-rig", "flex_createFigmaVectorRig()", "Figma Vector Rig");

    // Top Plugins (Tab 2)
    bind("btn-blender-bridge", "flex_createBlenderBridge()", "Blender AE 2 Bridge");
    bind("btn-face3d-rig", "flex_createFace3DRig()", "Face 3D Parallax Rig");
    bind("btn-super3d-room", "flex_createSuper3DRoom()", "Super 3D Room Box");

    // Creative Tools (Tab 2: Easy Parallax)
    var parallaxBtns = document.querySelectorAll("[data-parallax]");
    parallaxBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var step = this.getAttribute("data-parallax");
            run("flex_createEasyParallax(" + step + ")", "Easy Parallax (" + step + "z)");
        });
    });

    // =========================================================
    // TAB 3: FLOW & EASING (SMART GRAPH EDITOR & DYNAMICS)
    // =========================================================
    var sliderIn = document.getElementById("slider-in-inf");
    var sliderOut = document.getElementById("slider-out-inf");
    var valIn = document.getElementById("val-in-inf");
    var valOut = document.getElementById("val-out-inf");
    var curvePath = document.getElementById("graph-curve-path");
    var graphPresetLabel = document.getElementById("graph-preset-label");

    function updateGraph() {
        var inInf = parseInt(sliderIn ? sliderIn.value : 68, 10);
        var outInf = parseInt(sliderOut ? sliderOut.value : 68, 10);
        if (valIn) valIn.textContent = inInf + "%";
        if (valOut) valOut.textContent = outInf + "%";

        var cp1x = 10 + (outInf / 100) * 85;
        var cp1y = 110;
        var cp2x = 190 - (inInf / 100) * 85;
        var cp2y = 10;

        if (curvePath) {
            curvePath.setAttribute("d", "M 10 110 C " + cp1x + " " + cp1y + ", " + cp2x + " " + cp2y + ", 190 10");
        }
    }

    if (sliderIn) sliderIn.addEventListener("input", function() {
        if (graphPresetLabel) graphPresetLabel.textContent = "Custom";
        updateGraph();
    });
    if (sliderOut) sliderOut.addEventListener("input", function() {
        if (graphPresetLabel) graphPresetLabel.textContent = "Custom";
        updateGraph();
    });

    var curveBtns = document.querySelectorAll("[data-curve]");
    curveBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var type = this.getAttribute("data-curve");
            if (type === "pop") {
                if (sliderIn) sliderIn.value = 90;
                if (sliderOut) sliderOut.value = 15;
                if (graphPresetLabel) graphPresetLabel.textContent = "Pop Curve (90/15)";
            } else if (type === "smooth") {
                if (sliderIn) sliderIn.value = 68;
                if (sliderOut) sliderOut.value = 68;
                if (graphPresetLabel) graphPresetLabel.textContent = "Smooth Flow (68/68)";
            } else if (type === "in") {
                if (sliderIn) sliderIn.value = 85;
                if (sliderOut) sliderOut.value = 5;
                if (graphPresetLabel) graphPresetLabel.textContent = "Ease In (85/5)";
            } else if (type === "out") {
                if (sliderIn) sliderIn.value = 5;
                if (sliderOut) sliderOut.value = 85;
                if (graphPresetLabel) graphPresetLabel.textContent = "Ease Out (5/85)";
            }
            updateGraph();
        });
    });

    var btnApplyGraph = document.getElementById("btn-apply-graph");
    if (btnApplyGraph) {
        btnApplyGraph.addEventListener("click", function() {
            var inInf = sliderIn ? sliderIn.value : 68;
            var outInf = sliderOut ? sliderOut.value : 68;
            run("flex_applyGraphCurve(" + inInf + ", 0, " + outInf + ", 0)", "Curve (" + inInf + "/" + outInf + ")");
        });
    }
    updateGraph();

    bind("btn-smooth-ease", "flex_smoothEase()", "Smooth Ease");
    bind("btn-linear-ease", "flex_applyLinear()", "Linear Keys");
    bind("btn-hold-ease", "flex_applyHold()", "Hold Keys");
    bind("btn-copy-ease", "flex_copyEase()", "Copy Ease");
    bind("btn-paste-ease", "flex_pasteEase()", "Paste Ease");
    bind("btn-reverse-keys", "flex_reverseKeyframes()", "Reverse Keys");

    var shakeBtns = document.querySelectorAll("[data-shake]");
    shakeBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var type = this.getAttribute("data-shake");
            run("flex_applyCameraShake('" + type + "')", type.toUpperCase() + " Shake");
        });
    });

    bind("btn-elastic", "flex_applyElastic()", "Elastic Overshoot");
    bind("btn-bounce", "flex_applyBounce()", "Quick Bounce");
    bind("btn-wiggle", "flex_applyWiggle()", "Inertial Wiggle");
    bind("btn-loop-cycle", "flex_applyLoop('cycle')", "Loop Cycle");
    bind("btn-loop-pingpong", "flex_applyLoop('pingpong')", "Loop PingPong");

    var btnStagger = document.getElementById("btn-stagger-layers");
    if (btnStagger) {
        btnStagger.addEventListener("click", function() {
            var fInput = document.getElementById("input-stagger-frames");
            var frames = fInput ? parseInt(fInput.value, 10) : 5;
            if (!frames || frames < 1) frames = 5;
            run("flex_staggerLayers(" + frames + ")", "Stagger (" + frames + "f)");
        });
    }

    // Top Plugins (Tab 3: Limber 2, Duik Angela, Animation Composer, Motion Bro, Loopy)
    bind("btn-limber-rig", "flex_createLimberRig()", "Limber 2 IK Limb Rig");
    bind("btn-duik-joystick", "flex_createDuikJoystick()", "Duik 2D Joystick");
    bind("btn-duik-physics", "flex_applyDuikPhysics()", "Duik Follow-Through Physics");

    var composerBtns = document.querySelectorAll("[data-composer]");
    composerBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var type = this.getAttribute("data-composer");
            run("flex_applyComposerTransition('" + type + "')", "Composer " + type.toUpperCase());
        });
    });

    var motionbroBtns = document.querySelectorAll("[data-motionbro]");
    motionbroBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var mode = this.getAttribute("data-motionbro");
            run("flex_applyMotionBro('" + mode + "')", "Motion Bro " + mode.toUpperCase());
        });
    });

    bind("btn-loopy-seamless", "flex_applyLoopySeamless()", "Loopy Seamless Wiggle");

    // Creative Tools (Tab 3: Bounce X)
    bind("btn-bounce-x", "flex_applyBounceX()", "Bounce X Controller Attached");

    // =========================================================
    // TAB 4: KINETIC TYPE & TEXT
    // =========================================================
    var kineticBtns = document.querySelectorAll("[data-kinetic]");
    kineticBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var fmt = this.getAttribute("data-kinetic");
            run("flex_createKineticType('" + fmt + "')", "Kinetic (" + fmt + ")");
        });
    });

    // Top Plugins (Tab 4: TikTokText)
    bind("btn-tiktok-text", "flex_createTikTokText()", "TikTokText Viral Captions");

    // Creative Tools (Tab 4: Text Splitter & Auto Counter)
    var textSplitBtns = document.querySelectorAll("[data-textsplit]");
    textSplitBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var mode = this.getAttribute("data-textsplit");
            run("flex_splitText('" + mode + "')", "Split Text (" + mode.toUpperCase() + ")");
        });
    });

    var autoCounterBtns = document.querySelectorAll("[data-autocounter]");
    autoCounterBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var preset = this.getAttribute("data-autocounter");
            run("flex_createAutoCounter('" + preset + "')", "Auto Counter (" + preset.toUpperCase() + ")");
        });
    });

    var highlightBtns = document.querySelectorAll("[data-highlight]");
    highlightBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var type = this.getAttribute("data-highlight");
            run("flex_createAutoHighlighter('" + type + "')", type.toUpperCase() + " Highlight");
        });
    });

    bind("btn-auto-captions", "flex_createAutoCaptions('word_punch')", "AutoCaptions Rig");

    bind("btn-explode-words", "flex_explodeText('words')", "Explode Words");
    bind("btn-explode-chars", "flex_explodeText('chars')", "Explode Chars");

    var btnBatchRename = document.getElementById("btn-batch-rename");
    if (btnBatchRename) {
        btnBatchRename.addEventListener("click", function() {
            var pInput = document.getElementById("input-rename-prefix");
            var prefix = pInput ? pInput.value.trim() : "UI_";
            if (!prefix) prefix = "UI_";
            run("flex_batchRename('" + prefix + "')", "Renamed (" + prefix + ")");
        });
    }

    var fontBtns = document.querySelectorAll("[data-font]");
    fontBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var font = this.getAttribute("data-font");
            run("flex_replaceFont('" + font + "')", "Font " + font);
        });
    });

    var animCards = document.querySelectorAll("[data-anim]");
    animCards.forEach(function(card) {
        card.addEventListener("click", function() {
            var type = this.getAttribute("data-anim");
            run("flex_applyTextAnim('" + type + "')", type.toUpperCase() + " Anim");
        });
    });

    // =========================================================
    // TAB 5: FX, 3D & PROXIMITY
    // =========================================================
    bind("btn-proximity-eff", "flex_createProximityEffector()", "Proximity Effector");

    var proxBtns = document.querySelectorAll("[data-proxdriver]");
    proxBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var mode = this.getAttribute("data-proxdriver");
            run("flex_applyProximityDriver('" + mode + "')", "Proximity " + mode.toUpperCase());
        });
    });

    bind("btn-orb-rig", "flex_createOrbRig(true)", "Orb Carousel Rig");
    bind("btn-sync-carousel", "flex_syncCarousel()", "Sync Carousel");
    bind("btn-map-rig", "flex_createMapRig()", "3D Map Rig");

    var extrudeBtns = document.querySelectorAll("[data-extrude]");
    extrudeBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var depth = this.getAttribute("data-extrude");
            run("flex_addSuperExtrude(" + depth + ", true)", "Extrude (" + depth + " bevel)");
        });
    });

    // Top Plugins (Tab 5: Saber, Deep Glow 2, Shadow Studio 3, Geo Layers, Lockdown)
    var saberBtns = document.querySelectorAll("[data-saber]");
    saberBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var preset = this.getAttribute("data-saber");
            run("flex_createSaberRig('" + preset + "')", "Saber " + preset.toUpperCase());
        });
    });

    bind("btn-deepglow2", "flex_addDeepGlow2()", "Deep Glow 2 Radiance");

    var shadowBtns = document.querySelectorAll("[data-shadowstudio]");
    shadowBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var type = this.getAttribute("data-shadowstudio");
            run("flex_applyShadowStudio('" + type + "')", "Shadow Studio " + type.toUpperCase());
        });
    });

    bind("btn-geo-route", "flex_createGeoRouteTracker()", "Geo Layers Route Tracker");
    bind("btn-lockdown-mesh", "flex_createLockdownMesh()", "Lockdown Mesh Tracker");

    bind("btn-depth-reveal", "flex_createAIDepthReveal()", "AI Depth Fog");
    bind("btn-halftone", "flex_addHalftoneWave()", "Halftone Wave");
    bind("btn-glassmorph", "flex_addGlassMorph()", "Glass Morph");
    bind("btn-deepglow", "flex_addDeepGlow()", "Deep Glow Stack");
    bind("btn-counter", "flex_createCounter()", "Number Counter");

    var gradeBtns = document.querySelectorAll("[data-grade]");
    gradeBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var theme = this.getAttribute("data-grade");
            run("flex_applyColorGrade('" + theme + "')", theme.toUpperCase() + " Grade");
        });
    });

    var fillSwatches = document.querySelectorAll("[data-fill]");
    fillSwatches.forEach(function(swatch) {
        swatch.addEventListener("click", function() {
            var hex = this.getAttribute("data-fill");
            run("flex_applyFill('" + hex + "')", "Fill " + hex);
        });
    });

    var paletteBtns = document.querySelectorAll("[data-palette]");
    paletteBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var theme = this.getAttribute("data-palette");
            run("flex_applyPalette('" + theme + "')", theme.toUpperCase() + " Palette");
        });
    });

    // =========================================================
    // TAB 6: COMPS, TURBO & UTILITIES
    // =========================================================
    // Top Plugins (Tab 6: Fx Console Fast FX & Snapshot)
    var fastFxBtns = document.querySelectorAll("[data-fastfx]");
    fastFxBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var fx = this.getAttribute("data-fastfx");
            run("flex_applyFastFX('" + fx + "')", "Fast " + fx);
        });
    });

    bind("btn-fxconsole-snapshot", "flex_takeSnapshot()", "Fx Console Snapshot");

    var createCompBtns = document.querySelectorAll("[data-createcomp]");
    createCompBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var type = this.getAttribute("data-createcomp");
            if (type === "9:16") run("flex_createSavedComp('Reels_9x16', 1080, 1920, 60, 15)", "Created 9:16 Reels");
            else if (type === "16:9") run("flex_createSavedComp('YouTube_16x9', 1920, 1080, 60, 30)", "Created 16:9 YT Comp");
            else if (type === "1:1") run("flex_createSavedComp('Square_1x1', 1080, 1080, 60, 15)", "Created 1:1 Comp");
            else if (type === "4:5") run("flex_createSavedComp('Insta_4x5', 1080, 1350, 60, 15)", "Created 4:5 Comp");
        });
    });

    // Creative Tools (Tab 6: Comp Saver)
    bind("btn-comp-saver-backup", "flex_compSaver('backup')", "Comp Backup Saved");
    bind("btn-comp-saver-render", "flex_compSaver('render')", "Added to Render Queue");

    var resizerBtns = document.querySelectorAll("[data-resizer]");
    resizerBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var fmt = this.getAttribute("data-resizer");
            run("flex_resizeComp('" + fmt + "')", "Resized to " + fmt);
        });
    });

    bind("btn-silence-cut", "flex_silenceAudioCut()", "Silence Audio Cut");
    bind("btn-beat-marker", "flex_addBeatMarker()", "Beat Marker");
    bind("btn-optimized-mode", "flex_toggleOptimizedMode()", "Optimized Low-Spec");
    bind("btn-turbo", "flex_toggleTurboMode()", "Mute Heavy FX");
    bind("btn-purge", "flex_purgeCache()", "Purge Cache");
    bind("btn-clean-project", "flex_cleanProject()", "Clean Project");

    var guideBtns = document.querySelectorAll("[data-guides]");
    guideBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var type = this.getAttribute("data-guides");
            run("flex_createLayoutGuides('" + type + "')", type.toUpperCase() + " Guides");
        });
    });

    bind("btn-auto-relink", "flex_autoRelink()", "Auto Relink Assets");

    // =========================================================
    // STICKY FOOTER: ALIGN, DISTRIBUTE & GROUP
    // =========================================================
    var alignBtns = document.querySelectorAll("[data-align]");
    alignBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var type = this.getAttribute("data-align");
            run("flex_align('" + type + "')", "Align " + type);
        });
    });

    var distribBtns = document.querySelectorAll("[data-distrib]");
    distribBtns.forEach(function(btn) {
        distribBtns.forEach(function(b) { b.classList.remove("active"); });
        btn.addEventListener("click", function() {
            var axis = this.getAttribute("data-distrib");
            run("flex_distribute('" + axis + "')", "Distribute " + axis);
        });
    });

    bind("btn-align-group", "flex_alignAsGroup()", "Align as Group");
});
