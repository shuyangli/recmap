export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const encodedFirebaseApiKey: string = "UVVsNllWTjVSRzFqT0dGalZrTnBORTFmZUZWMGRUUXpVSFZyYVZVME9VNVRaSEpJWlVGWg==";

export const firebaseConfig: FirebaseConfig = {
  apiKey: atob(atob(encodedFirebaseApiKey)),
  authDomain: "gourmand-9b5e5.firebaseapp.com",
  databaseURL: "https://gourmand-9b5e5.firebaseio.com",
  projectId: "gourmand-9b5e5",
  storageBucket: "gourmand-9b5e5.appspot.com",
  messagingSenderId: "177369691981",
  appId: "1:177369691981:web:09e30b5d84a7d2686fe904",
};

const encodedGoogleMapsApiKey: string = "UVVsNllWTjVRVlJXVERkUFJrTlJiVnAzZFRKWWVqaFdVMDl5YUd0NlJFbzBNMHA2TVMxUg==";

export const googleMapsApiKey: string = atob(atob(encodedGoogleMapsApiKey));
