# Flashcards

Simple fullscreen flashcards from `QNA.txt`. Tap a card to flip it. Next (or swipe left) shows another random card.

No login. Mobile-first. Deployable on Vercel.

## Cards

Edit `QNA.txt`. Separate cards with a line that is only `---`. First paragraph is the question; the rest is the answer.

```
What is 2 + 2?
4.

---

Name a primary color.
Red, blue, or yellow.
```

## Local

Open with any static server from this folder:

```bash
python3 -m http.server 4173
```

Then visit http://localhost:4173

## Vercel

Import the repo in [Vercel](https://vercel.com/new). Framework preset can stay Other / no build. Output is the repo root.
