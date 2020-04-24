/* eslint-disable */
import SimLauncher from '../../joist/js/SimLauncher.js';
const mipmaps = [
  {
    "width": 148,
    "height": 101,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 74,
    "height": 51,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 37,
    "height": 26,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAaCAYAAAAwspV7AAAAAklEQVR4AewaftIAAAPlSURBVM3BW0xbBQCA4b+Hc1oOkyIMWqBQLgPk5gaEgNlcQSZDYgYOSAZxos7Li+xh+ibxkqgP7mHqwxQ1Jhr1YZqYSTLGboyhyGJIDDI37kUK5dKxpp3QYluO4cFkIUtpoST7PpWiKH1AIg8QEUgEjDxABELA7Yb2dhsuF0Gx2+0MjQ2xnkAIhIV5mZu7yPW+qwTK4XTwdG8NZ2Z+YD2BEBgaukVDfTV5+XlcvnSJjSwsLtDSf5yDEU/yUuYx1hMIgdnZWWJ2xqDT6SgoKOBCZyeKonA/lnkLzw28QLFQTOv+N0lKTGI9gS2y2+3E6/X8LzYujpLSUjo6OvD5fKxxOhysGZ4cpvGvZzkqN3Hc1IIkSdyPyBb9OTDA3n37uFd0dDQmk4kLnZ3kx8cjNzZx8eO3OaZ+h9NRH1FbUoM/AluwurqK1+dDkiTWi4yMJC02HrH1JAP7l2nSvMEnthZqS2rYiMgWjI6MkJ+fz71stgXc7jnc7pv4pGt4Tw8wfONfOttkHj3Xynh0Nruqq/FHZBOWlpaQZZnBwQFKH9vF1NQvCMJN4Czh4X+gUlUQEVHFXfsjzHZmYHIbMLraUeJ+x3fnDhsRCdL4eBcq1VvI8iLlT4zjch1CEExACYrSgCDEk5QUwxqDAUYdV1AmV1msbGDl5SPkHK5lIyJB8Hg8SJKW5eVX6O9XqKqqIzY2Cn8yKw8wcq0Ht7ST3L1FBEIkCJIkYTQWA8XMzFwhKiqKQGSVmQiGwCZMTEyQmZnJdhEIgNVq48sv/mZsbBqPx4N5wozRaGS7iASgu3sFlZBCXx+cOjVHWmoM2dkLGJJ0OJ0Opqa+QpJWSUh4Fa1Wy1YJbGB52cX58+EkJIDFApOT8XzWVsgzh+/S0/MubnceGs11wsJ2o9VqCQWRDfT33yYrKxmPB6xW0OluceLETxQUfMD8/Ot4PF1kZGSiUqkIFQE/FEXh57MCOTkwPQ39GScxvPg448LnHHjtDD5fMwZDFiqVilAS8WNkZJZll54dO2BmBpTBOtqsu3Gk3kBz9EMKbGPUXzZRHllGvjaPlIdSMOgNqNVqtkLEj+6rSxQViSwugtUKK9MZ0JcBjqfo6j1CaroGi32K0X9GOWfr4FvLj0hDYTSq69B5dBxMr2RP+h6CJeJH8/NJmM0WfuuF+flYnE4ZtxvKyxYoLNSjVqvRx+koppgmmnh/5T2sC1bMTjPfmb/HN+EjKyELWZYJhogfsiyTm5tMbi4cqrlN76+LfP2NQHOzF7VazXoajYa05DTSSKMir4LNEgmQXh9LXT3U1Hrxer1sJxH4FHiYAImiiCiKbKf/AK2VWv4PqVi9AAAAAElFTkSuQmCC"
  },
  {
    "width": 19,
    "height": 13,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAANCAYAAABLjFUnAAAAAklEQVR4AewaftIAAAGcSURBVKXBPWsTYQDA8f89z3MkuctLDZirMW0SM5RCQVEEwZdFKOJah266GPoR/Bg6+wVcuzkpdKlLW5pkiKdCbaBtaEFDzfXaa+6xGQLH0TSCv5+hte4AGf7fZwVkgBxjnJ9rvqy3efR4nrj2fhtTmNScGhdswQTd7h5375VxXRetNSOtvRZbB1uUpkqMKCYIggDLsqhWq7iui9P3aCZ/0dMnLN9ZxjAMRgRX8DwP27YZ8v0/pNQBXzdf462+5enNhxiGQZRijKOjDfr9BkJoOh2DdNrBnipiyzfMHn+DwYA4xSXCMETKPL7/gLm5eaKspVto4xmpTJo4Rczp6Rnd7gmmmaRcvkFcKptlHEVMo+HTauVYWxuwsrJDsfiJROIJhcICkygitNZsb8O+1+X28/f4Z9MUCq9IJCz+hSJid7dHGOZorpt8tJZ4V2/yo/EBKRXl/CwzyRlq0zXGUUSUShkWF48ZurZxnZf3XyCEIAxDDn8fstP7SWVQQUrJZRTQAGwuSCmpVLLU6xAEAUIIhoQQOHkHJ+9whe9/AQOthdJiuqIBAAAAAElFTkSuQmCC"
  },
  {
    "width": 10,
    "height": 7,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAYAAAAxrNxjAAAAAklEQVR4AewaftIAAAC3SURBVG3BsWrCQBzA4V/uLj0PhzoUF0E6dBBKsS+UF+izuLm5dy04O7n5AE7iIKKLOCSDpxe8/k0ghQz9vkREcsDSyPMLvV6Xmg+eJElwT25iAAt0aIiUnM9X1G9gF058DsZUjKKlKLbEuAPZs/+e8vEyQilFzdDwviQER7//Ru35653UWv4oKiLCzzywWG4oii211FraFJXb7Y7cNbEz5OAD6+MaEaHNADPnUpNlKTG+orXmH6sHF59C07rkqZsAAAAASUVORK5CYII="
  }
];
mipmaps.forEach( mipmap => {
  mipmap.img = new Image();
  const unlock = SimLauncher.createLock( mipmap.img );
  mipmap.img.onload = unlock;
  mipmap.img.src = mipmap.url; // trigger the loading of the image for its level
  mipmap.canvas = document.createElement( 'canvas' );
  mipmap.canvas.width = mipmap.width;
  mipmap.canvas.height = mipmap.height;
  const context = mipmap.canvas.getContext( '2d' );
  mipmap.updateCanvas = () => {
    if ( mipmap.img.complete && ( typeof mipmap.img.naturalWidth === 'undefined' || mipmap.img.naturalWidth > 0 ) ) {
      context.drawImage( mipmap.img, 0, 0 );
      delete mipmap.updateCanvas;
    }
  };
} );
export default mipmaps;