const fs = require('fs');
const path = require('path');

const repoDir = path.join(__dirname, '../repositories');
const files = fs.readdirSync(repoDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(repoDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the ${file} literal bug
  content = content.replace(/Database error in \$\{file\}:/g, `Database error in ${file}:`);
  
  // Actually remove the mock arrays (using a better regex)
  content = content.replace(/\/\/\s*Mock fallback[\s\S]*?(?=class)/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${file}`);
});
