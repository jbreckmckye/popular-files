import process from 'process';
import madge from 'madge';

async function main () {
  const [ path ] = process.argv.slice(2);

  if (!path) {
    return console.error('❌ You must specify a path');
  }

  logBlock('Working:')
  console.info('⏳ Gathering module graph (this can take a while)');
  const parsed = await madge(path);
  console.info('✅ Gathered module graph');

  const graph = parsed.obj();
  const counts = analyse(graph);

  logBlock('Project import stats:');
  for (const [ module, count ] of counts) {
    console.info(`${count} imports of ${module}`);
  }
}

function analyse (graph: madge.MadgeModuleDependencyGraph): [string, number][] {
  const importCounts: Record<string, number> = {};
  const importLists = Object.values(graph);

  const addModule = (m: string) => {
    const count = importCounts[m] || 0;
    importCounts[m] = count + 1
  };

  importLists.forEach(
    list => list.forEach(
      addModule
    )
  );

  const allCounts = Object.entries(importCounts);
  return allCounts.sort(
    ([moduleA, countA], [moduleB, countB]) => countB - countA
  );
}

function logBlock (s: string) {
  console.log();
  console.log(s);
  console.log('-'.repeat(s.length));
}

main();
