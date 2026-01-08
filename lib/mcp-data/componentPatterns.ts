// Apple UI Component Patterns Library
export const componentPatterns = {
  buttons: {
    filled: {
      description: 'Primary action button with filled background',
      usage: 'Primary CTAs, prominent actions',
      styles: {
        minHeight: 44,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        fontWeight: 600,
        fontSize: 17,
      },
      variants: {
        default: { background: 'systemBlue', text: 'white' },
        destructive: { background: 'systemRed', text: 'white' },
        gray: { background: 'fill.tertiary', text: 'label.primary' },
      },
      states: {
        hover: { opacity: 0.85 },
        pressed: { scale: 0.97, opacity: 0.8 },
        disabled: { opacity: 0.4 },
      },
    },
    gray: {
      description: 'Secondary button with gray background',
      usage: 'Secondary actions, less prominent options',
      styles: {
        background: 'fill.tertiary',
        minHeight: 44,
        paddingHorizontal: 16,
        borderRadius: 12,
      },
    },
    plain: {
      description: 'Text-only button',
      usage: 'Tertiary actions, inline links',
      styles: {
        color: 'systemBlue',
        fontWeight: 400,
        fontSize: 17,
      },
    },
    tinted: {
      description: 'Button with tinted background',
      usage: 'Actions that need attention but aren\'t primary',
      styles: {
        background: 'systemBlue @ 15%',
        color: 'systemBlue',
        borderRadius: 12,
      },
    },
  },

  cards: {
    standard: {
      description: 'Content card with rounded corners',
      styles: {
        background: 'background.secondary',
        borderRadius: 12,
        padding: 16,
        shadow: 'level1',
      },
    },
    inset: {
      description: 'Card for grouped content in lists',
      styles: {
        background: 'background.tertiary',
        borderRadius: 10,
        marginHorizontal: 16,
      },
    },
    material: {
      description: 'Card with blur material background',
      styles: {
        material: 'regular',
        borderRadius: 16,
        padding: 16,
      },
    },
  },

  lists: {
    insetGrouped: {
      description: 'iOS-style inset grouped list',
      usage: 'Settings, forms, grouped content',
      styles: {
        background: 'background.grouped',
        groupBackground: 'background.groupedSecondary',
        borderRadius: 10,
        marginHorizontal: 16,
        separatorInset: 60,
      },
    },
    plain: {
      description: 'Full-width list',
      usage: 'Content lists, data display',
      styles: {
        background: 'background.primary',
        separatorInset: 16,
      },
    },
    sidebar: {
      description: 'macOS-style sidebar list',
      usage: 'Navigation, hierarchical content',
      styles: {
        rowHeight: 28,
        iconSize: 18,
        cornerRadius: 6,
        selectedBackground: 'fill.tertiary',
      },
    },
  },

  navigation: {
    tabBar: {
      description: 'Bottom tab bar for iOS',
      styles: {
        height: 49,
        iconSize: 25,
        labelSize: 10,
        material: 'chrome',
      },
      guidelines: [
        'Maximum 5 tabs',
        'Use SF Symbols for icons',
        'Keep labels short (1 word)',
        'Highlight active tab with tint color',
      ],
    },
    navigationBar: {
      description: 'Top navigation bar',
      styles: {
        height: 44,
        largeTitleHeight: 96,
        material: 'chrome',
        titleSize: 17,
        largeTitleSize: 34,
      },
    },
    sidebar: {
      description: 'macOS/iPad sidebar navigation',
      styles: {
        width: 240,
        minWidth: 180,
        maxWidth: 400,
        material: 'thin',
      },
    },
  },

  inputs: {
    textField: {
      description: 'Standard text input field',
      styles: {
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        background: 'fill.tertiary',
        fontSize: 17,
        placeholderColor: 'label.tertiary',
      },
    },
    searchBar: {
      description: 'Search input with icon',
      styles: {
        height: 36,
        borderRadius: 10,
        background: 'fill.tertiary',
        iconSize: 17,
        fontSize: 17,
      },
    },
    toggle: {
      description: 'On/off switch',
      styles: {
        width: 51,
        height: 31,
        borderRadius: 15.5,
        onColor: 'systemGreen',
        offColor: 'fill.secondary',
      },
    },
    slider: {
      description: 'Continuous value slider',
      styles: {
        trackHeight: 4,
        thumbSize: 28,
        thumbShadow: 'level2',
        minTrackColor: 'systemBlue',
        maxTrackColor: 'fill.secondary',
      },
    },
    segmentedControl: {
      description: 'Multi-option selector',
      styles: {
        height: 32,
        borderRadius: 8,
        background: 'fill.tertiary',
        selectedBackground: 'background.primary',
        selectedShadow: 'level1',
      },
    },
  },

  modals: {
    sheet: {
      description: 'Bottom sheet modal',
      styles: {
        borderRadius: { top: 12 },
        maxHeight: '95%',
        material: 'thick',
        grabberWidth: 36,
        grabberHeight: 5,
      },
      sizes: {
        medium: { detent: 0.5 },
        large: { detent: 0.99 },
        custom: { detent: 'fitsContent' },
      },
    },
    alert: {
      description: 'Alert dialog',
      styles: {
        width: 270,
        borderRadius: 14,
        background: 'material.thick',
        titleSize: 17,
        messageSize: 13,
        buttonHeight: 44,
      },
    },
    popover: {
      description: 'Contextual popover',
      styles: {
        borderRadius: 12,
        shadow: 'level2',
        arrowSize: 12,
        maxWidth: 400,
      },
    },
  },

  feedback: {
    activityIndicator: {
      description: 'Loading spinner',
      styles: {
        size: { small: 20, large: 36 },
        color: 'label.tertiary',
      },
    },
    progressBar: {
      description: 'Determinate progress indicator',
      styles: {
        height: 4,
        borderRadius: 2,
        trackColor: 'fill.tertiary',
        progressColor: 'systemBlue',
      },
    },
    toast: {
      description: 'Brief message notification',
      styles: {
        borderRadius: 10,
        padding: 16,
        material: 'regular',
        maxWidth: 350,
      },
    },
  },
};

export type ComponentType = keyof typeof componentPatterns;
