
import { Theme } from "../models/types";

export const themes: Record<string, Theme> = {
  nordPolar: {
    id: 'nordPolar',
    name: 'Nord Polar',
    primaryColor: '#88C0D0',
    secondaryColor: '#81A1C1',
    backgroundColor: '#2E3440',
    textColor: '#ECEFF4',
    accentColor: '#5E81AC'
  },
  githubDark: {
    id: 'githubDark',
    name: 'GitHub Dark',
    primaryColor: '#58A6FF',
    secondaryColor: '#388BFD',
    backgroundColor: '#0D1117',
    textColor: '#C9D1D9',
    accentColor: '#238636'
  },
  solarizedLight: {
    id: 'solarizedLight',
    name: 'Solarized Light',
    primaryColor: '#2AA198',
    secondaryColor: '#268BD2',
    backgroundColor: '#FDF6E3',
    textColor: '#657B83',
    accentColor: '#D33682'
  }
};

export const defaultTheme = themes.nordPolar;
