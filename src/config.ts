export interface ServerConfig {
  host: string;
}

export const serverConfig: ServerConfig = {
  host: process.env.SERVER_HOST,
};

export const googleMapsApiKey: string = process.env.GOOGLE_MAPS_KEY;
