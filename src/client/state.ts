export interface AppState {
    footer: FooterState;
    header: HeaderState;
}

export class FooterState {
    footerOpen: boolean = false;
}

export class HeaderState {
    mobileMenuOpen: boolean = false;
}

export const initialState: AppState = {
    footer: new FooterState(),
    header: new HeaderState(),
};

//export const state$ = createState<AppState>(reducers, initialState);
//export const { connect, RxStateProvider } = createStateHelpers<AppState>();
