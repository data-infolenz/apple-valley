const fs = require('fs');
const path = require('path');

const patches = [
  {
    file: path.join(
      process.cwd(),
      'node_modules',
      '@prisma',
      'studio-core',
      'dist',
      'data',
      'mysql-core',
      'index.js',
    ),
    oldText:
      'function Ae(o){let{query:e,tables:i,timezone:s}=o;return i.reduce((r,c)=>{let{schemas:n}=r,{columns:h,name:R,schema:a}=c,l=h.sort((t,u)=>t.position-u.position).reduce',
    newText:
      'function __codexParseColumns(o){return Array.isArray(o)?o:typeof o=="string"?JSON.parse(o):[]}function Ae(o){let{query:e,tables:i,timezone:s}=o;return i.reduce((r,c)=>{let{schemas:n}=r,{columns:h,name:R,schema:a}=c,l=__codexParseColumns(h).sort((t,u)=>t.position-u.position).reduce',
    marker: '__codexParseColumns(h)',
  },
  {
    file: path.join(
      process.cwd(),
      'node_modules',
      '@prisma',
      'studio-core',
      'dist',
      'data',
      'mysql-core',
      'index.cjs',
    ),
    oldText:
      'function Ls(t){let{query:e,tables:r,timezone:n}=t;return r.reduce((o,s)=>{let{schemas:a}=o,{columns:d,name:l,schema:u}=s,f=d.sort((c,N)=>c.position-N.position).reduce',
    newText:
      'function __codexParseColumns(t){return Array.isArray(t)?t:typeof t=="string"?JSON.parse(t):[]}function Ls(t){let{query:e,tables:r,timezone:n}=t;return r.reduce((o,s)=>{let{schemas:a}=o,{columns:d,name:l,schema:u}=s,f=__codexParseColumns(d).sort((c,N)=>c.position-N.position).reduce',
    marker: '__codexParseColumns(d)',
  },
  {
    file: path.join(process.cwd(), 'node_modules', 'prisma', 'build', 'studio.js'),
    oldText:
      'function bur(t){let{query:r,tables:i,timezone:s}=t;return i.reduce((l,c)=>{let{schemas:d}=l,{columns:p,name:w,schema:v}=c,x=p.sort((k,N)=>k.position-N.position).reduce',
    newText:
      'function __codexParseStudioColumns(t){return Array.isArray(t)?t:typeof t=="string"?JSON.parse(t):[]}function bur(t){let{query:r,tables:i,timezone:s}=t;return i.reduce((l,c)=>{let{schemas:d}=l,{columns:p,name:w,schema:v}=c,x=__codexParseStudioColumns(p).sort((k,N)=>k.position-N.position).reduce',
    marker: '__codexParseStudioColumns(p)',
  },
];

for (const patch of patches) {
  if (!fs.existsSync(patch.file)) {
    console.warn(`Prisma Studio patch skipped; file missing: ${patch.file}`);
    continue;
  }

  const current = fs.readFileSync(patch.file, 'utf8');

  if (current.includes(patch.marker)) {
    console.log(`Prisma Studio MariaDB patch already applied: ${path.basename(patch.file)}`);
    continue;
  }

  if (!current.includes(patch.oldText)) {
    throw new Error(`Prisma Studio patch target not found in ${patch.file}`);
  }

  fs.writeFileSync(patch.file, current.replace(patch.oldText, patch.newText));
  console.log(`Applied Prisma Studio MariaDB patch: ${path.basename(patch.file)}`);
}
