/* eslint-disable */
import MipmapElement from '../../phet-core/js/MipmapElement.js';

// The levels in the mipmap. Specify explicit types rather than inferring to assist the type checker, for this boilerplate case.
const mipmaps = [
  new MipmapElement( 148, 101, 'data:image/png;base64,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' ),
  new MipmapElement( 74, 51, 'data:image/png;base64,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' ),
  new MipmapElement( 37, 26, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAaCAYAAAAwspV7AAAAAklEQVR4AewaftIAAAI9SURBVM3Bb0sTcQDA8e/9dps3o03qRAOdIZZGK92kCETBRPCJUE8DX4IPrKDA1+DzegX2XLCn4nygiyy1f+ADISfezam3zdud2y5jDwY+msv9Aj8f5ezs7BvQwRWiAteBMFeIQJJk0sO2kUIgwanrklybR9OQQiDB5/V1eu48wedDCoEEX9e/MDzcgyyCBm1vbxMfjOO6SCNo0EpihVgsRrmMNCoNsCyLcEuYJk0jjDyCBiSWlxkZGaHCNJFGcEmlUol0Oo2u61ToOtIILmljY4OhoSGqXBdpBHWyLIvz1lZX6e3ro8rzkEalDp7n8fqVxdhYngcPoSngEo1GURSFqlAIaQR1+PHdwPvTxY2bnSwudvLypcZuqoPDzDFVpok0gjosLHjEYgquC/v7kD/pZHa2h7u9AebmdrBtG11HGsEFDCND8lMr3d2QSoFpQjYLhQLk89f49TNAc3Mzto00ggssLbkMDATx+WBvDw4PIZeD01PwPJia8lAUBZkENTiOw4d5jWgUDAMMA46PoVCAYhEG4xkePW6lIhRCGkENyeQBkS6dUAhSKchkIJcDx4FyGWZmXILBIBWmiTSCGjY3bfr7y1gWGAYcHcHJCRSL0BRwGH2qUdXWhjSCGqan7zE+foDf/5t0Ok82C44DpRK8eXtAe7tOVS6HNCoXiERuEYnA6GiWRGKX9+9UFj+28/yZ4DwhkEalTi0tYSYnw0xMlNja2uF+9Dbn6TrSqPwjv99PPN7N/6QCLwCNK+QvXEDK4nNGQ2MAAAAASUVORK5CYII=' ),
  new MipmapElement( 19, 13, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAANCAYAAABLjFUnAAAAAklEQVR4AewaftIAAAD8SURBVKXBz0rCcADA8e9+23JrIyPanzdonjx4qTfwlCfv9RT1MPUogRAUeNvBi9FOYsncDHKCaVt0iTHI/aLPRymKYgYc8H93GtAADH6R5znjcUoQHFNjT1AjiiIcx0KGoEaWZRiGiQzBDnEc4/s+ioIUwQ4v0yme5yEEUgQVRVEwHCbM528YpslfaFREz++E4RG3Nx+02y62ndFsWsgQVDw8gq4rjJ8aXF0fkqZbZGmULBYr0sTkdQaTCfTOl7RaNus1UgQlmw2cBCtGoy1JAheXn6iqihBI0Shx3X26Xeh0MgaDJWenBt9UFSkacA9YlDiORb/PD11HRvgF9nRL1guER9wAAAAASUVORK5CYII=' ),
  new MipmapElement( 10, 7, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAYAAAAxrNxjAAAAAklEQVR4AewaftIAAAB4SURBVH3BMQrCMBiG4dfkI4ilYE7QW+SC3Vw8U3Hr2oNEkCIY2r8dOogEn+dkZi/gzGGePzRN4MfNAQIECFDOWYAAAQIEOMeXZ87EGKlxHKbpzTiumHlqHLtSFoZB9P2VUlZqxM4MUlroukLbXqgRcA/BKyXPH48NZvsj0/x8I5gAAAAASUVORK5CYII=' )
];

export default mipmaps;