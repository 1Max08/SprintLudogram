
import axios from 'axios';

const api = axios.create({
  // Adresse du backend : toutes les requêtes `api.get/post(...)`
  // seront préfixées par ce `baseURL`.
  baseURL: 'http://localhost:4000/api',
  // `withCredentials: true` permet d'envoyer les cookies (session)
  // ce qui est utile si le backend utilise des cookies pour l'auth.
  withCredentials: true,
});

export default api;
