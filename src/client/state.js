var FooterState = (function () {
    function FooterState() {
        this.footerOpen = false;
    }
    return FooterState;
}());
export { FooterState };
var HeaderState = (function () {
    function HeaderState() {
        this.mobileMenuOpen = false;
    }
    return HeaderState;
}());
export { HeaderState };
export var initialState = {
    footer: new FooterState(),
    header: new HeaderState(),
};
//export const state$ = createState<AppState>(reducers, initialState);
//export const { connect, RxStateProvider } = createStateHelpers<AppState>();
