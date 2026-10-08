/**
 * Flex Wheel - Complete Product Dataset
 * Extracted directly from Flex Wheel v1.0.0 documentation
 */

const FLEX_DATA = {
  afterEffects: {
    name: "After Effects",
    totalTools: 114,
    defaultCenter: "Null Default",
    segments: [
      {
        id: "actions",
        label: "Actions",
        icon: "zap",
        tools: ["Pre-comp", "Split", "Duplicate", "Render Queue", "Delete"]
      },
      {
        id: "transform",
        label: "Transform",
        icon: "move",
        tools: ["Center", "Fit Fill", "Mirror H", "Rotate +90", "Scale x2"]
      },
      {
        id: "create",
        label: "Create",
        icon: "plus",
        tools: ["Shape", "Solid", "Null", "Camera", "Adjust"]
      },
      {
        id: "blur",
        label: "Blur",
        icon: "droplet",
        tools: ["Gaussian", "Camera Lens", "Fast Box", "Directional", "Radial"]
      },
      {
        id: "effects",
        label: "Effects",
        icon: "sparkles",
        tools: ["Glow", "Shadow", "Fill", "Fractal Noise", "Search..."]
      },
      {
        id: "color",
        label: "Color",
        icon: "palette",
        tools: ["Lumetri", "Hue/Sat", "Curves", "Levels", "Exposure"]
      },
      {
        id: "anchor",
        label: "Anchor",
        icon: "crosshair",
        isGrid: true,
        tools: ["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"]
      },
      {
        id: "freeze",
        label: "Freeze",
        icon: "snowflake",
        tools: ["Freeze Frame", "Time Remap", "Freeze Last", "Reverse Layer", "Speed x2"]
      }
    ],
    categories: [
      {
        name: "Actions",
        count: 11,
        desc: "The right-click ritual, collapsed into one motion.",
        tools: ["Pre-comp", "Pre-comp...", "Split", "Duplicate", "Save Frame", "Delete", "Render Queue", "Media Encoder", "Purge Cache", "Shapes from Text", "Shapes from Vector"]
      },
      {
        name: "Transform",
        count: 12,
        desc: "Fit, fill, flip and centre without touching a value.",
        tools: ["Center", "Fit W", "Fit H", "Fit", "Fill", "Mirror H", "Mirror V", "Rotate +90", "Rotate -90", "Scale 1/2", "Scale x2", "Reset"]
      },
      {
        name: "Create",
        count: 10,
        desc: "New layers land above your selection, trimmed to it.",
        tools: ["Shape", "Ellipse", "Solid", "Solid...", "Null", "Null + Parent", "Camera", "Adjust", "Text", "Light"]
      },
      {
        name: "Blur",
        count: 6,
        desc: "The blurs you reach for daily.",
        tools: ["Gaussian", "Camera Lens", "Fast Box", "Directional", "Radial", "Sharpen"]
      },
      {
        name: "Effects",
        count: 9,
        desc: "Your looks, plus a search over everything installed.",
        tools: ["Search...", "Shadow", "Fill", "Tint", "Glow", "Fractal Noise", "Gradient Ramp", "Turbulent", "Roughen Edges"]
      },
      {
        name: "Color",
        count: 6,
        desc: "Grade in place - no typing into Effects & Presets.",
        tools: ["Lumetri", "Hue/Sat", "Curves", "Levels", "Exposure", "Vibrance"]
      },
      {
        name: "Anchor",
        count: 9,
        isGrid: true,
        desc: "Nine positions. The layer never moves.",
        tools: ["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"]
      },
      {
        name: "Time",
        count: 6,
        desc: "Freeze, remap and reverse without the Time submenu.",
        tools: ["Freeze Frame", "Time Remap", "Freeze Last", "Reverse Layer", "Speed x2", "Speed 1/2"]
      },
      {
        name: "Keyframes",
        count: 11,
        desc: "Ease selected keys, or add one that holds the current value.",
        tools: ["Easy Ease", "Ease In", "Ease Out", "Linear", "Hold", "Reverse Keys", "Key Position", "Key Scale", "Key Rotation", "Key Opacity", "Key All"]
      },
      {
        name: "Align",
        count: 9,
        isGrid: true,
        desc: "Snap a layer to nine places in the comp - exact under scale and rotation.",
        tools: ["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"]
      },
      {
        name: "Expressions",
        count: 4,
        desc: "Loop, ping-pong or wiggle the properties you have selected.",
        tools: ["Loop", "Ping-Pong", "Wiggle", "Clear"]
      },
      {
        name: "Layer",
        count: 17,
        desc: "Switches, trims, order and markers.",
        tools: ["Solo", "Lock", "Shy", "Show / Hide", "Motion Blur", "3D Layer", "Guide Layer", "Trim In", "Trim Out", "Move to Playhead", "Sequence", "To Front", "To Back", "Unparent", "Marker", "Opacity 50", "Opacity 100"]
      },
      {
        name: "Comp",
        count: 4,
        desc: "Work area, comp settings and the wheel's own settings.",
        tools: ["Work Area -> Sel", "Trim Comp", "Comp Settings", "Wheel Settings"]
      }
    ],
    layouts: {
      "Default": ["Actions", "Transform", "Create", "Blur", "Effects", "Color", "Anchor", "Freeze"],
      "Motion Design": ["Keyframes", "Layer", "Create", "Transform", "Anchor", "Actions", "Time", "Expressions"],
      "Animate": ["Keyframes", "Expressions", "Time", "Layer", "Create", "Align", "Transform", "Actions"],
      "Finishing": ["Color", "Blur", "Effects", "Create", "Layer", "Comp", "Anchor", "Actions"]
    }
  },

  premierePro: {
    name: "Premiere Pro",
    totalTools: 73,
    defaultCenter: "Cut Editing",
    segments: [
      {
        id: "edit",
        label: "Edit",
        icon: "scissors",
        tools: ["Cut", "Ripple Delete", "Delete (Lift)", "Enable / Disable", "Unlink"]
      },
      {
        id: "transform",
        label: "Transform",
        icon: "move",
        tools: ["Center", "Scale 100", "Scale x2", "Reset Motion", "Flip H"]
      },
      {
        id: "transitions",
        label: "Transitions",
        icon: "sliders",
        tools: ["Cross Dissolve", "Dip to Black", "Dip to White", "Film Dissolve", "Push"]
      },
      {
        id: "color",
        label: "Color",
        icon: "palette",
        tools: ["Lumetri Color", "Black & White", "Tint", "Brightness & Contrast"]
      },
      {
        id: "position",
        label: "Position",
        icon: "grid",
        isGrid: true,
        tools: ["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"]
      },
      {
        id: "markers",
        label: "Markers",
        icon: "bookmark",
        tools: ["Marker", "Red", "Orange", "Yellow", "Blue", "Cyan"]
      },
      {
        id: "playhead",
        label: "Playhead",
        icon: "clock",
        tools: ["Next Edit", "Previous Edit", "Clip Start", "Clip End", "Mark In"]
      },
      {
        id: "effects",
        label: "Effects",
        icon: "sparkles",
        tools: ["Gaussian Blur", "Drop Shadow", "Crop", "Warp Stabilizer", "Ultra Key"]
      }
    ],
    categories: [
      {
        name: "Edit",
        count: 10,
        desc: "Cut, ripple delete and lift - it tells you what it really cut.",
        tools: ["Cut", "Cut All Tracks", "Ripple Delete", "Delete (Lift)", "Enable / Disable", "Link", "Unlink", "Select at Playhead", "Select Forward", "Mute Track"]
      },
      {
        name: "Transform",
        count: 11,
        desc: "Motion controls without opening Effect Controls.",
        tools: ["Center", "Scale 100", "Scale 1/2", "Scale x2", "Rotate +90", "Rotate -90", "Reset Motion", "Flip H", "Flip V", "Opacity 50", "Opacity 100"]
      },
      {
        name: "Position",
        count: 9,
        isGrid: true,
        desc: "Picture-in-picture: snap a scaled clip to nine places, with a margin.",
        tools: ["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"]
      },
      {
        name: "Effects",
        count: 9,
        desc: "Favourites, plus a search over every installed effect.",
        tools: ["Search...", "Gaussian Blur", "Drop Shadow", "Crop", "Transform", "Warp Stabilizer", "Ultra Key", "Sharpen", "Mosaic"]
      },
      {
        name: "Color",
        count: 4,
        desc: "Lumetri and the quick fixes.",
        tools: ["Lumetri Color", "Black & White", "Tint", "Brightness & Contrast"]
      },
      {
        name: "Transitions",
        count: 7,
        desc: "Video and audio, on the cut nearest your playhead.",
        tools: ["Cross Dissolve", "Dip to Black", "Dip to White", "Film Dissolve", "Push", "Constant Power", "Exponential Fade"]
      },
      {
        name: "Markers",
        count: 6,
        desc: "Coloured markers at the playhead.",
        tools: ["Marker", "Red", "Orange", "Yellow", "Blue", "Cyan"]
      },
      {
        name: "Playhead",
        count: 9,
        desc: "Jump between edits, mark in and out, export a frame.",
        tools: ["Next Edit", "Previous Edit", "Clip Start", "Clip End", "Mark In", "Mark Out", "In/Out -> Selection", "Export Frame", "Wheel Settings"]
      },
      {
        name: "Label",
        count: 8,
        desc: "Colour-code the selection.",
        tools: ["Violet", "Iris", "Caribbean", "Lavender", "Cerulean", "Forest", "Rose", "Mango"]
      }
    ],
    layouts: {
      "Default": ["Edit", "Transform", "Transitions", "Color", "Position", "Markers", "Playhead", "Effects"],
      "Rough Cut": ["Edit", "Playhead", "Markers", "Label", "Transform", "Color", "Transitions", "Effects"],
      "Audio & Finish": ["Transitions", "Effects", "Color", "Edit", "Playhead", "Position", "Transform", "Markers"]
    }
  },

  waysToDrive: [
    { key: "Control + ` hold", action: "Open, flick, release to fire. Rebind it to anything in Preferences." },
    { key: "... quick tap", action: "The wheel stays open, so you can click a tool instead." },
    { key: "Right-click and hold", action: "The same gesture on the mouse. Hold delay is adjustable (80-600 ms), and it can require a modifier key if you right-drag a lot." },
    { key: "Release on a segment", action: "Fires that segment's first tool - the fastest path to your most-used action. Optional." },
    { key: "Scroll while open", action: "Switch between your saved wheel layouts." },
    { key: "Esc / release in centre", action: "Cancel. Nothing happens." },
    { key: "Near a screen edge", action: "The wheel slides inward so it is always fully on screen, on any display." }
  ],

  licenseFeatures: [
    { title: "Lifetime", detail: "Pay once. All 1.x updates included." },
    { title: "2 computers", detail: "Work and home. After Effects and Premiere Pro on each count as one activation." },
    { title: "Moving machines", detail: "\"Deactivate this computer\", or \"Release other device\" if the old Mac is gone." },
    { title: "Offline", detail: "Keeps working for up to 14 days between check-ins. A server or network problem never locks a licensed copy." },
    { title: "Your work", detail: "Flex Wheel never changes a project except through the tool you fire." }
  ]
};
