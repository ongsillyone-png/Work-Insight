import os
import re

repo_dir = r"d:\Work-Insight\repositories"
files = ["activity-master.repository.js", "activity.repository.js", "category.repository.js", "group.repository.js", "location.repository.js"]

for file in files:
    path = os.path.join(repo_dir, file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Remove mock variable declarations
    content = re.sub(r'// Mock fallback.*?\nconst mock[A-Za-z]+ = \[[^;]+\];\n\n', '', content, flags=re.DOTALL)
    content = re.sub(r'// Mock fallback.*?\nconst mock[A-Za-z]+ = \[[^;]+\];\n', '', content, flags=re.DOTALL)
    
    # 2. Replace catch blocks
    def replace_catch(match):
        return f"catch (err) {{\n      console.error(`Database error in {file}:`, err);\n      throw err;\n    }}"
        
    content = re.sub(r'catch\s*\(err\)\s*\{[^{}]*?console\.warn[^{}]*?return\s+(mock[A-Za-z]+(\.find[^{}]*\})?|newLog|newLoc|newGroup|newCategory)[^{}]*?\}', replace_catch, content, flags=re.DOTALL)
    content = re.sub(r'catch\s*\(err\)\s*\{[^{}]*?console\.warn[^{}]*?(mock[A-Za-z]+\.push|mock[A-Za-z]+\.splice)[^{}]*?return[^{}]*?\}', replace_catch, content, flags=re.DOTALL)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {file}")
