# Test DEXCHANGE – Mini API de Transferts

API RESTful permettant de simuler des transferts d’argent avec audit, statuts et sécurisation par clé API.

---

## 🚀 Installation

### 1️⃣ Cloner le projet

```bash
git clone <repo-github-url>
cd dexchange
```


2️⃣ Installer les dépendances
```bash
npm install
```

3️⃣ Configurer les variables d'environnement

Créer un fichier .env basé sur .env.example

```bash
API_KEY=super-secret-key
MONGO_URI=your_mongodb_connection_string
```

4️⃣ Démarrer le serveur
```bash
npm run start:dev
```

Swagger ➜ http://localhost:3000/docs

🔑 Authentification API

Toutes les requêtes doivent contenir :

x-api-key: TON_API_KEY

📡 Endpoints
```bash
Méthode	Endpoint	Description
POST	/transfers	Créer un transfert
GET	/transfers	Lister les transferts
GET	/transfers/{id}	Récupérer un transfert
POST	/transfers/{id}/process	Traiter un transfert
POST	/transfers/{id}/cancel	Annuler un transfert
```

📝 Exemple pour POST /transfers
```bash
{
  "amount": 12500,
  "currency": "XOF",
  "channel": "WAVE",
  "recipient": {
    "phone": "+221770000000",
    "name": "Jane Doe"
  },
  "metadata": {}
}
```
🔄 Flow du transfert

PENDING lors de la création

/process → passe à SUCCESS ou FAILED

/cancel → possible uniquement si PENDING

🛠️ Stack Technique
Outil	Rôle
NestJS	Framework Node
MongoDB + Mongoose	Base de données
Swagger	Documentation API
class-validator	Validation DTO
Custom API Key Guard	Sécurité
