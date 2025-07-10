# Floway 🏃‍♂️

[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

Floway est une application mobile de running qui révolutionne l'expérience de course à pied en combinant performance et motivation. Notre mission est de rendre chaque course plus engageante grâce à un système unique d'envoi d'audios entre amis pendant vos courses et de coaching personnalisé.

## 🌟 Fonctionnalités

### 🎯 Performance & Suivi

- 🏃‍♂️ Suivi en temps réel de vos courses
- 📊 Statistiques détaillées de vos performances
- 🗺️ Intégration de cartes pour visualiser vos parcours
- 🎯 Objectifs personnalisés et challenges

### 💪 Motivation & Social

- 🎙️ Envoi de messages vocaux en temps réel à vos amis pendant leur course
- 🎧 Coaching vocal personnalisé pendant vos courses
- 🌟 Deux modes de motivation :
  - 👨‍👩‍👧‍👦 Mode Social : Recevez des encouragements de vos proches
  - 👨‍🏫 Mode Coach : Bénéficiez des conseils de coachs professionnels

### 📱 Interface & Expérience

- 🎨 Interface utilisateur intuitive et moderne
- 🎵 Intégration de playlists personnalisées
- 🔔 Notifications intelligentes basées sur vos performances
- 🌙 Mode nuit pour les courses nocturnes

### Amis

- **Gestion des amis** : Ajouter, supprimer, accepter/refuser des demandes
- **Statut en direct** : Voir quels amis sont en train de courir
- **Recherche d'utilisateurs** : Trouver de nouveaux amis
- **Polling automatique** : Mise à jour en temps réel du statut des amis

### Sessions de course

- Démarrer une nouvelle session
- Suivre les métriques en temps réel
- Historique des courses

### Interface

- Design moderne et intuitif
- Navigation par onglets
- Composants réutilisables

## 🛠️ Stack Technique

- **Framework**: React Native avec Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Stores**: Zustand

## 🚀 Installation

1. Clonez le repository

   ```bash
   git clone https://github.com/deleusec/floway-front
   cd floway
   ```

2. Installez les dépendances

   ```bash
   npm install
   ```

3. Lancez l'application
   ```bash
   npm run start
   ```

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

Contact Equipe Floway : floway.dev@gmail.com

Lien du projet: [https://github.com/deleusec/floway-front](https://github.com/deleusec/floway-front)

## 🛠️ Architecture

### Stores (Zustand)

- `auth.ts` : Authentification utilisateur
- `friends.ts` : Gestion des amis et demandes
- `session.ts` : Sessions de course
- `cheer.ts` : Système d'encouragement

### Hooks personnalisés

- `useSpeechManager.ts` : Gestion de la reconnaissance vocale
- `useStorageState.ts` : Persistance des données

### Composants

- **UI** : Composants de base (Button, Input, Card, etc.)
- **Layouts** : Composants de mise en page (Header, Menu, etc.)
- **Friends** : Composants spécifiques aux amis

## 📱 Pages principales

- **Accueil** (`/`) : Vue d'ensemble avec statut des amis
- **Amis** (`/friends`) : Gestion complète des amis
- **Session** (`/session/*`) : Démarrer et gérer les courses
- **Encouragement** (`/cheer`) : Encourager les amis en course

## 🔧 Configuration

L'application utilise les variables d'environnement définies dans `constants/env.ts`.

## 📚 API

L'application communique avec le backend via les stores Zustand qui gèrent directement les appels API avec authentification automatique.
