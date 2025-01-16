export type ProjectRouteParams = {
    id?: string | null; // id is optional in case it's not provided
};

export type RootStackParamList = {
    Home: undefined;
    LocationDetail: ProjectRouteParams;
    ProductDetail: ProjectRouteParams;
    Locations: undefined;
    Products: undefined;
};