# LitterarIA

**English** · [Français](#fr)

A writing environment for novelists, where the manuscript stays a folder of plain files that
belong to you.

## The problem

A novel is not a document. It is chapters, scenes, character notes, abandoned drafts and
three versions of the same paragraph. The tools that exist are good, and that is what makes
the choice painful: each is good at one half of the problem. The question is which half you
give up.

**Word processors** lay out, track changes and print properly. On that ground they have no
rival. They do treat a book as one long file, though: no structure, no way to reorganise a
plot (moving a chapter means cutting and pasting forty pages and hoping nothing goes
missing), and a four-hundred-page document that fights you at every scroll.

**Dedicated writing suites** answer that. The binder, the corkboard, the session counter:
they invented more or less everything a novelist wants from a tool. They take the text in
exchange. The manuscript lives inside a proprietary bundle (`.scriv`, `.ulysses`, the name
hardly matters): years of work readable by one program, and only as long as that program
exists. My three novels are in that position.

## The position

LitterarIA takes the third deal. The folder on your disk is the manuscript, and its structure
is the structure of the book. Files are Markdown. Nothing is bundled, nothing is encoded,
nothing is held back.

Rename a chapter in Finder and the app follows. Open the same folder in any other editor, on
any machine, in ten years, and your text is still there and still yours. No account, no sync,
no server, because there is nothing to sync: the folder is the database.

## Where it is going

Two things follow from that principle, and they are what the product is for.

**Versioning a manuscript properly.** A novel is not written, it is rewritten. Every writer
keeps a `chapter-3-final-v2-REAL.md`, and every writer has lost a paragraph they wanted back.
The tool for that problem has existed for twenty years (it is called git) and nobody has made
it usable by someone who does not write code.

**Assistance that has read your book.** Not a chatbot handed three paragraphs of context: a
model working on your own corpus, your characters, your places, the voice you have already
set over three hundred pages, running locally on text that never leaves your machine.

This repository holds the editor core. It is the part that has no business being closed: any
serious writing tool has a file tree and a rich-text editor, and that is not where the
difference is made. What is being built on top is not here.

## How it is put together

Electron splits an application into three processes, and the split is the design.

| | |
|---|---|
| **main** (`src/electron`) | owns the file system. Reads, writes, watches. |
| **preload** | the only bridge. Exposes a narrow, explicit API to the page. |
| **renderer** (`src/renderer`) | React. Never touches a path, never opens a file. |

The renderer cannot reach `fs`, and that is deliberate: every capability it has was listed by
hand in the preload. A bug in a component cannot delete a chapter.

## What wasn't trivial

**The file system changes behind your back.** `chokidar` watches the workspace, so a file
renamed in Finder has to reach a React tree that believes it owns the state. The watcher is
the source of truth and the tree is a projection of it. Get that order wrong and you build an
interface that fights the disk.

**Rich text that persists as Markdown.** TipTap edits a document tree; the file on disk is
Markdown. Every round trip has to survive, which is why Monaco sits next to it: you can
always see what was actually written.

**A toolbar is not a row of buttons.** Each control has to reflect the state of the selection
(bold is active, this heading level is current, a link exists), so the toolbar subscribes to
the editor rather than commanding it.

## Running it

```bash
npm install
npm run dev        # Vite and Electron together
npm run package    # electron-builder
```

<a id="fr"></a>

## LitterarIA en français

[English](#litteraria) · **Français**

Un environnement d'écriture pour romanciers, où le manuscrit reste un dossier de fichiers
simples qui vous appartiennent.

### Le problème

Un roman n'est pas un document. Ce sont des chapitres, des scènes, des fiches de personnages,
des brouillons abandonnés et trois versions du même paragraphe. Les outils qui existent sont
bons, et c'est ce qui rend le choix pénible : chacun est bon à une moitié du problème. Reste
à savoir laquelle on sacrifie.

**Les traitements de texte** savent mettre en page, suivre des corrections, imprimer
proprement. Sur ce terrain ils n'ont pas de rival. Ils considèrent en revanche un livre comme
un long fichier : aucune structure, aucun moyen de réorganiser une intrigue (déplacer un
chapitre revient à couper-coller quarante pages en espérant que rien ne se perde en route),
et un document de quatre cents pages qui résiste à chaque défilement.

**Les suites d'écriture dédiées** répondent à ce manque. La structure, le tableau de liège, le
compteur de session : elles ont inventé à peu près tout ce qu'un romancier attend d'un outil.
Elles prennent le texte en échange. Le manuscrit vit dans un paquet propriétaire (`.scriv`,
`.ulysses`, le nom importe peu) : des années de travail lisibles par un seul programme, et
seulement tant que ce programme existe. Mes trois romans sont dans ce cas.

### La position

LitterarIA prend le troisième marché. Le dossier sur votre disque est le manuscrit, et sa
structure est celle du livre. Les fichiers sont du Markdown. Rien n'est empaqueté, rien n'est
encodé, rien n'est retenu.

Renommez un chapitre dans le Finder et l'application suit. Ouvrez le même dossier dans
n'importe quel autre éditeur, sur n'importe quelle machine, dans dix ans : votre texte est
toujours là et toujours à vous. Pas de compte, pas de synchronisation, pas de serveur, parce
qu'il n'y a rien à synchroniser : le dossier est la base de données.

### Là où ça va

Deux choses découlent de ce principe, et ce sont elles qui font le produit.

**Versionner un manuscrit pour de bon.** Un roman ne s'écrit pas, il se réécrit. Chaque auteur
garde un `chapitre-3-final-v2-VRAI.md`, et chaque auteur a perdu un paragraphe qu'il voulait
retrouver. L'outil qui résout ce problème existe depuis vingt ans (il s'appelle git) et
personne ne l'a rendu utilisable par quelqu'un qui n'écrit pas de code.

**Une assistance qui a lu votre livre.** Pas un agent conversationnel à qui l'on donne trois
paragraphes de contexte : un modèle qui travaille sur votre corpus, vos personnages, vos
lieux, la voix que vous avez déjà posée sur trois cents pages, et qui tourne en local, sur un
texte qui ne quitte pas votre machine.

Ce dépôt contient le cœur de l'éditeur. C'est la partie qui n'a aucune raison d'être fermée :
tout outil d'écriture sérieux a un arbre de fichiers et un éditeur de texte riche, et ce n'est
pas là que se joue la différence. Ce qui se construit par-dessus n'est pas ici.

### Comment c'est monté

Electron découpe une application en trois processus, et ce découpage est la conception.

| | |
|---|---|
| **main** (`src/electron`) | possède le système de fichiers. Lit, écrit, surveille. |
| **preload** | le seul pont. Expose à la page une API étroite et explicite. |
| **renderer** (`src/renderer`) | React. Ne touche jamais un chemin, n'ouvre jamais un fichier. |

Le rendu ne peut pas atteindre `fs`, et c'est voulu : chacune de ses capacités a été énumérée
à la main dans le preload. Un bug dans un composant ne peut pas effacer un chapitre.

### Ce qui n'était pas trivial

**Le système de fichiers change dans votre dos.** `chokidar` surveille le dossier : un fichier
renommé dans le Finder doit atteindre un arbre React qui se croit propriétaire de l'état. Le
surveillant est la source de vérité, l'arbre n'en est qu'une projection. Inversez cet ordre et
vous construisez une interface qui se bat contre le disque.

**Du texte riche qui se range en Markdown.** TipTap manipule un arbre de document ; le fichier
sur le disque est du Markdown. Chaque aller-retour doit survivre, et c'est la raison d'être de
Monaco à côté : on peut toujours voir ce qui a réellement été écrit.

**Une barre d'outils n'est pas une rangée de boutons.** Chaque contrôle doit refléter l'état de
la sélection (le gras est actif, tel niveau de titre est courant, un lien existe), donc la
barre s'abonne à l'éditeur au lieu de lui commander.

### Lancer

```bash
npm install
npm run dev        # Vite et Electron ensemble
npm run package    # electron-builder
```