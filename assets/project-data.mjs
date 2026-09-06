export const projects = {
  life: {
    title: 'Un universo in C.', meta: '01 / CREATIVE CODING / AGOSTO 2026',
    description: 'Un Game of Life con due versioni del sorgente: una offuscata, una leggibile e commentata.',
    notes: [
      ['Il problema', 'Rappresentare una griglia che evolve senza aggiornare le celle in modo sequenziale: ogni nuova generazione deve dipendere soltanto da quella precedente.'],
      ['La soluzione nel codice', 'Due buffer separano gli stati. Il pattern iniziale è codificato con maschere di bit; gli indici si avvolgono ai bordi. Il Makefile include un target check che confronta l’output delle due versioni con cmp.'],
      ['La demo che hai provato', 'È una nuova implementazione JavaScript delle regole di Conway B3/S23, con un Gosper glider gun standard su una griglia 80 × 40. Il progetto C originale usa una griglia 80 × 24. La demo non è il programma C compilato.'],
      ['Competenze applicate', 'C99, griglie, operazioni bit a bit, doppio buffer, compilazione con Make e confronto dell’output. La presenza del target di verifica non equivale a un audit indipendente del progetto.']
    ],
    file: 'life_deobfuscated.c / estratto',
    source: 'n = count_neighbours(row, col);\n\nscratch[row][col] = world[row][col]\n    ? (n == 2 || n == 3)\n    : (n == 3);',
    repo: 'https://github.com/mx101001/ioccc-glider-cannon',
    sourceUrl: 'https://github.com/mx101001/ioccc-glider-cannon/blob/main/life_deobfuscated.c'
  },
  ekos: {
    title: 'EKOS. Spazio al prodotto.', meta: '02 / FRONTEND / LUGLIO 2026',
    description: 'Una landing per l’audio high-end, costruita attraverso iterazioni con Lovable e tracciata su GitHub.',
    notes: [
      ['Il problema', 'Organizzare storia, immagini e specifiche di due prodotti in una pagina con un’identità visiva coerente.'],
      ['La struttura', 'Componenti React per hero, storia, prodotti e gallery. Un componente Product riutilizza lo stesso schema per immagini, descrizione e specifiche. TypeScript e classi responsive accompagnano il layout.'],
      ['Il processo', 'La cronologia documenta prototipazione con Lovable, commit generati e co-firmati, interventi sui loghi e richieste sui font. La conversione in WordPress/Colibri compare come richiesta: il repository esaminato contiene il frontend React, non un tema WordPress completato.'],
      ['La demo che hai provato', 'È una reinterpretazione del layout realizzata per questo portfolio. Ridimensionandola puoi osservare il passaggio tra componenti affiancati e impilati. Non è una riproduzione completa del sito EKOS.']
    ],
    file: 'src/routes/index.tsx / estratto',
    source: 'function Index() {\n  return (\n    <main className="min-h-screen bg-background text-foreground">\n      <Nav />\n      <Hero />\n      <Story />\n      <Products />\n      <Gallery />\n      <Closing />\n      <Footer />\n    </main>\n  );\n}',
    repo: 'https://github.com/mx101001/ekos-style-landing',
    sourceUrl: 'https://github.com/mx101001/ekos-style-landing/blob/main/src/routes/index.tsx'
  }
};
