export const format = (node: HTMLInputElement, formatFunction: (x: string) => string) => {
    function updateValue() {
        node.value = formatFunction(node.value)
    }

    node.addEventListener('change', updateValue)
    node.addEventListener('paste', updateValue)

    // Format on intial hydration
    node.value = formatFunction(node.value)

    return {
        destroy() {
            node.removeEventListener('change', updateValue)
            node.removeEventListener('paste', updateValue)
        },
    }
}

// export const gain = (x: string) => {
//     return parseFloat(x).toFixed(1)
// }

// export const none = (x: string) => x

export interface NumberFormatter {
    into: (x: number) => string
    from: (x: string) => number
}

export function gain(): NumberFormatter {
    return {
        into: (x: number) => x.toFixed(2) || '0.0',
        from: (x: string) => parseFloat(x) || 0,
    }
}

export function squish(): NumberFormatter {
    return {
        into: (x: number) => x.toFixed(1) || '1.0',
        from: (x: string) => parseFloat(x) || 0,
    }
}

export function freq(): NumberFormatter {
    return {
        into: (x: number) => parseFloat(x as any).toFixed(0) || '440.0',
        from: (x: string) => parseFloat(x) || 440,
    }
}

export function phase(): NumberFormatter {
    return {
        into: (x: number) => parseFloat(x as any).toFixed(0) || '0',
        from: (x: string) => parseFloat(x) || 0,
    }
}

export function freqDelta(): NumberFormatter {
    return {
        into: (x: number) => parseFloat(x as any).toFixed(0) || '0',
        from: (x: string) => parseFloat(x) || 0,
    }
}
