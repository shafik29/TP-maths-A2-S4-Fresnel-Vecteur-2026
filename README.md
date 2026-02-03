# Animation Vecteur de Fresnel

Application pédagogique interactive pour la représentation de signaux sinusoïdaux et leurs vecteurs de Fresnel.

## Auteur

**M. BEN AHMED**
Email: shafik.ben-ahmed@ac-nice.fr

## Licence

© 2026 - Licence Creative Commons (CC BY-NC-SA)

## Déploiement sur GitHub Pages

### Étapes pour déployer votre application

1. **Créez un dépôt GitHub**
   - Allez sur [GitHub](https://github.com) et créez un nouveau dépôt
   - Ne cochez pas "Initialize with README" (nous avons déjà nos fichiers)

2. **Initialisez votre dépôt local et poussez le code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
   git push -u origin main
   ```

3. **Activez GitHub Pages dans les paramètres du dépôt**
   - Allez dans **Settings** > **Pages**
   - Dans **Source**, sélectionnez **GitHub Actions**

4. **Le déploiement se lance automatiquement**
   - Le workflow GitHub Actions se déclenche automatiquement à chaque push sur `main`
   - Vous pouvez suivre la progression dans l'onglet **Actions** de votre dépôt
   - Une fois terminé, votre site sera accessible à : `https://VOTRE-USERNAME.github.io/VOTRE-REPO/`

### Fichiers de configuration créés

- **vite.config.js** : Configuration Vite pour GitHub Pages
- **.github/workflows/deploy.yml** : Workflow de déploiement automatique
- **public/.nojekyll** : Fichier nécessaire pour GitHub Pages

## Développement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Créer le build de production
npm run build

# Prévisualiser le build
npm run preview
```

## Technologies utilisées

- Vite
- JavaScript (Canvas API)
- HTML5 / CSS3
- Google Fonts (Inter, JetBrains Mono)
