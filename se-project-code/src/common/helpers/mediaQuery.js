
const mediaScreenSize = {
    desktopMin: "57.5em",
    mobileMax: "57.5em",
    mobileSmallMax: "20em"
}

const media = {
    desktop: `@media (min-width: ${mediaScreenSize.mobileMax})`,
    // tabs: "@media (min-width: ${mediaScreenSize.mobileMax}",
    mobile: `@media (max-width: ${mediaScreenSize.mobileMax})`,
    mobileSmall: `@media (max-width: ${mediaScreenSize.mobileSmallMax})`
}

export { media, mediaScreenSize };