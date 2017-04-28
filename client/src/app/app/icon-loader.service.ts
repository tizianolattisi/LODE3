import {Injectable} from "@angular/core";

declare let UIkit: any;

@Injectable()
export class IconLoader {

  constructor() {

    console.log('Load icons');
    UIkit.icon.add({
      'cursor': '<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z" /></svg>',
      'pencil': '<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M16.84,2.73C16.45,2.73 16.07,2.88 15.77,3.17L13.65,5.29L18.95,10.6L21.07,8.5C21.67,7.89 21.67,6.94 21.07,6.36L17.9,3.17C17.6,2.88 17.22,2.73 16.84,2.73M12.94,6L4.84,14.11L7.4,14.39L7.58,16.68L9.86,16.85L10.15,19.41L18.25,11.3M4.25,15.04L2.5,21.73L9.2,19.94L8.96,17.78L6.65,17.61L6.47,15.29" /></svg>',
      'rectangle-plus': '<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M19,6H22V8H19V11H17V8H14V6H17V3H19V6M17,17V14H19V19H3V6H11V8H5V17H17Z" /></svg>',
      'circle-plus':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M11,19A6,6 0 0,0 17,13H19A8,8 0 0,1 11,21A8,8 0 0,1 3,13A8,8 0 0,1 11,5V7A6,6 0 0,0 5,13A6,6 0 0,0 11,19M19,5H22V7H19V10H17V7H14V5H17V2H19V5Z" /></svg>',
      'arrow-plus':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" /></svg>',
      'text-plus':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" /></svg>',
      'comment-plus':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z" /></svg>',
      'highlight-plus':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M18.62,1.5C18.11,1.5 17.6,1.69 17.21,2.09L10.75,8.55L14.95,12.74L21.41,6.29C22.2,5.5 22.2,4.24 21.41,3.46L20.04,2.09C19.65,1.69 19.14,1.5 18.62,1.5M9.8,9.5L3.23,16.07L3.93,16.77C3.4,17.24 2.89,17.78 2.38,18.29C1.6,19.08 1.6,20.34 2.38,21.12C3.16,21.9 4.42,21.9 5.21,21.12C5.72,20.63 6.25,20.08 6.73,19.58L7.43,20.27L14,13.7" /></svg>',

      'search':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>',
      'chevron-left':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>',
      'chevron-right':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>',

      'line-width':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M3,17H21V15H3V17M3,20H21V19H3V20M3,13H21V10H3V13M3,4V8H21V4H3Z" /></svg>',
      'select-off':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M1,4.27L2.28,3L21,21.72L19.73,23L17,20.27V21H15V19H15.73L5,8.27V9H3V7H3.73L1,4.27M20,3A1,1 0 0,1 21,4V5H19V3H20M15,5V3H17V5H15M11,5V3H13V5H11M7,5V3H9V5H7M11,21V19H13V21H11M7,21V19H9V21H7M4,21A1,1 0 0,1 3,20V19H5V21H4M3,15H5V17H3V15M21,15V17H19V15H21M3,11H5V13H3V11M21,11V13H19V11H21M21,7V9H19V7H21Z" /></svg>',
      'text-select':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z" /></svg>',
      'delete':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>',

      'note-edit':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M18,14V12H12.5L10.5,14H18M6,14H8.5L15.35,7.12C15.55,6.93 15.55,6.61 15.35,6.41L13.59,4.65C13.39,4.45 13.07,4.45 12.88,4.65L6,11.53V14Z" /></svg>',
      'video':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" /></svg>',

      'play':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>',
      'pause':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>',
      'volume-high':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>',
      'volume-off':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" /></svg>',
      'expand':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z" /></svg>',

      'plus':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>',
      'presentation':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M2,3H10A2,2 0 0,1 12,1A2,2 0 0,1 14,3H22V5H21V16H15.25L17,22H15L13.25,16H10.75L9,22H7L8.75,16H3V5H2V3M5,5V14H19V5H5Z" /></svg>',
      'comment-multiple':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7C5,5.89 5.9,5 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.9 12.75,23 12.5,23V23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15Z" /></svg>',

      'user':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>',
      'mail':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V8L12,13L20,8V18M20,6L12,11L4,6V6H20V6Z" /></svg>',
      'sign-out':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M17,17.25V14H10V10H17V6.75L22.25,12L17,17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z" /></svg>',
      'sign-in':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M10,17.25V14H3V10H10V6.75L15.25,12L10,17.25M8,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H8A2,2 0 0,1 6,20V16H8V20H17V4H8V8H6V4A2,2 0 0,1 8,2Z" /></svg>',
      'lock':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" /></svg>',
      'cloud-download':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M17,13L12,18L7,13H10V9H14V13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" /></svg>',
      'list':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M5,9.5L7.5,14H2.5L5,9.5M3,4H7V8H3V4M5,20A2,2 0 0,0 7,18A2,2 0 0,0 5,16A2,2 0 0,0 3,18A2,2 0 0,0 5,20M9,5V7H21V5H9M9,19H21V17H9V19M9,13H21V11H9V13Z" /></svg>',
      'close':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>',
      'pencil-off':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M18.66,2C18.4,2 18.16,2.09 17.97,2.28L16.13,4.13L19.88,7.88L21.72,6.03C22.11,5.64 22.11,5 21.72,4.63L19.38,2.28C19.18,2.09 18.91,2 18.66,2M3.28,4L2,5.28L8.5,11.75L4,16.25V20H7.75L12.25,15.5L18.72,22L20,20.72L13.5,14.25L9.75,10.5L3.28,4M15.06,5.19L11.03,9.22L14.78,12.97L18.81,8.94L15.06,5.19Z" /></svg>',
      '':'<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></svg>',


    });

  }
}
