# Projet WEB (IT 103 / 2020/2021)
# Par Nada ABROUK & Wiame AMINE (T1)




## Objectif

Ce projet a pour objectif le développement d'une application web utilisant l'architecture dynamique côté serveur
Nous avons utiliser dans ce projets les technologies suivantes:

    * HTML
    * CSS / Bootstrap
    * SQLite
    * Jade 
    * Javascript (Node)


Pour mener à bien ce projet, une création de base de donnée a été nécessaire notamment pour gérer les utilisateurs du site, les posts mais aussi les commentaires (cf. détails partie Base de Donnée)
L'utilisation du moteur de recherche 'Jade' nous a été indispensable pour gérer les différentes pages du site en html,




## Fonctionnalités
------------------

    * Page d'accueil:
        * C'est la page principale du site, on y trouve les liens partagés (et une partie trending non implémentée qui devrait afficher les liens ayant eu le plus d'intéractions) mais aussi un en-tête contenant un menu vers les autres pages,
        * L'accés à cette page est restreint aux personnes connectées seulement, cela est géré dans le fichier server.js où on teste au début de chaque requête si une session est ouverte ou pas.
        * Le rendu de cette page a été géré dans le fichier home.jade, utilisant bootstrap mais aussi css (cf fichier public/main.css)
    
    
    * Page authentification
        * C'est la page de redirection par défaut au cas où l'utilisateur n'est pas connecté, on y trouve le formulaire de connexion, en plus d'un lien proposant de s'inscrire au cas où l'utilisateur n'est pas connecté.
        * L'accés aux utilisateurs est assuré par la table users dans la base de donnée créée, les champs sont testés pour vérifier si l'utilisateur a déjà un compte, un message d'erreur est affiché dans le cas contraire.
        * Une fois connecté, l'utilisateur peut accéder finalement aux différentes pages du site.
        * Le rendu de cette page a été géré dans un fichier login.jade.

    
     * Page inscription
        * Cette page contient un formulaire d'inscription dont la valeur des champs, une fois l formulaire envoyé, est analysée et enregistrée dans notre base de donnée, 
        * un lien pour aller vers la page d'authentification pour les personnes possédant déjà un compte.
        * Le rendu de cette page a été géré dans un fichier signup.jade.

    
    * Partage de liens, up/down vote, commentaire, visualisation de la page d'un lien
        * Le partage de lien se fait depuis la pge d'accueil (pour les personnes connectées exclusivelent), il se fait de la même manière que sur le site Facebook: un champ texte (form) à remplir, et un bouton share pour publier.
        * Les liens partagés sont visibles dans la page d'accueil, on peut les up/down voter, cette partie est gérée par un champ votes de la table posts dans la DB contenant les posts. des boutons upvote et downvote sont en dessous de chaque post.
        * Commenter les liens est aussi possible grace à la table comments de la DB, contenant les ID des posts correspondant aux commentaires. un champ comment se trouve en dessous de chaque lien qui permet aux utilisateurs de commenter le post et le publier.
        * L'accès à la pge d'un lien/post se fait en appuiant sur le bouton More, qui redirige l'utilisateur vers la page du lien (contenant le nombre de vote du lien)


    * Page de profil
        * Cette page n'est accessible qu'aux personnes connectées (redirection vers la page d'authentification sinon), on peut y voir les détails sur la personne connectée (pseudo + mail), mais aussi l'historique des liens up/down votés ou commenté (cette partie n'est pas implémentée)
        * Elle est accessible depuis le menu en haut de la page du site
        * Son rendu est géré par le fichier profile.jade




## Architecture
-----------------

### Fichiers.jade

    * src/views/home.jade:  

        Ce ficher permet de génerer le code html¶our la page d'accueil, on y trouve une partie pour l'affichage de l'en-tête, une partie pour le partage des liens, 
        et une autre contenant des boucles pour affciher tous les posts créés et partagés.

    * src/views/layout.jade

        Ce fichier sert à ne pas recopier une partie du code qui est censé être présente dans tous les templates jade: le HEAD.

    * src/views/login.jade

        Génère le code pour la page d'authentification, une gestion de formulaire bootstrap est utilisé pour récupérer les données saisies par les utilisateurs.

    * src/views/logout.jade

        Ce fichier sert à générer un message pour notifier l'utilisateur qu'il a bien été déconnecté.

    * src/views/post.jade

        On génère par ce fichier le rendu de la page du lien que l'utilisateur veut voir, 
        il contient un simple affichage de votes du lien en question, un paramètre votes est passé au fichier depuis server.js

    * src/views/profile.jade

        Des paramètres (pseudo et email) sont passés à ce fichier pour pouvoir générer la page de profil contenant des informations sur l'utilisateur connecté

    * src/views/share.jade

        Ce fichier concerne la partie partage de liens de la page d'accueil, il contient un formulaire permettant de récupérer le message que l'utilisateur veut poster ainsi qu'un titre pour le post.

    * src/views/signup.jade

        Génère de la même façon que le fichier login.jade du code html pour l'inscription, l'outil forms de bootstrap est utilisé (formulaire) pour récupérer les données.


### Fichiers.js

    * src/init.js

        Notre base de donnée est initialisée à l'aide de ce fichier, on y crée les 3 tables par les fonctions creatTables(), 
        les tables sont aussi initialisées par les données indiquées dans le sujet du projet.

    * src/db.js

        sert à la création du fichier main.db contenant la base de donnée

    * src/server.js

        C'est le fichier contenant le script serveur de notre application, il écoute par défaut sur le port 5000.
        Il fait appel au framework Express pour utiliser ses fonctionnalités pour la création de l'application web, et d'autres comme session, sqlite3, body-parser ... 
        Des requêtes GET/POST sont définies pour chaque route, pour répondre à la requête du client. 



