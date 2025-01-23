export type ProjectRouteParams = {
    id?: string | null; // id is optional in case it's not provided
};


export type RootStackParamList = {
    Home: undefined;
    LocationDetail: ProjectRouteParams;
    ProductDetail: {
        id?: string | null; // id is optional in case it's not provided
        showQrCode?: boolean;
    };
    Locations: undefined;
    Products: undefined;
    SaleHome: {
        toggleQRScanner?: boolean,
        showLocationModal?: boolean
    };
    Reporting: undefined;
    OneDayReport: undefined;
};